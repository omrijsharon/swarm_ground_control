# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_deadline_protect1.jsonl`
- Parsed records: 2008
- Approx duration: 151.1s

## Commands
- Sent commands: 39
- ACKs: 39 (0 rejected)
- Derived ACK latency: min 27 ms, max 265 ms, avg 79 ms
- Inter-GC queued command events: 2
- t+122.377s ACK drone/drone get_status accepted: -
- t+125.583s ACK drone/drone get_status accepted: -
- t+128.762s ACK drone/drone get_status accepted: -
- t+131.946s ACK drone/drone get_status accepted: -
- t+135.158s ACK drone/drone get_status accepted: -
- t+138.354s ACK drone/drone get_status accepted: -
- t+141.570s ACK drone/drone get_status accepted: -
- t+144.771s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 101
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
- Search events: 14
- Bind progress events: 38
- Assignment events: 42
- Assignment event counts: telemetry_period_observed=7, telemetry_period_locked=7, join_request_received=4, post_bind_first_telemetry=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, assign_reused=1
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Auto shared RX scanner events: 1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=7, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+26.062s to t+63.510s
- t+49.312s node 7: assign - silence_sent
- t+49.312s node 7: ack - assign_sent
- t+49.344s node 7: complete - telemetry_period_locked
- t+49.509s node 7: telemetry_bind - assignment_completed
- t+61.342s node 3: timing - telemetry_period_observed
- t+61.356s node 3: telemetry_bind - telemetry_live
- t+61.589s node 3: complete - telemetry_period_locked
- t+62.744s node 3: quiet - join_request_received
- t+62.808s node 3: quiet - assign_reused
- t+62.919s node 3: assign - silence_sent
- t+63.114s node 3: ack - assign_sent
- t+63.245s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=8, timeouts=0
- node 3; ACK->telemetry -30.689s; acquire->telemetry -30.690s
- node 6; ACK->telemetry -37.511s; acquire->telemetry -37.511s
- node 7; ACK->telemetry -45.296s; acquire->telemetry -45.296s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 41
- Drone telemetry rows: 727
- t+109.550s node 3: drone_debug_status assigned_telemetry
- t+112.725s node 3: drone_debug_status assigned_telemetry
- t+115.949s node 3: drone_debug_status assigned_telemetry
- t+119.166s node 3: drone_debug_status assigned_telemetry
- t+122.377s node 3: drone_debug_status assigned_telemetry
- t+125.583s node 3: drone_debug_status assigned_telemetry
- t+128.762s node 3: drone_debug_status assigned_telemetry
- t+131.947s node 3: drone_debug_status assigned_telemetry
- t+135.158s node 3: drone_debug_status assigned_telemetry
- t+138.354s node 3: drone_debug_status assigned_telemetry
- t+141.570s node 3: drone_debug_status assigned_telemetry
- t+144.772s node 3: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 60
- Short-loss event counts: short_loss_guard_started=2
- Recent short-loss events: t+49.844s node 3 short_loss_guard_started miss=1 gap=-; t+62.808s node 3 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=67, owed_service_selected=67, rx_candidate_skipped=66, owed_rx_cleared=64, owed_service_cleared=64
- Scheduler-caused skips by node: 3=23, 6=21, 7=22
- Owed selections by node: 3=24, 6=20, 7=23
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+61.932s node 7 owed_service_cleared owed=1 skips=1; t+61.944s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+61.957s node 3 owed_service_selected selected=3 owed=1 skips=1; t+62.142s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+62.142s node 3 owed_rx_cleared owed=1 skips=1; t+62.142s node 3 owed_service_cleared owed=1 skips=1; t+62.168s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+62.318s node 6 owed_service_selected selected=6 owed=1 skips=1; t+62.318s node 6 owed_rx_cleared owed=1 skips=1; t+62.318s node 6 owed_service_cleared owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout |

## Receiver Budget
- Events: recovery_budget_denied=91, healthy_service_protected=91, owed_service_selected=67, owed_service_cleared=64, recovery_budget_used=17
- Recovery denials by reason: healthy_service_deadline_risk=90, no_safe_recovery_slice_before_known_service=1
- Recent denied recovery:
  - t+70.147s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+70.337s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+70.533s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+70.725s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+70.944s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+71.128s target=3 protected=7 reason=healthy_service_deadline_risk
  - t+71.335s target=3 protected=6 reason=healthy_service_deadline_risk
  - t+71.553s target=3 protected=7 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.358s: mode `telemetry_first`
- Assigned packets received: 104
- Assigned RX coverage: 93%
- Sequence gap events: 101
- Missing sequence IDs: 209
- Max sequence gap: 6
- Assigned slot misses: 7
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 30%
- Receiver overloaded: False
- Recovery budget used: 17
- Recovery budget denied: 1
- Healthy service protected: 1
- Owed RX active: True node=6 count=1
- Fairness skips: 61
- Owed selections: 62
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 615
- node 3: t+3.733s seq 100 -> t+5.162s seq 107; missing [101, 102, 103, 104, 105, 106]
- node 3: t+5.162s seq 107 -> t+5.929s seq 111; missing [108, 109, 110]
- node 3: t+5.929s seq 111 -> t+6.685s seq 114; missing [112, 113]
- node 3: t+6.685s seq 114 -> t+7.126s seq 117; missing [115, 116]
- node 3: t+7.126s seq 117 -> t+7.728s seq 120; missing [118, 119]
- node 3: t+7.728s seq 120 -> t+8.338s seq 123; missing [121, 122]
- node 3: t+8.338s seq 123 -> t+8.915s seq 126; missing [124, 125]
- node 3: t+8.915s seq 126 -> t+9.683s seq 129; missing [127, 128]
- node 3: t+9.683s seq 129 -> t+10.125s seq 132; missing [130, 131]
- node 3: t+10.125s seq 132 -> t+10.719s seq 135; missing [133, 134]
- node 3: t+10.719s seq 135 -> t+11.329s seq 138; missing [136, 137]
- node 3: t+11.329s seq 138 -> t+11.914s seq 141; missing [139, 140]

## State Flicker
- Node 7: 1 rapid state transitions: t+4.117s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 727
- scanner_event: 686
- inter_gc_status: 101
- telemetry_rebind_event: 60
- assignment_event: 42
- bench_marker: 39
- command: 39
- command_ack: 39
- bind_progress_event: 38
- drone_debug_status: 36
- drone_live_status: 31
- search_event: 14
- assignments: 13
- drone_link_status: 8
- assignment_timing_hint: 7
- drone_debug_event: 5
- inter_gc_command_queued: 2
- session_event: 2
- drone_join_event: 2
- gc_status: 1
