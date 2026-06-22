# Live Debug Log Summary

- Source: `logs_summary\magc_clear_then_drone_auto_join_after_fix_20260620.jsonl`
- Parsed records: 995
- Approx duration: 120.1s

## Commands
- Sent commands: 11
- ACKs: 10 (0 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0002
- t+57.420s ACK telegc/telemetry_ground_control get_status accepted: -
- t+57.836s ACK magc/magic_ground_control get_status accepted: -
- t+60.248s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+60.718s ACK drone/drone debug_reboot accepted: -
- t+63.961s ACK magc/magic_ground_control get_status accepted: -
- t+70.347s ACK magc/magic_ground_control get_status accepted: -
- t+80.429s ACK magc/magic_ground_control get_status accepted: -
- t+95.508s ACK magc/magic_ground_control get_status accepted: -

## Bind And Search
- Search events: 59
- Bind progress events: 10
- Assignment events: 11
- Scenario metrics: t+60.715s reset_origin_observed; t+63.385s reset_to_join_mode_s=2.670; t+64.826s reset_to_join_tx_s=4.111
- Scenario failures: t+120.120s reset_to_bind0_missing; t+120.120s reset_to_first_telegc_telemetry_missing
- Assignment event counts: telemetry_period_observed=2, post_bind_first_telemetry=2, telemetry_period_locked=2, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, telemetry_period_rejected=1
- Empty-assignment shared RX: starts=0, active_ticks=68, joins=0, completes=0, oocr_deferred=48
- t+10.594s node 7: timing - telemetry_period_observed
- t+10.624s node 7: telemetry_bind - telemetry_live
- t+10.799s node 7: complete - telemetry_period_locked
- t+31.541s node 7: quiet - join_request_received
- t+32.672s node 7: assign - silence_sent
- t+33.782s node 7: ack - assign_sent
- t+35.818s node 7: timing - telemetry_period_observed
- t+35.828s node 7: telemetry_bind - telemetry_live
- t+36.030s node 7: timing - telemetry_period_rejected
- t+36.259s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=0
- node 7; ACK->telemetry -24.045s; drone assigned->telemetry 3.702s; drone first TX->telemetry 3.640s

## Drone Debug
- Drone JOIN events: 43
- JOIN event counts: join_backoff=12, join_request_sent=9, post_assign_burst_tx=4, join_start_shared_channel=3, join_request_lbt_blocked_or_tx_failed=3, silence_received=2, join_assign_accepted=2, join_ack_sent=2, assigned_telemetry_started=2, first_assigned_telemetry_tx=2, msp_fixed_slot_learned=2
- JOIN backoff kinds: retry_normal=9, first_fast=3
- Drone debug events/status rows: 4
- Drone telemetry rows: 196
- t+100.919s node 7: drone_join_event join_backoff
- t+103.404s node 7: drone_join_event join_request_lbt_blocked_or_tx_failed
- t+103.404s node 7: drone_join_event join_backoff
- t+106.713s node 7: drone_join_event join_request_lbt_blocked_or_tx_failed
- t+106.713s node 7: drone_join_event join_backoff
- t+110.430s node 7: drone_join_event join_request_sent
- t+113.947s node 7: drone_join_event join_backoff
- t+119.511s node 7: drone_join_event join_request_sent
- t+27.419s node 7: drone_debug_event reboot_scheduled
- t+27.629s node 7: drone_debug_status assigned_telemetry
- t+60.718s node 7: drone_debug_event reboot_scheduled
- t+60.920s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 8
- Short-loss event counts: short_loss_guard_active=6, short_loss_guard_started=1, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=152.0, max=152
- Recent short-loss events: t+28.372s node 7 short_loss_guard_started miss=1 gap=-; t+29.289s node 7 short_loss_guard_active miss=2 gap=-; t+30.209s node 7 short_loss_guard_active miss=3 gap=-; t+31.131s node 7 short_loss_guard_active miss=4 gap=-; t+32.049s node 7 short_loss_guard_active miss=5 gap=-; t+32.966s node 7 short_loss_guard_active miss=6 gap=-; t+33.885s node 7 short_loss_guard_active miss=7 gap=-; t+34.669s node 7 short_loss_recovered miss=7 gap=152

## Telemetry Coverage
- Latest status at t+57.475s: mode `telemetry_first`
- Assigned packets received: 188
- Assigned RX coverage: 96%
- Sequence gap events: 7
- Missing sequence IDs: 164
- Max sequence gap: 152
- Assigned slot misses: 7
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=2

## Telemetry Sequence Gaps
- Observed sequence gaps: 9
- node 7: t+21.395s seq 71 -> t+21.600s seq 73; missing [72]
- node 7: t+27.222s seq 93 -> t+27.639s seq 101; missing [94, 95, 96, 97, 98, 99, 100]
- node 7: t+27.639s seq 101 -> t+27.847s seq 103; missing [102]
- node 7: t+27.847s seq 103 -> t+34.884s seq 0; missing [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, +17 more]
- node 7: t+35.262s seq 1 -> t+35.262s seq 3; missing [2]
- node 7: t+36.019s seq 5 -> t+36.228s seq 7; missing [6]
- node 7: t+45.270s seq 51 -> t+45.419s seq 53; missing [52]
- node 7: t+45.628s seq 54 -> t+46.027s seq 56; missing [55]
- node 7: t+59.017s seq 116 -> t+59.220s seq 122; missing [117, 118, 119, 120, 121]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 196
- scanner_event: 77
- search_event: 59
- drone_live_status: 48
- drone_fc_status: 48
- drone_join_event: 43
- inter_gc_status: 15
- assignments: 11
- assignment_event: 11
- command: 11
- bind_progress_event: 10
- command_ack: 10
- telemetry_rebind_event: 8
- gc_status: 4
- drone_link_status: 2
- assignment_timing_hint: 2
- drone_debug_event: 2
- drone_debug_status: 2
- session_event: 2
