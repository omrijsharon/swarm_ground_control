# Live Debug Log Summary

- Source: `logs_summary\profile_debug_robust_autojoin_20260622_114210.jsonl`
- Parsed records: 432
- Approx duration: 74.9s

## Commands
- Sent commands: 3
- ACKs: 3 (0 rejected)
- Derived ACK latency: min 151 ms, max 303 ms, avg 235 ms
- Inter-GC queued command events: 3
- t+10.154s ACK magc/magic_ground_control set_radio_profile accepted: -
- t+10.357s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+10.357s ACK magc/magic_ground_control start_search accepted: -

## Inter-GC Transport
- Inter-GC status rows: 51
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
- Search events: 7
- Bind progress events: 8
- Assignment events: 9
- Assignment event counts: join_request_received=1, telemetry_period_observed=1, post_bind_first_telemetry=1, assign_created=1, silence_sent=1, telemetry_period_locked=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1
- Operator shared/discovery RX: starts=1, active_ticks=0, completes=1
- Operator shared/discovery RX scanner events: 2
- Operator shared/discovery RX GC window: 9392208 to 9407140 ms (14.9s)
- Operator shared/discovery RX window observed: t+10.563s to t+25.374s
- JOINs received during operator shared/discovery RX by GC clock: 0
- Operator shared RX complete reasons: search_timeout
- Empty-assignment shared RX: starts=0, active_ticks=0, joins=2, completes=0, oocr_deferred=0
- t+29.833s node 7: quiet - join_request_received
- t+29.843s node 7: timing - telemetry_period_observed
- t+29.859s node 7: telemetry_bind - telemetry_live
- t+30.031s node 7: quiet - assign_created
- t+30.031s node 7: assign - silence_sent
- t+30.061s node 7: complete - telemetry_period_locked
- t+30.117s node 7: ack - assign_sent
- t+30.258s node 7: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=2, first_telemetry=2, timeouts=0
- node 7; ACK->telemetry -0.398s; acquire->telemetry -0.398s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 225

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 225
- inter_gc_status: 51
- assignment_event: 9
- scanner_event: 8
- bind_progress_event: 8
- search_event: 7
- assignments: 4
- command: 3
- inter_gc_command_queued: 3
- command_ack: 3
- session_event: 2
- drone_link_status: 1
- assignment_timing_hint: 1
