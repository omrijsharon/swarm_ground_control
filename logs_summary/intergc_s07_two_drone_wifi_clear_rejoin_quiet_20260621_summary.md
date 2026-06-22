# Live Debug Log Summary

- Source: `logs_summary\intergc_s07_two_drone_wifi_clear_rejoin_quiet_20260621.jsonl`
- Parsed records: 3038
- Approx duration: 150.2s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 742 ms, max 896 ms, avg 819 ms
- Inter-GC queued command events: 2
- t+8.744s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.949s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 17
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Suspicious JSON fragment lines: 0
- Malformed samples: t+31.510s telegc: {"type":"bind_progress_event","event":"join_request_received","nodeId":3,"sourceRole":"magic_ground_control","phase":"qu

## Bind And Search
- Search events: 1
- Bind progress events: 13
- Assignment events: 17
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, join_request_received=2, post_bind_first_telemetry=2, assign_created=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, telemetry_period_rejected=1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=0, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+9.763s to t+9.763s
- t+4.188s node 6: timing - telemetry_period_observed
- t+4.363s node 3: complete - telemetry_period_locked
- t+4.585s node 6: complete - telemetry_period_locked
- t+22.739s node 6: quiet - join_request_received
- t+22.966s node 6: timing - telemetry_period_observed
- t+22.980s node 6: telemetry_bind - telemetry_live
- t+23.200s node 6: complete - telemetry_period_locked
- t+31.510s node 3: ack - assign_sent
- t+31.947s node 3: timing - telemetry_period_observed
- t+31.961s node 3: telemetry_bind - telemetry_live
- t+32.552s node 3: timing - telemetry_period_rejected
- t+32.765s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=4, timeouts=0
- node 3; ACK->telemetry -27.726s; acquire->telemetry -27.726s
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 666

## Short-Loss Guard
- Telemetry rebind events: 722
- Short-loss event counts: short_loss_guard_started=241, short_loss_recovered=241, short_loss_guard_active=240
- Short-loss recovered observed gaps: count=241, avg=1.5, max=4
- Recent short-loss events: t+148.892s node 6 short_loss_guard_active miss=2 gap=-; t+148.979s node 6 short_loss_recovered miss=2 gap=1; t+149.429s node 6 short_loss_guard_started miss=1 gap=-; t+149.501s node 6 short_loss_guard_active miss=2 gap=-; t+149.579s node 6 short_loss_recovered miss=2 gap=2; t+149.811s node 6 short_loss_guard_started miss=1 gap=-; t+149.892s node 6 short_loss_guard_active miss=2 gap=-; t+149.979s node 6 short_loss_recovered miss=2 gap=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 497
- node 3: t+3.965s seq 50 -> t+4.376s seq 52; missing [51]
- node 3: t+4.376s seq 52 -> t+4.979s seq 55; missing [53, 54]
- node 3: t+4.979s seq 55 -> t+5.379s seq 57; missing [56]
- node 3: t+5.379s seq 57 -> t+5.778s seq 59; missing [58]
- node 3: t+5.778s seq 59 -> t+6.176s seq 61; missing [60]
- node 3: t+6.176s seq 61 -> t+6.577s seq 63; missing [62]
- node 3: t+6.577s seq 63 -> t+6.977s seq 65; missing [64]
- node 3: t+6.977s seq 65 -> t+7.377s seq 67; missing [66]
- node 3: t+7.377s seq 67 -> t+7.777s seq 69; missing [68]
- node 3: t+7.777s seq 69 -> t+8.336s seq 71; missing [70]
- node 3: t+8.336s seq 71 -> t+8.744s seq 73; missing [72]
- node 3: t+8.744s seq 73 -> t+32.137s seq 3; missing [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, +17 more]

## Transport Findings
- Malformed serial JSON payloads: 1.

## State Flicker
- Node 6: 1 rapid state transitions: t+4.322s offline->online

## Event Counts
- scanner_event: 1455
- telemetry_rebind_event: 722
- drone_telemetry: 666
- assignment_event: 17
- inter_gc_status: 17
- bind_progress_event: 13
- assignments: 8
- drone_link_status: 5
- assignment_timing_hint: 4
- command: 2
- inter_gc_command_queued: 2
- command_ack: 2
- session_event: 2
- gc_status: 1
- search_event: 1
