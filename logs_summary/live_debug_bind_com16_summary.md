# Live Debug Log Summary

- Source: `logs_summary\live_debug_bind_com16.jsonl`
- Parsed records: 3006
- Approx duration: 150.1s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- t+26.265s ACK drone/drone debug_reboot accepted: -
- t+56.016s ACK drone/drone get_status accepted: -
- t+56.248s ACK drone/drone debug_restart_join accepted: -
- t+56.431s ACK telegc/telemetry_ground_control get_status accepted: -
- t+56.692s ACK magc/magic_ground_control get_status accepted: -
- t+57.421s ACK magc/magic_ground_control start_search accepted: -
- t+58.505s ACK drone/drone debug_send_join_request accepted: -

## Bind And Search
- Search events: 1
- Bind progress events: 0
- Assignment events: 0

## Drone Debug
- Drone JOIN events: 8
- JOIN event counts: join_backoff=4, join_start_shared_channel=3, join_request_sent=1
- Drone debug events/status rows: 8
- Drone telemetry rows: 0
- t+56.038s node 7: drone_join_event join_start_shared_channel
- t+56.038s node 7: drone_join_event join_backoff
- t+58.505s node 7: drone_join_event join_request_sent
- t+62.006s node 7: drone_join_event join_backoff
- t+26.056s node 7: drone_debug_event reboot_scheduled
- t+26.265s node 7: drone_debug_status backoff
- t+56.038s node 7: drone_debug_status backoff
- t+56.038s node 7: drone_debug_event join_hold_enabled
- t+56.248s node 7: drone_debug_event join_runtime_reset
- t+56.248s node 7: drone_debug_status backoff
- t+58.505s node 7: drone_debug_event forced_join_request_sent
- t+58.505s node 7: drone_debug_status wait_assignment

## State Flicker
- Node 6: 1679 rapid state transitions: t+10.873s locking->offline, t+11.030s offline->locking, t+11.030s locking->offline, t+11.189s offline->locking, t+11.189s locking->offline, t+11.351s offline->locking, +1673 more

## Event Counts
- drone_link_status: 1680
- scanner_event: 844
- inter_gc_status: 60
- telemetry_rebind_event: 56
- drone_join_event: 8
- command: 7
- command_ack: 7
- assignments: 4
- drone_debug_event: 4
- drone_debug_status: 4
- gc_status: 2
- drone_live_status: 1
- search_event: 1
