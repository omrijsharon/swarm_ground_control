# Live Debug Log Summary

- Source: `logs_summary\rf_loss_short_guard_40_20260620.jsonl`
- Parsed records: 2835
- Approx duration: 196.8s

## Commands
- Sent commands: 76
- ACKs: 69 (4 rejected)
- Pending/no ACK command IDs: rf-bench-magc-status-0002, rf-bench-magc-status-0003, rf-bench-magc-status-0005, rf-bench-magc-status-0007, rf-bench-magc-status-0009, rf-bench-prepare-bind-01, rf-bench-telegc-status-0002, rf-bench-telegc-status-0003
- t+167.600s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+171.297s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+174.994s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+178.713s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+182.417s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+186.116s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+189.810s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+193.500s ACK drone/drone debug_simulate_rf_loss accepted: -

## Bind And Search
- Search events: 23
- Bind progress events: 10
- Assignment events: 14
- Assignment event counts: telemetry_period_observed=3, telemetry_period_rejected=3, telemetry_period_locked=2, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, post_bind_first_telemetry=1
- Auto shared RX: starts=0, active_ticks=19, joins=0, completes=3
- Auto shared RX scanner events: 23
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout, auto_shared_rx_timeout
- t+54.512s node 7: quiet - join_request_received
- t+57.721s node 7: timing - telemetry_period_observed
- t+57.772s node 7: timing - telemetry_period_rejected
- t+58.372s node 7: complete - telemetry_period_locked
- t+58.735s node 7: timing - telemetry_period_observed
- t+58.755s node 7: telemetry_bind - telemetry_live
- t+58.933s node 7: timing - telemetry_period_rejected
- t+59.549s node 7: timing - telemetry_period_observed
- t+59.779s node 7: timing - telemetry_period_rejected
- t+59.791s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=2, timeouts=0
- node 7; ACK->telemetry 0.042s; drone assigned->telemetry 0.198s; acquire->telemetry 0.011s; drone first TX->telemetry 0.147s

## Drone Debug
- Drone JOIN events: 31
- JOIN event counts: join_backoff=10, join_request_sent=5, join_start_shared_channel=4, silence_received=2, join_request_lbt_blocked_or_tx_failed=2, post_assign_burst_tx=2, join_assign_ignored=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, first_assigned_telemetry_tx=1, msp_fixed_slot_learned=1
- JOIN backoff kinds: retry_normal=6, first_fast=4
- Drone debug events/status rows: 244
- Drone telemetry rows: 1239
- Simulated RF-loss packets: 140 sequenceIds=11, 12, 45, 46, 78, 79, 111, 112, 144, 145, 177, 178, +128 more
- t+189.950s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+190.144s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+190.144s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+190.352s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+190.352s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+193.500s node 7: drone_debug_event telemetry_rf_loss_started
- t+193.531s node 7: drone_debug_status assigned_telemetry
- t+193.648s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+193.848s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+193.848s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+194.050s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+194.050s node 7: drone_debug_event telemetry_rf_loss_simulated

## Short-Loss Guard
- Telemetry rebind events: 71
- Short-loss event counts: short_loss_guard_started=30, short_loss_recovered=30
- Short-loss recovered observed gaps: count=30, avg=4.0, max=5
- Recent short-loss events: t+182.719s node 7 short_loss_guard_started miss=1 gap=-; t+182.995s node 7 short_loss_recovered miss=1 gap=5; t+186.425s node 7 short_loss_guard_started miss=1 gap=-; t+186.689s node 7 short_loss_recovered miss=1 gap=5; t+190.123s node 7 short_loss_guard_started miss=1 gap=-; t+190.394s node 7 short_loss_recovered miss=1 gap=5; t+193.823s node 7 short_loss_guard_started miss=1 gap=-; t+194.092s node 7 short_loss_recovered miss=1 gap=5

## RF Loss Bench Trials
| Lost packets | Trials | Pass | Avg pre-sim missing | Avg post-sim extra | Avg missing count | Avg extra missing | Max extra missing | Link events | Rebind trials |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2 | 10 | 10/10 | 2.8 | 0.0 | 4.8 | +2.8 | +7.0 | 0 | 0/10 |
| 3 | 10 | 10/10 | 1.6 | 0.0 | 4.6 | +1.6 | +2.0 | 0 | 0/10 |
| 4 | 10 | 10/10 | 2.2 | 0.0 | 6.2 | +2.2 | +3.0 | 0 | 0/10 |
| 5 | 10 | 10/10 | 1.7 | 0.0 | 6.7 | +1.7 | +3.0 | 0 | 0/10 |

## Telemetry Sequence Gaps
- Observed sequence gaps: 43
- node 7: t+57.721s seq 0 -> t+57.979s seq 2; missing [1]
- node 7: t+58.486s seq 3 -> t+58.694s seq 9; missing [4, 5, 6, 7, 8]
- node 7: t+58.913s seq 10 -> t+59.141s seq 13; missing [11, 12]
- node 7: t+59.689s seq 14 -> t+59.779s seq 21; missing [15, 16, 17, 18, 19, 20]
- node 7: t+62.183s seq 44 -> t+62.384s seq 47; missing [45, 46]
- node 7: t+65.493s seq 77 -> t+65.680s seq 80; missing [78, 79]
- node 7: t+68.798s seq 110 -> t+68.983s seq 113; missing [111, 112]
- node 7: t+72.089s seq 143 -> t+72.290s seq 146; missing [144, 145]
- node 7: t+75.389s seq 176 -> t+75.593s seq 179; missing [177, 178]
- node 7: t+78.685s seq 209 -> t+78.888s seq 212; missing [210, 211]
- node 7: t+81.986s seq 242 -> t+82.187s seq 245; missing [243, 244]
- node 7: t+85.282s seq 19 -> t+85.485s seq 22; missing [20, 21]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 1239
- scanner_event: 304
- drone_debug_event: 189
- drone_live_status: 149
- drone_fc_status: 140
- bench_marker: 103
- command: 76
- telemetry_rebind_event: 71
- command_ack: 69
- drone_debug_status: 55
- drone_join_event: 31
- inter_gc_status: 24
- search_event: 23
- assignment_event: 14
- bind_progress_event: 10
- gc_status: 7
- assignments: 5
- drone_link_status: 4
- assignment_timing_hint: 2
