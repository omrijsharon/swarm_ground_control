# Live Debug Log Summary

- Source: `logs_summary\intergc_s01_magc_burst_paced_20260621.jsonl`
- Parsed records: 880
- Approx duration: 75.0s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- Derived ACK latency: min 22 ms, max 1153 ms, avg 689 ms
- Inter-GC queued command events: 6
- t+10.160s ACK magc/magic_ground_control get_status accepted: -
- t+10.280s ACK telegc/telemetry_ground_control get_status accepted: -
- t+10.844s ACK magc/magic_ground_control get_status accepted: -
- t+11.056s ACK magc/magic_ground_control get_channel_table accepted: -
- t+11.056s ACK magc/magic_ground_control get_assignments accepted: -
- t+11.056s ACK magc/magic_ground_control get_status accepted: -
- t+11.462s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 11
- Max reliable queue depth: 3
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Malformed samples: t+11.866s telegc: {"type":"assignments","assignments":[{"nodeId":3,"frequencyMhz":920.5,"channelIndex":36,"radioProfileId":0,"txPeriodMs":

## Bind And Search
- Search events: 0
- Bind progress events: 8
- Assignment events: 8
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4
- t+3.826s node 3: timing - telemetry_period_observed
- t+3.926s node 6: timing - telemetry_period_observed
- t+4.051s node 3: complete - telemetry_period_locked
- t+4.124s node 6: complete - telemetry_period_locked
- t+12.223s node 3: timing - telemetry_period_observed
- t+12.323s node 6: timing - telemetry_period_observed
- t+12.453s node 3: complete - telemetry_period_locked
- t+12.521s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=0
- node 3
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 697

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+10.319s: mode `telemetry_first`
- Assigned packets received: 65
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 2
- node 3: t+10.718s seq 161 -> t+12.236s seq 169; missing [162, 163, 164, 165, 166, 167, 168]
- node 6: t+10.844s seq 181 -> t+12.416s seq 189; missing [182, 183, 184, 185, 186, 187, 188]

## Transport Findings
- Malformed serial JSON payloads: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 697
- inter_gc_status: 11
- assignment_event: 8
- bind_progress_event: 8
- command: 7
- command_ack: 7
- assignments: 6
- inter_gc_command_queued: 6
- gc_status: 5
- scanner_event: 4
- drone_link_status: 4
- assignment_timing_hint: 4
