# Live Debug Log Summary

- Source: `logs_summary\startup_broken_link_3node_after_owed_protect_fix_20260622.jsonl`
- Parsed records: 837
- Approx duration: 52.7s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 15 ms, max 383 ms, avg 93 ms
- Inter-GC queued command events: 2
- t+12.226s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.366s ACK magc/magic_ground_control get_status accepted: -
- t+12.826s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+12.933s ACK drone/drone debug_reboot accepted: -
- t+12.991s ACK drone/drone debug_reboot accepted: -
- t+13.049s ACK drone/drone debug_reboot accepted: -
- t+36.331s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+42.416s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 21
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
- Search events: 13
- Bind progress events: 38
- Assignment events: 42
- Assignment event counts: telemetry_period_observed=7, telemetry_period_locked=7, join_request_received=4, post_bind_first_telemetry=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, assign_reused=1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=7, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+13.044s to t+48.398s
- t+35.981s node 3: telemetry_bind - telemetry_live
- t+36.083s node 3: ack - assign_sent
- t+36.209s node 3: telemetry_bind - assignment_completed
- t+36.348s node 3: complete - telemetry_period_locked
- t+47.697s node 3: quiet - join_request_received
- t+47.711s node 3: timing - telemetry_period_observed
- t+47.725s node 3: telemetry_bind - telemetry_live
- t+47.942s node 3: quiet - assign_reused
- t+47.942s node 3: assign - silence_sent
- t+47.958s node 3: ack - assign_sent
- t+47.981s node 3: complete - telemetry_period_locked
- t+48.209s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=8, timeouts=0
- node 3; ACK->telemetry -32.301s; acquire->telemetry -32.427s
- node 6; ACK->telemetry -16.952s; acquire->telemetry -16.952s
- node 7; ACK->telemetry -23.454s; acquire->telemetry -23.454s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 13
- Drone telemetry rows: 192
- t+0.145s node 6: drone_debug_status assigned_telemetry
- t+0.201s node 7: drone_debug_status assigned_telemetry
- t+12.933s node 3: drone_debug_event reboot_scheduled
- t+12.933s node 3: drone_debug_status assigned_telemetry
- t+12.991s node 6: drone_debug_event reboot_scheduled
- t+12.991s node 6: drone_debug_status assigned_telemetry
- t+13.049s node 7: drone_debug_event reboot_scheduled
- t+13.049s node 7: drone_debug_status assigned_telemetry
- t+36.331s node 3: drone_debug_event telemetry_rf_loss_started
- t+36.331s node 3: drone_debug_status assigned_telemetry
- t+42.416s node 3: drone_debug_event join_runtime_reset
- t+42.416s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 28
- Short-loss event counts: short_loss_guard_active=14, short_loss_guard_started=2, short_loss_guard_expired=2
- Recent short-loss events: t+42.817s node 3 short_loss_guard_active miss=2 gap=-; t+43.061s node 3 short_loss_guard_active miss=3 gap=-; t+43.315s node 3 short_loss_guard_active miss=4 gap=-; t+43.576s node 3 short_loss_guard_active miss=5 gap=-; t+43.818s node 3 short_loss_guard_active miss=6 gap=-; t+44.065s node 3 short_loss_guard_active miss=7 gap=-; t+44.314s node 3 short_loss_guard_active miss=8 gap=-; t+44.564s node 3 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=70, rx_candidate_skipped=62, owed_rx_cleared=56
- Scheduler-caused skips by node: 3=1, 6=40, 7=21
- Owed selections by node: 6=50, 7=20
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+51.631s node 6 owed_rx_cleared owed=1 skips=1; t+51.714s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+51.898s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+51.898s node 7 owed_rx_cleared owed=1 skips=1; t+52.116s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+52.116s node 6 owed_rx_cleared owed=1 skips=1; t+52.398s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+52.603s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+52.603s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+52.664s node 6 owed_rx_cleared owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 5793.7 | 96.6 | non_target_6_not_stable,non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.277s: mode `telemetry_first`
- Assigned packets received: 50
- Assigned RX coverage: 94%
- Sequence gap events: 47
- Missing sequence IDs: 50
- Max sequence gap: 2
- Assigned slot misses: 3
- Non-assigned preemptions: 0
- Owed RX active: True node=7 count=1
- Fairness skips: 15
- Owed selections: 14
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 138
- node 7: t+3.683s seq 246 -> t+4.362s seq 248; missing [247]
- node 7: t+4.362s seq 248 -> t+4.962s seq 251; missing [249, 250]
- node 7: t+4.962s seq 251 -> t+5.515s seq 253; missing [252]
- node 7: t+5.515s seq 253 -> t+6.016s seq 255; missing [254]
- node 7: t+6.016s seq 255 -> t+6.517s seq 1; missing [0]
- node 7: t+6.517s seq 1 -> t+7.017s seq 3; missing [2]
- node 7: t+7.017s seq 3 -> t+7.518s seq 5; missing [4]
- node 7: t+7.518s seq 5 -> t+8.018s seq 7; missing [6]
- node 7: t+8.018s seq 7 -> t+8.519s seq 9; missing [8]
- node 7: t+8.519s seq 9 -> t+9.018s seq 11; missing [10]
- node 7: t+9.018s seq 11 -> t+9.517s seq 13; missing [12]
- node 7: t+9.517s seq 13 -> t+10.018s seq 15; missing [14]

## State Flicker
- Node 3: 6 rapid state transitions: t+36.365s locking->online, t+45.600s locking->weak, t+46.892s weak->offline, t+47.353s offline->online, t+47.760s online->locking, t+47.997s locking->online
- Node 6: 2 rapid state transitions: t+4.165s offline->online, t+21.299s locking->online
- Node 7: 1 rapid state transitions: t+27.230s locking->online

## Terminal State Over Recent Telemetry
- t+45.600s node 3: link state `weak` 3.387s after telemetry
- t+46.892s node 3: link state `offline` 4.679s after telemetry

## Event Counts
- scanner_event: 294
- drone_telemetry: 192
- assignment_event: 42
- bind_progress_event: 38
- telemetry_rebind_event: 28
- inter_gc_status: 21
- drone_link_status: 20
- assignments: 19
- search_event: 13
- bench_marker: 11
- command: 11
- command_ack: 11
- drone_debug_status: 8
- assignment_timing_hint: 7
- drone_debug_event: 5
- drone_live_status: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
- drone_join_event: 2
