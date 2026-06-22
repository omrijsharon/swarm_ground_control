# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_channel_guard_3node_stress_20260622.jsonl`
- Parsed records: 3290
- Approx duration: 130.2s

## Commands
- Sent commands: 21
- ACKs: 21 (0 rejected)
- Derived ACK latency: min 23 ms, max 280 ms, avg 109 ms
- Inter-GC queued command events: 8
- t+37.988s ACK magc/magic_ground_control start_search accepted: -
- t+39.128s ACK magc/magic_ground_control cancel_search accepted: -
- t+44.052s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+55.542s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+67.021s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+85.958s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+112.432s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+118.552s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 89
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
- Search events: 19
- Bind progress events: 82
- Assignment events: 86
- Assignment event counts: telemetry_period_observed=23, post_bind_first_telemetry=19, telemetry_period_locked=15, telemetry_period_rejected=5, join_request_received=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, assign_reused=1
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+34.721s to t+38.528s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=8, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+11.088s to t+124.913s
- t+40.407s node 6: timing - telemetry_period_rejected
- t+40.672s node 3: complete - telemetry_period_locked
- t+40.828s node 7: complete - telemetry_period_locked
- t+41.020s node 6: complete - telemetry_period_locked
- t+123.902s node 3: timing - telemetry_period_observed
- t+123.916s node 3: telemetry_bind - telemetry_live
- t+124.123s node 3: complete - telemetry_period_locked
- t+124.206s node 3: quiet - join_request_received
- t+124.391s node 3: quiet - assign_reused
- t+124.392s node 3: assign - silence_sent
- t+124.516s node 3: ack - assign_sent
- t+124.712s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=38, timeouts=0
- node 2
- node 3; ACK->telemetry -14.625s; acquire->telemetry -14.625s
- node 6; ACK->telemetry -29.958s; acquire->telemetry -30.070s
- node 7; ACK->telemetry -21.843s; acquire->telemetry -22.009s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 21
- Drone telemetry rows: 554
- t+44.052s node 3: drone_debug_event telemetry_rf_loss_started
- t+44.052s node 3: drone_debug_status assigned_telemetry
- t+55.542s node 6: drone_debug_event telemetry_rf_loss_started
- t+55.542s node 6: drone_debug_status assigned_telemetry
- t+67.021s node 7: drone_debug_event telemetry_rf_loss_started
- t+67.022s node 7: drone_debug_status assigned_telemetry
- t+85.958s node 3: drone_debug_event telemetry_rf_loss_started
- t+85.958s node 3: drone_debug_status assigned_telemetry
- t+112.432s node 3: drone_debug_event telemetry_rf_loss_started
- t+112.432s node 3: drone_debug_status assigned_telemetry
- t+118.552s node 3: drone_debug_event join_runtime_reset
- t+118.553s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 12
- Short-loss event counts: short_loss_guard_started=7, short_loss_recovered=5
- Short-loss recovered observed gaps: count=5, avg=51.8, max=150
- Recent short-loss events: t+80.523s node 7 short_loss_recovered miss=1 gap=67; t+84.419s node 7 short_loss_guard_started miss=1 gap=-; t+113.353s node 3 short_loss_guard_started miss=1 gap=-; t+113.452s node 6 short_loss_guard_started miss=1 gap=-; t+113.596s node 7 short_loss_recovered miss=1 gap=150; t+114.331s node 3 short_loss_recovered miss=1 gap=12; t+114.723s node 6 short_loss_recovered miss=1 gap=12; t+118.749s node 3 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=171, owed_rx_selected=164, owed_service_selected=164, owed_rx_cleared=135, owed_service_cleared=135, owed_rx_missed=8
- Scheduler-caused skips by node: 2=3, 3=27, 6=118, 7=23
- Owed selections by node: 2=4, 3=23, 6=122, 7=15
- Owed listens that still missed by node: 2=1, 6=4, 7=3
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+129.836s node 3 owed_rx_selected selected=3 owed=2 skips=2; t+129.850s node 3 owed_service_selected selected=3 owed=2 skips=2; t+129.850s node 7 rx_candidate_skipped selected=3 owed=1 skips=1; t+129.923s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+129.936s node 3 owed_rx_cleared owed=2 skips=2; t+129.936s node 3 owed_service_cleared owed=2 skips=2; t+129.949s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+129.961s node 7 owed_service_selected selected=7 owed=1 skips=1; t+129.974s node 3 rx_candidate_skipped selected=7 owed=1 skips=1; t+130.184s node 6 rx_candidate_skipped selected=7 owed=2 skips=2

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 9769.6 | no | node_6_affected_by_bind,node_7_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 3/4
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | yes | - | - |
| 3 | 2 | 1 | no | - | non_target_7_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 6171.2 | 150.8 | non_target_6_not_stable |

## Receiver Budget
- Events: recovery_budget_used=374, owed_service_selected=164, owed_service_cleared=135, recovery_budget_denied=113, healthy_service_protected=113
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=80, healthy_service_deadline_risk=33
- Recent denied recovery:
  - t+113.794s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+114.344s target=6 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+118.776s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+119.029s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+119.255s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+120.619s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+122.191s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+123.593s target=3 protected=7 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+10.366s: mode `telemetry_first`
- Assigned packets received: 25
- Assigned RX coverage: 78%
- Sequence gap events: 21
- Missing sequence IDs: 73
- Max sequence gap: 18
- Assigned slot misses: 7
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 18%
- Receiver overloaded: False
- Recovery budget used: 23
- Recovery budget denied: 8
- Healthy service protected: 8
- Owed RX active: True node=2 count=1
- Fairness skips: 18
- Owed selections: 17
- Owed misses: 3
- Max scheduler skips: 3
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 418
- node 6: t+3.931s seq 101 -> t+4.501s seq 103; missing [102]
- node 6: t+4.501s seq 103 -> t+5.720s seq 110; missing [104, 105, 106, 107, 108, 109]
- node 6: t+5.720s seq 110 -> t+6.539s seq 114; missing [111, 112, 113]
- node 6: t+6.539s seq 114 -> t+7.937s seq 121; missing [115, 116, 117, 118, 119, 120]
- node 6: t+7.937s seq 121 -> t+8.316s seq 123; missing [122]
- node 6: t+8.316s seq 123 -> t+8.719s seq 125; missing [124]
- node 6: t+8.719s seq 125 -> t+9.319s seq 128; missing [126, 127]
- node 6: t+9.319s seq 128 -> t+9.936s seq 131; missing [129, 130]
- node 6: t+9.936s seq 131 -> t+10.540s seq 134; missing [132, 133]
- node 6: t+10.540s seq 134 -> t+33.654s seq 4; missing [135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, +17 more]
- node 6: t+34.243s seq 7 -> t+35.238s seq 12; missing [8, 9, 10, 11]
- node 6: t+35.238s seq 12 -> t+36.837s seq 20; missing [13, 14, 15, 16, 17, 18, 19]

## State Flicker
- Node 3: 1 rapid state transitions: t+4.914s offline->online
- Node 6: 1 rapid state transitions: t+3.932s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 2137
- drone_telemetry: 554
- inter_gc_status: 89
- assignment_event: 86
- bind_progress_event: 82
- assignments: 45
- bench_marker: 25
- drone_link_status: 25
- command: 21
- command_ack: 21
- search_event: 19
- assignment_timing_hint: 15
- drone_debug_status: 12
- telemetry_rebind_event: 12
- drone_debug_event: 9
- inter_gc_command_queued: 8
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
