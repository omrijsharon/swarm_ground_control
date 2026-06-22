# Live Debug Log Summary

- Source: `logs_summary\rf_loss_bench_40_after_coverage_20260620.jsonl`
- Parsed records: 1858
- Approx duration: 170.3s

## Commands
- Sent commands: 64
- ACKs: 60 (3 rejected)
- Pending/no ACK command IDs: rf-bench-magc-status-0002, rf-bench-magc-status-0003, rf-bench-magc-status-0006, rf-bench-prepare-bind-02
- t+145.399s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+148.625s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+151.854s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+154.966s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+158.194s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+161.412s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+164.625s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+167.783s ACK drone/drone debug_simulate_rf_loss accepted: -

## Bind And Search
- Search events: 9
- Bind progress events: 13
- Assignment events: 25
- Assignment event counts: silence_sent=4, assign_sent=4, join_ack_timeout=3, telemetry_period_rejected=3, post_bind_acquire_timeout=2, join_request_received=2, telemetry_period_observed=2, post_bind_first_telemetry=2, join_ack_received=1, post_bind_acquire_started=1, telemetry_period_locked=1
- Auto shared RX: starts=0, active_ticks=7, joins=0, completes=0
- Auto shared RX scanner events: 7
- t+31.607s node 7: assign - silence_sent
- t+39.543s node 7: assign - silence_sent
- t+50.479s node 7: quiet - join_request_received
- t+51.506s node 7: assign - silence_sent
- t+53.829s node 7: timing - telemetry_period_observed
- t+53.850s node 7: telemetry_bind - telemetry_live
- t+54.554s node 7: timing - telemetry_period_rejected
- t+54.656s node 7: timing - telemetry_period_observed
- t+54.666s node 7: telemetry_bind - telemetry_live
- t+55.730s node 7: timing - telemetry_period_rejected
- t+55.847s node 7: timing - telemetry_period_rejected
- t+56.135s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=4, timeouts=4
- node 7; ACK->telemetry 0.073s; drone assigned->telemetry 0.399s; acquire->telemetry 0.031s; drone first TX->telemetry 0.168s; timeouts=4

## Drone Debug
- Drone JOIN events: 31
- JOIN event counts: join_backoff=8, join_request_sent=6, silence_received=4, join_start_shared_channel=3, join_assign_ignored=2, post_assign_burst_tx=2, join_request_lbt_blocked_or_tx_failed=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, first_assigned_telemetry_tx=1, msp_fixed_slot_learned=1
- JOIN backoff kinds: first_fast=4, retry_normal=4
- Drone debug events/status rows: 236
- Drone telemetry rows: 437
- Simulated RF-loss packets: 140 sequenceIds=8, 9, 22, 23, 35, 36, 48, 49, 60, 61, 73, 74, +128 more
- t+164.834s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+165.042s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+165.251s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+165.458s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+165.533s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+167.783s node 7: drone_debug_event telemetry_rf_loss_started
- t+167.986s node 7: drone_debug_status assigned_telemetry
- t+167.986s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+168.194s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+168.404s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+168.541s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+168.884s node 7: drone_debug_event telemetry_rf_loss_simulated

## Short-Loss Guard
- Telemetry rebind events: 67
- Short-loss event counts: short_loss_guard_started=29, short_loss_recovered=29
- Short-loss recovered observed gaps: count=29, avg=4.0, max=5
- Recent short-loss events: t+158.826s node 7 short_loss_guard_started miss=1 gap=-; t+159.324s node 7 short_loss_recovered miss=1 gap=5; t+162.030s node 7 short_loss_guard_started miss=1 gap=-; t+162.521s node 7 short_loss_recovered miss=1 gap=5; t+165.231s node 7 short_loss_guard_started miss=1 gap=-; t+165.721s node 7 short_loss_recovered miss=1 gap=5; t+168.424s node 7 short_loss_guard_started miss=1 gap=-; t+168.924s node 7 short_loss_recovered miss=1 gap=5

## RF Loss Bench Trials
| Lost packets | Trials | Pass | Avg pre-sim missing | Avg post-sim extra | Avg missing count | Avg extra missing | Max extra missing | Link events | Rebind trials |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2 | 10 | 10/10 | 0.0 | 0.1 | 3.3 | +1.3 | +3.0 | 0 | 0/10 |
| 3 | 10 | 10/10 | 0.0 | 0.0 | 3.9 | +0.9 | +2.0 | 0 | 0/10 |
| 4 | 10 | 10/10 | 0.0 | 0.0 | 4.6 | +0.6 | +1.0 | 0 | 0/10 |
| 5 | 10 | 10/10 | 0.0 | 0.0 | 5.2 | +0.2 | +1.0 | 0 | 0/10 |

## Telemetry Coverage
- Latest status at t+53.161s: mode `telemetry_first`
- Assigned packets received: 0
- Assigned RX coverage: 0%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 144
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=6

## Telemetry Sequence Gaps
- Observed sequence gaps: 44
- node 7: t+53.850s seq 0 -> t+54.554s seq 3; missing [1, 2]
- node 7: t+54.554s seq 3 -> t+54.666s seq 5; missing [4]
- node 7: t+55.730s seq 6 -> t+55.848s seq 11; missing [7, 8, 9, 10]
- node 7: t+56.337s seq 12 -> t+56.337s seq 14; missing [13]
- node 7: t+58.039s seq 21 -> t+58.443s seq 24; missing [22, 23]
- node 7: t+60.499s seq 34 -> t+61.113s seq 37; missing [35, 36]
- node 7: t+63.122s seq 47 -> t+63.536s seq 50; missing [48, 49]
- node 7: t+65.407s seq 59 -> t+66.027s seq 62; missing [60, 61]
- node 7: t+68.068s seq 72 -> t+68.691s seq 75; missing [73, 74]
- node 7: t+70.544s seq 85 -> t+71.159s seq 88; missing [86, 87]
- node 7: t+73.032s seq 97 -> t+73.651s seq 100; missing [98, 99]
- node 7: t+75.657s seq 110 -> t+76.183s seq 113; missing [111, 112]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 437
- scanner_event: 233
- drone_debug_event: 186
- drone_live_status: 123
- drone_fc_status: 117
- bench_marker: 100
- telemetry_rebind_event: 67
- command: 64
- command_ack: 60
- drone_debug_status: 50
- drone_join_event: 31
- assignment_event: 25
- inter_gc_status: 19
- bind_progress_event: 13
- search_event: 9
- gc_status: 6
- drone_link_status: 4
- assignments: 3
- assignment_timing_hint: 1
