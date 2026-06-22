# Live Debug Log Summary

- Source: `logs_summary\non_disruptive_bind_3node_full_stress_after_scheduler_fixes_20260622.jsonl`
- Parsed records: 3046
- Approx duration: 200.2s

## Commands
- Sent commands: 31
- ACKs: 31 (0 rejected)
- Derived ACK latency: min 19 ms, max 264 ms, avg 104 ms
- Inter-GC queued command events: 12
- t+97.449s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+109.003s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+140.447s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+146.521s ACK drone/drone debug_restart_join accepted: -
- t+158.576s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+164.621s ACK drone/drone debug_restart_join accepted: -
- t+178.806s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+184.881s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 96
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
- Search events: 63
- Bind progress events: 112
- Assignment events: 118
- Assignment event counts: telemetry_period_observed=32, post_bind_first_telemetry=32, telemetry_period_locked=18, join_request_received=6, silence_sent=6, assign_sent=6, join_ack_received=6, post_bind_acquire_started=6, assign_created=3, assign_reused=3
- Operator shared/discovery RX: starts=5, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+36.157s to t+43.649s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=36
- Auto shared RX scanner events: 1
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+12.943s to t+49.378s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+174.406s node 6: telemetry_bind - assignment_completed
- t+174.417s node 6: timing - telemetry_period_observed
- t+174.443s node 6: telemetry_bind - telemetry_live
- t+174.691s node 6: complete - telemetry_period_locked
- t+195.560s node 7: quiet - join_request_received
- t+195.607s node 7: quiet - assign_reused
- t+195.607s node 7: assign - silence_sent
- t+195.636s node 7: ack - assign_sent
- t+195.691s node 7: telemetry_bind - assignment_completed
- t+195.741s node 7: timing - telemetry_period_observed
- t+195.754s node 7: telemetry_bind - telemetry_live
- t+196.011s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=12, first_telemetry=64, timeouts=0
- node 3; ACK->telemetry -16.365s; acquire->telemetry -16.365s
- node 6; ACK->telemetry -23.241s; acquire->telemetry -23.334s
- node 7; ACK->telemetry -31.316s; acquire->telemetry -31.316s

## Drone Debug
- Drone JOIN events: 6
- JOIN event counts: join_start_shared_channel=3, join_backoff=3
- JOIN backoff kinds: first_fast=3
- Drone debug events/status rows: 33
- Drone telemetry rows: 1068
- t+140.447s node 3: drone_debug_event telemetry_rf_loss_started
- t+140.447s node 3: drone_debug_status assigned_telemetry
- t+146.521s node 3: drone_debug_event join_runtime_reset
- t+146.521s node 3: drone_debug_status backoff
- t+158.576s node 6: drone_debug_event telemetry_rf_loss_started
- t+158.577s node 6: drone_debug_status assigned_telemetry
- t+164.621s node 6: drone_debug_event join_runtime_reset
- t+164.622s node 6: drone_debug_status backoff
- t+178.806s node 7: drone_debug_event telemetry_rf_loss_started
- t+178.806s node 7: drone_debug_status assigned_telemetry
- t+184.881s node 7: drone_debug_event join_runtime_reset
- t+184.882s node 7: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 119
- Short-loss event counts: short_loss_guard_active=25, short_loss_guard_started=12, short_loss_recovered=8, short_loss_guard_expired=2
- Short-loss recovered observed gaps: count=8, avg=7.4, max=13
- Recent short-loss events: t+187.143s node 7 short_loss_guard_active miss=3 gap=-; t+188.142s node 7 short_loss_guard_active miss=4 gap=-; t+189.142s node 7 short_loss_guard_active miss=5 gap=-; t+190.143s node 7 short_loss_guard_active miss=6 gap=-; t+191.142s node 7 short_loss_guard_active miss=7 gap=-; t+192.142s node 7 short_loss_guard_active miss=8 gap=-; t+193.143s node 7 short_loss_guard_expired miss=9 gap=-; t+195.221s node 7 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=251, owed_rx_selected=249, owed_rx_cleared=240, owed_rx_missed=15
- Scheduler-caused skips by node: 3=206, 6=27, 7=18
- Owed selections by node: 3=210, 6=23, 7=16
- Owed listens that still missed by node: 3=15
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+198.682s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+198.889s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+198.889s node 3 owed_rx_cleared owed=1 skips=1; t+199.182s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+199.390s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+199.390s node 3 owed_rx_cleared owed=1 skips=1; t+199.682s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+199.890s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+199.890s node 3 owed_rx_cleared owed=1 skips=1; t+200.183s node 3 rx_candidate_skipped selected=6 owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 15711.2 | no | node_3_affected_by_bind,node_6_affected_by_bind,node_7_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 5/6
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | yes | - | - |
| 3 | 1 | 2 | yes | - | - |
| 6 | 1 | 2 | yes | - | - |
| 7 | 1 | 2 | no | - | non_target_6_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 3/3
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 7639.6 | 61 | - |
| 6 | 9 | yes | 9820.9 | 109.9 | - |
| 7 | 9 | yes | 10897.7 | 142.2 | - |

## Telemetry Coverage
- Latest status at t+12.324s: mode `telemetry_first`
- Assigned packets received: 48
- Assigned RX coverage: 100%
- Sequence gap events: 44
- Missing sequence IDs: 49
- Max sequence gap: 2
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Owed RX active: True node=7 count=1
- Fairness skips: 14
- Owed selections: 14
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 682
- node 7: t+3.911s seq 98 -> t+4.695s seq 101; missing [99, 100]
- node 7: t+4.695s seq 101 -> t+5.485s seq 104; missing [102, 103]
- node 7: t+5.485s seq 104 -> t+5.986s seq 106; missing [105]
- node 7: t+5.986s seq 106 -> t+6.487s seq 108; missing [107]
- node 7: t+6.487s seq 108 -> t+6.988s seq 110; missing [109]
- node 7: t+6.988s seq 110 -> t+7.488s seq 112; missing [111]
- node 7: t+7.488s seq 112 -> t+7.977s seq 114; missing [113]
- node 7: t+7.977s seq 114 -> t+8.479s seq 116; missing [115]
- node 7: t+8.479s seq 116 -> t+8.978s seq 118; missing [117]
- node 7: t+8.978s seq 118 -> t+9.479s seq 120; missing [119]
- node 7: t+9.479s seq 120 -> t+9.980s seq 122; missing [121]
- node 7: t+9.980s seq 122 -> t+10.480s seq 124; missing [123]

## State Flicker
- Node 3: 14 rapid state transitions: t+5.108s online->locking, t+5.384s locking->online, t+20.748s locking->online, t+36.705s locking->online, t+38.537s online->locking, t+38.825s locking->online, +8 more
- Node 6: 15 rapid state transitions: t+4.695s online->locking, t+5.107s locking->online, t+27.552s locking->online, t+37.486s locking->online, t+38.869s online->locking, t+39.918s locking->online, +9 more
- Node 7: 10 rapid state transitions: t+4.539s online->locking, t+4.695s locking->online, t+35.306s locking->online, t+42.281s locking->online, t+46.378s locking->online, t+194.454s offline->locking, +4 more

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 1068
- scanner_event: 1011
- telemetry_rebind_event: 119
- assignment_event: 118
- bind_progress_event: 112
- inter_gc_status: 96
- drone_link_status: 79
- search_event: 63
- assignments: 62
- bench_marker: 38
- command: 31
- command_ack: 31
- drone_debug_status: 18
- assignment_timing_hint: 18
- drone_debug_event: 15
- gc_status: 12
- inter_gc_command_queued: 12
- drone_join_event: 6
- drone_live_status: 3
- session_event: 2
