# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_margin_3node_stress_20260622.jsonl`
- Parsed records: 3486
- Approx duration: 215.7s

## Commands
- Sent commands: 23
- ACKs: 23 (0 rejected)
- Derived ACK latency: min 22 ms, max 376 ms, avg 98 ms
- Inter-GC queued command events: 8
- t+45.146s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+56.681s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+68.177s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+79.651s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+91.137s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+102.603s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+114.072s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+120.151s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 104
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
- Bind progress events: 28
- Assignment events: 31
- Assignment event counts: telemetry_period_observed=5, telemetry_period_locked=5, join_request_received=3, post_bind_first_telemetry=3, assign_created=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+35.561s to t+39.263s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+11.097s to t+49.231s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+27.264s node 6: assign - silence_sent
- t+27.298s node 6: complete - telemetry_period_locked
- t+27.430s node 6: ack - assign_sent
- t+27.599s node 6: telemetry_bind - assignment_completed
- t+34.633s node 3: quiet - join_request_received
- t+34.645s node 3: timing - telemetry_period_observed
- t+34.660s node 3: telemetry_bind - telemetry_live
- t+34.753s node 3: quiet - assign_created
- t+34.840s node 3: assign - silence_sent
- t+34.879s node 3: complete - telemetry_period_locked
- t+34.969s node 3: ack - assign_sent
- t+35.049s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -0.285s; acquire->telemetry -0.285s
- node 6; ACK->telemetry -22.728s; acquire->telemetry -22.809s
- node 7; ACK->telemetry -15.453s; acquire->telemetry -15.453s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 25
- Drone telemetry rows: 1059
- t+68.177s node 7: drone_debug_event telemetry_rf_loss_started
- t+68.177s node 7: drone_debug_status assigned_telemetry
- t+79.651s node 3: drone_debug_event telemetry_rf_loss_started
- t+79.651s node 3: drone_debug_status assigned_telemetry
- t+91.137s node 6: drone_debug_event telemetry_rf_loss_started
- t+91.137s node 6: drone_debug_status assigned_telemetry
- t+102.603s node 7: drone_debug_event telemetry_rf_loss_started
- t+102.603s node 7: drone_debug_status assigned_telemetry
- t+114.072s node 3: drone_debug_event telemetry_rf_loss_started
- t+114.072s node 3: drone_debug_status assigned_telemetry
- t+120.151s node 3: drone_debug_event join_runtime_reset
- t+120.152s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 41
- Short-loss event counts: short_loss_guard_started=21, short_loss_recovered=20
- Short-loss recovered observed gaps: count=20, avg=4.9, max=11
- Recent short-loss events: t+112.842s node 7 short_loss_recovered miss=1 gap=6; t+114.261s node 3 short_loss_guard_started miss=1 gap=-; t+116.241s node 3 short_loss_recovered miss=1 gap=11; t+120.117s node 6 short_loss_guard_started miss=1 gap=-; t+120.207s node 7 short_loss_guard_started miss=1 gap=-; t+120.464s node 3 short_loss_guard_started miss=1 gap=-; t+120.681s node 6 short_loss_recovered miss=1 gap=3; t+120.778s node 7 short_loss_recovered miss=1 gap=3

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=119, owed_rx_selected=118, owed_service_selected=118, owed_rx_cleared=118, owed_service_cleared=118
- Scheduler-caused skips by node: 3=34, 6=39, 7=46
- Owed selections by node: 3=34, 6=39, 7=45
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+119.051s node 3 owed_rx_cleared owed=1 skips=1; t+119.051s node 3 owed_service_cleared owed=1 skips=1; t+119.077s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+119.276s node 6 owed_service_selected selected=6 owed=1 skips=1; t+119.276s node 6 owed_rx_cleared owed=1 skips=1; t+119.276s node 6 owed_service_cleared owed=1 skips=1; t+119.302s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+119.388s node 7 owed_service_selected selected=7 owed=1 skips=1; t+119.388s node 7 owed_rx_cleared owed=1 skips=1; t+119.590s node 7 owed_service_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 9838.9 | yes | - |

## RF-Loss Only Matrix
- Pass: 6/6
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | yes | - | - |
| 3 | 2 | 1 | yes | - | - |
| 6 | 2 | 1 | yes | - | - |
| 7 | 2 | 1 | yes | - | - |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join |

## Receiver Budget
- Events: recovery_budget_denied=346, healthy_service_protected=346, recovery_budget_used=211, owed_service_selected=118, owed_service_cleared=118
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=341, healthy_service_deadline_risk=5
- Recent denied recovery:
  - t+213.073s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+213.672s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+213.832s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+213.985s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+214.611s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+214.691s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+215.367s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+215.473s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+10.389s: mode `telemetry_first`
- Assigned packets received: 9
- Assigned RX coverage: 69%
- Sequence gap events: 7
- Missing sequence IDs: 22
- Max sequence gap: 6
- Assigned slot misses: 4
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 5%
- Receiver overloaded: False
- Recovery budget used: 25
- Recovery budget denied: 6
- Healthy service protected: 6
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 735
- node 7: t+3.854s seq 147 -> t+5.196s seq 152; missing [148, 149, 150, 151]
- node 7: t+5.196s seq 152 -> t+6.055s seq 158; missing [153, 154, 155, 156, 157]
- node 7: t+6.055s seq 158 -> t+6.448s seq 160; missing [159]
- node 7: t+6.448s seq 160 -> t+7.848s seq 167; missing [161, 162, 163, 164, 165, 166]
- node 7: t+7.848s seq 167 -> t+8.248s seq 169; missing [168]
- node 7: t+8.248s seq 169 -> t+9.248s seq 174; missing [170, 171, 172, 173]
- node 7: t+9.248s seq 174 -> t+9.648s seq 176; missing [175]
- node 7: t+9.648s seq 176 -> t+10.656s seq 181; missing [177, 178, 179, 180]
- node 7: t+10.656s seq 181 -> t+18.987s seq 2; missing [182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, +17 more]
- node 7: t+26.977s seq 42 -> t+27.431s seq 44; missing [43]
- node 7: t+34.470s seq 79 -> t+35.049s seq 82; missing [80, 81]
- node 7: t+35.632s seq 85 -> t+37.036s seq 92; missing [86, 87, 88, 89, 90, 91]

## State Flicker
- Node 6: 1 rapid state transitions: t+4.716s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1942
- drone_telemetry: 1059
- inter_gc_status: 104
- telemetry_rebind_event: 41
- assignment_event: 31
- bench_marker: 28
- bind_progress_event: 28
- command: 23
- command_ack: 23
- search_event: 17
- assignments: 16
- drone_debug_status: 14
- drone_debug_event: 11
- inter_gc_command_queued: 8
- drone_link_status: 7
- assignment_timing_hint: 5
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
