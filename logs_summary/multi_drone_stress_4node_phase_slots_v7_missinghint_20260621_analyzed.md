# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_4node_phase_slots_v7_missinghint_20260621.jsonl`
- Parsed records: 2381
- Approx duration: 196.8s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 22 ms, max 218 ms, avg 107 ms
- Inter-GC queued command events: 2
- t+0.377s ACK drone/drone get_status accepted: -
- t+8.401s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.562s ACK magc/magic_ground_control get_status accepted: -
- t+8.817s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+16.042s ACK drone/drone debug_reboot accepted: -
- t+16.224s ACK drone/drone debug_reboot accepted: -
- t+16.286s ACK drone/drone debug_reboot accepted: -
- t+16.383s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 82
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
- Search events: 70
- Bind progress events: 34
- Assignment events: 41
- Assignment event counts: telemetry_period_observed=6, telemetry_period_locked=5, join_request_received=4, assign_created=4, silence_sent=4, assign_sent=4, join_ack_received=4, post_bind_acquire_started=4, post_bind_first_telemetry=3, post_bind_acquire_timeout=3
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=56
- Auto shared RX scanner events: 13
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=7, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+9.020s to t+58.020s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+36.093s node 2: quiet - assign_created
- t+36.093s node 2: assign - silence_sent
- t+36.094s node 2: ack - assign_sent
- t+36.297s node 2: telemetry_bind - assignment_completed
- t+43.943s node 6: quiet - join_request_received
- t+43.943s node 6: quiet - assign_created
- t+44.110s node 6: assign - silence_sent
- t+44.110s node 6: ack - assign_sent
- t+44.315s node 6: telemetry_bind - assignment_completed
- t+46.974s node 6: timing - telemetry_period_observed
- t+47.001s node 6: telemetry_bind - telemetry_live
- t+86.746s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 2
- OOCR event counts: confirmed_drone=2
- Reset/clear to confirmed orphan telemetry: 80.043s

## Post-Bind Telemetry
- Post-bind acquire events: starts=8, first_telemetry=6, timeouts=6
- node 2; timeouts=4
- node 3; ACK->telemetry -20.437s; acquire->telemetry -20.463s
- node 6; ACK->telemetry -39.578s; acquire->telemetry -39.783s; timeouts=2
- node 7; ACK->telemetry -26.752s; acquire->telemetry -26.752s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 12
- Drone telemetry rows: 712
- t+0.161s node 2: drone_debug_status backoff
- t+0.225s node 3: drone_debug_status assigned_telemetry
- t+0.300s node 6: drone_debug_status assigned_telemetry
- t+0.378s node 7: drone_debug_status assigned_telemetry
- t+16.042s node 2: drone_debug_event reboot_scheduled
- t+16.042s node 2: drone_debug_status wait_assignment
- t+16.224s node 3: drone_debug_event reboot_scheduled
- t+16.224s node 3: drone_debug_status assigned_telemetry
- t+16.286s node 6: drone_debug_event reboot_scheduled
- t+16.286s node 6: drone_debug_status assigned_telemetry
- t+16.382s node 7: drone_debug_event reboot_scheduled
- t+16.383s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 149
- Short-loss event counts: short_loss_guard_active=7, short_loss_guard_started=1, short_loss_guard_expired=1
- Recent short-loss events: t+84.780s node 2 short_loss_guard_active miss=2 gap=-; t+85.029s node 2 short_loss_guard_active miss=3 gap=-; t+85.280s node 2 short_loss_guard_active miss=4 gap=-; t+85.531s node 2 short_loss_guard_active miss=5 gap=-; t+85.780s node 2 short_loss_guard_active miss=6 gap=-; t+86.032s node 2 short_loss_guard_active miss=7 gap=-; t+86.272s node 2 short_loss_guard_active miss=8 gap=-; t+86.533s node 2 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=191, rx_candidate_skipped=15, owed_rx_cleared=11, owed_rx_missed=3
- Scheduler-caused skips by node: 2=1, 3=14
- Owed selections by node: 2=3, 3=188
- Owed listens that still missed by node: 2=3
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+87.384s node 2 owed_rx_selected selected=2 owed=1 skips=1; t+87.569s node 3 rx_candidate_skipped selected=2 owed=2 skips=2; t+87.569s node 2 owed_rx_missed owed=1 skips=1; t+87.816s node 3 owed_rx_selected selected=3 owed=2 skips=2; t+87.816s node 3 owed_rx_cleared owed=2 skips=2; t+88.040s node 2 owed_rx_selected selected=2 owed=1 skips=1; t+88.074s node 2 owed_rx_missed owed=1 skips=1; t+88.365s node 3 rx_candidate_skipped selected=7 owed=1 skips=1; t+88.557s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+88.571s node 3 owed_rx_cleared owed=1 skips=1

## Telemetry Coverage
- Latest status at t+8.440s: mode `telemetry_first`
- Assigned packets received: 5
- Assigned RX coverage: 13%
- Sequence gap events: 2
- Missing sequence IDs: 3
- Max sequence gap: 2
- Assigned slot misses: 32
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 685
- node 7: t+4.067s seq 65 -> t+4.580s seq 67; missing [66]
- node 7: t+4.580s seq 67 -> t+30.653s seq 3; missing [68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, +17 more]
- node 7: t+30.653s seq 3 -> t+31.317s seq 5; missing [4]
- node 7: t+31.317s seq 5 -> t+31.623s seq 7; missing [6]
- node 7: t+31.623s seq 7 -> t+32.123s seq 9; missing [8]
- node 7: t+32.123s seq 9 -> t+32.622s seq 11; missing [10]
- node 7: t+32.622s seq 11 -> t+33.122s seq 13; missing [12]
- node 7: t+33.122s seq 13 -> t+33.622s seq 15; missing [14]
- node 7: t+33.622s seq 15 -> t+34.121s seq 17; missing [16]
- node 7: t+34.121s seq 17 -> t+34.622s seq 19; missing [18]
- node 7: t+34.622s seq 19 -> t+35.122s seq 21; missing [20]
- node 7: t+35.122s seq 21 -> t+35.689s seq 23; missing [22]

## State Flicker
- Node 6: 1 rapid state transitions: t+4.532s offline->online
- Node 7: 1 rapid state transitions: t+4.068s offline->online

## Event Counts
- scanner_event: 1082
- drone_telemetry: 712
- telemetry_rebind_event: 149
- inter_gc_status: 82
- search_event: 70
- assignment_event: 41
- bind_progress_event: 34
- assignments: 18
- drone_link_status: 13
- command: 12
- command_ack: 11
- bench_marker: 8
- drone_debug_status: 8
- assignment_timing_hint: 5
- drone_live_status: 4
- drone_debug_event: 4
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
- orphan_recovery_event: 2
