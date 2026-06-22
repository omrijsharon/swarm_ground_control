# Live Debug Log Summary

- Source: `logs_summary\drone_debug_sequence_after_rtc_fix.jsonl`
- Parsed records: 222
- Approx duration: 67.2s

## Commands
- Sent commands: 5
- ACKs: 5 (0 rejected)
- t+26.127s ACK drone/drone debug_join_control accepted: -
- t+29.160s ACK drone/drone debug_send_join_request accepted: -
- t+30.031s ACK drone/drone debug_restart_join accepted: -
- t+32.062s ACK drone/drone debug_reboot accepted: -
- t+67.022s ACK drone/drone get_status accepted: -

## Bind And Search
- Search events: 0
- Bind progress events: 0
- Assignment events: 0

## Drone Debug
- Drone JOIN events: 7
- JOIN event counts: join_start_shared_channel=3, join_backoff=3, join_request_sent=1
- Drone debug events/status rows: 10
- Drone telemetry rows: 0
- t+58.527s node 7: drone_join_event join_start_shared_channel
- t+58.527s node 7: drone_join_event join_backoff
- t+26.127s node 7: drone_debug_event join_hold_enabled
- t+26.328s node 7: drone_debug_status backoff
- t+29.160s node 7: drone_debug_event forced_join_request_sent
- t+29.160s node 7: drone_debug_status wait_assignment
- t+30.031s node 7: drone_debug_event join_hold_enabled
- t+30.031s node 7: drone_debug_event join_runtime_reset
- t+30.238s node 7: drone_debug_status backoff
- t+32.062s node 7: drone_debug_event reboot_scheduled
- t+32.062s node 7: drone_debug_status backoff
- t+67.237s node 7: drone_debug_status backoff

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_join_event: 7
- command: 5
- drone_debug_event: 5
- command_ack: 5
- drone_debug_status: 5
- drone_live_status: 1
