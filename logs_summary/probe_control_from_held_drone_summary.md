# Live Debug Log Summary

- Source: `logs_summary\probe_control_from_held_drone.jsonl`
- Parsed records: 873
- Approx duration: 89.1s

## Commands
- Sent commands: 5
- ACKs: 5 (1 rejected)
- t+26.953s ACK drone/drone debug_reboot accepted: -
- t+56.923s ACK drone/drone get_status accepted: -
- t+57.152s ACK drone/drone debug_restart_join accepted: -
- t+57.782s ACK magc/magic_ground_control debug_shared_rx_probe accepted: -
- t+59.106s ACK drone/drone debug_send_join_request rejected: join_request_failed

## Bind And Search
- Search events: 0
- Bind progress events: 0
- Assignment events: 0

## Drone Debug
- Drone JOIN events: 8
- JOIN event counts: join_backoff=4, join_start_shared_channel=3, join_request_lbt_blocked_or_tx_failed=1
- Drone debug events/status rows: 7
- Drone telemetry rows: 0
- t+53.449s node 7: drone_join_event join_backoff
- t+56.947s node 7: drone_join_event join_start_shared_channel
- t+56.947s node 7: drone_join_event join_backoff
- t+59.106s node 7: drone_join_event join_request_lbt_blocked_or_tx_failed
- t+59.106s node 7: drone_join_event join_backoff
- t+26.953s node 7: drone_debug_event reboot_scheduled
- t+26.953s node 7: drone_debug_status backoff
- t+56.947s node 7: drone_debug_status backoff
- t+56.947s node 7: drone_debug_event join_hold_enabled
- t+57.152s node 7: drone_debug_event join_runtime_reset
- t+57.152s node 7: drone_debug_status backoff
- t+59.106s node 7: drone_debug_status backoff

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 483
- inter_gc_status: 29
- telemetry_rebind_event: 25
- drone_join_event: 8
- command: 5
- command_ack: 5
- drone_debug_status: 4
- drone_debug_event: 3
- assignments: 2
- debug_shared_rx_probe: 2
- drone_link_status: 1
- drone_live_status: 1
