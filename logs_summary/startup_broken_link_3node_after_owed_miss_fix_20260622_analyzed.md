# Live Debug Log Summary

- Source: `logs_summary\startup_broken_link_3node_after_owed_miss_fix_20260622.jsonl`
- Parsed records: 906
- Approx duration: 56.9s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 21 ms, max 248 ms, avg 96 ms
- Inter-GC queued command events: 2
- t+12.403s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.541s ACK magc/magic_ground_control get_status accepted: -
- t+12.848s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+13.005s ACK drone/drone debug_reboot accepted: -
- t+13.063s ACK drone/drone debug_reboot accepted: -
- t+13.121s ACK drone/drone debug_reboot accepted: -
- t+40.504s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+46.563s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 28
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Suspicious JSON fragment lines: 0
- Malformed samples: t+52.552s telegc: {"type":"bind_progress_event","event":"assignment_completed","sourceRole":"magic_ground_control","nodeId":3,"phase":"tel

## Bind And Search
- Search events: 13
- Bind progress events: 37
- Assignment events: 42
- Assignment event counts: telemetry_period_observed=7, telemetry_period_locked=7, join_request_received=4, post_bind_first_telemetry=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, assign_reused=1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=7, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+13.066s to t+52.808s
- t+40.203s node 3: telemetry_bind - telemetry_live
- t+40.321s node 3: assign - silence_sent
- t+40.422s node 3: ack - assign_sent
- t+40.456s node 3: complete - telemetry_period_locked
- t+40.504s node 3: telemetry_bind - assignment_completed
- t+52.031s node 3: quiet - join_request_received
- t+52.164s node 3: quiet - assign_reused
- t+52.164s node 3: assign - silence_sent
- t+52.169s node 3: timing - telemetry_period_observed
- t+52.186s node 3: telemetry_bind - telemetry_live
- t+52.412s node 3: ack - assign_sent
- t+52.436s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=8, timeouts=0
- node 3; ACK->telemetry -36.653s; acquire->telemetry -36.735s
- node 6; ACK->telemetry -25.289s; acquire->telemetry -25.289s
- node 7; ACK->telemetry -17.433s; acquire->telemetry -17.433s

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 13
- Drone telemetry rows: 199
- t+0.235s node 6: drone_debug_status assigned_telemetry
- t+0.367s node 7: drone_debug_status assigned_telemetry
- t+13.005s node 3: drone_debug_event reboot_scheduled
- t+13.005s node 3: drone_debug_status assigned_telemetry
- t+13.063s node 6: drone_debug_event reboot_scheduled
- t+13.063s node 6: drone_debug_status assigned_telemetry
- t+13.121s node 7: drone_debug_event reboot_scheduled
- t+13.121s node 7: drone_debug_status assigned_telemetry
- t+40.504s node 3: drone_debug_event telemetry_rf_loss_started
- t+40.504s node 3: drone_debug_status assigned_telemetry
- t+46.563s node 3: drone_debug_event join_runtime_reset
- t+46.563s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 49
- Short-loss event counts: short_loss_guard_active=14, short_loss_guard_started=2, short_loss_guard_expired=2
- Recent short-loss events: t+47.014s node 3 short_loss_guard_active miss=2 gap=-; t+47.270s node 3 short_loss_guard_active miss=3 gap=-; t+47.513s node 3 short_loss_guard_active miss=4 gap=-; t+47.769s node 3 short_loss_guard_active miss=5 gap=-; t+48.013s node 3 short_loss_guard_active miss=6 gap=-; t+48.269s node 3 short_loss_guard_active miss=7 gap=-; t+48.515s node 3 short_loss_guard_active miss=8 gap=-; t+48.769s node 3 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=72, rx_candidate_skipped=46, owed_rx_cleared=42, owed_rx_missed=12
- Scheduler-caused skips by node: 3=8, 6=4, 7=34
- Owed selections by node: 3=8, 6=15, 7=49
- Owed listens that still missed by node: 6=12
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+55.886s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+55.886s node 6 owed_rx_missed owed=1 skips=1; t+56.135s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+56.305s node 6 owed_rx_missed owed=1 skips=1; t+56.386s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+56.386s node 6 owed_rx_missed owed=1 skips=1; t+56.636s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+56.802s node 6 owed_rx_missed owed=1 skips=1; t+56.889s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+56.889s node 6 owed_rx_missed owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | 5892.2 | 42.5 | non_target_7_not_stable |

## Telemetry Coverage
- Latest status at t+12.454s: mode `telemetry_first`
- Assigned packets received: 31
- Assigned RX coverage: 51%
- Sequence gap events: 28
- Missing sequence IDs: 67
- Max sequence gap: 13
- Assigned slot misses: 29
- Non-assigned preemptions: 0
- Owed RX active: True node=3 count=1
- Fairness skips: 8
- Owed selections: 7
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 107
- node 3: t+3.769s seq 89 -> t+4.289s seq 91; missing [90]
- node 3: t+4.289s seq 91 -> t+5.282s seq 95; missing [92, 93, 94]
- node 3: t+5.282s seq 95 -> t+8.839s seq 109; missing [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108]
- node 3: t+8.839s seq 109 -> t+9.339s seq 111; missing [110]
- node 3: t+9.339s seq 111 -> t+9.840s seq 113; missing [112]
- node 3: t+9.840s seq 113 -> t+10.339s seq 115; missing [114]
- node 3: t+10.339s seq 115 -> t+10.832s seq 117; missing [116]
- node 3: t+10.832s seq 117 -> t+11.333s seq 119; missing [118]
- node 3: t+11.333s seq 119 -> t+11.833s seq 121; missing [120]
- node 3: t+11.833s seq 121 -> t+12.335s seq 123; missing [122]
- node 3: t+12.335s seq 123 -> t+40.222s seq 3; missing [124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, +17 more]
- node 3: t+40.469s seq 4 -> t+42.923s seq 14; missing [5, 6, 7, 8, 9, 10, 11, 12, 13]

## Transport Findings
- Malformed serial JSON payloads: 1.

## State Flicker
- Node 3: 2 rapid state transitions: t+40.469s locking->online, t+52.552s locking->online
- Node 6: 2 rapid state transitions: t+5.065s offline->online, t+30.822s locking->online
- Node 7: 1 rapid state transitions: t+21.538s locking->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 331
- drone_telemetry: 199
- telemetry_rebind_event: 49
- assignment_event: 42
- bind_progress_event: 37
- inter_gc_status: 28
- assignments: 19
- drone_link_status: 16
- search_event: 13
- bench_marker: 11
- command: 11
- command_ack: 11
- drone_debug_status: 8
- assignment_timing_hint: 7
- drone_debug_event: 5
- drone_live_status: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
- drone_join_event: 2
