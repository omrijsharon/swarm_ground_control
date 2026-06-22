# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_budgetgate1.jsonl`
- Parsed records: 3481
- Approx duration: 208.1s

## Commands
- Sent commands: 46
- ACKs: 46 (0 rejected)
- Derived ACK latency: min 27 ms, max 1350 ms, avg 264 ms
- Inter-GC queued command events: 6
- t+180.132s ACK drone/drone get_status accepted: -
- t+182.030s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+188.116s ACK drone/drone debug_restart_join accepted: -
- t+192.367s ACK drone/drone get_status accepted: -
- t+195.671s ACK drone/drone get_status accepted: -
- t+198.818s ACK drone/drone get_status accepted: -
- t+202.019s ACK drone/drone get_status accepted: -
- t+205.285s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 125
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
- Search events: 25
- Bind progress events: 58
- Assignment events: 66
- Assignment event counts: silence_sent=9, assign_sent=8, telemetry_period_observed=7, post_bind_first_telemetry=7, telemetry_period_locked=7, join_request_received=7, join_ack_received=6, post_bind_acquire_started=6, assign_reused=4, assign_created=3, join_ack_timeout=2
- Operator shared/discovery RX: starts=2, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+63.870s to t+65.454s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=3, active_ticks=0, joins=1, completes=1
- Auto shared RX scanner events: 2
- Auto shared RX complete reasons: join_handled
- Empty-assignment shared RX: starts=1, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+32.928s to t+77.490s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+180.651s node 6: quiet - assign_reused
- t+180.651s node 6: assign - silence_sent
- t+180.729s node 6: ack - assign_sent
- t+180.729s node 6: telemetry_bind - assignment_completed
- t+205.069s node 7: timing - telemetry_period_observed
- t+205.082s node 7: telemetry_bind - telemetry_live
- t+205.305s node 7: complete - telemetry_period_locked
- t+206.562s node 7: quiet - join_request_received
- t+206.562s node 7: quiet - assign_reused
- t+206.623s node 7: assign - silence_sent
- t+206.623s node 7: ack - assign_sent
- t+206.861s node 7: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=11, first_telemetry=14, timeouts=0
- node 3; ACK->telemetry -0.172s; acquire->telemetry -0.172s
- node 6; ACK->telemetry -53.881s; acquire->telemetry -53.881s
- node 7; ACK->telemetry -0.396s; acquire->telemetry -0.396s

## Drone Debug
- Drone JOIN events: 6
- JOIN event counts: join_start_shared_channel=3, join_backoff=3
- JOIN backoff kinds: first_fast=3
- Drone debug events/status rows: 51
- Drone telemetry rows: 1113
- t+173.686s node 6: drone_debug_status wait_assignment
- t+176.900s node 6: drone_debug_status assigned_telemetry
- t+180.132s node 6: drone_debug_status assigned_telemetry
- t+182.030s node 7: drone_debug_event telemetry_rf_loss_started
- t+182.030s node 7: drone_debug_status assigned_telemetry
- t+188.116s node 7: drone_debug_event join_runtime_reset
- t+188.116s node 7: drone_debug_status backoff
- t+192.367s node 7: drone_debug_status wait_assignment
- t+195.672s node 7: drone_debug_status wait_assignment
- t+198.818s node 7: drone_debug_status wait_assignment
- t+202.019s node 7: drone_debug_status wait_assignment
- t+205.285s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 64
- Short-loss event counts: short_loss_guard_started=5, short_loss_guard_expired=2, short_loss_recovered=2
- Short-loss recovered observed gaps: count=2, avg=29.5, max=30
- Recent short-loss events: t+108.387s node 3 short_loss_guard_expired miss=2 gap=-; t+139.514s node 6 short_loss_guard_started miss=1 gap=-; t+144.059s node 6 short_loss_recovered miss=2 gap=29; t+144.675s node 6 short_loss_guard_started miss=1 gap=-; t+149.105s node 6 short_loss_guard_expired miss=2 gap=-; t+182.104s node 7 short_loss_guard_started miss=1 gap=-; t+187.899s node 7 short_loss_recovered miss=1 gap=30; t+189.347s node 7 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=197, owed_service_selected=197, rx_candidate_skipped=191, owed_rx_cleared=182, owed_service_cleared=182, owed_rx_missed=16
- Scheduler-caused skips by node: 3=61, 6=64, 7=66
- Owed selections by node: 3=65, 6=65, 7=67
- Owed listens that still missed by node: 3=10, 6=3, 7=3
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+189.347s node 7 owed_rx_missed owed=1 skips=1; t+189.387s node 3 owed_rx_selected selected=3 owed=2 skips=2; t+189.387s node 3 owed_service_selected selected=3 owed=2 skips=2; t+189.399s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+189.575s node 3 owed_rx_cleared owed=2 skips=2; t+189.575s node 3 owed_service_cleared owed=2 skips=2; t+189.601s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+189.601s node 6 owed_service_selected selected=6 owed=1 skips=1; t+189.707s node 6 owed_rx_cleared owed=1 skips=1; t+189.707s node 6 owed_service_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 8605.3 | yes | - |

## RF-Loss Only Matrix
- Pass: 3/3
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 4 | 1 | yes | - | - |
| 6 | 4 | 1 | yes | - | - |
| 7 | 4 | 1 | yes | - | - |

## Multi-Drone Broken-Link Markers
- Pass: 3/3
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 28283.6 | -1352.8 | - |
| 6 | 9 | yes | 49 | -36451.1 | - |
| 7 | 9 | yes | 16991.1 | -1590.5 | - |

## Receiver Budget
- Events: recovery_budget_denied=208, healthy_service_protected=208, owed_service_selected=197, owed_service_cleared=182, recovery_budget_used=25
- Recovery denials by reason: healthy_service_deadline_risk=187, no_safe_recovery_slice_before_known_service=21
- Recent denied recovery:
  - t+198.315s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+198.512s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+198.525s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+198.895s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+198.921s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+199.296s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+199.518s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+199.651s target=7 protected=6 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.836s: mode `telemetry_first`
- Assigned packets received: 99
- Assigned RX coverage: 97%
- Sequence gap events: 5
- Missing sequence IDs: 13
- Max sequence gap: 3
- Assigned slot misses: 3
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 5%
- Receiver overloaded: False
- Recovery budget used: 10
- Recovery budget denied: 98
- Healthy service protected: 98
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 561
- node 6: t+3.607s seq 87 -> t+4.368s seq 91; missing [88, 89, 90]
- node 6: t+4.368s seq 91 -> t+5.168s seq 95; missing [92, 93, 94]
- node 6: t+5.168s seq 95 -> t+5.968s seq 99; missing [96, 97, 98]
- node 6: t+5.968s seq 99 -> t+6.568s seq 102; missing [100, 101]
- node 6: t+6.568s seq 102 -> t+7.165s seq 105; missing [103, 104]
- node 6: t+27.572s seq 207 -> t+56.903s seq 3; missing [208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, +17 more]
- node 6: t+57.115s seq 4 -> t+57.682s seq 6; missing [5]
- node 6: t+57.682s seq 6 -> t+57.873s seq 8; missing [7]
- node 6: t+57.873s seq 8 -> t+58.264s seq 10; missing [9]
- node 6: t+58.264s seq 10 -> t+58.871s seq 12; missing [11]
- node 6: t+58.871s seq 12 -> t+59.073s seq 14; missing [13]
- node 6: t+59.073s seq 14 -> t+59.669s seq 16; missing [15]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1632
- drone_telemetry: 1113
- inter_gc_status: 125
- assignment_event: 66
- telemetry_rebind_event: 64
- bind_progress_event: 58
- bench_marker: 52
- command: 46
- command_ack: 46
- drone_debug_status: 39
- drone_live_status: 27
- search_event: 25
- assignments: 24
- drone_debug_event: 12
- drone_link_status: 9
- assignment_timing_hint: 7
- inter_gc_command_queued: 6
- drone_join_event: 6
- gc_status: 1
- session_event: 1
