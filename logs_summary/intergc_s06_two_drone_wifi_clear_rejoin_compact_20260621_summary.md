# Live Debug Log Summary

- Source: `logs_summary\intergc_s06_two_drone_wifi_clear_rejoin_compact_20260621.jsonl`
- Parsed records: 1098
- Approx duration: 150.1s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 324 ms, max 475 ms, avg 399 ms
- Inter-GC queued command events: 2
- t+8.325s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.529s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 15
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Suspicious JSON fragment lines: 1
- Malformed samples: t+22.704s telegc: {"type":"assignment_event","event":"assign_created","nodeId":6,"sourceRole":"magic_ground_control","frequencyMhz":925,"c
- Fragment samples: t+22.704s telegc: ive","sourceRole":"magic_ground_control","reason":"waiting_for_join","listenStartGcMillis":32500,"listenDeadlineGcMillis

## Bind And Search
- Search events: 10
- Bind progress events: 17
- Assignment events: 17
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, join_request_received=3, telemetry_period_rejected=3, post_bind_first_telemetry=2, assign_created=1
- Empty-assignment shared RX: starts=2, active_ticks=18, joins=0, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+9.146s to t+18.934s
- t+22.704s node 6: timing - telemetry_period_observed
- t+22.717s node 6: telemetry_bind - telemetry_live
- t+22.954s node 6: timing - telemetry_period_rejected
- t+23.342s node 6: timing - telemetry_period_rejected
- t+23.355s node 6: complete - telemetry_period_locked
- t+40.749s node 3: quiet - join_request_received
- t+41.080s node 3: quiet - assign_created
- t+66.636s node 3: quiet - join_request_received
- t+66.648s node 3: timing - telemetry_period_observed
- t+66.661s node 3: telemetry_bind - telemetry_live
- t+66.905s node 3: timing - telemetry_period_rejected
- t+67.123s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=0
- node 3
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 865

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Sequence Gaps
- Observed sequence gaps: 232
- node 3: t+3.903s seq 8 -> t+4.300s seq 10; missing [9]
- node 3: t+4.300s seq 10 -> t+4.738s seq 13; missing [11, 12]
- node 3: t+4.738s seq 13 -> t+5.156s seq 15; missing [14]
- node 3: t+5.156s seq 15 -> t+5.539s seq 17; missing [16]
- node 3: t+5.539s seq 17 -> t+5.936s seq 19; missing [18]
- node 3: t+5.936s seq 19 -> t+6.347s seq 21; missing [20]
- node 3: t+6.347s seq 21 -> t+6.738s seq 23; missing [22]
- node 3: t+6.738s seq 23 -> t+7.150s seq 25; missing [24]
- node 3: t+7.150s seq 25 -> t+7.538s seq 27; missing [26]
- node 3: t+7.538s seq 27 -> t+7.938s seq 29; missing [28]
- node 3: t+7.938s seq 29 -> t+66.661s seq 11; missing [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, +17 more]
- node 3: t+66.661s seq 11 -> t+66.905s seq 13; missing [12]

## Transport Findings
- Malformed serial JSON payloads: 1.
- Suspicious JSON fragments: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 865
- scanner_event: 21
- assignment_event: 17
- bind_progress_event: 17
- inter_gc_status: 15
- assignments: 11
- search_event: 10
- drone_link_status: 4
- assignment_timing_hint: 4
- command: 2
- inter_gc_command_queued: 2
- command_ack: 2
- session_event: 2
- gc_status: 1
