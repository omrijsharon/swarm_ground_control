# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_phasekeep_3node_stress_20260622.jsonl`
- Parsed records: 2806
- Approx duration: 179.3s

## Commands
- Sent commands: 20
- ACKs: 20 (0 rejected)
- Derived ACK latency: min 17 ms, max 380 ms, avg 115 ms
- Inter-GC queued command events: 8
- t+36.395s ACK magc/magic_ground_control cancel_search accepted: -
- t+37.152s ACK magc/magic_ground_control start_search accepted: -
- t+38.427s ACK magc/magic_ground_control cancel_search accepted: -
- t+43.287s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+54.751s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+66.273s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+77.748s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+83.808s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 86
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
- Assignment event counts: telemetry_period_observed=5, telemetry_period_locked=5, join_request_received=3, post_bind_first_telemetry=3, assign_created=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3, telemetry_period_rejected=1
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+33.863s to t+37.273s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+11.472s to t+47.270s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+27.461s node 7: ack - assign_sent
- t+27.495s node 7: complete - telemetry_period_locked
- t+27.603s node 7: telemetry_bind - assignment_completed
- t+32.952s node 3: quiet - join_request_received
- t+33.069s node 3: quiet - assign_created
- t+33.069s node 3: assign - silence_sent
- t+33.082s node 3: timing - telemetry_period_observed
- t+33.095s node 3: telemetry_bind - telemetry_live
- t+33.229s node 3: ack - assign_sent
- t+33.280s node 3: timing - telemetry_period_rejected
- t+33.446s node 3: telemetry_bind - assignment_completed
- t+33.536s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -0.170s; acquire->telemetry -0.171s
- node 6; ACK->telemetry -14.693s; acquire->telemetry -14.693s
- node 7; ACK->telemetry -23.743s; acquire->telemetry -23.743s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 19
- Drone telemetry rows: 452
- t+11.314s node 7: drone_debug_event reboot_scheduled
- t+11.314s node 7: drone_debug_status assigned_telemetry
- t+43.287s node 3: drone_debug_event telemetry_rf_loss_started
- t+43.287s node 3: drone_debug_status assigned_telemetry
- t+54.751s node 6: drone_debug_event telemetry_rf_loss_started
- t+54.751s node 6: drone_debug_status assigned_telemetry
- t+66.273s node 7: drone_debug_event telemetry_rf_loss_started
- t+66.273s node 7: drone_debug_status assigned_telemetry
- t+77.748s node 3: drone_debug_event telemetry_rf_loss_started
- t+77.749s node 3: drone_debug_status assigned_telemetry
- t+83.808s node 3: drone_debug_event join_runtime_reset
- t+83.808s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 92
- Short-loss event counts: short_loss_guard_started=47, short_loss_recovered=45
- Short-loss recovered observed gaps: count=45, avg=12.6, max=24
- Recent short-loss events: t+169.275s node 6 short_loss_recovered miss=1 gap=23; t+170.177s node 6 short_loss_guard_started miss=1 gap=-; t+171.081s node 6 short_loss_recovered miss=1 gap=8; t+171.755s node 6 short_loss_guard_started miss=1 gap=-; t+174.681s node 6 short_loss_recovered miss=1 gap=17; t+175.354s node 6 short_loss_guard_started miss=1 gap=-; t+177.077s node 6 short_loss_recovered miss=1 gap=11; t+177.754s node 6 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=143, owed_service_selected=143, rx_candidate_skipped=128, owed_rx_cleared=120, owed_service_cleared=120, owed_rx_missed=1
- Scheduler-caused skips by node: 3=56, 6=36, 7=36
- Owed selections by node: 3=50, 6=36, 7=57
- Owed listens that still missed by node: 7=1
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+66.870s node 7 owed_service_cleared owed=1 skips=1; t+66.897s node 3 owed_rx_selected selected=3 owed=2 skips=2; t+67.071s node 3 owed_service_selected selected=3 owed=2 skips=2; t+67.071s node 3 owed_rx_cleared owed=2 skips=2; t+67.071s node 3 owed_service_cleared owed=2 skips=2; t+67.461s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+67.583s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+67.583s node 6 owed_service_selected selected=6 owed=1 skips=1; t+67.674s node 6 owed_rx_cleared owed=1 skips=1; t+67.674s node 6 owed_service_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 9671.1 | no | node_3_affected_by_bind,node_6_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 2/3
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | no | - | non_target_3_not_stable,non_target_6_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join,non_target_6_not_stable |

## Receiver Budget
- Events: recovery_budget_used=232, recovery_budget_denied=215, healthy_service_protected=215, owed_service_selected=143, owed_service_cleared=120
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=192, healthy_service_deadline_risk=23
- Recent denied recovery:
  - t+173.049s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+174.248s target=6 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+175.342s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+175.480s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+176.655s target=6 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+177.742s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+177.864s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+179.040s target=6 protected=7 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+10.743s: mode `telemetry_first`
- Assigned packets received: 25
- Assigned RX coverage: 92%
- Sequence gap events: 6
- Missing sequence IDs: 22
- Max sequence gap: 6
- Assigned slot misses: 2
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 17%
- Receiver overloaded: False
- Recovery budget used: 12
- Recovery budget denied: 22
- Healthy service protected: 22
- Owed RX active: True node=7 count=1
- Fairness skips: 1
- Owed selections: 18
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 382
- node 7: t+3.718s seq 227 -> t+4.251s seq 229; missing [228]
- node 7: t+4.251s seq 229 -> t+5.317s seq 235; missing [230, 231, 232, 233, 234]
- node 7: t+5.317s seq 235 -> t+5.708s seq 237; missing [236]
- node 7: t+5.708s seq 237 -> t+6.908s seq 243; missing [238, 239, 240, 241, 242]
- node 7: t+6.908s seq 243 -> t+27.294s seq 4; missing [244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 0, 1, 2, 3]
- node 7: t+28.471s seq 10 -> t+29.067s seq 13; missing [11, 12]
- node 7: t+29.067s seq 13 -> t+29.476s seq 15; missing [14]
- node 7: t+29.476s seq 15 -> t+29.864s seq 17; missing [16]
- node 7: t+29.864s seq 17 -> t+30.467s seq 19; missing [18]
- node 7: t+30.467s seq 19 -> t+30.670s seq 21; missing [20]
- node 7: t+30.670s seq 21 -> t+31.260s seq 23; missing [22]
- node 7: t+31.260s seq 23 -> t+31.663s seq 25; missing [24]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1856
- drone_telemetry: 452
- telemetry_rebind_event: 92
- inter_gc_status: 86
- assignment_event: 32
- bind_progress_event: 29
- bench_marker: 23
- command: 20
- command_ack: 20
- search_event: 17
- assignments: 16
- drone_debug_status: 11
- inter_gc_command_queued: 8
- drone_debug_event: 8
- drone_link_status: 6
- assignment_timing_hint: 5
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
