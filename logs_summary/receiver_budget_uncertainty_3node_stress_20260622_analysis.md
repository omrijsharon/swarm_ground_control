# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_uncertainty_3node_stress_20260622.jsonl`
- Parsed records: 3661
- Approx duration: 192.8s

## Commands
- Sent commands: 20
- ACKs: 20 (0 rejected)
- Derived ACK latency: min 23 ms, max 217 ms, avg 113 ms
- Inter-GC queued command events: 8
- t+34.767s ACK magc/magic_ground_control cancel_search accepted: -
- t+35.417s ACK magc/magic_ground_control start_search accepted: -
- t+36.633s ACK magc/magic_ground_control cancel_search accepted: -
- t+41.521s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+53.035s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+79.590s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+91.098s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+97.236s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 72
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
- Assignment event counts: telemetry_period_observed=5, telemetry_period_locked=5, join_request_received=3, assign_created=3, post_bind_first_telemetry=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3, telemetry_period_rejected=1
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+31.825s to t+35.775s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+10.865s to t+45.378s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+25.672s node 7: ack - assign_sent
- t+25.791s node 7: timing - telemetry_period_rejected
- t+25.820s node 7: telemetry_bind - assignment_completed
- t+26.009s node 7: complete - telemetry_period_locked
- t+31.018s node 6: quiet - join_request_received
- t+31.018s node 6: quiet - assign_created
- t+31.030s node 6: timing - telemetry_period_observed
- t+31.044s node 6: telemetry_bind - telemetry_live
- t+31.208s node 6: assign - silence_sent
- t+31.208s node 6: ack - assign_sent
- t+31.270s node 6: complete - telemetry_period_locked
- t+31.388s node 6: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -0.289s; acquire->telemetry -0.289s
- node 6; ACK->telemetry -27.491s; acquire->telemetry -27.491s
- node 7; ACK->telemetry -21.881s; acquire->telemetry -21.882s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 19
- Drone telemetry rows: 628
- t+11.000s node 7: drone_debug_event reboot_scheduled
- t+11.000s node 7: drone_debug_status assigned_telemetry
- t+41.520s node 3: drone_debug_event telemetry_rf_loss_started
- t+41.521s node 3: drone_debug_status assigned_telemetry
- t+53.035s node 6: drone_debug_event telemetry_rf_loss_started
- t+53.035s node 6: drone_debug_status assigned_telemetry
- t+79.590s node 7: drone_debug_event telemetry_rf_loss_started
- t+79.590s node 7: drone_debug_status assigned_telemetry
- t+91.098s node 3: drone_debug_event telemetry_rf_loss_started
- t+91.098s node 3: drone_debug_status assigned_telemetry
- t+97.236s node 3: drone_debug_event join_runtime_reset
- t+97.236s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 11
- Short-loss event counts: short_loss_guard_started=6, short_loss_recovered=5
- Short-loss recovered observed gaps: count=5, avg=27.4, max=109
- Recent short-loss events: t+80.576s node 7 short_loss_recovered miss=1 gap=5; t+91.867s node 3 short_loss_guard_started miss=1 gap=-; t+92.998s node 3 short_loss_recovered miss=1 gap=11; t+98.470s node 3 short_loss_guard_started miss=1 gap=-; t+102.861s node 6 short_loss_guard_started miss=1 gap=-; t+103.642s node 6 short_loss_recovered miss=1 gap=6; t+149.861s node 6 short_loss_guard_started miss=1 gap=-; t+150.641s node 6 short_loss_recovered miss=1 gap=6

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=269, owed_rx_selected=268, owed_service_selected=268, owed_rx_cleared=261, owed_service_cleared=261, owed_rx_missed=4
- Scheduler-caused skips by node: 3=44, 6=100, 7=125
- Owed selections by node: 3=48, 6=96, 7=124
- Owed listens that still missed by node: 3=4
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+192.205s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+192.411s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+192.424s node 7 owed_service_selected selected=7 owed=1 skips=1; t+192.437s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+192.577s node 7 owed_rx_cleared owed=1 skips=1; t+192.591s node 7 owed_service_cleared owed=1 skips=1; t+192.605s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+192.617s node 6 owed_service_selected selected=6 owed=1 skips=1; t+192.825s node 6 owed_rx_cleared owed=1 skips=1; t+192.825s node 6 owed_service_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 9776.2 | yes | - |

## RF-Loss Only Matrix
- Pass: 2/3
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | no | - | non_target_6_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join |

## Receiver Budget
- Events: owed_service_selected=268, owed_service_cleared=261, recovery_budget_used=243, recovery_budget_denied=213, healthy_service_protected=213
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=206, healthy_service_deadline_risk=7
- Recent denied recovery:
  - t+186.947s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+187.170s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+188.546s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+188.769s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+190.145s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+190.371s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+191.746s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+191.970s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+10.309s: mode `telemetry_first`
- Assigned packets received: 12
- Assigned RX coverage: 80%
- Sequence gap events: 9
- Missing sequence IDs: 52
- Max sequence gap: 11
- Assigned slot misses: 3
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 17%
- Receiver overloaded: False
- Recovery budget used: 25
- Recovery budget denied: 8
- Healthy service protected: 8
- Owed RX active: True node=7 count=1
- Fairness skips: 2
- Owed selections: 2
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 589
- node 6: t+3.739s seq 79 -> t+6.174s seq 91; missing [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
- node 6: t+6.174s seq 91 -> t+7.324s seq 97; missing [92, 93, 94, 95, 96]
- node 6: t+7.324s seq 97 -> t+8.725s seq 104; missing [98, 99, 100, 101, 102, 103]
- node 6: t+8.725s seq 104 -> t+10.125s seq 111; missing [105, 106, 107, 108, 109, 110]
- node 6: t+10.125s seq 111 -> t+31.057s seq 4; missing [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, +17 more]
- node 6: t+31.284s seq 5 -> t+31.839s seq 8; missing [6, 7]
- node 6: t+31.839s seq 8 -> t+32.456s seq 11; missing [9, 10]
- node 6: t+32.456s seq 11 -> t+33.036s seq 14; missing [12, 13]
- node 6: t+33.036s seq 14 -> t+33.636s seq 17; missing [15, 16]
- node 6: t+33.636s seq 17 -> t+34.239s seq 20; missing [18, 19]
- node 6: t+34.239s seq 20 -> t+34.847s seq 23; missing [21, 22]
- node 6: t+34.847s seq 23 -> t+35.444s seq 26; missing [24, 25]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 2629
- drone_telemetry: 628
- inter_gc_status: 72
- assignment_event: 32
- bind_progress_event: 29
- bench_marker: 23
- command: 20
- command_ack: 20
- search_event: 17
- assignments: 16
- drone_debug_status: 11
- telemetry_rebind_event: 11
- inter_gc_command_queued: 8
- drone_debug_event: 8
- drone_link_status: 6
- assignment_timing_hint: 5
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
