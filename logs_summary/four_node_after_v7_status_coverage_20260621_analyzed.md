# Live Debug Log Summary

- Source: `logs_summary\four_node_after_v7_status_coverage_20260621.jsonl`
- Parsed records: 799
- Approx duration: 45.0s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 1386 ms, max 1446 ms, avg 1416 ms
- Inter-GC queued command events: 1
- t+3.390s ACK telegc/telemetry_ground_control get_status accepted: -
- t+3.501s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 17
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
- Search events: 5
- Bind progress events: 6
- Assignment events: 8
- Assignment event counts: telemetry_period_observed=2, post_bind_first_telemetry=2, post_bind_acquire_timeout=2, telemetry_period_locked=2
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=5
- Auto shared RX scanner events: 5
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- t+3.807s node 3: timing - telemetry_period_observed
- t+3.820s node 3: telemetry_bind - telemetry_live
- t+4.099s node 7: timing - telemetry_period_observed
- t+4.125s node 7: telemetry_bind - telemetry_live
- t+7.575s node 3: complete - telemetry_period_locked
- t+7.847s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=4
- node 2; timeouts=2
- node 3
- node 6; timeouts=2
- node 7

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 4

## Short-Loss Guard
- Telemetry rebind events: 14
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+3.430s: mode `waiting_assignments`
- Assigned packets received: 0
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: waiting_assignments=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 2
- node 3: t+3.844s seq 36 -> t+7.587s seq 51; missing [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
- node 7: t+4.125s seq 12 -> t+7.993s seq 27; missing [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 623
- inter_gc_status: 17
- telemetry_rebind_event: 14
- assignment_event: 8
- bind_progress_event: 6
- assignments: 5
- search_event: 5
- drone_telemetry: 4
- drone_link_status: 4
- command: 2
- command_ack: 2
- gc_status: 2
- assignment_timing_hint: 2
- inter_gc_command_queued: 1
