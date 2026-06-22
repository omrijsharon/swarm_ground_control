# Live Debug Log Summary

- Source: `logs_summary\intergc_s00_status_smoke_stackfix_20260621.jsonl`
- Parsed records: 662
- Approx duration: 55.1s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 38 ms, max 395 ms, avg 217 ms
- Inter-GC queued command events: 1
- t+15.046s ACK telegc/telemetry_ground_control get_status accepted: -
- t+15.403s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 4
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0

## Bind And Search
- Search events: 0
- Bind progress events: 8
- Assignment events: 8
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4
- t+3.717s node 3: timing - telemetry_period_observed
- t+3.811s node 6: timing - telemetry_period_observed
- t+3.943s node 3: complete - telemetry_period_locked
- t+4.013s node 6: complete - telemetry_period_locked
- t+16.317s node 3: timing - telemetry_period_observed
- t+16.419s node 6: timing - telemetry_period_observed
- t+16.543s node 3: complete - telemetry_period_locked
- t+16.616s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 510

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+15.079s: mode `telemetry_first`
- Assigned packets received: 114
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 2
- node 3: t+15.932s seq 125 -> t+16.401s seq 127; missing [126]
- node 6: t+15.932s seq 144 -> t+16.513s seq 147; missing [145, 146]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 510
- assignment_event: 8
- bind_progress_event: 8
- assignments: 6
- scanner_event: 4
- drone_link_status: 4
- assignment_timing_hint: 4
- inter_gc_status: 4
- command: 2
- command_ack: 2
- gc_status: 2
- inter_gc_command_queued: 1
