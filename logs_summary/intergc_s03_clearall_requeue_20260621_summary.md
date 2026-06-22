# Live Debug Log Summary

- Source: `logs_summary\intergc_s03_clearall_requeue_20260621.jsonl`
- Parsed records: 435
- Approx duration: 110.0s

## Commands
- Sent commands: 5
- ACKs: 5 (0 rejected)
- Derived ACK latency: min 313 ms, max 1171 ms, avg 788 ms
- Inter-GC queued command events: 5
- t+10.366s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+10.366s ACK magc/magic_ground_control get_status accepted: -
- t+11.175s ACK magc/magic_ground_control start_search accepted: -
- t+11.175s ACK magc/magic_ground_control cancel_search accepted: -
- t+11.377s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 42
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
- Search events: 94
- Bind progress events: 4
- Assignment events: 4
- Assignment event counts: telemetry_period_observed=2, telemetry_period_locked=2
- Operator shared RX: starts=1, active_ticks=0, completes=0
- Operator shared RX scanner events: 1
- Operator shared RX GC window: 256359 to 270931 ms (14.6s)
- Operator shared RX window observed: t+11.987s to t+11.987s
- Empty-assignment shared RX: starts=2, active_ticks=180, joins=0, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+11.987s to t+109.973s
- t+4.609s node 3: timing - telemetry_period_observed
- t+4.699s node 6: timing - telemetry_period_observed
- t+4.817s node 3: complete - telemetry_period_locked
- t+4.927s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 56

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 95
- search_event: 94
- drone_telemetry: 56
- inter_gc_status: 42
- assignments: 5
- command: 5
- inter_gc_command_queued: 5
- command_ack: 5
- assignment_event: 4
- bind_progress_event: 4
- gc_status: 4
- drone_link_status: 2
- assignment_timing_hint: 2
- session_event: 2
