#!/usr/bin/env python3
"""Run multi-drone startup and broken-link stress tests over TeleGC + drone Wi-Fi."""

from __future__ import annotations

import argparse
import json
import queue
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import URLError

from drone_wifi_debug import auth_header, normalize_base_url, post_command
from sgc_live_debug import SerialPeer


ONLINE_STATES = {"online", "live"}
REJOIN_EVENTS = {
    "join_request_received",
    "assign_sent",
    "join_ack_received",
    "assignment_completed",
    "telemetry_period_locked",
    "post_bind_first_telemetry",
}
REJOIN_TYPES = {"assignment_event", "bind_progress_event", "scanner_event", "search_event", "telemetry_rebind_event"}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


def perf_ms() -> float:
    return time.perf_counter() * 1000.0


def nested_json(event: dict[str, Any]) -> dict[str, Any]:
    value = event.get("json")
    return value if isinstance(value, dict) else {}


def parse_response_lines(text: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        try:
            parsed = json.loads(stripped)
        except json.JSONDecodeError:
            rows.append({"raw": stripped})
            continue
        if isinstance(parsed, dict):
            rows.append(parsed)
        else:
            rows.append({"raw": stripped})
    return rows


@dataclass(frozen=True)
class NodeSpec:
    node_id: int
    base_url: str


class MultiDroneStressRunner:
    def __init__(self, args: argparse.Namespace, nodes: list[NodeSpec]) -> None:
        self.args = args
        self.nodes = nodes
        self.node_ids = [node.node_id for node in nodes]
        self.events: queue.Queue[dict[str, Any]] = queue.Queue()
        self.peer = SerialPeer("telegc", args.telegc, args.baud, self.events)
        self.log_path = Path(args.log)
        self.summary_path = Path(args.summary)
        self.log_handle = None
        self.records: list[dict[str, Any]] = []
        self.command_counter = 0
        self.sent_commands: dict[str, dict[str, Any]] = {}
        self.command_acks: dict[str, dict[str, Any]] = {}
        self.rejected_commands: list[dict[str, Any]] = []
        self.latest_telemetry: dict[int, dict[str, Any]] = {}
        self.latest_link_state: dict[int, str] = {}
        self.preflight_result: dict[str, Any] = {}
        self.startup_result: dict[str, Any] = {}
        self.manual_bind_results: list[dict[str, Any]] = []
        self.rf_loss_only_results: list[dict[str, Any]] = []
        self.broken_results: list[dict[str, Any]] = []
        self.transport: dict[str, Any] = {
            "malformedSerialJson": 0,
            "suspiciousSerialFragments": 0,
            "interGcForwardFailed": 0,
            "magcAckTimeouts": 0,
            "maxReliableQueueDepth": 0,
            "maxEventOutboxDepth": 0,
            "eventDropCounters": {},
            "recoveryBudgetUsed": 0,
            "recoveryBudgetDenied": 0,
            "healthyServiceProtected": 0,
            "receiverBudgetOverloaded": 0,
        }

    def __enter__(self) -> "MultiDroneStressRunner":
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        self.log_handle = self.log_path.open("w", encoding="utf-8", newline="\n")
        self.peer.start()
        return self

    def __exit__(self, exc_type: object, exc: object, tb: object) -> None:
        self.drain(0.25)
        self.peer.close()
        self.drain(0.25)
        if self.log_handle is not None:
            self.log_handle.close()

    def next_command_id(self, prefix: str) -> str:
        self.command_counter += 1
        return f"multi-stress-{prefix}-{self.command_counter:04d}"

    def write_event(self, event: dict[str, Any]) -> None:
        event.setdefault("timestamp", utc_now_iso())
        event.setdefault("pcPerfMs", perf_ms())
        self.records.append(event)
        if self.log_handle is not None:
            self.log_handle.write(json.dumps(event, separators=(",", ":")) + "\n")
            self.log_handle.flush()

    def marker(self, event: str, **fields: Any) -> None:
        self.write_event({
            "kind": "marker",
            "source": "tool",
            "raw": event,
            "json": {"type": "bench_marker", "bench": "multi_drone_stress", "event": event, **fields},
        })

    def register_command(self, command_id: str, source: str, command: str, target: str | None = None) -> None:
        self.sent_commands[command_id] = {
            "source": source,
            "target": target,
            "command": command,
            "sentPerfMs": perf_ms(),
        }

    def observe(self, event: dict[str, Any]) -> None:
        msg = nested_json(event)
        raw = str(event.get("raw") or "")
        if event.get("kind") == "rx" and event.get("source") == "telegc" and not msg:
            stripped = raw.strip()
            if stripped.startswith("{"):
                self.transport["malformedSerialJson"] += 1
            elif "{" in stripped or "}" in stripped:
                self.transport["suspiciousSerialFragments"] += 1
        event_type = msg.get("type")
        if event_type == "command_ack":
            command_id = str(msg.get("commandId") or "")
            if command_id:
                self.command_acks[command_id] = {
                    "ack": msg,
                    "pcPerfMs": event.get("pcPerfMs", perf_ms()),
                    "source": event.get("source"),
                }
            if msg.get("accepted") is False:
                self.rejected_commands.append(msg)
            if msg.get("reason") == "magc_ack_timeout":
                self.transport["magcAckTimeouts"] += 1
        elif event_type == "drone_telemetry" and isinstance(msg.get("nodeId"), int):
            node_id = int(msg["nodeId"])
            self.latest_telemetry[node_id] = {
                "pcPerfMs": float(event.get("pcPerfMs", perf_ms())),
                "sequenceId": msg.get("sequenceId"),
                "msg": msg,
            }
            self.latest_link_state[node_id] = "online"
        elif event_type == "drone_link_status" and isinstance(msg.get("nodeId"), int):
            self.latest_link_state[int(msg["nodeId"])] = str(msg.get("state") or "")
        elif event_type in {"gc_status", "inter_gc_status"}:
            if isinstance(msg.get("recoveryBudgetUsedCount"), int):
                self.transport["recoveryBudgetUsed"] = max(
                    self.transport["recoveryBudgetUsed"],
                    int(msg["recoveryBudgetUsedCount"]),
                )
            if isinstance(msg.get("recoveryBudgetDeniedCount"), int):
                self.transport["recoveryBudgetDenied"] = max(
                    self.transport["recoveryBudgetDenied"],
                    int(msg["recoveryBudgetDeniedCount"]),
                )
            if isinstance(msg.get("healthyServiceProtectedCount"), int):
                self.transport["healthyServiceProtected"] = max(
                    self.transport["healthyServiceProtected"],
                    int(msg["healthyServiceProtectedCount"]),
                )
            if msg.get("receiverOverloaded") is True:
                self.transport["receiverBudgetOverloaded"] += 1
            for key in ("reliableQueueDepth", "interGcReliableQueueDepth"):
                if isinstance(msg.get(key), int):
                    self.transport["maxReliableQueueDepth"] = max(self.transport["maxReliableQueueDepth"], int(msg[key]))
            for key in ("eventOutboxDepth", "interGcEventOutboxDepth"):
                if isinstance(msg.get(key), int):
                    self.transport["maxEventOutboxDepth"] = max(self.transport["maxEventOutboxDepth"], int(msg[key]))
            for key, value in msg.items():
                key_l = str(key).lower()
                if isinstance(value, int) and ("drop" in key_l or "dropped" in key_l):
                    drops = self.transport["eventDropCounters"]
                    drops[key] = max(int(drops.get(key, 0)), int(value))
        if event_type == "inter_gc_forward_failed":
            self.transport["interGcForwardFailed"] += 1
        if event_type == "scanner_event":
            event = msg.get("event")
            if event == "recovery_budget_used":
                self.transport["recoveryBudgetUsed"] += 1
            elif event == "recovery_budget_denied":
                self.transport["recoveryBudgetDenied"] += 1
            elif event == "healthy_service_protected":
                self.transport["healthyServiceProtected"] += 1
            elif event == "receiver_budget_overloaded":
                self.transport["receiverBudgetOverloaded"] += 1

    def drain(self, seconds: float) -> None:
        deadline = time.time() + max(0.0, seconds)
        while time.time() < deadline:
            timeout = max(0.01, min(0.2, deadline - time.time()))
            try:
                event = self.events.get(timeout=timeout)
            except queue.Empty:
                continue
            self.write_event(event)
            self.observe(event)

    def send_gc_command(self, target: str, command: str, **fields: Any) -> str:
        command_id = str(fields.pop("commandId", self.next_command_id(f"{target}-{command}")))
        payload = {
            "type": "command",
            "target": target,
            "command": command,
            "commandId": command_id,
            **fields,
        }
        self.register_command(command_id, "telegc_serial", command, target)
        self.peer.send_json(payload)
        return command_id

    def drone_payload(self, command: str, command_id: str, **fields: Any) -> dict[str, Any]:
        payload = {"type": "command", "command": command, "commandId": command_id}
        payload.update(fields)
        return payload

    def post_drone_command(self, node: NodeSpec, payload: dict[str, Any]) -> list[dict[str, Any]]:
        payload.setdefault("type", "command")
        payload.setdefault("commandId", self.next_command_id(f"drone{node.node_id}-{payload.get('command', 'cmd')}"))
        command_id = str(payload["commandId"])
        self.register_command(command_id, f"drone{node.node_id}_wifi", str(payload.get("command") or ""), None)
        command = str(payload.get("command") or "")
        safe_to_retry = command in {"get_status", "debug_reboot", "debug_restart_join"}
        max_attempts = 1 + (self.args.http_retries if safe_to_retry else 0)
        rows: list[dict[str, Any]] = []
        for attempt in range(1, max_attempts + 1):
            tx_payload = dict(payload)
            tx_payload["httpAttempt"] = attempt
            self.write_event({
                "kind": "tx",
                "source": f"drone{node.node_id}_wifi",
                "raw": json.dumps(tx_payload, separators=(",", ":")),
                "json": tx_payload,
            })
            start_ms = perf_ms()
            try:
                status, text = post_command(
                    node.base_url,
                    payload,
                    self.args.http_timeout,
                    auth_header(self.args.user, self.args.password),
                )
                rows = parse_response_lines(text)
            except (TimeoutError, OSError, URLError) as exc:
                status = 0
                rows = [{"type": "http_error", "commandId": command_id, "error": str(exc), "httpAttempt": attempt}]
            end_ms = perf_ms()
            for row in rows:
                event = {
                    "kind": "rx",
                    "source": f"drone{node.node_id}_wifi",
                    "httpStatus": status,
                    "httpRttMs": round(end_ms - start_ms, 3),
                    "raw": json.dumps(row, separators=(",", ":")) if "raw" not in row else str(row["raw"]),
                    "json": row if "raw" not in row else {},
                }
                self.write_event(event)
                self.observe(event)
            if any(row.get("type") == "command_ack" for row in rows) or status > 0:
                break
            if attempt < max_attempts:
                self.marker("drone_wifi_retry",
                            nodeId=node.node_id,
                            command=command,
                            commandId=command_id,
                            attempt=attempt + 1)
                self.drain(self.args.http_retry_delay_s)
        return rows

    def wait_for_ack(self, command_id: str, timeout_s: float) -> dict[str, Any] | None:
        deadline = time.time() + timeout_s
        while time.time() < deadline:
            if command_id in self.command_acks:
                return self.command_acks[command_id]["ack"]
            self.drain(0.1)
        return self.command_acks.get(command_id, {}).get("ack")

    def wait_for_nodes_fresh_after(self, node_ids: list[int], after_ms: float, timeout_s: float, freshness_s: float) -> bool:
        deadline = time.time() + timeout_s
        while time.time() < deadline:
            self.drain(0.2)
            if all(
                self.latest_telemetry.get(node_id, {}).get("pcPerfMs", 0.0) >= after_ms and
                perf_ms() - float(self.latest_telemetry.get(node_id, {}).get("pcPerfMs", 0.0)) <= freshness_s * 1000.0
                for node_id in node_ids
            ):
                return True
        return False

    def wait_for_nodes_fresh_after_each(self,
                                        after_by_node: dict[int, float],
                                        timeout_s: float,
                                        freshness_s: float) -> bool:
        deadline = time.time() + timeout_s
        while time.time() < deadline:
            self.drain(0.2)
            ok = True
            for node_id, after_ms in after_by_node.items():
                latest = self.latest_telemetry.get(node_id, {})
                latest_ms = float(latest.get("pcPerfMs", 0.0))
                if latest_ms < after_ms or perf_ms() - latest_ms > freshness_s * 1000.0:
                    ok = False
                    break
            if ok:
                return True
        return False

    def command_ack_state(self, command_id: str) -> str:
        ack = self.command_acks.get(command_id, {}).get("ack")
        if not ack:
            return "missing"
        if ack.get("accepted") is False:
            return f"rejected:{ack.get('reason') or '-'}"
        return "accepted"

    def compact_drone_status(self, status: dict[str, Any], since_ms: float | None = None) -> dict[str, Any]:
        sample: dict[str, Any] = {
            "nodeId": status.get("nodeId"),
            "state": status.get("state"),
            "joinMode": status.get("joinMode"),
            "joinHeld": status.get("joinHeld"),
            "telemetryPaused": status.get("telemetryPaused"),
            "joinAttemptCount": status.get("joinAttemptCount"),
            "joinBackoffKind": status.get("joinBackoffKind"),
            "joinBackoffMs": status.get("joinBackoffMs"),
            "joinRequestTxCount": status.get("joinRequestTxCount"),
            "joinRequestLbtBlockedCount": status.get("joinRequestLbtBlockedCount"),
            "joinRequestTxFailedCount": status.get("joinRequestTxFailedCount"),
            "joinRequestSentMs": status.get("joinRequestSentMs"),
            "nextActionMs": status.get("nextActionMs"),
            "gcMillis": status.get("gcMillis"),
            "assignmentNodeId": status.get("assignmentNodeId"),
            "channelIndex": status.get("channelIndex"),
            "frequencyMhz": status.get("frequencyMhz"),
        }
        if since_ms is not None:
            sample["relPcMs"] = round(perf_ms() - since_ms, 1)
        return {key: value for key, value in sample.items() if value is not None}

    def poll_drone_status(self, node: NodeSpec, phase: str, since_ms: float) -> dict[str, Any] | None:
        command_id = self.next_command_id(f"poll-drone{node.node_id}-{phase}")
        rows = self.post_drone_command(node, self.drone_payload("get_status", command_id))
        status = next((row for row in rows if row.get("type") == "drone_debug_status"), None)
        if not isinstance(status, dict):
            self.marker(
                "drone_status_poll",
                targetNodeId=node.node_id,
                phase=phase,
                commandId=command_id,
                ack=self.command_ack_state(command_id),
                statusPresent=False,
                relPcMs=round(perf_ms() - since_ms, 1),
            )
            return None
        sample = self.compact_drone_status(status, since_ms)
        self.marker(
            "drone_status_poll",
            targetNodeId=node.node_id,
            phase=phase,
            commandId=command_id,
            ack=self.command_ack_state(command_id),
            statusPresent=True,
            status=sample,
        )
        return sample

    def run_preflight(self) -> None:
        self.marker("preflight_start", nodeIds=self.node_ids, telegc=self.args.telegc)
        drone_rows: dict[int, list[dict[str, Any]]] = {}
        drone_ok: dict[int, bool] = {}
        for node in self.nodes:
            command_id = self.next_command_id(f"preflight-drone{node.node_id}")
            rows = self.post_drone_command(node, self.drone_payload("get_status", command_id))
            drone_rows[node.node_id] = rows
            status = next((row for row in rows if row.get("type") == "drone_debug_status"), None)
            drone_ok[node.node_id] = bool(status and int(status.get("nodeId", -1)) == node.node_id)

        self.drain(self.args.startup_delay)
        telegc_status_id = self.send_gc_command("telegc", "get_status")
        magc_status_id = self.send_gc_command("magc", "get_status")
        telegc_ack = self.wait_for_ack(telegc_status_id, self.args.command_timeout)
        magc_ack = self.wait_for_ack(magc_status_id, self.args.command_timeout)
        self.preflight_result = {
            "droneOk": drone_ok,
            "telegcStatusAck": bool(telegc_ack and telegc_ack.get("accepted") is not False),
            "magcStatusAck": bool(magc_ack and magc_ack.get("accepted") is not False),
            "droneRows": {node_id: len(rows) for node_id, rows in drone_rows.items()},
        }
        self.marker("preflight_complete", **self.preflight_result)

    def run_startup_stress(self) -> None:
        self.marker("startup_reset_start", nodeIds=self.node_ids, startupDroneCommand=self.args.startup_drone_command)
        start_ms = perf_ms()
        start_index = len(self.records)
        clear_id = self.send_gc_command("magc", "clear_all_assignments")
        clear_ack = self.wait_for_ack(clear_id, self.args.command_timeout)
        drone_command_ids: dict[int, str] = {}
        startup_after_by_node: dict[int, float] = {}
        for node in self.nodes:
            command_id = self.next_command_id(f"startup-drone{node.node_id}")
            drone_command_ids[node.node_id] = command_id
            command_sent_ms = perf_ms()
            if self.args.startup_drone_command == "reboot":
                payload = self.drone_payload("debug_reboot", command_id, bootJoinMode="auto", delayMs=250)
                startup_after_by_node[node.node_id] = command_sent_ms + 1500.0
            else:
                payload = self.drone_payload("debug_restart_join", command_id, hold=False)
                startup_after_by_node[node.node_id] = command_sent_ms + 200.0
            self.post_drone_command(node, payload)

        all_online = self.wait_for_nodes_fresh_after_each(
            startup_after_by_node,
            self.args.startup_timeout,
            self.args.freshness_s,
        )
        end_ms = perf_ms()
        rows = self.records[start_index:]
        per_node: dict[int, dict[str, Any]] = {}
        for node_id in self.node_ids:
            telemetry_rows = [
                row for row in rows
                if nested_json(row).get("type") == "drone_telemetry" and
                nested_json(row).get("nodeId") == node_id and
                float(row.get("pcPerfMs", 0.0)) >= startup_after_by_node.get(node_id, start_ms)
            ]
            first_telemetry_ms = float(telemetry_rows[0]["pcPerfMs"]) if telemetry_rows else None
            milestones = self.collect_rejoin_milestones(rows, node_id)
            latency_ms = None if first_telemetry_ms is None else first_telemetry_ms - startup_after_by_node.get(node_id, start_ms)
            per_node[node_id] = {
                "startupCommandId": drone_command_ids[node_id],
                "startupCommandAck": self.command_ack_state(drone_command_ids[node_id]),
                "firstTelemetryMs": None if latency_ms is None else round(latency_ms, 1),
                "targetFirstOnline30s": latency_ms is not None and latency_ms <= self.args.first_online_target * 1000.0,
                "targetAllOnline60s": latency_ms is not None and latency_ms <= self.args.all_online_target * 1000.0,
                "milestones": milestones,
                "passed": latency_ms is not None,
            }
        failures: list[str] = []
        if not clear_ack or clear_ack.get("accepted") is False:
            failures.append("missing_or_rejected_magc_clear_all_ack")
        if not all_online:
            failures.append("not_all_nodes_online_before_startup_timeout")
        self.startup_result = {
            "passed": not failures,
            "failures": failures,
            "clearCommandId": clear_id,
            "clearAck": self.command_ack_state(clear_id),
            "durationMs": round(end_ms - start_ms, 1),
            "perNode": per_node,
        }
        self.marker("startup_reset_complete", **self.startup_result)

    def collect_rejoin_milestones(self, rows: list[dict[str, Any]], node_id: int) -> list[str]:
        milestones: list[str] = []
        for row in rows:
            msg = nested_json(row)
            if msg.get("type") not in REJOIN_TYPES:
                continue
            if isinstance(msg.get("nodeId"), int) and int(msg["nodeId"]) != node_id:
                continue
            event_name = str(msg.get("event") or msg.get("phase") or "")
            if event_name in REJOIN_EVENTS and event_name not in milestones:
                milestones.append(event_name)
        return milestones

    def rebind_state_after(self, node_id: int, after_ms: float) -> dict[str, Any]:
        rows = [row for row in self.records if float(row.get("pcPerfMs", 0.0)) >= after_ms]
        milestone_times: dict[str, float] = {}
        for row in rows:
            msg = nested_json(row)
            if msg.get("type") not in REJOIN_TYPES:
                continue
            if isinstance(msg.get("nodeId"), int) and int(msg["nodeId"]) != node_id:
                continue
            event_name = str(msg.get("event") or msg.get("phase") or "")
            if event_name in REJOIN_EVENTS and event_name not in milestone_times:
                milestone_times[event_name] = float(row.get("pcPerfMs", 0.0))
        required = {"join_request_received", "assign_sent", "join_ack_received"}
        completion_events = {"assignment_completed", "post_bind_first_telemetry", "telemetry_period_locked"}
        has_required = required.issubset(milestone_times)
        has_completion = any(event in milestone_times for event in completion_events)
        bind_reference_ms = milestone_times.get("join_ack_received")
        telemetry_after_rebind = [
            row for row in rows
            if nested_json(row).get("type") == "drone_telemetry" and
            nested_json(row).get("nodeId") == node_id and
            float(row.get("pcPerfMs", 0.0)) >= after_ms
        ]
        milestones = [event for event, _ in sorted(milestone_times.items(), key=lambda item: item[1])]
        return {
            "complete": bool(has_required and has_completion and telemetry_after_rebind),
            "milestones": milestones,
            "milestoneTimes": milestone_times,
            "bindReferenceMs": bind_reference_ms or after_ms,
            "firstTelemetryAfterBindMs": (
                float(telemetry_after_rebind[0]["pcPerfMs"])
                if telemetry_after_rebind else None
            ),
        }

    def wait_for_rebind_after(self,
                              node_id: int,
                              after_ms: float,
                              timeout_s: float,
                              poll_node: NodeSpec | None = None,
                              poll_phase: str = "rebind") -> dict[str, Any]:
        deadline = time.time() + timeout_s
        poll_interval = max(0.0, float(getattr(self.args, "rebind_drone_status_poll_s", 0.0)))
        next_poll = time.time() + poll_interval if poll_node is not None and poll_interval > 0 else float("inf")
        poll_samples: list[dict[str, Any]] = []
        state = self.rebind_state_after(node_id, after_ms)
        while time.time() < deadline:
            if state.get("complete"):
                state["droneStatusPolls"] = poll_samples
                return state
            if poll_node is not None and time.time() >= next_poll:
                sample = self.poll_drone_status(poll_node, poll_phase, after_ms)
                if sample is not None:
                    poll_samples.append(sample)
                next_poll = time.time() + poll_interval
            self.drain(0.2)
            state = self.rebind_state_after(node_id, after_ms)
        state["droneStatusPolls"] = poll_samples
        return state

    def sequence_gaps(self, rows: list[dict[str, Any]], node_id: int) -> list[dict[str, int]]:
        gaps: list[dict[str, int]] = []
        prev_seq: int | None = None
        for row in rows:
            msg = nested_json(row)
            if msg.get("type") != "drone_telemetry" or msg.get("nodeId") != node_id:
                continue
            seq = msg.get("sequenceId")
            if not isinstance(seq, int):
                continue
            if prev_seq is not None:
                expected = (prev_seq + 1) & 0xFF
                if seq != expected:
                    missed = (seq - prev_seq - 1) & 0xFF
                    gaps.append({"from": prev_seq, "to": seq, "missed": missed})
            prev_seq = seq
        return gaps

    def telemetry_gap_time_ms(self, row: dict[str, Any]) -> float:
        msg = nested_json(row)
        gc_millis = msg.get("gcMillis")
        if isinstance(gc_millis, (int, float)):
            return float(gc_millis)
        return float(row.get("pcPerfMs", 0.0))

    def max_telemetry_gap_ms(self, rows: list[dict[str, Any]], node_id: int, start_ms: float, end_ms: float) -> float | None:
        telemetry_rows = [
            row
            for row in rows
            if nested_json(row).get("type") == "drone_telemetry" and nested_json(row).get("nodeId") == node_id
        ]
        prior_rows = [
            row
            for row in self.records
            if float(row.get("pcPerfMs", 0.0)) < start_ms and
            nested_json(row).get("type") == "drone_telemetry" and
            nested_json(row).get("nodeId") == node_id
        ]
        if prior_rows:
            telemetry_rows.insert(0, max(prior_rows, key=lambda row: float(row.get("pcPerfMs", 0.0))))
        if len(telemetry_rows) < 2:
            return None
        points = sorted(self.telemetry_gap_time_ms(row) for row in telemetry_rows)
        return max(points[index + 1] - points[index] for index in range(len(points) - 1))

    def non_online_events(self, rows: list[dict[str, Any]], node_id: int) -> list[dict[str, Any]]:
        result: list[dict[str, Any]] = []
        for row in rows:
            msg = nested_json(row)
            if msg.get("type") != "drone_link_status" or msg.get("nodeId") != node_id:
                continue
            state = str(msg.get("state") or "")
            if state not in ONLINE_STATES:
                result.append({
                    "state": state,
                    "reason": msg.get("reason"),
                    "atMs": round(float(row.get("pcPerfMs", 0.0)), 1),
                })
        return result

    def rejoin_events(self, rows: list[dict[str, Any]], node_id: int) -> list[dict[str, Any]]:
        result: list[dict[str, Any]] = []
        for row in rows:
            msg = nested_json(row)
            if msg.get("type") not in REJOIN_TYPES:
                continue
            if isinstance(msg.get("nodeId"), int) and int(msg["nodeId"]) != node_id:
                continue
            event_name = str(msg.get("event") or msg.get("phase") or "")
            if event_name in REJOIN_EVENTS:
                result.append({
                    "event": event_name,
                    "atMs": round(float(row.get("pcPerfMs", 0.0)), 1),
                })
        return result

    def short_loss_events(self, rows: list[dict[str, Any]], node_id: int) -> list[str]:
        events: list[str] = []
        for row in rows:
            msg = nested_json(row)
            if msg.get("type") != "telemetry_rebind_event" or msg.get("nodeId") != node_id:
                continue
            event_name = str(msg.get("event") or "")
            if event_name.startswith("short_loss_") and event_name not in events:
                events.append(event_name)
        return events

    def wait_stable_online(self, timeout_s: float) -> bool:
        return self.wait_for_nodes_fresh_after(self.node_ids, 0.0, timeout_s, self.args.freshness_s)

    def run_manual_bind_non_disruption_test(self) -> None:
        self.wait_stable_online(self.args.pre_loss_stable_timeout)
        self.marker("manual_bind_abuse_start", nodeIds=self.node_ids, count=self.args.manual_bind_count)
        start_ms = perf_ms()
        start_index = len(self.records)
        bind_command_ids: list[str] = []
        cancel_command_ids: list[str] = []
        for index in range(self.args.manual_bind_count):
            bind_id = self.send_gc_command("magc", "start_search")
            bind_command_ids.append(bind_id)
            self.wait_for_ack(bind_id, self.args.command_timeout)
            self.drain(self.args.manual_bind_hold_s)
            cancel_id = self.send_gc_command("magc", "cancel_search")
            cancel_command_ids.append(cancel_id)
            self.wait_for_ack(cancel_id, self.args.command_timeout)
            self.drain(self.args.manual_bind_gap_s)
            self.marker("manual_bind_abuse_cycle", cycle=index + 1, bindCommandId=bind_id, cancelCommandId=cancel_id)
        self.drain(self.args.manual_bind_observe_s)
        end_ms = perf_ms()
        rows = self.records[start_index:]
        per_node: dict[int, dict[str, Any]] = {}
        failures: list[str] = []
        for node_id in self.node_ids:
            non_events = self.non_online_events(rows, node_id)
            max_gap = self.max_telemetry_gap_ms(rows, node_id, start_ms, end_ms)
            passed = not non_events and max_gap is not None and max_gap <= self.args.non_target_max_gap_s * 1000.0
            per_node[node_id] = {
                "maxTelemetryGapMs": None if max_gap is None else round(max_gap, 1),
                "nonOnlineEvents": non_events,
                "passed": passed,
            }
            if not passed:
                failures.append(f"node_{node_id}_affected_by_bind")
        for command_id in bind_command_ids + cancel_command_ids:
            if self.command_ack_state(command_id) != "accepted":
                failures.append(f"command_not_accepted:{command_id}")
        result = {
            "passed": not failures,
            "failures": failures,
            "bindCommandIds": bind_command_ids,
            "cancelCommandIds": cancel_command_ids,
            "perNode": per_node,
            "durationMs": round(end_ms - start_ms, 1),
        }
        self.manual_bind_results.append(result)
        self.marker("manual_bind_complete", **result)

    def run_rf_loss_only_test(self, target: NodeSpec, cycles: int, trial_index: int) -> None:
        self.wait_stable_online(self.args.pre_loss_stable_timeout)
        non_targets = [node_id for node_id in self.node_ids if node_id != target.node_id]
        self.marker("rf_loss_only_start",
                    targetNodeId=target.node_id,
                    nonTargets=non_targets,
                    cycles=cycles,
                    trial=trial_index)
        start_ms = perf_ms()
        start_index = len(self.records)
        command_id = self.next_command_id(f"rf-loss-only-node{target.node_id}-{cycles}")
        self.post_drone_command(
            target,
            self.drone_payload("debug_simulate_rf_loss", command_id, cycles=cycles),
        )
        self.drain(self.args.rf_loss_only_wait_s)
        recovered = self.wait_for_nodes_fresh_after([target.node_id], start_ms, self.args.rf_loss_recover_timeout, self.args.freshness_s)
        end_ms = perf_ms()
        rows = self.records[start_index:]
        target_non_events = self.non_online_events(rows, target.node_id)
        target_gaps = self.sequence_gaps(rows, target.node_id)
        target_rejoin_events = self.rejoin_events(rows, target.node_id)
        short_loss_events = self.short_loss_events(rows, target.node_id)
        non_target_results: dict[int, dict[str, Any]] = {}
        failures: list[str] = []
        for node_id in non_targets:
            non_events = self.non_online_events(rows, node_id)
            max_gap = self.max_telemetry_gap_ms(rows, node_id, start_ms, end_ms)
            passed = not non_events and max_gap is not None and max_gap <= self.args.non_target_max_gap_s * 1000.0
            non_target_results[node_id] = {
                "maxTelemetryGapMs": None if max_gap is None else round(max_gap, 1),
                "nonOnlineEvents": non_events,
                "passed": passed,
            }
            if not passed:
                failures.append(f"non_target_{node_id}_not_stable")
        if self.command_ack_state(command_id) != "accepted":
            failures.append("rf_loss_command_not_accepted")
        if not recovered:
            failures.append("target_not_fresh_after_rf_loss")
        if cycles <= 8 and target_non_events:
            failures.append("target_terminal_state_during_short_rf_loss")
        if cycles <= 8 and target_rejoin_events:
            failures.append("target_rebound_during_short_rf_loss")
        result = {
            "targetNodeId": target.node_id,
            "cycles": cycles,
            "trial": trial_index,
            "passed": not failures,
            "failures": failures,
            "commandId": command_id,
            "ack": self.command_ack_state(command_id),
            "targetRecoveredFresh": recovered,
            "targetNonOnlineEvents": target_non_events,
            "targetSequenceGaps": target_gaps,
            "targetRejoinEvents": target_rejoin_events,
            "shortLossEvents": short_loss_events,
            "nonTargetStability": non_target_results,
        }
        self.rf_loss_only_results.append(result)
        self.marker("rf_loss_only_complete", **result)
        self.drain(self.args.between_tests_s)

    def run_broken_link_test(self, target: NodeSpec) -> None:
        non_targets = [node_id for node_id in self.node_ids if node_id != target.node_id]
        self.wait_stable_online(self.args.pre_loss_stable_timeout)
        self.marker("broken_link_start", targetNodeId=target.node_id, nonTargets=non_targets, lossCycles=self.args.loss_cycles)
        start_ms = perf_ms()
        start_index = len(self.records)

        loss_id = self.next_command_id(f"rf-loss-node{target.node_id}")
        loss_rows = self.post_drone_command(
            target,
            self.drone_payload("debug_simulate_rf_loss", loss_id, cycles=self.args.loss_cycles),
        )
        self.marker("rf_loss_command_sent", targetNodeId=target.node_id, commandId=loss_id)
        self.drain(self.args.loss_wait_s)

        restart_id = self.next_command_id(f"restart-join-node{target.node_id}")
        self.post_drone_command(
            target,
            self.drone_payload("debug_restart_join", restart_id, hold=False),
        )
        restart_ms = perf_ms()
        self.marker("restart_join_sent", targetNodeId=target.node_id, commandId=restart_id)

        rebind_state = self.wait_for_rebind_after(
            target.node_id,
            restart_ms,
            self.args.rebind_timeout,
            poll_node=target,
            poll_phase="broken_link_rebind",
        )
        end_ms = perf_ms()
        rows = self.records[start_index:]
        target_rows_after_restart = [row for row in rows if float(row.get("pcPerfMs", 0.0)) >= restart_ms]
        milestones = list(rebind_state.get("milestones") or self.collect_rejoin_milestones(target_rows_after_restart, target.node_id))
        target_gaps = self.sequence_gaps(rows, target.node_id)
        simulated_sequence_ids = [
            nested_json(row).get("sequenceId")
            for row in self.records[start_index:]
            if nested_json(row).get("type") == "drone_debug_event" and
            nested_json(row).get("event") == "telemetry_rf_loss_simulated" and
            nested_json(row).get("nodeId") == target.node_id
        ]
        if not simulated_sequence_ids:
            simulated_sequence_ids = [
                row.get("sequenceId")
                for row in loss_rows
                if row.get("event") == "telemetry_rf_loss_simulated"
            ]
        non_target_results: dict[int, dict[str, Any]] = {}
        for node_id in non_targets:
            non_events = self.non_online_events(rows, node_id)
            max_gap = self.max_telemetry_gap_ms(rows, node_id, start_ms, end_ms)
            non_target_results[node_id] = {
                "maxTelemetryGapMs": None if max_gap is None else round(max_gap, 1),
                "nonOnlineEvents": non_events,
                "passed": not non_events and max_gap is not None and max_gap <= self.args.non_target_max_gap_s * 1000.0,
            }

        failures: list[str] = []
        if self.command_ack_state(loss_id) != "accepted":
            failures.append("rf_loss_command_not_accepted")
        if self.command_ack_state(restart_id) != "accepted":
            failures.append("restart_join_command_not_accepted")
        if not rebind_state.get("complete"):
            failures.append("target_not_online_before_rebind_timeout")
        if not {"join_request_received", "assign_sent", "join_ack_received"}.issubset(set(milestones)):
            failures.append("missing_rebind_milestones_after_restart_join")
        for node_id, item in non_target_results.items():
            if not item["passed"]:
                failures.append(f"non_target_{node_id}_not_stable")

        result = {
            "targetNodeId": target.node_id,
            "passed": not failures,
            "failures": failures,
            "lossCycles": self.args.loss_cycles,
            "rfLossCommandId": loss_id,
            "rfLossAck": self.command_ack_state(loss_id),
            "restartCommandId": restart_id,
            "restartAck": self.command_ack_state(restart_id),
            "simulatedSequenceIds": simulated_sequence_ids,
            "observedSequenceGaps": target_gaps,
            "rebindMilestones": milestones,
            "downtimeFromLossMs": round(end_ms - start_ms, 1),
            "restartToTelemetryMs": (
                round(float(rebind_state["firstTelemetryAfterBindMs"]) - restart_ms, 1)
                if rebind_state.get("firstTelemetryAfterBindMs") is not None else None
            ),
            "joinAckToTelemetryMs": (
                round(float(rebind_state["firstTelemetryAfterBindMs"]) - float(rebind_state["milestoneTimes"]["join_ack_received"]), 1)
                if rebind_state.get("firstTelemetryAfterBindMs") is not None and
                isinstance(rebind_state.get("milestoneTimes"), dict) and
                "join_ack_received" in rebind_state["milestoneTimes"] else None
            ),
            "targetDroneStatusPolls": rebind_state.get("droneStatusPolls") or [],
            "nonTargetStability": non_target_results,
        }
        self.broken_results.append(result)
        self.marker("broken_link_complete", **result)
        self.drain(self.args.between_tests_s)

    def transport_clean(self) -> tuple[bool, list[str]]:
        failures: list[str] = []
        if self.rejected_commands:
            failures.append("rejected_command")
        missing = [
            command_id for command_id, meta in self.sent_commands.items()
            if command_id not in self.command_acks and meta.get("command") != "debug_reboot"
        ]
        if missing:
            failures.append(f"missing_command_ack:{len(missing)}")
        if self.transport["interGcForwardFailed"]:
            failures.append("inter_gc_forward_failed")
        if self.transport["magcAckTimeouts"]:
            failures.append("magc_ack_timeout")
        if self.transport["malformedSerialJson"]:
            failures.append("malformed_serial_json")
        if self.transport["suspiciousSerialFragments"]:
            failures.append("suspicious_serial_fragment")
        drops = {
            key: value for key, value in self.transport["eventDropCounters"].items()
            if isinstance(value, int) and value > 0
        }
        if drops:
            failures.append("event_outbox_drops")
        return not failures, failures

    def run(self) -> None:
        self.marker("bench_start", nodeIds=self.node_ids, telegc=self.args.telegc)
        self.run_preflight()
        self.run_startup_stress()
        if self.startup_result.get("passed"):
            if self.args.manual_bind_abuse:
                self.run_manual_bind_non_disruption_test()
            if self.args.rf_loss_only_cycles:
                for cycles in self.args.rf_loss_only_cycles:
                    for trial in range(1, self.args.rf_loss_only_repeats + 1):
                        for node in self.nodes:
                            self.run_rf_loss_only_test(node, cycles, trial)
                            if self.rf_loss_only_results and not self.rf_loss_only_results[-1].get("passed"):
                                self.marker(
                                    "rf_loss_only_tests_stopped",
                                    reason="previous_trial_failed",
                                    failedTargetNodeId=node.node_id,
                                    cycles=cycles,
                                    trial=trial,
                                )
                                break
                        if self.rf_loss_only_results and not self.rf_loss_only_results[-1].get("passed"):
                            break
                    if self.rf_loss_only_results and not self.rf_loss_only_results[-1].get("passed"):
                        break
            for node in self.nodes:
                self.run_broken_link_test(node)
                if self.broken_results and not self.broken_results[-1].get("passed"):
                    self.marker(
                        "remaining_broken_link_tests_skipped",
                        reason="previous_target_failed",
                        failedTargetNodeId=node.node_id,
                    )
                    break
        else:
            self.marker("broken_link_tests_skipped", reason="startup_failed")
        transport_ok, transport_failures = self.transport_clean()
        self.marker(
            "bench_complete",
            startupPassed=self.startup_result.get("passed", False),
            manualBindPassed=all(item.get("passed") for item in self.manual_bind_results),
            rfLossOnlyPassed=all(item.get("passed") for item in self.rf_loss_only_results),
            brokenPassed=sum(1 for item in self.broken_results if item.get("passed")),
            brokenTotal=len(self.broken_results),
            transportClean=transport_ok,
            transportFailures=transport_failures,
        )
        self.write_summary()

    def write_summary(self) -> None:
        self.summary_path.parent.mkdir(parents=True, exist_ok=True)
        transport_ok, transport_failures = self.transport_clean()
        startup_ok = bool(self.startup_result.get("passed"))
        broken_ok = bool(self.broken_results) and all(item.get("passed") for item in self.broken_results)
        preflight_ok = (
            all(self.preflight_result.get("droneOk", {}).values()) and
            self.preflight_result.get("telegcStatusAck") and
            self.preflight_result.get("magcStatusAck")
        )
        ready_for_four = bool(preflight_ok and startup_ok and broken_ok and transport_ok)
        manual_bind_ok = all(item.get("passed") for item in self.manual_bind_results)
        rf_loss_only_ok = all(item.get("passed") for item in self.rf_loss_only_results)
        if self.args.manual_bind_abuse:
            ready_for_four = ready_for_four and manual_bind_ok
        if self.args.rf_loss_only_cycles:
            ready_for_four = ready_for_four and rf_loss_only_ok
        acked = len(self.command_acks)
        sent = len(self.sent_commands)
        missing = [command_id for command_id in self.sent_commands if command_id not in self.command_acks]

        lines = [
            "# Multi-Drone Stress Summary",
            "",
            f"- TeleGC: `{self.args.telegc}`",
            f"- Nodes: `{', '.join(f'{node.node_id}={node.base_url}' for node in self.nodes)}`",
            f"- Loss cycles: `{self.args.loss_cycles}`",
            f"- Log: `{self.log_path}`",
            "",
            "## Preflight",
            "",
            "| Check | Result |",
            "|---|---|",
            f"| Drone Wi-Fi status | {'pass' if all(self.preflight_result.get('droneOk', {}).values()) else 'fail'} |",
            f"| TeleGC status ACK | {'pass' if self.preflight_result.get('telegcStatusAck') else 'fail'} |",
            f"| MaGC status ACK through TeleGC | {'pass' if self.preflight_result.get('magcStatusAck') else 'fail'} |",
            "",
            "## Startup Bind",
            "",
            f"- MaGC clear-all ACK: `{self.startup_result.get('clearAck', 'missing')}`",
            f"- Startup verdict: `{'pass' if startup_ok else 'fail'}`",
            f"- Startup failures: `{', '.join(self.startup_result.get('failures', [])) or '-'}`",
            "",
            "| Node | Startup command ACK | First TeleGC telemetry ms | <=30s target | <=60s target | Milestones | Pass |",
            "|---:|---|---:|---|---|---|---|",
        ]
        for node_id, item in sorted(self.startup_result.get("perNode", {}).items()):
            first_ms = item.get("firstTelemetryMs")
            lines.append(
                "| "
                f"{node_id} | "
                f"`{item.get('startupCommandAck', '-')}` | "
                f"{'-' if first_ms is None else first_ms} | "
                f"{'yes' if item.get('targetFirstOnline30s') else 'no'} | "
                f"{'yes' if item.get('targetAllOnline60s') else 'no'} | "
                f"{', '.join(item.get('milestones') or []) or '-'} | "
                f"{'pass' if item.get('passed') else 'fail'} |"
            )

        lines.extend([
            "",
            "## Bind Button Non-Disruption",
            "",
        ])
        if not self.manual_bind_results:
            lines.append("- Not run.")
        else:
            lines.extend([
                f"- Verdict: `{'pass' if manual_bind_ok else 'fail'}`",
                "",
                "| Run | Duration ms | Per-node max gap/events | Pass | Failures |",
                "|---:|---:|---|---|---|",
            ])
            for index, item in enumerate(self.manual_bind_results, start=1):
                node_summary = []
                for node_id, state in sorted(item.get("perNode", {}).items()):
                    node_summary.append(f"{node_id}:gap={state.get('maxTelemetryGapMs', '-')}ms,events={len(state.get('nonOnlineEvents') or [])}")
                lines.append(
                    "| "
                    f"{index} | "
                    f"{item.get('durationMs', '-')} | "
                    f"{'; '.join(node_summary) or '-'} | "
                    f"{'pass' if item.get('passed') else 'fail'} | "
                    f"{', '.join(item.get('failures') or []) or '-'} |"
                )

        lines.extend([
            "",
            "## RF-Loss Only Matrix",
            "",
        ])
        if not self.rf_loss_only_results:
            lines.append("- Not run.")
        else:
            lines.extend([
                f"- Verdict: `{'pass' if rf_loss_only_ok else 'fail'}`",
                "",
                "| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |",
                "|---:|---:|---:|---|---|---|---|---|---|",
            ])
            for item in self.rf_loss_only_results:
                gap_summary = ",".join(
                    f"{gap.get('from')}->{gap.get('to')}({gap.get('missed')})"
                    for gap in item.get("targetSequenceGaps") or []
                )
                rejoin_summary = ",".join(event.get("event", "") for event in item.get("targetRejoinEvents") or [])
                non_target_summary = []
                for node_id, stable in sorted(item.get("nonTargetStability", {}).items()):
                    non_target_summary.append(
                        f"{node_id}:gap={stable.get('maxTelemetryGapMs', '-')}ms,events={len(stable.get('nonOnlineEvents') or [])}"
                    )
                lines.append(
                    "| "
                    f"{item.get('targetNodeId')} | "
                    f"{item.get('cycles')} | "
                    f"{item.get('trial')} | "
                    f"{gap_summary or '-'} | "
                    f"{', '.join(item.get('shortLossEvents') or []) or '-'} | "
                    f"{rejoin_summary or '-'} | "
                    f"{'; '.join(non_target_summary) or '-'} | "
                    f"{'pass' if item.get('passed') else 'fail'} | "
                    f"{', '.join(item.get('failures') or []) or '-'} |"
                )

        lines.extend([
            "",
            "## Broken-Link Recovery",
            "",
            "| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |",
            "|---:|---|---|---|---|---:|---|---|---|---|",
        ])
        for item in self.broken_results:
            non_target_summary = []
            for node_id, stable in sorted(item.get("nonTargetStability", {}).items()):
                non_target_summary.append(
                    f"{node_id}:gap={stable.get('maxTelemetryGapMs', '-')}ms,events={len(stable.get('nonOnlineEvents') or [])}"
                )
            gap_summary = ",".join(
                f"{gap.get('from')}->{gap.get('to')}({gap.get('missed')})"
                for gap in item.get("observedSequenceGaps") or []
            )
            poll_summary = []
            for sample in (item.get("targetDroneStatusPolls") or [])[-8:]:
                rel_ms = sample.get("relPcMs")
                state = sample.get("state", "-")
                attempts = sample.get("joinAttemptCount", "-")
                tx_count = sample.get("joinRequestTxCount", "-")
                backoff = sample.get("joinBackoffKind", "-")
                next_action = sample.get("nextActionMs", "-")
                poll_summary.append(
                    f"{rel_ms}ms:{state},attempts={attempts},joinTx={tx_count},backoff={backoff},next={next_action}"
                )
            lines.append(
                "| "
                f"{item.get('targetNodeId')} | "
                f"`{item.get('rfLossAck')}` | "
                f"`{item.get('restartAck')}` | "
                f"{gap_summary or '-'} | "
                f"{', '.join(item.get('rebindMilestones') or []) or '-'} | "
                f"{item.get('restartToTelemetryMs') if item.get('restartToTelemetryMs') is not None else '-'} | "
                f"{'<br>'.join(poll_summary) or '-'} | "
                f"{'; '.join(non_target_summary) or '-'} | "
                f"{'pass' if item.get('passed') else 'fail'} | "
                f"{', '.join(item.get('failures') or []) or '-'} |"
            )

        lines.extend([
            "",
            "## Transport Health",
            "",
            f"- Command ACK coverage: `{acked}/{sent}`",
            f"- Missing ACKs: `{', '.join(missing) or '-'}`",
            f"- Rejected commands: `{len(self.rejected_commands)}`",
            f"- MaGC ACK timeouts: `{self.transport['magcAckTimeouts']}`",
            f"- Inter-GC forward failures: `{self.transport['interGcForwardFailed']}`",
            f"- Malformed serial JSON: `{self.transport['malformedSerialJson']}`",
            f"- Suspicious serial fragments: `{self.transport['suspiciousSerialFragments']}`",
            f"- Max reliable queue depth: `{self.transport['maxReliableQueueDepth']}`",
            f"- Max event outbox depth: `{self.transport['maxEventOutboxDepth']}`",
            f"- Event drop counters: `{json.dumps(self.transport['eventDropCounters'], sort_keys=True)}`",
            f"- Recovery budget used: `{self.transport['recoveryBudgetUsed']}`",
            f"- Recovery budget denied: `{self.transport['recoveryBudgetDenied']}`",
            f"- Healthy service protected: `{self.transport['healthyServiceProtected']}`",
            f"- Receiver overload events/statuses: `{self.transport['receiverBudgetOverloaded']}`",
            f"- Transport verdict: `{'pass' if transport_ok else 'fail'}`",
            f"- Transport failures: `{', '.join(transport_failures) or '-'}`",
            "",
            "## Final Verdict",
            "",
            f"`{'READY FOR 4 DRONES' if ready_for_four else 'NOT READY FOR 4 DRONES'}`",
        ])
        self.summary_path.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")


def parse_node(value: str, port: int) -> NodeSpec:
    if "=" not in value:
        raise argparse.ArgumentTypeError("--node must look like nodeId=host")
    node_text, host = value.split("=", 1)
    try:
        node_id = int(node_text, 10)
    except ValueError as exc:
        raise argparse.ArgumentTypeError(f"invalid node id: {node_text}") from exc
    if node_id <= 0 or node_id > 255:
        raise argparse.ArgumentTypeError("node id must be 1-255")
    return NodeSpec(node_id=node_id, base_url=normalize_base_url(host, port))


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run two-or-more-drone startup and broken-link stress tests.")
    parser.add_argument("--telegc", default="COM16", help="TeleGC USB serial port")
    parser.add_argument("--baud", type=int, default=921600)
    parser.add_argument("--node", action="append", required=True, help="Node spec nodeId=host, repeat at least twice")
    parser.add_argument("--port", type=int, default=8080, help="Drone HTTP port when --node host has no explicit port")
    parser.add_argument("--user", help="Optional drone HTTP basic-auth user")
    parser.add_argument("--password", help="Optional drone HTTP basic-auth password")
    parser.add_argument("--http-timeout", type=float, default=3.0)
    parser.add_argument("--http-retries", type=int, default=1,
                        help="Retries for safe drone Wi-Fi commands only: status, reboot, restart-join")
    parser.add_argument("--http-retry-delay-s", type=float, default=1.0)
    parser.add_argument("--startup-delay", type=float, default=8.0, help="Seconds to drain TeleGC boot output before status preflight")
    parser.add_argument("--startup-timeout", type=float, default=120.0)
    parser.add_argument("--rebind-timeout", type=float, default=90.0)
    parser.add_argument("--rebind-drone-status-poll-s", type=float, default=3.0,
                        help="Poll the target drone Wi-Fi debug status during broken-link rebind waits; use 0 to disable")
    parser.add_argument("--command-timeout", type=float, default=8.0)
    parser.add_argument("--loss-cycles", type=int, default=9)
    parser.add_argument("--loss-wait-s", type=float, default=6.0, help="Seconds to observe RF-loss effects before restart-join")
    parser.add_argument("--manual-bind-abuse", action="store_true",
                        help="After startup, repeatedly send MaGC bind/cancel and verify no online drone is affected")
    parser.add_argument("--manual-bind-count", type=int, default=5)
    parser.add_argument("--manual-bind-hold-s", type=float, default=1.0)
    parser.add_argument("--manual-bind-gap-s", type=float, default=0.5)
    parser.add_argument("--manual-bind-observe-s", type=float, default=4.0)
    parser.add_argument("--rf-loss-only-cycles", type=int, nargs="*", default=[],
                        help="Optional RF-loss-only cycle counts to test before destructive broken-link tests")
    parser.add_argument("--rf-loss-only-repeats", type=int, default=3)
    parser.add_argument("--rf-loss-only-wait-s", type=float, default=6.0)
    parser.add_argument("--rf-loss-recover-timeout", type=float, default=10.0)
    parser.add_argument("--between-tests-s", type=float, default=5.0)
    parser.add_argument("--pre-loss-stable-timeout", type=float, default=15.0)
    parser.add_argument("--freshness-s", type=float, default=3.0)
    parser.add_argument("--non-target-max-gap-s", type=float, default=1.5)
    parser.add_argument("--first-online-target", type=float, default=30.0)
    parser.add_argument("--all-online-target", type=float, default=60.0)
    parser.add_argument("--startup-drone-command", choices=("reboot", "restart-join"), default="reboot")
    parser.add_argument("--log", default="logs_summary/multi_drone_stress_2node.jsonl")
    parser.add_argument("--summary", default="logs_summary/multi_drone_stress_2node_summary.md")
    args = parser.parse_args(argv)
    args.nodes = [parse_node(item, args.port) for item in args.node]
    if len(args.nodes) < 2:
        parser.error("at least two --node values are required")
    if len({node.node_id for node in args.nodes}) != len(args.nodes):
        parser.error("--node ids must be unique")
    if args.loss_cycles <= 0:
        parser.error("--loss-cycles must be positive")
    if args.manual_bind_count <= 0:
        parser.error("--manual-bind-count must be positive")
    if args.rf_loss_only_repeats <= 0:
        parser.error("--rf-loss-only-repeats must be positive")
    if any(cycles <= 0 for cycles in args.rf_loss_only_cycles):
        parser.error("--rf-loss-only-cycles values must be positive")
    return args


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    with MultiDroneStressRunner(args, args.nodes) as runner:
        runner.run()
    print(f"Wrote log: {args.log}")
    print(f"Wrote summary: {args.summary}")
    transport_ok, _ = runner.transport_clean()
    passed = (
        bool(runner.startup_result.get("passed")) and
        (not args.manual_bind_abuse or all(item.get("passed") for item in runner.manual_bind_results)) and
        (not args.rf_loss_only_cycles or all(item.get("passed") for item in runner.rf_loss_only_results)) and
        bool(runner.broken_results) and
        all(item.get("passed") for item in runner.broken_results) and
        transport_ok
    )
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
