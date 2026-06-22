# Live Debug Log Summary

- Source: `logs_summary\telemetry_coverage_60s_filtered_20260620.jsonl`
- Parsed records: 742
- Approx duration: 72.5s

## Commands
- Sent commands: 7
- ACKs: 6 (0 rejected)
- Pending/no ACK command IDs: coverage-magc-status-0001
- t+12.034s ACK telegc/telemetry_ground_control get_status accepted: -
- t+22.093s ACK telegc/telemetry_ground_control get_status accepted: -
- t+32.258s ACK telegc/telemetry_ground_control get_status accepted: -
- t+42.392s ACK telegc/telemetry_ground_control get_status accepted: -
- t+52.480s ACK telegc/telemetry_ground_control get_status accepted: -
- t+62.575s ACK telegc/telemetry_ground_control get_status accepted: -

## Bind And Search
- Search events: 0
- Bind progress events: 3
- Assignment events: 3
- Assignment event counts: telemetry_period_observed=1, telemetry_period_rejected=1, telemetry_period_locked=1
- t+11.703s node 7: timing - telemetry_period_observed
- t+11.795s node 7: timing - telemetry_period_rejected
- t+12.003s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 1
- Channel scan event counts: background_oocr_slice=1
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=0
- node 7

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 570

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+62.618s: mode `telemetry_first`
- Assigned packets received: 483
- Assigned RX coverage: 100%
- Sequence gap events: 24
- Missing sequence IDs: 26
- Max sequence gap: 2
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=6

## Telemetry Sequence Gaps
- Observed sequence gaps: 34
- node 7: t+12.034s seq 188 -> t+12.296s seq 190; missing [189]
- node 7: t+23.703s seq 48 -> t+23.892s seq 50; missing [49]
- node 7: t+23.892s seq 50 -> t+23.998s seq 52; missing [51]
- node 7: t+34.794s seq 159 -> t+34.992s seq 161; missing [160]
- node 7: t+35.297s seq 165 -> t+35.495s seq 167; missing [166]
- node 7: t+36.886s seq 179 -> t+36.886s seq 181; missing [180]
- node 7: t+37.095s seq 182 -> t+37.307s seq 184; missing [183]
- node 7: t+37.307s seq 185 -> t+37.490s seq 187; missing [186]
- node 7: t+37.792s seq 189 -> t+37.995s seq 191; missing [190]
- node 7: t+38.193s seq 193 -> t+38.403s seq 195; missing [194]
- node 7: t+38.496s seq 196 -> t+38.705s seq 198; missing [197]
- node 7: t+39.016s seq 200 -> t+39.016s seq 202; missing [201]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 570
- inter_gc_status: 16
- command: 7
- command_ack: 6
- gc_status: 6
- assignment_event: 3
- bind_progress_event: 3
- coverage_marker: 2
- scanner_event: 1
- channel_scan_event: 1
- assignments: 1
- drone_link_status: 1
- assignment_timing_hint: 1
