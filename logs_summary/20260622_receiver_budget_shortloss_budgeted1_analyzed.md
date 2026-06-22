# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_shortloss_budgeted1.jsonl`
- Parsed records: 2064
- Approx duration: 99.5s

## Commands
- Sent commands: 20
- ACKs: 20 (0 rejected)
- Derived ACK latency: min 24 ms, max 1238 ms, avg 198 ms
- Inter-GC queued command events: 2
- t+61.125s ACK drone/drone get_status accepted: -
- t+69.098s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+75.143s ACK drone/drone debug_restart_join accepted: -
- t+78.435s ACK drone/drone get_status accepted: -
- t+82.768s ACK drone/drone get_status accepted: -
- t+85.931s ACK drone/drone get_status accepted: -
- t+90.082s ACK drone/drone get_status accepted: -
- t+93.238s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 58
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
- Search events: 16
- Bind progress events: 47
- Assignment events: 52
- Assignment event counts: telemetry_period_observed=8, telemetry_period_locked=8, post_bind_first_telemetry=5, join_request_received=5, silence_sent=5, assign_sent=5, join_ack_received=5, post_bind_acquire_started=5, assign_created=3, assign_reused=2, telemetry_period_rejected=1
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Auto shared RX scanner events: 1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=7, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+26.133s to t+74.698s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+63.013s node 3: quiet - assign_reused
- t+63.113s node 3: assign - silence_sent
- t+63.113s node 3: ack - assign_sent
- t+63.309s node 3: telemetry_bind - assignment_completed
- t+93.728s node 6: quiet - join_request_received
- t+93.772s node 6: quiet - assign_reused
- t+93.849s node 6: assign - silence_sent
- t+93.849s node 6: ack - assign_sent
- t+93.888s node 6: telemetry_bind - assignment_completed
- t+93.900s node 6: timing - telemetry_period_observed
- t+93.912s node 6: telemetry_bind - telemetry_live
- t+94.115s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=9, first_telemetry=10, timeouts=0
- node 3; ACK->telemetry -35.472s; acquire->telemetry -35.472s
- node 6; ACK->telemetry -44.345s; acquire->telemetry -44.345s
- node 7; ACK->telemetry -30.701s; acquire->telemetry -30.701s

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 24
- Drone telemetry rows: 504
- t+54.812s node 3: drone_debug_status backoff
- t+57.993s node 3: drone_debug_status wait_assignment
- t+61.125s node 3: drone_debug_status assigned_telemetry
- t+69.098s node 6: drone_debug_event telemetry_rf_loss_started
- t+69.098s node 6: drone_debug_status assigned_telemetry
- t+75.143s node 6: drone_debug_event join_runtime_reset
- t+75.143s node 6: drone_debug_status backoff
- t+78.435s node 6: drone_debug_status backoff
- t+82.768s node 6: drone_debug_status wait_assignment
- t+85.932s node 6: drone_debug_status backoff
- t+90.083s node 6: drone_debug_status wait_assignment
- t+93.238s node 6: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 18
- Short-loss event counts: short_loss_guard_started=3, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=10.0, max=10
- Recent short-loss events: t+4.379s node 3 short_loss_guard_started miss=1 gap=-; t+6.360s node 3 short_loss_recovered miss=1 gap=10; t+49.416s node 3 short_loss_guard_started miss=1 gap=-; t+70.294s node 6 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=162, owed_rx_selected=159, owed_service_selected=159, owed_rx_cleared=150, owed_service_cleared=150, owed_rx_missed=4
- Scheduler-caused skips by node: 3=57, 6=47, 7=58
- Owed selections by node: 3=52, 6=48, 7=59
- Owed listens that still missed by node: 3=2, 6=2
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+98.881s node 7 owed_service_cleared owed=1 skips=1; t+99.099s node 7 rx_candidate_skipped selected=3 owed=1 skips=1; t+99.132s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+99.145s node 7 owed_service_selected selected=7 owed=1 skips=1; t+99.306s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+99.306s node 7 owed_rx_cleared owed=1 skips=1; t+99.306s node 7 owed_service_cleared owed=1 skips=1; t+99.332s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+99.482s node 6 owed_service_selected selected=6 owed=1 skips=1; t+99.482s node 3 rx_candidate_skipped selected=6 owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 1/2
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 8818.9 | 396.6 | - |
| 6 | 9 | no | 18769.3 | 63.5 | non_target_3_not_stable,non_target_7_not_stable |

## Receiver Budget
- Events: owed_service_selected=159, owed_service_cleared=150, recovery_budget_denied=84, healthy_service_protected=84, recovery_budget_used=13
- Recovery denials by reason: healthy_service_deadline_risk=83, no_safe_recovery_slice_before_known_service=1
- Recent denied recovery:
  - t+76.731s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+76.920s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+77.114s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+77.319s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+77.525s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+77.717s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+77.921s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+78.139s target=6 protected=7 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.286s: mode `telemetry_first`
- Assigned packets received: 151
- Assigned RX coverage: 95%
- Sequence gap events: 134
- Missing sequence IDs: 167
- Max sequence gap: 10
- Assigned slot misses: 7
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 38%
- Receiver overloaded: False
- Recovery budget used: 13
- Recovery budget denied: 3
- Healthy service protected: 3
- Owed RX active: True node=6 count=1
- Fairness skips: 103
- Owed selections: 100
- Owed misses: 0
- Max scheduler skips: 2
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 383
- node 7: t+3.908s seq 71 -> t+4.924s seq 76; missing [72, 73, 74, 75]
- node 7: t+4.924s seq 76 -> t+5.292s seq 78; missing [77]
- node 7: t+5.292s seq 78 -> t+5.712s seq 80; missing [79]
- node 7: t+5.712s seq 80 -> t+6.114s seq 82; missing [81]
- node 7: t+6.114s seq 82 -> t+6.499s seq 84; missing [83]
- node 7: t+6.499s seq 84 -> t+7.068s seq 86; missing [85]
- node 7: t+7.068s seq 86 -> t+7.301s seq 88; missing [87]
- node 7: t+7.301s seq 88 -> t+7.961s seq 91; missing [89, 90]
- node 7: t+7.961s seq 91 -> t+8.313s seq 93; missing [92]
- node 7: t+8.313s seq 93 -> t+8.754s seq 95; missing [94]
- node 7: t+8.754s seq 95 -> t+9.106s seq 97; missing [96]
- node 7: t+9.106s seq 97 -> t+9.561s seq 99; missing [98]

## State Flicker
- Node 3: 1 rapid state transitions: t+3.985s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1119
- drone_telemetry: 504
- inter_gc_status: 58
- assignment_event: 52
- bind_progress_event: 47
- bench_marker: 22
- command: 20
- command_ack: 20
- telemetry_rebind_event: 18
- drone_debug_status: 17
- assignments: 16
- search_event: 16
- drone_live_status: 10
- drone_link_status: 9
- assignment_timing_hint: 8
- drone_debug_event: 7
- drone_join_event: 4
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
