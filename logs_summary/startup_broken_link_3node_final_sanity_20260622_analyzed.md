# Live Debug Log Summary

- Source: `logs_summary\startup_broken_link_3node_final_sanity_20260622.jsonl`
- Parsed records: 2645
- Approx duration: 183.9s

## Commands
- Sent commands: 13
- ACKs: 13 (0 rejected)
- Derived ACK latency: min 36 ms, max 405 ms, avg 94 ms
- Inter-GC queued command events: 2
- t+12.865s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+12.955s ACK drone/drone debug_reboot accepted: -
- t+12.995s ACK drone/drone debug_reboot accepted: -
- t+13.044s ACK drone/drone debug_reboot accepted: -
- t+37.025s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+43.085s ACK drone/drone debug_restart_join accepted: -
- t+53.440s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+59.503s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 67
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 1
- Fragment samples: t+65.119s telegc: nelIndex"assignment_event","event":"join_ack_received","sourceRole":"magic_ground_control","nodeId":6,"frequencyMhz":919

## Bind And Search
- Search events: 17
- Bind progress events: 46
- Assignment events: 50
- Assignment event counts: telemetry_period_observed=8, telemetry_period_locked=8, join_request_received=5, post_bind_first_telemetry=5, silence_sent=5, assign_sent=5, post_bind_acquire_started=5, join_ack_received=4, assign_created=3, assign_reused=2
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=5, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+13.068s to t+79.125s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+48.756s node 3: telemetry_bind - telemetry_live
- t+48.902s node 3: ack - assign_sent
- t+48.985s node 3: complete - telemetry_period_locked
- t+49.076s node 3: telemetry_bind - assignment_completed
- t+64.685s node 6: quiet - join_request_received
- t+64.685s node 6: quiet - assign_reused
- t+64.697s node 6: timing - telemetry_period_observed
- t+64.724s node 6: telemetry_bind - telemetry_live
- t+64.934s node 6: assign - silence_sent
- t+64.934s node 6: ack - assign_sent
- t+64.948s node 6: complete - telemetry_period_locked
- t+65.119s node 6: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=10, first_telemetry=10, timeouts=0
- node 3; ACK->telemetry -33.194s; acquire->telemetry -33.194s
- node 6; ACK->telemetry -23.707s; acquire->telemetry -23.707s
- node 7; ACK->telemetry -16.823s; acquire->telemetry -16.823s

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 17
- Drone telemetry rows: 1014
- t+12.995s node 6: drone_debug_event reboot_scheduled
- t+12.995s node 6: drone_debug_status assigned_telemetry
- t+13.044s node 7: drone_debug_event reboot_scheduled
- t+13.044s node 7: drone_debug_status assigned_telemetry
- t+37.025s node 3: drone_debug_event telemetry_rf_loss_started
- t+37.025s node 3: drone_debug_status assigned_telemetry
- t+43.085s node 3: drone_debug_event join_runtime_reset
- t+43.086s node 3: drone_debug_status backoff
- t+53.440s node 6: drone_debug_event telemetry_rf_loss_started
- t+53.440s node 6: drone_debug_status assigned_telemetry
- t+59.503s node 6: drone_debug_event join_runtime_reset
- t+59.503s node 6: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 148
- Short-loss event counts: short_loss_guard_started=38, short_loss_recovered=36, short_loss_guard_active=13
- Short-loss recovered observed gaps: count=36, avg=6.4, max=15
- Recent short-loss events: t+112.947s node 6 short_loss_recovered miss=1 gap=7; t+160.460s node 6 short_loss_guard_started miss=1 gap=-; t+161.135s node 7 short_loss_guard_started miss=1 gap=-; t+161.441s node 6 short_loss_recovered miss=1 gap=7; t+162.224s node 7 short_loss_recovered miss=1 gap=4; t+162.954s node 6 short_loss_guard_started miss=1 gap=-; t+163.941s node 6 short_loss_guard_active miss=2 gap=-; t+164.935s node 6 short_loss_recovered miss=2 gap=11

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=283, rx_candidate_skipped=231, owed_rx_cleared=229, owed_rx_missed=78
- Scheduler-caused skips by node: 3=14, 6=48, 7=169
- Owed selections by node: 3=14, 6=96, 7=173
- Owed listens that still missed by node: 6=74, 7=4
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+182.370s node 7 owed_rx_cleared owed=1 skips=1; t+182.680s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+182.870s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+182.870s node 7 owed_rx_cleared owed=1 skips=1; t+183.169s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+183.370s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+183.370s node 7 owed_rx_cleared owed=1 skips=1; t+183.680s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+183.870s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+183.870s node 7 owed_rx_cleared owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 1/2
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 5991 | 173.9 | - |
| 6 | 9 | no | - | - | target_not_online_before_rebind_timeout,missing_rebind_milestones_after_restart_join,non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.332s: mode `telemetry_first`
- Assigned packets received: 49
- Assigned RX coverage: 89%
- Sequence gap events: 45
- Missing sequence IDs: 49
- Max sequence gap: 4
- Assigned slot misses: 6
- Non-assigned preemptions: 0
- Owed RX active: True node=3 count=1
- Fairness skips: 15
- Owed selections: 15
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 628
- node 3: t+3.781s seq 238 -> t+4.233s seq 240; missing [239]
- node 3: t+4.233s seq 240 -> t+5.534s seq 245; missing [241, 242, 243, 244]
- node 3: t+5.534s seq 245 -> t+6.033s seq 247; missing [246]
- node 3: t+6.033s seq 247 -> t+6.532s seq 249; missing [248]
- node 3: t+6.532s seq 249 -> t+7.033s seq 251; missing [250]
- node 3: t+7.033s seq 251 -> t+7.532s seq 253; missing [252]
- node 3: t+7.532s seq 253 -> t+8.031s seq 255; missing [254]
- node 3: t+8.031s seq 255 -> t+8.531s seq 1; missing [0]
- node 3: t+8.531s seq 1 -> t+9.031s seq 3; missing [2]
- node 3: t+9.031s seq 3 -> t+9.531s seq 5; missing [4]
- node 3: t+9.531s seq 5 -> t+10.032s seq 7; missing [6]
- node 3: t+10.032s seq 7 -> t+10.531s seq 9; missing [8]

## Transport Findings
- Suspicious JSON fragments: 1.

## State Flicker
- Node 6: 1 rapid state transitions: t+4.635s offline->online
- Node 7: 1 rapid state transitions: t+4.302s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1071
- drone_telemetry: 1014
- telemetry_rebind_event: 148
- inter_gc_status: 67
- assignment_event: 50
- bind_progress_event: 46
- assignments: 21
- search_event: 17
- bench_marker: 15
- command: 13
- command_ack: 13
- drone_debug_status: 10
- drone_link_status: 10
- assignment_timing_hint: 8
- drone_debug_event: 7
- drone_join_event: 4
- drone_live_status: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
