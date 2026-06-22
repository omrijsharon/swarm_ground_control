# Live Debug Log Summary

- Source: `logs_summary\zero_gap_auto_rebind_20260620.jsonl`
- Parsed records: 968
- Approx duration: 70.0s

## Commands
- Sent commands: 7
- ACKs: 5 (3 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0004, live-dbg-magc-0005, live-dbg-magc-0006
- t+2.566s ACK drone/drone debug_reboot accepted: -
- t+11.171s ACK telegc/telemetry_ground_control get_status accepted: -
- t+11.211s ACK magc/telemetry_ground_control get_status rejected: magc_link_unavailable
- t+19.770s ACK -/-  rejected: parse_error
- t+34.845s ACK magc/telemetry_ground_control get_status rejected: inter_gc_forward_failed

## Bind And Search
- Search events: 29
- Bind progress events: 5
- Assignment events: 9
- Assignment event counts: join_ack_timeout=1, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_timeout=1, telemetry_period_observed=1, post_bind_first_telemetry=1, telemetry_period_locked=1
- Auto shared RX: starts=0, active_ticks=24, joins=0, completes=4
- Auto shared RX scanner events: 20
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout, auto_shared_rx_timeout, auto_shared_rx_timeout
- t+16.444s node 7: quiet - join_request_received
- t+17.459s node 7: assign - silence_sent
- t+41.236s node 7: timing - telemetry_period_observed
- t+41.250s node 7: telemetry_bind - telemetry_live
- t+41.410s node 7: complete - telemetry_period_locked

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=2, timeouts=2
- node 7; ACK->telemetry 21.827s; drone assigned->telemetry 21.936s; drone first TX->telemetry 0.153s; timeouts=2

## Drone Debug
- Drone JOIN events: 19
- JOIN event counts: join_backoff=4, join_start_shared_channel=2, join_request_sent=2, silence_received=2, post_assign_burst_tx=2, join_request_lbt_blocked_or_tx_failed=1, join_assign_ignored=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, first_assigned_telemetry_tx=1, msp_fixed_slot_learned=1
- JOIN backoff kinds: first_fast=3, retry_normal=1
- Drone debug events/status rows: 2
- Drone telemetry rows: 280
- t+10.055s node 7: drone_join_event join_backoff
- t+16.350s node 7: drone_join_event join_request_sent
- t+17.365s node 7: drone_join_event silence_received
- t+18.584s node 7: drone_join_event join_assign_accepted
- t+19.459s node 7: drone_join_event join_ack_sent
- t+19.459s node 7: drone_join_event assigned_telemetry_started
- t+41.242s node 7: drone_join_event first_assigned_telemetry_tx
- t+41.403s node 7: drone_join_event post_assign_burst_tx
- t+41.616s node 7: drone_join_event post_assign_burst_tx
- t+41.616s node 7: drone_join_event msp_fixed_slot_learned
- t+2.566s node 7: drone_debug_event reboot_scheduled
- t+2.566s node 7: drone_debug_status backoff

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 280
- scanner_event: 188
- drone_live_status: 30
- search_event: 29
- drone_fc_status: 29
- drone_join_event: 19
- telemetry_rebind_event: 16
- assignment_event: 9
- command: 7
- command_ack: 5
- inter_gc_status: 5
- orphan_recovery_event: 5
- bind_progress_event: 5
- assignments: 3
- channel_scan_event: 3
- drone_link_status: 3
- drone_debug_event: 1
- drone_debug_status: 1
- gc_status: 1
- assignment_timing_hint: 1
