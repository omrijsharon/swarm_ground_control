#!/usr/bin/env python3
"""Summarize SGC/tool live-debug JSONL logs as Markdown."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any


def parse_jsonl(path: Path) -> tuple[list[dict[str, Any]], int]:
    records: list[dict[str, Any]] = []
    malformed = 0
    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for raw in handle:
            line = raw.strip()
            if not line:
                continue
            try:
                parsed = json.loads(line)
            except Exception:
                malformed += 1
                continue
            if isinstance(parsed, dict):
                records.append(parsed)
            else:
                malformed += 1
    return records, malformed


def nested_message(record: dict[str, Any]) -> dict[str, Any]:
    nested = record.get("json")
    if isinstance(nested, dict):
        return nested
    raw = record.get("raw")
    if isinstance(raw, str) and raw.startswith("{"):
        try:
            parsed = json.loads(raw)
        except Exception:
            parsed = None
        if isinstance(parsed, dict):
            return parsed
    return record


def looks_like_json_fragment(text: str) -> bool:
    """Detect chopped JSON payloads that no longer start with `{`."""
    if not text:
        return False
    if any(token in text for token in ('"messageId"', '"sourceRole"', '"commandId"', '"nodeId"', '"event"')):
        return True
    return text.startswith((',"', ':"', 'e,"', 'ype"', 'ource"', 'essageId"', 'ommandId"'))


def is_operator_rx_event(event: Any) -> bool:
    event_name = str(event or "")
    return event_name.startswith("operator_shared_rx_") or event_name.startswith("operator_discovery_")


def record_time_ms(record: dict[str, Any]) -> float | None:
    for key in ("pcElapsedMs", "elapsedMs"):
        value = record.get(key)
        if isinstance(value, (int, float)):
            return float(value)
    ts = record.get("timestamp") or record.get("pcTimeIso")
    if not isinstance(ts, str):
        return None
    try:
        normalized = ts.replace("Z", "+00:00")
        return datetime.fromisoformat(normalized).timestamp() * 1000.0
    except Exception:
        return None


def format_t(seconds: float | None) -> str:
    if seconds is None:
        return "t+?"
    return f"t+{seconds:0.3f}s"


def short_value(value: Any) -> str:
    if value is None:
        return "-"
    if isinstance(value, float):
        return f"{value:0.3f}".rstrip("0").rstrip(".")
    return str(value)


def number_value(value: Any) -> float | None:
    if isinstance(value, (int, float)):
        return float(value)
    return None


def mean_or_none(values: list[float]) -> float | None:
    if not values:
        return None
    return sum(values) / len(values)


def format_number(value: float | None) -> str:
    if value is None:
        return "-"
    return f"{value:0.1f}"


def format_signed(value: float | None) -> str:
    if value is None:
        return "-"
    return f"{value:+0.1f}"


def seq_gap(before: int | None, after: int | None) -> list[int]:
    if before is None or after is None:
        return []
    missing: list[int] = []
    cursor = (before + 1) & 0xFF
    while cursor != after and len(missing) <= 255:
        missing.append(cursor)
        cursor = (cursor + 1) & 0xFF
    return missing


def line_summary(record: dict[str, Any], first_ms: float | None) -> tuple[float | None, dict[str, Any], str]:
    msg = nested_message(record)
    ms = record_time_ms(record)
    rel = None
    if ms is not None:
        rel = (ms - first_ms) / 1000.0 if first_ms is not None and ms > 1000000000000 else ms / 1000.0
    event_type = str(msg.get("type") or record.get("diagnosticEvent") or msg.get("diagnosticEvent") or "")
    return rel, msg, event_type


def detect_flicker(state_rows: list[tuple[float | None, int, str, str]]) -> list[str]:
    by_node: dict[int, list[tuple[float | None, str, str]]] = defaultdict(list)
    for rel, node_id, source, state in state_rows:
        by_node[node_id].append((rel, source, state))

    findings: list[str] = []
    for node_id, rows in sorted(by_node.items()):
        transitions = []
        previous_state = None
        previous_time = None
        for rel, source, state in rows:
            if state == previous_state:
                continue
            if previous_state is not None:
                transitions.append((previous_time, rel, previous_state, state, source))
            previous_state = state
            previous_time = rel
        rapid = [
            item for item in transitions
            if item[0] is not None and item[1] is not None and abs(item[1] - item[0]) <= 2.0
        ]
        if rapid:
            details = ", ".join(
                f"{format_t(item[1])} {item[2]}->{item[3]}" for item in rapid[:6]
            )
            suffix = "" if len(rapid) <= 6 else f", +{len(rapid) - 6} more"
            findings.append(f"- Node {node_id}: {len(rapid)} rapid state transitions: {details}{suffix}")
    return findings


def analyze(records: list[dict[str, Any]], malformed: int, source: Path) -> str:
    first_ms = next((record_time_ms(record) for record in records if record_time_ms(record) is not None), None)
    last_ms = next((record_time_ms(record) for record in reversed(records) if record_time_ms(record) is not None), None)
    duration_s = None
    if first_ms is not None and last_ms is not None:
        duration_s = max(0.0, (last_ms - first_ms) / 1000.0)

    command_txs: dict[str, dict[str, Any]] = {}
    command_acks: list[tuple[float | None, dict[str, Any]]] = []
    bind_rows: list[tuple[float | None, dict[str, Any]]] = []
    search_rows: list[tuple[float | None, dict[str, Any]]] = []
    scanner_rows: list[tuple[float | None, dict[str, Any]]] = []
    channel_scan_rows: list[tuple[float | None, dict[str, Any]]] = []
    orphan_rows: list[tuple[float | None, dict[str, Any]]] = []
    operator_rx_rows: list[tuple[float | None, dict[str, Any]]] = []
    auto_rx_rows: list[tuple[float | None, dict[str, Any]]] = []
    empty_rx_rows: list[tuple[float | None, dict[str, Any]]] = []
    post_bind_rows: list[tuple[float | None, dict[str, Any]]] = []
    fairness_rows: list[tuple[float | None, dict[str, Any]]] = []
    receiver_budget_rows: list[tuple[float | None, dict[str, Any]]] = []
    assignment_rows: list[tuple[float | None, dict[str, Any]]] = []
    drone_join_rows: list[tuple[float | None, dict[str, Any]]] = []
    drone_debug_rows: list[tuple[float | None, dict[str, Any]]] = []
    telemetry_rows: list[tuple[float | None, dict[str, Any]]] = []
    telemetry_rebind_rows: list[tuple[float | None, dict[str, Any]]] = []
    short_loss_rows: list[tuple[float | None, dict[str, Any]]] = []
    bench_trial_rows: list[tuple[float | None, dict[str, Any]]] = []
    manual_bind_marker_rows: list[tuple[float | None, dict[str, Any]]] = []
    rf_loss_only_marker_rows: list[tuple[float | None, dict[str, Any]]] = []
    broken_link_marker_rows: list[tuple[float | None, dict[str, Any]]] = []
    gc_status_rows: list[tuple[float | None, dict[str, Any]]] = []
    inter_gc_status_rows: list[tuple[float | None, dict[str, Any]]] = []
    command_queued_rows: list[tuple[float | None, dict[str, Any]]] = []
    scenario_metric_rows: list[tuple[float | None, str]] = []
    scenario_fail_rows: list[tuple[float | None, str]] = []
    stalls: list[tuple[float | None, dict[str, Any]]] = []
    state_rows: list[tuple[float | None, int, str, str]] = []
    malformed_rx_rows: list[tuple[float | None, str, str]] = []
    suspicious_fragment_rows: list[tuple[float | None, str, str]] = []
    suspicious_type_rows: list[tuple[float | None, str]] = []
    event_counts: Counter[str] = Counter()
    join_events: Counter[str] = Counter()
    assignment_events: Counter[str] = Counter()
    channel_scan_events: Counter[str] = Counter()
    orphan_events: Counter[str] = Counter()

    for record in records:
        rel, msg, event_type = line_summary(record, first_ms)
        raw_text = str(record.get("raw") or "")
        if record.get("kind") == "rx" and raw_text.startswith("{") and not isinstance(record.get("json"), dict):
            malformed_rx_rows.append((rel, str(record.get("source") or ""), raw_text[:120]))
        raw_stripped = raw_text.lstrip()
        if record.get("kind") == "rx" and raw_stripped and not raw_stripped.startswith("{"):
            if looks_like_json_fragment(raw_stripped):
                suspicious_fragment_rows.append((rel, str(record.get("source") or ""), raw_stripped[:120]))
        if raw_text.startswith("scenario_metric "):
            scenario_metric_rows.append((rel, raw_text.removeprefix("scenario_metric ").strip()))
        elif raw_text.startswith("scenario_fail "):
            scenario_fail_rows.append((rel, raw_text.removeprefix("scenario_fail ").strip()))
        if event_type:
            event_counts[event_type] += 1
            if event_type.startswith("search_ost") or "\ufffd" in event_type:
                suspicious_type_rows.append((rel, event_type))

        command_id = msg.get("commandId") or record.get("commandId")
        command = msg.get("command") or record.get("command")
        if record.get("kind") == "tx" and command_id:
            command_txs[str(command_id)] = {
                "rel": rel,
                "command": command,
                "target": msg.get("target") or record.get("target") or record.get("source"),
            }
        elif str(record.get("direction", "")).startswith("sgc_to_") and command_id:
            command_txs[str(command_id)] = {
                "rel": rel,
                "command": command,
                "target": msg.get("target") or record.get("target") or record.get("direction"),
            }

        if event_type == "command_ack":
            command_acks.append((rel, msg))
        elif event_type == "bind_progress_event":
            bind_rows.append((rel, msg))
        elif event_type == "search_event":
            search_rows.append((rel, msg))
            if is_operator_rx_event(msg.get("event")):
                operator_rx_rows.append((rel, msg))
            if str(msg.get("event") or "").startswith("auto_shared_rx_"):
                auto_rx_rows.append((rel, msg))
            if str(msg.get("event") or "").startswith("empty_shared_rx_"):
                empty_rx_rows.append((rel, msg))
        elif event_type == "scanner_event":
            scanner_rows.append((rel, msg))
            if str(msg.get("event") or "").startswith("empty_shared_rx_"):
                empty_rx_rows.append((rel, msg))
            if str(msg.get("event") or "").startswith("post_bind_"):
                post_bind_rows.append((rel, msg))
            if str(msg.get("event") or "") in {
                "rx_candidate_skipped",
                "owed_rx_selected",
                "owed_rx_cleared",
                "owed_rx_missed",
                "owed_service_selected",
                "owed_service_cleared",
            }:
                fairness_rows.append((rel, msg))
            if str(msg.get("event") or "") in {
                "rx_budget_reserved",
                "healthy_service_protected",
                "owed_service_selected",
                "owed_service_cleared",
                "recovery_budget_used",
                "recovery_budget_denied",
                "receiver_budget_overloaded",
            }:
                receiver_budget_rows.append((rel, msg))
        elif event_type == "channel_scan_event":
            channel_scan_rows.append((rel, msg))
            channel_scan_events[str(msg.get("event") or "channel_scan_event")] += 1
        elif event_type == "orphan_recovery_event":
            orphan_rows.append((rel, msg))
            orphan_events[str(msg.get("event") or "orphan_recovery_event")] += 1
        elif event_type == "assignment_event":
            assignment_rows.append((rel, msg))
            assignment_events[str(msg.get("event") or msg.get("reason") or "assignment_event")] += 1
            if str(msg.get("event") or "").startswith("post_bind_"):
                post_bind_rows.append((rel, msg))
        elif event_type == "drone_join_event":
            drone_join_rows.append((rel, msg))
            join_events[str(msg.get("event") or "drone_join_event")] += 1
        elif event_type in {"drone_debug_event", "drone_debug_status"}:
            drone_debug_rows.append((rel, msg))
        elif event_type == "drone_telemetry":
            telemetry_rows.append((rel, msg))
        elif event_type == "telemetry_rebind_event":
            telemetry_rebind_rows.append((rel, msg))
            if str(msg.get("event") or "").startswith("short_loss_"):
                short_loss_rows.append((rel, msg))
        elif event_type == "bench_marker":
            if msg.get("event") == "trial_complete":
                bench_trial_rows.append((rel, msg))
            elif msg.get("event") == "manual_bind_complete":
                manual_bind_marker_rows.append((rel, msg))
            elif msg.get("event") == "rf_loss_only_complete":
                rf_loss_only_marker_rows.append((rel, msg))
            elif msg.get("event") == "broken_link_complete":
                broken_link_marker_rows.append((rel, msg))
        elif event_type == "gc_status":
            gc_status_rows.append((rel, msg))
        elif event_type == "inter_gc_status":
            inter_gc_status_rows.append((rel, msg))
        elif event_type == "inter_gc_command_queued":
            command_queued_rows.append((rel, msg))
        elif event_type == "drone_link_status":
            node = msg.get("nodeId")
            state = msg.get("state")
            if isinstance(node, int) and state:
                state_rows.append((rel, node, "link", str(state)))

        diagnostic_event = str(record.get("diagnosticEvent") or msg.get("diagnosticEvent") or "")
        if diagnostic_event == "bind_progress_stalled":
            stalls.append((rel, record))
        if isinstance(record.get("drones"), list):
            for drone in record["drones"]:
                if isinstance(drone, dict) and isinstance(drone.get("nodeId"), int) and drone.get("displayState"):
                    state_rows.append((rel, drone["nodeId"], "snapshot", str(drone["displayState"])))
        if isinstance(record.get("linkStatuses"), list):
            for item in record["linkStatuses"]:
                if isinstance(item, dict) and isinstance(item.get("nodeId"), int) and item.get("state"):
                    state_rows.append((rel, item["nodeId"], "snapshot", str(item["state"])))

    failed_acks = [msg for _, msg in command_acks if msg.get("accepted") is False]
    ack_id_counts = Counter(str(msg.get("commandId")) for _, msg in command_acks if msg.get("commandId"))
    duplicate_ack_ids = sorted(command_id for command_id, count in ack_id_counts.items() if count > 1)
    acked_ids = set(ack_id_counts)
    pending_ids = sorted(command_id for command_id in command_txs if command_id not in acked_ids)
    latencies = [
        float(msg["ackLatencyMs"])
        for _, msg in command_acks
        if isinstance(msg.get("ackLatencyMs"), (int, float))
    ]
    derived_latencies = []
    for rel, msg in command_acks:
        command_id = msg.get("commandId")
        if not command_id:
            continue
        tx = command_txs.get(str(command_id))
        if tx is None or tx.get("rel") is None or rel is None:
            continue
        derived_latencies.append((rel - float(tx["rel"])) * 1000.0)

    max_reliable_depth = max(
        (int(msg.get("reliableQueueDepth") or 0) for _, msg in inter_gc_status_rows),
        default=0,
    )
    max_event_depth = max(
        (int(msg.get("eventOutboxDepth") or 0) for _, msg in inter_gc_status_rows),
        default=0,
    )
    dropped_high = max((int(msg.get("eventOutboxDroppedHigh") or 0) for _, msg in inter_gc_status_rows), default=0)
    dropped_medium = max((int(msg.get("eventOutboxDroppedMedium") or 0) for _, msg in inter_gc_status_rows), default=0)
    dropped_low = max((int(msg.get("eventOutboxDroppedLow") or 0) for _, msg in inter_gc_status_rows), default=0)
    coalesced_events = max((int(msg.get("eventOutboxCoalesced") or 0) for _, msg in inter_gc_status_rows), default=0)
    compacted_events = max((int(msg.get("eventOutboxCompacted") or 0) for _, msg in inter_gc_status_rows), default=0)
    queue_full_drops = max((int(msg.get("reliableQueueFullDrops") or 0) for _, msg in inter_gc_status_rows), default=0)
    command_timeouts = max((int(msg.get("reliableCommandTimeoutFailures") or 0) for _, msg in inter_gc_status_rows), default=0)

    lines: list[str] = []
    lines.append("# Live Debug Log Summary")
    lines.append("")
    lines.append(f"- Source: `{source}`")
    lines.append(f"- Parsed records: {len(records)}")
    if malformed:
        lines.append(f"- Malformed JSONL lines: {malformed}")
    if duration_s is not None:
        lines.append(f"- Approx duration: {duration_s:0.1f}s")
    lines.append("")
    lines.append("## Commands")
    lines.append(f"- Sent commands: {len(command_txs)}")
    lines.append(f"- ACKs: {len(command_acks)} ({len(failed_acks)} rejected)")
    if latencies:
        lines.append(f"- ACK latency: min {min(latencies):0.0f} ms, max {max(latencies):0.0f} ms, avg {sum(latencies) / len(latencies):0.0f} ms")
    elif derived_latencies:
        lines.append(f"- Derived ACK latency: min {min(derived_latencies):0.0f} ms, max {max(derived_latencies):0.0f} ms, avg {sum(derived_latencies) / len(derived_latencies):0.0f} ms")
    if command_queued_rows:
        lines.append(f"- Inter-GC queued command events: {len(command_queued_rows)}")
    if pending_ids:
        lines.append(f"- Pending/no ACK command IDs: {', '.join(pending_ids[:12])}{'...' if len(pending_ids) > 12 else ''}")
    if duplicate_ack_ids:
        lines.append(f"- Duplicate ACK command IDs: {', '.join(duplicate_ack_ids[:12])}{'...' if len(duplicate_ack_ids) > 12 else ''}")
    for rel, msg in command_acks[-8:]:
        status = "accepted" if msg.get("accepted") is not False else "rejected"
        lines.append(
            f"- {format_t(rel)} ACK {short_value(msg.get('target'))}/{short_value(msg.get('sourceRole'))} "
            f"{short_value(msg.get('command'))} {status}: {short_value(msg.get('reason'))}"
        )
    lines.append("")
    lines.append("## Inter-GC Transport")
    lines.append(f"- Inter-GC status rows: {len(inter_gc_status_rows)}")
    lines.append(f"- Max reliable queue depth: {max_reliable_depth}")
    lines.append(f"- Max event outbox depth: {max_event_depth}")
    lines.append(f"- Reliable queue full drops: {queue_full_drops}")
    lines.append(f"- Command timeout failures: {command_timeouts}")
    lines.append(f"- Event drops high/medium/low: {dropped_high}/{dropped_medium}/{dropped_low}")
    lines.append(f"- Event coalesced: {coalesced_events}")
    lines.append(f"- Event compacted: {compacted_events}")
    lines.append(f"- Malformed RX JSON payload lines: {len(malformed_rx_rows)}")
    lines.append(f"- Suspicious JSON fragment lines: {len(suspicious_fragment_rows)}")
    if malformed_rx_rows:
        samples = "; ".join(f"{format_t(rel)} {source_name}: {text}" for rel, source_name, text in malformed_rx_rows[:3])
        lines.append(f"- Malformed samples: {samples}")
    if suspicious_fragment_rows:
        samples = "; ".join(f"{format_t(rel)} {source_name}: {text}" for rel, source_name, text in suspicious_fragment_rows[:3])
        lines.append(f"- Fragment samples: {samples}")
    if suspicious_type_rows:
        samples = ", ".join(f"{format_t(rel)} {event_type}" for rel, event_type in suspicious_type_rows[:6])
        lines.append(f"- Suspicious event types: {samples}")
    lines.append("")
    lines.append("## Bind And Search")
    lines.append(f"- Search events: {len(search_rows)}")
    lines.append(f"- Bind progress events: {len(bind_rows)}")
    lines.append(f"- Assignment events: {len(assignment_rows)}")
    if scenario_metric_rows:
        lines.append("- Scenario metrics: " + "; ".join(f"{format_t(rel)} {text}" for rel, text in scenario_metric_rows[-8:]))
    if scenario_fail_rows:
        lines.append("- Scenario failures: " + "; ".join(f"{format_t(rel)} {text}" for rel, text in scenario_fail_rows[-8:]))
    if assignment_events:
        lines.append("- Assignment event counts: " + ", ".join(f"{key}={value}" for key, value in assignment_events.most_common()))
    operator_starts = [(rel, msg) for rel, msg in operator_rx_rows if msg.get("event") in {"operator_shared_rx_started", "operator_discovery_started"}]
    operator_active = [(rel, msg) for rel, msg in operator_rx_rows if msg.get("event") in {"operator_shared_rx_active", "operator_discovery_active"}]
    operator_complete = [(rel, msg) for rel, msg in operator_rx_rows if msg.get("event") in {"operator_shared_rx_complete", "operator_discovery_complete"}]
    operator_scanner_rows = [
        (rel, msg)
        for rel, msg in scanner_rows
        if is_operator_rx_event(msg.get("event"))
    ]
    operator_gc_windows: list[tuple[float, float]] = []
    for _, msg in operator_scanner_rows:
        start_gc = number_value(msg.get("listenStartGcMillis"))
        deadline_gc = number_value(msg.get("listenDeadlineGcMillis"))
        if start_gc is not None and deadline_gc is not None and deadline_gc >= start_gc:
            operator_gc_windows.append((start_gc, deadline_gc))

    if operator_rx_rows:
        lines.append(
            "- Operator shared/discovery RX: "
            f"starts={len(operator_starts)}, active_ticks={len(operator_active)}, completes={len(operator_complete)}"
        )
        if operator_scanner_rows:
            lines.append(f"- Operator shared/discovery RX scanner events: {len(operator_scanner_rows)}")
        if operator_gc_windows:
            first_gc = min(start for start, _ in operator_gc_windows)
            last_gc = max(deadline for _, deadline in operator_gc_windows)
            lines.append(
                "- Operator shared/discovery RX GC window: "
                f"{first_gc:0.0f} to {last_gc:0.0f} ms ({(last_gc - first_gc) / 1000.0:0.1f}s)"
            )
        first_operator_rel = operator_starts[0][0] if operator_starts else operator_rx_rows[0][0]
        last_operator_rel = operator_rx_rows[-1][0]
        lines.append(f"- Operator shared/discovery RX window observed: {format_t(first_operator_rel)} to {format_t(last_operator_rel)}")
        join_rx_rows = [
            (rel, msg)
            for rel, msg in assignment_rows
            if msg.get("event") == "join_request_received"
        ]
        if join_rx_rows and operator_gc_windows:
            joins_inside_gc = []
            for rel, msg in join_rx_rows:
                join_gc = number_value(msg.get("gcMillis"))
                if join_gc is None:
                    continue
                if any(start <= join_gc <= deadline for start, deadline in operator_gc_windows):
                    joins_inside_gc.append((rel, msg))
            lines.append(f"- JOINs received during operator shared/discovery RX by GC clock: {len(joins_inside_gc)}")
        elif first_operator_rel is not None and join_rx_rows:
            joins_inside = [
                (rel, msg)
                for rel, msg in join_rx_rows
                if rel is not None and rel >= first_operator_rel and (last_operator_rel is None or rel <= last_operator_rel + 0.25)
            ]
            lines.append(f"- JOINs received during operator shared/discovery RX: {len(joins_inside)}")
        if operator_complete:
            lines.append(
                "- Operator shared RX complete reasons: " +
                ", ".join(str(msg.get("reason") or "-") for _, msg in operator_complete[-4:])
            )
    auto_starts = [(rel, msg) for rel, msg in auto_rx_rows if msg.get("event") == "auto_shared_rx_started"]
    auto_active = [(rel, msg) for rel, msg in auto_rx_rows if msg.get("event") == "auto_shared_rx_active"]
    auto_joins = [(rel, msg) for rel, msg in auto_rx_rows if msg.get("event") == "auto_shared_rx_join_detected"]
    auto_complete = [(rel, msg) for rel, msg in auto_rx_rows if msg.get("event") == "auto_shared_rx_complete"]
    auto_scanner_rows = [
        (rel, msg)
        for rel, msg in scanner_rows
        if str(msg.get("event") or "").startswith("auto_shared_rx_")
    ]
    if auto_rx_rows or auto_scanner_rows:
        lines.append(
            "- Auto shared RX: "
            f"starts={len(auto_starts)}, active_ticks={len(auto_active)}, "
            f"joins={len(auto_joins)}, completes={len(auto_complete)}"
        )
        if auto_scanner_rows:
            lines.append(f"- Auto shared RX scanner events: {len(auto_scanner_rows)}")
        if auto_complete:
            lines.append(
                "- Auto shared RX complete reasons: " +
                ", ".join(str(msg.get("reason") or "-") for _, msg in auto_complete[-4:])
            )
    empty_starts = [(rel, msg) for rel, msg in empty_rx_rows if msg.get("event") == "empty_shared_rx_started"]
    empty_active = [(rel, msg) for rel, msg in empty_rx_rows if msg.get("event") == "empty_shared_rx_active"]
    empty_joins = [(rel, msg) for rel, msg in empty_rx_rows if msg.get("event") == "empty_shared_rx_join_detected"]
    empty_complete = [(rel, msg) for rel, msg in empty_rx_rows if msg.get("event") == "empty_shared_rx_complete"]
    empty_oocr_deferred = [(rel, msg) for rel, msg in empty_rx_rows if msg.get("event") == "empty_shared_rx_oocr_deferred"]
    if empty_rx_rows:
        lines.append(
            "- Empty-assignment shared RX: "
            f"starts={len(empty_starts)}, active_ticks={len(empty_active)}, joins={len(empty_joins)}, "
            f"completes={len(empty_complete)}, oocr_deferred={len(empty_oocr_deferred)}"
        )
        if empty_starts:
            first_empty_rel = empty_starts[0][0]
            last_empty_rel = empty_rx_rows[-1][0]
            lines.append(f"- Empty-assignment shared RX observed: {format_t(first_empty_rel)} to {format_t(last_empty_rel)}")
        if empty_complete:
            lines.append(
                "- Empty-assignment shared RX complete reasons: " +
                ", ".join(str(msg.get("reason") or "-") for _, msg in empty_complete[-4:])
            )
    for rel, msg in bind_rows[-12:]:
        lines.append(
            f"- {format_t(rel)} node {short_value(msg.get('nodeId'))}: "
            f"{short_value(msg.get('phase'))} {short_value(msg.get('progress'))} "
            f"{short_value(msg.get('event') or msg.get('reason'))}"
        )
    if stalls:
        lines.append("")
        lines.append("## Stalls")
        for rel, item in stalls:
            lines.append(
                f"- {format_t(rel)} node {short_value(item.get('nodeId'))}: "
                f"{short_value(item.get('phase'))} progress {short_value(item.get('progress'))} "
                f"reason {short_value(item.get('reason'))}"
            )
    lines.append("")
    lines.append("## CAD And OOCR")
    cad_sample_rows = [
        (rel, msg)
        for rel, msg in channel_scan_rows
        if isinstance(msg.get("cadSampleCount"), (int, float))
    ]
    cad_validated_rows = [
        (rel, msg)
        for rel, msg in cad_sample_rows
        if msg.get("cadValidated") is True
    ]
    cad_rejected_rows = [
        (rel, msg)
        for rel, msg in cad_sample_rows
        if msg.get("cadRejected") is True
    ]
    one_hit_rejected = [
        (rel, msg)
        for rel, msg in cad_rejected_rows
        if msg.get("cadHitCount") == 1
    ]
    queued_rows = [
        (rel, msg)
        for rel, msg in orphan_rows
        if msg.get("event") == "background_oocr_candidate_queued"
    ]
    confirmation_rows = [
        (rel, msg)
        for rel, msg in orphan_rows
        if msg.get("event") == "background_oocr_confirmation_started"
    ]
    confirmed_orphan_rows = [
        (rel, msg)
        for rel, msg in orphan_rows
        if msg.get("event") in {"confirmed_drone", "oocr_recovered_from_cad"}
    ]
    failed_candidate_rows = [
        (rel, msg)
        for rel, msg in orphan_rows
        if msg.get("event") == "candidate_failed"
    ]
    lines.append(f"- Channel scan events: {len(channel_scan_rows)}")
    if channel_scan_events:
        lines.append("- Channel scan event counts: " + ", ".join(f"{key}={value}" for key, value in channel_scan_events.most_common()))
    lines.append(
        "- CAD samples: "
        f"rows={len(cad_sample_rows)}, validated={len(cad_validated_rows)}, "
        f"rejected={len(cad_rejected_rows)}, one_hit_rejected={len(one_hit_rejected)}"
    )
    lines.append(f"- OOCR events: {len(orphan_rows)}")
    if orphan_events:
        lines.append("- OOCR event counts: " + ", ".join(f"{key}={value}" for key, value in orphan_events.most_common()))
    if queued_rows:
        queue_details = []
        for rel, msg in queued_rows[-8:]:
            queue_details.append(
                f"{format_t(rel)} ch {short_value(msg.get('channelIndex'))}/p{short_value(msg.get('radioProfileId'))} "
                f"score {short_value(msg.get('candidateScore'))} "
                f"{'hint' if msg.get('fromRecentClearHint') else 'cad'}"
            )
        lines.append("- Recent OOCR queue entries: " + "; ".join(queue_details))
    if confirmation_rows:
        confirm_details = []
        for rel, msg in confirmation_rows[-8:]:
            confirm_details.append(
                f"{format_t(rel)} ch {short_value(msg.get('channelIndex'))}/p{short_value(msg.get('radioProfileId'))} "
                f"score {short_value(msg.get('candidateScore'))} "
                f"reason {short_value(msg.get('reason'))}"
            )
        lines.append("- Recent OOCR confirmations: " + "; ".join(confirm_details))
    if failed_candidate_rows:
        lines.append(f"- Failed candidate confirmations: {len(failed_candidate_rows)}")
    session_rows = [
        (rel, msg)
        for record in records
        for rel, msg, event_type in [line_summary(record, first_ms)]
        if event_type == "session_event"
    ]
    reset_rows = [
        (rel, msg)
        for rel, msg in session_rows
        if msg.get("event") in {"assignments_cleared", "fresh_session_started"}
    ]
    first_reset = next((rel for rel, _ in reset_rows if rel is not None), None)
    first_recovery = next((rel for rel, _ in confirmed_orphan_rows if rel is not None), None)
    if first_reset is not None and first_recovery is not None and first_recovery >= first_reset:
        lines.append(f"- Reset/clear to confirmed orphan telemetry: {(first_recovery - first_reset):0.3f}s")
    lines.append("")
    lines.append("## Post-Bind Telemetry")
    join_ack_rows = [
        (rel, msg)
        for rel, msg in assignment_rows
        if msg.get("event") in {"join_ack_received", "late_join_ack_received"}
    ]
    assigned_started_rows = [
        (rel, msg)
        for rel, msg in drone_join_rows
        if msg.get("event") == "assigned_telemetry_started"
    ]
    first_tx_rows = [
        (rel, msg)
        for rel, msg in drone_join_rows
        if msg.get("event") == "first_assigned_telemetry_tx"
    ]
    telemetry_by_node: dict[int, list[tuple[float | None, dict[str, Any]]]] = defaultdict(list)
    for rel, msg in telemetry_rows:
        node = msg.get("nodeId")
        if isinstance(node, int):
            telemetry_by_node[node].append((rel, msg))
    post_bind_starts = [(rel, msg) for rel, msg in post_bind_rows if msg.get("event") == "post_bind_acquire_started"]
    post_bind_first = [(rel, msg) for rel, msg in post_bind_rows if msg.get("event") == "post_bind_first_telemetry"]
    post_bind_timeouts = [(rel, msg) for rel, msg in post_bind_rows if msg.get("event") == "post_bind_acquire_timeout"]
    lines.append(
        "- Post-bind acquire events: "
        f"starts={len(post_bind_starts)}, first_telemetry={len(post_bind_first)}, timeouts={len(post_bind_timeouts)}"
    )
    measured_nodes = sorted({
        int(msg["nodeId"])
        for _, msg in join_ack_rows + assigned_started_rows + first_tx_rows + post_bind_rows + telemetry_rows
        if isinstance(msg.get("nodeId"), int)
    })
    if not measured_nodes:
        lines.append("- No post-bind timing rows found.")
    for node_id in measured_nodes[:12]:
        first_ack = next((rel for rel, msg in join_ack_rows if msg.get("nodeId") == node_id and rel is not None), None)
        first_assigned = next((rel for rel, msg in assigned_started_rows if msg.get("nodeId") == node_id and rel is not None), None)
        first_tx = next((rel for rel, msg in first_tx_rows if msg.get("nodeId") == node_id and rel is not None), None)
        first_tel = next((rel for rel, _ in telemetry_by_node.get(node_id, []) if rel is not None), None)
        first_start = next((rel for rel, msg in post_bind_starts if msg.get("nodeId") == node_id and rel is not None), None)
        timeout_count = sum(1 for _, msg in post_bind_timeouts if msg.get("nodeId") == node_id)
        parts = [f"node {node_id}"]
        if first_ack is not None and first_tel is not None:
            parts.append(f"ACK->telemetry {(first_tel - first_ack):0.3f}s")
        if first_assigned is not None and first_tel is not None:
            parts.append(f"drone assigned->telemetry {(first_tel - first_assigned):0.3f}s")
        if first_start is not None and first_tel is not None:
            parts.append(f"acquire->telemetry {(first_tel - first_start):0.3f}s")
        if first_tx is not None and first_tel is not None:
            parts.append(f"drone first TX->telemetry {(first_tel - first_tx):0.3f}s")
        if timeout_count:
            parts.append(f"timeouts={timeout_count}")
        lines.append("- " + "; ".join(parts))
    lines.append("")
    lines.append("## Drone Debug")
    lines.append(f"- Drone JOIN events: {len(drone_join_rows)}")
    if join_events:
        lines.append("- JOIN event counts: " + ", ".join(f"{key}={value}" for key, value in join_events.most_common()))
    backoff_kinds = Counter(
        str(msg.get("joinBackoffKind") or "unknown")
        for _, msg in drone_join_rows
        if msg.get("event") == "join_backoff"
    )
    if backoff_kinds:
        lines.append("- JOIN backoff kinds: " + ", ".join(f"{key}={value}" for key, value in backoff_kinds.most_common()))
    lines.append(f"- Drone debug events/status rows: {len(drone_debug_rows)}")
    lines.append(f"- Drone telemetry rows: {len(telemetry_rows)}")
    rf_loss_rows = [
        (rel, msg)
        for rel, msg in drone_debug_rows
        if msg.get("event") == "telemetry_rf_loss_simulated"
    ]
    silent_drop_rows = [
        (rel, msg)
        for rel, msg in drone_debug_rows
        if msg.get("event") == "telemetry_cycle_dropped"
    ]
    if rf_loss_rows:
        sequence_ids = ", ".join(short_value(msg.get("sequenceId")) for _, msg in rf_loss_rows[:12])
        suffix = "" if len(rf_loss_rows) <= 12 else f", +{len(rf_loss_rows) - 12} more"
        lines.append(f"- Simulated RF-loss packets: {len(rf_loss_rows)} sequenceIds={sequence_ids}{suffix}")
    if silent_drop_rows:
        lines.append(f"- Silent dropped telemetry cycles: {len(silent_drop_rows)}")
    for rel, msg in (drone_join_rows + drone_debug_rows)[-12:]:
        lines.append(
            f"- {format_t(rel)} node {short_value(msg.get('nodeId'))}: "
            f"{short_value(msg.get('type'))} {short_value(msg.get('event') or msg.get('state') or msg.get('joinMode'))}"
        )
    lines.append("")
    lines.append("## Short-Loss Guard")
    short_loss_counts = Counter(str(msg.get("event") or "short_loss_event") for _, msg in short_loss_rows)
    lines.append(f"- Telemetry rebind events: {len(telemetry_rebind_rows)}")
    if short_loss_counts:
        lines.append("- Short-loss event counts: " + ", ".join(f"{key}={value}" for key, value in short_loss_counts.most_common()))
    else:
        lines.append("- No short-loss guard events found.")
    recovered_gaps = [
        float(msg.get("observedSequenceGap") if msg.get("observedSequenceGap") is not None else msg.get("observedGap"))
        for _, msg in short_loss_rows
        if msg.get("event") == "short_loss_recovered"
        and isinstance(msg.get("observedSequenceGap") if msg.get("observedSequenceGap") is not None else msg.get("observedGap"), (int, float))
    ]
    if recovered_gaps:
        lines.append(
            "- Short-loss recovered observed gaps: "
            f"count={len(recovered_gaps)}, avg={sum(recovered_gaps) / len(recovered_gaps):0.1f}, "
            f"max={max(recovered_gaps):0.0f}"
        )
    if short_loss_rows:
        recent = []
        for rel, msg in short_loss_rows[-8:]:
            recent.append(
                f"{format_t(rel)} node {short_value(msg.get('nodeId'))} "
                f"{short_value(msg.get('event'))} miss={short_value(msg.get('missCount'))} "
                f"gap={short_value(msg.get('observedSequenceGap') if msg.get('observedSequenceGap') is not None else msg.get('observedGap'))}"
            )
        lines.append("- Recent short-loss events: " + "; ".join(recent))
    if fairness_rows:
        lines.append("")
        lines.append("## Owed-Packet Fairness")
        fairness_counts = Counter(str(msg.get("event") or "fairness_event") for _, msg in fairness_rows)
        lines.append("- Fairness event counts: " + ", ".join(f"{key}={value}" for key, value in fairness_counts.most_common()))
        skips_by_node = Counter(
            int(msg.get("nodeId"))
            for _, msg in fairness_rows
            if msg.get("event") == "rx_candidate_skipped" and isinstance(msg.get("nodeId"), int)
        )
        selected_by_node = Counter(
            int(msg.get("nodeId"))
            for _, msg in fairness_rows
            if msg.get("event") == "owed_rx_selected" and isinstance(msg.get("nodeId"), int)
        )
        missed_by_node = Counter(
            int(msg.get("nodeId"))
            for _, msg in fairness_rows
            if msg.get("event") == "owed_rx_missed" and isinstance(msg.get("nodeId"), int)
        )
        if skips_by_node:
            lines.append("- Scheduler-caused skips by node: " + ", ".join(f"{key}={value}" for key, value in sorted(skips_by_node.items())))
        if selected_by_node:
            lines.append("- Owed selections by node: " + ", ".join(f"{key}={value}" for key, value in sorted(selected_by_node.items())))
        if missed_by_node:
            lines.append("- Owed listens that still missed by node: " + ", ".join(f"{key}={value}" for key, value in sorted(missed_by_node.items())))
        max_skip = max(
            (
                int(msg.get("consecutiveSchedulerSkips"))
                for _, msg in fairness_rows
                if isinstance(msg.get("consecutiveSchedulerSkips"), int)
            ),
            default=0,
        )
        lines.append(f"- Max consecutive scheduler skips observed: {max_skip}")
        recent_fairness = []
        for rel, msg in fairness_rows[-10:]:
            selected = msg.get("selectedNodeId")
            selected_text = f" selected={short_value(selected)}" if selected is not None else ""
            recent_fairness.append(
                f"{format_t(rel)} node {short_value(msg.get('nodeId'))} "
                f"{short_value(msg.get('event'))}{selected_text} "
                f"owed={short_value(msg.get('owedRxCount'))} "
                f"skips={short_value(msg.get('consecutiveSchedulerSkips'))}"
            )
        lines.append("- Recent fairness events: " + "; ".join(recent_fairness))
    forced_overlap_rows = [
        (rel, msg)
        for rel, msg in bench_trial_rows
        if msg.get("bench") == "forced_overlap" or "offsetsMs" in msg
    ]
    if forced_overlap_rows:
        lines.append("")
        lines.append("## Forced Overlap Bench Trials")
        pass_count = sum(1 for _, msg in forced_overlap_rows if msg.get("passed") is True)
        lines.append(f"- Pass: {pass_count}/{len(forced_overlap_rows)}")
        lines.append("| Trial | Offsets ms | Pass | Skipped | Owed selected | Owed cleared | Max skips | Score fields | Failures |")
        lines.append("|---:|---|---|---|---|---|---:|---|---|")
        for _, msg in forced_overlap_rows:
            lines.append(
                "| "
                f"{short_value(msg.get('trial'))} | "
                f"{','.join(str(value) for value in msg.get('offsetsMs', [])) or '-'} | "
                f"{'yes' if msg.get('passed') is True else 'no'} | "
                f"{','.join(str(value) for value in msg.get('skippedNodes', [])) or '-'} | "
                f"{','.join(str(value) for value in msg.get('owedSelectedNodes', [])) or '-'} | "
                f"{','.join(str(value) for value in msg.get('owedClearedNodes', [])) or '-'} | "
                f"{short_value(msg.get('maxConsecutiveSchedulerSkips'))} | "
                f"{'yes' if msg.get('scoreFieldsPresent') is True else 'no'} | "
                f"{','.join(str(value) for value in msg.get('failures', [])) or '-'} |"
            )

    rf_bench_trial_rows = [
        (rel, msg)
        for rel, msg in bench_trial_rows
        if isinstance(msg.get("cycles"), int)
    ]
    if rf_bench_trial_rows:
        lines.append("")
        lines.append("## RF Loss Bench Trials")
        lines.append("| Lost packets | Trials | Pass | Avg pre-sim missing | Avg post-sim extra | Avg missing count | Avg extra missing | Max extra missing | Link events | Rebind trials |")
        lines.append("|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
        cycles_values = sorted({
            int(msg["cycles"])
            for _, msg in rf_bench_trial_rows
            if isinstance(msg.get("cycles"), int)
        })
        for cycles in cycles_values:
            rows = [msg for _, msg in rf_bench_trial_rows if msg.get("cycles") == cycles]
            pass_count = sum(
                1
                for msg in rows
                if msg.get("recovered") is True
                and msg.get("expectedGapSeen") is True
                and not msg.get("nonOnlineLinkEvents")
            )
            missing_counts = [
                float(len(msg.get("observedMissingSequenceIds")))
                for msg in rows
                if isinstance(msg.get("observedMissingSequenceIds"), list)
            ]
            pre_sim_counts: list[float] = []
            post_sim_counts: list[float] = []
            for msg in rows:
                explicit_pre = msg.get("preSimulationMissingSequenceIds")
                explicit_post = msg.get("postSimulationExtraSequenceIds")
                if isinstance(explicit_pre, list):
                    pre_sim_counts.append(float(len(explicit_pre)))
                elif isinstance(msg.get("simulatedSequenceIds"), list) and msg.get("simulatedSequenceIds"):
                    pre_sim_counts.append(float(len(seq_gap(msg.get("preSequenceId"), msg["simulatedSequenceIds"][0]))))
                if isinstance(explicit_post, list):
                    post_sim_counts.append(float(len(explicit_post)))
                elif isinstance(msg.get("simulatedSequenceIds"), list) and msg.get("simulatedSequenceIds"):
                    post_sim_counts.append(float(len(seq_gap(msg["simulatedSequenceIds"][-1], msg.get("postSequenceId")))))
            extra_counts = [value - float(cycles) for value in missing_counts]
            link_events = sum(
                len(msg.get("nonOnlineLinkEvents"))
                for msg in rows
                if isinstance(msg.get("nonOnlineLinkEvents"), list)
            )
            rebind_trials = sum(
                1
                for msg in rows
                if isinstance(msg.get("rebindEvents"), list) and len(msg.get("rebindEvents")) > 0
            )
            lines.append(
                "| "
                f"{cycles} | {len(rows)} | {pass_count}/{len(rows)} | "
                f"{format_number(mean_or_none(pre_sim_counts))} | "
                f"{format_number(mean_or_none(post_sim_counts))} | "
                f"{format_number(mean_or_none(missing_counts))} | "
                f"{format_signed(mean_or_none(extra_counts))} | "
                f"{format_signed(max(extra_counts) if extra_counts else None)} | "
                f"{link_events} | {rebind_trials}/{len(rows)} |"
            )
    if manual_bind_marker_rows:
        lines.append("")
        lines.append("## Manual Bind Non-Disruption")
        pass_count = sum(1 for _, msg in manual_bind_marker_rows if msg.get("passed") is True)
        lines.append(f"- Pass: {pass_count}/{len(manual_bind_marker_rows)}")
        lines.append("| Run | Duration ms | Pass | Failures |")
        lines.append("|---:|---:|---|---|")
        for index, (_, msg) in enumerate(manual_bind_marker_rows, start=1):
            lines.append(
                "| "
                f"{index} | "
                f"{short_value(msg.get('durationMs'))} | "
                f"{'yes' if msg.get('passed') is True else 'no'} | "
                f"{','.join(str(value) for value in msg.get('failures', [])) or '-'} |"
            )
    if rf_loss_only_marker_rows:
        lines.append("")
        lines.append("## RF-Loss Only Matrix")
        pass_count = sum(1 for _, msg in rf_loss_only_marker_rows if msg.get("passed") is True)
        lines.append(f"- Pass: {pass_count}/{len(rf_loss_only_marker_rows)}")
        lines.append("| Target | Cycles | Trial | Pass | Rejoin events | Failures |")
        lines.append("|---:|---:|---:|---|---|---|")
        for _, msg in rf_loss_only_marker_rows:
            rejoin_events = msg.get("targetRejoinEvents")
            rejoin_text = "-"
            if isinstance(rejoin_events, list) and rejoin_events:
                rejoin_text = ",".join(str(item.get("event") if isinstance(item, dict) else item) for item in rejoin_events)
            lines.append(
                "| "
                f"{short_value(msg.get('targetNodeId'))} | "
                f"{short_value(msg.get('cycles'))} | "
                f"{short_value(msg.get('trial'))} | "
                f"{'yes' if msg.get('passed') is True else 'no'} | "
                f"{rejoin_text} | "
                f"{','.join(str(value) for value in msg.get('failures', [])) or '-'} |"
            )
    if broken_link_marker_rows:
        lines.append("")
        lines.append("## Multi-Drone Broken-Link Markers")
        pass_count = sum(1 for _, msg in broken_link_marker_rows if msg.get("passed") is True)
        lines.append(f"- Pass: {pass_count}/{len(broken_link_marker_rows)}")
        lines.append("| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |")
        lines.append("|---:|---:|---|---:|---:|---|")
        for _, msg in broken_link_marker_rows:
            lines.append(
                "| "
                f"{short_value(msg.get('targetNodeId'))} | "
                f"{short_value(msg.get('lossCycles'))} | "
                f"{'yes' if msg.get('passed') is True else 'no'} | "
                f"{short_value(msg.get('restartToTelemetryMs'))} | "
                f"{short_value(msg.get('joinAckToTelemetryMs'))} | "
                f"{','.join(str(value) for value in msg.get('failures', [])) or '-'} |"
            )
    if receiver_budget_rows:
        budget_counts = Counter(str(msg.get("event") or "receiver_budget_event") for _, msg in receiver_budget_rows)
        denied = [
            (rel, msg) for rel, msg in receiver_budget_rows
            if msg.get("event") == "recovery_budget_denied"
        ]
        overloads = [
            (rel, msg) for rel, msg in receiver_budget_rows
            if msg.get("event") == "receiver_budget_overloaded"
        ]
        lines.append("")
        lines.append("## Receiver Budget")
        lines.append("- Events: " + ", ".join(f"{key}={value}" for key, value in budget_counts.most_common()))
        if denied:
            by_reason = Counter(str(msg.get("reason") or "unknown") for _, msg in denied)
            lines.append("- Recovery denials by reason: " + ", ".join(f"{key}={value}" for key, value in by_reason.most_common()))
            lines.append("- Recent denied recovery:")
            for rel, msg in denied[-8:]:
                lines.append(
                    f"  - {format_t(rel)} target={short_value(msg.get('nodeId'))} "
                    f"protected={short_value(msg.get('protectedNodeId'))} "
                    f"reason={short_value(msg.get('reason'))}"
                )
        if overloads:
            latest_rel, latest = overloads[-1]
            lines.append(
                f"- Receiver overload observed: count={len(overloads)}, "
                f"latest={format_t(latest_rel)}, utilization={short_value(latest.get('receiverUtilization'))}%"
            )
    coverage_rows = [
        (rel, msg)
        for rel, msg in gc_status_rows
        if "telemetryCoverageMode" in msg
    ]
    if coverage_rows:
        latest_rel, latest = coverage_rows[-1]
        lines.append("")
        lines.append("## Telemetry Coverage")
        lines.append(f"- Latest status at {format_t(latest_rel)}: mode `{short_value(latest.get('telemetryCoverageMode'))}`")
        lines.append(f"- Assigned packets received: {short_value(latest.get('assignedPacketsReceived'))}")
        lines.append(f"- Assigned RX coverage: {short_value(latest.get('assignedRxCoveragePct'))}%")
        lines.append(f"- Sequence gap events: {short_value(latest.get('assignedSequenceGapEvents'))}")
        lines.append(f"- Missing sequence IDs: {short_value(latest.get('assignedSequenceGaps'))}")
        lines.append(f"- Max sequence gap: {short_value(latest.get('assignedMaxGap'))}")
        lines.append(f"- Assigned slot misses: {short_value(latest.get('assignedSlotMisses'))}")
        lines.append(f"- Non-assigned preemptions: {short_value(latest.get('nonAssignedPreemptions'))}")
        if latest.get("receiverBudgetMode"):
            lines.append(f"- Receiver budget mode: `{short_value(latest.get('receiverBudgetMode'))}`")
            lines.append(f"- Receiver utilization: {short_value(latest.get('receiverUtilization'))}%")
            lines.append(f"- Receiver overloaded: {short_value(latest.get('receiverOverloaded'))}")
            lines.append(f"- Recovery budget used: {short_value(latest.get('recoveryBudgetUsedCount'))}")
            lines.append(f"- Recovery budget denied: {short_value(latest.get('recoveryBudgetDeniedCount'))}")
            lines.append(f"- Healthy service protected: {short_value(latest.get('healthyServiceProtectedCount'))}")
        lines.append(f"- Owed RX active: {short_value(latest.get('owedRxActive'))} node={short_value(latest.get('owedRxNodeId'))} count={short_value(latest.get('owedRxCount'))}")
        lines.append(f"- Fairness skips: {short_value(latest.get('fairnessSkipCount'))}")
        lines.append(f"- Owed selections: {short_value(latest.get('fairnessOwedSelectedCount'))}")
        lines.append(f"- Owed misses: {short_value(latest.get('fairnessOwedMissedCount'))}")
        lines.append(f"- Max scheduler skips: {short_value(latest.get('maxConsecutiveSchedulerSkips'))}")
        if latest.get("lastNonAssignedPreemptionReason"):
            lines.append(f"- Last preemption reason: {short_value(latest.get('lastNonAssignedPreemptionReason'))}")
        modes = Counter(str(msg.get("telemetryCoverageMode") or "unknown") for _, msg in coverage_rows)
        lines.append("- Coverage modes seen: " + ", ".join(f"{key}={value}" for key, value in modes.most_common()))
    sequence_gaps: list[tuple[int, tuple[float | None, dict[str, Any]], tuple[float | None, dict[str, Any]], list[int]]] = []
    for node_id, rows in telemetry_by_node.items():
        previous: tuple[float | None, dict[str, Any]] | None = None
        for row in rows:
            if previous is None:
                previous = row
                continue
            prev_seq = previous[1].get("sequenceId")
            seq = row[1].get("sequenceId")
            if isinstance(prev_seq, int) and isinstance(seq, int):
                expected = (prev_seq + 1) & 0xFF
                if seq != expected:
                    missing: list[int] = []
                    cursor = expected
                    while cursor != seq and len(missing) <= 32:
                        missing.append(cursor)
                        cursor = (cursor + 1) & 0xFF
                    sequence_gaps.append((node_id, previous, row, missing))
            previous = row
    if sequence_gaps:
        lines.append("")
        lines.append("## Telemetry Sequence Gaps")
        lines.append(f"- Observed sequence gaps: {len(sequence_gaps)}")
        for node_id, previous, current, missing in sequence_gaps[:12]:
            prev_rel, prev_msg = previous
            cur_rel, cur_msg = current
            missing_text = ", ".join(str(item) for item in missing[:16])
            suffix = "" if len(missing) <= 16 else f", +{len(missing) - 16} more"
            lines.append(
                f"- node {node_id}: {format_t(prev_rel)} seq {short_value(prev_msg.get('sequenceId'))} "
                f"-> {format_t(cur_rel)} seq {short_value(cur_msg.get('sequenceId'))}; "
                f"missing [{missing_text}{suffix}]"
            )
    transport_findings: list[str] = []
    terminal_over_recent: list[str] = []
    telemetry_by_node: dict[int, list[float]] = defaultdict(list)
    for rel, msg in telemetry_rows:
        node = msg.get("nodeId")
        if isinstance(node, int) and rel is not None:
            telemetry_by_node[node].append(rel)
    for rel, node_id, source_name, state in state_rows:
        normalized_state = str(state).lower()
        if normalized_state not in {"weak", "off", "offline"} or rel is None:
            continue
        previous = [
            telemetry_rel for telemetry_rel in telemetry_by_node.get(node_id, [])
            if telemetry_rel <= rel and rel - telemetry_rel <= 5.0
        ]
        if previous:
            terminal_over_recent.append(
                f"- {format_t(rel)} node {node_id}: {source_name} state `{state}` "
                f"{(rel - previous[-1]):0.3f}s after telemetry"
            )
    if pending_ids:
        transport_findings.append(f"- Missing ACKs for {len(pending_ids)} command(s).")
    if duplicate_ack_ids:
        transport_findings.append(f"- Duplicate ACKs for {len(duplicate_ack_ids)} command ID(s).")
    if failed_acks:
        reasons = Counter(str(msg.get("reason") or "rejected") for msg in failed_acks)
        transport_findings.append(
            "- Rejected ACK reasons: " + ", ".join(f"{key}={value}" for key, value in reasons.most_common())
        )
    if malformed_rx_rows:
        transport_findings.append(f"- Malformed serial JSON payloads: {len(malformed_rx_rows)}.")
    if suspicious_fragment_rows:
        transport_findings.append(f"- Suspicious JSON fragments: {len(suspicious_fragment_rows)}.")
    if suspicious_type_rows:
        transport_findings.append(f"- Suspicious/corrupted event types: {len(suspicious_type_rows)}.")
    if queue_full_drops:
        transport_findings.append(f"- Reliable queue full drops reported: {queue_full_drops}.")
    if command_timeouts:
        transport_findings.append(f"- Command timeout failures reported: {command_timeouts}.")
    if dropped_high:
        transport_findings.append(f"- High-priority event drops reported: {dropped_high}.")
    if transport_findings:
        lines.append("")
        lines.append("## Transport Findings")
        lines.extend(transport_findings)
    flicker = detect_flicker(state_rows)
    lines.append("")
    lines.append("## State Flicker")
    if flicker:
        lines.extend(flicker[:12])
    else:
        lines.append("- No rapid state flicker detected from available state rows.")
    lines.append("")
    lines.append("## Terminal State Over Recent Telemetry")
    if terminal_over_recent:
        lines.extend(terminal_over_recent[:20])
    else:
        lines.append("- No terminal link states were observed within 5s of same-node telemetry.")
    if event_counts:
        lines.append("")
        lines.append("## Event Counts")
        for key, value in event_counts.most_common(20):
            lines.append(f"- {key}: {value}")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Analyze SGC/tool live-debug JSONL logs")
    parser.add_argument("log", help="Input JSONL log")
    parser.add_argument("-o", "--output", help="Write Markdown summary to this path")
    args = parser.parse_args()

    source = Path(args.log)
    records, malformed = parse_jsonl(source)
    summary = analyze(records, malformed, source)
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(summary, encoding="utf-8", newline="\n")
    else:
        sys.stdout.write(summary)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
