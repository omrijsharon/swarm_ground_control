# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_reset_rejoin_retryfix_20260620.jsonl`
- Parsed records: 1291
- Approx duration: 140.0s

## Commands
- Sent commands: 1
- ACKs: 1 (0 rejected)
- t+25.360s ACK magc/magic_ground_control clear_all_assignments accepted: -

## Bind And Search
- Search events: 28
- Bind progress events: 26
- Assignment events: 30
- Assignment event counts: telemetry_period_observed=6, telemetry_period_locked=6, post_bind_first_telemetry=4, telemetry_period_rejected=4, join_request_received=2, silence_sent=2, assign_sent=2, join_ack_received=2, post_bind_acquire_started=2
- Auto shared RX: starts=0, active_ticks=6, joins=0, completes=1
- Auto shared RX scanner events: 3
- Auto shared RX complete reasons: auto_shared_rx_timeout
- Empty-assignment shared RX: starts=0, active_ticks=14, joins=0, completes=0, oocr_deferred=24
- t+68.916s node 3: timing - telemetry_period_observed
- t+68.926s node 3: telemetry_bind - telemetry_live
- t+69.159s node 3: timing - telemetry_period_rejected
- t+69.375s node 3: complete - telemetry_period_locked
- t+70.442s node 6: timing - telemetry_period_observed
- t+70.660s node 6: complete - telemetry_period_locked
- t+92.551s node 6: quiet - join_request_received
- t+93.552s node 6: assign - silence_sent
- t+94.747s node 6: ack - assign_sent
- t+103.034s node 6: timing - telemetry_period_observed
- t+103.047s node 6: telemetry_bind - telemetry_live
- t+103.261s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=2, first_telemetry=8, timeouts=0
- node 3; ACK->telemetry -45.214s; acquire->telemetry -45.214s
- node 6; ACK->telemetry -91.673s; acquire->telemetry -91.675s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 812

## Short-Loss Guard
- Telemetry rebind events: 44
- Short-loss event counts: short_loss_guard_active=14, short_loss_guard_started=9, short_loss_recovered=7, short_loss_guard_expired=1
- Short-loss recovered observed gaps: count=7, avg=2.6, max=4
- Recent short-loss events: t+103.755s node 3 short_loss_recovered miss=2 gap=4; t+127.508s node 3 short_loss_guard_started miss=1 gap=-; t+127.588s node 3 short_loss_guard_active miss=2 gap=-; t+127.754s node 3 short_loss_recovered miss=2 gap=2; t+133.979s node 6 short_loss_guard_started miss=1 gap=-; t+134.111s node 6 short_loss_guard_active miss=2 gap=-; t+134.229s node 6 short_loss_recovered miss=2 gap=2; t+139.958s node 3 short_loss_guard_started miss=1 gap=-

## Telemetry Sequence Gaps
- Observed sequence gaps: 94
- node 6: t+4.079s seq 136 -> t+4.575s seq 139; missing [137, 138]
- node 6: t+5.042s seq 141 -> t+6.142s seq 146; missing [142, 143, 144, 145]
- node 6: t+6.142s seq 146 -> t+6.347s seq 148; missing [147]
- node 6: t+7.749s seq 155 -> t+8.143s seq 157; missing [156]
- node 6: t+8.143s seq 157 -> t+8.543s seq 159; missing [158]
- node 6: t+18.152s seq 207 -> t+18.525s seq 209; missing [208]
- node 6: t+18.525s seq 209 -> t+19.135s seq 212; missing [210, 211]
- node 6: t+19.135s seq 212 -> t+19.627s seq 214; missing [213]
- node 6: t+19.829s seq 215 -> t+20.226s seq 217; missing [216]
- node 6: t+20.311s seq 218 -> t+20.818s seq 220; missing [219]
- node 6: t+22.628s seq 229 -> t+22.942s seq 231; missing [230]
- node 6: t+22.942s seq 231 -> t+23.576s seq 233; missing [232]

## State Flicker
- Node 3: 1 rapid state transitions: t+50.348s offline->online
- Node 6: 1 rapid state transitions: t+91.548s offline->off

## Event Counts
- drone_telemetry: 812
- scanner_event: 124
- telemetry_rebind_event: 44
- assignment_event: 30
- search_event: 28
- bind_progress_event: 26
- inter_gc_status: 11
- assignments: 10
- drone_link_status: 9
- assignment_timing_hint: 6
- session_event: 2
- command: 1
- command_ack: 1
