# Live Debug Log Summary

- Source: `logs_summary\operator_search_fix_bind_normal_middle_v1.jsonl`
- Parsed records: 956
- Approx duration: 95.0s

## Commands
- Sent commands: 7
- ACKs: 6 (0 rejected)
- Pending/no ACK command IDs: live-dbg-drone-0007
- t+26.075s ACK drone/drone debug_reboot accepted: -
- t+30.677s ACK telegc/telemetry_ground_control get_status accepted: -
- t+30.917s ACK magc/magic_ground_control get_status accepted: -
- t+31.511s ACK magc/magic_ground_control start_search accepted: -
- t+52.295s ACK drone/drone get_status accepted: -
- t+52.330s ACK drone/drone debug_restart_join accepted: -

## Bind And Search
- Search events: 17
- Bind progress events: 0
- Assignment events: 0
- Operator shared RX: starts=0, active_ticks=14, completes=1
- Operator shared RX scanner events: 15
- Operator shared RX GC window: 292561 to 307508 ms (14.9s)
- Operator shared RX window observed: t+32.312s to t+46.304s
- Operator shared RX complete reasons: search_timeout

## Drone Debug
- Drone JOIN events: 6
- JOIN event counts: join_start_shared_channel=3, join_backoff=3
- Drone debug events/status rows: 6
- Drone telemetry rows: 0
- t+25.874s node 7: drone_join_event join_start_shared_channel
- t+25.874s node 7: drone_join_event join_backoff
- t+52.295s node 7: drone_join_event join_start_shared_channel
- t+52.295s node 7: drone_join_event join_backoff
- t+52.330s node 7: drone_join_event join_start_shared_channel
- t+52.330s node 7: drone_join_event join_backoff
- t+25.874s node 7: drone_debug_event reboot_scheduled
- t+26.075s node 7: drone_debug_status backoff
- t+52.317s node 7: drone_debug_status backoff
- t+52.330s node 7: drone_debug_event join_hold_enabled
- t+52.330s node 7: drone_debug_event join_runtime_reset
- t+52.534s node 7: drone_debug_status backoff

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 536
- inter_gc_status: 31
- telemetry_rebind_event: 31
- search_event: 17
- command: 7
- drone_join_event: 6
- command_ack: 6
- assignments: 3
- drone_debug_event: 3
- drone_debug_status: 3
- drone_link_status: 1
- gc_status: 1
- drone_live_status: 1
