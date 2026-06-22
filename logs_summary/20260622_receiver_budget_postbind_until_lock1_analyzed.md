# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_postbind_until_lock1.jsonl`
- Parsed records: 1273
- Approx duration: 66.6s

## Commands
- Sent commands: 13
- ACKs: 14 (1 rejected)
- Derived ACK latency: min 23 ms, max 1531 ms, avg 276 ms
- Inter-GC queued command events: 2
- t+28.098s ACK magcsignments-0009/magic_ground_control  rejected: missing_command
- t+28.341s ACK drone/drone debug_reboot accepted: -
- t+28.389s ACK drone/drone debug_reboot accepted: -
- t+28.415s ACK drone/drone debug_reboot accepted: -
- t+48.615s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+54.781s ACK drone/drone debug_restart_join accepted: -
- t+57.915s ACK drone/drone get_status accepted: -
- t+61.115s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 41
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 1
- Fragment samples: t+43.004s telegc: d":7,"reason":"join_ack_received","frequencyMhz":910.5,"chann{"type":"bind_progress_event","event":"assignment_completed

## Bind And Search
- Search events: 14
- Bind progress events: 36
- Assignment events: 39
- Assignment event counts: telemetry_period_observed=7, telemetry_period_locked=6, post_bind_first_telemetry=4, join_request_received=4, silence_sent=4, assign_sent=4, assign_created=3, join_ack_received=3, post_bind_acquire_started=3, assign_reused=1
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Auto shared RX scanner events: 1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=8, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+28.707s to t+61.041s
- t+48.204s node 6: telemetry_bind - telemetry_live
- t+48.302s node 6: ack - assign_sent
- t+48.380s node 6: complete - telemetry_period_locked
- t+48.500s node 6: telemetry_bind - assignment_completed
- t+60.262s node 3: quiet - join_request_received
- t+60.275s node 3: timing - telemetry_period_observed
- t+60.289s node 3: telemetry_bind - telemetry_live
- t+60.459s node 3: quiet - assign_reused
- t+60.459s node 3: assign - silence_sent
- t+60.471s node 3: complete - telemetry_period_locked
- t+60.568s node 3: ack - assign_sent
- t+60.777s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=7, first_telemetry=8, timeouts=0
- node 3; ACK->telemetry -32.669s; acquire->telemetry -32.669s
- node 6; ACK->telemetry -43.745s; acquire->telemetry -43.823s
- node 7; acquire->telemetry -39.249s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 15
- Drone telemetry rows: 225
- t+28.341s node 3: drone_debug_event reboot_scheduled
- t+28.342s node 3: drone_debug_status assigned_telemetry
- t+28.389s node 6: drone_debug_event reboot_scheduled
- t+28.389s node 6: drone_debug_status assigned_telemetry
- t+28.415s node 7: drone_debug_event reboot_scheduled
- t+28.415s node 7: drone_debug_status assigned_telemetry
- t+48.615s node 3: drone_debug_event telemetry_rf_loss_started
- t+48.615s node 3: drone_debug_status assigned_telemetry
- t+54.781s node 3: drone_debug_event join_runtime_reset
- t+54.781s node 3: drone_debug_status backoff
- t+57.916s node 3: drone_debug_status wait_assignment
- t+61.115s node 3: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 22
- Short-loss event counts: short_loss_guard_active=4, short_loss_guard_started=2, short_loss_recovered=2
- Short-loss recovered observed gaps: count=2, avg=85.5, max=162
- Recent short-loss events: t+50.073s node 3 short_loss_guard_started miss=1 gap=-; t+50.611s node 3 short_loss_recovered miss=1 gap=9; t+54.824s node 3 short_loss_guard_started miss=1 gap=-; t+55.681s node 3 short_loss_guard_active miss=2 gap=-; t+56.704s node 3 short_loss_guard_active miss=3 gap=-; t+57.724s node 3 short_loss_guard_active miss=4 gap=-; t+58.744s node 3 short_loss_guard_active miss=5 gap=-; t+59.633s node 3 short_loss_recovered miss=5 gap=162

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=111, owed_service_selected=111, rx_candidate_skipped=110, owed_rx_cleared=102, owed_service_cleared=102, owed_rx_missed=2
- Scheduler-caused skips by node: 3=43, 6=40, 7=27
- Owed selections by node: 3=46, 6=41, 7=24
- Owed listens that still missed by node: 3=2
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+66.442s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+66.471s node 3 owed_rx_cleared owed=1 skips=1; t+66.471s node 3 owed_service_cleared owed=1 skips=1; t+66.498s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+66.571s node 6 owed_service_selected selected=6 owed=1 skips=1; t+66.571s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+66.583s node 6 owed_rx_cleared owed=1 skips=1; t+66.583s node 6 owed_service_cleared owed=1 skips=1; t+66.611s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+66.611s node 7 owed_service_selected selected=7 owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 6333.5 | 533.3 | non_target_6_not_stable,non_target_7_not_stable |

## Receiver Budget
- Events: owed_service_selected=111, owed_service_cleared=102, recovery_budget_used=28, recovery_budget_denied=2, healthy_service_protected=2
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=2
- Recent denied recovery:
  - t+4.571s target=7 protected=3 reason=no_safe_recovery_slice_before_known_service
  - t+5.393s target=7 protected=3 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+25.450s: mode `telemetry_first`
- Assigned packets received: 89
- Assigned RX coverage: 97%
- Sequence gap events: 85
- Missing sequence IDs: 123
- Max sequence gap: 4
- Assigned slot misses: 2
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 9%
- Receiver overloaded: False
- Recovery budget used: 28
- Recovery budget denied: 2
- Healthy service protected: 2
- Owed RX active: False node=0 count=0
- Fairness skips: 41
- Owed selections: 41
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 187
- node 7: t+3.940s seq 152 -> t+42.625s seq 3; missing [153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, +17 more]
- node 7: t+42.962s seq 4 -> t+43.405s seq 6; missing [5]
- node 7: t+43.405s seq 6 -> t+43.605s seq 8; missing [7]
- node 7: t+43.605s seq 8 -> t+44.004s seq 10; missing [9]
- node 7: t+44.004s seq 10 -> t+44.605s seq 12; missing [11]
- node 7: t+44.605s seq 12 -> t+44.802s seq 14; missing [13]
- node 7: t+44.802s seq 14 -> t+45.199s seq 16; missing [15]
- node 7: t+45.199s seq 16 -> t+45.810s seq 18; missing [17]
- node 7: t+45.810s seq 18 -> t+46.005s seq 20; missing [19]
- node 7: t+46.005s seq 20 -> t+46.602s seq 22; missing [21]
- node 7: t+46.602s seq 22 -> t+47.005s seq 24; missing [23]
- node 7: t+47.005s seq 24 -> t+47.199s seq 26; missing [25]

## Transport Findings
- Rejected ACK reasons: missing_command=1
- Suspicious JSON fragments: 1.

## State Flicker
- Node 6: 1 rapid state transitions: t+4.571s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 693
- drone_telemetry: 225
- inter_gc_status: 41
- assignment_event: 39
- bind_progress_event: 36
- telemetry_rebind_event: 22
- command_ack: 14
- search_event: 14
- bench_marker: 13
- command: 13
- assignments: 13
- drone_debug_status: 10
- drone_link_status: 8
- assignment_timing_hint: 6
- drone_live_status: 5
- drone_debug_event: 5
- inter_gc_command_queued: 2
- session_event: 2
- drone_join_event: 2
- gc_status: 1
