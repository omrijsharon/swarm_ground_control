# Live Debug Log Summary

- Source: `logs_summary\operator_search_fix_bind_normal.jsonl`
- Parsed records: 1980
- Approx duration: 95.0s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- t+26.076s ACK drone/drone debug_reboot accepted: -
- t+54.022s ACK drone/drone get_status accepted: -
- t+54.251s ACK drone/drone debug_restart_join accepted: -
- t+54.443s ACK telegc/telemetry_ground_control get_status accepted: -
- t+54.727s ACK magc/magic_ground_control get_status accepted: -
- t+55.045s ACK magc/magic_ground_control start_search accepted: -
- t+56.484s ACK drone/drone debug_send_join_request accepted: -

## Bind And Search
- Search events: 16
- Bind progress events: 0
- Assignment events: 0
- Operator shared RX: starts=0, active_ticks=14, completes=1
- Operator shared RX scanner events: 15
- Operator shared RX window observed: t+56.037s to t+70.026s
- Operator shared RX complete reasons: search_timeout

## Drone Debug
- Drone JOIN events: 8
- JOIN event counts: join_backoff=4, join_start_shared_channel=3, join_request_sent=1
- Drone debug events/status rows: 8
- Drone telemetry rows: 0
- t+54.046s node 7: drone_join_event join_start_shared_channel
- t+54.046s node 7: drone_join_event join_backoff
- t+56.484s node 7: drone_join_event join_request_sent
- t+59.932s node 7: drone_join_event join_backoff
- t+26.076s node 7: drone_debug_event reboot_scheduled
- t+26.282s node 7: drone_debug_status backoff
- t+54.045s node 7: drone_debug_status backoff
- t+54.046s node 7: drone_debug_event join_hold_enabled
- t+54.251s node 7: drone_debug_event join_runtime_reset
- t+54.251s node 7: drone_debug_status backoff
- t+56.484s node 7: drone_debug_event forced_join_request_sent
- t+56.484s node 7: drone_debug_status wait_assignment

## State Flicker
- Node 7: 1017 rapid state transitions: t+11.192s locking->offline, t+11.341s offline->locking, t+11.341s locking->offline, t+11.503s offline->locking, t+11.503s locking->offline, t+11.666s offline->locking, +1011 more

## Event Counts
- drone_link_status: 1018
- scanner_event: 525
- telemetry_rebind_event: 41
- inter_gc_status: 36
- search_event: 16
- drone_join_event: 8
- command: 7
- command_ack: 7
- drone_debug_event: 4
- drone_debug_status: 4
- assignments: 3
- drone_live_status: 1
- gc_status: 1
