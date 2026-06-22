# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_final_abuse_3node_contractfix.jsonl`
- Parsed records: 2959
- Approx duration: 197.7s

## Commands
- Sent commands: 49
- ACKs: 49 (0 rejected)
- Derived ACK latency: min 32 ms, max 1258 ms, avg 142 ms
- Inter-GC queued command events: 12
- t+173.178s ACK drone/drone get_status accepted: -
- t+176.439s ACK drone/drone get_status accepted: -
- t+179.627s ACK drone/drone get_status accepted: -
- t+182.878s ACK drone/drone get_status accepted: -
- t+186.092s ACK drone/drone get_status accepted: -
- t+189.291s ACK drone/drone get_status accepted: -
- t+192.522s ACK drone/drone get_status accepted: -
- t+195.743s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 130
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
- Search events: 22
- Bind progress events: 32
- Assignment events: 35
- Assignment event counts: telemetry_period_observed=6, telemetry_period_locked=6, join_request_received=3, assign_created=3, post_bind_first_telemetry=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3, telemetry_period_rejected=2
- Operator shared/discovery RX: starts=5, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+44.680s to t+51.890s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Auto shared RX scanner events: 1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+25.835s to t+57.887s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+38.810s node 7: ack - assign_sent
- t+38.957s node 7: complete - telemetry_period_locked
- t+39.019s node 7: telemetry_bind - assignment_completed
- t+43.503s node 3: timing - telemetry_period_observed
- t+43.517s node 3: telemetry_bind - telemetry_live
- t+43.685s node 3: quiet - join_request_received
- t+43.686s node 3: quiet - assign_created
- t+43.710s node 3: timing - telemetry_period_rejected
- t+43.787s node 3: assign - silence_sent
- t+43.889s node 3: ack - assign_sent
- t+43.928s node 3: complete - telemetry_period_locked
- t+44.216s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -39.999s; acquire->telemetry -39.999s
- node 6; ACK->telemetry -29.764s; acquire->telemetry -29.764s
- node 7; ACK->telemetry -35.121s; acquire->telemetry -35.121s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 42
- Drone telemetry rows: 1675
- t+160.424s node 3: drone_debug_status wait_assignment
- t+163.572s node 3: drone_debug_status backoff
- t+166.614s node 3: drone_debug_status backoff
- t+169.961s node 3: drone_debug_status wait_assignment
- t+173.179s node 3: drone_debug_status backoff
- t+176.439s node 3: drone_debug_status wait_assignment
- t+179.627s node 3: drone_debug_status backoff
- t+182.878s node 3: drone_debug_status backoff
- t+186.093s node 3: drone_debug_status wait_assignment
- t+189.291s node 3: drone_debug_status backoff
- t+192.523s node 3: drone_debug_status backoff
- t+195.743s node 3: drone_debug_status wait_assignment

## Short-Loss Guard
- Telemetry rebind events: 59
- Short-loss event counts: short_loss_guard_started=1
- Recent short-loss events: t+59.908s node 3 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=57, owed_service_selected=57, rx_candidate_skipped=56, owed_rx_cleared=55, owed_service_cleared=55
- Scheduler-caused skips by node: 3=18, 6=19, 7=19
- Owed selections by node: 3=17, 6=20, 7=20
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+24.810s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+24.823s node 6 owed_service_selected selected=6 owed=1 skips=1; t+25.024s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+25.037s node 6 owed_rx_cleared owed=1 skips=1; t+25.037s node 6 owed_service_cleared owed=1 skips=1; t+25.187s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+25.188s node 3 owed_service_selected selected=3 owed=1 skips=1; t+25.201s node 3 owed_rx_cleared owed=1 skips=1; t+25.201s node 3 owed_service_cleared owed=1 skips=1; t+25.426s node 3 rx_candidate_skipped selected=6 owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 15606.3 | yes | - |

## RF-Loss Only Matrix
- Pass: 0/1
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | no | - | target_not_fresh_after_rf_loss |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join |

## Receiver Budget
- Events: recovery_budget_denied=90, healthy_service_protected=90, owed_service_selected=57, owed_service_cleared=55, recovery_budget_used=15
- Recovery denials by reason: healthy_service_deadline_risk=89, no_safe_recovery_slice_before_known_service=1
- Recent denied recovery:
  - t+68.022s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+68.149s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+68.224s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+68.338s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+68.422s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+68.542s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+68.637s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+68.759s target=3 protected=6 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.303s: mode `telemetry_first`
- Assigned packets received: 105
- Assigned RX coverage: 94%
- Sequence gap events: 102
- Missing sequence IDs: 211
- Max sequence gap: 9
- Assigned slot misses: 6
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 14%
- Receiver overloaded: False
- Recovery budget used: 15
- Recovery budget denied: 1
- Healthy service protected: 1
- Owed RX active: False node=0 count=0
- Fairness skips: 55
- Owed selections: 57
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 228
- node 7: t+3.802s seq 157 -> t+4.972s seq 162; missing [158, 159, 160, 161]
- node 7: t+4.972s seq 162 -> t+5.193s seq 164; missing [163]
- node 7: t+5.193s seq 164 -> t+5.607s seq 166; missing [165]
- node 7: t+5.607s seq 166 -> t+6.207s seq 169; missing [167, 168]
- node 7: t+6.207s seq 169 -> t+6.789s seq 172; missing [170, 171]
- node 7: t+6.789s seq 172 -> t+7.405s seq 175; missing [173, 174]
- node 7: t+7.405s seq 175 -> t+7.989s seq 178; missing [176, 177]
- node 7: t+7.989s seq 178 -> t+8.606s seq 181; missing [179, 180]
- node 7: t+8.606s seq 181 -> t+9.189s seq 184; missing [182, 183]
- node 7: t+9.189s seq 184 -> t+9.805s seq 187; missing [185, 186]
- node 7: t+9.805s seq 187 -> t+10.389s seq 190; missing [188, 189]
- node 7: t+10.389s seq 190 -> t+11.005s seq 193; missing [191, 192]

## State Flicker
- Node 6: 1 rapid state transitions: t+4.646s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 1675
- scanner_event: 618
- inter_gc_status: 130
- telemetry_rebind_event: 59
- command: 49
- command_ack: 49
- bench_marker: 48
- drone_debug_status: 36
- assignment_event: 35
- bind_progress_event: 32
- drone_live_status: 30
- search_event: 22
- assignments: 20
- inter_gc_command_queued: 12
- drone_link_status: 7
- assignment_timing_hint: 6
- drone_debug_event: 6
- session_event: 2
- drone_join_event: 2
- gc_status: 1
