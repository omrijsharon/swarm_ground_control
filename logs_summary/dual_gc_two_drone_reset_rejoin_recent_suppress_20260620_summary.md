# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_reset_rejoin_recent_suppress_20260620.jsonl`
- Parsed records: 828
- Approx duration: 150.1s

## Commands
- Sent commands: 1
- ACKs: 1 (0 rejected)
- t+10.771s ACK magc/magic_ground_control clear_all_assignments accepted: -

## Bind And Search
- Search events: 62
- Bind progress events: 10
- Assignment events: 12
- Assignment event counts: telemetry_period_observed=3, telemetry_period_locked=3, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, post_bind_first_telemetry=1
- Empty-assignment shared RX: starts=0, active_ticks=42, joins=0, completes=0, oocr_deferred=81
- t+3.928s node 6: timing - telemetry_period_observed
- t+4.325s node 6: complete - telemetry_period_locked
- t+4.546s node 3: timing - telemetry_period_observed
- t+4.965s node 3: complete - telemetry_period_locked
- t+60.992s node 3: quiet - join_request_received
- t+61.818s node 3: assign - silence_sent
- t+63.070s node 3: ack - assign_sent
- t+64.809s node 3: timing - telemetry_period_observed
- t+64.819s node 3: telemetry_bind - telemetry_live
- t+65.012s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=2, timeouts=0
- node 3; ACK->telemetry -59.573s; acquire->telemetry -59.573s
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 451

## Short-Loss Guard
- Telemetry rebind events: 15
- Short-loss event counts: short_loss_guard_started=5, short_loss_guard_active=5, short_loss_recovered=5
- Short-loss recovered observed gaps: count=5, avg=2.0, max=2
- Recent short-loss events: t+7.876s node 3 short_loss_guard_active miss=2 gap=-; t+7.949s node 3 short_loss_recovered miss=2 gap=2; t+8.362s node 3 short_loss_guard_started miss=1 gap=-; t+8.476s node 3 short_loss_guard_active miss=2 gap=-; t+8.537s node 3 short_loss_recovered miss=2 gap=2; t+9.361s node 3 short_loss_guard_started miss=1 gap=-; t+9.476s node 3 short_loss_guard_active miss=2 gap=-; t+9.532s node 3 short_loss_recovered miss=2 gap=2

## Telemetry Sequence Gaps
- Observed sequence gaps: 29
- node 6: t+4.102s seq 136 -> t+4.353s seq 138; missing [137]
- node 6: t+4.353s seq 138 -> t+4.724s seq 140; missing [139]
- node 6: t+4.724s seq 140 -> t+5.171s seq 142; missing [141]
- node 6: t+5.171s seq 142 -> t+5.588s seq 144; missing [143]
- node 6: t+5.588s seq 144 -> t+5.991s seq 146; missing [145]
- node 6: t+5.991s seq 146 -> t+6.406s seq 148; missing [147]
- node 6: t+6.406s seq 148 -> t+6.936s seq 151; missing [149, 150]
- node 6: t+6.936s seq 151 -> t+7.544s seq 154; missing [152, 153]
- node 6: t+7.544s seq 154 -> t+8.161s seq 157; missing [155, 156]
- node 6: t+8.161s seq 157 -> t+8.745s seq 160; missing [158, 159]
- node 6: t+8.745s seq 160 -> t+9.153s seq 162; missing [161]
- node 6: t+9.153s seq 162 -> t+9.739s seq 165; missing [163, 164]

## State Flicker
- Node 3: 1 rapid state transitions: t+4.724s offline->online

## Event Counts
- drone_telemetry: 451
- scanner_event: 103
- search_event: 62
- telemetry_rebind_event: 15
- assignment_event: 12
- bind_progress_event: 10
- inter_gc_status: 10
- assignments: 6
- drone_link_status: 4
- assignment_timing_hint: 3
- session_event: 2
- command: 1
- command_ack: 1
