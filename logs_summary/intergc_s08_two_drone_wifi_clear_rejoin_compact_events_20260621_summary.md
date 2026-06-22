# Live Debug Log Summary

- Source: `logs_summary\intergc_s08_two_drone_wifi_clear_rejoin_compact_events_20260621.jsonl`
- Parsed records: 1342
- Approx duration: 150.2s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 16284 ms, max 16641 ms, avg 16462 ms
- Inter-GC queued command events: 2
- t+24.285s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+24.693s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 14
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 18
- Suspicious JSON fragment lines: 4
- Malformed samples: t+4.366s telegc: {"type":"scanner_event","event":"auto_shared_rx_started","sourceRole":"magic_ground_control","nodeId":3,"frequencyMhz":9; t+65.794s telegc: {"schemaVersion":1,"type":"assignment_timing_hint","source":"magc","sentAtUs":83341711,"requestId":11,"nodeId":6,"channe; t+79.633s telegc: {"type":"telemetry_rebind_event","event":"timing_hint_sent","sourceRole":"magic_ground_control","nodeId":6,"reason":"con
- Fragment samples: t+90.421s telegc: ta":1,"rssi":-35,"snr":13,"messageId":75}; t+109.758s telegc: essageId":95}; t+116.560s telegc: essageId":101}

## Bind And Search
- Search events: 70
- Bind progress events: 16
- Assignment events: 19
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, join_request_received=2, assign_reused=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, silence_sent=1, assign_created=1, post_bind_first_telemetry=1, telemetry_period_rejected=1, orphan_assignment_recovered=1
- Auto shared RX: starts=2, active_ticks=0, joins=0, completes=67
- Auto shared RX scanner events: 7
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- t+25.922s node 3: quiet - join_request_received
- t+26.535s node 3: ack - assign_sent
- t+26.942s node 3: telemetry_bind - assignment_completed
- t+27.964s node 3: quiet - assign_reused
- t+28.167s node 3: assign - silence_sent
- t+31.964s node 6: quiet - join_request_received
- t+31.993s node 6: timing - telemetry_period_observed
- t+32.020s node 6: telemetry_bind - telemetry_live
- t+32.162s node 6: timing - telemetry_period_rejected
- t+32.506s node 6: complete - telemetry_period_locked
- t+56.976s node 3: timing - telemetry_period_observed
- t+57.387s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=2, timeouts=0
- node 3; ACK->telemetry -21.838s; acquire->telemetry -22.041s
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 581

## Short-Loss Guard
- Telemetry rebind events: 262
- Short-loss event counts: short_loss_guard_active=19, short_loss_guard_started=6, short_loss_guard_expired=2, short_loss_recovered=2
- Short-loss recovered observed gaps: count=2, avg=2.0, max=2
- Recent short-loss events: t+58.316s node 6 short_loss_guard_active miss=6 gap=-; t+58.516s node 6 short_loss_guard_active miss=7 gap=-; t+58.717s node 6 short_loss_guard_active miss=8 gap=-; t+58.915s node 6 short_loss_guard_expired miss=9 gap=-; t+104.963s node 3 short_loss_guard_started miss=1 gap=-; t+105.372s node 3 short_loss_recovered miss=1 gap=2; t+133.136s node 3 short_loss_guard_started miss=1 gap=-; t+133.367s node 3 short_loss_recovered miss=1 gap=2

## Telemetry Sequence Gaps
- Observed sequence gaps: 14
- node 6: t+4.530s seq 244 -> t+4.961s seq 246; missing [245]
- node 6: t+4.961s seq 246 -> t+14.544s seq 38; missing [247, 248, 249, 250, 251, 252, 253, 254, 255, 0, 1, 2, 3, 4, 5, 6, +17 more]
- node 6: t+14.544s seq 38 -> t+14.951s seq 40; missing [39]
- node 6: t+14.951s seq 40 -> t+15.356s seq 42; missing [41]
- node 6: t+15.356s seq 42 -> t+32.020s seq 2; missing [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, +17 more]
- node 3: t+4.901s seq 201 -> t+14.330s seq 249; missing [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, +17 more]
- node 3: t+14.330s seq 249 -> t+14.747s seq 251; missing [250]
- node 3: t+14.747s seq 251 -> t+15.153s seq 253; missing [252]
- node 3: t+56.976s seq 173 -> t+57.400s seq 175; missing [174]
- node 3: t+57.400s seq 175 -> t+59.962s seq 187; missing [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186]
- node 3: t+104.793s seq 155 -> t+105.372s seq 158; missing [156, 157]
- node 3: t+105.957s seq 159 -> t+106.159s seq 162; missing [160, 161]

## Transport Findings
- Malformed serial JSON payloads: 18.
- Suspicious JSON fragments: 4.

## State Flicker
- Node 3: 2 rapid state transitions: t+4.901s offline->online, t+57.157s offline->online

## Event Counts
- drone_telemetry: 581
- telemetry_rebind_event: 262
- scanner_event: 199
- search_event: 70
- assignment_event: 19
- bind_progress_event: 16
- inter_gc_status: 14
- assignments: 11
- drone_link_status: 8
- assignment_timing_hint: 4
- command: 2
- inter_gc_command_queued: 2
- command_ack: 2
- gc_status: 1
