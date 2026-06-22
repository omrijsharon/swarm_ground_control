# Live Debug Log Summary

- Source: `logs_summary\profile_fix_robust_autojoin_20260622_120315.jsonl`
- Parsed records: 367
- Approx duration: 89.8s

## Commands
- Sent commands: 3
- ACKs: 3 (0 rejected)
- Derived ACK latency: min 142 ms, max 299 ms, avg 230 ms
- Inter-GC queued command events: 3
- t+10.149s ACK magc/magic_ground_control set_radio_profile accepted: -
- t+10.358s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+10.358s ACK magc/magic_ground_control start_search accepted: -

## Inter-GC Transport
- Inter-GC status rows: 44
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
- Assignment events: 9
- Assignment event counts: join_request_received=1, assign_created=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, telemetry_period_observed=1, post_bind_first_telemetry=1, telemetry_period_locked=1
- Operator shared/discovery RX: starts=1, active_ticks=0, completes=1
- Operator shared/discovery RX scanner events: 2
- Operator shared/discovery RX GC window: 51148 to 66093 ms (14.9s)
- Operator shared/discovery RX window observed: t+10.566s to t+25.194s
- JOINs received during operator shared/discovery RX by GC clock: 0
- Operator shared RX complete reasons: search_timeout
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+25.397s to t+45.145s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+30.187s node 7: quiet - join_request_received
- t+30.348s node 7: quiet - assign_created
- t+30.348s node 7: assign - silence_sent
- t+30.531s node 7: ack - assign_sent
- t+30.531s node 7: telemetry_bind - assignment_completed
- t+30.822s node 7: timing - telemetry_period_observed
- t+30.834s node 7: telemetry_bind - telemetry_live
- t+31.290s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=2, first_telemetry=2, timeouts=0
- node 7; ACK->telemetry 0.319s; acquire->telemetry 0.319s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 126

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Receiver Budget
- Events: recovery_budget_used=12

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 126
- scanner_event: 46
- inter_gc_status: 44
- search_event: 9
- assignment_event: 9
- bind_progress_event: 8
- assignments: 4
- command: 3
- inter_gc_command_queued: 3
- command_ack: 3
- drone_link_status: 2
- session_event: 2
- assignment_timing_hint: 1
