# Live Debug Log Summary

- Source: `logs_summary\intergc_s02_bind_cancel_queue_20260621.jsonl`
- Parsed records: 1032
- Approx duration: 90.1s

## Commands
- Sent commands: 5
- ACKs: 5 (0 rejected)
- Derived ACK latency: min 153 ms, max 1857 ms, avg 1299 ms
- Inter-GC queued command events: 5
- t+10.155s ACK magc/magic_ground_control get_status accepted: -
- t+10.954s ACK magc/magic_ground_control start_search accepted: -
- t+11.884s ACK magc/magic_ground_control get_status accepted: -
- t+11.958s ACK magc/magic_ground_control cancel_search accepted: -
- t+12.064s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 7
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
- Search events: 3
- Bind progress events: 8
- Assignment events: 8
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4
- Operator shared RX: starts=1, active_ticks=0, completes=0
- Operator shared RX scanner events: 1
- Operator shared RX GC window: 142407 to 156602 ms (14.2s)
- Operator shared RX window observed: t+12.112s to t+12.112s
- t+3.767s node 3: timing - telemetry_period_observed
- t+3.867s node 6: timing - telemetry_period_observed
- t+3.995s node 3: complete - telemetry_period_locked
- t+4.064s node 6: complete - telemetry_period_locked
- t+12.567s node 3: timing - telemetry_period_observed
- t+12.667s node 6: timing - telemetry_period_observed
- t+12.803s node 3: complete - telemetry_period_locked
- t+13.064s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 855

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Sequence Gaps
- Observed sequence gaps: 5
- node 3: t+12.063s seq 50 -> t+12.653s seq 53; missing [51, 52]
- node 3: t+12.906s seq 54 -> t+13.455s seq 57; missing [55, 56]
- node 6: t+12.112s seq 70 -> t+12.760s seq 73; missing [71, 72]
- node 6: t+12.760s seq 73 -> t+13.279s seq 75; missing [74]
- node 6: t+13.279s seq 75 -> t+13.652s seq 77; missing [76]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 855
- assignment_event: 8
- bind_progress_event: 8
- scanner_event: 7
- inter_gc_status: 7
- assignments: 6
- command: 5
- inter_gc_command_queued: 5
- command_ack: 5
- gc_status: 5
- drone_link_status: 4
- assignment_timing_hint: 4
- search_event: 3
