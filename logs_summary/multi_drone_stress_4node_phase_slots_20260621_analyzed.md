# Live Debug Log Summary

- Source: `logs_summary\multi_drone_stress_4node_phase_slots_20260621.jsonl`
- Parsed records: 4002
- Approx duration: 194.6s

## Commands
- Sent commands: 11
- ACKs: 10 (0 rejected)
- Derived ACK latency: min 9 ms, max 1706 ms, avg 305 ms
- Inter-GC queued command events: 2
- Pending/no ACK command IDs: multi-stress-preflight-drone2-0001
- t+3.809s ACK drone/drone get_status accepted: -
- t+11.829s ACK telegc/telemetry_ground_control get_status accepted: -
- t+13.526s ACK magc/magic_ground_control get_status accepted: -
- t+13.884s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+14.020s ACK drone/drone debug_reboot accepted: -
- t+14.074s ACK drone/drone debug_reboot accepted: -
- t+14.119s ACK drone/drone debug_reboot accepted: -
- t+14.201s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 71
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Suspicious JSON fragment lines: 0
- Malformed samples: t+165.483s telegc: {"type":"drone_telemetry","sourceRole":":0,"heading":91,"headingSource":"yaw","courseOverGround":318.8,"yaw":91,"yawHead

## Bind And Search
- Search events: 11
- Bind progress events: 44
- Assignment events: 51
- Assignment event counts: silence_sent=9, assign_sent=7, join_request_received=6, telemetry_period_observed=5, join_ack_timeout=4, post_bind_first_telemetry=4, telemetry_period_locked=4, assign_created=4, join_ack_received=3, post_bind_acquire_started=3, assign_reused=2
- Auto shared RX: starts=1, active_ticks=0, joins=1, completes=3
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- t+40.089s node 3: telemetry_bind - assignment_completed
- t+40.274s node 3: timing - telemetry_period_observed
- t+40.298s node 3: telemetry_bind - telemetry_live
- t+40.585s node 3: complete - telemetry_period_locked
- t+52.306s node 6: timing - telemetry_period_observed
- t+52.319s node 6: telemetry_bind - telemetry_live
- t+53.084s node 6: quiet - join_request_received
- t+53.102s node 6: quiet - assign_created
- t+53.103s node 6: complete - telemetry_period_locked
- t+53.179s node 6: assign - silence_sent
- t+53.179s node 6: ack - assign_sent
- t+53.204s node 6: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 3
- OOCR event counts: confirmed_drone=3

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=8, timeouts=0
- node 3; ACK->telemetry -0.981s; acquire->telemetry -0.981s
- node 6; ACK->telemetry -49.338s; acquire->telemetry -49.363s
- node 7

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 11
- Drone telemetry rows: 1110
- t+3.141s node 3: drone_debug_status wait_assignment
- t+3.202s node 6: drone_debug_status assigned_telemetry
- t+3.809s node 7: drone_debug_status wait_assignment
- t+14.020s node 2: drone_debug_event reboot_scheduled
- t+14.020s node 2: drone_debug_status backoff
- t+14.074s node 3: drone_debug_event reboot_scheduled
- t+14.074s node 3: drone_debug_status assigned_telemetry
- t+14.119s node 6: drone_debug_event reboot_scheduled
- t+14.119s node 6: drone_debug_status assigned_telemetry
- t+14.201s node 7: drone_debug_event reboot_scheduled
- t+14.201s node 7: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 595
- Short-loss event counts: short_loss_guard_started=211, short_loss_recovered=203, short_loss_guard_active=122, short_loss_guard_expired=6
- Short-loss recovered observed gaps: count=203, avg=1.6, max=10
- Recent short-loss events: t+192.689s node 7 short_loss_recovered miss=1 gap=1; t+193.173s node 7 short_loss_guard_started miss=1 gap=-; t+193.344s node 7 short_loss_recovered miss=1 gap=1; t+193.774s node 7 short_loss_guard_started miss=1 gap=-; t+193.850s node 3 short_loss_guard_started miss=1 gap=-; t+194.064s node 7 short_loss_guard_active miss=2 gap=-; t+194.247s node 7 short_loss_guard_active miss=3 gap=-; t+194.450s node 7 short_loss_guard_active miss=4 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=296, rx_candidate_skipped=234, owed_rx_cleared=218, owed_rx_missed=40
- Scheduler-caused skips by node: 3=26, 6=202, 7=6
- Owed selections by node: 3=70, 6=216, 7=10
- Owed listens that still missed by node: 3=8, 7=32
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+191.893s node 6 owed_rx_cleared owed=1 skips=1; t+191.993s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+192.496s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+192.496s node 6 owed_rx_cleared owed=1 skips=1; t+192.595s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+193.100s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+193.100s node 6 owed_rx_cleared owed=1 skips=1; t+193.282s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+193.689s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+193.763s node 6 owed_rx_cleared owed=1 skips=1

## Telemetry Coverage
- Latest status at t+11.887s: mode `telemetry_first`
- Assigned packets received: 2
- Assigned RX coverage: 4%
- Sequence gap events: 1
- Missing sequence IDs: 1
- Max sequence gap: 1
- Assigned slot misses: 40
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 609
- node 6: t+3.841s seq 122 -> t+4.344s seq 124; missing [123]
- node 6: t+4.344s seq 124 -> t+52.520s seq 14; missing [125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, +17 more]
- node 6: t+52.520s seq 14 -> t+53.179s seq 18; missing [15, 16, 17]
- node 6: t+53.179s seq 18 -> t+53.544s seq 20; missing [19]
- node 6: t+53.544s seq 20 -> t+53.997s seq 22; missing [21]
- node 6: t+53.997s seq 22 -> t+54.544s seq 25; missing [23, 24]
- node 6: t+54.544s seq 25 -> t+54.966s seq 27; missing [26]
- node 6: t+54.966s seq 27 -> t+56.164s seq 33; missing [28, 29, 30, 31, 32]
- node 6: t+56.164s seq 33 -> t+56.768s seq 36; missing [34, 35]
- node 6: t+56.768s seq 36 -> t+57.385s seq 39; missing [37, 38]
- node 6: t+57.385s seq 39 -> t+57.964s seq 42; missing [40, 41]
- node 6: t+57.964s seq 42 -> t+58.568s seq 45; missing [43, 44]

## Transport Findings
- Missing ACKs for 1 command(s).
- Malformed serial JSON payloads: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 1923
- drone_telemetry: 1110
- telemetry_rebind_event: 595
- inter_gc_status: 71
- assignment_event: 51
- bind_progress_event: 44
- assignments: 16
- command: 11
- search_event: 11
- command_ack: 10
- drone_link_status: 8
- bench_marker: 7
- drone_debug_status: 7
- assignment_timing_hint: 4
- drone_debug_event: 4
- drone_live_status: 3
- orphan_recovery_event: 3
- gc_status: 2
- inter_gc_command_queued: 2
- http_error: 1
