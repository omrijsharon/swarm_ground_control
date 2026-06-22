# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_final_abuse_3node_contractfix2.jsonl`
- Parsed records: 5571
- Approx duration: 253.0s

## Commands
- Sent commands: 54
- ACKs: 54 (0 rejected)
- Derived ACK latency: min 27 ms, max 1198 ms, avg 200 ms
- Inter-GC queued command events: 12
- t+226.286s ACK drone/drone get_status accepted: -
- t+230.394s ACK drone/drone get_status accepted: -
- t+233.668s ACK drone/drone get_status accepted: -
- t+237.309s ACK drone/drone get_status accepted: -
- t+240.557s ACK drone/drone get_status accepted: -
- t+243.853s ACK drone/drone get_status accepted: -
- t+246.922s ACK drone/drone get_status accepted: -
- t+250.156s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 151
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Suspicious JSON fragment lines: 0
- Malformed samples: t+44.717s telegc: {"type":"drone_telemetry","sourceRole":"telemetry_ground_control","nodeId":6,"lat":32.0638139,"lng":34.8479971,"alt":0,"

## Bind And Search
- Search events: 19
- Bind progress events: 35
- Assignment events: 39
- Assignment event counts: telemetry_period_observed=6, post_bind_first_telemetry=6, telemetry_period_locked=6, silence_sent=5, assign_sent=4, join_request_received=3, assign_created=3, join_ack_timeout=2, join_ack_received=2, post_bind_acquire_started=2
- Operator shared/discovery RX: starts=5, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+54.399s to t+62.031s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Auto shared RX scanner events: 1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=4, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+26.026s to t+67.809s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+48.465s node 7: telemetry_bind - telemetry_live
- t+48.633s node 7: ack - assign_sent
- t+48.674s node 7: complete - telemetry_period_locked
- t+48.789s node 7: telemetry_bind - assignment_completed
- t+53.441s node 3: quiet - join_request_received
- t+53.595s node 3: quiet - assign_created
- t+53.595s node 3: assign - silence_sent
- t+53.608s node 3: timing - telemetry_period_observed
- t+53.621s node 3: telemetry_bind - telemetry_live
- t+53.799s node 3: ack - assign_sent
- t+53.942s node 3: complete - telemetry_period_locked
- t+54.031s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=4, first_telemetry=12, timeouts=0
- node 3; ACK->telemetry -49.814s; acquire->telemetry -49.814s
- node 6
- node 7; ACK->telemetry -44.343s; acquire->telemetry -44.343s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 53
- Drone telemetry rows: 1155
- t+213.790s node 3: drone_debug_status backoff
- t+216.866s node 3: drone_debug_status wait_assignment
- t+219.956s node 3: drone_debug_status backoff
- t+223.213s node 3: drone_debug_status wait_assignment
- t+226.286s node 3: drone_debug_status backoff
- t+230.395s node 3: drone_debug_status wait_assignment
- t+233.668s node 3: drone_debug_status backoff
- t+237.310s node 3: drone_debug_status wait_assignment
- t+240.557s node 3: drone_debug_status backoff
- t+243.853s node 3: drone_debug_status backoff
- t+246.922s node 3: drone_debug_status wait_assignment
- t+250.156s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 94
- Short-loss event counts: short_loss_guard_started=4, short_loss_recovered=3
- Short-loss recovered observed gaps: count=3, avg=4.0, max=5
- Recent short-loss events: t+57.679s node 7 short_loss_guard_started miss=1 gap=-; t+57.837s node 7 short_loss_recovered miss=1 gap=2; t+70.219s node 3 short_loss_guard_started miss=1 gap=-; t+70.816s node 3 short_loss_recovered miss=1 gap=5; t+100.239s node 6 short_loss_guard_started miss=1 gap=-; t+100.827s node 6 short_loss_recovered miss=1 gap=5; t+116.061s node 3 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=704, owed_service_selected=704, rx_candidate_skipped=702, owed_rx_cleared=698, owed_service_cleared=697, owed_rx_missed=3
- Scheduler-caused skips by node: 3=78, 6=311, 7=313
- Owed selections by node: 3=80, 6=312, 7=312
- Owed listens that still missed by node: 3=3
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+252.431s node 6 owed_service_cleared owed=1 skips=1; t+252.629s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+252.629s node 7 owed_service_selected selected=7 owed=1 skips=1; t+252.642s node 7 owed_rx_cleared owed=1 skips=1; t+252.642s node 7 owed_service_cleared owed=1 skips=1; t+252.825s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+252.838s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+252.850s node 7 owed_service_selected selected=7 owed=1 skips=1; t+253.037s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+253.037s node 7 owed_rx_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 15773.9 | yes | - |

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
| 3 | 4 | 1 | no | - | target_not_fresh_after_rf_loss |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join |

## Receiver Budget
- Events: owed_service_selected=704, owed_service_cleared=697, recovery_budget_denied=24, healthy_service_protected=24, recovery_budget_used=3
- Recovery denials by reason: healthy_service_deadline_risk=24
- Recent denied recovery:
  - t+121.664s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+121.888s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+122.476s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+122.865s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+123.079s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+123.667s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+124.068s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+124.299s target=3 protected=6 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.305s: mode `telemetry_first`
- Assigned packets received: 107
- Assigned RX coverage: 100%
- Sequence gap events: 104
- Missing sequence IDs: 208
- Max sequence gap: 3
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 30%
- Receiver overloaded: False
- Recovery budget used: 0
- Recovery budget denied: 0
- Healthy service protected: 0
- Owed RX active: True node=6 count=1
- Fairness skips: 54
- Owed selections: 53
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 1124
- node 3: t+3.985s seq 43 -> t+4.734s seq 46; missing [44, 45]
- node 3: t+4.734s seq 46 -> t+5.360s seq 50; missing [47, 48, 49]
- node 3: t+5.360s seq 50 -> t+5.957s seq 53; missing [51, 52]
- node 3: t+5.957s seq 53 -> t+6.692s seq 56; missing [54, 55]
- node 3: t+6.692s seq 56 -> t+7.161s seq 59; missing [57, 58]
- node 3: t+7.161s seq 59 -> t+7.901s seq 62; missing [60, 61]
- node 3: t+7.901s seq 62 -> t+8.362s seq 65; missing [63, 64]
- node 3: t+8.362s seq 65 -> t+9.097s seq 68; missing [66, 67]
- node 3: t+9.097s seq 68 -> t+9.561s seq 71; missing [69, 70]
- node 3: t+9.561s seq 71 -> t+10.301s seq 74; missing [72, 73]
- node 3: t+10.301s seq 74 -> t+10.760s seq 77; missing [75, 76]
- node 3: t+10.760s seq 77 -> t+11.501s seq 80; missing [78, 79]

## Transport Findings
- Malformed serial JSON payloads: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 3654
- drone_telemetry: 1155
- inter_gc_status: 151
- telemetry_rebind_event: 94
- bench_marker: 59
- command: 54
- command_ack: 54
- drone_debug_status: 41
- assignment_event: 39
- bind_progress_event: 35
- drone_live_status: 29
- assignments: 20
- search_event: 19
- inter_gc_command_queued: 12
- drone_debug_event: 12
- drone_link_status: 6
- assignment_timing_hint: 6
- session_event: 2
- drone_join_event: 2
- gc_status: 1
