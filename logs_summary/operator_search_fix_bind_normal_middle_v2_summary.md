# Live Debug Log Summary

- Source: `logs_summary\operator_search_fix_bind_normal_middle_v2.jsonl`
- Parsed records: 1147
- Approx duration: 124.5s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- t+26.286s ACK drone/drone debug_reboot accepted: -
- t+54.022s ACK drone/drone get_status accepted: -
- t+54.251s ACK drone/drone debug_restart_join accepted: -
- t+54.422s ACK telegc/telemetry_ground_control get_status accepted: -
- t+54.859s ACK magc/magic_ground_control get_status accepted: -
- t+55.265s ACK magc/magic_ground_control start_search accepted: -
- t+62.810s ACK drone/drone debug_send_join_request accepted: -

## Bind And Search
- Search events: 11
- Bind progress events: 8
- Assignment events: 9
- Assignment event counts: telemetry_period_observed=2, telemetry_period_locked=2, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, telemetry_period_rejected=1
- Operator shared RX: starts=0, active_ticks=7, completes=0
- Operator shared RX scanner events: 7
- Operator shared RX GC window: 435611 to 450546 ms (14.9s)
- Operator shared RX window observed: t+56.282s to t+62.124s
- JOINs received during operator shared RX by GC clock: 1
- t+63.128s node 7: quiet - join_request_received
- t+63.966s node 7: assign - silence_sent
- t+65.184s node 7: ack - assign_sent
- t+66.087s node 7: timing - telemetry_period_observed
- t+66.207s node 7: timing - telemetry_period_rejected
- t+66.408s node 7: complete - telemetry_period_locked
- t+66.615s node 7: timing - telemetry_period_observed
- t+66.720s node 7: complete - telemetry_period_locked

## Drone Debug
- Drone JOIN events: 12
- JOIN event counts: join_start_shared_channel=3, join_backoff=3, join_request_sent=1, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, msp_fixed_slot_learned=1
- Drone debug events/status rows: 8
- Drone telemetry rows: 164
- t+65.044s node 7: drone_join_event join_assign_accepted
- t+65.940s node 7: drone_join_event join_ack_sent
- t+65.940s node 7: drone_join_event assigned_telemetry_started
- t+66.014s node 7: drone_join_event msp_fixed_slot_learned
- t+26.078s node 7: drone_debug_event reboot_scheduled
- t+26.286s node 7: drone_debug_status backoff
- t+54.047s node 7: drone_debug_status backoff
- t+54.047s node 7: drone_debug_event join_hold_enabled
- t+54.251s node 7: drone_debug_event join_runtime_reset
- t+54.251s node 7: drone_debug_status backoff
- t+62.810s node 7: drone_debug_event forced_join_request_sent
- t+62.810s node 7: drone_debug_status wait_assignment

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 418
- drone_telemetry: 164
- telemetry_rebind_event: 51
- drone_live_status: 39
- drone_fc_status: 38
- inter_gc_status: 36
- drone_join_event: 12
- search_event: 11
- assignment_event: 9
- bind_progress_event: 8
- command: 7
- command_ack: 7
- drone_link_status: 5
- drone_debug_event: 4
- drone_debug_status: 4
- assignments: 3
- gc_status: 1
