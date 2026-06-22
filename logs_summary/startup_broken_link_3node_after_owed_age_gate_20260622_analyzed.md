# Live Debug Log Summary

- Source: `logs_summary\startup_broken_link_3node_after_owed_age_gate_20260622.jsonl`
- Parsed records: 1349
- Approx duration: 88.8s

## Commands
- Sent commands: 15
- ACKs: 15 (0 rejected)
- Derived ACK latency: min 21 ms, max 306 ms, avg 97 ms
- Inter-GC queued command events: 2
- t+12.984s ACK drone/drone debug_reboot accepted: -
- t+13.050s ACK drone/drone debug_reboot accepted: -
- t+39.048s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+45.183s ACK drone/drone debug_restart_join accepted: -
- t+56.087s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+62.279s ACK drone/drone debug_restart_join accepted: -
- t+72.369s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+78.429s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 57
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 1
- Fragment samples: t+30.826s telegc: magic_ground_control","reason":"shared_join_seen",{"schemaVersion":1,"type":"hello","source":"magc","sentAtUs":44905231,

## Bind And Search
- Search events: 19
- Bind progress events: 54
- Assignment events: 60
- Assignment event counts: telemetry_period_observed=9, telemetry_period_locked=9, join_request_received=6, post_bind_first_telemetry=6, silence_sent=6, assign_sent=6, join_ack_received=6, post_bind_acquire_started=6, assign_created=3, assign_reused=3
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=11, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+12.994s to t+84.567s
- t+67.573s node 6: assign - silence_sent
- t+67.606s node 6: complete - telemetry_period_locked
- t+67.695s node 6: ack - assign_sent
- t+67.870s node 6: telemetry_bind - assignment_completed
- t+83.515s node 7: timing - telemetry_period_observed
- t+83.528s node 7: telemetry_bind - telemetry_live
- t+83.745s node 7: quiet - join_request_received
- t+83.770s node 7: complete - telemetry_period_locked
- t+83.863s node 7: quiet - assign_reused
- t+83.992s node 7: assign - silence_sent
- t+84.076s node 7: ack - assign_sent
- t+84.266s node 7: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=12, first_telemetry=12, timeouts=0
- node 3; ACK->telemetry -34.648s; acquire->telemetry -34.855s
- node 6; ACK->telemetry -25.521s; acquire->telemetry -25.521s
- node 7; ACK->telemetry -16.104s; acquire->telemetry -16.349s

## Drone Debug
- Drone JOIN events: 6
- JOIN event counts: join_start_shared_channel=3, join_backoff=3
- JOIN backoff kinds: first_fast=3
- Drone debug events/status rows: 21
- Drone telemetry rows: 414
- t+39.048s node 3: drone_debug_event telemetry_rf_loss_started
- t+39.048s node 3: drone_debug_status assigned_telemetry
- t+45.183s node 3: drone_debug_event join_runtime_reset
- t+45.184s node 3: drone_debug_status backoff
- t+56.087s node 6: drone_debug_event telemetry_rf_loss_started
- t+56.087s node 6: drone_debug_status assigned_telemetry
- t+62.279s node 6: drone_debug_event join_runtime_reset
- t+62.279s node 6: drone_debug_status backoff
- t+72.368s node 7: drone_debug_event telemetry_rf_loss_started
- t+72.369s node 7: drone_debug_status assigned_telemetry
- t+78.429s node 7: drone_debug_event join_runtime_reset
- t+78.430s node 7: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 30
- Short-loss event counts: short_loss_guard_active=16, short_loss_guard_started=8, short_loss_recovered=6
- Short-loss recovered observed gaps: count=6, avg=12.8, max=24
- Recent short-loss events: t+73.288s node 7 short_loss_guard_started miss=1 gap=-; t+74.327s node 7 short_loss_guard_active miss=2 gap=-; t+75.273s node 7 short_loss_recovered miss=2 gap=11; t+79.285s node 7 short_loss_guard_started miss=1 gap=-; t+80.327s node 7 short_loss_guard_active miss=2 gap=-; t+81.327s node 7 short_loss_guard_active miss=3 gap=-; t+82.327s node 7 short_loss_guard_active miss=4 gap=-; t+83.248s node 7 short_loss_recovered miss=4 gap=24

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=105, rx_candidate_skipped=103, owed_rx_cleared=95, owed_rx_missed=16
- Scheduler-caused skips by node: 3=6, 6=29, 7=68
- Owed selections by node: 3=3, 6=31, 7=71
- Owed listens that still missed by node: 6=6, 7=10
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+87.268s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+87.268s node 7 owed_rx_cleared owed=1 skips=1; t+87.569s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+87.769s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+87.769s node 7 owed_rx_cleared owed=1 skips=1; t+88.069s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+88.269s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+88.270s node 7 owed_rx_cleared owed=1 skips=1; t+88.569s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+88.762s node 7 owed_rx_selected selected=7 owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 3/3
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 6332.1 | 551.2 | - |
| 6 | 9 | yes | 5805.3 | 298.3 | - |
| 7 | 9 | yes | 5868.1 | 192.1 | - |

## Telemetry Coverage
- Latest status at t+12.317s: mode `telemetry_first`
- Assigned packets received: 56
- Assigned RX coverage: 87%
- Sequence gap events: 35
- Missing sequence IDs: 40
- Max sequence gap: 3
- Assigned slot misses: 8
- Non-assigned preemptions: 0
- Owed RX active: True node=6 count=1
- Fairness skips: 14
- Owed selections: 13
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 256
- node 6: t+4.033s seq 236 -> t+4.641s seq 239; missing [237, 238]
- node 6: t+4.641s seq 239 -> t+5.700s seq 243; missing [240, 241, 242]
- node 6: t+5.700s seq 243 -> t+6.199s seq 245; missing [244]
- node 6: t+6.199s seq 245 -> t+6.690s seq 247; missing [246]
- node 6: t+6.690s seq 247 -> t+7.195s seq 249; missing [248]
- node 6: t+7.195s seq 249 -> t+7.685s seq 251; missing [250]
- node 6: t+7.685s seq 251 -> t+8.195s seq 253; missing [252]
- node 6: t+8.195s seq 253 -> t+8.698s seq 255; missing [254]
- node 6: t+8.698s seq 255 -> t+9.186s seq 1; missing [0]
- node 6: t+9.186s seq 1 -> t+9.695s seq 3; missing [2]
- node 6: t+9.695s seq 3 -> t+10.200s seq 5; missing [4]
- node 6: t+10.200s seq 5 -> t+10.694s seq 7; missing [6]

## Transport Findings
- Suspicious JSON fragments: 1.

## State Flicker
- Node 3: 2 rapid state transitions: t+38.914s locking->online, t+50.964s locking->online
- Node 6: 3 rapid state transitions: t+4.033s offline->online, t+29.733s locking->online, t+67.620s locking->online
- Node 7: 3 rapid state transitions: t+4.912s offline->online, t+21.083s locking->online, t+83.863s locking->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 460
- drone_telemetry: 414
- assignment_event: 60
- inter_gc_status: 57
- bind_progress_event: 54
- telemetry_rebind_event: 30
- assignments: 25
- drone_link_status: 23
- search_event: 19
- bench_marker: 18
- command: 15
- command_ack: 15
- drone_debug_status: 12
- assignment_timing_hint: 9
- drone_debug_event: 9
- drone_join_event: 6
- drone_live_status: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
