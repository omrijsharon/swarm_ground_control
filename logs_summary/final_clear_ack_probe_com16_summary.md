# Live Debug Log Summary

- Source: `logs_summary\final_clear_ack_probe_com16.jsonl`
- Parsed records: 797
- Approx duration: 77.1s

## Commands
- Sent commands: 5
- ACKs: 5 (0 rejected)
- t+22.253s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+26.043s ACK drone/drone debug_reboot accepted: -
- t+56.033s ACK drone/drone debug_restart_join accepted: -
- t+57.219s ACK magc/magic_ground_control debug_shared_rx_probe accepted: -
- t+60.098s ACK drone/drone debug_send_join_request accepted: -

## Bind And Search
- Search events: 2
- Bind progress events: 6
- Assignment events: 7
- Assignment event counts: join_request_received=1, assign_created=1, silence_sent=1, assign_sent=1, join_ack_received=1, telemetry_period_observed=1, telemetry_period_locked=1
- t+60.067s node 7: quiet - join_request_received
- t+60.270s node 7: quiet - assign_created
- t+61.083s node 7: assign - silence_sent
- t+62.305s node 7: ack - assign_sent
- t+72.584s node 7: timing - telemetry_period_observed
- t+72.819s node 7: complete - telemetry_period_locked

## Drone Debug
- Drone JOIN events: 13
- JOIN event counts: join_start_shared_channel=3, join_backoff=3, join_request_sent=2, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, msp_fixed_slot_learned=1
- Drone debug events/status rows: 7
- Drone telemetry rows: 43
- t+61.115s node 7: drone_join_event silence_received
- t+62.336s node 7: drone_join_event join_assign_accepted
- t+63.216s node 7: drone_join_event join_ack_sent
- t+63.217s node 7: drone_join_event assigned_telemetry_started
- t+63.292s node 7: drone_join_event msp_fixed_slot_learned
- t+26.043s node 7: drone_debug_event reboot_scheduled
- t+26.043s node 7: drone_debug_status wait_assignment
- t+56.033s node 7: drone_debug_event join_hold_enabled
- t+56.033s node 7: drone_debug_event join_runtime_reset
- t+56.238s node 7: drone_debug_status backoff
- t+60.098s node 7: drone_debug_event forced_join_request_sent
- t+60.098s node 7: drone_debug_status wait_assignment

## State Flicker
- Node 7: 159 rapid state transitions: t+11.270s locking->offline, t+11.433s offline->locking, t+11.434s locking->offline, t+11.598s offline->locking, t+11.598s locking->offline, t+11.763s offline->locking, +153 more

## Event Counts
- drone_link_status: 157
- scanner_event: 79
- channel_scan_event: 67
- drone_telemetry: 43
- drone_live_status: 14
- drone_fc_status: 14
- drone_join_event: 13
- inter_gc_status: 7
- telemetry_rebind_event: 7
- assignment_event: 7
- bind_progress_event: 6
- command: 5
- command_ack: 5
- drone_debug_event: 4
- orphan_recovery_event: 4
- assignments: 3
- session_event: 3
- drone_debug_status: 3
- search_event: 2
- debug_shared_rx_probe: 1
