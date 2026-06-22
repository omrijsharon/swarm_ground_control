# Live Debug Log Summary

- Source: `logs_summary\intergc_s04_post_cutoff_status_20260621.jsonl`
- Parsed records: 216
- Approx duration: 44.2s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 21 ms, max 171 ms, avg 96 ms
- Inter-GC queued command events: 1
- t+10.027s ACK telegc/telemetry_ground_control get_status accepted: -
- t+10.228s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 24
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 0

## Bind And Search
- Search events: 41
- Bind progress events: 0
- Assignment events: 0
- Empty-assignment shared RX: starts=0, active_ticks=82, joins=0, completes=0, oocr_deferred=0

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=0
- No post-bind timing rows found.

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 0

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+10.057s: mode `waiting_assignments`
- Assigned packets received: 0
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: waiting_assignments=1

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 42
- search_event: 41
- inter_gc_status: 24
- assignments: 2
- command: 2
- command_ack: 2
- gc_status: 2
- inter_gc_command_queued: 1
