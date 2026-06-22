# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_final_3node_stress_20260622.jsonl`
- Parsed records: 6097
- Approx duration: 214.6s

## Commands
- Sent commands: 23
- ACKs: 23 (0 rejected)
- Derived ACK latency: min 25 ms, max 282 ms, avg 109 ms
- Inter-GC queued command events: 8
- t+44.144s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+55.633s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+67.153s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+78.685s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+90.163s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+101.623s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+113.113s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+119.187s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 97
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 1
- Fragment samples: t+33.745s telegc: Id":3,"reason":"join_ack_received","frequencyMhz":912,"channelI{"type":"bind_progress_event","event":"assignment_complet

## Bind And Search
- Search events: 35
- Bind progress events: 29
- Assignment events: 31
- Assignment event counts: telemetry_period_observed=6, telemetry_period_locked=5, post_bind_first_telemetry=4, join_request_received=3, assign_created=3, silence_sent=3, assign_sent=3, join_ack_received=2, post_bind_acquire_started=2
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+34.319s to t+38.143s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=19
- Auto shared RX scanner events: 19
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+10.932s to t+34.319s
- t+26.145s node 7: timing - telemetry_period_observed
- t+26.160s node 7: telemetry_bind - telemetry_live
- t+26.338s node 7: ack - assign_sent
- t+26.378s node 7: complete - telemetry_period_locked
- t+26.492s node 7: telemetry_bind - assignment_completed
- t+33.275s node 3: quiet - join_request_received
- t+33.289s node 3: timing - telemetry_period_observed
- t+33.302s node 3: telemetry_bind - telemetry_live
- t+33.474s node 3: quiet - assign_created
- t+33.475s node 3: assign - silence_sent
- t+33.618s node 3: complete - telemetry_period_locked
- t+33.745s node 3: ack - assign_sent

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=5, first_telemetry=8, timeouts=0
- node 3; acquire->telemetry -30.168s
- node 6; ACK->telemetry -15.097s; acquire->telemetry -15.097s
- node 7; ACK->telemetry -22.220s; acquire->telemetry -22.220s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 25
- Drone telemetry rows: 990
- t+67.153s node 7: drone_debug_event telemetry_rf_loss_started
- t+67.154s node 7: drone_debug_status assigned_telemetry
- t+78.685s node 3: drone_debug_event telemetry_rf_loss_started
- t+78.685s node 3: drone_debug_status assigned_telemetry
- t+90.163s node 6: drone_debug_event telemetry_rf_loss_started
- t+90.163s node 6: drone_debug_status assigned_telemetry
- t+101.623s node 7: drone_debug_event telemetry_rf_loss_started
- t+101.623s node 7: drone_debug_status assigned_telemetry
- t+113.113s node 3: drone_debug_event telemetry_rf_loss_started
- t+113.113s node 3: drone_debug_status assigned_telemetry
- t+119.187s node 3: drone_debug_event join_runtime_reset
- t+119.187s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 81
- Short-loss event counts: short_loss_guard_started=3, short_loss_recovered=1, short_loss_guard_expired=1
- Short-loss recovered observed gaps: count=1, avg=10.0, max=10
- Recent short-loss events: t+10.421s node 3 short_loss_guard_started miss=1 gap=-; t+114.332s node 3 short_loss_guard_started miss=1 gap=-; t+115.080s node 3 short_loss_recovered miss=1 gap=10; t+120.133s node 3 short_loss_guard_started miss=1 gap=-; t+130.122s node 3 short_loss_guard_expired miss=10 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=865, owed_rx_selected=864, owed_service_selected=864, owed_rx_cleared=853, owed_service_cleared=853, owed_rx_missed=8
- Scheduler-caused skips by node: 3=137, 6=361, 7=367
- Owed selections by node: 3=142, 6=359, 7=363
- Owed listens that still missed by node: 3=7, 7=1
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+214.335s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+214.349s node 6 owed_rx_cleared owed=1 skips=1; t+214.349s node 6 owed_service_cleared owed=1 skips=1; t+214.363s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+214.376s node 7 owed_service_selected selected=7 owed=1 skips=1; t+214.543s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+214.543s node 7 owed_rx_cleared owed=1 skips=1; t+214.555s node 7 owed_service_cleared owed=1 skips=1; t+214.570s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+214.582s node 6 owed_service_selected selected=6 owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 10195.6 | yes | - |

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
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join,non_target_6_not_stable,non_target_7_not_stable |

## Receiver Budget
- Events: owed_service_selected=864, owed_service_cleared=853, recovery_budget_denied=71, healthy_service_protected=71, recovery_budget_used=23
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=71
- Recent denied recovery:
  - t+120.333s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+120.382s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+121.133s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+123.339s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+123.585s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+125.722s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+126.922s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+128.122s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+10.325s: mode `telemetry_first`
- Assigned packets received: 63
- Assigned RX coverage: 100%
- Sequence gap events: 2
- Missing sequence IDs: 2
- Max sequence gap: 1
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 9%
- Receiver overloaded: False
- Recovery budget used: 6
- Recovery budget denied: 59
- Healthy service protected: 59
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 893
- node 3: t+4.046s seq 194 -> t+4.415s seq 196; missing [195]
- node 3: t+8.435s seq 216 -> t+8.812s seq 218; missing [217]
- node 3: t+10.210s seq 225 -> t+33.302s seq 4; missing [226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, +17 more]
- node 3: t+33.631s seq 5 -> t+34.091s seq 8; missing [6, 7]
- node 3: t+34.091s seq 8 -> t+34.697s seq 11; missing [9, 10]
- node 3: t+34.697s seq 11 -> t+35.314s seq 14; missing [12, 13]
- node 3: t+35.314s seq 14 -> t+35.889s seq 17; missing [15, 16]
- node 3: t+35.889s seq 17 -> t+36.499s seq 20; missing [18, 19]
- node 3: t+36.499s seq 20 -> t+37.096s seq 23; missing [21, 22]
- node 3: t+37.096s seq 23 -> t+37.692s seq 26; missing [24, 25]
- node 3: t+37.692s seq 26 -> t+38.293s seq 29; missing [27, 28]
- node 3: t+38.293s seq 29 -> t+38.890s seq 32; missing [30, 31]

## Transport Findings
- Suspicious JSON fragments: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 4568
- drone_telemetry: 990
- inter_gc_status: 97
- telemetry_rebind_event: 81
- search_event: 35
- assignment_event: 31
- bind_progress_event: 29
- bench_marker: 28
- command: 23
- command_ack: 23
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
