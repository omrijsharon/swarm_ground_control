# Live Debug Log Summary

- Source: `logs_summary\intergc_s00_status_smoke_compactfix_20260621.jsonl`
- Parsed records: 601
- Approx duration: 50.0s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 21 ms, max 275 ms, avg 148 ms
- Inter-GC queued command events: 1
- t+12.023s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.278s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 5
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Malformed samples: t+12.278s telegc: {"type":"gc_status","nodeId":0,"nodeRole":"magic_ground_control","radioProfileId":0,"sharedFrequencyMhz":915,"spreadingF

## Bind And Search
- Search events: 0
- Bind progress events: 8
- Assignment events: 8
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4
- t+4.460s node 3: timing - telemetry_period_observed
- t+4.544s node 6: timing - telemetry_period_observed
- t+4.844s node 3: complete - telemetry_period_locked
- t+4.968s node 6: complete - telemetry_period_locked
- t+12.852s node 3: timing - telemetry_period_observed
- t+12.948s node 6: timing - telemetry_period_observed
- t+13.074s node 3: complete - telemetry_period_locked
- t+13.146s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 448

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+12.063s: mode `telemetry_first`
- Assigned packets received: 74
- Assigned RX coverage: 100%
- Sequence gap events: 2
- Missing sequence IDs: 2
- Max sequence gap: 1
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 4
- node 3: t+4.856s seq 21 -> t+5.138s seq 23; missing [22]
- node 3: t+12.278s seq 58 -> t+12.935s seq 62; missing [59, 60, 61]
- node 6: t+4.641s seq 40 -> t+5.138s seq 42; missing [41]
- node 6: t+12.395s seq 78 -> t+13.045s seq 82; missing [79, 80, 81]

## Transport Findings
- Malformed serial JSON payloads: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 448
- assignment_event: 8
- bind_progress_event: 8
- assignments: 6
- inter_gc_status: 5
- scanner_event: 4
- drone_link_status: 4
- assignment_timing_hint: 4
- command: 2
- command_ack: 2
- gc_status: 1
- inter_gc_command_queued: 1
