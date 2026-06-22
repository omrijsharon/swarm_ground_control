# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_deadline_3node_stress_20260622.jsonl`
- Parsed records: 2375
- Approx duration: 192.6s

## Commands
- Sent commands: 21
- ACKs: 21 (0 rejected)
- Derived ACK latency: min 25 ms, max 607 ms, avg 118 ms
- Inter-GC queued command events: 8
- t+39.132s ACK magc/magic_ground_control start_search accepted: -
- t+40.404s ACK magc/magic_ground_control cancel_search accepted: -
- t+45.227s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+56.686s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+68.177s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+79.668s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+91.161s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+97.216s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 80
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
- Assignment event counts: telemetry_period_observed=5, telemetry_period_locked=4, join_request_received=3, post_bind_first_telemetry=3, assign_created=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3, telemetry_period_rejected=1
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+35.709s to t+39.412s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+11.427s to t+49.202s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+27.563s node 7: ack - assign_sent
- t+27.563s node 7: timing - telemetry_period_rejected
- t+27.762s node 7: telemetry_bind - assignment_completed
- t+27.793s node 7: complete - telemetry_period_locked
- t+34.945s node 3: quiet - join_request_received
- t+34.947s node 3: quiet - assign_created
- t+34.959s node 3: timing - telemetry_period_observed
- t+34.972s node 3: telemetry_bind - telemetry_live
- t+35.082s node 3: assign - silence_sent
- t+35.150s node 3: ack - assign_sent
- t+35.183s node 3: complete - telemetry_period_locked
- t+35.250s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -0.152s; acquire->telemetry -0.252s
- node 6; ACK->telemetry -14.173s; acquire->telemetry -14.173s
- node 7; ACK->telemetry -22.885s; acquire->telemetry -22.885s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 21
- Drone telemetry rows: 724
- t+45.227s node 3: drone_debug_event telemetry_rf_loss_started
- t+45.227s node 3: drone_debug_status assigned_telemetry
- t+56.685s node 6: drone_debug_event telemetry_rf_loss_started
- t+56.686s node 6: drone_debug_status assigned_telemetry
- t+68.177s node 7: drone_debug_event telemetry_rf_loss_started
- t+68.177s node 7: drone_debug_status assigned_telemetry
- t+79.668s node 3: drone_debug_event telemetry_rf_loss_started
- t+79.669s node 3: drone_debug_status assigned_telemetry
- t+91.161s node 3: drone_debug_event telemetry_rf_loss_started
- t+91.162s node 3: drone_debug_status assigned_telemetry
- t+97.216s node 3: drone_debug_event join_runtime_reset
- t+97.216s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 93
- Short-loss event counts: short_loss_guard_started=47, short_loss_recovered=46
- Short-loss recovered observed gaps: count=46, avg=8.5, max=11
- Recent short-loss events: t+184.261s node 6 short_loss_guard_started miss=1 gap=-; t+185.221s node 6 short_loss_recovered miss=1 gap=8; t+186.654s node 6 short_loss_guard_started miss=1 gap=-; t+187.621s node 6 short_loss_recovered miss=1 gap=8; t+189.060s node 6 short_loss_guard_started miss=1 gap=-; t+190.623s node 6 short_loss_recovered miss=1 gap=11; t+191.463s node 6 short_loss_guard_started miss=1 gap=-; t+192.421s node 6 short_loss_recovered miss=1 gap=8

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=11, owed_rx_selected=11, owed_service_selected=11, owed_rx_cleared=10, owed_service_cleared=10
- Scheduler-caused skips by node: 3=1, 6=1, 7=9
- Owed selections by node: 3=1, 6=1, 7=9
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+59.567s node 7 owed_service_cleared owed=1 skips=1; t+59.675s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+59.675s node 6 owed_service_selected selected=6 owed=1 skips=1; t+59.807s node 6 owed_rx_cleared owed=1 skips=1; t+59.820s node 6 owed_service_cleared owed=1 skips=1; t+79.993s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+80.226s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+80.240s node 7 owed_service_selected selected=7 owed=1 skips=1; t+80.372s node 7 owed_rx_cleared owed=1 skips=1; t+80.372s node 7 owed_service_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 9740.5 | no | node_6_affected_by_bind |

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
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join,non_target_6_not_stable |

## Receiver Budget
- Events: recovery_budget_denied=221, healthy_service_protected=221, recovery_budget_used=199, owed_service_selected=11, owed_service_cleared=10
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=217, healthy_service_deadline_risk=4
- Recent denied recovery:
  - t+188.362s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+188.961s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+189.048s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+189.731s target=6 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+190.635s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+191.362s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+191.450s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+192.138s target=6 protected=7 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+10.787s: mode `telemetry_first`
- Assigned packets received: 8
- Assigned RX coverage: 66%
- Sequence gap events: 6
- Missing sequence IDs: 20
- Max sequence gap: 6
- Assigned slot misses: 4
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 5%
- Receiver overloaded: False
- Recovery budget used: 22
- Recovery budget denied: 5
- Healthy service protected: 5
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 664
- node 7: t+4.826s seq 217 -> t+5.360s seq 219; missing [218]
- node 7: t+5.360s seq 219 -> t+6.606s seq 226; missing [220, 221, 222, 223, 224, 225]
- node 7: t+6.606s seq 226 -> t+7.811s seq 232; missing [227, 228, 229, 230, 231]
- node 7: t+7.811s seq 232 -> t+8.210s seq 234; missing [233]
- node 7: t+8.210s seq 234 -> t+9.616s seq 241; missing [235, 236, 237, 238, 239, 240]
- node 7: t+9.616s seq 241 -> t+10.014s seq 243; missing [242]
- node 7: t+10.014s seq 243 -> t+27.417s seq 3; missing [244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 0, 1, 2]
- node 7: t+28.375s seq 8 -> t+28.964s seq 10; missing [9]
- node 7: t+28.964s seq 10 -> t+29.369s seq 12; missing [11]
- node 7: t+29.571s seq 13 -> t+29.977s seq 15; missing [14]
- node 7: t+29.977s seq 15 -> t+30.368s seq 17; missing [16]
- node 7: t+30.380s seq 18 -> t+30.962s seq 20; missing [19]

## State Flicker
- Node 6: 1 rapid state transitions: t+5.629s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1154
- drone_telemetry: 724
- telemetry_rebind_event: 93
- inter_gc_status: 80
- assignment_event: 31
- bind_progress_event: 28
- bench_marker: 25
- command: 21
- command_ack: 21
- search_event: 17
- assignments: 16
- drone_debug_status: 12
- drone_debug_event: 9
- inter_gc_command_queued: 8
- drone_link_status: 7
- assignment_timing_hint: 4
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
