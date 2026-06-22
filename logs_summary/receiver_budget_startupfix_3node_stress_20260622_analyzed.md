# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_startupfix_3node_stress_20260622.jsonl`
- Parsed records: 3855
- Approx duration: 158.5s

## Commands
- Sent commands: 18
- ACKs: 18 (0 rejected)
- Derived ACK latency: min 36 ms, max 226 ms, avg 101 ms
- Inter-GC queued command events: 8
- t+36.539s ACK magc/magic_ground_control cancel_search accepted: -
- t+37.298s ACK magc/magic_ground_control start_search accepted: -
- t+38.522s ACK magc/magic_ground_control cancel_search accepted: -
- t+39.114s ACK magc/magic_ground_control start_search accepted: -
- t+40.289s ACK magc/magic_ground_control cancel_search accepted: -
- t+45.216s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+56.824s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+62.915s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 50
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 1
- Fragment samples: t+25.483s telegc: _received","frequencyMhz":,"event":"post_bind_acquire_started","sourceRole":"magic_ground_control","nodeId":6,"reason":"

## Bind And Search
- Search events: 18
- Bind progress events: 29
- Assignment events: 34
- Assignment event counts: telemetry_period_observed=5, post_bind_first_telemetry=5, telemetry_period_locked=4, post_bind_acquire_timeout=3, join_request_received=3, assign_created=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=2
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+35.525s to t+39.345s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=1
- Auto shared RX scanner events: 1
- Auto shared RX complete reasons: post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+10.819s to t+49.144s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+25.339s node 6: assign - silence_sent
- t+25.339s node 6: ack - assign_sent
- t+25.373s node 6: complete - telemetry_period_locked
- t+25.483s node 6: telemetry_bind - assignment_completed
- t+34.738s node 7: quiet - join_request_received
- t+34.894s node 7: quiet - assign_created
- t+34.908s node 7: assign - silence_sent
- t+34.908s node 7: timing - telemetry_period_observed
- t+34.932s node 7: telemetry_bind - telemetry_live
- t+35.104s node 7: ack - assign_sent
- t+35.115s node 7: complete - telemetry_period_locked
- t+35.314s node 7: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=5, first_telemetry=10, timeouts=6
- node 3; ACK->telemetry -0.204s; acquire->telemetry -0.398s; timeouts=2
- node 6; ACK->telemetry -18.432s; acquire->telemetry -18.765s; timeouts=2
- node 7; ACK->telemetry -28.528s; acquire->telemetry -28.528s; timeouts=2

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 15
- Drone telemetry rows: 389
- t+10.743s node 3: drone_debug_event reboot_scheduled
- t+10.743s node 3: drone_debug_status backoff
- t+10.779s node 6: drone_debug_event reboot_scheduled
- t+10.780s node 6: drone_debug_status assigned_telemetry
- t+10.820s node 7: drone_debug_event reboot_scheduled
- t+10.821s node 7: drone_debug_status assigned_telemetry
- t+45.216s node 3: drone_debug_event telemetry_rf_loss_started
- t+45.216s node 3: drone_debug_status assigned_telemetry
- t+56.824s node 3: drone_debug_event telemetry_rf_loss_started
- t+56.824s node 3: drone_debug_status assigned_telemetry
- t+62.915s node 3: drone_debug_event join_runtime_reset
- t+62.915s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 52
- Short-loss event counts: short_loss_guard_started=23, short_loss_recovered=22
- Short-loss recovered observed gaps: count=22, avg=9.0, max=34
- Recent short-loss events: t+56.933s node 7 short_loss_guard_started miss=1 gap=-; t+58.605s node 3 short_loss_recovered miss=1 gap=9; t+58.846s node 3 short_loss_guard_started miss=1 gap=-; t+60.403s node 3 short_loss_recovered miss=1 gap=8; t+60.644s node 3 short_loss_guard_started miss=1 gap=-; t+62.202s node 3 short_loss_recovered miss=1 gap=8; t+62.444s node 3 short_loss_guard_started miss=1 gap=-; t+63.514s node 7 short_loss_recovered miss=1 gap=34

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=338, owed_service_selected=338, rx_candidate_skipped=337, owed_rx_cleared=134, owed_service_cleared=134
- Scheduler-caused skips by node: 6=135, 7=202
- Owed selections by node: 6=135, 7=203
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+157.726s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+157.896s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+157.910s node 6 owed_service_selected selected=6 owed=1 skips=1; t+157.910s node 7 rx_candidate_skipped selected=6 owed=2 skips=2; t+158.115s node 7 owed_rx_selected selected=7 owed=2 skips=2; t+158.116s node 7 owed_service_selected selected=7 owed=2 skips=2; t+158.129s node 6 rx_candidate_skipped selected=7 owed=2 skips=2; t+158.295s node 6 owed_rx_selected selected=6 owed=2 skips=2; t+158.295s node 6 owed_service_selected selected=6 owed=2 skips=2; t+158.307s node 7 rx_candidate_skipped selected=6 owed=3 skips=3

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 9701 | no | node_3_affected_by_bind,node_7_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 0/1
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | no | - | non_target_7_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join,non_target_7_not_stable |

## Receiver Budget
- Events: recovery_budget_used=443, owed_service_selected=338, recovery_budget_denied=205, healthy_service_protected=205, owed_service_cleared=134
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=130, healthy_service_deadline_risk=75
- Recent denied recovery:
  - t+152.987s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+154.312s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+154.387s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+155.721s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+155.787s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+157.113s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+157.188s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+158.514s target=3 protected=6 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+10.339s: mode `telemetry_first`
- Assigned packets received: 5
- Assigned RX coverage: 26%
- Sequence gap events: 2
- Missing sequence IDs: 7
- Max sequence gap: 6
- Assigned slot misses: 14
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 5%
- Receiver overloaded: False
- Recovery budget used: 36
- Recovery budget denied: 3
- Healthy service protected: 3
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 231
- node 7: t+6.576s seq 162 -> t+34.932s seq 4; missing [163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, +17 more]
- node 7: t+35.180s seq 5 -> t+37.327s seq 16; missing [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
- node 7: t+37.327s seq 16 -> t+37.996s seq 19; missing [17, 18]
- node 7: t+37.996s seq 19 -> t+41.318s seq 36; missing [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]
- node 7: t+41.318s seq 36 -> t+41.713s seq 38; missing [37]
- node 7: t+41.713s seq 38 -> t+42.114s seq 40; missing [39]
- node 7: t+42.114s seq 40 -> t+42.597s seq 42; missing [41]
- node 7: t+42.597s seq 42 -> t+43.122s seq 44; missing [43]
- node 7: t+43.122s seq 44 -> t+47.717s seq 68; missing [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, +7 more]
- node 7: t+47.717s seq 68 -> t+48.200s seq 70; missing [69]
- node 7: t+48.200s seq 70 -> t+48.653s seq 72; missing [71]
- node 7: t+48.653s seq 72 -> t+48.998s seq 74; missing [73]

## Transport Findings
- Suspicious JSON fragments: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 3056
- drone_telemetry: 389
- telemetry_rebind_event: 52
- inter_gc_status: 50
- assignment_event: 34
- bind_progress_event: 29
- bench_marker: 19
- command: 18
- command_ack: 18
- search_event: 18
- assignments: 16
- drone_debug_status: 9
- inter_gc_command_queued: 8
- drone_link_status: 6
- drone_debug_event: 6
- assignment_timing_hint: 4
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
