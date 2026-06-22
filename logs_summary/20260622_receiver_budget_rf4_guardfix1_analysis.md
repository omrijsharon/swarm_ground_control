# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_rf4_guardfix1.jsonl`
- Parsed records: 1540
- Approx duration: 119.1s

## Commands
- Sent commands: 21
- ACKs: 21 (0 rejected)
- Derived ACK latency: min 37 ms, max 11546 ms, avg 1231 ms
- Inter-GC queued command events: 6
- t+72.001s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+81.554s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+91.027s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+100.502s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+106.603s ACK drone/drone debug_restart_join accepted: -
- t+111.005s ACK drone/drone get_status accepted: -
- t+114.246s ACK drone/drone get_status accepted: -
- t+117.367s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 45
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 1
- Fragment samples: t+63.009s telegc: tive","reason":"assignment_created","frequencyMhz":912,"channelIndex":19,"radioProfileId":0,"txPeriodMs":200,"g{"type":"

## Bind And Search
- Search events: 11
- Bind progress events: 29
- Assignment events: 34
- Assignment event counts: silence_sent=5, telemetry_period_observed=4, post_bind_first_telemetry=4, telemetry_period_locked=4, assign_sent=4, join_request_received=3, assign_created=2, join_ack_timeout=2, join_ack_received=2, post_bind_acquire_started=2, assign_reused=1, telemetry_period_rejected=1
- Operator shared/discovery RX: starts=2, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+63.384s to t+65.186s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+37.227s to t+76.957s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+62.687s node 3: assign - silence_sent
- t+62.786s node 3: ack - assign_sent
- t+62.786s node 3: complete - telemetry_period_locked
- t+117.539s node 3: quiet - join_request_received
- t+117.539s node 3: quiet - assign_reused
- t+117.601s node 3: assign - silence_sent
- t+117.664s node 3: ack - assign_sent
- t+117.724s node 3: timing - telemetry_period_observed
- t+117.737s node 3: telemetry_bind - telemetry_live
- t+117.908s node 3: telemetry_bind - assignment_completed
- t+117.921s node 3: timing - telemetry_period_rejected
- t+118.141s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=4, first_telemetry=8, timeouts=0
- node 3; ACK->telemetry -0.389s; acquire->telemetry -0.389s
- node 6
- node 7

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 22
- Drone telemetry rows: 293
- t+72.001s node 3: drone_debug_status assigned_telemetry
- t+81.554s node 6: drone_debug_event telemetry_rf_loss_started
- t+81.554s node 6: drone_debug_status assigned_telemetry
- t+91.027s node 7: drone_debug_event telemetry_rf_loss_started
- t+91.027s node 7: drone_debug_status assigned_telemetry
- t+100.502s node 3: drone_debug_event telemetry_rf_loss_started
- t+100.502s node 3: drone_debug_status assigned_telemetry
- t+106.603s node 3: drone_debug_event join_runtime_reset
- t+106.604s node 3: drone_debug_status backoff
- t+111.005s node 3: drone_debug_status wait_assignment
- t+114.246s node 3: drone_debug_status wait_assignment
- t+117.367s node 3: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 12
- Short-loss event counts: short_loss_guard_started=4, short_loss_recovered=3, short_loss_guard_expired=1
- Short-loss recovered observed gaps: count=3, avg=34.3, max=37
- Recent short-loss events: t+72.846s node 3 short_loss_guard_started miss=1 gap=-; t+79.189s node 3 short_loss_recovered miss=1 gap=37; t+82.423s node 6 short_loss_guard_started miss=1 gap=-; t+88.354s node 6 short_loss_recovered miss=1 gap=35; t+91.662s node 7 short_loss_guard_started miss=1 gap=-; t+96.990s node 7 short_loss_recovered miss=1 gap=31; t+101.245s node 3 short_loss_guard_started miss=1 gap=-; t+107.261s node 3 short_loss_guard_expired miss=2 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=124, owed_rx_selected=113, owed_service_selected=113, owed_rx_cleared=97, owed_service_cleared=97, owed_rx_missed=14
- Scheduler-caused skips by node: 3=36, 6=44, 7=44
- Owed selections by node: 3=40, 6=39, 7=34
- Owed listens that still missed by node: 3=11, 6=2, 7=1
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+113.171s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+113.202s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+113.216s node 6 owed_service_selected selected=6 owed=1 skips=1; t+113.350s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+113.350s node 6 owed_rx_cleared owed=1 skips=1; t+113.350s node 6 owed_service_cleared owed=1 skips=1; t+113.376s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+113.577s node 7 owed_service_selected selected=7 owed=1 skips=1; t+113.589s node 7 owed_rx_cleared owed=1 skips=1; t+113.589s node 7 owed_service_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 8798.4 | yes | - |

## RF-Loss Only Matrix
- Pass: 3/3
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 4 | 1 | yes | - | - |
| 6 | 4 | 1 | yes | - | - |
| 7 | 4 | 1 | yes | - | - |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 11157.7 | 97.3 | non_target_6_not_stable,non_target_7_not_stable |

## Receiver Budget
- Events: owed_service_selected=113, owed_service_cleared=97, recovery_budget_denied=56, healthy_service_protected=56
- Recovery denials by reason: healthy_service_deadline_risk=56
- Recent denied recovery:
  - t+102.564s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+102.804s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+102.955s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+103.202s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+103.370s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+103.598s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+103.764s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+104.003s target=3 protected=6 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+36.682s: mode `waiting_assignments`
- Assigned packets received: 0
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 0%
- Receiver overloaded: False
- Recovery budget used: 0
- Recovery budget denied: 0
- Healthy service protected: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: waiting_assignments=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 268
- node 6: t+57.167s seq 63 -> t+57.754s seq 66; missing [64, 65]
- node 6: t+57.754s seq 66 -> t+58.153s seq 68; missing [67]
- node 6: t+58.153s seq 68 -> t+58.749s seq 70; missing [69]
- node 6: t+58.749s seq 70 -> t+58.956s seq 72; missing [71]
- node 6: t+58.956s seq 72 -> t+59.559s seq 74; missing [73]
- node 6: t+59.559s seq 74 -> t+59.755s seq 76; missing [75]
- node 6: t+59.755s seq 76 -> t+60.357s seq 78; missing [77]
- node 6: t+60.357s seq 78 -> t+60.556s seq 80; missing [79]
- node 6: t+60.556s seq 80 -> t+61.156s seq 82; missing [81]
- node 6: t+61.156s seq 82 -> t+61.355s seq 84; missing [83]
- node 6: t+61.355s seq 84 -> t+61.951s seq 86; missing [85]
- node 6: t+61.951s seq 86 -> t+62.214s seq 88; missing [87]

## Transport Findings
- Suspicious JSON fragments: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 777
- drone_telemetry: 293
- inter_gc_status: 45
- assignment_event: 34
- bind_progress_event: 29
- bench_marker: 24
- command: 21
- command_ack: 21
- assignments: 16
- drone_debug_status: 14
- telemetry_rebind_event: 12
- search_event: 11
- drone_debug_event: 8
- drone_live_status: 6
- inter_gc_command_queued: 6
- drone_link_status: 4
- assignment_timing_hint: 4
- session_event: 2
- drone_join_event: 2
- gc_status: 1
