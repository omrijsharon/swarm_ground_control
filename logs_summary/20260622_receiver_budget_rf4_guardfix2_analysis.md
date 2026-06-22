# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_rf4_guardfix2.jsonl`
- Parsed records: 1667
- Approx duration: 148.1s

## Commands
- Sent commands: 9
- ACKs: 9 (0 rejected)
- Derived ACK latency: min 16 ms, max 1215 ms, avg 276 ms
- Inter-GC queued command events: 2
- t+0.167s ACK drone/drone get_status accepted: -
- t+0.217s ACK drone/drone get_status accepted: -
- t+25.239s ACK telegc/telemetry_ground_control get_status accepted: -
- t+26.123s ACK magc/magic_ground_control get_status accepted: -
- t+27.442s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+27.581s ACK drone/drone debug_reboot accepted: -
- t+27.619s ACK drone/drone debug_reboot accepted: -
- t+27.668s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 100
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
- Search events: 5
- Bind progress events: 29
- Assignment events: 37
- Assignment event counts: telemetry_period_observed=5, telemetry_period_locked=5, post_bind_acquire_timeout=5, silence_sent=5, assign_sent=4, join_request_received=3, assign_created=2, join_ack_timeout=2, post_bind_first_telemetry=2, telemetry_period_rejected=1, assign_reused=1, join_ack_received=1, post_bind_acquire_started=1
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=1
- Auto shared RX scanner events: 1
- Auto shared RX complete reasons: auto_shared_rx_timeout
- Empty-assignment shared RX: starts=3, active_ticks=0, joins=0, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+27.645s to t+108.583s
- t+100.191s node 7: complete - telemetry_period_locked
- t+100.987s node 7: quiet - assign_reused
- t+101.098s node 7: assign - silence_sent
- t+101.308s node 7: ack - assign_sent
- t+104.059s node 7: telemetry_bind - assignment_completed
- t+143.648s node 6: quiet - join_request_received
- t+143.923s node 6: timing - telemetry_period_observed
- t+143.949s node 6: telemetry_bind - telemetry_live
- t+144.126s node 6: complete - telemetry_period_locked
- t+145.117s node 6: quiet - assign_created
- t+146.725s node 6: assign - silence_sent
- t+148.104s node 6: ack - assign_sent

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=4, timeouts=10
- node 3; timeouts=8
- node 6
- node 7; ACK->telemetry -97.997s; acquire->telemetry -97.997s; timeouts=2

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 9
- Drone telemetry rows: 365
- t+0.120s node 3: drone_debug_status assigned_telemetry
- t+0.168s node 6: drone_debug_status assigned_telemetry
- t+0.217s node 7: drone_debug_status assigned_telemetry
- t+27.581s node 3: drone_debug_event reboot_scheduled
- t+27.581s node 3: drone_debug_status assigned_telemetry
- t+27.619s node 6: drone_debug_event reboot_scheduled
- t+27.619s node 6: drone_debug_status assigned_telemetry
- t+27.668s node 7: drone_debug_event reboot_scheduled
- t+27.668s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 93
- Short-loss event counts: short_loss_guard_started=2, short_loss_recovered=2
- Short-loss recovered observed gaps: count=2, avg=1.5, max=2
- Recent short-loss events: t+5.374s node 7 short_loss_guard_started miss=1 gap=-; t+5.773s node 7 short_loss_recovered miss=1 gap=2; t+137.423s node 7 short_loss_guard_started miss=1 gap=-; t+137.594s node 7 short_loss_recovered miss=1 gap=1

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=87, owed_rx_selected=85, owed_service_selected=85, owed_rx_cleared=84, owed_service_cleared=84
- Scheduler-caused skips by node: 3=29, 6=29, 7=29
- Owed selections by node: 3=28, 6=29, 7=28
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+26.920s node 3 owed_rx_cleared owed=1 skips=1; t+26.929s node 3 owed_service_cleared owed=1 skips=1; t+26.955s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+26.955s node 7 owed_service_selected selected=7 owed=1 skips=1; t+27.161s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+27.171s node 7 owed_rx_cleared owed=1 skips=1; t+27.171s node 7 owed_service_cleared owed=1 skips=1; t+27.200s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+27.200s node 6 owed_service_selected selected=6 owed=1 skips=1; t+27.232s node 3 rx_candidate_skipped selected=6 owed=1 skips=1

## Receiver Budget
- Events: recovery_budget_used=118, owed_service_selected=85, owed_service_cleared=84, recovery_budget_denied=31, healthy_service_protected=31
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=20, healthy_service_deadline_risk=11
- Recent denied recovery:
  - t+100.802s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+101.014s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+141.366s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+141.841s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+142.490s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+143.161s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+143.579s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+143.648s target=3 protected=7 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.306s: mode `telemetry_first`
- Assigned packets received: 105
- Assigned RX coverage: 94%
- Sequence gap events: 83
- Missing sequence IDs: 202
- Max sequence gap: 22
- Assigned slot misses: 6
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 30%
- Receiver overloaded: False
- Recovery budget used: 31
- Recovery budget denied: 21
- Healthy service protected: 21
- Owed RX active: True node=7 count=1
- Fairness skips: 77
- Owed selections: 75
- Owed misses: 0
- Max scheduler skips: 2
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 102
- node 6: t+4.131s seq 115 -> t+4.970s seq 119; missing [116, 117, 118]
- node 6: t+4.970s seq 119 -> t+5.533s seq 122; missing [120, 121]
- node 6: t+5.533s seq 122 -> t+10.128s seq 145; missing [123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, +6 more]
- node 6: t+10.128s seq 145 -> t+10.887s seq 148; missing [146, 147]
- node 6: t+10.887s seq 148 -> t+11.146s seq 150; missing [149]
- node 6: t+11.146s seq 150 -> t+11.750s seq 153; missing [151, 152]
- node 6: t+11.750s seq 153 -> t+12.343s seq 156; missing [154, 155]
- node 6: t+12.343s seq 156 -> t+12.949s seq 159; missing [157, 158]
- node 6: t+12.949s seq 159 -> t+13.548s seq 162; missing [160, 161]
- node 6: t+13.548s seq 162 -> t+14.146s seq 165; missing [163, 164]
- node 6: t+14.146s seq 165 -> t+14.748s seq 168; missing [166, 167]
- node 6: t+14.748s seq 168 -> t+15.348s seq 171; missing [169, 170]

## State Flicker
- Node 7: 1 rapid state transitions: t+4.586s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 858
- drone_telemetry: 365
- inter_gc_status: 100
- telemetry_rebind_event: 93
- assignment_event: 37
- bind_progress_event: 29
- assignments: 12
- command: 9
- command_ack: 9
- bench_marker: 7
- drone_link_status: 7
- drone_debug_status: 6
- assignment_timing_hint: 5
- search_event: 5
- drone_live_status: 3
- drone_debug_event: 3
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
