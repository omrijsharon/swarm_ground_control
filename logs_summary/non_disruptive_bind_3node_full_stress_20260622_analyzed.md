# Live Debug Log Summary

- Source: `logs_summary\non_disruptive_bind_3node_full_stress_20260622.jsonl`
- Parsed records: 1633
- Approx duration: 94.7s

## Commands
- Sent commands: 23
- ACKs: 23 (0 rejected)
- Derived ACK latency: min 17 ms, max 402 ms, avg 144 ms
- Inter-GC queued command events: 12
- t+45.231s ACK magc/magic_ground_control start_search accepted: -
- t+46.449s ACK magc/magic_ground_control cancel_search accepted: -
- t+47.151s ACK magc/magic_ground_control start_search accepted: -
- t+48.405s ACK magc/magic_ground_control cancel_search accepted: -
- t+55.299s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+66.859s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+78.465s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+84.525s ACK drone/drone debug_restart_join accepted: -

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
- Suspicious JSON fragment lines: 2
- Fragment samples: t+0.213s telegc: l","nodeId":2,"frequencyMhz":906.5,"channelESP-ROM:esp32s3-20210327; t+46.850s telegc: 1,"type":"assignments_clear","source":"magc","sentAtUs":113414778,"assignmentRevision":104852,"activeCount":3,"{"schemaV

## Bind And Search
- Search events: 23
- Bind progress events: 90
- Assignment events: 94
- Assignment event counts: telemetry_period_observed=29, post_bind_first_telemetry=26, telemetry_period_locked=15, join_request_received=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, assign_reused=1
- Operator shared/discovery RX: starts=5, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+39.926s to t+47.453s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=7, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+13.080s to t+90.447s
- t+49.530s node 6: telemetry_bind - telemetry_live
- t+49.734s node 7: complete - telemetry_period_locked
- t+50.156s node 3: complete - telemetry_period_locked
- t+50.501s node 6: complete - telemetry_period_locked
- t+89.413s node 3: quiet - join_request_received
- t+89.673s node 3: timing - telemetry_period_observed
- t+89.684s node 3: telemetry_bind - telemetry_live
- t+89.909s node 3: quiet - assign_reused
- t+89.909s node 3: assign - silence_sent
- t+89.950s node 3: ack - assign_sent
- t+90.165s node 3: telemetry_bind - assignment_completed
- t+90.166s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=52, timeouts=0
- node 2
- node 3; ACK->telemetry -16.967s; acquire->telemetry -17.100s
- node 6; ACK->telemetry -34.336s; acquire->telemetry -34.438s
- node 7; ACK->telemetry -0.154s; acquire->telemetry -0.154s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 17
- Drone telemetry rows: 382
- t+13.194s node 6: drone_debug_event reboot_scheduled
- t+13.194s node 6: drone_debug_status assigned_telemetry
- t+13.269s node 7: drone_debug_event reboot_scheduled
- t+13.269s node 7: drone_debug_status wait_assignment
- t+55.299s node 3: drone_debug_event telemetry_rf_loss_started
- t+55.299s node 3: drone_debug_status assigned_telemetry
- t+66.859s node 6: drone_debug_event telemetry_rf_loss_started
- t+66.859s node 6: drone_debug_status assigned_telemetry
- t+78.465s node 3: drone_debug_event telemetry_rf_loss_started
- t+78.465s node 3: drone_debug_status assigned_telemetry
- t+84.525s node 3: drone_debug_event join_runtime_reset
- t+84.525s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 53
- Short-loss event counts: short_loss_guard_active=21, short_loss_guard_started=4, short_loss_recovered=2, short_loss_guard_expired=2
- Short-loss recovered observed gaps: count=2, avg=5.5, max=9
- Recent short-loss events: t+85.159s node 3 short_loss_guard_active miss=2 gap=-; t+85.407s node 3 short_loss_guard_active miss=3 gap=-; t+85.654s node 3 short_loss_guard_active miss=4 gap=-; t+85.912s node 3 short_loss_guard_active miss=5 gap=-; t+86.157s node 3 short_loss_guard_active miss=6 gap=-; t+86.401s node 3 short_loss_guard_active miss=7 gap=-; t+86.661s node 3 short_loss_guard_active miss=8 gap=-; t+86.907s node 3 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=104, rx_candidate_skipped=101, owed_rx_cleared=88, owed_rx_missed=21
- Scheduler-caused skips by node: 2=5, 3=88, 6=1, 7=7
- Owed selections by node: 3=96, 6=1, 7=7
- Owed listens that still missed by node: 3=21
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+93.158s node 3 owed_rx_cleared owed=1 skips=1; t+93.444s node 3 rx_candidate_skipped selected=7 owed=1 skips=1; t+93.665s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+93.665s node 3 owed_rx_cleared owed=1 skips=1; t+93.940s node 3 rx_candidate_skipped selected=7 owed=1 skips=1; t+94.157s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+94.157s node 3 owed_rx_cleared owed=1 skips=1; t+94.447s node 3 rx_candidate_skipped selected=7 owed=1 skips=1; t+94.647s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+94.667s node 3 owed_rx_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 15941.7 | no | node_6_affected_by_bind,node_7_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 1/2
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | no | - | non_target_3_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 5722.4 | 161.9 | non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.285s: mode `telemetry_first`
- Assigned packets received: 7
- Assigned RX coverage: 14%
- Sequence gap events: 3
- Missing sequence IDs: 10
- Max sequence gap: 8
- Assigned slot misses: 43
- Non-assigned preemptions: 0
- Owed RX active: True node=2 count=3
- Fairness skips: 4
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 3
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 262
- node 3: t+4.069s seq 162 -> t+4.598s seq 164; missing [163]
- node 3: t+4.598s seq 164 -> t+20.654s seq 1; missing [165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, +17 more]
- node 3: t+30.169s seq 39 -> t+30.765s seq 41; missing [40]
- node 3: t+30.765s seq 41 -> t+31.165s seq 43; missing [42]
- node 3: t+31.165s seq 43 -> t+31.667s seq 45; missing [44]
- node 3: t+31.667s seq 45 -> t+32.166s seq 47; missing [46]
- node 3: t+32.166s seq 47 -> t+32.667s seq 49; missing [48]
- node 3: t+32.667s seq 49 -> t+33.172s seq 51; missing [50]
- node 3: t+33.172s seq 51 -> t+33.661s seq 53; missing [52]
- node 3: t+33.661s seq 53 -> t+34.170s seq 55; missing [54]
- node 3: t+34.170s seq 55 -> t+34.672s seq 57; missing [56]
- node 3: t+34.672s seq 57 -> t+35.175s seq 59; missing [58]

## Transport Findings
- Suspicious JSON fragments: 2.

## State Flicker
- Node 2: 1 rapid state transitions: t+4.387s offline->online
- Node 3: 1 rapid state transitions: t+4.069s offline->online
- Node 6: 1 rapid state transitions: t+4.671s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 594
- drone_telemetry: 382
- assignment_event: 94
- bind_progress_event: 90
- inter_gc_status: 57
- assignments: 54
- telemetry_rebind_event: 53
- drone_link_status: 33
- bench_marker: 23
- command: 23
- command_ack: 23
- search_event: 23
- assignment_timing_hint: 15
- gc_status: 12
- inter_gc_command_queued: 12
- drone_debug_status: 10
- drone_debug_event: 7
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
