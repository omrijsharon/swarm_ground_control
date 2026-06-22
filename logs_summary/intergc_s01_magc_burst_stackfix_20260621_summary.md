# Live Debug Log Summary

- Source: `logs_summary\intergc_s01_magc_burst_stackfix_20260621.jsonl`
- Parsed records: 879
- Approx duration: 75.2s

## Commands
- Sent commands: 7
- ACKs: 3 (0 rejected)
- Derived ACK latency: min 481 ms, max 920 ms, avg 749 ms
- Inter-GC queued command events: 3
- Pending/no ACK command IDs: live-dbg-magc-0004, live-dbg-magc-0005, live-dbg-magc-0007, live-dbg-telegc-0006
- t+10.482s ACK magc/magic_ground_control get_status accepted: -
- t+10.847s ACK magc/magic_ground_control get_status accepted: -
- t+10.921s ACK magc/magic_ground_control get_channel_table accepted: -

## Inter-GC Transport
- Inter-GC status rows: 9
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
- t+3.285s node 3: timing - telemetry_period_observed
- t+3.388s node 6: timing - telemetry_period_observed
- t+3.628s node 3: complete - telemetry_period_locked
- t+3.781s node 6: complete - telemetry_period_locked
- t+11.281s node 3: timing - telemetry_period_observed
- t+11.387s node 6: timing - telemetry_period_observed
- t+11.503s node 3: complete - telemetry_period_locked
- t+11.579s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 712

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Sequence Gaps
- Observed sequence gaps: 4
- node 3: t+3.772s seq 18 -> t+3.980s seq 20; missing [19]
- node 3: t+10.772s seq 54 -> t+11.375s seq 57; missing [55, 56]
- node 6: t+3.478s seq 37 -> t+3.878s seq 39; missing [38]
- node 6: t+10.847s seq 74 -> t+11.477s seq 77; missing [75, 76]

## Transport Findings
- Missing ACKs for 4 command(s).

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 712
- inter_gc_status: 9
- assignment_event: 8
- bind_progress_event: 8
- command: 7
- assignments: 6
- scanner_event: 4
- drone_link_status: 4
- assignment_timing_hint: 4
- inter_gc_command_queued: 3
- command_ack: 3
- gc_status: 2
