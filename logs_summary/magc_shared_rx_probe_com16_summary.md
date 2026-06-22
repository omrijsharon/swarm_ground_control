# Live Debug Log Summary

- Source: `logs_summary\magc_shared_rx_probe_com16.jsonl`
- Parsed records: 506
- Approx duration: 77.0s

## Commands
- Sent commands: 5
- ACKs: 5 (0 rejected)
- t+26.066s ACK drone/drone debug_reboot accepted: -
- t+56.023s ACK drone/drone get_status accepted: -
- t+56.252s ACK drone/drone debug_restart_join accepted: -
- t+57.313s ACK magc/magic_ground_control debug_shared_rx_probe accepted: -
- t+60.167s ACK drone/drone debug_send_join_request accepted: -

## Bind And Search
- Search events: 2
- Bind progress events: 7
- Assignment events: 7
- Assignment event counts: join_request_received=1, assign_created=1, silence_sent=1, assign_sent=1, join_ack_received=1, telemetry_period_observed=1, telemetry_period_locked=1
- t+60.221s node 7: quiet - join_request_received
- t+60.427s node 7: quiet - assign_created
- t+61.251s node 7: assign - silence_sent
- t+62.484s node 7: ack - assign_sent
- t+63.541s node 7: telemetry_bind - assignment_completed
- t+72.616s node 7: timing - telemetry_period_observed
- t+72.773s node 7: complete - telemetry_period_locked

## Drone Debug
- Drone JOIN events: 12
- JOIN event counts: join_start_shared_channel=3, join_backoff=3, join_request_sent=1, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, msp_fixed_slot_learned=1
- Drone debug events/status rows: 8
- Drone telemetry rows: 42
- t+62.421s node 7: drone_join_event join_assign_accepted
- t+63.247s node 7: drone_join_event join_ack_sent
- t+63.247s node 7: drone_join_event assigned_telemetry_started
- t+63.318s node 7: drone_join_event msp_fixed_slot_learned
- t+26.066s node 7: drone_debug_event reboot_scheduled
- t+26.270s node 7: drone_debug_status backoff
- t+56.045s node 7: drone_debug_status backoff
- t+56.045s node 7: drone_debug_event join_hold_enabled
- t+56.252s node 7: drone_debug_event join_runtime_reset
- t+56.252s node 7: drone_debug_status backoff
- t+60.167s node 7: drone_debug_event forced_join_request_sent
- t+60.167s node 7: drone_debug_status wait_assignment

## State Flicker
- Node 7: 8 rapid state transitions: t+61.251s quiet->assign, t+62.484s assign->ack, t+63.541s ack->telemetry_bind, t+72.616s locking->timing, t+72.724s timing->online, t+72.724s online->locking, +2 more

## Event Counts
- channel_scan_event: 60
- drone_telemetry: 42
- drone_live_status: 15
- drone_fc_status: 14
- drone_join_event: 12
- orphan_recovery_event: 9
- assignment_event: 7
- bind_progress_event: 7
- command: 5
- command_ack: 5
- drone_debug_event: 4
- drone_debug_status: 4
- drone_link_status: 4
- assignments: 2
- debug_shared_rx_probe: 2
- search_event: 2
- scanner_event: 1
