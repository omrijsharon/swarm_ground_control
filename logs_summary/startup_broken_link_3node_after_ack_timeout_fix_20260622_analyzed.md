# Live Debug Log Summary

- Source: `logs_summary\startup_broken_link_3node_after_ack_timeout_fix_20260622.jsonl`
- Parsed records: 1082
- Approx duration: 64.6s

## Commands
- Sent commands: 13
- ACKs: 13 (0 rejected)
- Derived ACK latency: min 20 ms, max 249 ms, avg 81 ms
- Inter-GC queued command events: 2
- t+12.688s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+12.832s ACK drone/drone debug_reboot accepted: -
- t+12.861s ACK drone/drone debug_reboot accepted: -
- t+12.904s ACK drone/drone debug_reboot accepted: -
- t+31.980s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+38.080s ACK drone/drone debug_restart_join accepted: -
- t+48.376s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+54.456s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 43
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
- Bind progress events: 44
- Assignment events: 49
- Assignment event counts: telemetry_period_observed=7, telemetry_period_locked=7, join_request_received=5, post_bind_first_telemetry=5, silence_sent=5, assign_sent=5, join_ack_received=5, post_bind_acquire_started=5, assign_created=3, assign_reused=2
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=5, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+12.904s to t+60.492s
- t+43.509s node 3: assign - silence_sent
- t+43.559s node 3: ack - assign_sent
- t+43.593s node 3: complete - telemetry_period_locked
- t+43.747s node 3: telemetry_bind - assignment_completed
- t+59.758s node 6: quiet - join_request_received
- t+59.808s node 6: quiet - assign_reused
- t+59.969s node 6: assign - silence_sent
- t+60.092s node 6: ack - assign_sent
- t+60.108s node 6: timing - telemetry_period_observed
- t+60.122s node 6: telemetry_bind - telemetry_live
- t+60.349s node 6: telemetry_bind - assignment_completed
- t+60.358s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=9, first_telemetry=10, timeouts=0
- node 3; ACK->telemetry 0.048s; acquire->telemetry 0.048s
- node 6; ACK->telemetry -28.021s; acquire->telemetry -28.257s
- node 7; ACK->telemetry -16.546s; acquire->telemetry -16.546s

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 17
- Drone telemetry rows: 320
- t+12.861s node 6: drone_debug_event reboot_scheduled
- t+12.861s node 6: drone_debug_status assigned_telemetry
- t+12.904s node 7: drone_debug_event reboot_scheduled
- t+12.904s node 7: drone_debug_status assigned_telemetry
- t+31.980s node 3: drone_debug_event telemetry_rf_loss_started
- t+31.980s node 3: drone_debug_status assigned_telemetry
- t+38.080s node 3: drone_debug_event join_runtime_reset
- t+38.080s node 3: drone_debug_status backoff
- t+48.376s node 6: drone_debug_event telemetry_rf_loss_started
- t+48.376s node 6: drone_debug_status assigned_telemetry
- t+54.456s node 6: drone_debug_event join_runtime_reset
- t+54.456s node 6: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 133
- Short-loss event counts: short_loss_guard_active=14, short_loss_guard_started=2, short_loss_guard_expired=2
- Recent short-loss events: t+49.025s node 6 short_loss_guard_active miss=2 gap=-; t+49.209s node 6 short_loss_guard_active miss=3 gap=-; t+49.276s node 6 short_loss_guard_active miss=4 gap=-; t+49.466s node 6 short_loss_guard_active miss=5 gap=-; t+49.523s node 6 short_loss_guard_active miss=6 gap=-; t+49.709s node 6 short_loss_guard_active miss=7 gap=-; t+49.776s node 6 short_loss_guard_active miss=8 gap=-; t+49.958s node 6 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=56, rx_candidate_skipped=47, owed_rx_cleared=39, owed_rx_missed=12
- Scheduler-caused skips by node: 3=4, 6=10, 7=33
- Owed selections by node: 3=2, 6=17, 7=37
- Owed listens that still missed by node: 6=12
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+63.092s node 7 owed_rx_cleared owed=1 skips=1; t+63.309s node 7 rx_candidate_skipped selected=3 owed=1 skips=1; t+63.495s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+63.594s node 7 owed_rx_cleared owed=1 skips=1; t+63.811s node 7 rx_candidate_skipped selected=3 owed=1 skips=1; t+63.992s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+64.091s node 7 owed_rx_cleared owed=1 skips=1; t+64.303s node 7 rx_candidate_skipped selected=3 owed=1 skips=1; t+64.494s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+64.494s node 7 owed_rx_cleared owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 1/2
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 5989.2 | 321.7 | - |
| 6 | 9 | no | 5690 | 50.9 | non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.277s: mode `telemetry_first`
- Assigned packets received: 66
- Assigned RX coverage: 97%
- Sequence gap events: 1
- Missing sequence IDs: 1
- Max sequence gap: 1
- Assigned slot misses: 2
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 81
- node 6: t+4.250s seq 133 -> t+4.899s seq 135; missing [134]
- node 6: t+12.225s seq 165 -> t+31.622s seq 2; missing [166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, +17 more]
- node 6: t+31.888s seq 3 -> t+33.353s seq 9; missing [4, 5, 6, 7, 8]
- node 6: t+33.844s seq 11 -> t+34.553s seq 13; missing [12]
- node 6: t+43.111s seq 48 -> t+43.853s seq 51; missing [49, 50]
- node 6: t+43.853s seq 51 -> t+44.356s seq 53; missing [52]
- node 6: t+44.356s seq 53 -> t+44.861s seq 55; missing [54]
- node 6: t+44.861s seq 55 -> t+45.359s seq 57; missing [56]
- node 6: t+45.359s seq 57 -> t+45.859s seq 59; missing [58]
- node 6: t+45.859s seq 59 -> t+46.359s seq 61; missing [60]
- node 6: t+46.359s seq 61 -> t+46.858s seq 63; missing [62]
- node 6: t+46.858s seq 63 -> t+47.359s seq 65; missing [64]

## State Flicker
- Node 3: 3 rapid state transitions: t+28.056s online->locking, t+28.244s locking->online, t+43.627s locking->online
- Node 6: 2 rapid state transitions: t+31.889s locking->online, t+60.408s locking->online
- Node 7: 2 rapid state transitions: t+4.199s offline->online, t+20.803s locking->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 320
- scanner_event: 256
- telemetry_rebind_event: 133
- assignment_event: 49
- bind_progress_event: 44
- inter_gc_status: 43
- assignments: 20
- drone_link_status: 18
- bench_marker: 15
- command: 13
- command_ack: 13
- search_event: 13
- drone_debug_status: 10
- assignment_timing_hint: 7
- drone_debug_event: 7
- drone_join_event: 4
- drone_live_status: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
