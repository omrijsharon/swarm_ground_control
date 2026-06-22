# Live Debug Log Summary

- Source: `logs_summary\node2_coverage_after_v7_20260621.jsonl`
- Parsed records: 800
- Approx duration: 44.3s

## Commands
- Sent commands: 5
- ACKs: 5 (0 rejected)
- Derived ACK latency: min 14 ms, max 152 ms, avg 44 ms
- Inter-GC queued command events: 1
- t+4.023s ACK telegc/telemetry_ground_control get_status accepted: -
- t+4.161s ACK magc/magic_ground_control get_status accepted: -
- t+14.025s ACK telegc/telemetry_ground_control get_status accepted: -
- t+24.230s ACK telegc/telemetry_ground_control get_status accepted: -
- t+34.432s ACK telegc/telemetry_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 18
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
- Search events: 4
- Bind progress events: 8
- Assignment events: 10
- Assignment event counts: telemetry_period_observed=3, post_bind_first_telemetry=3, post_bind_acquire_timeout=2, telemetry_period_locked=2
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=4
- Auto shared RX scanner events: 4
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- t+3.903s node 3: timing - telemetry_period_observed
- t+3.930s node 3: telemetry_bind - telemetry_live
- t+4.653s node 3: timing - telemetry_period_observed
- t+4.679s node 3: telemetry_bind - telemetry_live
- t+4.952s node 7: timing - telemetry_period_observed
- t+4.977s node 7: telemetry_bind - telemetry_live
- t+7.684s node 3: complete - telemetry_period_locked
- t+7.950s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=6, timeouts=4
- node 2; timeouts=2
- node 3
- node 6; timeouts=2
- node 7

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 6

## Short-Loss Guard
- Telemetry rebind events: 11
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+34.485s: mode `telemetry_first`
- Assigned packets received: 6
- Assigned RX coverage: 2%
- Sequence gap events: 2
- Missing sequence IDs: 22
- Max sequence gap: 11
- Assigned slot misses: 215
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=4

## Telemetry Sequence Gaps
- Observed sequence gaps: 3
- node 3: t+3.930s seq 26 -> t+4.679s seq 29; missing [27, 28]
- node 3: t+4.679s seq 29 -> t+7.695s seq 41; missing [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
- node 7: t+4.977s seq 5 -> t+8.122s seq 17; missing [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 607
- inter_gc_status: 18
- telemetry_rebind_event: 11
- assignments: 10
- assignment_event: 10
- bind_progress_event: 8
- drone_telemetry: 6
- command: 5
- drone_link_status: 5
- command_ack: 5
- gc_status: 5
- search_event: 4
- coverage_marker: 2
- assignment_timing_hint: 2
- inter_gc_command_queued: 1
