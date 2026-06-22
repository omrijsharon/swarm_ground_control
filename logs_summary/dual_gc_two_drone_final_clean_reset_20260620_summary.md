# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_final_clean_reset_20260620.jsonl`
- Parsed records: 1619
- Approx duration: 175.0s

## Commands
- Sent commands: 1
- ACKs: 1 (0 rejected)
- t+10.241s ACK magc/magic_ground_control clear_all_assignments accepted: -

## Bind And Search
- Search events: 39
- Bind progress events: 17
- Assignment events: 20
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, join_request_received=2, silence_sent=2, assign_sent=2, join_ack_received=2, post_bind_first_telemetry=2, telemetry_period_rejected=1, post_bind_acquire_started=1
- Empty-assignment shared RX: starts=0, active_ticks=22, joins=0, completes=0, oocr_deferred=49
- t+36.605s node 3: quiet - join_request_received
- t+37.438s node 3: assign - silence_sent
- t+38.698s node 3: ack - assign_sent
- t+40.423s node 3: timing - telemetry_period_observed
- t+40.438s node 3: telemetry_bind - telemetry_live
- t+40.623s node 3: complete - telemetry_period_locked
- t+50.421s node 6: quiet - join_request_received
- t+51.455s node 6: assign - silence_sent
- t+52.704s node 6: ack - assign_sent
- t+54.904s node 6: timing - telemetry_period_observed
- t+54.923s node 6: telemetry_bind - telemetry_live
- t+55.104s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=4, timeouts=0
- node 3; ACK->telemetry -35.839s; acquire->telemetry -35.839s
- node 6; ACK->telemetry -49.791s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 1328

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Sequence Gaps
- Observed sequence gaps: 9
- node 6: t+4.444s seq 210 -> t+4.541s seq 212; missing [211]
- node 6: t+10.035s seq 239 -> t+55.014s seq 7; missing [240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, +7 more]
- node 6: t+159.309s seq 16 -> t+159.708s seq 18; missing [17]
- node 6: t+159.708s seq 18 -> t+160.098s seq 20; missing [19]
- node 3: t+3.990s seq 246 -> t+4.444s seq 248; missing [247]
- node 3: t+10.037s seq 20 -> t+40.448s seq 4; missing [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, +17 more]
- node 3: t+54.654s seq 71 -> t+54.881s seq 75; missing [72, 73, 74]
- node 3: t+54.881s seq 75 -> t+55.023s seq 77; missing [76]
- node 3: t+159.501s seq 86 -> t+159.708s seq 88; missing [87]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 1328
- scanner_event: 42
- search_event: 39
- assignment_event: 20
- bind_progress_event: 17
- assignments: 8
- inter_gc_status: 6
- drone_link_status: 4
- assignment_timing_hint: 4
- session_event: 3
- command: 1
- command_ack: 1
