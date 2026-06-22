# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_final_clean2_reset_20260620.jsonl`
- Parsed records: 945
- Approx duration: 145.2s

## Commands
- Sent commands: 1
- ACKs: 1 (0 rejected)
- t+10.641s ACK magc/magic_ground_control clear_all_assignments accepted: -

## Bind And Search
- Search events: 35
- Bind progress events: 16
- Assignment events: 20
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, join_request_received=2, silence_sent=2, assign_sent=2, join_ack_received=2, post_bind_acquire_started=2, post_bind_first_telemetry=2
- Auto shared RX: starts=0, active_ticks=10, joins=0, completes=1
- Auto shared RX scanner events: 10
- Auto shared RX complete reasons: auto_shared_rx_timeout
- Empty-assignment shared RX: starts=0, active_ticks=46, joins=0, completes=0, oocr_deferred=0
- t+36.892s node 3: quiet - join_request_received
- t+37.714s node 3: assign - silence_sent
- t+38.932s node 3: ack - assign_sent
- t+40.460s node 3: timing - telemetry_period_observed
- t+40.472s node 3: telemetry_bind - telemetry_live
- t+40.805s node 3: complete - telemetry_period_locked
- t+49.194s node 6: quiet - join_request_received
- t+50.169s node 6: assign - silence_sent
- t+51.267s node 6: ack - assign_sent
- t+53.019s node 6: timing - telemetry_period_observed
- t+53.032s node 6: telemetry_bind - telemetry_live
- t+56.055s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=2, first_telemetry=4, timeouts=0
- node 3; ACK->telemetry -36.127s; acquire->telemetry -36.127s
- node 6; ACK->telemetry -48.341s; acquire->telemetry -48.498s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 566

## Short-Loss Guard
- Telemetry rebind events: 29
- Short-loss event counts: short_loss_guard_active=8, short_loss_guard_started=6, short_loss_recovered=5, short_loss_guard_expired=1
- Short-loss recovered observed gaps: count=5, avg=1.2, max=2
- Recent short-loss events: t+139.001s node 6 short_loss_guard_active miss=6 gap=-; t+139.202s node 6 short_loss_guard_active miss=7 gap=-; t+139.401s node 6 short_loss_guard_active miss=8 gap=-; t+139.599s node 6 short_loss_guard_expired miss=9 gap=-; t+141.171s node 3 short_loss_guard_started miss=1 gap=-; t+141.251s node 3 short_loss_recovered miss=1 gap=1; t+143.172s node 3 short_loss_guard_started miss=1 gap=-; t+143.408s node 3 short_loss_recovered miss=1 gap=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 442
- node 3: t+4.089s seq 93 -> t+4.426s seq 95; missing [94]
- node 3: t+10.436s seq 125 -> t+40.472s seq 3; missing [126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, +17 more]
- node 3: t+41.008s seq 4 -> t+41.210s seq 6; missing [5]
- node 3: t+52.864s seq 65 -> t+53.252s seq 67; missing [66]
- node 3: t+53.252s seq 67 -> t+56.269s seq 82; missing [68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]
- node 3: t+56.269s seq 82 -> t+56.672s seq 84; missing [83]
- node 3: t+56.672s seq 84 -> t+57.248s seq 86; missing [85]
- node 3: t+57.248s seq 86 -> t+57.450s seq 88; missing [87]
- node 3: t+57.450s seq 88 -> t+58.148s seq 90; missing [89]
- node 3: t+58.148s seq 90 -> t+58.458s seq 92; missing [91]
- node 3: t+58.458s seq 92 -> t+58.659s seq 94; missing [93]
- node 3: t+58.659s seq 94 -> t+59.249s seq 96; missing [95]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 566
- scanner_event: 113
- search_event: 35
- telemetry_rebind_event: 29
- assignment_event: 20
- bind_progress_event: 16
- inter_gc_status: 10
- assignments: 8
- drone_link_status: 4
- assignment_timing_hint: 4
- session_event: 2
- command: 1
- command_ack: 1
