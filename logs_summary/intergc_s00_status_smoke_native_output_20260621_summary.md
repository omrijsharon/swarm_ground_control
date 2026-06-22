# Live Debug Log Summary

- Source: `logs_summary\intergc_s00_status_smoke_native_output_20260621.jsonl`
- Parsed records: 612
- Approx duration: 50.1s

## Commands
- Sent commands: 2
- ACKs: 3 (0 rejected)
- Derived ACK latency: min 36 ms, max 368 ms, avg 188 ms
- Inter-GC queued command events: 1
- Duplicate ACK command IDs: live-dbg-magc-0002
- t+12.038s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.161s ACK magc/magic_ground_control get_status accepted: -
- t+12.370s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 6
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
- t+3.716s node 3: timing - telemetry_period_observed
- t+3.815s node 6: timing - telemetry_period_observed
- t+4.065s node 3: complete - telemetry_period_locked
- t+4.206s node 6: complete - telemetry_period_locked
- t+13.315s node 3: timing - telemetry_period_observed
- t+13.414s node 6: timing - telemetry_period_observed
- t+13.528s node 3: complete - telemetry_period_locked
- t+13.609s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 453

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+12.076s: mode `telemetry_first`
- Assigned packets received: 82
- Assigned RX coverage: 100%
- Sequence gap events: 2
- Missing sequence IDs: 2
- Max sequence gap: 1
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 6
- node 3: t+4.199s seq 110 -> t+4.397s seq 112; missing [111]
- node 3: t+12.370s seq 151 -> t+12.995s seq 155; missing [152, 153, 154]
- node 3: t+12.995s seq 155 -> t+13.400s seq 157; missing [156]
- node 6: t+3.905s seq 129 -> t+4.306s seq 131; missing [130]
- node 6: t+12.038s seq 170 -> t+12.895s seq 172; missing [171]
- node 6: t+12.895s seq 172 -> t+13.505s seq 177; missing [173, 174, 175, 176]

## Transport Findings
- Duplicate ACKs for 1 command ID(s).

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 453
- assignment_event: 8
- bind_progress_event: 8
- inter_gc_status: 6
- assignments: 6
- scanner_event: 5
- drone_link_status: 4
- assignment_timing_hint: 4
- command_ack: 3
- command: 2
- gc_status: 2
- inter_gc_command_queued: 1
