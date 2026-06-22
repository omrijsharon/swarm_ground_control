# Live Debug Log Summary

- Source: `logs_summary\score_normalized_forced_overlap_retry_20260621.jsonl`
- Parsed records: 780
- Approx duration: 65.1s

## Commands
- Sent commands: 0
- ACKs: 0 (0 rejected)

## Inter-GC Transport
- Inter-GC status rows: 11
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
- t+3.732s node 6: timing - telemetry_period_observed
- t+3.803s node 3: timing - telemetry_period_observed
- t+3.933s node 6: complete - telemetry_period_locked
- t+4.228s node 3: complete - telemetry_period_locked

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
- Drone telemetry rows: 603

## Short-Loss Guard
- Telemetry rebind events: 13
- Short-loss event counts: short_loss_guard_started=5, short_loss_recovered=5, short_loss_guard_active=3
- Short-loss recovered observed gaps: count=5, avg=1.0, max=1
- Recent short-loss events: t+27.820s node 3 short_loss_guard_started miss=1 gap=-; t+27.908s node 3 short_loss_guard_active miss=2 gap=-; t+28.142s node 3 short_loss_recovered miss=2 gap=1; t+32.963s node 6 short_loss_guard_started miss=1 gap=-; t+33.224s node 6 short_loss_recovered miss=1 gap=1; t+38.248s node 3 short_loss_guard_started miss=1 gap=-; t+38.322s node 3 short_loss_guard_active miss=2 gap=-; t+38.459s node 3 short_loss_recovered miss=2 gap=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 10
- node 6: t+4.091s seq 180 -> t+4.522s seq 182; missing [181]
- node 6: t+17.408s seq 247 -> t+17.819s seq 249; missing [248]
- node 6: t+22.531s seq 16 -> t+22.808s seq 18; missing [17]
- node 6: t+27.820s seq 43 -> t+28.238s seq 45; missing [44]
- node 6: t+32.837s seq 68 -> t+33.224s seq 70; missing [69]
- node 6: t+38.248s seq 95 -> t+38.765s seq 97; missing [96]
- node 3: t+3.803s seq 191 -> t+4.330s seq 193; missing [192]
- node 3: t+17.326s seq 2 -> t+17.727s seq 4; missing [3]
- node 3: t+27.738s seq 54 -> t+28.142s seq 56; missing [55]
- node 3: t+38.169s seq 106 -> t+38.567s seq 108; missing [107]

## State Flicker
- Node 3: 1 rapid state transitions: t+3.933s offline->online
- Node 6: 1 rapid state transitions: t+3.793s offline->online

## Event Counts
- drone_telemetry: 603
- scanner_event: 30
- telemetry_rebind_event: 13
- inter_gc_status: 11
- drone_link_status: 4
- assignment_event: 4
- bind_progress_event: 4
- assignments: 3
- assignment_timing_hint: 2
