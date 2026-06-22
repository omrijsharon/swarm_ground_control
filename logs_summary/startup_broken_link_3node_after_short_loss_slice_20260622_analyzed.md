# Live Debug Log Summary

- Source: `logs_summary\startup_broken_link_3node_after_short_loss_slice_20260622.jsonl`
- Parsed records: 858
- Approx duration: 50.1s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 37 ms, max 239 ms, avg 91 ms
- Inter-GC queued command events: 2
- t+12.231s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.433s ACK magc/magic_ground_control get_status accepted: -
- t+12.742s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+12.821s ACK drone/drone debug_reboot accepted: -
- t+12.867s ACK drone/drone debug_reboot accepted: -
- t+12.927s ACK drone/drone debug_reboot accepted: -
- t+33.250s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+39.346s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 31
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
- Search events: 13
- Bind progress events: 40
- Assignment events: 44
- Assignment event counts: telemetry_period_observed=8, telemetry_period_locked=8, join_request_received=4, post_bind_first_telemetry=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, assign_reused=1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=4, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+12.960s to t+45.495s
- t+32.831s node 7: timing - telemetry_period_observed
- t+32.865s node 7: telemetry_bind - telemetry_live
- t+33.076s node 7: telemetry_bind - assignment_completed
- t+33.088s node 7: complete - telemetry_period_locked
- t+44.552s node 3: quiet - join_request_received
- t+44.747s node 3: timing - telemetry_period_observed
- t+44.774s node 3: telemetry_bind - telemetry_live
- t+44.998s node 3: quiet - assign_reused
- t+44.998s node 3: assign - silence_sent
- t+45.041s node 3: complete - telemetry_period_locked
- t+45.264s node 3: ack - assign_sent
- t+45.292s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=8, timeouts=0
- node 2
- node 3; ACK->telemetry -16.545s; acquire->telemetry -16.545s
- node 6; ACK->telemetry -21.892s; acquire->telemetry -22.066s
- node 7; ACK->telemetry -28.710s; acquire->telemetry -28.710s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 13
- Drone telemetry rows: 161
- t+0.134s node 6: drone_debug_status assigned_telemetry
- t+0.184s node 7: drone_debug_status assigned_telemetry
- t+12.821s node 3: drone_debug_event reboot_scheduled
- t+12.821s node 3: drone_debug_status assigned_telemetry
- t+12.867s node 6: drone_debug_event reboot_scheduled
- t+12.867s node 6: drone_debug_status assigned_telemetry
- t+12.927s node 7: drone_debug_event reboot_scheduled
- t+12.927s node 7: drone_debug_status assigned_telemetry
- t+33.250s node 3: drone_debug_event telemetry_rf_loss_started
- t+33.250s node 3: drone_debug_status assigned_telemetry
- t+39.346s node 3: drone_debug_event join_runtime_reset
- t+39.346s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 65
- Short-loss event counts: short_loss_guard_active=22, short_loss_guard_started=4, short_loss_guard_expired=2, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=9.0, max=9
- Recent short-loss events: t+41.535s node 3 short_loss_guard_expired miss=9 gap=-; t+42.543s node 6 short_loss_guard_active miss=3 gap=-; t+42.782s node 6 short_loss_guard_active miss=4 gap=-; t+43.042s node 6 short_loss_guard_active miss=5 gap=-; t+43.281s node 6 short_loss_guard_active miss=6 gap=-; t+43.535s node 6 short_loss_guard_active miss=7 gap=-; t+43.785s node 6 short_loss_guard_active miss=8 gap=-; t+44.032s node 6 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=39, rx_candidate_skipped=38, owed_rx_cleared=33, owed_rx_missed=19
- Scheduler-caused skips by node: 2=1, 3=30, 6=5, 7=2
- Owed selections by node: 2=2, 3=30, 6=4, 7=3
- Owed listens that still missed by node: 3=10, 6=9
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+48.494s node 3 owed_rx_cleared owed=1 skips=1; t+48.792s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+48.996s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+49.079s node 3 owed_rx_cleared owed=1 skips=1; t+49.293s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+49.330s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+49.497s node 3 owed_rx_cleared owed=1 skips=1; t+49.781s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+49.997s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+49.997s node 3 owed_rx_cleared owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 6234.9 | 316.6 | non_target_6_not_stable,non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.283s: mode `telemetry_first`
- Assigned packets received: 40
- Assigned RX coverage: 62%
- Sequence gap events: 36
- Missing sequence IDs: 54
- Max sequence gap: 7
- Assigned slot misses: 24
- Non-assigned preemptions: 0
- Owed RX active: True node=3 count=2
- Fairness skips: 6
- Owed selections: 6
- Owed misses: 2
- Max scheduler skips: 2
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 118
- node 7: t+4.366s seq 112 -> t+4.883s seq 114; missing [113]
- node 7: t+4.883s seq 114 -> t+6.167s seq 119; missing [115, 116, 117, 118]
- node 7: t+6.167s seq 119 -> t+7.101s seq 123; missing [120, 121, 122]
- node 7: t+7.101s seq 123 -> t+7.600s seq 125; missing [124]
- node 7: t+7.600s seq 125 -> t+8.102s seq 127; missing [126]
- node 7: t+8.102s seq 127 -> t+8.643s seq 129; missing [128]
- node 7: t+8.643s seq 129 -> t+9.196s seq 131; missing [130]
- node 7: t+9.196s seq 131 -> t+9.810s seq 133; missing [132]
- node 7: t+9.810s seq 133 -> t+10.196s seq 135; missing [134]
- node 7: t+10.196s seq 135 -> t+10.810s seq 137; missing [136]
- node 7: t+10.810s seq 137 -> t+11.196s seq 139; missing [138]
- node 7: t+11.196s seq 139 -> t+11.810s seq 141; missing [140]

## State Flicker
- Node 3: 3 rapid state transitions: t+4.667s offline->online, t+21.032s locking->online, t+45.047s locking->online
- Node 6: 2 rapid state transitions: t+4.966s offline->online, t+27.232s locking->online
- Node 7: 2 rapid state transitions: t+4.366s offline->online, t+33.131s locking->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 291
- drone_telemetry: 161
- telemetry_rebind_event: 65
- assignment_event: 44
- bind_progress_event: 40
- inter_gc_status: 31
- assignments: 21
- drone_link_status: 20
- search_event: 13
- bench_marker: 11
- command: 11
- command_ack: 11
- drone_debug_status: 8
- assignment_timing_hint: 8
- drone_debug_event: 5
- drone_live_status: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
- drone_join_event: 2
