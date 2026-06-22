# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_2node_20260621.jsonl`
- Parsed records: 814
- Approx duration: 47.9s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 11 ms, max 208 ms, avg 108 ms
- Inter-GC queued command events: 2
- t+8.360s ACK magc/magic_ground_control get_status accepted: -
- t+8.618s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.832s ACK drone/drone debug_reboot accepted: -
- t+8.898s ACK drone/drone debug_reboot accepted: -
- t+23.807s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+29.903s ACK drone/drone debug_restart_join accepted: -
- t+36.220s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+42.443s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 15
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
- Search events: 8
- Bind progress events: 31
- Assignment events: 34
- Assignment event counts: telemetry_period_observed=5, post_bind_first_telemetry=5, telemetry_period_locked=5, join_request_received=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3, assign_created=2, telemetry_period_rejected=1, assign_reused=1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+8.826s to t+16.752s
- t+23.463s node 3: timing - telemetry_period_observed
- t+23.493s node 3: telemetry_bind - telemetry_live
- t+23.668s node 3: timing - telemetry_period_rejected
- t+25.804s node 3: complete - telemetry_period_locked
- t+35.633s node 3: quiet - join_request_received
- t+35.633s node 3: quiet - assign_reused
- t+35.662s node 3: assign - silence_sent
- t+35.662s node 3: ack - assign_sent
- t+35.717s node 3: telemetry_bind - assignment_completed
- t+35.983s node 3: timing - telemetry_period_observed
- t+35.993s node 3: telemetry_bind - telemetry_live
- t+36.383s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=10, timeouts=0
- node 3; ACK->telemetry -19.646s; acquire->telemetry -19.646s
- node 6; ACK->telemetry -12.680s; acquire->telemetry -12.680s

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 14
- Drone telemetry rows: 156
- t+8.832s node 3: drone_debug_event reboot_scheduled
- t+8.832s node 3: drone_debug_status assigned_telemetry
- t+8.898s node 6: drone_debug_event reboot_scheduled
- t+8.898s node 6: drone_debug_status assigned_telemetry
- t+23.807s node 3: drone_debug_event telemetry_rf_loss_started
- t+23.807s node 3: drone_debug_status assigned_telemetry
- t+29.903s node 3: drone_debug_event join_runtime_reset
- t+29.903s node 3: drone_debug_status backoff
- t+36.220s node 6: drone_debug_event telemetry_rf_loss_started
- t+36.220s node 6: drone_debug_status assigned_telemetry
- t+42.443s node 6: drone_debug_event join_runtime_reset
- t+42.443s node 6: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 44
- Short-loss event counts: short_loss_guard_active=22, short_loss_guard_started=4, short_loss_guard_expired=3
- Recent short-loss events: t+43.335s node 6 short_loss_guard_active miss=4 gap=-; t+43.545s node 6 short_loss_guard_active miss=5 gap=-; t+43.738s node 6 short_loss_guard_active miss=6 gap=-; t+43.945s node 6 short_loss_guard_active miss=7 gap=-; t+44.134s node 6 short_loss_guard_active miss=8 gap=-; t+44.339s node 6 short_loss_guard_expired miss=9 gap=-; t+47.748s node 6 short_loss_guard_started miss=1 gap=-; t+47.947s node 6 short_loss_guard_active miss=2 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=67, rx_candidate_skipped=52, owed_rx_cleared=43, owed_rx_missed=18
- Scheduler-caused skips by node: 3=25, 6=27
- Owed selections by node: 3=39, 6=28
- Owed listens that still missed by node: 6=18
- Max consecutive scheduler skips observed: 4
- Recent fairness events: t+46.530s node 6 owed_rx_missed owed=1 skips=1; t+46.739s node 6 owed_rx_missed owed=1 skips=1; t+46.929s node 6 owed_rx_cleared owed=1 skips=1; t+47.144s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+47.326s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+47.326s node 6 owed_rx_cleared owed=1 skips=1; t+47.536s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+47.739s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+47.739s node 6 owed_rx_missed owed=1 skips=1; t+47.927s node 6 owed_rx_missed owed=1 skips=1

## Telemetry Coverage
- Latest status at t+8.308s: mode `telemetry_first`
- Assigned packets received: 23
- Assigned RX coverage: 95%
- Sequence gap events: 21
- Missing sequence IDs: 21
- Max sequence gap: 1
- Assigned slot misses: 1
- Non-assigned preemptions: 0
- Owed RX active: True node=6 count=1
- Fairness skips: 20
- Owed selections: 19
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 58
- node 3: t+3.785s seq 173 -> t+4.303s seq 175; missing [174]
- node 3: t+4.303s seq 175 -> t+4.549s seq 177; missing [176]
- node 3: t+4.549s seq 177 -> t+4.957s seq 179; missing [178]
- node 3: t+4.957s seq 179 -> t+5.364s seq 181; missing [180]
- node 3: t+5.364s seq 181 -> t+5.771s seq 183; missing [182]
- node 3: t+5.771s seq 183 -> t+6.163s seq 185; missing [184]
- node 3: t+6.163s seq 185 -> t+6.564s seq 187; missing [186]
- node 3: t+6.564s seq 187 -> t+6.953s seq 189; missing [188]
- node 3: t+6.953s seq 189 -> t+7.362s seq 191; missing [190]
- node 3: t+7.362s seq 191 -> t+7.758s seq 193; missing [192]
- node 3: t+7.758s seq 193 -> t+8.173s seq 195; missing [194]
- node 3: t+8.173s seq 195 -> t+23.493s seq 3; missing [196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, +17 more]

## State Flicker
- Node 6: 3 rapid state transitions: t+45.135s locking->weak, t+46.332s weak->offline, t+46.939s offline->online

## Event Counts
- scanner_event: 335
- drone_telemetry: 156
- telemetry_rebind_event: 44
- assignment_event: 34
- bind_progress_event: 31
- inter_gc_status: 15
- bench_marker: 14
- command: 11
- command_ack: 11
- assignments: 11
- drone_link_status: 9
- drone_debug_status: 8
- search_event: 8
- drone_debug_event: 6
- assignment_timing_hint: 5
- drone_join_event: 4
- drone_live_status: 2
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
