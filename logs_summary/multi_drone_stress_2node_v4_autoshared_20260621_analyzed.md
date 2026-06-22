# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_2node_v4_autoshared_20260621.jsonl`
- Parsed records: 1029
- Approx duration: 63.0s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 21 ms, max 185 ms, avg 104 ms
- Inter-GC queued command events: 2
- t+8.414s ACK magc/magic_ground_control get_status accepted: -
- t+8.540s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.637s ACK drone/drone debug_reboot accepted: -
- t+8.675s ACK drone/drone debug_reboot accepted: -
- t+23.016s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+29.162s ACK drone/drone debug_restart_join accepted: -
- t+39.582s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+45.745s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 23
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
- Search events: 14
- Bind progress events: 35
- Assignment events: 39
- Assignment event counts: telemetry_period_observed=6, telemetry_period_locked=5, join_request_received=4, silence_sent=4, assign_sent=4, post_bind_first_telemetry=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=2, assign_reused=2
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=4
- Auto shared RX scanner events: 2
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+8.748s to t+16.481s
- t+34.228s node 3: telemetry_bind - assignment_completed
- t+34.241s node 3: timing - telemetry_period_observed
- t+34.255s node 3: telemetry_bind - telemetry_live
- t+35.055s node 3: complete - telemetry_period_locked
- t+56.186s node 6: timing - telemetry_period_observed
- t+56.212s node 6: telemetry_bind - telemetry_live
- t+56.407s node 6: complete - telemetry_period_locked
- t+57.318s node 6: quiet - join_request_received
- t+57.356s node 6: quiet - assign_reused
- t+57.356s node 6: assign - silence_sent
- t+57.387s node 6: ack - assign_sent
- t+57.388s node 6: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=8, timeouts=0
- node 3; ACK->telemetry -17.884s; acquire->telemetry -17.914s
- node 6; ACK->telemetry -12.380s; acquire->telemetry -12.380s

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 14
- Drone telemetry rows: 237
- t+8.636s node 3: drone_debug_event reboot_scheduled
- t+8.637s node 3: drone_debug_status assigned_telemetry
- t+8.675s node 6: drone_debug_event reboot_scheduled
- t+8.676s node 6: drone_debug_status assigned_telemetry
- t+23.016s node 3: drone_debug_event telemetry_rf_loss_started
- t+23.016s node 3: drone_debug_status assigned_telemetry
- t+29.162s node 3: drone_debug_event join_runtime_reset
- t+29.162s node 3: drone_debug_status backoff
- t+39.582s node 6: drone_debug_event telemetry_rf_loss_started
- t+39.582s node 6: drone_debug_status assigned_telemetry
- t+45.745s node 6: drone_debug_event join_runtime_reset
- t+45.745s node 6: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 140
- Short-loss event counts: short_loss_guard_active=21, short_loss_guard_started=4, short_loss_guard_expired=3, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=1.0, max=1
- Recent short-loss events: t+46.023s node 6 short_loss_guard_active miss=2 gap=-; t+46.221s node 6 short_loss_guard_active miss=3 gap=-; t+46.431s node 6 short_loss_guard_active miss=4 gap=-; t+46.642s node 6 short_loss_guard_active miss=5 gap=-; t+46.842s node 6 short_loss_guard_active miss=6 gap=-; t+47.050s node 6 short_loss_guard_active miss=7 gap=-; t+47.248s node 6 short_loss_guard_active miss=8 gap=-; t+47.460s node 6 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=65, rx_candidate_skipped=48, owed_rx_cleared=43, owed_rx_missed=21
- Scheduler-caused skips by node: 3=26, 6=22
- Owed selections by node: 3=39, 6=26
- Owed listens that still missed by node: 6=21
- Max consecutive scheduler skips observed: 4
- Recent fairness events: t+47.704s node 6 owed_rx_missed owed=1 skips=1; t+47.730s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+47.911s node 3 rx_candidate_skipped selected=6 owed=3 skips=3; t+47.911s node 6 owed_rx_missed owed=1 skips=1; t+47.938s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+48.124s node 3 rx_candidate_skipped selected=6 owed=3 skips=4; t+48.125s node 6 owed_rx_missed owed=1 skips=1; t+48.185s node 3 owed_rx_selected selected=3 owed=3 skips=4; t+48.252s node 3 owed_rx_selected selected=3 owed=3 skips=4; t+48.252s node 3 owed_rx_cleared owed=3 skips=4

## Telemetry Coverage
- Latest status at t+8.309s: mode `telemetry_first`
- Assigned packets received: 3
- Assigned RX coverage: 13%
- Sequence gap events: 1
- Missing sequence IDs: 1
- Max sequence gap: 1
- Assigned slot misses: 20
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 56
- node 6: t+3.948s seq 74 -> t+4.209s seq 76; missing [75]
- node 6: t+4.209s seq 76 -> t+16.294s seq 2; missing [77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, +17 more]
- node 6: t+22.102s seq 31 -> t+22.484s seq 33; missing [32]
- node 6: t+23.160s seq 36 -> t+25.686s seq 48; missing [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
- node 6: t+25.686s seq 49 -> t+26.252s seq 51; missing [50]
- node 6: t+34.135s seq 91 -> t+34.489s seq 93; missing [92]
- node 6: t+34.489s seq 93 -> t+35.283s seq 97; missing [94, 95, 96]
- node 6: t+35.283s seq 97 -> t+35.687s seq 99; missing [98]
- node 6: t+35.687s seq 99 -> t+36.096s seq 101; missing [100]
- node 6: t+36.096s seq 101 -> t+36.492s seq 103; missing [102]
- node 6: t+36.492s seq 103 -> t+36.888s seq 105; missing [104]
- node 6: t+36.888s seq 105 -> t+37.305s seq 107; missing [106]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 347
- drone_telemetry: 237
- telemetry_rebind_event: 140
- assignment_event: 39
- bind_progress_event: 35
- inter_gc_status: 23
- assignments: 15
- bench_marker: 14
- search_event: 14
- command: 11
- command_ack: 11
- drone_debug_status: 8
- drone_link_status: 7
- drone_debug_event: 6
- assignment_timing_hint: 5
- drone_join_event: 4
- drone_live_status: 2
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
