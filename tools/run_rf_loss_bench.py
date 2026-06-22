#!/usr/bin/env python3
"""Run repeated Drone 7 simulated RF-loss bench tests.

The bench opens TeleGC and drone USB serial ports, sends
debug_simulate_rf_loss for multiple packet counts, and writes JSONL evidence
plus a Markdown summary table.
"""

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


def seq_after_or_equal(seq: int, threshold: int) -> bool:
    return ((seq - threshold) & 0xFF) < 128


@dataclass
class TrialResult:
    cycles: int
    trial: int
    command_id: str
    started_s: float
    ack_s: float | None = None
    ack_accepted: bool = False
    pre_seq: int | None = None
    pre_telemetry_s: float | None = None
    post_seq: int | None = None
    post_telemetry_s: float | None = None
    simulated_seq_ids: list[int] = field(default_factory=list)
    simulated_event_s: list[float] = field(default_factory=list)
    telemetry_seq_events: list[tuple[float, int]] = field(default_factory=list)
    non_online_link_events: list[str] = field(default_factory=list)
    rebind_events: list[str] = field(default_factory=list)
    telemetry_rows: int = 0
    notes: list[str] = field(default_factory=list)

    @property
    def observed_missing(self) -> list[int]:
        return seq_gap(self.pre_seq, self.post_seq)

    @property
    def observed_missing_count(self) -> int | None:
        if self.pre_seq is None or self.post_seq is None:
            return None
        return len(self.observed_missing)

    @property
    def extra_missing_count(self) -> int | None:
        observed = self.observed_missing_count
        if observed is None:
            return None
        return observed - self.cycles

    @property
    def pre_simulation_missing(self) -> list[int]:
        if not self.simulated_event_s:
            return []
        first_simulated_s = min(self.simulated_event_s)
        previous_seq = self.pre_seq
        missing: list[int] = []
        for event_s, seq in self.telemetry_seq_events:
            if event_s >= first_simulated_s:
                continue
            missing.extend(seq_gap(previous_seq, seq))
            previous_seq = seq
        return missing

    @property
    def post_simulation_extra_missing(self) -> list[int]:
        if not self.simulated_seq_ids:
            return []
        return seq_gap(self.simulated_seq_ids[-1], self.post_seq)

    @property
    def recovered(self) -> bool:
        return self.post_seq is not None

    @property
    def expected_gap_seen(self) -> bool:
        missing = set(self.observed_missing)
        expected = set(self.simulated_seq_ids)
        return bool(expected) and expected.issubset(missing)

    @property
    def gap_ms(self) -> float | None:
        if self.pre_telemetry_s is None or self.post_telemetry_s is None:
            return None
        return (self.post_telemetry_s - self.pre_telemetry_s) * 1000.0

    @property
    def command_to_resume_ms(self) -> float | None:
        if self.post_telemetry_s is None:
            return None
        return (self.post_telemetry_s - self.started_s) * 1000.0


class BenchRunner:
    def __init__(self, args: argparse.Namespace) -> None:
        self.args = args
        self.events: queue.Queue[dict[str, Any]] = queue.Queue()
        self.peers = {
            "telegc": SerialPeer("telegc", args.telegc, args.baud, self.events),
            "drone": SerialPeer("drone", args.drone, args.baud, self.events),
        }
        self.log_path = Path(args.log)
        self.summary_path = Path(args.summary)
        self.log_handle = None
        self.latest_telemetry_by_node: dict[int, tuple[float, dict[str, Any]]] = {}
        self.results: list[TrialResult] = []
        self.status_counter = 0

    def __enter__(self) -> "BenchRunner":
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
        record = {
            "kind": "marker",
            "source": "tool",
            "timestamp": utc_now_iso(),
            "raw": event,
            "json": {"type": "bench_marker", "event": event, **fields},
        }
        self.write_event(record)

    def drain_events(self, seconds: float, active: TrialResult | None = None) -> None:
        deadline = time.time() + max(0.0, seconds)
        while time.time() < deadline:
            timeout = max(0.01, min(0.2, deadline - time.time()))
            try:
                event = self.events.get(timeout=timeout)
            except queue.Empty:
                continue
            self.write_event(event)
            self.observe_event(event, active)

    def observe_event(self, event: dict[str, Any], active: TrialResult | None = None) -> None:
        msg = nested_json(event)
        event_type = str(msg.get("type") or "")
        event_name = str(msg.get("event") or "")
        source = str(event.get("source") or "")
        now_s = event_time_s(event)

        if event_type == "drone_telemetry" and msg.get("nodeId") == self.args.node_id:
            self.latest_telemetry_by_node[self.args.node_id] = (now_s, msg)
            if active is not None:
                active.telemetry_rows += 1
                seq = msg.get("sequenceId")
                if isinstance(seq, int):
                    active.telemetry_seq_events.append((now_s, seq))
                    if len(active.simulated_seq_ids) >= active.cycles:
                        threshold = (active.simulated_seq_ids[-1] + 1) & 0xFF
                        if seq_after_or_equal(seq, threshold) and active.post_seq is None:
                            active.post_seq = seq
                            active.post_telemetry_s = now_s

        if active is None:
            return

        if event_type == "command_ack" and msg.get("commandId") == active.command_id:
            active.ack_s = now_s
            active.ack_accepted = msg.get("accepted") is not False
            if not active.ack_accepted:
                active.notes.append(f"command rejected: {msg.get('reason') or msg.get('message') or '-'}")
        elif (
            source == "drone"
            and event_type == "drone_debug_event"
            and event_name == "telemetry_rf_loss_simulated"
            and msg.get("nodeId") == self.args.node_id
        ):
            seq = msg.get("sequenceId")
            if isinstance(seq, int):
                active.simulated_seq_ids.append(seq)
            active.simulated_event_s.append(now_s)
        elif event_type == "drone_link_status" and msg.get("nodeId") == self.args.node_id:
            state = str(msg.get("state") or "")
            if state and state not in {"online", "live"}:
                active.non_online_link_events.append(f"{state}:{msg.get('reason') or '-'}")
        elif event_type == "assignment_event" and msg.get("nodeId") == self.args.node_id:
            if event_name in {
                "join_request_received",
                "assign_sent",
                "join_ack_received",
                "late_join_ack_received",
                "assignment_completed",
                "telemetry_period_locked",
            }:
                active.rebind_events.append(event_name)
        elif event_type in {"search_event", "scanner_event"}:
            if event_name.startswith("auto_shared_rx_") or event_name.startswith("operator_shared_rx_"):
                active.rebind_events.append(event_name)

    def wait_for_baseline(self, timeout: float | None = None, marker_prefix: str = "baseline") -> bool:
        deadline = time.time() + (self.args.baseline_timeout if timeout is None else timeout)
        self.marker(f"{marker_prefix}_wait_started", nodeId=self.args.node_id)
        while time.time() < deadline:
            self.drain_events(0.25)
            row = self.latest_telemetry_by_node.get(self.args.node_id)
            if row is not None and time.time() - row[0] <= 2.0:
                self.marker(f"{marker_prefix}_ready", nodeId=self.args.node_id, sequenceId=row[1].get("sequenceId"))
                return True
        self.marker(f"{marker_prefix}_timeout", nodeId=self.args.node_id)
        return False

    def send_drone_rf_loss(self, cycles: int, trial: int) -> tuple[str, float]:
        command_id = f"rf-bench-{cycles}-{trial:02d}"
        payload = {
            "type": "command",
            "command": "debug_simulate_rf_loss",
            "commandId": command_id,
            "cycles": cycles,
        }
        started_s = time.time()
        self.peers["drone"].send_json(payload)
        return command_id, started_s

    def run_trial(self, cycles: int, trial: int) -> TrialResult:
        self.drain_events(self.args.settle)
        baseline = self.latest_telemetry_by_node.get(self.args.node_id)
        result = TrialResult(
            cycles=cycles,
            trial=trial,
            command_id="",
            started_s=time.time(),
        )
        if baseline is not None:
            result.pre_telemetry_s = baseline[0]
            seq = baseline[1].get("sequenceId")
            if isinstance(seq, int):
                result.pre_seq = seq
        else:
            result.notes.append("no baseline telemetry before command")

        command_id, started_s = self.send_drone_rf_loss(cycles, trial)
        result.command_id = command_id
        result.started_s = started_s
        self.marker(
            "trial_start",
            cycles=cycles,
            trial=trial,
            commandId=command_id,
            preSequenceId=result.pre_seq,
        )

        deadline = time.time() + self.args.trial_timeout
        while time.time() < deadline:
            self.drain_events(0.1, result)
            if (
                result.ack_s is not None
                and len(result.simulated_seq_ids) >= cycles
                and result.post_seq is not None
            ):
                break
        if result.ack_s is None:
            result.notes.append("missing command_ack")
        if len(result.simulated_seq_ids) < cycles:
            result.notes.append(f"simulated {len(result.simulated_seq_ids)}/{cycles}")
        if result.post_seq is None:
            result.notes.append("missing post-loss telemetry")
        if not result.expected_gap_seen:
            result.notes.append("expected simulated sequence gap not fully observed")

        self.results.append(result)
        self.marker(
            "trial_complete",
            cycles=cycles,
            trial=trial,
            commandId=command_id,
            ackAccepted=result.ack_accepted,
            recovered=result.recovered,
            expectedGapSeen=result.expected_gap_seen,
            preSequenceId=result.pre_seq,
            postSequenceId=result.post_seq,
            simulatedSequenceIds=result.simulated_seq_ids,
            observedMissingSequenceIds=result.observed_missing,
            preSimulationMissingSequenceIds=result.pre_simulation_missing,
            postSimulationExtraSequenceIds=result.post_simulation_extra_missing,
            gapMs=result.gap_ms,
            commandToResumeMs=result.command_to_resume_ms,
            nonOnlineLinkEvents=result.non_online_link_events,
            rebindEvents=result.rebind_events,
            notes=result.notes,
        )
        return result

    def run(self) -> None:
        self.marker(
            "bench_start",
            telegc=self.args.telegc,
            drone=self.args.drone,
            nodeId=self.args.node_id,
            cycles=self.args.cycles,
            trials=self.args.trials,
        )
        self.drain_events(self.args.startup_delay)
        self.send_status_commands()
        self.drain_events(1.0)
        if not self.wait_for_baseline(timeout=min(6.0, self.args.baseline_timeout), marker_prefix="initial_baseline"):
            if not self.args.prepare_bind or not self.prepare_bind_baseline():
                raise RuntimeError(f"No recent TeleGC drone_telemetry for node {self.args.node_id}")
        for cycles in self.args.cycles:
            self.marker("batch_start", cycles=cycles)
            for trial in range(1, self.args.trials + 1):
                result = self.run_trial(cycles, trial)
                status = "PASS" if result.recovered and result.expected_gap_seen and not result.non_online_link_events else "FAIL"
                print(
                    f"{cycles} lost packets trial {trial:02d}: {status} "
                    f"pre={result.pre_seq} post={result.post_seq} "
                    f"missing={result.observed_missing} gapMs={fmt_num(result.gap_ms)} "
                    f"notes={'; '.join(result.notes) or '-'}",
                    flush=True,
                )
                self.drain_events(self.args.between_trials)
            self.marker("batch_complete", cycles=cycles)
        self.marker("bench_complete")
        self.write_summary()

    def send_status_commands(self) -> None:
        self.status_counter += 1
        suffix = f"{self.status_counter:04d}"
        for target, command in (("telegc", "get_status"), ("magc", "get_status")):
            payload = {
                "type": "command",
                "target": target,
                "command": command,
                "commandId": f"rf-bench-{target}-status-{suffix}",
            }
            self.peers["telegc"].send_json(payload)
        self.peers["drone"].send_json({
            "type": "command",
            "command": "get_status",
            "commandId": f"rf-bench-drone-status-{suffix}",
        })

    def prepare_bind_baseline(self) -> bool:
        """Recover a live baseline after USB serial reset restarts TeleGC/drone."""
        self.marker("prepare_bind_started", nodeId=self.args.node_id)
        deadline = time.time() + self.args.prepare_timeout
        next_status_s = 0.0
        next_attempt_s = 0.0
        join_at_s = 0.0
        bind_attempt = 0
        join_sent_for_attempt = False

        while time.time() < deadline:
            now_s = time.time()
            if now_s >= next_status_s:
                self.send_status_commands()
                next_status_s = now_s + 5.0

            if now_s >= next_attempt_s:
                bind_attempt += 1
                join_sent_for_attempt = False
                restart_id = f"rf-bench-prepare-restart-join-{bind_attempt:02d}"
                self.peers["drone"].send_json({
                    "type": "command",
                    "command": "debug_restart_join",
                    "commandId": restart_id,
                    "hold": True,
                })
                self.marker("prepare_restart_join_sent", commandId=restart_id, attempt=bind_attempt)

                command_id = f"rf-bench-prepare-bind-{bind_attempt:02d}"
                self.peers["telegc"].send_json({
                    "type": "command",
                    "target": "magc",
                    "command": "start_search",
                    "commandId": command_id,
                })
                self.marker("prepare_bind_sent", commandId=command_id, attempt=bind_attempt)
                join_at_s = now_s + self.args.prepare_join_delay
                next_attempt_s = now_s + self.args.prepare_cycle_interval

            if not join_sent_for_attempt and join_at_s > 0.0 and now_s >= join_at_s:
                command_id = f"rf-bench-prepare-join-now-{bind_attempt:02d}"
                self.peers["drone"].send_json({
                    "type": "command",
                    "command": "debug_send_join_request",
                    "commandId": command_id,
                })
                self.marker("prepare_join_now_sent", commandId=command_id, attempt=bind_attempt)
                join_sent_for_attempt = True

            self.drain_events(0.25)
            row = self.latest_telemetry_by_node.get(self.args.node_id)
            if row is not None and time.time() - row[0] <= 2.0:
                self.marker("prepare_bind_ready", nodeId=self.args.node_id, sequenceId=row[1].get("sequenceId"))
                return True

        self.marker("prepare_bind_timeout", nodeId=self.args.node_id)
        return False

    def write_summary(self) -> None:
        self.summary_path.parent.mkdir(parents=True, exist_ok=True)
        lines: list[str] = []
        lines.append("# RF Loss Bench Summary")
        lines.append("")
        lines.append(f"- TeleGC: `{self.args.telegc}`")
        lines.append(f"- Drone: `{self.args.drone}`")
        lines.append(f"- Node: `{self.args.node_id}`")
        lines.append(f"- Log: `{self.log_path}`")
        lines.append("")
        lines.append("## Per-Trial Results")
        lines.append("")
        lines.append("| Lost packets | Trial | Result | Sim seq IDs | Pre-sim missing | Post-sim extra | Observed missing | Missing count | Extra missing | Gap ms | Cmd->resume ms | Link state events | Rebind events | Notes |")
        lines.append("|---:|---:|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|")
        for result in self.results:
            passed = result.recovered and result.expected_gap_seen and not result.non_online_link_events
            lines.append(
                "| "
                f"{result.cycles} | {result.trial} | {'PASS' if passed else 'FAIL'} | "
                f"{fmt_list(result.simulated_seq_ids)} | "
                f"{fmt_list(result.pre_simulation_missing)} | {fmt_list(result.post_simulation_extra_missing)} | "
                f"{fmt_list(result.observed_missing)} | "
                f"{fmt_num(result.observed_missing_count)} | {fmt_signed(result.extra_missing_count)} | "
                f"{fmt_num(result.gap_ms)} | {fmt_num(result.command_to_resume_ms)} | "
                f"{len(result.non_online_link_events)} | {len(result.rebind_events)} | "
                f"{'; '.join(result.notes) or '-'} |"
            )
        lines.append("")
        lines.append("## Batch Summary")
        lines.append("")
        lines.append("| Lost packets | Pass | Gap seen | Recovered | Non-online link events | Rebind trials | Rebind events | Avg pre-sim missing | Avg post-sim extra | Avg missing count | Std missing count | Avg extra missing | Max extra missing | Avg gap ms | Std gap ms | Max gap ms | Avg cmd->resume ms | Std cmd->resume ms |")
        lines.append("|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
        for cycles in self.args.cycles:
            rows = [item for item in self.results if item.cycles == cycles]
            pass_count = sum(1 for item in rows if item.recovered and item.expected_gap_seen and not item.non_online_link_events)
            gap_seen = sum(1 for item in rows if item.expected_gap_seen)
            recovered = sum(1 for item in rows if item.recovered)
            link_events = sum(len(item.non_online_link_events) for item in rows)
            rebind_trials = sum(1 for item in rows if item.rebind_events)
            rebind_events = sum(len(item.rebind_events) for item in rows)
            gaps = [item.gap_ms for item in rows if item.gap_ms is not None]
            resumes = [item.command_to_resume_ms for item in rows if item.command_to_resume_ms is not None]
            missing_counts = [
                float(item.observed_missing_count)
                for item in rows
                if item.observed_missing_count is not None
            ]
            pre_sim_counts = [float(len(item.pre_simulation_missing)) for item in rows if item.simulated_seq_ids]
            post_sim_counts = [float(len(item.post_simulation_extra_missing)) for item in rows if item.simulated_seq_ids]
            extra_counts = [
                float(item.extra_missing_count)
                for item in rows
                if item.extra_missing_count is not None
            ]
            lines.append(
                "| "
                f"{cycles} | {pass_count}/{len(rows)} | {gap_seen}/{len(rows)} | {recovered}/{len(rows)} | "
                f"{link_events} | {rebind_trials}/{len(rows)} | {rebind_events} | "
                f"{fmt_num(mean(pre_sim_counts))} | {fmt_num(mean(post_sim_counts))} | "
                f"{fmt_num(mean(missing_counts))} | {fmt_num(stdev(missing_counts))} | "
                f"{fmt_signed(mean(extra_counts))} | {fmt_signed(max(extra_counts) if extra_counts else None)} | "
                f"{fmt_num(mean(gaps))} | {fmt_num(stdev(gaps))} | {fmt_num(max(gaps) if gaps else None)} | "
                f"{fmt_num(mean(resumes))} | {fmt_num(stdev(resumes))} |"
            )
        lines.append("")
        lines.append("## Interpretation")
        lines.append("")
        lines.append("- PASS means TeleGC observed the simulated sequence gap, telemetry resumed, and no non-online link status was emitted during the trial window.")
        lines.append("- Rebind events are counted separately. For 2-5 missed packets, the desired behavior is normally no full bind; the link should bridge the short RF loss without user-visible interruption.")
        self.summary_path.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")


def mean(values: list[float]) -> float | None:
    return statistics.mean(values) if values else None


def stdev(values: list[float]) -> float | None:
    if not values:
        return None
    if len(values) == 1:
        return 0.0
    return statistics.stdev(values)


def fmt_num(value: float | None) -> str:
    if value is None:
        return "-"
    return f"{value:0.0f}"


def fmt_signed(value: float | None) -> str:
    if value is None:
        return "-"
    return f"{value:+0.0f}"


def fmt_list(values: list[int]) -> str:
    return ",".join(str(value) for value in values) if values else "-"


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run repeated simulated RF-loss bench tests")
    parser.add_argument("--telegc", default="COM16", help="TeleGC USB serial port")
    parser.add_argument("--drone", default="COM13", help="Drone USB serial port")
    parser.add_argument("--baud", type=int, default=921600)
    parser.add_argument("--node-id", type=int, default=7)
    parser.add_argument("--cycles", type=int, nargs="+", default=[2, 3, 4, 5])
    parser.add_argument("--trials", type=int, default=10)
    parser.add_argument("--startup-delay", type=float, default=3.0)
    parser.add_argument("--baseline-timeout", type=float, default=20.0)
    parser.add_argument("--prepare-bind", dest="prepare_bind", action="store_true", default=True)
    parser.add_argument("--no-prepare-bind", dest="prepare_bind", action="store_false")
    parser.add_argument("--prepare-timeout", type=float, default=60.0)
    parser.add_argument("--prepare-join-delay", type=float, default=1.0)
    parser.add_argument("--prepare-cycle-interval", type=float, default=16.0)
    parser.add_argument("--trial-timeout", type=float, default=6.0)
    parser.add_argument("--settle", type=float, default=0.8)
    parser.add_argument("--between-trials", type=float, default=0.6)
    parser.add_argument("--log", default="logs_summary/rf_loss_bench_40.jsonl")
    parser.add_argument("--summary", default="logs_summary/rf_loss_bench_40_summary.md")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    with BenchRunner(args) as runner:
        runner.run()
    print(f"Wrote log: {args.log}")
    print(f"Wrote summary: {args.summary}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
