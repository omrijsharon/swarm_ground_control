# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_2node_v3_lbtbypass_20260621.jsonl`
- Parsed records: 2023
- Approx duration: 181.9s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 22 ms, max 1035 ms, avg 188 ms
- Inter-GC queued command events: 2
- t+9.251s ACK magc/magic_ground_control get_status accepted: -
- t+9.593s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+9.700s ACK drone/drone debug_reboot accepted: -
- t+9.865s ACK drone/drone debug_reboot accepted: -
- t+35.707s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+41.803s ACK drone/drone debug_restart_join accepted: -
- t+152.018s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+158.096s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 110
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
- Search events: 90
- Bind progress events: 39
- Assignment events: 47
- Assignment event counts: silence_sent=7, assign_sent=6, join_request_received=5, join_ack_received=4, post_bind_acquire_started=4, telemetry_period_observed=4, post_bind_first_telemetry=4, telemetry_period_locked=4, assign_created=3, post_bind_acquire_timeout=2, join_ack_timeout=2, assign_reused=2
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=80
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+9.795s to t+27.953s
- t+162.500s node 3: telemetry_bind - assignment_completed
- t+163.042s node 3: timing - telemetry_period_observed
- t+163.055s node 3: telemetry_bind - telemetry_live
- t+166.041s node 3: complete - telemetry_period_locked
- t+175.957s node 6: quiet - join_request_received
- t+175.991s node 6: quiet - assign_reused
- t+175.991s node 6: assign - silence_sent
- t+175.991s node 6: ack - assign_sent
- t+176.026s node 6: telemetry_bind - assignment_completed
- t+176.265s node 6: timing - telemetry_period_observed
- t+176.278s node 6: telemetry_bind - telemetry_live
- t+176.694s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=8, timeouts=4
- node 3; ACK->telemetry 0.222s; acquire->telemetry 0.222s; timeouts=2
- node 6; ACK->telemetry 0.121s; acquire->telemetry 0.121s; timeouts=2

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 14
- Drone telemetry rows: 724
- t+9.699s node 3: drone_debug_event reboot_scheduled
- t+9.700s node 3: drone_debug_status wait_assignment
- t+9.865s node 6: drone_debug_event reboot_scheduled
- t+9.865s node 6: drone_debug_status backoff
- t+35.707s node 3: drone_debug_event telemetry_rf_loss_started
- t+35.707s node 3: drone_debug_status assigned_telemetry
- t+41.803s node 3: drone_debug_event join_runtime_reset
- t+41.803s node 3: drone_debug_status backoff
- t+152.018s node 6: drone_debug_event telemetry_rf_loss_started
- t+152.018s node 6: drone_debug_status assigned_telemetry
- t+158.096s node 6: drone_debug_event join_runtime_reset
- t+158.096s node 6: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 560
- Short-loss event counts: short_loss_guard_active=21, short_loss_guard_started=5, short_loss_guard_expired=3, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=9.0, max=9
- Recent short-loss events: t+159.110s node 6 short_loss_guard_active miss=2 gap=-; t+160.028s node 6 short_loss_guard_active miss=3 gap=-; t+160.947s node 6 short_loss_guard_active miss=4 gap=-; t+161.871s node 6 short_loss_guard_active miss=5 gap=-; t+162.790s node 6 short_loss_guard_started miss=6 gap=-; t+163.979s node 6 short_loss_guard_active miss=7 gap=-; t+164.899s node 6 short_loss_guard_active miss=8 gap=-; t+165.818s node 6 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=30, owed_rx_selected=29, owed_rx_cleared=28, owed_rx_missed=9
- Scheduler-caused skips by node: 3=14, 6=16
- Owed selections by node: 3=14, 6=15
- Owed listens that still missed by node: 3=9
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+181.246s node 3 owed_rx_cleared owed=1 skips=1; t+181.259s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+181.456s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+181.456s node 6 owed_rx_cleared owed=1 skips=1; t+181.638s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+181.638s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+181.650s node 3 owed_rx_cleared owed=1 skips=1; t+181.664s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+181.851s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+181.865s node 6 owed_rx_cleared owed=1 skips=1

## Telemetry Coverage
- Latest status at t+9.155s: mode `telemetry_first`
- Assigned packets received: 0
- Assigned RX coverage: 0%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 20
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 36
- node 6: t+35.487s seq 38 -> t+35.787s seq 40; missing [39]
- node 6: t+35.787s seq 40 -> t+38.169s seq 51; missing [41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
- node 6: t+41.931s seq 70 -> t+44.271s seq 82; missing [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81]
- node 6: t+151.984s seq 109 -> t+154.072s seq 119; missing [110, 111, 112, 113, 114, 115, 116, 117, 118]
- node 6: t+158.180s seq 139 -> t+176.442s seq 3; missing [140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, +17 more]
- node 6: t+176.442s seq 3 -> t+176.706s seq 5; missing [4]
- node 6: t+176.706s seq 5 -> t+177.071s seq 7; missing [6]
- node 6: t+177.071s seq 7 -> t+177.467s seq 9; missing [8]
- node 6: t+177.467s seq 9 -> t+177.863s seq 11; missing [10]
- node 6: t+177.863s seq 11 -> t+178.277s seq 13; missing [12]
- node 6: t+178.277s seq 13 -> t+178.663s seq 15; missing [14]
- node 6: t+178.663s seq 15 -> t+179.069s seq 17; missing [16]

## State Flicker
- Node 6: 1 rapid state transitions: t+167.233s offline->off

## Event Counts
- drone_telemetry: 724
- telemetry_rebind_event: 560
- scanner_event: 247
- inter_gc_status: 110
- search_event: 90
- assignment_event: 47
- bind_progress_event: 39
- assignments: 16
- bench_marker: 14
- command: 11
- command_ack: 11
- drone_debug_status: 8
- drone_link_status: 8
- drone_debug_event: 6
- assignment_timing_hint: 4
- drone_join_event: 4
- drone_live_status: 2
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
