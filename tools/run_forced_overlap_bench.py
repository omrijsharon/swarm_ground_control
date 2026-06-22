#!/usr/bin/env python3
"""Run deterministic assigned-channel forced-overlap scheduler bench tests."""

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

from drone_wifi_debug import auth_header, normalize_base_url, post_command
from sgc_live_debug import SerialPeer


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
            parsed = {"raw": stripped}
        if isinstance(parsed, dict):
            rows.append(parsed)
    return rows


@dataclass(frozen=True)
class NodeSpec:
    node_id: int
    base_url: str


@dataclass
class ClockSample:
    offset_ms: float
    rtt_ms: float
    gc_millis: int


class ForcedOverlapRunner:
    def __init__(self, args: argparse.Namespace, nodes: list[NodeSpec]) -> None:
        self.args = args
        self.nodes = nodes
        self.events: queue.Queue[dict[str, Any]] = queue.Queue()
        self.peer = SerialPeer("telegc", args.telegc, args.baud, self.events)
        self.log_path = Path(args.log)
        self.summary_path = Path(args.summary)
        self.log_handle = None
        self.records: list[dict[str, Any]] = []
        self.latest_assignments: dict[int, dict[str, Any]] = {}
        self.latest_link_state: dict[int, str] = {}
        self.command_counter = 0
        self.trial_results: list[dict[str, Any]] = []

    def __enter__(self) -> "ForcedOverlapRunner":
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
        return f"forced-overlap-{prefix}-{self.command_counter:04d}"

    def write_event(self, event: dict[str, Any]) -> None:
        self.records.append(event)
        if self.log_handle is not None:
            self.log_handle.write(json.dumps(event, separators=(",", ":")) + "\n")
            self.log_handle.flush()

    def marker(self, event: str, **fields: Any) -> None:
        self.write_event({
            "kind": "marker",
            "source": "tool",
            "timestamp": utc_now_iso(),
            "raw": event,
            "json": {"type": "bench_marker", "bench": "forced_overlap", "event": event, **fields},
        })

    def observe(self, event: dict[str, Any]) -> None:
        msg = nested_json(event)
        event_type = msg.get("type")
        if event_type == "assignments" and isinstance(msg.get("assignments"), list):
            for item in msg["assignments"]:
                if isinstance(item, dict) and isinstance(item.get("nodeId"), int):
                    self.latest_assignments[item["nodeId"]] = item
        elif event_type == "assignment_event" and isinstance(msg.get("nodeId"), int):
            if msg.get("event") in {"telemetry_period_locked", "post_bind_first_telemetry"}:
                existing = self.latest_assignments.setdefault(msg["nodeId"], {"nodeId": msg["nodeId"]})
                existing["timingAccepted"] = True
                existing["timingKnown"] = True
                existing["sourceEvent"] = msg.get("event")
        elif event_type == "drone_link_status" and isinstance(msg.get("nodeId"), int):
            self.latest_link_state[msg["nodeId"]] = str(msg.get("state") or "")
        elif event_type == "drone_telemetry" and isinstance(msg.get("nodeId"), int):
            self.latest_link_state[msg["nodeId"]] = "online"
            existing = self.latest_assignments.setdefault(msg["nodeId"], {"nodeId": msg["nodeId"]})
            if msg.get("timingAccepted") is True or msg.get("timingKnown") is True:
                existing["timingAccepted"] = True
                existing["timingKnown"] = True

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

    def send_telegc_command(self, payload: dict[str, Any]) -> str:
        payload.setdefault("type", "command")
        payload.setdefault("target", "telegc")
        if "commandId" not in payload:
            payload["commandId"] = self.next_command_id("telegc")
        self.peer.send_json(payload)
        return str(payload["commandId"])

    def post_drone_command(self, node: NodeSpec, payload: dict[str, Any]) -> list[dict[str, Any]]:
        payload.setdefault("type", "command")
        if "commandId" not in payload:
            payload["commandId"] = self.next_command_id(f"drone{node.node_id}")
        self.write_event({
            "kind": "tx",
            "source": f"drone{node.node_id}_wifi",
            "timestamp": utc_now_iso(),
            "raw": json.dumps(payload, separators=(",", ":")),
            "json": payload,
        })
        start_ms = perf_ms()
        status, text = post_command(
            node.base_url,
            payload,
            self.args.http_timeout,
            auth_header(self.args.user, self.args.password),
        )
        end_ms = perf_ms()
        rows = parse_response_lines(text)
        for row in rows:
            event = {
                "kind": "rx",
                "source": f"drone{node.node_id}_wifi",
                "timestamp": utc_now_iso(),
                "httpStatus": status,
                "httpRttMs": end_ms - start_ms,
                "raw": json.dumps(row, separators=(",", ":")) if "raw" not in row else str(row["raw"]),
                "json": row if "raw" not in row else {},
            }
            self.write_event(event)
        return rows

    def sample_drone_clock(self, node: NodeSpec) -> ClockSample:
        samples: list[ClockSample] = []
        for _ in range(self.args.clock_samples):
            command_id = self.next_command_id(f"clock-drone{node.node_id}")
            start_ms = perf_ms()
            rows = self.post_drone_command(node, {
                "type": "command",
                "command": "get_status",
                "commandId": command_id,
            })
            end_ms = perf_ms()
            status = next((row for row in rows if row.get("type") == "drone_debug_status"), None)
            if status is not None and isinstance(status.get("gcMillis"), int):
                mid_ms = (start_ms + end_ms) / 2.0
                samples.append(ClockSample(status["gcMillis"] - mid_ms, end_ms - start_ms, status["gcMillis"]))
            time.sleep(0.05)
        if not samples:
            raise RuntimeError(f"could not sample drone {node.node_id} clock")
        return min(samples, key=lambda item: item.rtt_ms)

    def sample_telegc_clock(self) -> ClockSample:
        samples: list[ClockSample] = []
        for _ in range(self.args.clock_samples):
            command_id = self.next_command_id("clock-telegc")
            start_ms = perf_ms()
            self.peer.send_json({
                "type": "command",
                "target": "telegc",
                "command": "get_status",
                "commandId": command_id,
            })
            deadline = time.time() + 2.0
            ack_seen = False
            while time.time() < deadline:
                try:
                    event = self.events.get(timeout=0.2)
                except queue.Empty:
                    continue
                self.write_event(event)
                self.observe(event)
                msg = nested_json(event)
                if msg.get("type") == "command_ack" and msg.get("commandId") == command_id:
                    ack_seen = True
                elif ack_seen and msg.get("type") == "gc_status" and isinstance(msg.get("gcMillis"), int):
                    end_ms = perf_ms()
                    mid_ms = (start_ms + end_ms) / 2.0
                    samples.append(ClockSample(msg["gcMillis"] - mid_ms, end_ms - start_ms, msg["gcMillis"]))
                    break
            time.sleep(0.05)
        if not samples:
            raise RuntimeError("could not sample TeleGC clock")
        return min(samples, key=lambda item: item.rtt_ms)

    def wait_ready(self) -> None:
        node_ids = {node.node_id for node in self.nodes}
        deadline = time.time() + self.args.ready_timeout
        next_status = 0.0
        while time.time() < deadline:
            now = time.time()
            if now >= next_status:
                self.send_telegc_command({"command": "get_status"})
                next_status = now + 2.0
            self.drain(0.25)
            ready = True
            for node_id in node_ids:
                assignment = self.latest_assignments.get(node_id)
                if not assignment or assignment.get("timingAccepted") is not True:
                    ready = False
                    break
                state = self.latest_link_state.get(node_id)
                if state and state not in {"online", "live"}:
                    ready = False
                    break
            if ready:
                return
        raise RuntimeError(f"timed out waiting for assigned locked nodes: {sorted(node_ids)}")

    def sleep_until_perf_ms(self, target_ms: float) -> None:
        while True:
            remaining_ms = target_ms - perf_ms()
            if remaining_ms <= 0:
                return
            self.drain(min(0.25, remaining_ms / 1000.0))

    def run_trial(self, trial: int, reversed_offsets: bool) -> None:
        self.drain(0.5)
        self.wait_ready()
        node_ids = [node.node_id for node in self.nodes]
        offsets = [self.args.offset_ms * index for index in range(len(self.nodes))]
        if reversed_offsets:
            offsets = list(reversed(offsets))

        telegc_clock = self.sample_telegc_clock()
        drone_clocks = {node.node_id: self.sample_drone_clock(node) for node in self.nodes}
        host_target_ms = perf_ms() + self.args.lead_ms
        telegc_target_ms = int(host_target_ms + telegc_clock.offset_ms)
        drone_targets = {
            node.node_id: int(host_target_ms + drone_clocks[node.node_id].offset_ms + offsets[index])
            for index, node in enumerate(self.nodes)
        }

        trial_record_start = len(self.records)
        self.marker(
            "trial_start",
            trial=trial,
            nodeIds=node_ids,
            offsetsMs=offsets,
            hostTargetMs=round(host_target_ms, 3),
            telegcTargetGcMillis=telegc_target_ms,
            droneTargetsGcMillis=drone_targets,
            telegcClockRttMs=round(telegc_clock.rtt_ms, 3),
            droneClockRttMs={node_id: round(sample.rtt_ms, 3) for node_id, sample in drone_clocks.items()},
        )

        drone_command_ids: list[str] = []
        for node in self.nodes:
            command_id = self.next_command_id(f"schedule-drone{node.node_id}")
            drone_command_ids.append(command_id)
            self.post_drone_command(node, {
                "type": "command",
                "command": "debug_schedule_next_telemetry",
                "commandId": command_id,
                "targetGcMillis": drone_targets[node.node_id],
            })

        self.sleep_until_perf_ms(host_target_ms - self.args.telegc_schedule_lead_ms)
        telegc_command_id = self.send_telegc_command({
            "command": "debug_schedule_assignment_overlap",
            "commandId": self.next_command_id("schedule-telegc"),
            "nodeIds": node_ids,
            "targetGcMillis": telegc_target_ms,
            "offsetsMs": offsets,
        })
        self.drain((host_target_ms - perf_ms()) / 1000.0 + self.args.post_target_capture_s)

        result = self.evaluate_trial(
            trial,
            trial_record_start,
            node_ids,
            offsets,
            drone_command_ids,
            telegc_command_id,
        )
        self.trial_results.append(result)
        self.marker("trial_complete", **result)

    def evaluate_trial(
        self,
        trial: int,
        start_index: int,
        node_ids: list[int],
        offsets: list[int],
        drone_command_ids: list[str],
        telegc_command_id: str,
    ) -> dict[str, Any]:
        rows = self.records[start_index:]
        messages = [nested_json(row) for row in rows]
        acked = {
            str(msg.get("commandId"))
            for msg in messages
            if msg.get("type") == "command_ack" and msg.get("accepted") is not False
        }
        rejected = [
            msg
            for msg in messages
            if msg.get("type") == "command_ack" and msg.get("accepted") is False
        ]
        fairness = [
            msg
            for msg in messages
            if msg.get("type") == "scanner_event" and msg.get("event") in {
                "rx_candidate_skipped",
                "owed_rx_selected",
                "owed_rx_cleared",
                "owed_rx_missed",
            }
        ]
        skipped_nodes = [msg.get("nodeId") for msg in fairness if msg.get("event") == "rx_candidate_skipped"]
        selected_nodes = [msg.get("nodeId") for msg in fairness if msg.get("event") == "owed_rx_selected"]
        cleared_nodes = [msg.get("nodeId") for msg in fairness if msg.get("event") == "owed_rx_cleared"]
        owed_missed_nodes = [msg.get("nodeId") for msg in fairness if msg.get("event") == "owed_rx_missed"]
        non_online = [
            {"nodeId": msg.get("nodeId"), "state": msg.get("state"), "reason": msg.get("reason")}
            for msg in messages
            if msg.get("type") == "drone_link_status" and msg.get("state") not in {"online", "live"}
        ]
        score_fields_present = any(
            msg.get("event") == "owed_rx_selected" and
            all(key in msg for key in ("scoreRelativeAge", "scoreOwedBonus", "scoreSkipBonus", "scoreDeltaPenalty"))
            for msg in fairness
        )
        max_scheduler_skips = max(
            [
                int(msg.get("consecutiveSchedulerSkips"))
                for msg in fairness
                if isinstance(msg.get("consecutiveSchedulerSkips"), int)
            ] +
            [
                int(msg.get("maxConsecutiveSchedulerSkips"))
                for msg in messages
                if isinstance(msg.get("maxConsecutiveSchedulerSkips"), int)
            ],
            default=0,
        )

        failures: list[str] = []
        if not all(command_id in acked for command_id in drone_command_ids):
            failures.append("missing_drone_schedule_ack")
        if telegc_command_id not in acked:
            failures.append("missing_telegc_overlap_ack")
        if rejected:
            failures.append("command_rejected")
        if not skipped_nodes:
            failures.append("missing_rx_candidate_skipped")
        if not selected_nodes:
            failures.append("missing_owed_rx_selected")
        if not cleared_nodes:
            failures.append("missing_owed_rx_cleared")
        if owed_missed_nodes:
            failures.append("owed_rx_missed")
        if non_online:
            failures.append("non_online_link_event")
        if max_scheduler_skips > self.args.max_expected_scheduler_skips:
            failures.append("max_scheduler_skips_exceeded")
        if not score_fields_present:
            failures.append("missing_score_fields")

        return {
            "trial": trial,
            "nodeIds": node_ids,
            "offsetsMs": offsets,
            "droneCommandIds": drone_command_ids,
            "telegcCommandId": telegc_command_id,
            "passed": not failures,
            "failures": failures,
            "skippedNodes": skipped_nodes,
            "owedSelectedNodes": selected_nodes,
            "owedClearedNodes": cleared_nodes,
            "owedMissedNodes": owed_missed_nodes,
            "nonOnlineLinkEvents": non_online,
            "scoreFieldsPresent": score_fields_present,
            "maxConsecutiveSchedulerSkips": max_scheduler_skips,
        }

    def run(self) -> None:
        self.marker("bench_start", nodeIds=[node.node_id for node in self.nodes], trials=self.args.trials)
        self.drain(self.args.startup_delay)
        self.wait_ready()
        for trial in range(1, self.args.trials + 1):
            reversed_offsets = self.args.reverse or (self.args.alternate_offsets and trial % 2 == 0)
            self.run_trial(trial, reversed_offsets)
            self.drain(self.args.between_trials_s)
        self.marker("bench_complete", passCount=sum(1 for item in self.trial_results if item["passed"]), trials=len(self.trial_results))
        self.write_summary()

    def write_summary(self) -> None:
        self.summary_path.parent.mkdir(parents=True, exist_ok=True)
        passed = sum(1 for item in self.trial_results if item["passed"])
        lines = [
            "# Forced Overlap Bench Summary",
            "",
            f"- TeleGC: `{self.args.telegc}`",
            f"- Nodes: `{', '.join(f'{node.node_id}={node.base_url}' for node in self.nodes)}`",
            f"- Trials: {len(self.trial_results)}",
            f"- Passed: {passed}/{len(self.trial_results)}",
            f"- Log: `{self.log_path}`",
            "",
            "| Trial | Offsets ms | Pass | Skipped | Owed selected | Owed cleared | Max skips | Failures |",
            "|---:|---|---|---|---|---|---:|---|",
        ]
        for item in self.trial_results:
            lines.append(
                "| "
                f"{item['trial']} | "
                f"{','.join(str(value) for value in item['offsetsMs'])} | "
                f"{'yes' if item['passed'] else 'no'} | "
                f"{','.join(str(value) for value in item['skippedNodes']) or '-'} | "
                f"{','.join(str(value) for value in item['owedSelectedNodes']) or '-'} | "
                f"{','.join(str(value) for value in item['owedClearedNodes']) or '-'} | "
                f"{item['maxConsecutiveSchedulerSkips']} | "
                f"{','.join(item['failures']) or '-'} |"
            )
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
    parser = argparse.ArgumentParser(description="Run deterministic forced-overlap scheduler bench tests.")
    parser.add_argument("--telegc", default="COM16", help="TeleGC USB serial port")
    parser.add_argument("--baud", type=int, default=921600)
    parser.add_argument("--node", action="append", required=True, help="Node spec nodeId=host, repeat at least twice")
    parser.add_argument("--port", type=int, default=8080, help="Drone HTTP port when --node host has no explicit port")
    parser.add_argument("--user", help="Optional drone HTTP basic-auth user")
    parser.add_argument("--password", help="Optional drone HTTP basic-auth password")
    parser.add_argument("--http-timeout", type=float, default=3.0)
    parser.add_argument("--trials", type=int, default=5)
    parser.add_argument("--lead-ms", type=int, default=5000)
    parser.add_argument("--telegc-schedule-lead-ms", type=int, default=650)
    parser.add_argument("--offset-ms", type=int, default=20)
    parser.add_argument("--reverse", action="store_true", help="Use reversed offsets for all trials")
    parser.add_argument("--alternate-offsets", action="store_true", help="Reverse offsets on every even trial")
    parser.add_argument("--startup-delay", type=float, default=8.0)
    parser.add_argument("--ready-timeout", type=float, default=45.0)
    parser.add_argument("--clock-samples", type=int, default=4)
    parser.add_argument("--post-target-capture-s", type=float, default=4.0)
    parser.add_argument("--between-trials-s", type=float, default=1.0)
    parser.add_argument("--max-expected-scheduler-skips", type=int, default=3)
    parser.add_argument("--log", default="logs_summary/forced_overlap_bench.jsonl")
    parser.add_argument("--summary", default="logs_summary/forced_overlap_bench_summary.md")
    args = parser.parse_args(argv)
    args.nodes = [parse_node(item, args.port) for item in args.node]
    if len(args.nodes) < 2:
        parser.error("at least two --node values are required")
    if args.trials <= 0:
        parser.error("--trials must be positive")
    if args.lead_ms < 1500:
        parser.error("--lead-ms must be at least 1500")
    if args.telegc_schedule_lead_ms < 600:
        parser.error("--telegc-schedule-lead-ms must be at least 600")
    if args.telegc_schedule_lead_ms >= args.lead_ms:
        parser.error("--telegc-schedule-lead-ms must be less than --lead-ms")
    return args


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    with ForcedOverlapRunner(args, args.nodes) as runner:
        runner.run()
    print(f"Wrote log: {args.log}")
    print(f"Wrote summary: {args.summary}")
    passed = sum(1 for item in runner.trial_results if item["passed"])
    return 0 if passed == len(runner.trial_results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
