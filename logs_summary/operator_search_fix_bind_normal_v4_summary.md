# Live Debug Log Summary

- Source: `logs_summary\operator_search_fix_bind_normal_v4.jsonl`
- Parsed records: 1083
- Approx duration: 100.0s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- t+26.150s ACK drone/drone debug_reboot accepted: -
- t+54.021s ACK drone/drone get_status accepted: -
- t+54.252s ACK drone/drone debug_restart_join accepted: -
- t+54.423s ACK telegc/telemetry_ground_control get_status accepted: -
- t+54.828s ACK magc/magic_ground_control get_status accepted: -
- t+55.031s ACK magc/magic_ground_control start_search accepted: -
- t+56.283s ACK drone/drone debug_send_join_request accepted: -

## Bind And Search
- Search events: 4
- Bind progress events: 9
- Assignment events: 12
- Assignment event counts: telemetry_period_rejected=4, telemetry_period_observed=2, telemetry_period_locked=2, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1
- Operator shared RX: starts=0, active_ticks=1, completes=0
- Operator shared RX scanner events: 1
- Operator shared RX GC window: 112062 to 126997 ms (14.9s)
- Operator shared RX window observed: t+56.048s to t+56.048s
- JOINs received during operator shared RX by GC clock: 1
- t+56.448s node 7: quiet - join_request_received
- t+59.858s node 7: timing - telemetry_period_observed
- t+60.050s node 7: timing - telemetry_period_rejected
- t+60.127s node 7: timing - telemetry_period_rejected
- t+60.213s node 7: timing - telemetry_period_rejected
- t+60.373s node 7: complete - telemetry_period_locked
- t+60.582s node 7: timing - telemetry_period_observed
- t+60.802s node 7: timing - telemetry_period_rejected
- t+60.951s node 7: complete - telemetry_period_locked

## Drone Debug
- Drone JOIN events: 12
- JOIN event counts: join_start_shared_channel=3, join_backoff=3, join_request_sent=1, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, msp_fixed_slot_learned=1
- Drone debug events/status rows: 8
- Drone telemetry rows: 200
- t+58.516s node 7: drone_join_event join_assign_accepted
- t+59.442s node 7: drone_join_event join_ack_sent
- t+59.444s node 7: drone_join_event assigned_telemetry_started
- t+59.517s node 7: drone_join_event msp_fixed_slot_learned
- t+26.150s node 7: drone_debug_event reboot_scheduled
- t+26.351s node 7: drone_debug_status backoff
- t+54.044s node 7: drone_debug_status backoff
- t+54.044s node 7: drone_debug_event join_hold_enabled
- t+54.252s node 7: drone_debug_event join_runtime_reset
- t+54.252s node 7: drone_debug_status backoff
- t+56.283s node 7: drone_debug_event forced_join_request_sent
- t+56.283s node 7: drone_debug_status wait_assignment

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 351
- drone_telemetry: 200
- telemetry_rebind_event: 51
- inter_gc_status: 28
- drone_live_status: 23
- drone_fc_status: 21
- drone_join_event: 12
- assignment_event: 12
- channel_scan_event: 10
- bind_progress_event: 9
- command: 7
- command_ack: 7
- drone_link_status: 5
- drone_debug_event: 4
- drone_debug_status: 4
- search_event: 4
- assignments: 3
- orphan_recovery_event: 3
- gc_status: 1
