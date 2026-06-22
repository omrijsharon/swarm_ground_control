# Live Debug Log Summary

- Source: `logs_summary\startup_broken_link_3node_after_owed_cap_20260622.jsonl`
- Parsed records: 1143
- Approx duration: 68.7s

## Commands
- Sent commands: 13
- ACKs: 13 (0 rejected)
- Derived ACK latency: min 23 ms, max 200 ms, avg 92 ms
- Inter-GC queued command events: 2
- t+12.647s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+12.737s ACK drone/drone debug_reboot accepted: -
- t+12.793s ACK drone/drone debug_reboot accepted: -
- t+12.869s ACK drone/drone debug_reboot accepted: -
- t+35.830s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+41.982s ACK drone/drone debug_restart_join accepted: -
- t+51.666s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+57.748s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 37
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Suspicious JSON fragment lines: 1
- Malformed samples: t+47.401s telegc: {"type":"bind_progress_event","event":"assignment_completed","sourceRole":"magic_ground_control","nodeId":3,"phase":"tel
- Fragment samples: t+21.133s telegc: hannelIndex":9,"radioProfileId":0,"txPeind_acquire_started","sourceRole":"magic_ground_control","nodeId":6,"frequencyMhz

## Bind And Search
- Search events: 16
- Bind progress events: 45
- Assignment events: 51
- Assignment event counts: telemetry_period_observed=8, telemetry_period_locked=8, join_request_received=5, silence_sent=5, post_bind_first_telemetry=5, assign_sent=5, join_ack_received=5, post_bind_acquire_started=5, assign_created=3, assign_reused=2
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=10, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+12.862s to t+63.750s
- t+47.017s node 3: telemetry_bind - telemetry_live
- t+47.193s node 3: assign - silence_sent
- t+47.193s node 3: ack - assign_sent
- t+47.286s node 3: complete - telemetry_period_locked
- t+62.633s node 6: timing - telemetry_period_observed
- t+62.660s node 6: telemetry_bind - telemetry_live
- t+62.878s node 6: quiet - join_request_received
- t+62.914s node 6: complete - telemetry_period_locked
- t+63.001s node 6: quiet - assign_reused
- t+63.136s node 6: assign - silence_sent
- t+63.251s node 6: ack - assign_sent
- t+63.334s node 6: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=9, first_telemetry=10, timeouts=0
- node 3; ACK->telemetry -31.699s; acquire->telemetry -31.699s
- node 6; ACK->telemetry -17.202s; acquire->telemetry -17.202s
- node 7; ACK->telemetry -22.757s; acquire->telemetry -22.757s

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 17
- Drone telemetry rows: 286
- t+12.793s node 6: drone_debug_event reboot_scheduled
- t+12.793s node 6: drone_debug_status assigned_telemetry
- t+12.868s node 7: drone_debug_event reboot_scheduled
- t+12.869s node 7: drone_debug_status assigned_telemetry
- t+35.830s node 3: drone_debug_event telemetry_rf_loss_started
- t+35.831s node 3: drone_debug_status assigned_telemetry
- t+41.982s node 3: drone_debug_event join_runtime_reset
- t+41.982s node 3: drone_debug_status backoff
- t+51.666s node 6: drone_debug_event telemetry_rf_loss_started
- t+51.666s node 6: drone_debug_status assigned_telemetry
- t+57.748s node 6: drone_debug_event join_runtime_reset
- t+57.748s node 6: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 11
- Short-loss event counts: short_loss_guard_active=6, short_loss_guard_started=3, short_loss_recovered=2
- Short-loss recovered observed gaps: count=2, avg=8.5, max=13
- Recent short-loss events: t+39.197s node 3 short_loss_recovered miss=3 gap=13; t+42.019s node 3 short_loss_guard_started miss=1 gap=-; t+43.151s node 3 short_loss_guard_active miss=2 gap=-; t+44.151s node 3 short_loss_guard_active miss=3 gap=-; t+45.154s node 3 short_loss_guard_active miss=4 gap=-; t+46.151s node 3 short_loss_guard_active miss=5 gap=-; t+63.149s node 6 short_loss_guard_started miss=1 gap=-; t+64.150s node 6 short_loss_recovered miss=1 gap=4

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=126, rx_candidate_skipped=103, owed_rx_cleared=98, owed_rx_missed=26
- Scheduler-caused skips by node: 6=81, 7=22
- Owed selections by node: 6=104, 7=22
- Owed listens that still missed by node: 6=26
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+67.201s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+67.344s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+67.397s node 6 owed_rx_cleared owed=1 skips=1; t+67.695s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+67.898s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+67.898s node 6 owed_rx_cleared owed=1 skips=1; t+68.198s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+68.398s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+68.398s node 6 owed_rx_cleared owed=1 skips=1; t+68.650s node 6 rx_candidate_skipped selected=7 owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 1/2
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 5321.9 | 44.9 | - |
| 6 | 9 | no | 6513.6 | 1006.3 | non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.270s: mode `telemetry_first`
- Assigned packets received: 57
- Assigned RX coverage: 95%
- Sequence gap events: 40
- Missing sequence IDs: 43
- Max sequence gap: 2
- Assigned slot misses: 3
- Non-assigned preemptions: 0
- Owed RX active: True node=7 count=1
- Fairness skips: 23
- Owed selections: 22
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 204
- node 6: t+3.703s seq 93 -> t+4.387s seq 95; missing [94]
- node 6: t+4.387s seq 95 -> t+5.036s seq 98; missing [96, 97]
- node 6: t+5.036s seq 98 -> t+5.538s seq 100; missing [99]
- node 6: t+5.538s seq 100 -> t+6.040s seq 102; missing [101]
- node 6: t+6.040s seq 102 -> t+6.550s seq 104; missing [103]
- node 6: t+6.550s seq 104 -> t+7.040s seq 106; missing [105]
- node 6: t+7.040s seq 106 -> t+7.537s seq 108; missing [107]
- node 6: t+7.537s seq 108 -> t+8.050s seq 110; missing [109]
- node 6: t+8.050s seq 110 -> t+8.540s seq 112; missing [111]
- node 6: t+8.540s seq 112 -> t+9.049s seq 114; missing [113]
- node 6: t+9.049s seq 114 -> t+9.550s seq 116; missing [115]
- node 6: t+9.550s seq 116 -> t+10.051s seq 118; missing [117]

## Transport Findings
- Malformed serial JSON payloads: 1.
- Suspicious JSON fragments: 1.

## State Flicker
- Node 3: 2 rapid state transitions: t+35.551s locking->online, t+47.301s locking->online
- Node 6: 2 rapid state transitions: t+21.132s locking->online, t+62.927s locking->online
- Node 7: 2 rapid state transitions: t+4.193s offline->online, t+27.083s locking->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 466
- drone_telemetry: 286
- assignment_event: 51
- bind_progress_event: 45
- inter_gc_status: 37
- assignments: 22
- drone_link_status: 19
- search_event: 16
- bench_marker: 15
- command: 13
- command_ack: 13
- telemetry_rebind_event: 11
- drone_debug_status: 10
- assignment_timing_hint: 8
- drone_debug_event: 7
- drone_join_event: 4
- drone_live_status: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
