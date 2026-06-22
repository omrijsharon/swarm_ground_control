# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_sharedrenew1.jsonl`
- Parsed records: 1724
- Approx duration: 136.1s

## Commands
- Sent commands: 27
- ACKs: 27 (0 rejected)
- Derived ACK latency: min 16 ms, max 1345 ms, avg 208 ms
- Inter-GC queued command events: 6
- t+108.662s ACK drone/drone get_status accepted: -
- t+111.814s ACK drone/drone get_status accepted: -
- t+116.300s ACK drone/drone get_status accepted: -
- t+119.586s ACK drone/drone get_status accepted: -
- t+122.817s ACK drone/drone get_status accepted: -
- t+126.066s ACK drone/drone get_status accepted: -
- t+129.263s ACK drone/drone get_status accepted: -
- t+132.542s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 77
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
- Bind progress events: 44
- Assignment events: 50
- Assignment event counts: silence_sent=7, assign_sent=6, telemetry_period_observed=5, post_bind_first_telemetry=5, telemetry_period_locked=5, join_ack_received=5, post_bind_acquire_started=5, join_request_received=5, assign_created=3, assign_reused=2, join_ack_timeout=2
- Operator shared/discovery RX: starts=2, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+55.303s to t+56.903s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Auto shared RX scanner events: 1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=4, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+26.959s to t+68.822s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+54.574s node 3: telemetry_bind - telemetry_live
- t+54.675s node 3: ack - assign_sent
- t+54.756s node 3: complete - telemetry_period_locked
- t+54.904s node 3: telemetry_bind - assignment_completed
- t+133.094s node 3: timing - telemetry_period_observed
- t+133.107s node 3: telemetry_bind - telemetry_live
- t+133.325s node 3: complete - telemetry_period_locked
- t+134.448s node 3: quiet - join_request_received
- t+134.448s node 3: quiet - assign_reused
- t+134.489s node 3: assign - silence_sent
- t+134.489s node 3: ack - assign_sent
- t+134.546s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=10, timeouts=0
- node 3; ACK->telemetry -0.077s; acquire->telemetry -0.158s
- node 6; ACK->telemetry 39.503s; acquire->telemetry 38.104s
- node 7; ACK->telemetry -9.354s; acquire->telemetry -9.354s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 28
- Drone telemetry rows: 890
- t+95.057s node 3: drone_debug_status assigned_telemetry
- t+101.185s node 3: drone_debug_event join_runtime_reset
- t+101.185s node 3: drone_debug_status backoff
- t+105.455s node 3: drone_debug_status wait_assignment
- t+108.662s node 3: drone_debug_status wait_assignment
- t+111.814s node 3: drone_debug_status wait_assignment
- t+116.300s node 3: drone_debug_status wait_assignment
- t+119.586s node 3: drone_debug_status wait_assignment
- t+122.818s node 3: drone_debug_status wait_assignment
- t+126.066s node 3: drone_debug_status backoff
- t+129.263s node 3: drone_debug_status wait_assignment
- t+132.542s node 3: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 30
- Short-loss event counts: short_loss_guard_started=4, short_loss_guard_active=3, short_loss_recovered=3, short_loss_guard_expired=1
- Short-loss recovered observed gaps: count=3, avg=33.0, max=54
- Recent short-loss events: t+76.246s node 6 short_loss_guard_started miss=1 gap=-; t+76.462s node 6 short_loss_guard_active miss=2 gap=-; t+77.103s node 6 short_loss_recovered miss=2 gap=5; t+85.922s node 7 short_loss_guard_started miss=1 gap=-; t+86.145s node 7 short_loss_guard_active miss=2 gap=-; t+93.711s node 7 short_loss_recovered miss=2 gap=40; t+95.168s node 3 short_loss_guard_started miss=1 gap=-; t+105.189s node 3 short_loss_guard_expired miss=2 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=11, owed_rx_selected=8, owed_service_selected=8, owed_rx_cleared=8, owed_service_cleared=8
- Scheduler-caused skips by node: 3=1, 6=5, 7=5
- Owed selections by node: 3=1, 6=4, 7=3
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+106.454s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+106.454s node 6 owed_service_selected selected=6 owed=1 skips=1; t+106.621s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+106.634s node 6 owed_rx_cleared owed=1 skips=1; t+106.635s node 6 owed_service_cleared owed=1 skips=1; t+106.836s node 7 rx_candidate_skipped selected=3 owed=2 skips=2; t+107.066s node 7 owed_rx_selected selected=7 owed=2 skips=2; t+107.275s node 7 owed_service_selected selected=7 owed=2 skips=2; t+107.313s node 7 owed_rx_cleared owed=2 skips=2; t+107.313s node 7 owed_service_cleared owed=2 skips=2

## Manual Bind Non-Disruption
- Pass: 1/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 8585.1 | yes | - |

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
| 3 | 9 | no | 31934.5 | -1426.7 | non_target_7_not_stable |

## Receiver Budget
- Events: recovery_budget_denied=78, healthy_service_protected=78, owed_service_selected=8, owed_service_cleared=8, recovery_budget_used=4
- Recovery denials by reason: healthy_service_deadline_risk=78
- Recent denied recovery:
  - t+97.060s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+97.328s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+97.436s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+97.541s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+97.634s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+97.723s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+97.845s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+97.920s target=3 protected=6 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.309s: mode `telemetry_first`
- Assigned packets received: 111
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 5%
- Receiver overloaded: False
- Recovery budget used: 0
- Recovery budget denied: 0
- Healthy service protected: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 204
- node 7: t+26.555s seq 140 -> t+49.337s seq 3; missing [141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, +17 more]
- node 7: t+54.321s seq 28 -> t+54.940s seq 31; missing [29, 30]
- node 7: t+54.940s seq 31 -> t+55.421s seq 33; missing [32]
- node 7: t+55.421s seq 33 -> t+55.822s seq 35; missing [34]
- node 7: t+55.822s seq 35 -> t+56.241s seq 37; missing [36]
- node 7: t+56.241s seq 37 -> t+56.619s seq 39; missing [38]
- node 7: t+56.619s seq 39 -> t+57.024s seq 41; missing [40]
- node 7: t+57.024s seq 41 -> t+57.421s seq 43; missing [42]
- node 7: t+57.421s seq 43 -> t+57.825s seq 45; missing [44]
- node 7: t+57.825s seq 45 -> t+58.313s seq 47; missing [46]
- node 7: t+58.313s seq 47 -> t+58.721s seq 49; missing [48]
- node 7: t+58.721s seq 49 -> t+59.111s seq 51; missing [50]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 890
- scanner_event: 341
- inter_gc_status: 77
- assignment_event: 50
- bind_progress_event: 44
- bench_marker: 30
- telemetry_rebind_event: 30
- command: 27
- command_ack: 27
- drone_debug_status: 20
- assignments: 18
- search_event: 16
- drone_live_status: 12
- drone_debug_event: 8
- inter_gc_command_queued: 6
- drone_link_status: 5
- assignment_timing_hint: 5
- session_event: 2
- drone_join_event: 2
- gc_status: 1
