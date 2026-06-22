# Live Debug Log Summary

- Source: `logs_summary\intergc_s01_magc_burst_compactbody_20260621.jsonl`
- Parsed records: 893
- Approx duration: 75.2s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- Derived ACK latency: min 21 ms, max 1034 ms, avg 580 ms
- Inter-GC queued command events: 6
- t+10.157s ACK magc/magic_ground_control get_status accepted: -
- t+10.279s ACK telegc/telemetry_ground_control get_status accepted: -
- t+10.553s ACK magc/magic_ground_control get_status accepted: -
- t+10.850s ACK magc/magic_ground_control get_channel_table accepted: -
- t+10.985s ACK magc/magic_ground_control get_assignments accepted: -
- t+10.987s ACK magc/magic_ground_control get_status accepted: -
- t+11.343s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 7
- Max reliable queue depth: 3
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 0

## Bind And Search
- Search events: 0
- Bind progress events: 8
- Assignment events: 8
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4
- t+3.700s node 3: timing - telemetry_period_observed
- t+3.800s node 6: timing - telemetry_period_observed
- t+3.926s node 3: complete - telemetry_period_locked
- t+3.998s node 6: complete - telemetry_period_locked
- t+11.700s node 3: timing - telemetry_period_observed
- t+11.800s node 6: timing - telemetry_period_observed
- t+11.925s node 3: complete - telemetry_period_locked
- t+11.998s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 709

## Short-Loss Guard
- Telemetry rebind events: 3
- Short-loss event counts: short_loss_guard_started=1, short_loss_guard_active=1, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=1.0, max=1
- Recent short-loss events: t+10.553s node 3 short_loss_guard_started miss=1 gap=-; t+10.608s node 3 short_loss_guard_active miss=2 gap=-; t+10.693s node 3 short_loss_recovered miss=2 gap=1

## Telemetry Coverage
- Latest status at t+10.317s: mode `telemetry_first`
- Assigned packets received: 66
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 4
- node 3: t+10.455s seq 16 -> t+10.786s seq 18; missing [17]
- node 3: t+11.343s seq 21 -> t+11.787s seq 23; missing [22]
- node 6: t+10.553s seq 36 -> t+10.850s seq 38; missing [37]
- node 6: t+11.343s seq 40 -> t+11.893s seq 43; missing [41, 42]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 709
- scanner_event: 10
- assignment_event: 8
- bind_progress_event: 8
- inter_gc_status: 7
- command: 7
- command_ack: 7
- assignments: 6
- inter_gc_command_queued: 6
- gc_status: 5
- drone_link_status: 4
- assignment_timing_hint: 4
- telemetry_rebind_event: 3
