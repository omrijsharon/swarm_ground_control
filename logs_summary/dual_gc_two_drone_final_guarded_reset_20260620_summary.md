# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_final_guarded_reset_20260620.jsonl`
- Parsed records: 1368
- Approx duration: 130.1s

## Commands
- Sent commands: 1
- ACKs: 0 (0 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0001

## Bind And Search
- Search events: 15
- Bind progress events: 19
- Assignment events: 22
- Assignment event counts: telemetry_period_observed=6, telemetry_period_locked=6, silence_sent=2, assign_sent=2, join_ack_received=2, post_bind_first_telemetry=2, join_request_received=1, telemetry_period_rejected=1
- Auto shared RX: starts=0, active_ticks=12, joins=0, completes=2
- Auto shared RX scanner events: 2
- Auto shared RX complete reasons: auto_shared_rx_timeout, post_bind_acquire_pending
- t+45.696s node 3: complete - telemetry_period_locked
- t+53.717s node 6: quiet - join_request_received
- t+54.603s node 6: assign - silence_sent
- t+55.810s node 6: ack - assign_sent
- t+56.999s node 6: timing - telemetry_period_observed
- t+57.124s node 6: timing - telemetry_period_rejected
- t+57.380s node 6: complete - telemetry_period_locked
- t+57.861s node 3: timing - telemetry_period_observed
- t+58.210s node 3: complete - telemetry_period_locked
- t+58.348s node 6: timing - telemetry_period_observed
- t+58.361s node 6: telemetry_bind - telemetry_live
- t+58.563s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=0
- node 3; ACK->telemetry -38.878s
- node 6; ACK->telemetry -52.924s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 870

## Short-Loss Guard
- Telemetry rebind events: 50
- Short-loss event counts: short_loss_guard_active=14, short_loss_guard_started=2, short_loss_guard_expired=1
- Recent short-loss events: t+37.903s node 6 short_loss_guard_started miss=1 gap=-; t+38.821s node 6 short_loss_guard_active miss=2 gap=-; t+39.736s node 6 short_loss_guard_active miss=3 gap=-; t+40.658s node 6 short_loss_guard_active miss=4 gap=-; t+41.577s node 6 short_loss_guard_active miss=5 gap=-; t+42.493s node 6 short_loss_guard_active miss=6 gap=-; t+43.420s node 6 short_loss_guard_active miss=7 gap=-; t+44.466s node 6 short_loss_guard_active miss=8 gap=-

## Telemetry Sequence Gaps
- Observed sequence gaps: 151
- node 3: t+3.842s seq 213 -> t+4.116s seq 215; missing [214]
- node 3: t+4.116s seq 215 -> t+7.676s seq 232; missing [216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231]
- node 3: t+7.676s seq 232 -> t+7.877s seq 234; missing [233]
- node 3: t+7.877s seq 234 -> t+8.487s seq 236; missing [235]
- node 3: t+8.487s seq 236 -> t+8.688s seq 238; missing [237]
- node 3: t+8.688s seq 238 -> t+9.093s seq 240; missing [239]
- node 3: t+9.093s seq 240 -> t+9.644s seq 242; missing [241]
- node 3: t+9.644s seq 242 -> t+10.044s seq 244; missing [243]
- node 3: t+10.044s seq 244 -> t+10.444s seq 246; missing [245]
- node 3: t+10.444s seq 246 -> t+10.843s seq 248; missing [247]
- node 3: t+10.843s seq 248 -> t+11.218s seq 250; missing [249]
- node 3: t+11.218s seq 250 -> t+11.632s seq 252; missing [251]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 870
- scanner_event: 209
- telemetry_rebind_event: 50
- assignment_event: 22
- bind_progress_event: 19
- search_event: 15
- inter_gc_status: 14
- assignments: 7
- drone_link_status: 7
- assignment_timing_hint: 6
- command: 1
- search_ost_bind_acquire_pending: 1
