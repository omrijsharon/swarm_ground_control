#!/usr/bin/env python3
"""Measure baseline TeleGC assigned-channel telemetry coverage."""

from __future__ import annotations

import argparse
import json
import queue
import statistics
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from sgc_live_debug import SerialPeer


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


def event_time_s(event: dict[str, Any]) -> float:
    ts = event.get("timestamp")
    if isinstance(ts, str):
        try:
            return datetime.fromisoformat(ts.replace("Z", "+00:00")).timestamp()
        except Exception:
            pass
    return time.time()


def nested_json(event: dict[str, Any]) -> dict[str, Any]:
    value = event.get("json")
    return value if isinstance(value, dict) else {}


def seq_gap(before: int | None, after: int | None) -> list[int]:
    if before is None or after is None:
        return []
    missing: list[int] = []
    cursor = (before + 1) & 0xFF
    while cursor != after and len(missing) <= 255:
        missing.append(cursor)
        cursor = (cursor + 1) & 0xFF
    return missing


@dataclass
class CoverageStats:
    telemetry_rows: list[tuple[float, dict[str, Any]]] = field(default_factory=list)
    sequence_gaps: list[tuple[float, int, int, list[int]]] = field(default_factory=list)
    intervals_ms: list[float] = field(default_factory=list)
    link_events: list[tuple[float, str, str]] = field(default_factory=list)
    scanner_events: list[tuple[float, str, dict[str, Any]]] = field(default_factory=list)
    gc_status_rows: list[tuple[float, dict[str, Any]]] = field(default_factory=list)
    command_acks: list[tuple[float, dict[str, Any]]] = field(default_factory=list)
    previous_seq: int | None = None
    previous_s: float | None = None

    def observe_telemetry(self, now_s: float, msg: dict[str, Any], warmup_until_s: float) -> None:
        seq = msg.get("sequenceId")
        if not isinstance(seq, int):
            return
        if self.previous_s is not None:
            self.intervals_ms.append((now_s - self.previous_s) * 1000.0)
        missing = seq_gap(self.previous_seq, seq)
        if missing and now_s >= warmup_until_s:
            self.sequence_gaps.append((now_s, self.previous_seq if self.previous_seq is not None else -1, seq, missing))
        self.previous_seq = seq
        self.previous_s = now_s
        self.telemetry_rows.append((now_s, msg))


class CoverageRunner:
    def __init__(self, args: argparse.Namespace) -> None:
        self.args = args
        self.events: queue.Queue[dict[str, Any]] = queue.Queue()
        self.peers: dict[str, SerialPeer] = {
            "telegc": SerialPeer("telegc", args.telegc, args.baud, self.events),
        }
        if args.drone:
            self.peers["drone"] = SerialPeer("drone", args.drone, args.baud, self.events)
        self.log_path = Path(args.log)
        self.summary_path = Path(args.summary)
        self.log_handle = None
        self.started_s = 0.0
        self.warmup_until_s = 0.0
        self.stats = CoverageStats()
        self.status_counter = 0

    def __enter__(self) -> "CoverageRunner":
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        self.log_handle = self.log_path.open("w", encoding="utf-8", newline="\n")
        for peer in self.peers.values():
            peer.start()
        return self

    def __exit__(self, exc_type: object, exc: object, tb: object) -> None:
        self.drain_events(0.2)
        for peer in self.peers.values():
            peer.close()
        self.drain_events(0.2)
        if self.log_handle is not None:
            self.log_handle.close()

    def write_event(self, event: dict[str, Any]) -> None:
        if self.log_handle is None:
            return
        self.log_handle.write(json.dumps(event, separators=(",", ":")) + "\n")
        self.log_handle.flush()

    def marker(self, event: str, **fields: Any) -> None:
        self.write_event({
            "kind": "marker",
            "source": "tool",
            "timestamp": utc_now_iso(),
            "raw": event,
            "json": {"type": "coverage_marker", "event": event, **fields},
        })

    def drain_events(self, seconds: float) -> None:
        deadline = time.time() + max(0.0, seconds)
        while time.time() < deadline:
            timeout = max(0.01, min(0.2, deadline - time.time()))
            try:
                event = self.events.get(timeout=timeout)
            except queue.Empty:
                continue
            self.write_event(event)
            self.observe_event(event)

    def observe_event(self, event: dict[str, Any]) -> None:
        msg = nested_json(event)
        event_type = str(msg.get("type") or "")
        now_s = event_time_s(event)
        if event_type == "drone_telemetry" and msg.get("nodeId") == self.args.node_id:
            self.stats.observe_telemetry(now_s, msg, self.warmup_until_s)
        elif event_type == "drone_link_status" and msg.get("nodeId") == self.args.node_id:
            state = str(msg.get("state") or "")
            if state and state not in {"online", "live"}:
                self.stats.link_events.append((now_s, state, str(msg.get("reason") or "")))
        elif event_type in {"scanner_event", "search_event", "telemetry_rebind_event"}:
            self.stats.scanner_events.append((now_s, str(msg.get("event") or event_type), msg))
        elif event_type == "gc_status":
            self.stats.gc_status_rows.append((now_s, msg))
        elif event_type == "command_ack":
            self.stats.command_acks.append((now_s, msg))

    def send_status_commands(self) -> None:
        self.status_counter += 1
        suffix = f"{self.status_counter:04d}"
        self.peers["telegc"].send_json({
            "type": "command",
            "target": "telegc",
            "command": "get_status",
            "commandId": f"coverage-telegc-status-{suffix}",
        })
        if self.status_counter == 1:
            self.peers["telegc"].send_json({
                "type": "command",
                "target": "magc",
                "command": "get_status",
                "commandId": f"coverage-magc-status-{suffix}",
            })
        drone = self.peers.get("drone")
        if drone is not None and self.status_counter == 1:
            drone.send_json({
                "type": "command",
                "command": "get_status",
                "commandId": f"coverage-drone-status-{suffix}",
            })

    def run(self) -> None:
        self.started_s = time.time()
        self.warmup_until_s = self.started_s + self.args.startup_delay + self.args.warmup
        self.marker(
            "coverage_start",
            telegc=self.args.telegc,
            drone=self.args.drone or "",
            nodeId=self.args.node_id,
            duration=self.args.duration,
            warmup=self.args.warmup,
        )
        self.drain_events(self.args.startup_delay)
        next_status_s = 0.0
        end_s = time.time() + self.args.duration
        while time.time() < end_s:
            now_s = time.time()
            if now_s >= next_status_s:
                self.send_status_commands()
                next_status_s = now_s + self.args.status_interval
            self.drain_events(0.25)
        self.marker("coverage_complete")
        self.write_summary()

    def write_summary(self) -> None:
        self.summary_path.parent.mkdir(parents=True, exist_ok=True)
        warm_rows = [(ts, msg) for ts, msg in self.stats.telemetry_rows if ts >= self.warmup_until_s]
        missing_total = sum(len(row[3]) for row in self.stats.sequence_gaps)
        max_gap = max((len(row[3]) for row in self.stats.sequence_gaps), default=0)
        latest_status = self.stats.gc_status_rows[-1][1] if self.stats.gc_status_rows else {}
        lines: list[str] = []
        lines.append("# Telemetry Coverage Summary")
        lines.append("")
        lines.append(f"- TeleGC: `{self.args.telegc}`")
        if self.args.drone:
            lines.append(f"- Drone: `{self.args.drone}`")
        lines.append(f"- Node: `{self.args.node_id}`")
        lines.append(f"- Duration: `{self.args.duration}s`")
        lines.append(f"- Warmup excluded: `{self.args.warmup}s` after startup delay")
        lines.append(f"- Log: `{self.log_path}`")
        lines.append("")
        lines.append("## Results")
        lines.append(f"- Telemetry rows after warmup: {len(warm_rows)}")
        lines.append(f"- Sequence gap events after warmup: {len(self.stats.sequence_gaps)}")
        lines.append(f"- Missing sequence IDs after warmup: {missing_total}")
        lines.append(f"- Max sequence gap after warmup: {max_gap}")
        lines.append(f"- Non-online link events: {len(self.stats.link_events)}")
        if self.stats.intervals_ms:
            lines.append(f"- Telemetry interval: avg {fmt_num(mean(self.stats.intervals_ms))} ms, max {fmt_num(max(self.stats.intervals_ms))} ms")
        if latest_status:
            lines.append("")
            lines.append("## Latest GC Coverage Status")
            for key in (
                "telemetryCoverageMode",
                "assignedRxCoveragePct",
                "assignedPacketsReceived",
                "assignedSequenceGapEvents",
                "assignedSequenceGaps",
                "assignedMaxGap",
                "assignedSlotMisses",
                "nonAssignedPreemptions",
                "nextAssignedSlackMs",
                "lastNonAssignedPreemptionReason",
                "receiverBudgetMode",
                "receiverUtilization",
                "receiverOverloaded",
                "recoveryBudgetUsedCount",
                "recoveryBudgetDeniedCount",
                "healthyServiceProtectedCount",
                "owedRxActive",
                "owedRxNodeId",
                "owedRxCount",
                "fairnessSkipCount",
                "fairnessOwedSelectedCount",
                "fairnessOwedMissedCount",
                "maxConsecutiveSchedulerSkips",
            ):
                if key in latest_status:
                    lines.append(f"- {key}: `{latest_status.get(key)}`")
        fairness_events = [
            (ts, event, msg)
            for ts, event, msg in self.stats.scanner_events
            if event in {
                "rx_candidate_skipped",
                "owed_rx_selected",
                "owed_rx_cleared",
                "owed_rx_missed",
                "owed_service_selected",
                "owed_service_cleared",
            }
        ]
        budget_events = [
            (ts, event, msg)
            for ts, event, msg in self.stats.scanner_events
            if event in {
                "recovery_budget_used",
                "recovery_budget_denied",
                "healthy_service_protected",
                "receiver_budget_overloaded",
            }
        ]
        if budget_events:
            counts: dict[str, int] = {}
            for _, event, _ in budget_events:
                counts[event] = counts.get(event, 0) + 1
            lines.append("")
            lines.append("## Receiver Budget")
            lines.append("- Event counts: " + ", ".join(f"{key}={value}" for key, value in sorted(counts.items())))
            for ts, event, msg in budget_events[-10:]:
                lines.append(
                    f"  - t+{ts - self.started_s:0.3f}s {event} "
                    f"target {msg.get('nodeId')} protected {msg.get('protectedNodeId')} reason {msg.get('reason')}"
                )
        if fairness_events:
            counts: dict[str, int] = {}
            by_node: dict[int, dict[str, int]] = {}
            for _, event, msg in fairness_events:
                counts[event] = counts.get(event, 0) + 1
                node = msg.get("nodeId")
                if isinstance(node, int):
                    per_node = by_node.setdefault(node, {})
                    per_node[event] = per_node.get(event, 0) + 1
            lines.append("")
            lines.append("## Owed-Packet Fairness")
            lines.append("- Event counts: " + ", ".join(f"{key}={value}" for key, value in sorted(counts.items())))
            for node, node_counts in sorted(by_node.items()):
                lines.append(
                    f"- Node {node}: " +
                    ", ".join(f"{key}={value}" for key, value in sorted(node_counts.items()))
                )
            lines.append("- Recent fairness events:")
            for ts, event, msg in fairness_events[-10:]:
                selected = msg.get("selectedNodeId")
                selected_text = f", selected {selected}" if selected is not None else ""
                lines.append(
                    f"  - t+{ts - self.started_s:0.3f}s {event} node {msg.get('nodeId')}"
                    f"{selected_text}, owed {msg.get('owedRxCount')}, skips {msg.get('consecutiveSchedulerSkips')}"
                )
        if self.stats.sequence_gaps:
            lines.append("")
            lines.append("## Sequence Gaps")
            lines.append("| Time s | From | To | Missing |")
            lines.append("|---:|---:|---:|---|")
            for ts, prev_seq, seq, missing in self.stats.sequence_gaps[:20]:
                lines.append(
                    f"| {ts - self.started_s:0.3f} | {prev_seq} | {seq} | {fmt_list(missing)} |"
                )
        if self.stats.link_events:
            lines.append("")
            lines.append("## Link Events")
            for ts, state, reason in self.stats.link_events[:20]:
                lines.append(f"- t+{ts - self.started_s:0.3f}s {state}: {reason or '-'}")
        self.summary_path.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")


def mean(values: list[float]) -> float | None:
    return statistics.mean(values) if values else None


def fmt_num(value: float | None) -> str:
    if value is None:
        return "-"
    return f"{value:0.0f}"


def fmt_list(values: list[int]) -> str:
    return ",".join(str(value) for value in values) if values else "-"


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Measure baseline TeleGC assigned-channel telemetry coverage")
    parser.add_argument("--telegc", default="COM16", help="TeleGC USB serial port")
    parser.add_argument("--drone", default="", help="Optional drone USB serial port")
    parser.add_argument("--baud", type=int, default=921600)
    parser.add_argument("--node-id", type=int, default=7)
    parser.add_argument("--duration", type=float, default=120.0)
    parser.add_argument("--startup-delay", type=float, default=12.0)
    parser.add_argument("--warmup", type=float, default=5.0)
    parser.add_argument("--status-interval", type=float, default=10.0)
    parser.add_argument("--log", default="logs_summary/telemetry_coverage_120s.jsonl")
    parser.add_argument("--summary", default="logs_summary/telemetry_coverage_120s_summary.md")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    with CoverageRunner(args) as runner:
        runner.run()
    print(f"Wrote log: {args.log}")
    print(f"Wrote summary: {args.summary}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
