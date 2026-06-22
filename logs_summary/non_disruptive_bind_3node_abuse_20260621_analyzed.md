# Live Debug Log Summary

- Source: `logs_summary\non_disruptive_bind_3node_abuse_20260621.jsonl`
- Parsed records: 8265
- Approx duration: 368.9s

## Commands
- Sent commands: 30
- ACKs: 30 (0 rejected)
- Derived ACK latency: min 24 ms, max 340 ms, avg 117 ms
- Inter-GC queued command events: 8
- t+162.939s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+175.460s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+187.967s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+194.086s ACK drone/drone debug_restart_join accepted: -
- t+204.924s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+211.012s ACK drone/drone debug_restart_join accepted: -
- t+237.214s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+243.304s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 126
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 2
- Fragment samples: t+35.058s telegc: Id":2,"reason":"ack_not_received","frequencyMhz":906.5,"channelI{"type":"assignment_event","event":"silence_sent","sourc; t+74.658s telegc: metry_rebind_event","event":"accepted","sourceRole":"magic_ground_control","nodeId":7,"reason":"missed_tst","gcMill{"typ

## Bind And Search
- Search events: 59
- Bind progress events: 88
- Assignment events: 94
- Assignment event counts: telemetry_period_observed=24, post_bind_first_telemetry=24, telemetry_period_locked=9, silence_sent=7, assign_sent=7, join_request_received=6, join_ack_received=5, post_bind_acquire_started=5, assign_created=4, assign_reused=2, join_ack_timeout=1
- Operator shared RX: starts=0, active_ticks=0, completes=0
- Operator shared RX window observed: t+51.305s to t+55.309s
- JOINs received during operator shared RX: 0
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=38
- Auto shared RX scanner events: 22
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+13.209s to t+64.263s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+199.242s node 3: assign - silence_sent
- t+199.243s node 3: ack - assign_sent
- t+199.299s node 3: telemetry_bind - assignment_completed
- t+199.499s node 3: complete - telemetry_period_locked
- t+216.705s node 6: quiet - join_request_received
- t+216.757s node 6: quiet - assign_reused
- t+216.757s node 6: assign - silence_sent
- t+216.757s node 6: ack - assign_sent
- t+216.821s node 6: telemetry_bind - assignment_completed
- t+216.919s node 6: timing - telemetry_period_observed
- t+216.931s node 6: telemetry_bind - telemetry_live
- t+249.681s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=10, first_telemetry=48, timeouts=0
- node 2
- node 3; ACK->telemetry -0.149s; acquire->telemetry -0.150s
- node 6; ACK->telemetry -40.426s; acquire->telemetry -40.473s
- node 7; ACK->telemetry -0.220s; acquire->telemetry -0.280s

## Drone Debug
- Drone JOIN events: 6
- JOIN event counts: join_start_shared_channel=3, join_backoff=3
- JOIN backoff kinds: first_fast=3
- Drone debug events/status rows: 39
- Drone telemetry rows: 1295
- t+187.967s node 3: drone_debug_event telemetry_rf_loss_started
- t+187.967s node 3: drone_debug_status assigned_telemetry
- t+194.086s node 3: drone_debug_event join_runtime_reset
- t+194.086s node 3: drone_debug_status backoff
- t+204.924s node 6: drone_debug_event telemetry_rf_loss_started
- t+204.925s node 6: drone_debug_status assigned_telemetry
- t+211.012s node 6: drone_debug_event join_runtime_reset
- t+211.013s node 6: drone_debug_status backoff
- t+237.214s node 7: drone_debug_event telemetry_rf_loss_started
- t+237.215s node 7: drone_debug_status assigned_telemetry
- t+243.304s node 7: drone_debug_event join_runtime_reset
- t+243.304s node 7: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 436
- Short-loss event counts: short_loss_guard_active=82, short_loss_guard_started=23, short_loss_recovered=11, short_loss_guard_expired=9
- Short-loss recovered observed gaps: count=11, avg=3.1, max=7
- Recent short-loss events: t+250.325s node 7 short_loss_guard_active miss=3 gap=-; t+250.520s node 7 short_loss_guard_active miss=4 gap=-; t+250.605s node 7 short_loss_guard_active miss=5 gap=-; t+250.847s node 7 short_loss_guard_active miss=6 gap=-; t+251.020s node 7 short_loss_guard_active miss=7 gap=-; t+251.105s node 7 short_loss_guard_active miss=8 gap=-; t+251.347s node 7 short_loss_guard_expired miss=9 gap=-; t+341.885s node 2 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=905, owed_rx_missed=700, rx_candidate_skipped=649, owed_rx_cleared=64
- Scheduler-caused skips by node: 2=30, 3=260, 6=350, 7=9
- Owed selections by node: 2=372, 3=401, 6=125, 7=7
- Owed listens that still missed by node: 2=14, 6=3, 7=683
- Max consecutive scheduler skips observed: 255
- Recent fairness events: t+368.291s node 6 owed_rx_selected selected=6 owed=3 skips=255; t+368.358s node 7 owed_rx_missed owed=1 skips=1; t+368.505s node 3 owed_rx_selected selected=3 owed=3 skips=221; t+368.517s node 7 owed_rx_missed owed=1 skips=1; t+368.543s node 6 owed_rx_selected selected=6 owed=3 skips=255; t+368.610s node 7 owed_rx_missed owed=1 skips=1; t+368.756s node 3 owed_rx_selected selected=3 owed=3 skips=221; t+368.769s node 7 owed_rx_missed owed=1 skips=1; t+368.794s node 6 owed_rx_selected selected=6 owed=3 skips=255; t+368.860s node 7 owed_rx_missed owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 10109.7 | no | node_7_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 9/9
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | yes | - | - |
| 3 | 4 | 1 | yes | - | - |
| 6 | 4 | 1 | yes | - | - |
| 7 | 4 | 1 | yes | - | - |
| 3 | 8 | 1 | yes | - | - |
| 6 | 8 | 1 | yes | - | - |
| 7 | 8 | 1 | yes | - | - |

## Multi-Drone Broken-Link Markers
- Pass: 2/3
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 5526 | 339.1 | - |
| 6 | 9 | yes | 5932.5 | 174.6 | - |
| 7 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join,non_target_3_not_stable,non_target_6_not_stable |

## Telemetry Coverage
- Latest status at t+12.442s: mode `telemetry_first`
- Assigned packets received: 2
- Assigned RX coverage: 3%
- Sequence gap events: 1
- Missing sequence IDs: 1
- Max sequence gap: 1
- Assigned slot misses: 52
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 1093
- node 6: t+4.041s seq 246 -> t+4.352s seq 248; missing [247]
- node 6: t+4.352s seq 248 -> t+44.198s seq 3; missing [249, 250, 251, 252, 253, 254, 255, 0, 1, 2]
- node 6: t+44.198s seq 3 -> t+44.703s seq 5; missing [4]
- node 6: t+44.916s seq 6 -> t+45.557s seq 8; missing [7]
- node 6: t+45.557s seq 8 -> t+46.313s seq 11; missing [9, 10]
- node 6: t+46.313s seq 11 -> t+47.025s seq 14; missing [12, 13]
- node 6: t+47.025s seq 14 -> t+47.806s seq 17; missing [15, 16]
- node 6: t+47.806s seq 17 -> t+48.565s seq 20; missing [18, 19]
- node 6: t+48.565s seq 20 -> t+49.272s seq 23; missing [21, 22]
- node 6: t+49.272s seq 23 -> t+50.184s seq 27; missing [24, 25, 26]
- node 6: t+50.491s seq 28 -> t+51.689s seq 33; missing [29, 30, 31, 32]
- node 6: t+51.689s seq 33 -> t+53.708s seq 41; missing [34, 35, 36, 37, 38, 39, 40]

## Transport Findings
- Suspicious JSON fragments: 2.

## State Flicker
- Node 6: 3 rapid state transitions: t+214.065s locking->weak, t+215.351s weak->offline, t+215.712s offline->online
- Node 7: 3 rapid state transitions: t+253.228s offline->locking, t+253.385s locking->weak, t+254.666s weak->offline

## Terminal State Over Recent Telemetry
- t+214.065s node 6: link state `weak` 2.954s after telemetry
- t+215.351s node 6: link state `offline` 4.240s after telemetry

## Event Counts
- scanner_event: 5749
- drone_telemetry: 1295
- telemetry_rebind_event: 436
- inter_gc_status: 126
- assignment_event: 94
- bind_progress_event: 88
- search_event: 59
- assignments: 57
- bench_marker: 42
- drone_link_status: 40
- command: 30
- command_ack: 30
- drone_debug_status: 21
- drone_debug_event: 18
- assignment_timing_hint: 9
- gc_status: 8
- inter_gc_command_queued: 8
- drone_join_event: 6
- drone_live_status: 3
- session_event: 2
