# Live Debug Log Summary

- Source: `logs_summary\manual_bind_abuse_after_postack_soften_20260622.jsonl`
- Parsed records: 1633
- Approx duration: 87.8s

## Commands
- Sent commands: 21
- ACKs: 21 (0 rejected)
- Derived ACK latency: min 18 ms, max 311 ms, avg 144 ms
- Inter-GC queued command events: 12
- t+39.416s ACK magc/magic_ground_control start_search accepted: -
- t+40.584s ACK magc/magic_ground_control cancel_search accepted: -
- t+41.338s ACK magc/magic_ground_control start_search accepted: -
- t+42.585s ACK magc/magic_ground_control cancel_search accepted: -
- t+43.337s ACK magc/magic_ground_control start_search accepted: -
- t+44.546s ACK magc/magic_ground_control cancel_search accepted: -
- t+71.315s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+77.385s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 49
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 1
- Fragment samples: t+21.288s telegc: indype":"bind_progress_event","event":"assignment_completed","sourceRole":"magic_ground_control","nodeId":3,"phase":"tel

## Bind And Search
- Search events: 23
- Bind progress events: 90
- Assignment events: 96
- Assignment event counts: telemetry_period_observed=30, post_bind_first_telemetry=27, telemetry_period_locked=14, join_request_received=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, orphan_assignment_recovered=1, assign_reused=1
- Operator shared/discovery RX: starts=5, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+35.800s to t+43.651s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=7, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+13.027s to t+83.387s
- t+45.664s node 7: telemetry_bind - telemetry_live
- t+45.881s node 6: complete - telemetry_period_locked
- t+46.425s node 7: complete - telemetry_period_locked
- t+82.023s node 3: complete - telemetry_period_locked
- t+82.530s node 3: timing - telemetry_period_observed
- t+82.544s node 3: telemetry_bind - telemetry_live
- t+82.781s node 3: quiet - join_request_received
- t+82.781s node 3: quiet - assign_reused
- t+82.794s node 3: complete - telemetry_period_locked
- t+82.889s node 3: assign - silence_sent
- t+83.089s node 3: ack - assign_sent
- t+83.282s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 3
- OOCR event counts: confirmed_drone=1, assignment_recovered=1, oocr_recovered_from_cad=1

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=54, timeouts=0
- node 2
- node 3; ACK->telemetry -16.198s; acquire->telemetry -16.198s
- node 6; ACK->telemetry -16.943s; acquire->telemetry -16.943s
- node 7; ACK->telemetry -30.991s; acquire->telemetry -30.991s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 13
- Drone telemetry rows: 169
- t+0.174s node 6: drone_debug_status assigned_telemetry
- t+0.289s node 7: drone_debug_status assigned_telemetry
- t+12.944s node 3: drone_debug_event reboot_scheduled
- t+12.945s node 3: drone_debug_status assigned_telemetry
- t+12.982s node 6: drone_debug_event reboot_scheduled
- t+12.983s node 6: drone_debug_status assigned_telemetry
- t+13.075s node 7: drone_debug_event reboot_scheduled
- t+13.075s node 7: drone_debug_status assigned_telemetry
- t+71.315s node 3: drone_debug_event telemetry_rf_loss_started
- t+71.315s node 3: drone_debug_status assigned_telemetry
- t+77.385s node 3: drone_debug_event join_runtime_reset
- t+77.385s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 67
- No short-loss guard events found.

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=28, owed_rx_selected=27, owed_rx_cleared=24
- Scheduler-caused skips by node: 3=25, 7=3
- Owed selections by node: 3=25, 7=2
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+86.282s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+86.378s node 3 owed_rx_cleared owed=1 skips=1; t+86.590s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+86.782s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+86.879s node 3 owed_rx_cleared owed=1 skips=1; t+87.091s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+87.283s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+87.379s node 3 owed_rx_cleared owed=1 skips=1; t+87.592s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+87.783s node 3 owed_rx_selected selected=3 owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 16032.9 | no | node_3_affected_by_bind,node_6_affected_by_bind,node_7_affected_by_bind |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 5940.9 | 237.1 | non_target_6_not_stable,non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.364s: mode `telemetry_first`
- Assigned packets received: 15
- Assigned RX coverage: 23%
- Sequence gap events: 11
- Missing sequence IDs: 55
- Max sequence gap: 24
- Assigned slot misses: 48
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 3
- Owed selections: 2
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 105
- node 7: t+4.040s seq 165 -> t+4.711s seq 167; missing [166]
- node 7: t+4.711s seq 167 -> t+10.872s seq 192; missing [168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, +8 more]
- node 7: t+10.872s seq 192 -> t+11.373s seq 194; missing [193]
- node 7: t+11.373s seq 194 -> t+11.873s seq 196; missing [195]
- node 7: t+11.873s seq 196 -> t+34.663s seq 3; missing [197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, +17 more]
- node 7: t+35.030s seq 4 -> t+36.416s seq 10; missing [5, 6, 7, 8, 9]
- node 7: t+36.416s seq 10 -> t+37.917s seq 16; missing [11, 12, 13, 14, 15]
- node 7: t+37.917s seq 16 -> t+40.416s seq 26; missing [17, 18, 19, 20, 21, 22, 23, 24, 25]
- node 7: t+40.416s seq 26 -> t+42.416s seq 34; missing [27, 28, 29, 30, 31, 32, 33]
- node 7: t+42.416s seq 34 -> t+44.546s seq 42; missing [35, 36, 37, 38, 39, 40, 41]
- node 7: t+44.546s seq 42 -> t+45.665s seq 47; missing [43, 44, 45, 46]
- node 7: t+45.665s seq 47 -> t+46.437s seq 50; missing [48, 49]

## Transport Findings
- Suspicious JSON fragments: 1.

## State Flicker
- Node 2: 1 rapid state transitions: t+12.398s online->offline
- Node 3: 2 rapid state transitions: t+4.842s offline->online, t+10.472s offline->online
- Node 7: 1 rapid state transitions: t+4.040s offline->online

## Terminal State Over Recent Telemetry
- t+12.398s node 2: link state `offline` 0.233s after telemetry

## Event Counts
- scanner_event: 800
- drone_telemetry: 169
- assignment_event: 96
- bind_progress_event: 90
- telemetry_rebind_event: 67
- assignments: 61
- inter_gc_status: 49
- drone_link_status: 39
- search_event: 23
- command: 21
- command_ack: 21
- bench_marker: 18
- assignment_timing_hint: 14
- gc_status: 12
- inter_gc_command_queued: 12
- drone_debug_status: 8
- drone_debug_event: 5
- drone_live_status: 3
- orphan_recovery_event: 3
- session_event: 2
