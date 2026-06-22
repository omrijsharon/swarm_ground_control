# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_sharedpriority_3node_stress_20260622.jsonl`
- Parsed records: 5030
- Approx duration: 215.8s

## Commands
- Sent commands: 23
- ACKs: 23 (0 rejected)
- Derived ACK latency: min 21 ms, max 1071 ms, avg 141 ms
- Inter-GC queued command events: 8
- t+45.134s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+56.617s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+68.109s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+79.618s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+91.099s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+102.615s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+114.130s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+120.189s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 94
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 1
- Fragment samples: t+28.424s telegc: ":7,"frequencyMhz":910.5,"channelIndex":16,"radioProfileId":0,"txPeriodMs"{"type":"search_event","event":"empty_shared_r

## Bind And Search
- Search events: 15
- Bind progress events: 31
- Assignment events: 34
- Assignment event counts: telemetry_period_observed=6, telemetry_period_locked=6, join_request_received=3, assign_created=3, post_bind_first_telemetry=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3, telemetry_period_rejected=1
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+34.794s to t+38.567s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=5, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+12.020s to t+48.186s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+28.007s node 7: timing - telemetry_period_rejected
- t+28.199s node 7: ack - assign_sent
- t+28.200s node 7: telemetry_bind - assignment_completed
- t+28.212s node 7: complete - telemetry_period_locked
- t+33.590s node 6: quiet - join_request_received
- t+33.984s node 6: quiet - assign_created
- t+33.997s node 6: timing - telemetry_period_observed
- t+34.009s node 6: telemetry_bind - telemetry_live
- t+34.126s node 6: assign - silence_sent
- t+34.190s node 6: ack - assign_sent
- t+34.218s node 6: complete - telemetry_period_locked
- t+34.584s node 6: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=5, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -16.850s; acquire->telemetry -16.850s
- node 6; ACK->telemetry -29.914s; acquire->telemetry -29.914s
- node 7; ACK->telemetry -23.621s; acquire->telemetry -23.622s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 25
- Drone telemetry rows: 869
- t+68.109s node 7: drone_debug_event telemetry_rf_loss_started
- t+68.109s node 7: drone_debug_status assigned_telemetry
- t+79.618s node 3: drone_debug_event telemetry_rf_loss_started
- t+79.618s node 3: drone_debug_status assigned_telemetry
- t+91.099s node 6: drone_debug_event telemetry_rf_loss_started
- t+91.099s node 6: drone_debug_status assigned_telemetry
- t+102.615s node 7: drone_debug_event telemetry_rf_loss_started
- t+102.615s node 7: drone_debug_status assigned_telemetry
- t+114.130s node 3: drone_debug_event telemetry_rf_loss_started
- t+114.130s node 3: drone_debug_status assigned_telemetry
- t+120.188s node 3: drone_debug_event join_runtime_reset
- t+120.189s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 68
- Short-loss event counts: short_loss_guard_started=35, short_loss_recovered=33
- Short-loss recovered observed gaps: count=33, avg=11.8, max=16
- Recent short-loss events: t+200.202s node 7 short_loss_recovered miss=1 gap=12; t+202.874s node 7 short_loss_guard_started miss=1 gap=-; t+204.402s node 7 short_loss_recovered miss=1 gap=13; t+207.057s node 7 short_loss_guard_started miss=1 gap=-; t+208.805s node 7 short_loss_recovered miss=1 gap=12; t+211.450s node 7 short_loss_guard_started miss=1 gap=-; t+213.202s node 7 short_loss_recovered miss=1 gap=12; t+214.472s node 7 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=492, owed_service_selected=492, rx_candidate_skipped=383, owed_rx_cleared=304, owed_service_cleared=304, owed_rx_missed=47
- Scheduler-caused skips by node: 3=3, 6=134, 7=246
- Owed selections by node: 3=3, 6=78, 7=411
- Owed listens that still missed by node: 6=15, 7=32
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+214.010s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+214.010s node 7 owed_service_selected selected=7 owed=1 skips=1; t+214.023s node 6 rx_candidate_skipped selected=7 owed=3 skips=3; t+214.207s node 6 owed_rx_selected selected=6 owed=3 skips=3; t+214.220s node 6 owed_service_selected selected=6 owed=3 skips=3; t+214.387s node 6 owed_rx_cleared owed=3 skips=3; t+214.401s node 6 owed_service_cleared owed=3 skips=3; t+214.414s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+214.427s node 7 owed_service_selected selected=7 owed=1 skips=1; t+214.472s node 7 owed_rx_missed owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 9956.9 | no | node_6_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 5/6
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | yes | - | - |
| 3 | 2 | 1 | yes | - | - |
| 6 | 2 | 1 | yes | - | - |
| 7 | 2 | 1 | no | - | non_target_6_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join,non_target_7_not_stable |

## Receiver Budget
- Events: owed_service_selected=492, recovery_budget_used=395, owed_service_cleared=304, recovery_budget_denied=147, healthy_service_protected=147
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=114, healthy_service_deadline_risk=33
- Recent denied recovery:
  - t+205.984s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+208.551s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+208.828s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+210.189s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+210.228s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+212.955s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+213.229s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+215.758s target=3 protected=6 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+11.374s: mode `telemetry_first`
- Assigned packets received: 29
- Assigned RX coverage: 76%
- Sequence gap events: 21
- Missing sequence IDs: 75
- Max sequence gap: 26
- Assigned slot misses: 9
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 14%
- Receiver overloaded: False
- Recovery budget used: 27
- Recovery budget denied: 11
- Healthy service protected: 11
- Owed RX active: True node=6 count=1
- Fairness skips: 15
- Owed selections: 12
- Owed misses: 0
- Max scheduler skips: 2
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 746
- node 3: t+3.826s seq 59 -> t+5.249s seq 66; missing [60, 61, 62, 63, 64, 65]
- node 3: t+6.222s seq 71 -> t+6.617s seq 73; missing [72]
- node 3: t+6.617s seq 73 -> t+8.016s seq 80; missing [74, 75, 76, 77, 78, 79]
- node 3: t+8.016s seq 80 -> t+9.413s seq 87; missing [81, 82, 83, 84, 85, 86]
- node 3: t+9.413s seq 87 -> t+10.217s seq 91; missing [88, 89, 90]
- node 3: t+10.217s seq 91 -> t+10.817s seq 94; missing [92, 93]
- node 3: t+10.817s seq 94 -> t+11.426s seq 97; missing [95, 96]
- node 3: t+11.426s seq 97 -> t+20.350s seq 5; missing [98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, +17 more]
- node 3: t+27.721s seq 42 -> t+28.532s seq 46; missing [43, 44, 45]
- node 3: t+33.939s seq 73 -> t+34.391s seq 75; missing [74]
- node 3: t+34.391s seq 75 -> t+34.727s seq 77; missing [76]
- node 3: t+34.727s seq 77 -> t+35.131s seq 79; missing [78]

## Transport Findings
- Suspicious JSON fragments: 1.

## State Flicker
- Node 6: 1 rapid state transitions: t+4.400s offline->online
- Node 7: 1 rapid state transitions: t+4.734s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 3649
- drone_telemetry: 869
- inter_gc_status: 94
- telemetry_rebind_event: 68
- assignment_event: 34
- bind_progress_event: 31
- bench_marker: 29
- command: 23
- command_ack: 23
- assignments: 16
- search_event: 15
- drone_debug_status: 14
- drone_debug_event: 11
- drone_link_status: 8
- inter_gc_command_queued: 8
- assignment_timing_hint: 6
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
