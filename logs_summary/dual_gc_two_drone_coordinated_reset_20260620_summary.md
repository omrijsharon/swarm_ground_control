# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_coordinated_reset_20260620.jsonl`
- Parsed records: 1239
- Approx duration: 185.2s

## Commands
- Sent commands: 1
- ACKs: 1 (0 rejected)
- t+10.426s ACK magc/magic_ground_control clear_all_assignments accepted: -

## Bind And Search
- Search events: 94
- Bind progress events: 17
- Assignment events: 19
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, post_bind_first_telemetry=3, telemetry_period_rejected=3, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=1
- Auto shared RX complete reasons: auto_shared_rx_timeout
- Empty-assignment shared RX: starts=0, active_ticks=40, joins=0, completes=0, oocr_deferred=144
- t+5.950s node 3: complete - telemetry_period_locked
- t+6.052s node 6: timing - telemetry_period_rejected
- t+6.244s node 6: timing - telemetry_period_rejected
- t+6.584s node 6: complete - telemetry_period_locked
- t+93.697s node 6: quiet - join_request_received
- t+94.720s node 6: assign - silence_sent
- t+95.940s node 6: ack - assign_sent
- t+98.001s node 6: timing - telemetry_period_observed
- t+98.018s node 6: telemetry_bind - telemetry_live
- t+98.204s node 6: complete - telemetry_period_locked
- t+117.513s node 3: timing - telemetry_period_observed
- t+117.713s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 1
- Channel scan event counts: background_oocr_slice=1
- CAD samples: rows=1, validated=0, rejected=1, one_hit_rejected=1
- OOCR events: 2
- OOCR event counts: background_oocr_started=1, confirmed_drone=1
- Reset/clear to confirmed orphan telemetry: 104.635s

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=6, timeouts=0
- node 3
- node 6; ACK->telemetry -91.213s; acquire->telemetry -91.213s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 697

## Short-Loss Guard
- Telemetry rebind events: 22
- Short-loss event counts: short_loss_guard_active=8, short_loss_guard_started=6, short_loss_recovered=5
- Short-loss recovered observed gaps: count=5, avg=3.2, max=5
- Recent short-loss events: t+170.653s node 3 short_loss_guard_active miss=2 gap=-; t+170.852s node 3 short_loss_guard_active miss=3 gap=-; t+171.049s node 3 short_loss_guard_active miss=4 gap=-; t+171.342s node 3 short_loss_recovered miss=4 gap=5; t+184.328s node 3 short_loss_guard_started miss=1 gap=-; t+184.552s node 3 short_loss_guard_active miss=2 gap=-; t+184.752s node 3 short_loss_guard_active miss=3 gap=-; t+184.941s node 3 short_loss_guard_active miss=4 gap=-

## Telemetry Sequence Gaps
- Observed sequence gaps: 98
- node 3: t+5.268s seq 42 -> t+5.712s seq 45; missing [43, 44]
- node 3: t+5.712s seq 45 -> t+6.039s seq 47; missing [46]
- node 3: t+6.039s seq 47 -> t+6.432s seq 49; missing [48]
- node 3: t+6.432s seq 49 -> t+6.911s seq 51; missing [50]
- node 3: t+7.230s seq 52 -> t+7.528s seq 54; missing [53]
- node 3: t+7.910s seq 56 -> t+8.310s seq 58; missing [57]
- node 3: t+8.310s seq 58 -> t+8.676s seq 60; missing [59]
- node 3: t+8.676s seq 60 -> t+9.026s seq 62; missing [61]
- node 3: t+9.026s seq 62 -> t+9.513s seq 64; missing [63]
- node 3: t+9.513s seq 64 -> t+9.823s seq 66; missing [65]
- node 3: t+9.823s seq 66 -> t+117.589s seq 93; missing [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, +10 more]
- node 3: t+121.004s seq 110 -> t+121.411s seq 112; missing [111]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 697
- scanner_event: 146
- search_event: 94
- inter_gc_status: 30
- telemetry_rebind_event: 22
- assignment_event: 19
- bind_progress_event: 17
- assignments: 8
- drone_link_status: 4
- assignment_timing_hint: 4
- orphan_recovery_event: 2
- session_event: 2
- channel_scan_event: 1
- command: 1
- command_ack: 1
