# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_4node_phase_slots_v5_joinwait_20260621.jsonl`
- Parsed records: 4575
- Approx duration: 189.9s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 15 ms, max 295 ms, avg 111 ms
- Inter-GC queued command events: 2
- t+0.355s ACK drone/drone get_status accepted: -
- t+8.381s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.494s ACK magc/magic_ground_control get_status accepted: -
- t+8.843s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.969s ACK drone/drone debug_reboot accepted: -
- t+9.078s ACK drone/drone debug_reboot accepted: -
- t+9.373s ACK drone/drone debug_reboot accepted: -
- t+9.408s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 72
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 0

## Bind And Search
- Search events: 31
- Bind progress events: 29
- Assignment events: 43
- Assignment event counts: post_bind_acquire_timeout=10, join_request_received=4, assign_created=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, telemetry_period_observed=3, post_bind_first_telemetry=3, telemetry_period_locked=3
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=17
- Auto shared RX scanner events: 17
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=5, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+9.052s to t+53.621s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+30.819s node 3: telemetry_bind - assignment_completed
- t+34.645s node 3: timing - telemetry_period_observed
- t+34.658s node 3: telemetry_bind - telemetry_live
- t+35.647s node 3: complete - telemetry_period_locked
- t+38.541s node 6: quiet - join_request_received
- t+38.541s node 6: quiet - assign_created
- t+38.541s node 6: assign - silence_sent
- t+38.743s node 6: ack - assign_sent
- t+38.946s node 6: telemetry_bind - assignment_completed
- t+47.095s node 6: timing - telemetry_period_observed
- t+47.108s node 6: telemetry_bind - telemetry_live
- t+73.691s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=6, timeouts=20
- node 2; timeouts=8
- node 3; ACK->telemetry 4.034s; acquire->telemetry 3.853s; timeouts=4
- node 6; ACK->telemetry 8.378s; acquire->telemetry 8.378s; timeouts=4
- node 7; ACK->telemetry 3.075s; acquire->telemetry 3.075s; timeouts=4

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 12
- Drone telemetry rows: 33
- t+0.166s node 2: drone_debug_status wait_assignment
- t+0.243s node 3: drone_debug_status assigned_telemetry
- t+0.317s node 6: drone_debug_status wait_assignment
- t+0.356s node 7: drone_debug_status backoff
- t+8.969s node 2: drone_debug_event reboot_scheduled
- t+8.969s node 2: drone_debug_status wait_assignment
- t+9.077s node 3: drone_debug_event reboot_scheduled
- t+9.078s node 3: drone_debug_status assigned_telemetry
- t+9.373s node 6: drone_debug_event reboot_scheduled
- t+9.373s node 6: drone_debug_status wait_assignment
- t+9.408s node 7: drone_debug_event reboot_scheduled
- t+9.408s node 7: drone_debug_status wait_assignment

## Short-Loss Guard
- Telemetry rebind events: 89
- Short-loss event counts: short_loss_guard_active=7, short_loss_guard_started=1, short_loss_guard_expired=1
- Recent short-loss events: t+90.834s node 3 short_loss_guard_active miss=2 gap=-; t+91.231s node 3 short_loss_guard_active miss=3 gap=-; t+91.639s node 3 short_loss_guard_active miss=4 gap=-; t+92.034s node 3 short_loss_guard_active miss=5 gap=-; t+92.431s node 3 short_loss_guard_active miss=6 gap=-; t+92.840s node 3 short_loss_guard_active miss=7 gap=-; t+93.235s node 3 short_loss_guard_active miss=8 gap=-; t+93.631s node 3 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=964, owed_rx_selected=781, owed_rx_cleared=16, owed_rx_missed=9
- Scheduler-caused skips by node: 3=156, 6=518, 7=290
- Owed selections by node: 3=579, 6=29, 7=173
- Owed listens that still missed by node: 3=9
- Max consecutive scheduler skips observed: 255
- Recent fairness events: t+189.296s node 6 rx_candidate_skipped selected=3 owed=3 skips=83; t+189.309s node 3 owed_rx_selected selected=3 owed=3 skips=143; t+189.321s node 7 rx_candidate_skipped selected=3 owed=3 skips=93; t+189.476s node 6 rx_candidate_skipped selected=3 owed=3 skips=84; t+189.504s node 3 owed_rx_selected selected=3 owed=3 skips=143; t+189.514s node 7 rx_candidate_skipped selected=3 owed=3 skips=94; t+189.514s node 6 rx_candidate_skipped selected=3 owed=3 skips=85; t+189.697s node 3 owed_rx_selected selected=3 owed=3 skips=143; t+189.709s node 7 rx_candidate_skipped selected=3 owed=3 skips=95; t+189.880s node 6 rx_candidate_skipped selected=3 owed=3 skips=86

## Telemetry Coverage
- Latest status at t+8.433s: mode `telemetry_first`
- Assigned packets received: 0
- Assigned RX coverage: 0%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 14
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 30
- node 7: t+26.949s seq 18 -> t+27.707s seq 22; missing [19, 20, 21]
- node 7: t+27.707s seq 22 -> t+125.488s seq 255; missing [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, +17 more]
- node 7: t+125.488s seq 255 -> t+127.889s seq 11; missing [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
- node 7: t+127.889s seq 11 -> t+128.490s seq 14; missing [12, 13]
- node 7: t+128.490s seq 14 -> t+129.089s seq 17; missing [15, 16]
- node 7: t+129.089s seq 17 -> t+129.482s seq 19; missing [18]
- node 7: t+129.482s seq 19 -> t+129.882s seq 21; missing [20]
- node 7: t+129.882s seq 21 -> t+130.495s seq 24; missing [22, 23]
- node 7: t+130.495s seq 24 -> t+165.287s seq 198; missing [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, +17 more]
- node 7: t+165.287s seq 198 -> t+168.082s seq 212; missing [199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211]
- node 7: t+168.082s seq 212 -> t+169.291s seq 218; missing [213, 214, 215, 216, 217]
- node 7: t+169.291s seq 218 -> t+169.889s seq 221; missing [219, 220]

## State Flicker
- Node 3: 1 rapid state transitions: t+34.672s offline->online

## Event Counts
- scanner_event: 4075
- telemetry_rebind_event: 89
- inter_gc_status: 72
- assignment_event: 43
- drone_telemetry: 33
- search_event: 31
- bind_progress_event: 29
- assignments: 20
- drone_link_status: 13
- command: 11
- command_ack: 11
- drone_debug_status: 8
- bench_marker: 7
- drone_live_status: 4
- drone_debug_event: 4
- assignment_timing_hint: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
