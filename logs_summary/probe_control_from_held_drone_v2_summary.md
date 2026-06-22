# Live Debug Log Summary

- Source: `logs_summary\probe_control_from_held_drone_v2.jsonl`
- Parsed records: 1020
- Approx duration: 88.5s

## Commands
- Sent commands: 5
- ACKs: 5 (0 rejected)
- t+26.981s ACK drone/drone debug_reboot accepted: -
- t+56.932s ACK drone/drone get_status accepted: -
- t+57.164s ACK drone/drone debug_restart_join accepted: -
- t+57.804s ACK magc/magic_ground_control debug_shared_rx_probe accepted: -
- t+60.016s ACK drone/drone debug_send_join_request accepted: -

## Bind And Search
- Search events: 2
- Bind progress events: 9
- Assignment events: 11
- Assignment event counts: telemetry_period_observed=2, telemetry_period_rejected=2, telemetry_period_locked=2, join_request_received=1, assign_reused=1, silence_sent=1, assign_sent=1, join_ack_received=1
- t+60.247s node 7: quiet - join_request_received
- t+61.051s node 7: assign - silence_sent
- t+62.278s node 7: ack - assign_sent
- t+63.258s node 7: timing - telemetry_period_observed
- t+63.314s node 7: timing - telemetry_period_rejected
- t+63.504s node 7: complete - telemetry_period_locked
- t+73.021s node 7: timing - telemetry_period_observed
- t+73.116s node 7: timing - telemetry_period_rejected
- t+73.305s node 7: complete - telemetry_period_locked

## Drone Debug
- Drone JOIN events: 12
- JOIN event counts: join_start_shared_channel=3, join_backoff=3, join_request_sent=1, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, msp_fixed_slot_learned=1
- Drone debug events/status rows: 8
- Drone telemetry rows: 208
- t+62.262s node 7: drone_join_event join_assign_accepted
- t+63.146s node 7: drone_join_event join_ack_sent
- t+63.146s node 7: drone_join_event assigned_telemetry_started
- t+63.221s node 7: drone_join_event msp_fixed_slot_learned
- t+26.981s node 7: drone_debug_event reboot_scheduled
- t+26.981s node 7: drone_debug_status backoff
- t+56.957s node 7: drone_debug_status backoff
- t+56.959s node 7: drone_debug_event join_hold_enabled
- t+57.164s node 7: drone_debug_event join_runtime_reset
- t+57.164s node 7: drone_debug_status backoff
- t+60.016s node 7: drone_debug_event forced_join_request_sent
- t+60.016s node 7: drone_debug_status wait_assignment

## State Flicker
- Node 7: 9 rapid state transitions: t+61.051s quiet->assign, t+62.278s assign->ack, t+63.258s ack->timing, t+63.314s timing->online, t+63.314s online->timing, t+63.504s timing->complete, +3 more

## Event Counts
- scanner_event: 356
- drone_telemetry: 208
- telemetry_rebind_event: 24
- drone_live_status: 23
- inter_gc_status: 21
- drone_fc_status: 21
- drone_join_event: 12
- assignment_event: 11
- bind_progress_event: 9
- command: 5
- command_ack: 5
- drone_link_status: 4
- drone_debug_event: 4
- drone_debug_status: 4
- assignments: 2
- debug_shared_rx_probe: 2
- search_event: 2
