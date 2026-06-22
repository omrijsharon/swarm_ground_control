# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_final_valid_reset_20260620.jsonl`
- Parsed records: 1062
- Approx duration: 164.8s

## Commands
- Sent commands: 1
- ACKs: 1 (1 rejected)
- t+37.859s ACK magc/telemetry_ground_control clear_all_assignments rejected: magc_link_unavailable

## Bind And Search
- Search events: 11
- Bind progress events: 7
- Assignment events: 7
- Assignment event counts: telemetry_period_observed=2, post_bind_first_telemetry=2, telemetry_period_locked=2, telemetry_period_rejected=1
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=11
- Auto shared RX scanner events: 3
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- t+39.029s node 3: timing - telemetry_period_observed
- t+39.043s node 3: telemetry_bind - telemetry_live
- t+39.146s node 6: timing - telemetry_period_observed
- t+39.159s node 6: telemetry_bind - telemetry_live
- t+39.329s node 3: timing - telemetry_period_rejected
- t+39.358s node 6: complete - telemetry_period_locked
- t+39.483s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=0
- node 3
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 214

## Short-Loss Guard
- Telemetry rebind events: 78
- Short-loss event counts: short_loss_guard_active=14, short_loss_guard_started=2, short_loss_guard_expired=2
- Recent short-loss events: t+63.868s node 6 short_loss_guard_active miss=2 gap=-; t+64.787s node 6 short_loss_guard_active miss=3 gap=-; t+65.705s node 6 short_loss_guard_active miss=4 gap=-; t+66.623s node 6 short_loss_guard_active miss=5 gap=-; t+67.538s node 6 short_loss_guard_active miss=6 gap=-; t+68.548s node 6 short_loss_guard_active miss=7 gap=-; t+69.468s node 6 short_loss_guard_active miss=8 gap=-; t+70.389s node 6 short_loss_guard_expired miss=9 gap=-

## Telemetry Sequence Gaps
- Observed sequence gaps: 2
- node 3: t+39.067s seq 116 -> t+39.329s seq 118; missing [117]
- node 6: t+39.370s seq 48 -> t+39.848s seq 50; missing [49]

## State Flicker
- Node 6: 2 rapid state transitions: t+70.980s offline->locking, t+71.576s locking->offline

## Event Counts
- scanner_event: 477
- drone_telemetry: 214
- telemetry_rebind_event: 78
- inter_gc_status: 32
- search_event: 11
- assignment_event: 7
- bind_progress_event: 7
- drone_link_status: 5
- assignments: 3
- assignment_timing_hint: 2
- command: 1
- command_ack: 1
