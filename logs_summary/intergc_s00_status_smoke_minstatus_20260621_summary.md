# Live Debug Log Summary

- Source: `logs_summary\intergc_s00_status_smoke_minstatus_20260621.jsonl`
- Parsed records: 350
- Approx duration: 50.0s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 24695 ms, max 24945 ms, avg 24820 ms
- Inter-GC queued command events: 1
- t+36.706s ACK telegc/telemetry_ground_control get_status accepted: -
- t+36.957s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 2
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0

## Bind And Search
- Search events: 0
- Bind progress events: 4
- Assignment events: 4
- Assignment event counts: telemetry_period_observed=2, telemetry_period_locked=2
- t+37.237s node 3: timing - telemetry_period_observed
- t+37.325s node 6: timing - telemetry_period_observed
- t+37.428s node 3: complete - telemetry_period_locked
- t+37.677s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 126

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+36.763s: mode `waiting_assignments`
- Assigned packets received: 0
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: waiting_assignments=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 2
- node 3: t+37.470s seq 19 -> t+37.881s seq 21; missing [20]
- node 6: t+37.881s seq 39 -> t+38.022s seq 41; missing [40]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 126
- assignment_event: 4
- bind_progress_event: 4
- assignments: 3
- command: 2
- command_ack: 2
- gc_status: 2
- inter_gc_status: 2
- scanner_event: 2
- drone_link_status: 2
- assignment_timing_hint: 2
- inter_gc_command_queued: 1
