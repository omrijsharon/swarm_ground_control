# Live Debug Log Summary

- Source: `logs_summary\magc_clear_then_drone_auto_join_rxfix_20260620.jsonl`
- Parsed records: 1232
- Approx duration: 120.1s

## Commands
- Sent commands: 11
- ACKs: 10 (0 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0010
- t+27.530s ACK magc/magic_ground_control get_status accepted: duplicate_command
- t+57.434s ACK telegc/telemetry_ground_control get_status accepted: -
- t+58.496s ACK magc/magic_ground_control get_status accepted: -
- t+60.076s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+60.739s ACK drone/drone debug_reboot accepted: -
- t+64.185s ACK magc/magic_ground_control get_status accepted: -
- t+72.080s ACK magc/magic_ground_control get_status accepted: duplicate_command
- t+95.011s ACK magc/magic_ground_control get_status accepted: -

## Bind And Search
- Search events: 23
- Bind progress events: 16
- Assignment events: 25
- Scenario metrics: t+60.726s reset_origin_observed; t+63.347s reset_to_join_mode_s=2.621; t+65.207s reset_to_join_tx_s=4.481; t+65.418s reset_to_bind0_s=4.692
- Scenario failures: t+71.075s reset_to_first_telegc_telemetry_s=10.349
- Assignment event counts: silence_sent=3, assign_sent=3, join_ack_received=3, telemetry_period_observed=3, post_bind_first_telemetry=3, telemetry_period_locked=3, join_request_received=2, post_bind_acquire_started=2, telemetry_period_rejected=2, join_ack_timeout=1
- Auto shared RX: starts=0, active_ticks=8, joins=0, completes=1
- Auto shared RX scanner events: 7
- Auto shared RX complete reasons: auto_shared_rx_timeout
- Empty-assignment shared RX: starts=0, active_ticks=20, joins=0, completes=0, oocr_deferred=6
- t+24.948s node 7: complete - telemetry_period_locked
- t+40.382s node 7: assign - silence_sent
- t+43.025s node 7: timing - telemetry_period_observed
- t+43.046s node 7: telemetry_bind - telemetry_live
- t+43.285s node 7: timing - telemetry_period_rejected
- t+43.514s node 7: complete - telemetry_period_locked
- t+65.418s node 7: quiet - join_request_received
- t+66.249s node 7: assign - silence_sent
- t+71.065s node 7: timing - telemetry_period_observed
- t+71.075s node 7: telemetry_bind - telemetry_live
- t+71.455s node 7: timing - telemetry_period_rejected
- t+71.465s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 4
- OOCR event counts: background_oocr_started=1, orphan_recovery_event=1, candidate_failed=1, background_oocr_complete=1
- Failed candidate confirmations: 1

## Post-Bind Telemetry
- Post-bind acquire events: starts=2, first_telemetry=6, timeouts=0
- node 7; ACK->telemetry 0.520s; drone assigned->telemetry 0.686s; acquire->telemetry 0.312s; drone first TX->telemetry 0.633s

## Drone Debug
- Drone JOIN events: 45
- JOIN event counts: join_backoff=7, join_request_sent=6, post_assign_burst_tx=6, silence_received=5, join_start_shared_channel=3, join_assign_accepted=3, join_ack_sent=3, assigned_telemetry_started=3, first_assigned_telemetry_tx=3, msp_fixed_slot_learned=3, join_assign_ignored=2, join_request_lbt_blocked_or_tx_failed=1
- JOIN backoff kinds: first_fast=4, retry_normal=3
- Drone debug events/status rows: 4
- Drone telemetry rows: 337
- t+66.239s node 7: drone_join_event silence_received
- t+67.472s node 7: drone_join_event join_assign_accepted
- t+68.385s node 7: drone_join_event join_ack_sent
- t+68.385s node 7: drone_join_event assigned_telemetry_started
- t+68.438s node 7: drone_join_event first_assigned_telemetry_tx
- t+68.644s node 7: drone_join_event post_assign_burst_tx
- t+68.853s node 7: drone_join_event post_assign_burst_tx
- t+69.058s node 7: drone_join_event msp_fixed_slot_learned
- t+27.435s node 7: drone_debug_event reboot_scheduled
- t+27.644s node 7: drone_debug_status assigned_telemetry
- t+60.739s node 7: drone_debug_event reboot_scheduled
- t+60.945s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 20
- Short-loss event counts: short_loss_guard_active=7, short_loss_guard_started=1, short_loss_guard_expired=1
- Recent short-loss events: t+29.243s node 7 short_loss_guard_active miss=2 gap=-; t+30.163s node 7 short_loss_guard_active miss=3 gap=-; t+31.077s node 7 short_loss_guard_active miss=4 gap=-; t+31.999s node 7 short_loss_guard_active miss=5 gap=-; t+32.915s node 7 short_loss_guard_active miss=6 gap=-; t+33.833s node 7 short_loss_guard_active miss=7 gap=-; t+34.751s node 7 short_loss_guard_active miss=8 gap=-; t+35.675s node 7 short_loss_guard_expired miss=9 gap=-

## Telemetry Coverage
- Latest status at t+57.474s: mode `telemetry_first`
- Assigned packets received: 83
- Assigned RX coverage: 86%
- Sequence gap events: 4
- Missing sequence IDs: 244
- Max sequence gap: 237
- Assigned slot misses: 13
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=2

## Telemetry Sequence Gaps
- Observed sequence gaps: 10
- node 7: t+25.715s seq 5 -> t+25.901s seq 8; missing [6, 7]
- node 7: t+27.321s seq 11 -> t+27.321s seq 16; missing [12, 13, 14, 15]
- node 7: t+27.736s seq 18 -> t+42.813s seq 0; missing [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, +17 more]
- node 7: t+42.813s seq 0 -> t+43.255s seq 2; missing [1]
- node 7: t+43.255s seq 2 -> t+43.475s seq 4; missing [3]
- node 7: t+60.076s seq 87 -> t+71.075s seq 7; missing [88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, +17 more]
- node 7: t+71.075s seq 7 -> t+71.455s seq 14; missing [8, 9, 10, 11, 12, 13]
- node 7: t+71.666s seq 15 -> t+72.480s seq 17; missing [16]
- node 7: t+72.480s seq 17 -> t+72.480s seq 20; missing [18, 19]
- node 7: t+96.170s seq 135 -> t+96.170s seq 138; missing [136, 137]

## State Flicker
- Node 7: 2 rapid state transitions: t+42.215s locking->weak, t+42.813s weak->online

## Event Counts
- drone_telemetry: 337
- drone_live_status: 75
- drone_fc_status: 75
- scanner_event: 62
- drone_join_event: 45
- assignment_event: 25
- search_event: 23
- telemetry_rebind_event: 20
- inter_gc_status: 19
- bind_progress_event: 16
- assignments: 13
- command: 11
- command_ack: 10
- drone_link_status: 7
- orphan_recovery_event: 4
- assignment_timing_hint: 3
- gc_status: 3
- drone_debug_event: 2
- drone_debug_status: 2
- session_event: 2
