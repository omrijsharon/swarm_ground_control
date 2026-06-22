# Live Debug Log Summary

- Source: `logs_summary\startup_broken_link_3node_after_shortloss_throttle_20260622.jsonl`
- Parsed records: 1140
- Approx duration: 67.9s

## Commands
- Sent commands: 13
- ACKs: 13 (0 rejected)
- Derived ACK latency: min 18 ms, max 234 ms, avg 72 ms
- Inter-GC queued command events: 2
- t+12.678s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+12.828s ACK drone/drone debug_reboot accepted: -
- t+12.868s ACK drone/drone debug_reboot accepted: -
- t+12.895s ACK drone/drone debug_reboot accepted: -
- t+35.217s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+41.281s ACK drone/drone debug_restart_join accepted: -
- t+51.589s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+57.660s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 38
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
- Search events: 16
- Bind progress events: 48
- Assignment events: 53
- Assignment event counts: telemetry_period_observed=9, telemetry_period_locked=9, join_request_received=5, post_bind_first_telemetry=5, silence_sent=5, assign_sent=5, join_ack_received=5, post_bind_acquire_started=5, assign_created=3, assign_reused=2
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=10, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+12.895s to t+63.866s
- t+46.950s node 3: timing - telemetry_period_observed
- t+46.966s node 3: telemetry_bind - telemetry_live
- t+47.185s node 3: telemetry_bind - assignment_completed
- t+47.216s node 3: complete - telemetry_period_locked
- t+62.810s node 6: timing - telemetry_period_observed
- t+62.831s node 6: telemetry_bind - telemetry_live
- t+63.069s node 6: quiet - join_request_received
- t+63.081s node 6: complete - telemetry_period_locked
- t+63.182s node 6: quiet - assign_reused
- t+63.182s node 6: assign - silence_sent
- t+63.379s node 6: ack - assign_sent
- t+63.568s node 6: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=10, first_telemetry=10, timeouts=0
- node 2
- node 3; ACK->telemetry -29.698s; acquire->telemetry -29.698s
- node 6; ACK->telemetry -16.763s; acquire->telemetry -16.763s
- node 7; ACK->telemetry -23.516s; acquire->telemetry -23.516s

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 17
- Drone telemetry rows: 283
- t+12.868s node 6: drone_debug_event reboot_scheduled
- t+12.868s node 6: drone_debug_status assigned_telemetry
- t+12.895s node 7: drone_debug_event reboot_scheduled
- t+12.895s node 7: drone_debug_status assigned_telemetry
- t+35.216s node 3: drone_debug_event telemetry_rf_loss_started
- t+35.217s node 3: drone_debug_status assigned_telemetry
- t+41.281s node 3: drone_debug_event join_runtime_reset
- t+41.281s node 3: drone_debug_status backoff
- t+51.589s node 6: drone_debug_event telemetry_rf_loss_started
- t+51.592s node 6: drone_debug_status assigned_telemetry
- t+57.660s node 6: drone_debug_event join_runtime_reset
- t+57.660s node 6: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 20
- Short-loss event counts: short_loss_guard_active=9, short_loss_guard_started=3, short_loss_recovered=2
- Short-loss recovered observed gaps: count=2, avg=120.5, max=229
- Recent short-loss events: t+37.582s node 3 short_loss_guard_active miss=3 gap=-; t+38.595s node 3 short_loss_recovered miss=3 gap=12; t+41.450s node 3 short_loss_guard_started miss=1 gap=-; t+42.585s node 3 short_loss_guard_active miss=2 gap=-; t+43.585s node 3 short_loss_guard_active miss=3 gap=-; t+44.582s node 3 short_loss_guard_active miss=4 gap=-; t+45.583s node 3 short_loss_guard_active miss=5 gap=-; t+46.416s node 3 short_loss_recovered miss=5 gap=229

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=105, rx_candidate_skipped=85, owed_rx_cleared=78, owed_rx_missed=26
- Scheduler-caused skips by node: 3=1, 6=65, 7=19
- Owed selections by node: 6=89, 7=16
- Owed listens that still missed by node: 6=26
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+66.369s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+66.579s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+66.580s node 6 owed_rx_cleared owed=1 skips=1; t+66.870s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+67.065s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+67.179s node 6 owed_rx_cleared owed=1 skips=1; t+67.392s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+67.576s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+67.576s node 6 owed_rx_cleared owed=1 skips=1; t+67.865s node 6 rx_candidate_skipped selected=7 owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 1/2
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 5970 | 115.6 | - |
| 6 | 9 | no | 5943.9 | 225.2 | non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.282s: mode `telemetry_first`
- Assigned packets received: 28
- Assigned RX coverage: 48%
- Sequence gap events: 24
- Missing sequence IDs: 63
- Max sequence gap: 14
- Assigned slot misses: 30
- Non-assigned preemptions: 0
- Owed RX active: True node=6 count=1
- Fairness skips: 4
- Owed selections: 3
- Owed misses: 0
- Max scheduler skips: 2
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 155
- node 6: t+4.318s seq 190 -> t+4.968s seq 192; missing [191]
- node 6: t+4.968s seq 192 -> t+8.628s seq 207; missing [193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206]
- node 6: t+8.628s seq 207 -> t+9.145s seq 209; missing [208]
- node 6: t+9.145s seq 209 -> t+9.562s seq 211; missing [210]
- node 6: t+9.562s seq 211 -> t+10.396s seq 214; missing [212, 213]
- node 6: t+10.396s seq 214 -> t+11.262s seq 217; missing [215, 216]
- node 6: t+11.262s seq 217 -> t+11.645s seq 219; missing [218]
- node 6: t+11.645s seq 219 -> t+12.351s seq 222; missing [220, 221]
- node 6: t+12.351s seq 222 -> t+20.618s seq 2; missing [223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, +17 more]
- node 6: t+27.639s seq 30 -> t+28.346s seq 33; missing [31, 32]
- node 6: t+28.346s seq 33 -> t+28.853s seq 35; missing [34]
- node 6: t+28.853s seq 35 -> t+29.354s seq 37; missing [36]

## State Flicker
- Node 3: 2 rapid state transitions: t+35.258s locking->online, t+47.250s locking->online
- Node 6: 3 rapid state transitions: t+4.318s offline->online, t+20.900s locking->online, t+63.149s locking->online
- Node 7: 2 rapid state transitions: t+4.668s offline->online, t+28.233s locking->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 446
- drone_telemetry: 283
- assignment_event: 53
- bind_progress_event: 48
- inter_gc_status: 38
- assignments: 24
- drone_link_status: 22
- telemetry_rebind_event: 20
- search_event: 16
- bench_marker: 15
- command: 13
- command_ack: 13
- drone_debug_status: 10
- assignment_timing_hint: 9
- drone_debug_event: 7
- drone_join_event: 4
- drone_live_status: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
