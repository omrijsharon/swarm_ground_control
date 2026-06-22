# Live Debug Log Summary

- Source: `logs_summary\auto_rebind_after_reset_v3.jsonl`
- Parsed records: 838
- Approx duration: 70.2s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- t+14.024s ACK telegc/telemetry_ground_control get_status accepted: -
- t+14.402s ACK magc/magic_ground_control get_status accepted: -
- t+14.556s ACK drone/drone debug_reboot accepted: -
- t+17.521s ACK magc/magic_ground_control get_status accepted: -
- t+23.599s ACK magc/magic_ground_control get_status accepted: -
- t+33.538s ACK magc/magic_ground_control get_status accepted: -
- t+48.718s ACK magc/magic_ground_control get_status accepted: -

## Bind And Search
- Search events: 45
- Bind progress events: 0
- Assignment events: 0
- Auto shared RX: starts=3, active_ticks=36, joins=0, completes=6
- Auto shared RX scanner events: 34
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout, auto_shared_rx_timeout, auto_shared_rx_timeout

## Drone Debug
- Drone JOIN events: 19
- JOIN event counts: join_backoff=9, join_request_sent=8, join_start_shared_channel=2
- JOIN backoff kinds: retry_normal=7, first_fast=2
- Drone debug events/status rows: 2
- Drone telemetry rows: 0
- t+21.908s node 7: drone_join_event join_backoff
- t+26.788s node 7: drone_join_event join_request_sent
- t+30.261s node 7: drone_join_event join_backoff
- t+34.316s node 7: drone_join_event join_request_sent
- t+54.433s node 7: drone_join_event join_backoff
- t+56.873s node 7: drone_join_event join_request_sent
- t+60.327s node 7: drone_join_event join_backoff
- t+62.603s node 7: drone_join_event join_request_sent
- t+66.064s node 7: drone_join_event join_backoff
- t+69.128s node 7: drone_join_event join_request_sent
- t+14.556s node 7: drone_debug_event reboot_scheduled
- t+14.556s node 7: drone_debug_status backoff

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 387
- search_event: 45
- inter_gc_status: 31
- telemetry_rebind_event: 24
- drone_join_event: 19
- command: 7
- command_ack: 7
- assignments: 6
- drone_link_status: 1
- gc_status: 1
- drone_debug_event: 1
- drone_debug_status: 1
