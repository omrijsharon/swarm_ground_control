# Live Debug Log Summary

- Source: `logs_summary\intergc_s00_status_smoke_compactguard_20260621.jsonl`
- Parsed records: 610
- Approx duration: 50.1s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 16 ms, max 791 ms, avg 404 ms
- Inter-GC queued command events: 1
- t+12.018s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.794s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 4
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
- Bind progress events: 9
- Assignment events: 9
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, telemetry_period_rejected=1
- t+3.776s node 3: timing - telemetry_period_observed
- t+3.873s node 6: timing - telemetry_period_observed
- t+4.007s node 3: complete - telemetry_period_locked
- t+4.071s node 6: complete - telemetry_period_locked
- t+13.386s node 3: timing - telemetry_period_observed
- t+13.472s node 6: timing - telemetry_period_observed
- t+13.581s node 3: timing - telemetry_period_rejected
- t+13.669s node 6: complete - telemetry_period_locked
- t+13.799s node 3: complete - telemetry_period_locked

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
- Drone telemetry rows: 457

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+12.058s: mode `telemetry_first`
- Assigned packets received: 81
- Assigned RX coverage: 100%
- Sequence gap events: 2
- Missing sequence IDs: 2
- Max sequence gap: 1
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 4
- node 3: t+4.060s seq 109 -> t+4.462s seq 111; missing [110]
- node 3: t+12.862s seq 153 -> t+13.458s seq 156; missing [154, 155]
- node 6: t+4.280s seq 129 -> t+4.658s seq 131; missing [130]
- node 6: t+13.026s seq 173 -> t+13.568s seq 176; missing [174, 175]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 457
- assignment_event: 9
- bind_progress_event: 9
- assignments: 6
- scanner_event: 4
- drone_link_status: 4
- assignment_timing_hint: 4
- inter_gc_status: 4
- command: 2
- command_ack: 2
- gc_status: 2
- inter_gc_command_queued: 1
