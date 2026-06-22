# Live Debug Log Summary

- Source: `logs_summary\manual_bind_abuse_after_first_packet_lock_20260622.jsonl`
- Parsed records: 2301
- Approx duration: 149.2s

## Commands
- Sent commands: 21
- ACKs: 21 (0 rejected)
- Derived ACK latency: min 23 ms, max 305 ms, avg 131 ms
- Inter-GC queued command events: 12
- t+38.913s ACK magc/magic_ground_control start_search accepted: -
- t+40.214s ACK magc/magic_ground_control cancel_search accepted: -
- t+41.050s ACK magc/magic_ground_control start_search accepted: -
- t+42.234s ACK magc/magic_ground_control cancel_search accepted: -
- t+43.004s ACK magc/magic_ground_control start_search accepted: -
- t+44.223s ACK magc/magic_ground_control cancel_search accepted: -
- t+51.020s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+57.073s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 94
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
- Search events: 33
- Bind progress events: 115
- Assignment events: 119
- Assignment event counts: telemetry_period_observed=33, telemetry_period_locked=33, post_bind_first_telemetry=29, join_request_received=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, assign_reused=1
- Operator shared/discovery RX: starts=5, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+36.026s to t+43.467s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=8
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=4, active_ticks=0, joins=8, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+13.141s to t+138.966s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+45.035s node 6: telemetry_bind - telemetry_live
- t+45.311s node 7: timing - telemetry_period_observed
- t+45.324s node 7: complete - telemetry_period_locked
- t+45.338s node 7: telemetry_bind - telemetry_live
- t+62.194s node 3: timing - telemetry_period_observed
- t+62.207s node 3: complete - telemetry_period_locked
- t+62.221s node 3: telemetry_bind - telemetry_live
- t+62.330s node 3: quiet - join_request_received
- t+62.448s node 3: quiet - assign_reused
- t+62.448s node 3: assign - silence_sent
- t+62.604s node 3: ack - assign_sent
- t+62.749s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=58, timeouts=0
- node 2
- node 3; ACK->telemetry -17.232s; acquire->telemetry -17.232s
- node 6; ACK->telemetry -25.230s; acquire->telemetry -25.230s
- node 7; ACK->telemetry -31.426s; acquire->telemetry -31.427s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 13
- Drone telemetry rows: 659
- t+0.299s node 6: drone_debug_status assigned_telemetry
- t+0.345s node 7: drone_debug_status assigned_telemetry
- t+12.861s node 3: drone_debug_event reboot_scheduled
- t+12.861s node 3: drone_debug_status assigned_telemetry
- t+12.911s node 6: drone_debug_event reboot_scheduled
- t+12.911s node 6: drone_debug_status assigned_telemetry
- t+12.944s node 7: drone_debug_event reboot_scheduled
- t+12.945s node 7: drone_debug_status assigned_telemetry
- t+51.020s node 3: drone_debug_event telemetry_rf_loss_started
- t+51.020s node 3: drone_debug_status assigned_telemetry
- t+57.073s node 3: drone_debug_event join_runtime_reset
- t+57.073s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 148
- Short-loss event counts: short_loss_guard_active=12, short_loss_guard_started=10, short_loss_recovered=7, short_loss_guard_expired=1
- Short-loss recovered observed gaps: count=7, avg=5.9, max=10
- Recent short-loss events: t+69.461s node 3 short_loss_guard_active miss=8 gap=-; t+70.461s node 3 short_loss_guard_expired miss=9 gap=-; t+80.587s node 7 short_loss_guard_started miss=1 gap=-; t+81.574s node 7 short_loss_recovered miss=1 gap=4; t+87.072s node 7 short_loss_guard_started miss=1 gap=-; t+88.057s node 7 short_loss_recovered miss=1 gap=5; t+120.573s node 7 short_loss_guard_started miss=1 gap=-; t+121.555s node 7 short_loss_recovered miss=1 gap=5

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=219, owed_rx_selected=213, owed_rx_cleared=201, owed_rx_missed=14
- Scheduler-caused skips by node: 2=2, 3=50, 6=160, 7=7
- Owed selections by node: 2=2, 3=52, 6=153, 7=6
- Owed listens that still missed by node: 3=13, 7=1
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+147.714s node 3 owed_rx_cleared owed=1 skips=1; t+147.999s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+148.206s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+148.308s node 3 owed_rx_cleared owed=1 skips=1; t+148.535s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+148.709s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+148.709s node 3 owed_rx_cleared owed=1 skips=1; t+148.995s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+149.214s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+149.214s node 3 owed_rx_cleared owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 15879.1 | no | node_6_affected_by_bind,node_7_affected_by_bind |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 87642.3 | 81967 | non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.421s: mode `telemetry_first`
- Assigned packets received: 49
- Assigned RX coverage: 83%
- Sequence gap events: 45
- Missing sequence IDs: 75
- Max sequence gap: 9
- Assigned slot misses: 10
- Non-assigned preemptions: 0
- Owed RX active: True node=3 count=1
- Fairness skips: 12
- Owed selections: 11
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 446
- node 3: t+3.693s seq 224 -> t+4.681s seq 228; missing [225, 226, 227]
- node 3: t+4.681s seq 228 -> t+5.641s seq 231; missing [229, 230]
- node 3: t+5.641s seq 231 -> t+5.927s seq 233; missing [232]
- node 3: t+5.927s seq 233 -> t+6.423s seq 235; missing [234]
- node 3: t+6.423s seq 235 -> t+7.391s seq 238; missing [236, 237]
- node 3: t+7.391s seq 238 -> t+7.677s seq 240; missing [239]
- node 3: t+7.677s seq 240 -> t+8.173s seq 242; missing [241]
- node 3: t+8.173s seq 242 -> t+9.139s seq 245; missing [243, 244]
- node 3: t+9.139s seq 245 -> t+9.546s seq 247; missing [246]
- node 3: t+9.546s seq 247 -> t+10.393s seq 250; missing [248, 249]
- node 3: t+10.393s seq 250 -> t+10.684s seq 252; missing [251]
- node 3: t+10.684s seq 252 -> t+11.583s seq 255; missing [253, 254]

## State Flicker
- Node 2: 1 rapid state transitions: t+4.605s offline->online
- Node 6: 1 rapid state transitions: t+3.996s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 827
- drone_telemetry: 659
- telemetry_rebind_event: 148
- assignment_event: 119
- bind_progress_event: 115
- inter_gc_status: 94
- assignments: 56
- drone_link_status: 37
- search_event: 33
- command: 21
- command_ack: 21
- bench_marker: 18
- gc_status: 12
- inter_gc_command_queued: 12
- drone_debug_status: 8
- drone_debug_event: 5
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
