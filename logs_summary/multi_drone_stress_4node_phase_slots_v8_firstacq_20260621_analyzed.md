# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_4node_phase_slots_v8_firstacq_20260621.jsonl`
- Parsed records: 3916
- Approx duration: 194.3s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 21 ms, max 4772 ms, avg 512 ms
- Inter-GC queued command events: 2
- t+0.338s ACK drone/drone get_status accepted: -
- t+8.376s ACK telegc/telemetry_ground_control get_status accepted: -
- t+13.128s ACK magc/magic_ground_control get_status accepted: -
- t+13.435s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+13.578s ACK drone/drone debug_reboot accepted: -
- t+13.632s ACK drone/drone debug_reboot accepted: -
- t+13.710s ACK drone/drone debug_reboot accepted: -
- t+13.771s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 86
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
- Search events: 34
- Bind progress events: 35
- Assignment events: 46
- Assignment event counts: post_bind_acquire_timeout=7, telemetry_period_observed=6, telemetry_period_locked=6, join_request_received=4, assign_created=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, post_bind_first_telemetry=3
- Auto shared RX: starts=2, active_ticks=0, joins=0, completes=19
- Auto shared RX scanner events: 21
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=5, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+13.789s to t+41.005s
- t+32.553s node 7: telemetry_bind - assignment_completed
- t+35.356s node 7: timing - telemetry_period_observed
- t+35.381s node 7: telemetry_bind - telemetry_live
- t+36.105s node 7: complete - telemetry_period_locked
- t+40.397s node 3: quiet - join_request_received
- t+40.598s node 3: quiet - assign_created
- t+40.598s node 3: assign - silence_sent
- t+40.598s node 3: ack - assign_sent
- t+40.801s node 3: telemetry_bind - assignment_completed
- t+43.676s node 3: timing - telemetry_period_observed
- t+43.689s node 3: telemetry_bind - telemetry_live
- t+45.440s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=6, timeouts=14
- node 2; timeouts=8
- node 3; ACK->telemetry -37.014s; acquire->telemetry -37.014s; timeouts=2
- node 6; ACK->telemetry -22.519s; acquire->telemetry -22.519s; timeouts=2
- node 7; ACK->telemetry -28.265s; acquire->telemetry -28.265s; timeouts=2

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 12
- Drone telemetry rows: 119
- t+0.139s node 2: drone_debug_status assigned_telemetry
- t+0.199s node 3: drone_debug_status assigned_telemetry
- t+0.279s node 6: drone_debug_status assigned_telemetry
- t+0.338s node 7: drone_debug_status assigned_telemetry
- t+13.578s node 2: drone_debug_event reboot_scheduled
- t+13.578s node 2: drone_debug_status assigned_telemetry
- t+13.631s node 3: drone_debug_event reboot_scheduled
- t+13.632s node 3: drone_debug_status assigned_telemetry
- t+13.709s node 6: drone_debug_event reboot_scheduled
- t+13.710s node 6: drone_debug_status assigned_telemetry
- t+13.771s node 7: drone_debug_event reboot_scheduled
- t+13.772s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 91
- No short-loss guard events found.

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=473, owed_rx_selected=146, owed_rx_cleared=1
- Scheduler-caused skips by node: 6=3, 7=470
- Owed selections by node: 6=71, 7=75
- Max consecutive scheduler skips observed: 235
- Recent fairness events: t+193.056s node 7 owed_rx_selected selected=7 owed=3 skips=235; t+193.123s node 6 owed_rx_selected selected=6 owed=3 skips=3; t+193.265s node 7 owed_rx_selected selected=7 owed=3 skips=235; t+193.376s node 6 owed_rx_selected selected=6 owed=3 skips=3; t+193.518s node 7 owed_rx_selected selected=7 owed=3 skips=235; t+193.747s node 6 owed_rx_selected selected=6 owed=3 skips=3; t+193.806s node 7 owed_rx_selected selected=7 owed=3 skips=235; t+194.001s node 6 owed_rx_selected selected=6 owed=3 skips=3; t+194.013s node 7 owed_rx_selected selected=7 owed=3 skips=235; t+194.126s node 6 owed_rx_selected selected=6 owed=3 skips=3

## Telemetry Coverage
- Latest status at t+8.416s: mode `telemetry_first`
- Assigned packets received: 7
- Assigned RX coverage: 28%
- Sequence gap events: 4
- Missing sequence IDs: 12
- Max sequence gap: 5
- Assigned slot misses: 18
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 15
- node 3: t+3.787s seq 239 -> t+4.308s seq 241; missing [240]
- node 3: t+4.308s seq 241 -> t+43.799s seq 16; missing [242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 0, 1, +14 more]
- node 3: t+43.799s seq 16 -> t+45.621s seq 23; missing [17, 18, 19, 20, 21, 22]
- node 3: t+45.621s seq 23 -> t+175.916s seq 33; missing [24, 25, 26, 27, 28, 29, 30, 31, 32]
- node 7: t+4.086s seq 215 -> t+4.771s seq 217; missing [216]
- node 7: t+4.771s seq 217 -> t+6.270s seq 223; missing [218, 219, 220, 221, 222]
- node 7: t+6.270s seq 223 -> t+11.074s seq 243; missing [224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, +3 more]
- node 7: t+13.108s seq 251 -> t+35.381s seq 16; missing [252, 253, 254, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, +4 more]
- node 7: t+35.381s seq 16 -> t+36.132s seq 19; missing [17, 18]
- node 7: t+36.132s seq 19 -> t+49.392s seq 72; missing [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, +17 more]
- node 7: t+49.897s seq 74 -> t+108.861s seq 54; missing [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, +17 more]
- node 6: t+4.947s seq 166 -> t+6.583s seq 172; missing [167, 168, 169, 170, 171]

## State Flicker
- Node 6: 1 rapid state transitions: t+30.791s offline->online
- Node 7: 1 rapid state transitions: t+4.086s offline->online

## Event Counts
- scanner_event: 3298
- drone_telemetry: 119
- telemetry_rebind_event: 91
- inter_gc_status: 86
- assignment_event: 46
- bind_progress_event: 35
- search_event: 34
- assignments: 17
- drone_link_status: 13
- command: 11
- command_ack: 11
- drone_debug_status: 8
- bench_marker: 7
- assignment_timing_hint: 6
- drone_live_status: 4
- drone_debug_event: 4
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
