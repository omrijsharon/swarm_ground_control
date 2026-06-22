# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_shortloss_priority1.jsonl`
- Parsed records: 2168
- Approx duration: 147.8s

## Commands
- Sent commands: 9
- ACKs: 9 (0 rejected)
- Derived ACK latency: min 29 ms, max 1588 ms, avg 269 ms
- Inter-GC queued command events: 2
- t+0.175s ACK drone/drone get_status accepted: -
- t+0.223s ACK drone/drone get_status accepted: -
- t+25.257s ACK telegc/telemetry_ground_control get_status accepted: -
- t+26.817s ACK magc/magic_ground_control get_status accepted: -
- t+27.257s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+27.365s ACK drone/drone debug_reboot accepted: -
- t+27.409s ACK drone/drone debug_reboot accepted: -
- t+27.497s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 109
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
- Bind progress events: 29
- Assignment events: 32
- Assignment event counts: telemetry_period_observed=6, telemetry_period_locked=4, join_request_received=3, post_bind_first_telemetry=3, assign_created=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3, telemetry_period_rejected=1
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=5, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+27.463s to t+66.192s
- t+42.625s node 7: telemetry_bind - telemetry_live
- t+42.802s node 7: assign - silence_sent
- t+42.803s node 7: ack - assign_sent
- t+42.982s node 7: telemetry_bind - assignment_completed
- t+51.422s node 3: quiet - join_request_received
- t+56.005s node 3: timing - telemetry_period_observed
- t+56.017s node 3: telemetry_bind - telemetry_live
- t+57.393s node 3: quiet - assign_created
- t+58.986s node 3: assign - silence_sent
- t+60.391s node 3: ack - assign_sent
- t+61.004s node 3: complete - telemetry_period_locked
- t+63.230s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=6, timeouts=0
- node 3; ACK->telemetry -55.162s; acquire->telemetry -55.162s
- node 6; ACK->telemetry -29.931s; acquire->telemetry -29.931s
- node 7; ACK->telemetry -37.122s; acquire->telemetry -37.123s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 9
- Drone telemetry rows: 662
- t+0.121s node 3: drone_debug_status assigned_telemetry
- t+0.175s node 6: drone_debug_status assigned_telemetry
- t+0.223s node 7: drone_debug_status assigned_telemetry
- t+27.365s node 3: drone_debug_event reboot_scheduled
- t+27.365s node 3: drone_debug_status assigned_telemetry
- t+27.409s node 6: drone_debug_event reboot_scheduled
- t+27.409s node 6: drone_debug_status assigned_telemetry
- t+27.496s node 7: drone_debug_event reboot_scheduled
- t+27.497s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 65
- No short-loss guard events found.

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=145, owed_rx_selected=144, owed_service_selected=144, owed_rx_cleared=144, owed_service_cleared=144
- Scheduler-caused skips by node: 3=72, 6=73
- Owed selections by node: 3=72, 6=72
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+146.610s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+146.823s node 6 owed_service_selected selected=6 owed=1 skips=1; t+146.835s node 6 owed_rx_cleared owed=1 skips=1; t+146.835s node 6 owed_service_cleared owed=1 skips=1; t+147.214s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+147.246s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+147.397s node 3 owed_service_selected selected=3 owed=1 skips=1; t+147.397s node 3 owed_rx_cleared owed=1 skips=1; t+147.604s node 3 owed_service_cleared owed=1 skips=1; t+147.796s node 6 rx_candidate_skipped selected=3 owed=1 skips=1

## Receiver Budget
- Events: owed_service_selected=144, owed_service_cleared=144, recovery_budget_used=119, recovery_budget_denied=5, healthy_service_protected=5
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=4, healthy_service_deadline_risk=1
- Recent denied recovery:
  - t+6.848s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+7.682s target=6 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+9.178s target=6 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+42.652s target=7 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+56.044s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+25.321s: mode `telemetry_first`
- Assigned packets received: 139
- Assigned RX coverage: 96%
- Sequence gap events: 7
- Missing sequence IDs: 54
- Max sequence gap: 23
- Assigned slot misses: 5
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 9%
- Receiver overloaded: False
- Recovery budget used: 56
- Recovery budget denied: 3
- Healthy service protected: 3
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 447
- node 7: t+5.705s seq 163 -> t+6.536s seq 167; missing [164, 165, 166]
- node 7: t+6.536s seq 167 -> t+7.093s seq 170; missing [168, 169]
- node 7: t+7.093s seq 170 -> t+7.696s seq 173; missing [171, 172]
- node 7: t+7.696s seq 173 -> t+9.299s seq 181; missing [174, 175, 176, 177, 178, 179, 180]
- node 7: t+9.299s seq 181 -> t+12.408s seq 196; missing [182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195]
- node 7: t+27.043s seq 13 -> t+42.639s seq 4; missing [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, +17 more]
- node 6: t+6.096s seq 139 -> t+35.678s seq 3; missing [140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, +17 more]
- node 6: t+42.431s seq 37 -> t+42.891s seq 39; missing [38]
- node 6: t+42.891s seq 39 -> t+49.830s seq 73; missing [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, +17 more]
- node 6: t+55.830s seq 104 -> t+56.247s seq 106; missing [105]
- node 6: t+56.247s seq 106 -> t+61.232s seq 131; missing [107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, +8 more]
- node 6: t+61.232s seq 131 -> t+61.671s seq 133; missing [132]

## State Flicker
- Node 6: 1 rapid state transitions: t+6.175s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1085
- drone_telemetry: 662
- inter_gc_status: 109
- telemetry_rebind_event: 65
- assignment_event: 32
- bind_progress_event: 29
- search_event: 11
- command: 9
- command_ack: 9
- assignments: 9
- bench_marker: 7
- drone_link_status: 7
- drone_debug_status: 6
- assignment_timing_hint: 4
- drone_live_status: 3
- drone_debug_event: 3
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
