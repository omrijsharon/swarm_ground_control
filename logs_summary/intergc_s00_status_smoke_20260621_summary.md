# Live Debug Log Summary

- Source: `logs_summary\intergc_s00_status_smoke_20260621.jsonl`
- Parsed records: 418
- Approx duration: 49.9s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 9 ms, max 466 ms, avg 237 ms
- Inter-GC queued command events: 1
- t+12.014s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.471s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 4
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Malformed RX JSON payload lines: 2
- Malformed samples: t+12.680s telegc: {"type":"gc_status","nodeId":0,"nodassignedChannels":2,"searchMode":false,"operatorSharedRxActive":false,"operatorSearch; t+13.912s telegc: {"schemaVersion":1,bootUnverified":true,"lastSequenceId":0,"lastSequenceValid":false,"messageId":29}

## Bind And Search
- Search events: 0
- Bind progress events: 6
- Assignment events: 6
- Assignment event counts: telemetry_period_observed=3, telemetry_period_locked=3
- t+3.770s node 3: timing - telemetry_period_observed
- t+3.864s node 6: timing - telemetry_period_observed
- t+3.997s node 3: complete - telemetry_period_locked
- t+4.058s node 6: complete - telemetry_period_locked
- t+14.369s node 3: timing - telemetry_period_observed
- t+14.569s node 3: complete - telemetry_period_locked

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
- Drone telemetry rows: 261

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+12.060s: mode `telemetry_first`
- Assigned packets received: 83
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 2
- node 3: t+12.014s seq 13 -> t+14.409s seq 25; missing [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
- node 3: t+14.928s seq 26 -> t+15.132s seq 28; missing [27]

## Transport Findings
- Malformed serial JSON payloads: 2.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 261
- assignments: 6
- assignment_event: 6
- bind_progress_event: 6
- inter_gc_status: 4
- scanner_event: 3
- drone_link_status: 3
- assignment_timing_hint: 3
- command: 2
- command_ack: 2
- gc_status: 1
- inter_gc_command_queued: 1
