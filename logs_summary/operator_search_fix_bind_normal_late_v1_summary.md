# Live Debug Log Summary

- Source: `logs_summary\operator_search_fix_bind_normal_late_v1.jsonl`
- Parsed records: 1162
- Approx duration: 134.3s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- t+26.388s ACK drone/drone debug_reboot accepted: -
- t+54.020s ACK drone/drone get_status accepted: -
- t+54.258s ACK drone/drone debug_restart_join accepted: -
- t+54.424s ACK telegc/telemetry_ground_control get_status accepted: -
- t+54.861s ACK magc/magic_ground_control get_status accepted: -
- t+55.266s ACK magc/magic_ground_control start_search accepted: -
- t+68.958s ACK drone/drone debug_send_join_request accepted: -

## Bind And Search
- Search events: 16
- Bind progress events: 8
- Assignment events: 10
- Assignment event counts: telemetry_period_observed=2, telemetry_period_rejected=2, telemetry_period_locked=2, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1
- Operator shared RX: starts=0, active_ticks=13, completes=0
- Operator shared RX scanner events: 13
- Operator shared RX GC window: 575157 to 590092 ms (14.9s)
- Operator shared RX window observed: t+56.068s to t+68.073s
- JOINs received during operator shared RX by GC clock: 1
- t+68.869s node 7: quiet - join_request_received
- t+69.897s node 7: assign - silence_sent
- t+72.257s node 7: timing - telemetry_period_observed
- t+72.563s node 7: timing - telemetry_period_rejected
- t+72.998s node 7: complete - telemetry_period_locked
- t+73.720s node 7: timing - telemetry_period_observed
- t+73.809s node 7: timing - telemetry_period_rejected
- t+73.923s node 7: complete - telemetry_period_locked

## Drone Debug
- Drone JOIN events: 12
- JOIN event counts: join_start_shared_channel=3, join_backoff=3, join_request_sent=1, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, msp_fixed_slot_learned=1
- Drone debug events/status rows: 8
- Drone telemetry rows: 99
- t+70.990s node 7: drone_join_event join_assign_accepted
- t+71.936s node 7: drone_join_event join_ack_sent
- t+71.937s node 7: drone_join_event assigned_telemetry_started
- t+72.009s node 7: drone_join_event msp_fixed_slot_learned
- t+26.174s node 7: drone_debug_event reboot_scheduled
- t+26.388s node 7: drone_debug_status backoff
- t+54.045s node 7: drone_debug_status backoff
- t+54.045s node 7: drone_debug_event join_hold_enabled
- t+54.258s node 7: drone_debug_event join_runtime_reset
- t+54.258s node 7: drone_debug_status backoff
- t+68.958s node 7: drone_debug_event forced_join_request_sent
- t+68.958s node 7: drone_debug_status wait_assignment

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 480
- drone_telemetry: 99
- telemetry_rebind_event: 58
- drone_live_status: 42
- drone_fc_status: 41
- inter_gc_status: 23
- search_event: 16
- drone_join_event: 12
- assignment_event: 10
- bind_progress_event: 8
- command: 7
- command_ack: 7
- drone_link_status: 5
- orphan_recovery_event: 5
- drone_debug_event: 4
- drone_debug_status: 4
- assignments: 3
- gc_status: 1
- channel_scan_event: 1
