# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_deadline_gate_3node_stress_20260622.jsonl`
- Parsed records: 3690
- Approx duration: 150.7s

## Commands
- Sent commands: 24
- ACKs: 24 (0 rejected)
- Derived ACK latency: min 21 ms, max 389 ms, avg 117 ms
- Inter-GC queued command events: 8
- t+59.389s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+70.916s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+82.465s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+93.976s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+105.460s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+116.963s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+128.469s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+134.517s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 43
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
- Bind progress events: 83
- Assignment events: 87
- Assignment event counts: telemetry_period_observed=25, post_bind_first_telemetry=22, telemetry_period_locked=14, join_request_received=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, telemetry_period_rejected=2, assign_reused=1
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+38.301s to t+42.512s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+11.270s to t+51.306s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+43.887s node 3: telemetry_bind - telemetry_live
- t+44.087s node 6: complete - telemetry_period_locked
- t+44.341s node 7: complete - telemetry_period_locked
- t+44.502s node 3: complete - telemetry_period_locked
- t+145.033s node 3: quiet - join_request_received
- t+145.033s node 3: quiet - assign_reused
- t+145.033s node 3: assign - silence_sent
- t+145.101s node 3: ack - assign_sent
- t+145.101s node 3: telemetry_bind - assignment_completed
- t+145.270s node 3: timing - telemetry_period_observed
- t+145.283s node 3: telemetry_bind - telemetry_live
- t+145.637s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=44, timeouts=0
- node 3; ACK->telemetry -33.625s; acquire->telemetry -33.781s
- node 6; ACK->telemetry -16.043s; acquire->telemetry -16.043s
- node 7; ACK->telemetry -24.450s; acquire->telemetry -24.555s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 27
- Drone telemetry rows: 644
- t+82.465s node 3: drone_debug_event telemetry_rf_loss_started
- t+82.465s node 3: drone_debug_status assigned_telemetry
- t+93.976s node 6: drone_debug_event telemetry_rf_loss_started
- t+93.976s node 6: drone_debug_status assigned_telemetry
- t+105.460s node 7: drone_debug_event telemetry_rf_loss_started
- t+105.460s node 7: drone_debug_status assigned_telemetry
- t+116.963s node 3: drone_debug_event telemetry_rf_loss_started
- t+116.963s node 3: drone_debug_status assigned_telemetry
- t+128.469s node 3: drone_debug_event telemetry_rf_loss_started
- t+128.469s node 3: drone_debug_status assigned_telemetry
- t+134.517s node 3: drone_debug_event join_runtime_reset
- t+134.517s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 15
- Short-loss event counts: short_loss_guard_started=8, short_loss_recovered=7
- Short-loss recovered observed gaps: count=7, avg=9.6, max=20
- Recent short-loss events: t+129.484s node 3 short_loss_guard_started miss=1 gap=-; t+130.464s node 3 short_loss_recovered miss=1 gap=11; t+131.318s node 7 short_loss_guard_started miss=1 gap=-; t+132.317s node 7 short_loss_recovered miss=1 gap=7; t+134.123s node 7 short_loss_guard_started miss=1 gap=-; t+134.876s node 3 short_loss_guard_started miss=1 gap=-; t+135.310s node 7 short_loss_recovered miss=1 gap=8; t+144.434s node 3 short_loss_recovered miss=1 gap=20

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=427, owed_rx_selected=425, owed_service_selected=425, owed_rx_cleared=395, owed_service_cleared=395, owed_rx_missed=9
- Scheduler-caused skips by node: 3=154, 6=197, 7=76
- Owed selections by node: 3=156, 6=194, 7=75
- Owed listens that still missed by node: 3=7, 6=2
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+150.111s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+150.259s node 3 owed_service_selected selected=3 owed=1 skips=1; t+150.259s node 3 owed_rx_cleared owed=1 skips=1; t+150.274s node 3 owed_service_cleared owed=1 skips=1; t+150.478s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+150.525s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+150.537s node 6 owed_service_selected selected=6 owed=1 skips=1; t+150.684s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+150.684s node 6 owed_rx_cleared owed=1 skips=1; t+150.684s node 6 owed_service_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 10032.1 | yes | - |

## RF-Loss Only Matrix
- Pass: 6/7
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | yes | - | - |
| 3 | 2 | 1 | yes | - | - |
| 6 | 2 | 1 | yes | - | - |
| 7 | 2 | 1 | yes | - | - |
| 3 | 4 | 1 | no | - | non_target_7_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 10766 | 182.1 | non_target_7_not_stable |

## Receiver Budget
- Events: owed_service_selected=425, owed_service_cleared=395, recovery_budget_used=97, recovery_budget_denied=44, healthy_service_protected=44
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=37, healthy_service_deadline_risk=7
- Recent denied recovery:
  - t+139.480s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+139.552s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+140.874s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+140.951s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+142.282s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+142.351s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+143.670s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+143.752s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+10.699s: mode `telemetry_first`
- Assigned packets received: 46
- Assigned RX coverage: 95%
- Sequence gap events: 40
- Missing sequence IDs: 54
- Max sequence gap: 10
- Assigned slot misses: 2
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 14%
- Receiver overloaded: False
- Recovery budget used: 13
- Recovery budget denied: 6
- Healthy service protected: 6
- Owed RX active: False node=0 count=0
- Fairness skips: 2
- Owed selections: 2
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 593
- node 6: t+3.836s seq 77 -> t+4.274s seq 79; missing [78]
- node 6: t+4.274s seq 79 -> t+5.624s seq 86; missing [80, 81, 82, 83, 84, 85]
- node 6: t+5.624s seq 86 -> t+6.045s seq 88; missing [87]
- node 6: t+6.045s seq 88 -> t+6.629s seq 90; missing [89]
- node 6: t+6.629s seq 90 -> t+7.019s seq 92; missing [91]
- node 6: t+7.019s seq 92 -> t+7.425s seq 94; missing [93]
- node 6: t+7.425s seq 94 -> t+7.832s seq 96; missing [95]
- node 6: t+7.832s seq 96 -> t+8.219s seq 98; missing [97]
- node 6: t+8.219s seq 98 -> t+8.506s seq 100; missing [99]
- node 6: t+8.506s seq 100 -> t+8.899s seq 102; missing [101]
- node 6: t+8.899s seq 102 -> t+9.299s seq 104; missing [103]
- node 6: t+9.299s seq 104 -> t+9.699s seq 106; missing [105]

## State Flicker
- Node 3: 1 rapid state transitions: t+3.924s offline->online
- Node 6: 1 rapid state transitions: t+3.836s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 2470
- drone_telemetry: 644
- assignment_event: 87
- bind_progress_event: 83
- assignments: 43
- inter_gc_status: 43
- bench_marker: 31
- drone_link_status: 27
- command: 24
- command_ack: 24
- search_event: 19
- drone_debug_status: 15
- telemetry_rebind_event: 15
- assignment_timing_hint: 14
- drone_debug_event: 12
- inter_gc_command_queued: 8
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
