#!/usr/bin/env python3
"""Measure repeated drone-reset to MaGC bind timing.

This harness keeps TeleGC and drone serial ports open, reboots the drone for
each trial, starts normal MaGC bind when the drone enters shared-channel JOIN
mode, and records MaGC bind timing events.
"""

from __future__ import annotations

import argparse
import json
import math
import queue
import statistics
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from sgc_live_debug import SerialPeer, send_canned, utc_now_iso


@dataclass
class TrialResult:
    trial: int
    success: bool = False
    reset_to_join_mode_s: float | None = None
    reset_to_drone_join_tx_s: float | None = None
    reset_to_bind_0_s: float | None = None
    reset_to_assign_sent_s: float | None = None
    reset_to_join_ack_s: float | None = None
    reset_to_bind_100_s: float | None = None
    bind_0_to_100_s: float | None = None
    channel_index: int | None = None
    frequency_mhz: float | None = None
    tx_period_ms: int | None = None
    notes: str = ""


def monotonic_ms() -> int:
    return int(time.monotonic() * 1000)


def fmt(value: float | None) -> str:
    if value is None or math.isnan(value):
        return "-"
    return f"{value:.3f}"


def mean_std(values: list[float]) -> tuple[float | None, float | None]:
    if not values:
        return None, None
    mean = statistics.mean(values)
    std = statistics.stdev(values) if len(values) > 1 else 0.0
    return mean, std


def json_msg(event: dict[str, Any]) -> dict[str, Any]:
    msg = event.get("json")
    return msg if isinstance(msg, dict) else {}


def write_jsonl(handle: Any, record: dict[str, Any]) -> None:
    if handle is None:
        return
    handle.write(json.dumps(record, separators=(",", ":")) + "\n")
    handle.flush()


def marker(text: str, trial: int | None = None) -> dict[str, Any]:
    record: dict[str, Any] = {
        "kind": "marker",
        "source": "measure_bind_timing",
        "raw": text,
        "timestamp": utc_now_iso(),
        "hostMonotonicMs": monotonic_ms(),
    }
    if trial is not None:
        record["trial"] = trial
    return record


def write_summary(path: Path, results: list[TrialResult], log_path: Path, args: argparse.Namespace) -> None:
    bind0_values = [item.reset_to_bind_0_s for item in results if item.reset_to_bind_0_s is not None]
    bind100_values = [item.reset_to_bind_100_s for item in results if item.reset_to_bind_100_s is not None]
    tx_values = [item.reset_to_drone_join_tx_s for item in results if item.reset_to_drone_join_tx_s is not None]
    b0_to_b100_values = [item.bind_0_to_100_s for item in results if item.bind_0_to_100_s is not None]
    bind0_mean, bind0_std = mean_std(bind0_values)
    bind100_mean, bind100_std = mean_std(bind100_values)
    tx_mean, tx_std = mean_std(tx_values)
    b0_to_b100_mean, b0_to_b100_std = mean_std(b0_to_b100_values)

    lines: list[str] = []
    lines.append("# MaGC Bind Timing From Drone Reset")
    lines.append("")
    lines.append(f"- Created: {datetime.now(timezone.utc).isoformat(timespec='seconds')}")
    lines.append(f"- Log: `{log_path}`")
    lines.append(f"- TeleGC: `{args.telegc}`")
    lines.append(f"- Drone: `{args.drone}`")
    lines.append(f"- Trials requested: {args.count}")
    lines.append(f"- Successful trials: {sum(1 for item in results if item.success)}")
    lines.append("- Reset origin: host timestamp when `debug_reboot` is sent to the drone.")
    lines.append("- MaGC 0% bind: first MaGC `join_request_received` / quiet bind-progress event.")
    lines.append("- MaGC 100% bind: first MaGC `telemetry_period_locked` / complete bind-progress event.")
    lines.append("")
    lines.append("## Trial Table")
    lines.append("")
    lines.append("| Trial | Success | Reset->join mode s | Reset->JOIN TX s | Reset->0% s | Reset->100% s | 0%->100% s | Channel | Notes |")
    lines.append("|---:|:---:|---:|---:|---:|---:|---:|---:|---|")
    for item in results:
        channel = "-"
        if item.channel_index is not None:
            channel = str(item.channel_index)
            if item.frequency_mhz is not None:
                channel += f" / {item.frequency_mhz:g} MHz"
        lines.append(
            f"| {item.trial} | {'yes' if item.success else 'no'} | "
            f"{fmt(item.reset_to_join_mode_s)} | {fmt(item.reset_to_drone_join_tx_s)} | "
            f"{fmt(item.reset_to_bind_0_s)} | {fmt(item.reset_to_bind_100_s)} | "
            f"{fmt(item.bind_0_to_100_s)} | {channel} | {item.notes or '-'} |"
        )

    lines.append("")
    lines.append("## Summary Statistics")
    lines.append("")
    lines.append("| Metric | N | Average s | Std dev s |")
    lines.append("|---|---:|---:|---:|")
    lines.append(f"| Reset->drone JOIN TX | {len(tx_values)} | {fmt(tx_mean)} | {fmt(tx_std)} |")
    lines.append(f"| Reset->MaGC 0% bind | {len(bind0_values)} | {fmt(bind0_mean)} | {fmt(bind0_std)} |")
    lines.append(f"| Reset->MaGC 100% bind | {len(bind100_values)} | {fmt(bind100_mean)} | {fmt(bind100_std)} |")
    lines.append(f"| MaGC 0%->100% bind | {len(b0_to_b100_values)} | {fmt(b0_to_b100_mean)} | {fmt(b0_to_b100_std)} |")
    lines.append("")

    max_100 = max(bind100_values) if bind100_values else 0.0
    if max_100 > 0:
        lines.append("## Reset To 100% Chart")
        lines.append("")
        for item in results:
            if item.reset_to_bind_100_s is None:
                bar = ""
            else:
                width = max(1, round((item.reset_to_bind_100_s / max_100) * 32))
                bar = "#" * width
            lines.append(f"- Trial {item.trial:02d}: `{bar}` {fmt(item.reset_to_bind_100_s)}s")
        lines.append("")

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")


def run_trial(
    trial: int,
    peers: dict[str, SerialPeer],
    events: queue.Queue[dict[str, Any]],
    command_counter: list[int],
    log_handle: Any,
    line_index: list[int],
    args: argparse.Namespace,
) -> TrialResult:
    result = TrialResult(trial=trial)
    write_jsonl(log_handle, {**marker(f"trial {trial} start", trial), "lineIndex": line_index[0]})
    line_index[0] += 1

    reset_t = time.monotonic()
    send_canned(peers, "drone", "reboot", [str(args.reboot_delay_ms)], command_counter)
    write_jsonl(log_handle, {**marker(f"trial {trial} reset_sent", trial), "lineIndex": line_index[0]})
    line_index[0] += 1

    bind_started = False
    bind_active = False
    bind_send_count = 0
    last_bind_send_t: float | None = None
    deadline = reset_t + args.trial_timeout

    def send_bind(reason: str) -> None:
        nonlocal bind_started, bind_send_count, last_bind_send_t
        send_canned(peers, "magc", "bind", [], command_counter)
        bind_started = True
        bind_send_count += 1
        last_bind_send_t = time.monotonic()
        write_jsonl(log_handle, {
            **marker(f"trial {trial} magc_bind_sent {reason} attempt={bind_send_count}", trial),
            "lineIndex": line_index[0],
        })
        line_index[0] += 1

    while time.monotonic() < deadline:
        try:
            event = events.get(timeout=0.25)
        except queue.Empty:
            if (
                bind_started and
                not bind_active and
                last_bind_send_t is not None and
                time.monotonic() - last_bind_send_t >= args.bind_retry_interval
            ):
                send_bind("retry_no_ack")
            continue

        event_time = time.monotonic()
        record = dict(event)
        record["trial"] = trial
        record["hostMonotonicMs"] = monotonic_ms()
        record["lineIndex"] = line_index[0]
        line_index[0] += 1
        write_jsonl(log_handle, record)

        msg = json_msg(event)
        event_type = msg.get("type")
        event_name = msg.get("event")
        node_id = msg.get("nodeId")
        elapsed_s = event_time - reset_t
        join_event_after_reset = elapsed_s >= args.ignore_join_events_before_s

        if (
            event_type == "command_ack" and
            msg.get("command") == "start_search" and
            msg.get("target") == "magc" and
            msg.get("accepted") is not False
        ):
            bind_active = True
        elif event_type == "search_event" and str(event_name or "").startswith("operator_shared_rx_"):
            bind_active = True

        if (
            not bind_started and
            join_event_after_reset and
            event.get("source") == "drone" and
            event_type == "drone_join_event" and
            event_name in {"join_start_shared_channel", "join_request_sent"}
        ):
            if event_name == "join_start_shared_channel":
                result.reset_to_join_mode_s = result.reset_to_join_mode_s or elapsed_s
            send_bind(str(event_name))

        if (
            join_event_after_reset and
            event.get("source") == "drone" and
            event_type == "drone_join_event" and
            event_name == "join_start_shared_channel" and
            result.reset_to_join_mode_s is None
        ):
            result.reset_to_join_mode_s = elapsed_s

        if (
            join_event_after_reset and
            event.get("source") == "drone" and
            event_type == "drone_join_event" and
            event_name == "join_request_sent" and
            result.reset_to_drone_join_tx_s is None
        ):
            result.reset_to_drone_join_tx_s = elapsed_s

        if node_id != args.node_id:
            continue

        if event_type == "assignment_event":
            if event_name == "join_request_received" and result.reset_to_bind_0_s is None:
                result.reset_to_bind_0_s = elapsed_s
            elif event_name == "assign_sent" and result.reset_to_assign_sent_s is None:
                result.reset_to_assign_sent_s = elapsed_s
                result.channel_index = msg.get("channelIndex")
                result.frequency_mhz = msg.get("frequencyMhz")
                result.tx_period_ms = msg.get("txPeriodMs")
            elif event_name == "join_ack_received" and result.reset_to_join_ack_s is None:
                result.reset_to_join_ack_s = elapsed_s
            elif event_name == "telemetry_period_locked" and result.reset_to_bind_100_s is None:
                result.reset_to_bind_100_s = elapsed_s
                result.success = True
                break
        elif event_type == "bind_progress_event":
            phase = msg.get("phase")
            if phase == "quiet" and result.reset_to_bind_0_s is None:
                result.reset_to_bind_0_s = elapsed_s
            elif phase == "complete" and result.reset_to_bind_100_s is None:
                result.reset_to_bind_100_s = elapsed_s
                result.success = True
                break

    if result.reset_to_bind_0_s is not None and result.reset_to_bind_100_s is not None:
        result.bind_0_to_100_s = result.reset_to_bind_100_s - result.reset_to_bind_0_s
    if not result.success and not result.notes:
        result.notes = "timeout"
    if bind_send_count > 1:
        result.notes = (result.notes + "; " if result.notes else "") + f"magc_bind_attempts={bind_send_count}"

    settle_deadline = time.monotonic() + args.settle
    while time.monotonic() < settle_deadline:
        try:
            event = events.get(timeout=0.1)
        except queue.Empty:
            continue
        record = dict(event)
        record["trial"] = trial
        record["hostMonotonicMs"] = monotonic_ms()
        record["lineIndex"] = line_index[0]
        line_index[0] += 1
        write_jsonl(log_handle, record)

    write_jsonl(log_handle, {
        **marker(f"trial {trial} complete success={result.success}", trial),
        "result": asdict(result),
        "lineIndex": line_index[0],
    })
    line_index[0] += 1
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Measure repeated reset-to-bind timing on a live dual-GC bench")
    parser.add_argument("--telegc", required=True, help="TeleGC USB port, e.g. COM16")
    parser.add_argument("--drone", required=True, help="Drone USB port, e.g. COM13")
    parser.add_argument("--baud", type=int, default=921600)
    parser.add_argument("--node-id", type=int, default=7)
    parser.add_argument("--count", type=int, default=10)
    parser.add_argument("--startup-delay", type=float, default=24.0)
    parser.add_argument("--trial-timeout", type=float, default=70.0)
    parser.add_argument("--settle", type=float, default=2.0)
    parser.add_argument("--reboot-delay-ms", type=int, default=250)
    parser.add_argument("--ignore-join-events-before-s", type=float, default=5.0)
    parser.add_argument("--bind-retry-interval", type=float, default=3.0)
    parser.add_argument("--log", default="logs_summary/bind_timing_reset_10.jsonl")
    parser.add_argument("--summary", default="logs_summary/bind_timing_reset_10_summary.md")
    args = parser.parse_args()

    events: queue.Queue[dict[str, Any]] = queue.Queue()
    peers = {
        "telegc": SerialPeer("telegc", args.telegc, args.baud, events),
        "drone": SerialPeer("drone", args.drone, args.baud, events),
    }
    command_counter = [0]
    line_index = [1]
    log_path = Path(args.log)
    summary_path = Path(args.summary)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    results: list[TrialResult] = []

    with log_path.open("w", encoding="utf-8", newline="\n") as log_handle:
        try:
            for peer in peers.values():
                peer.start()
            write_jsonl(log_handle, {**marker(f"startup_delay {args.startup_delay:.1f}s"), "lineIndex": line_index[0]})
            line_index[0] += 1
            time.sleep(max(0.0, args.startup_delay))

            while not events.empty():
                event = events.get_nowait()
                record = dict(event)
                record["hostMonotonicMs"] = monotonic_ms()
                record["lineIndex"] = line_index[0]
                line_index[0] += 1
                write_jsonl(log_handle, record)

            for trial in range(1, args.count + 1):
                print(f"trial {trial}/{args.count}...")
                result = run_trial(trial, peers, events, command_counter, log_handle, line_index, args)
                results.append(result)
                print(
                    f"  success={result.success} "
                    f"0%={fmt(result.reset_to_bind_0_s)}s "
                    f"100%={fmt(result.reset_to_bind_100_s)}s"
                )
        finally:
            for peer in peers.values():
                peer.close()

    write_summary(summary_path, results, log_path, args)
    print(f"wrote {log_path}")
    print(f"wrote {summary_path}")
    return 0 if all(item.success for item in results) else 2


if __name__ == "__main__":
    raise SystemExit(main())
