# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_2node_v2_20260621.jsonl`
- Parsed records: 1874
- Approx duration: 143.3s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 41 ms, max 259 ms, avg 110 ms
- Inter-GC queued command events: 2
- t+8.410s ACK magc/magic_ground_control get_status accepted: -
- t+8.684s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.828s ACK drone/drone debug_reboot accepted: -
- t+8.895s ACK drone/drone debug_reboot accepted: -
- t+24.820s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+30.986s ACK drone/drone debug_restart_join accepted: -
- t+41.709s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+47.776s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 83
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
- Search events: 81
- Bind progress events: 30
- Assignment events: 33
- Assignment event counts: telemetry_period_observed=5, post_bind_first_telemetry=5, telemetry_period_locked=5, join_request_received=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3, assign_created=2, assign_reused=1
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=73
- Auto shared RX scanner events: 3
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+8.889s to t+16.499s
- t+24.156s node 3: telemetry_bind - assignment_completed
- t+24.311s node 3: timing - telemetry_period_observed
- t+24.329s node 3: telemetry_bind - telemetry_live
- t+24.712s node 3: complete - telemetry_period_locked
- t+35.947s node 3: quiet - join_request_received
- t+35.965s node 3: quiet - assign_reused
- t+35.995s node 3: assign - silence_sent
- t+36.022s node 3: ack - assign_sent
- t+36.022s node 3: telemetry_bind - assignment_completed
- t+36.146s node 3: timing - telemetry_period_observed
- t+36.160s node 3: telemetry_bind - telemetry_live
- t+36.549s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=10, timeouts=0
- node 3; ACK->telemetry -20.100s; acquire->telemetry -20.123s
- node 6; ACK->telemetry -12.484s; acquire->telemetry -12.484s

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 14
- Drone telemetry rows: 622
- t+8.828s node 3: drone_debug_event reboot_scheduled
- t+8.828s node 3: drone_debug_status assigned_telemetry
- t+8.895s node 6: drone_debug_event reboot_scheduled
- t+8.895s node 6: drone_debug_status assigned_telemetry
- t+24.818s node 3: drone_debug_event telemetry_rf_loss_started
- t+24.820s node 3: drone_debug_status assigned_telemetry
- t+30.986s node 3: drone_debug_event join_runtime_reset
- t+30.988s node 3: drone_debug_status backoff
- t+41.709s node 6: drone_debug_event telemetry_rf_loss_started
- t+41.709s node 6: drone_debug_status assigned_telemetry
- t+47.776s node 6: drone_debug_event join_runtime_reset
- t+47.776s node 6: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 492
- Short-loss event counts: short_loss_guard_active=21, short_loss_guard_started=3, short_loss_guard_expired=3
- Recent short-loss events: t+48.104s node 6 short_loss_guard_active miss=2 gap=-; t+48.298s node 6 short_loss_guard_active miss=3 gap=-; t+48.498s node 6 short_loss_guard_active miss=4 gap=-; t+48.709s node 6 short_loss_guard_active miss=5 gap=-; t+48.904s node 6 short_loss_guard_active miss=6 gap=-; t+49.108s node 6 short_loss_guard_active miss=7 gap=-; t+49.306s node 6 short_loss_guard_active miss=8 gap=-; t+49.498s node 6 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=65, rx_candidate_skipped=54, owed_rx_cleared=45, owed_rx_missed=35
- Scheduler-caused skips by node: 3=17, 6=37
- Owed selections by node: 3=18, 6=47
- Owed listens that still missed by node: 3=14, 6=21
- Max consecutive scheduler skips observed: 4
- Recent fairness events: t+49.738s node 6 owed_rx_missed owed=1 skips=1; t+49.764s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+49.931s node 3 rx_candidate_skipped selected=6 owed=2 skips=2; t+49.931s node 6 owed_rx_missed owed=1 skips=1; t+49.957s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+50.094s node 3 rx_candidate_skipped selected=6 owed=3 skips=3; t+50.138s node 6 owed_rx_missed owed=1 skips=1; t+50.192s node 3 owed_rx_selected selected=3 owed=3 skips=3; t+50.337s node 3 owed_rx_selected selected=3 owed=3 skips=3; t+50.536s node 3 owed_rx_cleared owed=3 skips=3

## Telemetry Coverage
- Latest status at t+8.280s: mode `telemetry_first`
- Assigned packets received: 23
- Assigned RX coverage: 95%
- Sequence gap events: 21
- Missing sequence IDs: 21
- Max sequence gap: 1
- Assigned slot misses: 1
- Non-assigned preemptions: 0
- Owed RX active: True node=3 count=1
- Fairness skips: 19
- Owed selections: 18
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 79
- node 6: t+3.815s seq 175 -> t+4.330s seq 177; missing [176]
- node 6: t+4.330s seq 177 -> t+4.582s seq 179; missing [178]
- node 6: t+4.582s seq 179 -> t+5.003s seq 181; missing [180]
- node 6: t+5.003s seq 181 -> t+5.392s seq 183; missing [182]
- node 6: t+5.392s seq 183 -> t+5.785s seq 185; missing [184]
- node 6: t+5.785s seq 185 -> t+6.190s seq 187; missing [186]
- node 6: t+6.190s seq 187 -> t+6.594s seq 189; missing [188]
- node 6: t+6.594s seq 189 -> t+6.985s seq 191; missing [190]
- node 6: t+6.985s seq 191 -> t+7.388s seq 193; missing [192]
- node 6: t+7.388s seq 193 -> t+7.803s seq 195; missing [194]
- node 6: t+7.803s seq 195 -> t+8.190s seq 197; missing [196]
- node 6: t+8.190s seq 197 -> t+16.522s seq 3; missing [198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, +17 more]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 622
- telemetry_rebind_event: 492
- scanner_event: 334
- inter_gc_status: 83
- search_event: 81
- assignment_event: 33
- bind_progress_event: 30
- bench_marker: 14
- assignments: 12
- command: 11
- command_ack: 11
- drone_debug_status: 8
- drone_link_status: 7
- drone_debug_event: 6
- assignment_timing_hint: 5
- drone_join_event: 4
- drone_live_status: 2
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
