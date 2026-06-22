# Live Debug Log Summary

- Source: `logs_summary\intergc_s00_status_smoke_reliable_output_20260621.jsonl`
- Parsed records: 622
- Approx duration: 50.0s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 14 ms, max 338 ms, avg 176 ms
- Inter-GC queued command events: 1
- t+12.015s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.340s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 5
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 10
- Malformed samples: t+12.340s telegc: {"schemaVersion":1,"type":"sgc_command_output","source":"magc","sentAtUs":21143957,"commandId":"live-dbg-magc-0002","com; t+12.340s telegc: {"schemaVersion":1,"type":"sgc_command_output","source":"magc","sentAtUs":21157568,"commandId":"live-dbg-magc-0002","com; t+12.511s telegc: {"schemaVersion":1,"type":"sgc_command_output","source":"magc","sentAtUs":21157568,"commandId":"live-dbg-magc-0002","com

## Bind And Search
- Search events: 0
- Bind progress events: 9
- Assignment events: 9
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, telemetry_period_rejected=1
- t+3.829s node 3: timing - telemetry_period_observed
- t+3.928s node 6: timing - telemetry_period_observed
- t+4.113s node 3: timing - telemetry_period_rejected
- t+4.124s node 6: complete - telemetry_period_locked
- t+4.253s node 3: complete - telemetry_period_locked
- t+15.030s node 3: timing - telemetry_period_observed
- t+15.128s node 6: timing - telemetry_period_observed
- t+15.253s node 3: complete - telemetry_period_locked
- t+15.326s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 444

## Short-Loss Guard
- Telemetry rebind events: 3
- Short-loss event counts: short_loss_guard_started=1, short_loss_guard_active=1, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=2.0, max=2
- Recent short-loss events: t+13.685s node 3 short_loss_guard_started miss=1 gap=-; t+13.763s node 3 short_loss_guard_active miss=2 gap=-; t+14.020s node 3 short_loss_recovered miss=2 gap=2

## Telemetry Coverage
- Latest status at t+12.055s: mode `telemetry_first`
- Assigned packets received: 82
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 9
- node 3: t+12.189s seq 11 -> t+12.712s seq 13; missing [12]
- node 3: t+12.712s seq 13 -> t+13.019s seq 15; missing [14]
- node 3: t+13.457s seq 17 -> t+14.020s seq 20; missing [18, 19]
- node 3: t+14.020s seq 20 -> t+15.115s seq 26; missing [21, 22, 23, 24, 25]
- node 6: t+12.015s seq 30 -> t+12.511s seq 32; missing [31]
- node 6: t+12.511s seq 32 -> t+12.821s seq 34; missing [33]
- node 6: t+12.821s seq 34 -> t+13.228s seq 36; missing [35]
- node 6: t+13.684s seq 38 -> t+14.442s seq 40; missing [39]
- node 6: t+14.442s seq 40 -> t+15.223s seq 46; missing [41, 42, 43, 44, 45]

## Transport Findings
- Malformed serial JSON payloads: 10.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 444
- scanner_event: 11
- assignment_event: 9
- bind_progress_event: 9
- assignments: 6
- inter_gc_status: 5
- drone_link_status: 4
- assignment_timing_hint: 4
- telemetry_rebind_event: 3
- command: 2
- command_ack: 2
- gc_status: 1
- inter_gc_command_queued: 1
