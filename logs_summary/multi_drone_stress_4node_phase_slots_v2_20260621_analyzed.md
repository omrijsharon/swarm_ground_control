# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_4node_phase_slots_v2_20260621.jsonl`
- Parsed records: 5544
- Approx duration: 192.6s

## Commands
- Sent commands: 11
- ACKs: 10 (0 rejected)
- Derived ACK latency: min 27 ms, max 279 ms, avg 95 ms
- Inter-GC queued command events: 2
- Pending/no ACK command IDs: multi-stress-startup-drone2-0012
- t+0.290s ACK drone/drone get_status accepted: -
- t+0.352s ACK drone/drone get_status accepted: -
- t+8.393s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.552s ACK magc/magic_ground_control get_status accepted: -
- t+8.878s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+12.127s ACK drone/drone debug_reboot accepted: -
- t+12.164s ACK drone/drone debug_reboot accepted: -
- t+12.196s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 121
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
- Search events: 199
- Bind progress events: 40
- Assignment events: 46
- Assignment event counts: telemetry_period_observed=6, post_bind_first_telemetry=6, telemetry_period_locked=6, silence_sent=6, assign_sent=5, join_request_received=4, assign_created=4, join_ack_received=3, post_bind_acquire_started=3, join_ack_timeout=2, post_bind_acquire_timeout=1
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=191
- Auto shared RX scanner events: 8
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+9.083s to t+20.620s
- t+34.441s node 3: ack - assign_sent
- t+34.467s node 3: telemetry_bind - assignment_completed
- t+34.499s node 3: timing - telemetry_period_observed
- t+34.524s node 3: telemetry_bind - telemetry_live
- t+35.035s node 3: complete - telemetry_period_locked
- t+61.448s node 2: quiet - join_request_received
- t+61.530s node 2: quiet - assign_created
- t+61.531s node 2: assign - silence_sent
- t+61.531s node 2: ack - assign_sent
- t+61.551s node 2: assign - silence_sent
- t+61.551s node 2: ack - assign_sent
- t+61.569s node 2: assign - silence_sent

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=12, timeouts=2
- node 2; timeouts=2
- node 3; ACK->telemetry -30.563s; acquire->telemetry -30.589s
- node 6; ACK->telemetry -16.489s; acquire->telemetry -16.489s
- node 7; ACK->telemetry -22.788s; acquire->telemetry -22.788s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 10
- Drone telemetry rows: 492
- t+0.131s node 2: drone_debug_status assigned_telemetry
- t+0.253s node 3: drone_debug_status assigned_telemetry
- t+0.291s node 6: drone_debug_status assigned_telemetry
- t+0.352s node 7: drone_debug_status assigned_telemetry
- t+12.127s node 3: drone_debug_event reboot_scheduled
- t+12.127s node 3: drone_debug_status assigned_telemetry
- t+12.164s node 6: drone_debug_event reboot_scheduled
- t+12.164s node 6: drone_debug_status assigned_telemetry
- t+12.196s node 7: drone_debug_event reboot_scheduled
- t+12.196s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 1668
- Short-loss event counts: short_loss_guard_active=398, short_loss_guard_started=374, short_loss_recovered=371, short_loss_guard_expired=1
- Short-loss recovered observed gaps: count=371, avg=3.3, max=11
- Recent short-loss events: t+191.538s node 6 short_loss_guard_active miss=2 gap=-; t+191.694s node 6 short_loss_recovered miss=2 gap=3; t+191.825s node 7 short_loss_guard_started miss=1 gap=-; t+191.934s node 7 short_loss_guard_active miss=2 gap=-; t+192.140s node 7 short_loss_recovered miss=2 gap=3; t+192.252s node 6 short_loss_guard_started miss=1 gap=-; t+192.327s node 6 short_loss_guard_active miss=2 gap=-; t+192.601s node 6 short_loss_recovered miss=2 gap=3

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=170, owed_rx_missed=115, rx_candidate_skipped=59, owed_rx_cleared=37
- Scheduler-caused skips by node: 3=17, 6=28, 7=14
- Owed selections by node: 3=60, 6=59, 7=51
- Owed listens that still missed by node: 3=82, 6=13, 7=20
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+66.786s node 6 owed_rx_selected selected=6 owed=2 skips=2; t+66.831s node 6 owed_rx_missed owed=2 skips=2; t+66.885s node 7 owed_rx_selected selected=7 owed=2 skips=2; t+67.004s node 6 owed_rx_missed owed=2 skips=2; t+67.031s node 7 owed_rx_selected selected=7 owed=2 skips=2; t+67.106s node 6 owed_rx_cleared owed=2 skips=2; t+67.270s node 7 owed_rx_selected selected=7 owed=2 skips=2; t+67.291s node 7 owed_rx_missed owed=2 skips=2; t+67.727s node 7 owed_rx_missed owed=2 skips=2; t+67.949s node 7 owed_rx_cleared owed=2 skips=2

## Telemetry Coverage
- Latest status at t+8.432s: mode `telemetry_first`
- Assigned packets received: 6
- Assigned RX coverage: 27%
- Sequence gap events: 3
- Missing sequence IDs: 45
- Max sequence gap: 16
- Assigned slot misses: 16
- Non-assigned preemptions: 0
- Owed RX active: True node=3 count=2
- Fairness skips: 4
- Owed selections: 3
- Owed misses: 0
- Max scheduler skips: 2
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 398
- node 7: t+3.769s seq 168 -> t+6.885s seq 183; missing [169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182]
- node 7: t+6.885s seq 183 -> t+26.782s seq 2; missing [184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, +17 more]
- node 7: t+26.782s seq 2 -> t+27.534s seq 5; missing [3, 4]
- node 7: t+27.694s seq 6 -> t+28.255s seq 9; missing [7, 8]
- node 7: t+28.255s seq 9 -> t+29.052s seq 13; missing [10, 11, 12]
- node 7: t+29.052s seq 13 -> t+29.877s seq 17; missing [14, 15, 16]
- node 7: t+30.092s seq 18 -> t+30.649s seq 21; missing [19, 20]
- node 7: t+30.649s seq 21 -> t+31.457s seq 25; missing [22, 23, 24]
- node 7: t+31.457s seq 25 -> t+32.254s seq 29; missing [26, 27, 28]
- node 7: t+32.254s seq 29 -> t+33.060s seq 33; missing [30, 31, 32]
- node 7: t+33.060s seq 33 -> t+33.855s seq 37; missing [34, 35, 36]
- node 7: t+33.855s seq 37 -> t+34.413s seq 40; missing [38, 39]

## Transport Findings
- Missing ACKs for 1 command(s).

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 2775
- telemetry_rebind_event: 1668
- drone_telemetry: 492
- search_event: 199
- inter_gc_status: 121
- assignment_event: 46
- bind_progress_event: 40
- assignments: 21
- command: 11
- command_ack: 10
- drone_link_status: 8
- bench_marker: 7
- drone_debug_status: 7
- assignment_timing_hint: 6
- drone_live_status: 4
- drone_debug_event: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
- http_error: 1
