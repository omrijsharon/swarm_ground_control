# Live Debug Log Summary

- Source: `logs_summary\intergc_s00_status_smoke_longguard_20260621.jsonl`
- Parsed records: 609
- Approx duration: 50.1s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 32 ms, max 208 ms, avg 120 ms
- Inter-GC queued command events: 1
- t+12.033s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.209s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 2
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Malformed samples: t+12.209s telegc: {"type":"gc_status","nodeRole":"magic_ground_control","sourceRole":"magic_ground_control","radioProfileId":0,"sharedFreq

## Bind And Search
- Search events: 0
- Bind progress events: 8
- Assignment events: 8
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4
- t+3.712s node 3: timing - telemetry_period_observed
- t+3.810s node 6: timing - telemetry_period_observed
- t+3.939s node 3: complete - telemetry_period_locked
- t+4.008s node 6: complete - telemetry_period_locked
- t+12.909s node 3: timing - telemetry_period_observed
- t+13.006s node 6: timing - telemetry_period_observed
- t+13.135s node 3: complete - telemetry_period_locked
- t+13.204s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 460

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+12.072s: mode `telemetry_first`
- Assigned packets received: 84
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 2
- node 3: t+12.442s seq 207 -> t+12.921s seq 210; missing [208, 209]
- node 6: t+12.443s seq 227 -> t+13.101s seq 230; missing [228, 229]

## Transport Findings
- Malformed serial JSON payloads: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 460
- assignment_event: 8
- bind_progress_event: 8
- assignments: 6
- scanner_event: 4
- drone_link_status: 4
- assignment_timing_hint: 4
- command: 2
- command_ack: 2
- inter_gc_status: 2
- gc_status: 1
- inter_gc_command_queued: 1
