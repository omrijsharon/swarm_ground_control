# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_4node_phase_slots_v6_periodfloor_20260621.jsonl`
- Parsed records: 2370
- Approx duration: 189.5s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 32 ms, max 208 ms, avg 82 ms
- Inter-GC queued command events: 2
- t+0.300s ACK drone/drone get_status accepted: -
- t+8.339s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.437s ACK magc/magic_ground_control get_status accepted: -
- t+8.743s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.815s ACK drone/drone debug_reboot accepted: -
- t+8.870s ACK drone/drone debug_reboot accepted: -
- t+8.929s ACK drone/drone debug_reboot accepted: -
- t+8.996s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 96
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
- Search events: 11
- Bind progress events: 39
- Assignment events: 44
- Assignment event counts: telemetry_period_observed=6, post_bind_first_telemetry=6, silence_sent=5, assign_sent=5, telemetry_period_locked=5, join_request_received=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, assign_reused=1, join_ack_timeout=1
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=4, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+8.946s to t+64.546s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+42.483s node 6: assign - silence_sent
- t+42.483s node 6: ack - assign_sent
- t+42.545s node 6: complete - telemetry_period_locked
- t+42.728s node 6: telemetry_bind - assignment_completed
- t+50.169s node 3: quiet - join_request_received
- t+50.331s node 3: quiet - assign_created
- t+50.332s node 3: assign - silence_sent
- t+50.344s node 3: timing - telemetry_period_observed
- t+50.358s node 3: telemetry_bind - telemetry_live
- t+50.429s node 3: ack - assign_sent
- t+50.679s node 3: telemetry_bind - assignment_completed
- t+50.869s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=7, first_telemetry=12, timeouts=0
- node 3; ACK->telemetry 0.388s; acquire->telemetry 0.388s
- node 6; ACK->telemetry -36.038s; acquire->telemetry -36.065s
- node 7; ACK->telemetry -30.936s; acquire->telemetry -30.936s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 12
- Drone telemetry rows: 1030
- t+0.105s node 2: drone_debug_status backoff
- t+0.145s node 3: drone_debug_status assigned_telemetry
- t+0.223s node 6: drone_debug_status assigned_telemetry
- t+0.301s node 7: drone_debug_status assigned_telemetry
- t+8.814s node 2: drone_debug_event reboot_scheduled
- t+8.815s node 2: drone_debug_status wait_assignment
- t+8.870s node 3: drone_debug_event reboot_scheduled
- t+8.870s node 3: drone_debug_status assigned_telemetry
- t+8.929s node 6: drone_debug_event reboot_scheduled
- t+8.929s node 6: drone_debug_status assigned_telemetry
- t+8.995s node 7: drone_debug_event reboot_scheduled
- t+8.996s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 7
- Short-loss event counts: short_loss_guard_started=2, short_loss_guard_active=2, short_loss_recovered=2
- Short-loss recovered observed gaps: count=2, avg=2.5, max=3
- Recent short-loss events: t+50.049s node 6 short_loss_guard_started miss=1 gap=-; t+50.441s node 6 short_loss_guard_active miss=2 gap=-; t+50.542s node 6 short_loss_recovered miss=2 gap=3; t+105.080s node 6 short_loss_guard_started miss=1 gap=-; t+105.194s node 6 short_loss_guard_active miss=2 gap=-; t+105.293s node 6 short_loss_recovered miss=2 gap=2

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=292, owed_rx_selected=292, owed_rx_cleared=291, owed_rx_missed=2
- Scheduler-caused skips by node: 3=1, 6=134, 7=157
- Owed selections by node: 3=2, 6=134, 7=156
- Owed listens that still missed by node: 6=2
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+187.980s node 6 owed_rx_cleared owed=1 skips=1; t+188.195s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+188.296s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+188.296s node 6 owed_rx_cleared owed=1 skips=1; t+188.579s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+188.801s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+188.801s node 6 owed_rx_cleared owed=1 skips=1; t+189.083s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+189.292s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+189.479s node 6 owed_rx_cleared owed=1 skips=1

## Telemetry Coverage
- Latest status at t+8.390s: mode `telemetry_first`
- Assigned packets received: 5
- Assigned RX coverage: 26%
- Sequence gap events: 2
- Missing sequence IDs: 2
- Max sequence gap: 1
- Assigned slot misses: 14
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 731
- node 7: t+6.013s seq 80 -> t+6.533s seq 82; missing [81]
- node 7: t+6.533s seq 82 -> t+36.417s seq 3; missing [83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, +17 more]
- node 7: t+42.740s seq 29 -> t+43.246s seq 31; missing [30]
- node 7: t+43.246s seq 31 -> t+43.950s seq 33; missing [32]
- node 7: t+43.950s seq 33 -> t+44.246s seq 35; missing [34]
- node 7: t+44.246s seq 35 -> t+44.746s seq 37; missing [36]
- node 7: t+44.746s seq 37 -> t+45.246s seq 39; missing [38]
- node 7: t+45.246s seq 39 -> t+45.747s seq 41; missing [40]
- node 7: t+45.747s seq 41 -> t+46.246s seq 43; missing [42]
- node 7: t+46.246s seq 43 -> t+46.745s seq 45; missing [44]
- node 7: t+46.745s seq 45 -> t+47.246s seq 47; missing [46]
- node 7: t+47.246s seq 47 -> t+47.747s seq 49; missing [48]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 1030
- scanner_event: 947
- inter_gc_status: 96
- assignment_event: 44
- bind_progress_event: 39
- assignments: 15
- command: 11
- command_ack: 11
- search_event: 11
- drone_debug_status: 8
- bench_marker: 7
- telemetry_rebind_event: 7
- drone_link_status: 7
- assignment_timing_hint: 5
- drone_live_status: 4
- drone_debug_event: 4
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
