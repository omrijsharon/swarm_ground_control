# Live Debug Log Summary

- Source: `logs_summary\live_debug_bind_com16_clean.jsonl`
- Parsed records: 1205
- Approx duration: 128.9s

## Commands
- Sent commands: 9
- ACKs: 7 (0 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0001, live-dbg-magc-0002
- t+33.045s ACK drone/drone debug_reboot accepted: -
- t+63.022s ACK drone/drone get_status accepted: -
- t+63.244s ACK drone/drone debug_restart_join accepted: -
- t+64.029s ACK telegc/telemetry_ground_control get_status accepted: -
- t+65.255s ACK magc/magic_ground_control start_search accepted: -
- t+68.043s ACK drone/drone debug_send_join_request accepted: -
- t+127.240s ACK magc/magic_ground_control cancel_search accepted: -

## Bind And Search
- Search events: 3
- Bind progress events: 0
- Assignment events: 0

## Drone Debug
- Drone JOIN events: 9
- JOIN event counts: join_backoff=4, join_start_shared_channel=3, join_request_sent=2
- Drone debug events/status rows: 8
- Drone telemetry rows: 0
- t+63.044s node 7: drone_join_event join_start_shared_channel
- t+63.044s node 7: drone_join_event join_backoff
- t+68.043s node 7: drone_join_event join_request_sent
- t+71.533s node 7: drone_join_event join_backoff
- t+33.045s node 7: drone_debug_event reboot_scheduled
- t+33.045s node 7: drone_debug_status wait_assignment
- t+63.044s node 7: drone_debug_status backoff
- t+63.044s node 7: drone_debug_event join_hold_enabled
- t+63.244s node 7: drone_debug_event join_runtime_reset
- t+63.244s node 7: drone_debug_status backoff
- t+68.043s node 7: drone_debug_event forced_join_request_sent
- t+68.043s node 7: drone_debug_status wait_assignment

## State Flicker
- Node 6: 194 rapid state transitions: t+10.892s locking->offline, t+11.059s offline->locking, t+11.059s locking->offline, t+11.230s offline->locking, t+11.230s locking->offline, t+11.392s offline->locking, +188 more
- Node 7: 194 rapid state transitions: t+11.034s locking->offline, t+11.198s offline->locking, t+11.198s locking->offline, t+11.361s offline->locking, t+11.361s locking->offline, t+11.520s offline->locking, +188 more

## Event Counts
- drone_link_status: 393
- scanner_event: 198
- channel_scan_event: 134
- inter_gc_status: 25
- orphan_recovery_event: 24
- telemetry_rebind_event: 10
- command: 9
- drone_join_event: 9
- command_ack: 7
- assignments: 4
- drone_debug_event: 4
- drone_debug_status: 4
- session_event: 3
- search_event: 3
- drone_live_status: 1
- gc_status: 1
