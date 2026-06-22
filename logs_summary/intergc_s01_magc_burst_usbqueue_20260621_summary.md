# Live Debug Log Summary

- Source: `logs_summary\intergc_s01_magc_burst_usbqueue_20260621.jsonl`
- Parsed records: 873
- Approx duration: 75.1s

## Commands
- Sent commands: 7
- ACKs: 3 (0 rejected)
- Derived ACK latency: min 59 ms, max 1423 ms, avg 874 ms
- Inter-GC queued command events: 3
- Pending/no ACK command IDs: live-dbg-magc-0004, live-dbg-magc-0005, live-dbg-magc-0007, live-dbg-telegc-0006
- t+10.060s ACK magc/magic_ground_control get_status accepted: -
- t+11.140s ACK magc/magic_ground_control get_status accepted: -
- t+11.424s ACK magc/magic_ground_control get_channel_table accepted: -

## Inter-GC Transport
- Inter-GC status rows: 7
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Malformed samples: t+10.934s telegc: {"schemaVersion":1,"type":"command_ack","source":"magc","sentAtUs":27874639,"commandId":"live-dbg-magc-0001","command":"

## Bind And Search
- Search events: 0
- Bind progress events: 8
- Assignment events: 8
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4
- t+3.742s node 3: timing - telemetry_period_observed
- t+3.845s node 6: timing - telemetry_period_observed
- t+3.969s node 3: complete - telemetry_period_locked
- t+4.034s node 6: complete - telemetry_period_locked
- t+12.140s node 3: timing - telemetry_period_observed
- t+12.241s node 6: timing - telemetry_period_observed
- t+12.364s node 3: complete - telemetry_period_locked
- t+12.438s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 707

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Sequence Gaps
- Observed sequence gaps: 4
- node 3: t+4.024s seq 248 -> t+4.435s seq 250; missing [249]
- node 3: t+11.687s seq 30 -> t+12.232s seq 33; missing [31, 32]
- node 6: t+4.236s seq 12 -> t+4.632s seq 14; missing [13]
- node 6: t+11.687s seq 50 -> t+12.340s seq 53; missing [51, 52]

## Transport Findings
- Missing ACKs for 4 command(s).
- Malformed serial JSON payloads: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 707
- assignment_event: 8
- bind_progress_event: 8
- inter_gc_status: 7
- command: 7
- assignments: 6
- scanner_event: 4
- drone_link_status: 4
- assignment_timing_hint: 4
- inter_gc_command_queued: 3
- command_ack: 3
- gc_status: 2
