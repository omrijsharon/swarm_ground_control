# Live Debug Log Summary

- Source: `logs_summary\magc_clear_then_drone_auto_join_final_20260620.jsonl`
- Parsed records: 1183
- Approx duration: 104.8s

## Commands
- Sent commands: 11
- ACKs: 9 (0 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0005, live-dbg-magc-0009
- t+25.491s ACK magc/magic_ground_control get_status accepted: -
- t+27.415s ACK drone/drone debug_reboot accepted: -
- t+57.427s ACK telegc/telemetry_ground_control get_status accepted: -
- t+60.067s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+60.722s ACK drone/drone debug_reboot accepted: -
- t+63.989s ACK magc/magic_ground_control get_status accepted: -
- t+80.660s ACK magc/magic_ground_control get_status accepted: -
- t+94.844s ACK magc/magic_ground_control get_status accepted: -

## Bind And Search
- Search events: 6
- Bind progress events: 15
- Assignment events: 19
- Scenario metrics: t+60.714s reset_origin_observed; t+63.341s reset_to_join_mode_s=2.618; t+64.968s reset_to_join_tx_s=4.254; t+65.021s reset_to_bind0_s=4.307; t+70.121s reset_to_first_telegc_telemetry_s=9.407
- Assignment event counts: telemetry_period_observed=3, post_bind_first_telemetry=3, telemetry_period_locked=3, telemetry_period_rejected=2, join_request_received=2, silence_sent=2, assign_sent=2, join_ack_received=2
- Empty-assignment shared RX: starts=0, active_ticks=0, joins=0, completes=0, oocr_deferred=8
- t+11.285s node 7: complete - telemetry_period_locked
- t+31.665s node 7: quiet - join_request_received
- t+32.588s node 7: assign - silence_sent
- t+36.193s node 7: timing - telemetry_period_observed
- t+36.206s node 7: telemetry_bind - telemetry_live
- t+36.301s node 7: timing - telemetry_period_rejected
- t+36.546s node 7: complete - telemetry_period_locked
- t+65.021s node 7: quiet - join_request_received
- t+66.054s node 7: assign - silence_sent
- t+69.932s node 7: timing - telemetry_period_observed
- t+69.942s node 7: telemetry_bind - telemetry_live
- t+70.146s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 2
- OOCR event counts: candidate_failed=1, background_oocr_complete=1
- Failed candidate confirmations: 1

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=6, timeouts=0
- node 7; ACK->telemetry -23.656s; drone assigned->telemetry 4.266s; drone first TX->telemetry 4.213s

## Drone Debug
- Drone JOIN events: 33
- JOIN event counts: post_assign_burst_tx=6, join_start_shared_channel=3, join_backoff=3, join_request_sent=3, silence_received=3, join_assign_accepted=3, join_ack_sent=3, assigned_telemetry_started=3, first_assigned_telemetry_tx=3, msp_fixed_slot_learned=3
- JOIN backoff kinds: first_fast=3
- Drone debug events/status rows: 4
- Drone telemetry rows: 365
- t+66.001s node 7: drone_join_event silence_received
- t+67.229s node 7: drone_join_event join_assign_accepted
- t+68.053s node 7: drone_join_event join_ack_sent
- t+68.095s node 7: drone_join_event assigned_telemetry_started
- t+68.295s node 7: drone_join_event first_assigned_telemetry_tx
- t+68.495s node 7: drone_join_event post_assign_burst_tx
- t+68.696s node 7: drone_join_event post_assign_burst_tx
- t+68.696s node 7: drone_join_event msp_fixed_slot_learned
- t+27.415s node 7: drone_debug_event reboot_scheduled
- t+27.622s node 7: drone_debug_status assigned_telemetry
- t+60.722s node 7: drone_debug_event reboot_scheduled
- t+60.931s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 8
- Short-loss event counts: short_loss_guard_active=6, short_loss_guard_started=1, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=151.0, max=151
- Recent short-loss events: t+28.296s node 7 short_loss_guard_started miss=1 gap=-; t+29.215s node 7 short_loss_guard_active miss=2 gap=-; t+30.136s node 7 short_loss_guard_active miss=3 gap=-; t+31.056s node 7 short_loss_guard_active miss=4 gap=-; t+31.969s node 7 short_loss_guard_active miss=5 gap=-; t+32.887s node 7 short_loss_guard_active miss=6 gap=-; t+33.812s node 7 short_loss_guard_active miss=7 gap=-; t+34.738s node 7 short_loss_recovered miss=7 gap=151

## Telemetry Coverage
- Latest status at t+57.468s: mode `telemetry_first`
- Assigned packets received: 190
- Assigned RX coverage: 96%
- Sequence gap events: 5
- Missing sequence IDs: 160
- Max sequence gap: 151
- Assigned slot misses: 7
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=2

## Telemetry Sequence Gaps
- Observed sequence gaps: 10
- node 7: t+15.108s seq 40 -> t+15.475s seq 42; missing [41]
- node 7: t+26.614s seq 93 -> t+26.820s seq 99; missing [94, 95, 96, 97, 98]
- node 7: t+27.864s seq 104 -> t+34.841s seq 0; missing [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, +17 more]
- node 7: t+35.665s seq 2 -> t+35.865s seq 5; missing [3, 4]
- node 7: t+42.314s seq 37 -> t+42.695s seq 39; missing [38]
- node 7: t+58.885s seq 118 -> t+59.093s seq 121; missing [119, 120]
- node 7: t+59.865s seq 125 -> t+70.121s seq 9; missing [126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, +17 more]
- node 7: t+70.723s seq 11 -> t+70.933s seq 13; missing [12]
- node 7: t+81.957s seq 63 -> t+81.957s seq 69; missing [64, 65, 66, 67, 68]
- node 7: t+96.033s seq 134 -> t+96.033s seq 139; missing [135, 136, 137, 138]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 365
- drone_live_status: 85
- drone_fc_status: 85
- drone_join_event: 33
- scanner_event: 25
- assignment_event: 19
- inter_gc_status: 19
- bind_progress_event: 15
- assignments: 11
- command: 11
- command_ack: 9
- telemetry_rebind_event: 8
- search_event: 6
- drone_link_status: 3
- assignment_timing_hint: 3
- gc_status: 2
- drone_debug_event: 2
- drone_debug_status: 2
- session_event: 2
- orphan_recovery_event: 2
