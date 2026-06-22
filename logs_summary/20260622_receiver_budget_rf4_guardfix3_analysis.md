# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_rf4_guardfix3.jsonl`
- Parsed records: 2981
- Approx duration: 208.5s

## Commands
- Sent commands: 36
- ACKs: 36 (0 rejected)
- Derived ACK latency: min 16 ms, max 1213 ms, avg 192 ms
- Inter-GC queued command events: 6
- t+183.325s ACK drone/drone get_status accepted: -
- t+186.530s ACK drone/drone get_status accepted: -
- t+190.480s ACK drone/drone get_status accepted: -
- t+193.672s ACK drone/drone get_status accepted: -
- t+196.858s ACK drone/drone get_status accepted: -
- t+200.068s ACK drone/drone get_status accepted: -
- t+203.272s ACK drone/drone get_status accepted: -
- t+206.473s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 124
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
- Search events: 11
- Bind progress events: 48
- Assignment events: 60
- Assignment event counts: silence_sent=9, telemetry_period_observed=7, telemetry_period_locked=7, assign_sent=7, join_request_received=6, post_bind_acquire_timeout=6, join_ack_timeout=4, post_bind_first_telemetry=4, assign_created=3, assign_reused=2, join_ack_received=2, post_bind_acquire_started=2, telemetry_period_rejected=1
- Operator shared/discovery RX: starts=1, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+103.419s to t+103.419s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=2, active_ticks=0, joins=1, completes=1
- Auto shared RX scanner events: 1
- Auto shared RX complete reasons: join_handled
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=0, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+25.900s to t+25.900s
- t+101.729s node 3: quiet - assign_reused
- t+101.779s node 3: assign - silence_sent
- t+101.779s node 3: ack - assign_sent
- t+101.818s node 3: telemetry_bind - assignment_completed
- t+206.895s node 3: quiet - join_request_received
- t+206.945s node 3: quiet - assign_reused
- t+206.945s node 3: assign - silence_sent
- t+206.956s node 3: timing - telemetry_period_observed
- t+206.973s node 3: telemetry_bind - telemetry_live
- t+207.023s node 3: ack - assign_sent
- t+207.051s node 3: telemetry_bind - assignment_completed
- t+207.190s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=3, first_telemetry=8, timeouts=12
- node 3; ACK->telemetry -97.854s; acquire->telemetry -97.854s; timeouts=8
- node 6
- node 7; timeouts=4

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 37
- Drone telemetry rows: 1284
- t+169.582s node 3: drone_debug_status wait_assignment
- t+172.762s node 3: drone_debug_status wait_assignment
- t+176.933s node 3: drone_debug_status wait_assignment
- t+180.113s node 3: drone_debug_status backoff
- t+183.325s node 3: drone_debug_status wait_assignment
- t+186.530s node 3: drone_debug_status backoff
- t+190.480s node 3: drone_debug_status wait_assignment
- t+193.672s node 3: drone_debug_status backoff
- t+196.858s node 3: drone_debug_status wait_assignment
- t+200.068s node 3: drone_debug_status backoff
- t+203.272s node 3: drone_debug_status wait_assignment
- t+206.473s node 3: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 69
- Short-loss event counts: short_loss_guard_started=4, short_loss_recovered=3, short_loss_guard_active=1, short_loss_guard_expired=1
- Short-loss recovered observed gaps: count=3, avg=15.3, max=41
- Recent short-loss events: t+4.642s node 7 short_loss_guard_started miss=1 gap=-; t+4.945s node 3 short_loss_recovered miss=1 gap=2; t+5.028s node 7 short_loss_recovered miss=1 gap=3; t+110.364s node 3 short_loss_guard_started miss=1 gap=-; t+110.582s node 3 short_loss_guard_active miss=2 gap=-; t+118.351s node 3 short_loss_recovered miss=2 gap=41; t+140.215s node 3 short_loss_guard_started miss=1 gap=-; t+148.222s node 3 short_loss_guard_expired miss=2 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=119, owed_service_selected=119, rx_candidate_skipped=116, owed_rx_cleared=107, owed_service_cleared=107, owed_rx_missed=12
- Scheduler-caused skips by node: 3=34, 6=41, 7=41
- Owed selections by node: 3=42, 6=37, 7=40
- Owed listens that still missed by node: 3=10, 6=1, 7=1
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+152.171s node 3 owed_service_selected selected=3 owed=1 skips=1; t+152.379s node 7 rx_candidate_skipped selected=3 owed=2 skips=2; t+152.843s node 3 owed_rx_missed owed=1 skips=1; t+152.955s node 7 owed_rx_selected selected=7 owed=2 skips=2; t+153.034s node 7 owed_service_selected selected=7 owed=2 skips=2; t+153.034s node 7 owed_rx_cleared owed=2 skips=2; t+153.034s node 7 owed_service_cleared owed=2 skips=2; t+153.053s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+153.260s node 3 owed_service_selected selected=3 owed=1 skips=1; t+153.637s node 3 owed_rx_missed owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 9280.7 | yes | - |

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
| 3 | 9 | no | 61984.1 | -25.2 | non_target_6_not_stable,non_target_7_not_stable |

## Receiver Budget
- Events: owed_service_selected=119, owed_service_cleared=107, recovery_budget_denied=85, healthy_service_protected=85, recovery_budget_used=52
- Recovery denials by reason: healthy_service_deadline_risk=83, no_safe_recovery_slice_before_known_service=2
- Recent denied recovery:
  - t+142.250s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+142.339s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+142.437s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+142.554s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+142.638s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+142.746s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+142.848s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+142.965s target=3 protected=7 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.348s: mode `telemetry_first`
- Assigned packets received: 159
- Assigned RX coverage: 97%
- Sequence gap events: 156
- Missing sequence IDs: 160
- Max sequence gap: 3
- Assigned slot misses: 4
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 14%
- Receiver overloaded: False
- Recovery budget used: 10
- Recovery budget denied: 2
- Healthy service protected: 2
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 388
- node 7: t+3.842s seq 31 -> t+4.277s seq 33; missing [32]
- node 7: t+4.277s seq 33 -> t+5.159s seq 37; missing [34, 35, 36]
- node 7: t+5.159s seq 37 -> t+5.559s seq 39; missing [38]
- node 7: t+5.559s seq 39 -> t+5.950s seq 41; missing [40]
- node 7: t+5.950s seq 41 -> t+6.364s seq 43; missing [42]
- node 7: t+6.364s seq 43 -> t+6.758s seq 45; missing [44]
- node 7: t+6.758s seq 45 -> t+7.157s seq 47; missing [46]
- node 7: t+7.157s seq 47 -> t+7.558s seq 49; missing [48]
- node 7: t+7.558s seq 49 -> t+7.958s seq 51; missing [50]
- node 7: t+7.958s seq 51 -> t+8.358s seq 53; missing [52]
- node 7: t+8.358s seq 53 -> t+8.829s seq 55; missing [54]
- node 7: t+8.829s seq 55 -> t+9.234s seq 57; missing [56]

## State Flicker
- Node 3: 1 rapid state transitions: t+3.964s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 1284
- scanner_event: 1045
- inter_gc_status: 124
- telemetry_rebind_event: 69
- assignment_event: 60
- bind_progress_event: 48
- bench_marker: 39
- command: 36
- command_ack: 36
- drone_debug_status: 29
- drone_live_status: 21
- assignments: 21
- search_event: 11
- drone_link_status: 10
- drone_debug_event: 8
- assignment_timing_hint: 7
- inter_gc_command_queued: 6
- session_event: 2
- drone_join_event: 2
- gc_status: 1
