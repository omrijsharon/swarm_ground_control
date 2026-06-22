# Live Debug Log Summary

- Source: `logs_summary\telemetry_coverage_75s_200ms_guarded_20260620.jsonl`
- Parsed records: 648
- Approx duration: 100.4s

## Commands
- Sent commands: 9
- ACKs: 9 (0 rejected)
- t+25.290s ACK magc/magic_ground_control get_status accepted: -
- t+35.109s ACK telegc/telemetry_ground_control get_status accepted: -
- t+45.272s ACK telegc/telemetry_ground_control get_status accepted: -
- t+55.315s ACK telegc/telemetry_ground_control get_status accepted: -
- t+65.363s ACK telegc/telemetry_ground_control get_status accepted: -
- t+75.517s ACK telegc/telemetry_ground_control get_status accepted: -
- t+85.606s ACK telegc/telemetry_ground_control get_status accepted: -
- t+95.690s ACK telegc/telemetry_ground_control get_status accepted: -

## Bind And Search
- Search events: 0
- Bind progress events: 5
- Assignment events: 5
- Assignment event counts: telemetry_period_observed=2, post_bind_first_telemetry=1, telemetry_period_rejected=1, telemetry_period_locked=1
- t+12.193s node 7: timing - telemetry_period_observed
- t+12.203s node 7: telemetry_bind - telemetry_live
- t+12.808s node 7: timing - telemetry_period_observed
- t+13.087s node 7: timing - telemetry_period_rejected
- t+13.090s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=2, timeouts=0
- node 7

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 435

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+95.730s: mode `telemetry_first`
- Assigned packets received: 411
- Assigned RX coverage: 100%
- Sequence gap events: 2
- Missing sequence IDs: 7
- Max sequence gap: 5
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=8

## Telemetry Sequence Gaps
- Observed sequence gaps: 3
- node 7: t+12.203s seq 37 -> t+12.891s seq 42; missing [38, 39, 40, 41]
- node 7: t+12.891s seq 42 -> t+13.087s seq 45; missing [43, 44]
- node 7: t+26.588s seq 107 -> t+26.588s seq 113; missing [108, 109, 110, 111, 112]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 435
- inter_gc_status: 36
- command: 9
- command_ack: 9
- gc_status: 8
- assignment_event: 5
- bind_progress_event: 5
- scanner_event: 3
- coverage_marker: 2
- assignments: 2
- drone_link_status: 2
- assignment_timing_hint: 1
