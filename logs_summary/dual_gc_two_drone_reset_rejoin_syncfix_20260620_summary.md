# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_reset_rejoin_syncfix_20260620.jsonl`
- Parsed records: 1258
- Approx duration: 130.1s

## Commands
- Sent commands: 1
- ACKs: 1 (0 rejected)
- t+21.299s ACK magc/magic_ground_control clear_all_assignments accepted: duplicate_command

## Bind And Search
- Search events: 10
- Bind progress events: 13
- Assignment events: 18
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, join_request_received=2, silence_sent=2, assign_sent=2, join_ack_received=2, post_bind_first_telemetry=2
- Empty-assignment shared RX: starts=0, active_ticks=6, joins=0, completes=0, oocr_deferred=14
- t+8.578s node 6: timing - telemetry_period_observed
- t+8.883s node 3: complete - telemetry_period_locked
- t+8.976s node 6: complete - telemetry_period_locked
- t+31.636s node 3: quiet - join_request_received
- t+32.666s node 3: assign - silence_sent
- t+36.065s node 3: timing - telemetry_period_observed
- t+36.078s node 3: telemetry_bind - telemetry_live
- t+36.283s node 3: complete - telemetry_period_locked
- t+94.558s node 6: assign - silence_sent
- t+118.895s node 6: timing - telemetry_period_observed
- t+118.908s node 6: telemetry_bind - telemetry_live
- t+119.115s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 3
- Channel scan event counts: background_oocr_slice=3
- CAD samples: rows=1, validated=0, rejected=1, one_hit_rejected=1
- OOCR events: 8
- OOCR event counts: candidate_failed=5, background_oocr_complete=2, background_oocr_started=1
- Failed candidate confirmations: 5

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=0
- node 3; ACK->telemetry -26.363s
- node 6; ACK->telemetry -88.035s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 430

## Short-Loss Guard
- Telemetry rebind events: 6
- Short-loss event counts: short_loss_guard_active=3, short_loss_guard_started=2, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=5.0, max=5
- Recent short-loss events: t+18.450s node 6 short_loss_guard_started miss=1 gap=-; t+18.727s node 6 short_loss_guard_active miss=2 gap=-; t+18.927s node 6 short_loss_guard_active miss=3 gap=-; t+19.126s node 6 short_loss_guard_active miss=4 gap=-; t+19.469s node 6 short_loss_recovered miss=4 gap=5; t+20.874s node 6 short_loss_guard_started miss=1 gap=-

## Telemetry Sequence Gaps
- Observed sequence gaps: 57
- node 3: t+8.552s seq 138 -> t+8.891s seq 140; missing [139]
- node 3: t+8.891s seq 140 -> t+9.205s seq 142; missing [141]
- node 3: t+9.205s seq 142 -> t+9.617s seq 144; missing [143]
- node 3: t+9.617s seq 144 -> t+10.033s seq 146; missing [145]
- node 3: t+10.033s seq 146 -> t+10.455s seq 148; missing [147]
- node 3: t+10.455s seq 148 -> t+10.865s seq 150; missing [149]
- node 3: t+10.865s seq 150 -> t+11.282s seq 152; missing [151]
- node 3: t+11.282s seq 152 -> t+11.710s seq 154; missing [153]
- node 3: t+11.710s seq 154 -> t+12.136s seq 156; missing [155]
- node 3: t+12.136s seq 156 -> t+12.540s seq 158; missing [157]
- node 3: t+12.540s seq 158 -> t+12.933s seq 160; missing [159]
- node 3: t+12.933s seq 160 -> t+13.332s seq 162; missing [161]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 430
- scanner_event: 38
- assignment_event: 18
- bind_progress_event: 13
- inter_gc_status: 10
- search_event: 10
- assignments: 8
- orphan_recovery_event: 8
- telemetry_rebind_event: 6
- drone_link_status: 4
- assignment_timing_hint: 4
- channel_scan_event: 3
- command: 1
- command_ack: 1
