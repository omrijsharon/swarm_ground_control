# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_narrow_shortloss1.jsonl`
- Parsed records: 3388
- Approx duration: 212.1s

## Commands
- Sent commands: 40
- ACKs: 41 (1 rejected)
- Derived ACK latency: min 30 ms, max 1597 ms, avg 270 ms
- Inter-GC queued command events: 2
- t+175.015s ACK drone/drone get_status accepted: -
- t+178.206s ACK drone/drone get_status accepted: -
- t+181.448s ACK drone/drone get_status accepted: -
- t+184.494s ACK drone/drone get_status accepted: -
- t+192.111s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+198.174s ACK drone/drone debug_restart_join accepted: -
- t+202.315s ACK drone/drone get_status accepted: -
- t+205.517s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 119
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
- Bind progress events: 62
- Assignment events: 73
- Assignment event counts: telemetry_period_observed=9, telemetry_period_locked=9, silence_sent=9, assign_sent=8, join_request_received=7, post_bind_first_telemetry=6, join_ack_received=6, post_bind_acquire_started=6, assign_reused=4, assign_created=3, post_bind_acquire_timeout=3, join_ack_timeout=2, telemetry_period_rejected=1
- Auto shared RX: starts=4, active_ticks=0, joins=3, completes=1
- Auto shared RX scanner events: 2
- Auto shared RX complete reasons: join_handled
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=1, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+28.815s to t+82.389s
- t+186.601s node 6: timing - telemetry_period_observed
- t+186.628s node 6: telemetry_bind - telemetry_live
- t+186.681s node 6: telemetry_bind - assignment_completed
- t+186.836s node 6: complete - telemetry_period_locked
- t+206.497s node 7: quiet - join_request_received
- t+206.497s node 7: quiet - assign_reused
- t+206.497s node 7: assign - silence_sent
- t+206.524s node 7: ack - assign_sent
- t+206.524s node 7: timing - telemetry_period_observed
- t+206.552s node 7: telemetry_bind - telemetry_live
- t+206.622s node 7: telemetry_bind - assignment_completed
- t+206.762s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=10, first_telemetry=12, timeouts=6
- node 3; ACK->telemetry -83.741s; acquire->telemetry -83.741s; timeouts=6
- node 6; ACK->telemetry -75.913s; acquire->telemetry -77.362s
- node 7; ACK->telemetry -59.351s; acquire->telemetry -59.351s

## Drone Debug
- Drone JOIN events: 6
- JOIN event counts: join_start_shared_channel=3, join_backoff=3
- JOIN backoff kinds: first_fast=3
- Drone debug events/status rows: 46
- Drone telemetry rows: 1429
- t+168.584s node 6: drone_debug_status backoff
- t+171.842s node 6: drone_debug_status wait_assignment
- t+175.015s node 6: drone_debug_status backoff
- t+178.206s node 6: drone_debug_status wait_assignment
- t+181.448s node 6: drone_debug_status backoff
- t+184.495s node 6: drone_debug_status wait_assignment
- t+192.111s node 7: drone_debug_event telemetry_rf_loss_started
- t+192.112s node 7: drone_debug_status assigned_telemetry
- t+198.174s node 7: drone_debug_event join_runtime_reset
- t+198.174s node 7: drone_debug_status backoff
- t+202.316s node 7: drone_debug_status wait_assignment
- t+205.517s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 80
- Short-loss event counts: short_loss_guard_started=4
- Recent short-loss events: t+6.455s node 6 short_loss_guard_started miss=1 gap=-; t+88.088s node 3 short_loss_guard_started miss=1 gap=-; t+108.018s node 6 short_loss_guard_started miss=1 gap=-; t+192.166s node 7 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=66, owed_rx_selected=65, owed_service_selected=65, owed_rx_cleared=64, owed_service_cleared=64
- Scheduler-caused skips by node: 3=1, 6=33, 7=32
- Owed selections by node: 3=1, 6=33, 7=31
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+86.953s node 7 owed_rx_cleared owed=1 skips=1; t+86.953s node 7 owed_service_cleared owed=1 skips=1; t+86.979s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+86.979s node 6 owed_service_selected selected=6 owed=1 skips=1; t+87.011s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+206.577s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+206.867s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+206.996s node 6 owed_service_selected selected=6 owed=1 skips=1; t+207.008s node 6 owed_rx_cleared owed=1 skips=1; t+207.008s node 6 owed_service_cleared owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 3/3
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 8293.5 | 39.5 | - |
| 6 | 9 | yes | 72943.6 | 26.5 | - |
| 7 | 9 | yes | 8376.8 | -42.9 | - |

## Receiver Budget
- Events: recovery_budget_denied=254, healthy_service_protected=254, owed_service_selected=65, owed_service_cleared=64, recovery_budget_used=20
- Recovery denials by reason: healthy_service_deadline_risk=253, no_safe_recovery_slice_before_known_service=1
- Recent denied recovery:
  - t+199.611s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+199.872s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+200.013s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+200.272s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+200.423s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+200.672s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+200.817s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+201.085s target=7 protected=6 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.421s: mode `telemetry_first`
- Assigned packets received: 161
- Assigned RX coverage: 96%
- Sequence gap events: 62
- Missing sequence IDs: 75
- Max sequence gap: 4
- Assigned slot misses: 5
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 30%
- Receiver overloaded: False
- Recovery budget used: 11
- Recovery budget denied: 47
- Healthy service protected: 47
- Owed RX active: False node=0 count=0
- Fairness skips: 4
- Owed selections: 4
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 352
- node 7: t+3.191s seq 9 -> t+4.031s seq 13; missing [10, 11, 12]
- node 7: t+4.031s seq 13 -> t+5.003s seq 18; missing [14, 15, 16, 17]
- node 7: t+5.003s seq 18 -> t+5.592s seq 21; missing [19, 20]
- node 7: t+5.592s seq 21 -> t+6.117s seq 23; missing [22]
- node 7: t+6.117s seq 23 -> t+6.443s seq 25; missing [24]
- node 7: t+6.443s seq 25 -> t+6.983s seq 28; missing [26, 27]
- node 7: t+6.983s seq 28 -> t+7.383s seq 30; missing [29]
- node 7: t+7.383s seq 30 -> t+7.783s seq 32; missing [31]
- node 7: t+7.783s seq 32 -> t+8.182s seq 34; missing [33]
- node 7: t+8.182s seq 34 -> t+8.583s seq 36; missing [35]
- node 7: t+8.583s seq 36 -> t+8.983s seq 38; missing [37]
- node 7: t+8.983s seq 38 -> t+9.383s seq 40; missing [39]

## Transport Findings
- Rejected ACK reasons: missing_command=1

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 1429
- scanner_event: 1230
- inter_gc_status: 119
- telemetry_rebind_event: 80
- assignment_event: 73
- bind_progress_event: 62
- bench_marker: 43
- command_ack: 41
- command: 40
- drone_debug_status: 37
- drone_live_status: 28
- assignments: 22
- search_event: 19
- drone_link_status: 12
- assignment_timing_hint: 9
- drone_debug_event: 9
- drone_join_event: 6
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
