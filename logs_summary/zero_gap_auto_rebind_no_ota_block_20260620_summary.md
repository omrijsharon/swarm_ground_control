# Live Debug Log Summary

- Source: `logs_summary\zero_gap_auto_rebind_no_ota_block_20260620.jsonl`
- Parsed records: 836
- Approx duration: 55.1s

## Commands
- Sent commands: 7
- ACKs: 5 (2 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0004, live-dbg-magc-0005, live-dbg-magc-0006
- t+2.564s ACK drone/drone debug_reboot accepted: -
- t+10.503s ACK telegc/telemetry_ground_control get_status accepted: -
- t+10.673s ACK magc/telemetry_ground_control get_status rejected: magc_link_unavailable
- t+19.861s ACK -/-  rejected: parse_error
- t+34.796s ACK magc/magic_ground_control get_status accepted: -

## Bind And Search
- Search events: 3
- Bind progress events: 6
- Assignment events: 11
- Assignment event counts: telemetry_period_rejected=2, post_bind_acquire_timeout=1, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, telemetry_period_observed=1, post_bind_first_telemetry=1, telemetry_period_locked=1
- Auto shared RX: starts=0, active_ticks=2, joins=0, completes=0
- t+23.565s node 7: quiet - join_request_received
- t+27.258s node 7: timing - telemetry_period_observed
- t+27.271s node 7: telemetry_bind - telemetry_live
- t+27.475s node 7: timing - telemetry_period_rejected
- t+29.004s node 7: timing - telemetry_period_rejected
- t+29.111s node 7: complete - telemetry_period_locked

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=2, timeouts=2
- node 7; ACK->telemetry 0.681s; drone assigned->telemetry 0.840s; acquire->telemetry 0.273s; drone first TX->telemetry 0.788s; timeouts=2

## Drone Debug
- Drone JOIN events: 17
- JOIN event counts: join_backoff=4, join_request_sent=3, join_start_shared_channel=2, post_assign_burst_tx=2, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, first_assigned_telemetry_tx=1, msp_fixed_slot_learned=1
- JOIN backoff kinds: first_fast=2, retry_normal=2
- Drone debug events/status rows: 2
- Drone telemetry rows: 242
- t+18.191s node 7: drone_join_event join_backoff
- t+23.287s node 7: drone_join_event join_request_sent
- t+24.293s node 7: drone_join_event silence_received
- t+25.515s node 7: drone_join_event join_assign_accepted
- t+26.431s node 7: drone_join_event join_ack_sent
- t+26.431s node 7: drone_join_event assigned_telemetry_started
- t+26.483s node 7: drone_join_event first_assigned_telemetry_tx
- t+26.674s node 7: drone_join_event post_assign_burst_tx
- t+26.888s node 7: drone_join_event post_assign_burst_tx
- t+26.888s node 7: drone_join_event msp_fixed_slot_learned
- t+2.564s node 7: drone_debug_event reboot_scheduled
- t+2.564s node 7: drone_debug_status backoff

## State Flicker
- Node 7: 2 rapid state transitions: t+28.992s online->offline, t+29.097s offline->online

## Event Counts
- drone_telemetry: 242
- scanner_event: 92
- channel_scan_event: 31
- drone_live_status: 29
- drone_fc_status: 29
- drone_join_event: 17
- inter_gc_status: 17
- assignment_event: 11
- telemetry_rebind_event: 9
- command: 7
- bind_progress_event: 6
- command_ack: 5
- orphan_recovery_event: 5
- drone_link_status: 4
- search_event: 3
- drone_debug_event: 1
- drone_debug_status: 1
- gc_status: 1
- assignments: 1
- assignment_timing_hint: 1
