# Live Debug Log Summary

- Source: `logs_summary\zero_gap_auto_rebind_no_flicker_20260620.jsonl`
- Parsed records: 816
- Approx duration: 55.0s

## Commands
- Sent commands: 7
- ACKs: 5 (2 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0004, live-dbg-magc-0005, live-dbg-magc-0006
- t+2.560s ACK drone/drone debug_reboot accepted: -
- t+10.215s ACK telegc/telemetry_ground_control get_status accepted: -
- t+10.255s ACK magc/telemetry_ground_control get_status rejected: magc_link_unavailable
- t+19.779s ACK -/-  rejected: parse_error
- t+34.833s ACK magc/magic_ground_control get_status accepted: -

## Bind And Search
- Search events: 15
- Bind progress events: 7
- Assignment events: 10
- Assignment event counts: telemetry_period_observed=2, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, telemetry_period_rejected=1, post_bind_first_telemetry=1, telemetry_period_locked=1
- Auto shared RX: starts=0, active_ticks=12, joins=0, completes=2
- Auto shared RX scanner events: 3
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout
- t+26.428s node 7: quiet - join_request_received
- t+27.447s node 7: assign - silence_sent
- t+29.641s node 7: timing - telemetry_period_observed
- t+29.922s node 7: timing - telemetry_period_rejected
- t+31.238s node 7: timing - telemetry_period_observed
- t+31.251s node 7: telemetry_bind - telemetry_live
- t+31.337s node 7: complete - telemetry_period_locked

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=2, timeouts=0
- node 7; ACK->telemetry 0.014s; drone assigned->telemetry 0.174s; acquire->telemetry 0.014s; drone first TX->telemetry 0.122s

## Drone Debug
- Drone JOIN events: 21
- JOIN event counts: join_backoff=6, join_request_sent=3, join_start_shared_channel=2, join_request_lbt_blocked_or_tx_failed=2, post_assign_burst_tx=2, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, first_assigned_telemetry_tx=1, msp_fixed_slot_learned=1
- JOIN backoff kinds: retry_normal=4, first_fast=2
- Drone debug events/status rows: 2
- Drone telemetry rows: 225
- t+20.633s node 7: drone_join_event join_backoff
- t+26.326s node 7: drone_join_event join_request_sent
- t+27.337s node 7: drone_join_event silence_received
- t+28.553s node 7: drone_join_event join_assign_accepted
- t+29.467s node 7: drone_join_event join_ack_sent
- t+29.467s node 7: drone_join_event assigned_telemetry_started
- t+29.519s node 7: drone_join_event first_assigned_telemetry_tx
- t+29.709s node 7: drone_join_event post_assign_burst_tx
- t+29.922s node 7: drone_join_event post_assign_burst_tx
- t+29.922s node 7: drone_join_event msp_fixed_slot_learned
- t+2.560s node 7: drone_debug_event reboot_scheduled
- t+2.560s node 7: drone_debug_status backoff

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 225
- scanner_event: 122
- drone_live_status: 26
- drone_fc_status: 26
- drone_join_event: 21
- search_event: 15
- telemetry_rebind_event: 13
- assignment_event: 10
- command: 7
- bind_progress_event: 7
- command_ack: 5
- inter_gc_status: 5
- assignments: 3
- drone_link_status: 3
- drone_debug_event: 1
- drone_debug_status: 1
- gc_status: 1
- orphan_recovery_event: 1
- assignment_timing_hint: 1
