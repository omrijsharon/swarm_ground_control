# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_reset_rejoin_enrollfix_20260620.jsonl`
- Parsed records: 1207
- Approx duration: 125.0s

## Commands
- Sent commands: 1
- ACKs: 1 (0 rejected)
- t+25.292s ACK magc/magic_ground_control clear_all_assignments accepted: -

## Bind And Search
- Search events: 17
- Bind progress events: 19
- Assignment events: 28
- Assignment event counts: telemetry_period_observed=5, telemetry_period_locked=5, join_request_received=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_first_telemetry=3, telemetry_period_rejected=1, assign_created=1, post_bind_acquire_started=1
- Auto shared RX: starts=0, active_ticks=7, joins=0, completes=2
- Auto shared RX scanner events: 4
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout
- Empty-assignment shared RX: starts=0, active_ticks=0, joins=0, completes=0, oocr_deferred=12
- t+36.615s node 6: timing - telemetry_period_observed
- t+36.631s node 6: telemetry_bind - telemetry_live
- t+36.831s node 6: complete - telemetry_period_locked
- t+40.957s node 3: assign - silence_sent
- t+43.664s node 3: timing - telemetry_period_observed
- t+43.673s node 3: telemetry_bind - telemetry_live
- t+48.372s node 3: complete - telemetry_period_locked
- t+57.247s node 6: quiet - join_request_received
- t+58.248s node 6: assign - silence_sent
- t+62.157s node 6: timing - telemetry_period_observed
- t+62.180s node 6: telemetry_bind - telemetry_live
- t+62.387s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -35.693s
- node 6; ACK->telemetry -28.094s; acquire->telemetry -28.094s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 702

## Short-Loss Guard
- Telemetry rebind events: 59
- Short-loss event counts: short_loss_guard_active=22, short_loss_guard_started=11, short_loss_recovered=8, short_loss_guartrol=1, short_loss_guard_expired=1
- Short-loss recovered observed gaps: count=8, avg=2.8, max=9
- Recent short-loss events: t+47.351s node 6 short_loss_guard_expired miss=9 gap=-; t+48.564s node 3 short_loss_guard_started miss=1 gap=-; t+48.804s node 3 short_loss_guard_active miss=2 gap=-; t+48.997s node 3 short_loss_guard_active miss=3 gap=-; t+49.284s node 3 short_loss_recovered miss=3 gap=4; t+94.170s node 6 short_loss_guard_started miss=1 gap=-; t+94.274s node 6 short_loss_guard_active miss=2 gap=-; t+94.357s node 6 short_loss_recovered miss=2 gap=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 151
- node 3: t+7.514s seq 167 -> t+7.902s seq 170; missing [168, 169]
- node 3: t+7.902s seq 170 -> t+9.116s seq 176; missing [171, 172, 173, 174, 175]
- node 3: t+9.116s seq 176 -> t+9.479s seq 178; missing [177]
- node 3: t+9.479s seq 178 -> t+9.883s seq 180; missing [179]
- node 3: t+9.883s seq 180 -> t+10.283s seq 182; missing [181]
- node 3: t+10.283s seq 182 -> t+10.684s seq 184; missing [183]
- node 3: t+10.684s seq 184 -> t+12.712s seq 194; missing [185, 186, 187, 188, 189, 190, 191, 192, 193]
- node 3: t+12.712s seq 194 -> t+13.083s seq 196; missing [195]
- node 3: t+13.083s seq 196 -> t+13.483s seq 198; missing [197]
- node 3: t+13.483s seq 198 -> t+13.767s seq 200; missing [199]
- node 3: t+13.767s seq 200 -> t+14.309s seq 202; missing [201]
- node 3: t+14.309s seq 202 -> t+14.677s seq 204; missing [203]

## State Flicker
- Node 6: 1 rapid state transitions: t+49.902s offline->off

## Event Counts
- drone_telemetry: 702
- scanner_event: 139
- telemetry_rebind_event: 59
- assignment_event: 28
- bind_progress_event: 19
- search_event: 17
- inter_gc_status: 13
- assignments: 10
- drone_link_status: 7
- assignment_timing_hint: 5
- session_event: 3
- command: 1
- command_ack: 1
