# Live Debug Log Summary

- Source: `logs_summary\non_disruptive_bind_3node_full_stress_after_postbind_fix_20260622.jsonl`
- Parsed records: 2003
- Approx duration: 193.4s

## Commands
- Sent commands: 9
- ACKs: 9 (0 rejected)
- Derived ACK latency: min 10 ms, max 196 ms, avg 81 ms
- Inter-GC queued command events: 2
- t+0.140s ACK drone/drone get_status accepted: -
- t+0.215s ACK drone/drone get_status accepted: -
- t+12.241s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.409s ACK magc/magic_ground_control get_status accepted: -
- t+12.648s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+12.702s ACK drone/drone debug_reboot accepted: -
- t+12.748s ACK drone/drone debug_reboot accepted: -
- t+12.801s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 77
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 2
- Fragment samples: t+33.063s telegc: cttype":"bind_progress_event","event":"silence_sent","sourceRole":"magic_ground_control","nodeId":3,"phase":"assign","st; t+33.063s telegc: ":19,"radioPronment_event","event":"assign_sent","sourceRole":"magic_ground_control","nodeId":3,"frequencyMhz":912,"chan

## Bind And Search
- Search events: 6
- Bind progress events: 23
- Assignment events: 26
- Assignment event counts: telemetry_period_observed=5, telemetry_period_locked=5, silence_sent=4, join_request_received=2, assign_created=2, post_bind_first_telemetry=2, assign_sent=2, join_ack_timeout=2, join_ack_received=1, post_bind_acquire_started=1
- Empty-assignment shared RX: starts=4, active_ticks=0, joins=2, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+12.855s to t+145.882s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+32.861s node 3: ack - assign_sent
- t+32.951s node 7: complete - telemetry_period_locked
- t+33.166s node 3: ack - assign_sent
- t+33.166s node 3: assign - silence_sent
- t+41.413s node 6: quiet - join_request_received
- t+41.664s node 6: quiet - assign_created
- t+41.664s node 6: assign - silence_sent
- t+41.722s node 6: ack - assign_sent
- t+41.732s node 6: timing - telemetry_period_observed
- t+41.742s node 6: telemetry_bind - telemetry_live
- t+41.963s node 6: telemetry_bind - assignment_completed
- t+41.981s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=2, first_telemetry=4, timeouts=0
- node 3
- node 6; ACK->telemetry -37.853s; acquire->telemetry -37.853s
- node 7

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 9
- Drone telemetry rows: 734
- t+0.092s node 3: drone_debug_status assigned_telemetry
- t+0.140s node 6: drone_debug_status assigned_telemetry
- t+0.215s node 7: drone_debug_status assigned_telemetry
- t+12.701s node 3: drone_debug_event reboot_scheduled
- t+12.702s node 3: drone_debug_status assigned_telemetry
- t+12.748s node 6: drone_debug_event reboot_scheduled
- t+12.748s node 6: drone_debug_status assigned_telemetry
- t+12.801s node 7: drone_debug_event reboot_scheduled
- t+12.801s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 3
- Short-loss event counts: short_loss_guard_started=1, short_loss_guard_active=1, short_loss_recovered=1
- Short-loss recovered observed gaps: count=1, avg=2.0, max=2
- Recent short-loss events: t+119.240s node 6 short_loss_guard_started miss=1 gap=-; t+119.376s node 6 short_loss_guard_active miss=2 gap=-; t+119.479s node 6 short_loss_recovered miss=2 gap=2

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=303, owed_rx_selected=303, owed_rx_cleared=301
- Scheduler-caused skips by node: 3=14, 7=289
- Owed selections by node: 3=13, 7=290
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+191.882s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+192.168s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+192.168s node 7 owed_rx_cleared owed=1 skips=1; t+192.380s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+192.665s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+192.665s node 7 owed_rx_cleared owed=1 skips=1; t+192.881s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+193.159s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+193.169s node 7 owed_rx_cleared owed=1 skips=1; t+193.382s node 7 rx_candidate_skipped selected=6 owed=1 skips=1

## Telemetry Coverage
- Latest status at t+12.298s: mode `telemetry_first`
- Assigned packets received: 48
- Assigned RX coverage: 90%
- Sequence gap events: 45
- Missing sequence IDs: 48
- Max sequence gap: 3
- Assigned slot misses: 5
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 20
- Owed selections: 20
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 609
- node 3: t+3.662s seq 120 -> t+4.190s seq 122; missing [121]
- node 3: t+4.190s seq 122 -> t+5.238s seq 126; missing [123, 124, 125]
- node 3: t+5.238s seq 126 -> t+5.692s seq 128; missing [127]
- node 3: t+5.692s seq 128 -> t+6.233s seq 130; missing [129]
- node 3: t+6.233s seq 130 -> t+6.746s seq 132; missing [131]
- node 3: t+6.746s seq 132 -> t+7.233s seq 134; missing [133]
- node 3: t+7.233s seq 134 -> t+7.736s seq 136; missing [135]
- node 3: t+7.736s seq 136 -> t+8.233s seq 138; missing [137]
- node 3: t+8.233s seq 138 -> t+8.735s seq 140; missing [139]
- node 3: t+8.735s seq 140 -> t+9.233s seq 142; missing [141]
- node 3: t+9.233s seq 142 -> t+9.732s seq 144; missing [143]
- node 3: t+9.732s seq 144 -> t+10.233s seq 146; missing [145]

## Transport Findings
- Suspicious JSON fragments: 2.

## State Flicker
- Node 6: 1 rapid state transitions: t+42.164s locking->online
- Node 7: 2 rapid state transitions: t+5.149s offline->online, t+33.063s locking->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 941
- drone_telemetry: 734
- inter_gc_status: 77
- assignment_event: 26
- bind_progress_event: 23
- assignments: 14
- drone_link_status: 10
- command: 9
- command_ack: 9
- bench_marker: 7
- drone_debug_status: 6
- search_event: 6
- assignment_timing_hint: 5
- drone_live_status: 3
- drone_debug_event: 3
- telemetry_rebind_event: 3
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
