# Live Debug Log Summary

- Source: `logs_summary\rf_loss_bench_40_20260620.jsonl`
- Parsed records: 2802
- Approx duration: 181.4s

## Commands
- Sent commands: 64
- ACKs: 58 (3 rejected)
- Pending/no ACK command IDs: rf-bench-magc-status-0002, rf-bench-magc-status-0004, rf-bench-magc-status-0005, rf-bench-magc-status-0006, rf-bench-prepare-bind-01, rf-bench-telegc-status-0002, rf-bench-telegc-status-0003
- t+153.221s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+156.800s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+160.306s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+164.004s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+167.702s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+171.309s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+174.908s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+178.440s ACK drone/drone debug_simulate_rf_loss accepted: -

## Bind And Search
- Search events: 103
- Bind progress events: 13
- Assignment events: 15
- Assignment event counts: telemetry_period_observed=3, telemetry_period_rejected=3, telemetry_period_locked=3, post_bind_first_telemetry=2, post_bind_acquire_timeout=1, join_request_received=1, silence_sent=1, assign_sent=1
- Auto shared RX: starts=0, active_ticks=86, joins=0, completes=16
- Auto shared RX scanner events: 14
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout, auto_shared_rx_timeout, auto_shared_rx_timeout
- t+39.571s node 7: assign - silence_sent
- t+41.698s node 7: timing - telemetry_period_observed
- t+41.707s node 7: telemetry_bind - telemetry_live
- t+41.895s node 7: timing - telemetry_period_rejected
- t+41.934s node 7: complete - telemetry_period_locked
- t+48.977s node 7: timing - telemetry_period_observed
- t+48.988s node 7: telemetry_bind - telemetry_live
- t+49.150s node 7: timing - telemetry_period_rejected
- t+49.444s node 7: complete - telemetry_period_locked
- t+50.593s node 7: timing - telemetry_period_observed
- t+50.794s node 7: timing - telemetry_period_rejected
- t+50.825s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=2
- node 7; drone assigned->telemetry 28.709s; drone first TX->telemetry 28.657s; timeouts=2

## Drone Debug
- Drone JOIN events: 28
- JOIN event counts: join_backoff=5, join_request_sent=4, post_assign_burst_tx=4, join_start_shared_channel=3, silence_received=2, join_assign_accepted=2, join_ack_sent=2, assigned_telemetry_started=2, first_assigned_telemetry_tx=2, msp_fixed_slot_learned=2
- JOIN backoff kinds: first_fast=3, retry_normal=2
- Drone debug events/status rows: 236
- Drone telemetry rows: 1170
- Simulated RF-loss packets: 140 sequenceIds=11, 12, 45, 46, 78, 79, 111, 112, 144, 145, 177, 178, +128 more
- t+175.118s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+175.118s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+175.327s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+175.327s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+175.528s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+178.440s node 7: drone_debug_event telemetry_rf_loss_started
- t+178.607s node 7: drone_debug_status assigned_telemetry
- t+178.607s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+178.607s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+178.758s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+178.964s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+178.964s node 7: drone_debug_event telemetry_rf_loss_simulated

## Telemetry Sequence Gaps
- Observed sequence gaps: 116
- node 7: t+41.707s seq 0 -> t+41.895s seq 2; missing [1]
- node 7: t+42.195s seq 4 -> t+42.395s seq 6; missing [5]
- node 7: t+42.808s seq 10 -> t+43.016s seq 13; missing [11, 12]
- node 7: t+43.297s seq 14 -> t+43.297s seq 16; missing [15]
- node 7: t+44.197s seq 24 -> t+44.395s seq 26; missing [25]
- node 7: t+45.296s seq 34 -> t+45.296s seq 36; missing [35]
- node 7: t+46.287s seq 44 -> t+46.392s seq 47; missing [45, 46]
- node 7: t+47.192s seq 54 -> t+47.294s seq 56; missing [55]
- node 7: t+48.548s seq 66 -> t+48.548s seq 68; missing [67]
- node 7: t+48.799s seq 69 -> t+48.799s seq 71; missing [70]
- node 7: t+49.136s seq 72 -> t+49.293s seq 75; missing [73, 74]
- node 7: t+49.651s seq 76 -> t+49.651s seq 80; missing [77, 78, 79]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 1170
- drone_debug_event: 186
- scanner_event: 170
- drone_live_status: 153
- drone_fc_status: 147
- search_event: 103
- bench_marker: 100
- command: 64
- command_ack: 58
- telemetry_rebind_event: 54
- drone_debug_status: 50
- inter_gc_status: 30
- drone_join_event: 28
- assignment_event: 15
- bind_progress_event: 13
- gc_status: 4
- drone_link_status: 4
- assignments: 3
- assignment_timing_hint: 3
