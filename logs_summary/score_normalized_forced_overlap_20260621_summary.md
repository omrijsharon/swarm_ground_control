# Live Debug Log Summary

- Source: `logs_summary\score_normalized_forced_overlap_20260621.jsonl`
- Parsed records: 409
- Approx duration: 32.1s

## Commands
- Sent commands: 0
- ACKs: 0 (0 rejected)

## Inter-GC Transport
- Inter-GC status rows: 1
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 0

## Bind And Search
- Search events: 0
- Bind progress events: 4
- Assignment events: 4
- Assignment event counts: telemetry_period_observed=2, telemetry_period_locked=2
- t+3.597s node 3: timing - telemetry_period_observed
- t+3.727s node 6: timing - telemetry_period_observed
- t+3.822s node 3: complete - telemetry_period_locked
- t+3.940s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=0
- node 3
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 282

## Short-Loss Guard
- Telemetry rebind events: 2
- Short-loss event counts: short_loss_guard_started=1, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=1.0, max=1
- Recent short-loss events: t+10.537s node 6 short_loss_guard_started miss=1 gap=-; t+10.800s node 6 short_loss_recovered miss=1 gap=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 2
- node 3: t+3.921s seq 114 -> t+4.318s seq 116; missing [115]
- node 6: t+10.526s seq 135 -> t+10.800s seq 137; missing [136]

## State Flicker
- Node 6: 1 rapid state transitions: t+3.798s offline->online

## Event Counts
- drone_telemetry: 282
- scanner_event: 6
- assignment_event: 4
- bind_progress_event: 4
- assignments: 3
- drone_link_status: 3
- assignment_timing_hint: 2
- telemetry_rebind_event: 2
- inter_gc_status: 1
