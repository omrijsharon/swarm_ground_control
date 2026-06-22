# Live Debug Log Summary

- Source: `logs_summary\profile_fix_balanced_autojoin_20260622_120716.jsonl`
- Parsed records: 423
- Approx duration: 69.9s

## Commands
- Sent commands: 3
- ACKs: 3 (0 rejected)
- Derived ACK latency: min 86 ms, max 236 ms, avg 153 ms
- Inter-GC queued command events: 3
- t+10.142s ACK magc/magic_ground_control set_radio_profile accepted: -
- t+10.142s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+10.345s ACK magc/magic_ground_control start_search accepted: -

## Inter-GC Transport
- Inter-GC status rows: 36
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
- Search events: 9
- Bind progress events: 8
- Assignment events: 10
- Assignment event counts: post_bind_acquire_timeout=1, join_request_received=1, assign_created=1, telemetry_period_observed=1, post_bind_first_telemetry=1, silence_sent=1, assign_sent=1, telemetry_period_locked=1, join_ack_received=1, post_bind_acquire_started=1
- Operator shared/discovery RX: starts=1, active_ticks=0, completes=1
- Operator shared/discovery RX scanner events: 2
- Operator shared/discovery RX GC window: 293676 to 308626 ms (14.9s)
- Operator shared/discovery RX window observed: t+10.554s to t+25.312s
- JOINs received during operator shared/discovery RX by GC clock: 0
- Operator shared RX complete reasons: search_timeout
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+25.313s to t+46.221s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+31.416s node 7: quiet - join_request_received
- t+31.478s node 7: quiet - assign_created
- t+31.490s node 7: timing - telemetry_period_observed
- t+31.502s node 7: telemetry_bind - telemetry_live
- t+31.675s node 7: assign - silence_sent
- t+31.675s node 7: ack - assign_sent
- t+31.713s node 7: complete - telemetry_period_locked
- t+31.892s node 7: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=2, first_telemetry=2, timeouts=2
- node 7; ACK->telemetry -0.217s; acquire->telemetry -0.366s; timeouts=2

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 192

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Receiver Budget
- Events: recovery_budget_used=9

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 192
- scanner_event: 45
- inter_gc_status: 36
- assignment_event: 10
- search_event: 9
- bind_progress_event: 8
- assignments: 4
- command: 3
- inter_gc_command_queued: 3
- command_ack: 3
- session_event: 2
- drone_link_status: 1
- assignment_timing_hint: 1
