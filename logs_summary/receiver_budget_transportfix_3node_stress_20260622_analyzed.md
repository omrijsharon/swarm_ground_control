# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_transportfix_3node_stress_20260622.jsonl`
- Parsed records: 4084
- Approx duration: 194.8s

## Commands
- Sent commands: 21
- ACKs: 21 (0 rejected)
- Derived ACK latency: min 24 ms, max 367 ms, avg 121 ms
- Inter-GC queued command events: 8
- t+41.020s ACK magc/magic_ground_control start_search accepted: -
- t+42.266s ACK magc/magic_ground_control cancel_search accepted: -
- t+47.190s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+58.678s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+70.237s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+81.766s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+93.314s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+99.388s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 60
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
- Search events: 17
- Bind progress events: 29
- Assignment events: 32
- Assignment event counts: telemetry_period_observed=6, telemetry_period_locked=5, post_bind_first_telemetry=3, join_request_received=3, assign_created=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+37.416s to t+41.226s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+11.354s to t+50.837s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+30.732s node 3: assign - silence_sent
- t+30.732s node 3: ack - assign_sent
- t+30.874s node 3: complete - telemetry_period_locked
- t+30.942s node 3: telemetry_bind - assignment_completed
- t+36.626s node 6: quiet - join_request_received
- t+36.626s node 6: quiet - assign_created
- t+36.638s node 6: timing - telemetry_period_observed
- t+36.651s node 6: telemetry_bind - telemetry_live
- t+36.748s node 6: assign - silence_sent
- t+36.831s node 6: ack - assign_sent
- t+36.859s node 6: complete - telemetry_period_locked
- t+36.921s node 6: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -26.725s; acquire->telemetry -26.726s
- node 6; ACK->telemetry -32.879s; acquire->telemetry -32.879s
- node 7; ACK->telemetry -19.578s; acquire->telemetry -19.578s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 21
- Drone telemetry rows: 736
- t+47.190s node 3: drone_debug_event telemetry_rf_loss_started
- t+47.190s node 3: drone_debug_status assigned_telemetry
- t+58.678s node 6: drone_debug_event telemetry_rf_loss_started
- t+58.678s node 6: drone_debug_status assigned_telemetry
- t+70.237s node 7: drone_debug_event telemetry_rf_loss_started
- t+70.237s node 7: drone_debug_status assigned_telemetry
- t+81.766s node 3: drone_debug_event telemetry_rf_loss_started
- t+81.766s node 3: drone_debug_status assigned_telemetry
- t+93.313s node 3: drone_debug_event telemetry_rf_loss_started
- t+93.314s node 3: drone_debug_status assigned_telemetry
- t+99.388s node 3: drone_debug_event join_runtime_reset
- t+99.388s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 76
- Short-loss event counts: short_loss_guard_started=39, short_loss_recovered=37
- Short-loss recovered observed gaps: count=37, avg=12.0, max=18
- Recent short-loss events: t+185.645s node 7 short_loss_recovered miss=1 gap=12; t+186.544s node 7 short_loss_guard_started miss=1 gap=-; t+188.017s node 7 short_loss_recovered miss=1 gap=11; t+188.935s node 7 short_loss_guard_started miss=1 gap=-; t+190.426s node 7 short_loss_recovered miss=1 gap=11; t+191.333s node 7 short_loss_guard_started miss=1 gap=-; t+192.842s node 7 short_loss_recovered miss=1 gap=11; t+193.739s node 7 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=301, owed_service_selected=301, rx_candidate_skipped=236, owed_rx_cleared=211, owed_service_cleared=211, owed_rx_missed=50
- Scheduler-caused skips by node: 3=1, 6=53, 7=182
- Owed selections by node: 3=1, 6=38, 7=262
- Owed listens that still missed by node: 7=50
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+192.842s node 7 owed_service_cleared owed=1 skips=1; t+192.868s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+193.042s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+193.053s node 7 owed_service_selected selected=7 owed=1 skips=1; t+193.397s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+193.410s node 7 owed_service_selected selected=7 owed=1 skips=1; t+193.518s node 7 owed_rx_missed owed=1 skips=1; t+193.643s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+193.655s node 7 owed_service_selected selected=7 owed=1 skips=1; t+193.739s node 7 owed_rx_missed owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 9804.9 | yes | - |

## RF-Loss Only Matrix
- Pass: 3/4
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | yes | - | - |
| 3 | 2 | 1 | no | - | non_target_6_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join,non_target_6_not_stable,non_target_7_not_stable |

## Receiver Budget
- Events: recovery_budget_used=380, owed_service_selected=301, owed_service_cleared=211, recovery_budget_denied=144, healthy_service_protected=144
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=104, healthy_service_deadline_risk=40
- Recent denied recovery:
  - t+185.399s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+185.670s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+186.336s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+187.792s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+190.189s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+192.596s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+192.868s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+193.531s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+10.739s: mode `telemetry_first`
- Assigned packets received: 56
- Assigned RX coverage: 96%
- Sequence gap events: 4
- Missing sequence IDs: 13
- Max sequence gap: 6
- Assigned slot misses: 2
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 9%
- Receiver overloaded: False
- Recovery budget used: 17
- Recovery budget denied: 52
- Healthy service protected: 52
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 575
- node 7: t+3.835s seq 48 -> t+4.262s seq 50; missing [49]
- node 7: t+4.262s seq 50 -> t+5.627s seq 57; missing [51, 52, 53, 54, 55, 56]
- node 7: t+10.865s seq 83 -> t+23.022s seq 2; missing [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, +17 more]
- node 7: t+30.421s seq 39 -> t+31.058s seq 42; missing [40, 41]
- node 7: t+36.442s seq 69 -> t+37.027s seq 72; missing [70, 71]
- node 7: t+37.027s seq 72 -> t+37.457s seq 74; missing [73]
- node 7: t+37.457s seq 74 -> t+37.835s seq 76; missing [75]
- node 7: t+37.835s seq 76 -> t+38.246s seq 78; missing [77]
- node 7: t+38.246s seq 78 -> t+38.632s seq 80; missing [79]
- node 7: t+38.632s seq 80 -> t+39.034s seq 82; missing [81]
- node 7: t+39.034s seq 82 -> t+39.433s seq 84; missing [83]
- node 7: t+39.433s seq 84 -> t+39.831s seq 86; missing [85]

## State Flicker
- Node 3: 1 rapid state transitions: t+4.216s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 2883
- drone_telemetry: 736
- telemetry_rebind_event: 76
- inter_gc_status: 60
- assignment_event: 32
- bind_progress_event: 29
- bench_marker: 25
- command: 21
- command_ack: 21
- search_event: 17
- assignments: 16
- drone_debug_status: 12
- drone_debug_event: 9
- inter_gc_command_queued: 8
- drone_link_status: 7
- assignment_timing_hint: 5
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
