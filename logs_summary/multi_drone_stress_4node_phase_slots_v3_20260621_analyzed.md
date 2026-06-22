# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_4node_phase_slots_v3_20260621.jsonl`
- Parsed records: 3264
- Approx duration: 192.3s

## Commands
- Sent commands: 11
- ACKs: 11 (0 rejected)
- Derived ACK latency: min 17 ms, max 2817 ms, avg 342 ms
- Inter-GC queued command events: 2
- t+2.978s ACK drone/drone get_status accepted: -
- t+11.004s ACK telegc/telemetry_ground_control get_status accepted: -
- t+11.239s ACK magc/magic_ground_control get_status accepted: -
- t+11.518s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+11.695s ACK drone/drone debug_reboot accepted: -
- t+11.771s ACK drone/drone debug_reboot accepted: -
- t+11.812s ACK drone/drone debug_reboot accepted: -
- t+11.855s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 66
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Suspicious JSON fragment lines: 0
- Malformed samples: t+89.914s telegc: {"type":"scanner_event","event":"telemetry_period_acquire_missed","sourceRole":"telemetry_ground_control","nodeId":3,"fr

## Bind And Search
- Search events: 43
- Bind progress events: 40
- Assignment events: 45
- Assignment event counts: telemetry_period_observed=6, post_bind_first_telemetry=6, silence_sent=6, telemetry_period_locked=5, assign_sent=5, join_request_received=4, assign_created=4, join_ack_received=3, post_bind_acquire_started=3, join_ack_timeout=2, telemetry_period_rejected=1
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=35
- Auto shared RX scanner events: 18
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+11.720s to t+20.438s
- t+38.756s node 7: telemetry_bind - assignment_completed
- t+38.768s node 7: timing - telemetry_period_observed
- t+38.782s node 7: telemetry_bind - telemetry_live
- t+39.454s node 7: timing - telemetry_period_rejected
- t+40.155s node 7: complete - telemetry_period_locked
- t+46.962s node 3: quiet - join_request_received
- t+46.962s node 3: timing - telemetry_period_observed
- t+46.989s node 3: telemetry_bind - telemetry_live
- t+47.179s node 3: quiet - assign_created
- t+47.179s node 3: assign - silence_sent
- t+47.179s node 3: ack - assign_sent
- t+47.204s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=12, timeouts=0
- node 3; ACK->telemetry -43.010s; acquire->telemetry -43.010s
- node 6; ACK->telemetry -16.651s; acquire->telemetry -16.651s
- node 7; ACK->telemetry -34.619s; acquire->telemetry -34.620s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 12
- Drone telemetry rows: 126
- t+2.818s node 2: drone_debug_status backoff
- t+2.876s node 3: drone_debug_status assigned_telemetry
- t+2.925s node 6: drone_debug_status assigned_telemetry
- t+2.978s node 7: drone_debug_status assigned_telemetry
- t+11.695s node 2: drone_debug_event reboot_scheduled
- t+11.695s node 2: drone_debug_status backoff
- t+11.771s node 3: drone_debug_event reboot_scheduled
- t+11.771s node 3: drone_debug_status assigned_telemetry
- t+11.812s node 6: drone_debug_event reboot_scheduled
- t+11.812s node 6: drone_debug_status assigned_telemetry
- t+11.855s node 7: drone_debug_event reboot_scheduled
- t+11.855s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 189
- Short-loss event counts: short_loss_guard_active=16, short_loss_guard_started=8, short_loss_recovered=5, short_loss_guard_expired=2
- Short-loss recovered observed gaps: count=5, avg=3.6, max=4
- Recent short-loss events: t+48.512s node 6 short_loss_guard_active miss=2 gap=-; t+48.907s node 6 short_loss_guard_active miss=3 gap=-; t+49.304s node 6 short_loss_guard_active miss=4 gap=-; t+49.713s node 6 short_loss_guard_active miss=5 gap=-; t+50.114s node 6 short_loss_guard_active miss=6 gap=-; t+50.505s node 6 short_loss_guard_active miss=7 gap=-; t+50.913s node 6 short_loss_guard_active miss=8 gap=-; t+51.305s node 6 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=751, rx_candidate_skipped=25, owed_rx_missed=18, owed_rx_cleared=4
- Scheduler-caused skips by node: 6=23, 7=2
- Owed selections by node: 6=25, 7=726
- Owed listens that still missed by node: 6=18
- Max consecutive scheduler skips observed: 19
- Recent fairness events: t+190.310s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+190.511s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+190.713s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+190.917s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+191.295s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+191.496s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+191.699s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+191.712s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+191.950s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+192.137s node 7 owed_rx_selected selected=7 owed=1 skips=1

## Telemetry Coverage
- Latest status at t+11.054s: mode `telemetry_first`
- Assigned packets received: 5
- Assigned RX coverage: 7%
- Sequence gap events: 2
- Missing sequence IDs: 2
- Max sequence gap: 1
- Assigned slot misses: 63
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 22
- node 6: t+3.711s seq 84 -> t+11.114s seq 121; missing [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, +17 more]
- node 6: t+11.114s seq 121 -> t+20.679s seq 2; missing [122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, +17 more]
- node 6: t+38.528s seq 92 -> t+38.916s seq 94; missing [93]
- node 6: t+38.916s seq 94 -> t+39.929s seq 98; missing [95, 96, 97]
- node 6: t+39.929s seq 98 -> t+40.523s seq 102; missing [99, 100, 101]
- node 6: t+40.523s seq 102 -> t+41.726s seq 107; missing [103, 104, 105, 106]
- node 6: t+41.726s seq 107 -> t+42.737s seq 112; missing [108, 109, 110, 111]
- node 6: t+42.737s seq 112 -> t+43.734s seq 117; missing [113, 114, 115, 116]
- node 6: t+43.734s seq 117 -> t+46.336s seq 131; missing [118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130]
- node 6: t+46.336s seq 131 -> t+47.114s seq 135; missing [132, 133, 134]
- node 7: t+3.934s seq 55 -> t+4.453s seq 57; missing [56]
- node 7: t+4.453s seq 57 -> t+38.904s seq 3; missing [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, +17 more]

## Transport Findings
- Malformed serial JSON payloads: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 2538
- telemetry_rebind_event: 189
- drone_telemetry: 126
- inter_gc_status: 66
- assignment_event: 45
- search_event: 43
- bind_progress_event: 40
- drone_link_status: 25
- assignments: 17
- command: 11
- command_ack: 11
- drone_debug_status: 8
- bench_marker: 7
- assignment_timing_hint: 5
- drone_live_status: 4
- drone_debug_event: 4
- gc_status: 2
- inter_gc_command_queued: 2
- session_event: 2
