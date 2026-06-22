# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_4node_20260621.jsonl`
- Parsed records: 5226
- Approx duration: 189.7s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 20 ms, max 297 ms, avg 98 ms
- Inter-GC queued command events: 2
- t+0.352s ACK drone/drone get_status accepted: -
- t+8.385s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.547s ACK magc/magic_ground_control get_status accepted: -
- t+8.886s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.969s ACK drone/drone debug_reboot accepted: -
- t+9.059s ACK drone/drone debug_reboot accepted: -
- t+9.112s ACK drone/drone debug_reboot accepted: -
- t+9.152s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 86
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 2
- Suspicious JSON fragment lines: 0
- Malformed samples: t+98.442s telegc: {"temetry_ground_control","nodeId":2,"frequencyMhz":922.5,"channelIdex":40,"radioProfileId":0,"nextTstGcMillis":98244,"e; t+176.102s telegc: {"type""channelIndex":40,"radioProfileId":0,"nextTstGcMillis":175913,"estimatedTstGcMillis":0,"lastRxDoneGcMillis":0,"tx

## Bind And Search
- Search events: 31
- Bind progress events: 38
- Assignment events: 47
- Assignment event counts: telemetry_period_observed=6, post_bind_first_telemetry=6, telemetry_period_locked=6, post_bind_acquire_timeout=5, join_request_received=4, assign_created=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=21
- Auto shared RX scanner events: 18
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+8.886s to t+16.764s
- t+28.937s node 6: telemetry_bind - assignment_completed
- t+32.734s node 6: timing - telemetry_period_observed
- t+32.744s node 6: telemetry_bind - telemetry_live
- t+33.127s node 6: complete - telemetry_period_locked
- t+36.895s node 7: quiet - join_request_received
- t+36.955s node 7: quiet - assign_created
- t+36.955s node 7: assign - silence_sent
- t+36.955s node 7: ack - assign_sent
- t+37.024s node 7: telemetry_bind - assignment_completed
- t+40.556s node 7: timing - telemetry_period_observed
- t+40.567s node 7: telemetry_bind - telemetry_live
- t+40.977s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=12, timeouts=10
- node 2; timeouts=6
- node 3; ACK->telemetry -12.470s; acquire->telemetry -12.470s
- node 6; ACK->telemetry -25.118s; acquire->telemetry -25.118s; timeouts=2
- node 7; ACK->telemetry -32.759s; acquire->telemetry -32.759s; timeouts=2

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 12
- Drone telemetry rows: 238
- t+0.159s node 2: drone_debug_status assigned_telemetry
- t+0.232s node 3: drone_debug_status assigned_telemetry
- t+0.298s node 6: drone_debug_status assigned_telemetry
- t+0.352s node 7: drone_debug_status assigned_telemetry
- t+8.969s node 2: drone_debug_event reboot_scheduled
- t+8.975s node 2: drone_debug_status assigned_telemetry
- t+9.059s node 3: drone_debug_event reboot_scheduled
- t+9.059s node 3: drone_debug_status assigned_telemetry
- t+9.112s node 6: drone_debug_event reboot_scheduled
- t+9.113s node 6: drone_debug_status assigned_telemetry
- t+9.152s node 7: drone_debug_event reboot_scheduled
- t+9.152s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 122
- Short-loss event counts: short_loss_guard_active=15, short_loss_guard_started=3, short_loss_guard_expired=2, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=4.0, max=4
- Recent short-loss events: t+173.911s node 3 short_loss_guard_active miss=5 gap=-; t+174.309s node 3 short_loss_guard_active miss=6 gap=-; t+174.709s node 3 short_loss_guard_active miss=7 gap=-; t+175.112s node 3 short_loss_guard_active miss=8 gap=-; t+175.513s node 3 short_loss_guard_expired miss=9 gap=-; t+182.407s node 3 short_loss_guard_started miss=1 gap=-; t+182.684s node 3 short_loss_guard_active miss=2 gap=-; t+182.966s node 3 short_loss_recovered miss=2 gap=4

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=1126, rx_candidate_skipped=989, owed_rx_cleared=178, owed_rx_missed=20
- Scheduler-caused skips by node: 3=142, 6=473, 7=374
- Owed selections by node: 3=525, 6=259, 7=342
- Owed listens that still missed by node: 3=20
- Max consecutive scheduler skips observed: 255
- Recent fairness events: t+189.002s node 7 rx_candidate_skipped selected=6 owed=3 skips=53; t+189.095s node 3 owed_rx_selected selected=3 owed=3 skips=12; t+189.200s node 6 owed_rx_selected selected=6 owed=3 skips=255; t+189.273s node 7 rx_candidate_skipped selected=6 owed=3 skips=54; t+189.400s node 3 owed_rx_selected selected=3 owed=3 skips=12; t+189.426s node 6 owed_rx_selected selected=6 owed=3 skips=255; t+189.426s node 7 rx_candidate_skipped selected=6 owed=3 skips=55; t+189.493s node 6 owed_rx_selected selected=6 owed=3 skips=255; t+189.504s node 3 rx_candidate_skipped selected=6 owed=3 skips=13; t+189.678s node 7 rx_candidate_skipped selected=6 owed=3 skips=56

## Telemetry Coverage
- Latest status at t+8.425s: mode `telemetry_first`
- Assigned packets received: 14
- Assigned RX coverage: 36%
- Sequence gap events: 11
- Missing sequence IDs: 51
- Max sequence gap: 14
- Assigned slot misses: 24
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 196
- node 6: t+3.806s seq 227 -> t+4.802s seq 232; missing [228, 229, 230, 231]
- node 6: t+4.802s seq 232 -> t+7.418s seq 245; missing [233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244]
- node 6: t+7.418s seq 245 -> t+7.807s seq 247; missing [246]
- node 6: t+7.807s seq 247 -> t+8.365s seq 249; missing [248]
- node 6: t+8.365s seq 249 -> t+32.757s seq 25; missing [250, 251, 252, 253, 254, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, +15 more]
- node 6: t+32.757s seq 25 -> t+33.160s seq 27; missing [26]
- node 6: t+33.160s seq 27 -> t+42.735s seq 75; missing [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, +17 more]
- node 6: t+42.735s seq 75 -> t+45.136s seq 87; missing [76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86]
- node 6: t+45.136s seq 87 -> t+47.333s seq 98; missing [88, 89, 90, 91, 92, 93, 94, 95, 96, 97]
- node 6: t+47.333s seq 98 -> t+49.940s seq 111; missing [99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110]
- node 6: t+49.940s seq 111 -> t+52.340s seq 123; missing [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]
- node 6: t+52.340s seq 123 -> t+54.739s seq 135; missing [124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134]

## Transport Findings
- Malformed serial JSON payloads: 2.

## State Flicker
- Node 6: 1 rapid state transitions: t+32.757s offline->online
- Node 7: 1 rapid state transitions: t+40.577s offline->online

## Event Counts
- scanner_event: 4457
- drone_telemetry: 238
- telemetry_rebind_event: 122
- inter_gc_status: 86
- assignment_event: 47
- bind_progress_event: 38
- search_event: 31
- assignments: 18
- command: 11
- command_ack: 11
- drone_link_status: 11
- drone_debug_status: 8
- bench_marker: 7
- assignment_timing_hint: 6
- drone_live_status: 4
- drone_debug_event: 4
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
