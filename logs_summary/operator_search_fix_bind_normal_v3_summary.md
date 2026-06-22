# Live Debug Log Summary

- Source: `logs_summary\operator_search_fix_bind_normal_v3.jsonl`
- Parsed records: 1034
- Approx duration: 100.0s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- t+26.278s ACK drone/drone debug_reboot accepted: -
- t+54.020s ACK drone/drone get_status accepted: -
- t+54.252s ACK drone/drone debug_restart_join accepted: -
- t+54.425s ACK telegc/telemetry_ground_control get_status accepted: -
- t+54.867s ACK magc/magic_ground_control get_status accepted: -
- t+55.251s ACK magc/magic_ground_control start_search accepted: -
- t+56.304s ACK drone/drone debug_send_join_request accepted: -

## Bind And Search
- Search events: 17
- Bind progress events: 0
- Assignment events: 0
- Operator shared RX: starts=0, active_ticks=14, completes=1
- Operator shared RX scanner events: 15
- Operator shared RX window observed: t+56.329s to t+70.098s
- Operator shared RX complete reasons: search_timeout

## Drone Debug
- Drone JOIN events: 8
- JOIN event counts: join_backoff=4, join_start_shared_channel=3, join_request_sent=1
- Drone debug events/status rows: 8
- Drone telemetry rows: 0
- t+54.044s node 7: drone_join_event join_start_shared_channel
- t+54.044s node 7: drone_join_event join_backoff
- t+56.304s node 7: drone_join_event join_request_sent
- t+59.769s node 7: drone_join_event join_backoff
- t+26.076s node 7: drone_debug_event reboot_scheduled
- t+26.278s node 7: drone_debug_status backoff
- t+54.044s node 7: drone_debug_status backoff
- t+54.044s node 7: drone_debug_event join_hold_enabled
- t+54.252s node 7: drone_debug_event join_runtime_reset
- t+54.252s node 7: drone_debug_status backoff
- t+56.304s node 7: drone_debug_event forced_join_request_sent
- t+56.304s node 7: drone_debug_status wait_assignment

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 572
- inter_gc_status: 54
- telemetry_rebind_event: 41
- search_event: 17
- drone_join_event: 8
- command: 7
- command_ack: 7
- assignments: 4
- drone_debug_event: 4
- drone_debug_status: 4
- drone_link_status: 1
- drone_live_status: 1
- gc_status: 1
