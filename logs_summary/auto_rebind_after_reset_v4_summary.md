# Live Debug Log Summary

- Source: `logs_summary\auto_rebind_after_reset_v4.jsonl`
- Parsed records: 705
- Approx duration: 55.0s

## Commands
- Sent commands: 7
- ACKs: 5 (1 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0002, live-dbg-magc-0007
- t+14.021s ACK telegc/telemetry_ground_control get_status accepted: -
- t+17.599s ACK magc/magic_ground_control get_status accepted: -
- t+23.494s ACK magc/magic_ground_control get_status accepted: -
- t+30.399s ACK drone/drone debug_reboot accepted: -
- t+33.507s ACK magc/telemetry_ground_control get_status rejected: inter_gc_forward_failed

## Bind And Search
- Search events: 25
- Bind progress events: 5
- Assignment events: 10
- Assignment event counts: silence_sent=2, assign_sent=2, join_ack_received=2, telemetry_period_observed=1, telemetry_period_rejected=1, telemetry_period_locked=1, join_request_received=1
- Auto shared RX: starts=0, active_ticks=19, joins=0, completes=3
- Auto shared RX scanner events: 18
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout, auto_shared_rx_timeout
- t+13.130s node 7: assign - silence_sent
- t+30.478s node 7: timing - telemetry_period_observed
- t+30.563s node 7: timing - telemetry_period_rejected
- t+30.859s node 7: complete - telemetry_period_locked
- t+34.856s node 7: quiet - join_request_received

## Drone Debug
- Drone JOIN events: 19
- JOIN event counts: join_backoff=4, join_request_sent=3, join_start_shared_channel=2, silence_received=2, join_assign_accepted=2, join_ack_sent=2, assigned_telemetry_started=2, msp_fixed_slot_learned=1, join_request_lbt_blocked_or_tx_failed=1
- JOIN backoff kinds: first_fast=3, retry_normal=1
- Drone debug events/status rows: 2
- Drone telemetry rows: 3
- t+30.473s node 7: drone_join_event msp_fixed_slot_learned
- t+33.044s node 7: drone_join_event join_start_shared_channel
- t+33.044s node 7: drone_join_event join_backoff
- t+33.452s node 7: drone_join_event join_request_lbt_blocked_or_tx_failed
- t+33.452s node 7: drone_join_event join_backoff
- t+34.670s node 7: drone_join_event join_request_sent
- t+35.687s node 7: drone_join_event silence_received
- t+36.918s node 7: drone_join_event join_assign_accepted
- t+37.802s node 7: drone_join_event join_ack_sent
- t+37.802s node 7: drone_join_event assigned_telemetry_started
- t+30.399s node 7: drone_debug_event reboot_scheduled
- t+30.473s node 7: drone_debug_status assigned_telemetry

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 253
- search_event: 25
- telemetry_rebind_event: 23
- drone_join_event: 19
- inter_gc_status: 11
- assignment_event: 10
- command: 7
- assignments: 5
- drone_link_status: 5
- bind_progress_event: 5
- command_ack: 5
- channel_scan_event: 4
- drone_live_status: 3
- drone_telemetry: 3
- orphan_recovery_event: 3
- gc_status: 2
- drone_debug_event: 1
- drone_debug_status: 1
- drone_fc_status: 1
