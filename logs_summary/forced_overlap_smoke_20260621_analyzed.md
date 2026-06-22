# Live Debug Log Summary

- Source: `logs_summary\forced_overlap_smoke_20260621.jsonl`
- Parsed records: 841
- Approx duration: 75.5s

## Commands
- Sent commands: 29
- ACKs: 29 (0 rejected)
- Derived ACK latency: min 11 ms, max 42 ms, avg 22 ms
- t+58.772s ACK telegc/telemetry_ground_control get_status accepted: -
- t+60.845s ACK telegc/telemetry_ground_control get_status accepted: -
- t+62.921s ACK telegc/telemetry_ground_control get_status accepted: -
- t+64.968s ACK telegc/telemetry_ground_control get_status accepted: -
- t+67.053s ACK telegc/telemetry_ground_control get_status accepted: -
- t+69.165s ACK telegc/telemetry_ground_control get_status accepted: -
- t+71.216s ACK telegc/telemetry_ground_control get_status accepted: -
- t+73.278s ACK telegc/telemetry_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 60
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
- Search events: 8
- Bind progress events: 0
- Assignment events: 1
- Assignment event counts: post_bind_acquire_timeout=1
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=8
- Auto shared RX scanner events: 8
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=2
- node 3; timeouts=2

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 0

## Short-Loss Guard
- Telemetry rebind events: 23
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+73.319s: mode `telemetry_first`
- Assigned packets received: 0
- Assigned RX coverage: 0%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 518
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=29

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 554
- inter_gc_status: 60
- command: 29
- command_ack: 29
- gc_status: 29
- telemetry_rebind_event: 23
- search_event: 8
- assignments: 3
- drone_link_status: 2
- bench_marker: 1
- assignment_event: 1
