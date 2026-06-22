# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_4node_phase_slots_v4_sharedpriority_20260621.jsonl`
- Parsed records: 2410
- Approx duration: 189.6s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 26 ms, max 423 ms, avg 96 ms
- Inter-GC queued command events: 2
- t+0.253s ACK drone/drone get_status accepted: -
- t+8.289s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.428s ACK magc/magic_ground_control get_status accepted: -
- t+8.905s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+9.003s ACK drone/drone debug_reboot accepted: -
- t+9.057s ACK drone/drone debug_reboot accepted: -
- t+9.086s ACK drone/drone debug_reboot accepted: -
- t+9.113s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 71
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
- Search events: 10
- Bind progress events: 34
- Assignment events: 38
- Assignment event counts: telemetry_period_observed=7, telemetry_period_locked=5, silence_sent=5, assign_sent=4, join_request_received=3, assign_created=3, post_bind_first_telemetry=3, join_ack_received=2, post_bind_acquire_started=2, join_ack_timeout=2, telemetry_period_rejected=2
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=1
- Auto shared RX scanner events: 2
- Auto shared RX complete reasons: auto_shared_rx_timeout
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=4, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+9.122s to t+67.951s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+47.982s node 2: ack - assign_sent
- t+48.016s node 6: complete - telemetry_period_locked
- t+48.079s node 2: assign - silence_sent
- t+53.639s node 3: quiet - join_request_received
- t+53.651s node 3: timing - telemetry_period_observed
- t+53.665s node 3: telemetry_bind - telemetry_live
- t+53.782s node 3: quiet - assign_created
- t+53.782s node 3: assign - silence_sent
- t+53.924s node 3: ack - assign_sent
- t+54.035s node 3: telemetry_bind - assignment_completed
- t+54.048s node 3: timing - telemetry_period_rejected
- t+54.678s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=4, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -48.520s; acquire->telemetry -48.588s
- node 6
- node 7; ACK->telemetry -12.233s; acquire->telemetry -12.432s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 12
- Drone telemetry rows: 1412
- t+0.092s node 2: drone_debug_status wait_assignment
- t+0.142s node 3: drone_debug_status assigned_telemetry
- t+0.202s node 6: drone_debug_status assigned_telemetry
- t+0.254s node 7: drone_debug_status assigned_telemetry
- t+9.002s node 2: drone_debug_event reboot_scheduled
- t+9.003s node 2: drone_debug_status wait_assignment
- t+9.057s node 3: drone_debug_event reboot_scheduled
- t+9.057s node 3: drone_debug_status assigned_telemetry
- t+9.086s node 6: drone_debug_event reboot_scheduled
- t+9.087s node 6: drone_debug_status assigned_telemetry
- t+9.113s node 7: drone_debug_event reboot_scheduled
- t+9.113s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 163
- Short-loss event counts: short_loss_guard_started=75, short_loss_recovered=75
- Short-loss recovered observed gaps: count=75, avg=1.0, max=2
- Recent short-loss events: t+168.949s node 7 short_loss_guard_started miss=1 gap=-; t+169.180s node 7 short_loss_recovered miss=1 gap=1; t+171.949s node 7 short_loss_guard_started miss=1 gap=-; t+172.180s node 7 short_loss_recovered miss=1 gap=1; t+185.342s node 7 short_loss_guard_started miss=1 gap=-; t+185.481s node 7 short_loss_recovered miss=1 gap=1; t+186.745s node 7 short_loss_guard_started miss=1 gap=-; t+186.901s node 7 short_loss_recovered miss=1 gap=1

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=68, rx_candidate_skipped=66, owed_rx_cleared=66, owed_rx_missed=1
- Scheduler-caused skips by node: 6=23, 7=43
- Owed selections by node: 6=25, 7=43
- Owed listens that still missed by node: 7=1
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+173.097s node 7 owed_rx_cleared owed=1 skips=1; t+187.179s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+187.247s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+187.461s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+187.484s node 7 owed_rx_cleared owed=1 skips=1; t+187.662s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+187.786s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+187.786s node 6 owed_rx_cleared owed=1 skips=1; t+187.899s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+187.899s node 7 owed_rx_cleared owed=1 skips=1

## Telemetry Coverage
- Latest status at t+8.341s: mode `telemetry_first`
- Assigned packets received: 15
- Assigned RX coverage: 51%
- Sequence gap events: 2
- Missing sequence IDs: 4
- Max sequence gap: 3
- Assigned slot misses: 14
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 712
- node 6: t+5.265s seq 158 -> t+6.154s seq 162; missing [159, 160, 161]
- node 6: t+6.154s seq 162 -> t+8.701s seq 175; missing [163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174]
- node 6: t+8.701s seq 175 -> t+47.616s seq 3; missing [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, +17 more]
- node 6: t+53.442s seq 32 -> t+53.796s seq 34; missing [33]
- node 6: t+53.796s seq 34 -> t+54.197s seq 36; missing [35]
- node 6: t+54.197s seq 36 -> t+54.998s seq 39; missing [37, 38]
- node 6: t+54.998s seq 39 -> t+55.479s seq 42; missing [40, 41]
- node 6: t+55.479s seq 42 -> t+56.031s seq 45; missing [43, 44]
- node 6: t+56.031s seq 45 -> t+56.602s seq 47; missing [46]
- node 6: t+56.602s seq 47 -> t+57.036s seq 50; missing [48, 49]
- node 6: t+57.240s seq 51 -> t+57.799s seq 54; missing [52, 53]
- node 6: t+57.799s seq 54 -> t+58.383s seq 56; missing [55]

## State Flicker
- Node 7: 1 rapid state transitions: t+5.991s offline->online

## Event Counts
- drone_telemetry: 1412
- scanner_event: 483
- telemetry_rebind_event: 163
- inter_gc_status: 71
- assignment_event: 38
- bind_progress_event: 34
- assignments: 17
- command: 11
- command_ack: 11
- search_event: 10
- drone_debug_status: 8
- drone_link_status: 8
- bench_marker: 7
- assignment_timing_hint: 5
- drone_live_status: 4
- drone_debug_event: 4
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
