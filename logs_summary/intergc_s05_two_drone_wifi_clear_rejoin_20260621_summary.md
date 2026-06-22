# Live Debug Log Summary

- Source: `logs_summary\intergc_s05_two_drone_wifi_clear_rejoin_20260621.jsonl`
- Parsed records: 1143
- Approx duration: 150.0s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 212 ms, max 262 ms, avg 237 ms
- Inter-GC queued command events: 2
- t+8.263s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.264s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 23
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 2
- Suspicious JSON fragment lines: 13
- Malformed samples: t+23.163s telegc: {"schemaVersion":1,"type":"assignment_upsert","source":"magc","sentAtUs":1989590560,"assignmentRevision":6284444,"nodeId; t+32.144s telegc: {"type":"bind_progress_event","event":"join_request_received","nodeId":6,"sourceRole":"magic_ground_control","phase":"qu
- Fragment samples: t+22.971s telegc: rtedGcMillis":6284442,"lastSequenceId":0,"lastSequenceValid":false,"messageId":3056}; t+22.971s telegc: rtedGcMillis":6284442,"lastSequenceId":0,"lastSequenceValid":false,"messageId":3056}; t+32.754s telegc: tedGcMillis":6284442,"lastSequenceId":0,"lastSequenceValid":false,"messageId":3061}

## Bind And Search
- Search events: 16
- Bind progress events: 8
- Assignment events: 9
- Assignment event counts: join_request_received=2, telemetry_period_observed=2, post_bind_first_telemetry=2, telemetry_period_locked=2, silence_sent=1
- Empty-assignment shared RX: starts=0, active_ticks=32, joins=0, completes=0, oocr_deferred=0
- t+22.564s node 3: quiet - join_request_received
- t+23.176s node 3: timing - telemetry_period_observed
- t+23.190s node 3: telemetry_bind - telemetry_live
- t+23.376s node 3: complete - telemetry_period_locked
- t+34.117s node 6: assign - silence_sent
- t+34.225s node 6: timing - telemetry_period_observed
- t+34.238s node 6: telemetry_bind - telemetry_live
- t+34.846s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=0
- node 3
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 909

## Short-Loss Guard
- Telemetry rebind events: 2
- Short-loss event counts: short_loss_guard_started=1, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=3.0, max=3
- Recent short-loss events: t+34.328s node 3 short_loss_guard_started miss=1 gap=-; t+34.575s node 3 short_loss_recovered miss=1 gap=3

## Telemetry Sequence Gaps
- Observed sequence gaps: 296
- node 3: t+33.571s seq 49 -> t+33.768s seq 56; missing [50, 51, 52, 53, 54, 55]
- node 3: t+34.213s seq 57 -> t+34.718s seq 61; missing [58, 59, 60]
- node 3: t+34.718s seq 61 -> t+35.171s seq 63; missing [62]
- node 3: t+35.171s seq 63 -> t+35.578s seq 65; missing [64]
- node 3: t+35.578s seq 65 -> t+35.967s seq 67; missing [66]
- node 3: t+35.967s seq 67 -> t+36.374s seq 69; missing [68]
- node 3: t+36.374s seq 69 -> t+36.780s seq 71; missing [70]
- node 3: t+36.780s seq 71 -> t+37.171s seq 73; missing [72]
- node 3: t+37.171s seq 73 -> t+37.579s seq 75; missing [74]
- node 3: t+37.579s seq 75 -> t+37.972s seq 77; missing [76]
- node 3: t+37.972s seq 77 -> t+38.379s seq 79; missing [78]
- node 3: t+38.379s seq 79 -> t+38.771s seq 81; missing [80]

## Transport Findings
- Malformed serial JSON payloads: 2.
- Suspicious JSON fragments: 13.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 909
- scanner_event: 26
- inter_gc_status: 23
- search_event: 16
- assignment_event: 9
- bind_progress_event: 8
- assignments: 6
- command: 2
- inter_gc_command_queued: 2
- command_ack: 2
- session_event: 2
- drone_link_status: 2
- assignment_timing_hint: 2
- telemetry_rebind_event: 2
- gc_status: 1
