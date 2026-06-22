# Live Debug Log Summary

- Source: `logs_summary\check_new_drone_dual_gc_capture_20260620.jsonl`
- Parsed records: 287
- Approx duration: 44.9s

## Commands
- Sent commands: 0
- ACKs: 0 (0 rejected)

## Bind And Search
- Search events: 0
- Bind progress events: 3
- Assignment events: 3
- Assignment event counts: telemetry_period_observed=1, post_bind_first_telemetry=1, telemetry_period_locked=1
- t+10.855s node 3: timing - telemetry_period_observed
- t+10.885s node 3: telemetry_bind - telemetry_live
- t+11.058s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=2, timeouts=0
- node 3

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 144

## Short-Loss Guard
- Telemetry rebind events: 6
- Short-loss event counts: short_loss_guard_active=5, short_loss_guard_started=1
- Recent short-loss events: t+40.082s node 3 short_loss_guard_started miss=1 gap=-; t+41.002s node 3 short_loss_guard_active miss=2 gap=-; t+41.919s node 3 short_loss_guard_active miss=3 gap=-; t+42.839s node 3 short_loss_guard_active miss=4 gap=-; t+43.760s node 3 short_loss_guard_active miss=5 gap=-; t+44.673s node 3 short_loss_guard_active miss=6 gap=-

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 144
- scanner_event: 15
- inter_gc_status: 11
- telemetry_rebind_event: 6
- assignment_event: 3
- bind_progress_event: 3
- assignments: 1
- drone_link_status: 1
- assignment_timing_hint: 1
