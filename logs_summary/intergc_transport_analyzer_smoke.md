# Live Debug Log Summary

- Source: `logs_summary\dual_gc_recover_after_forward_queue_20260620.jsonl`
- Parsed records: 452
- Approx duration: 109.7s

## Commands
- Sent commands: 2
- ACKs: 2 (1 rejected)
- Derived ACK latency: min 11 ms, max 856 ms, avg 433 ms
- t+15.013s ACK magc/telemetry_ground_control start_search rejected: inter_gc_forward_failed
- t+15.858s ACK magc/magic_ground_control clear_all_assignments accepted: -

## Inter-GC Transport
- Inter-GC status rows: 36
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Malformed RX JSON payload lines: 6
- Malformed samples: t+3.996s telegc: {"type":"scanner_event","event":"auto_shared_rx_active","sourceRole":"magic_ground_control","nodeId":3,"frequencyMhz":92; t+7.053s telegc: {"type":"assignment_event","event":"post_bind_acquire_started","nodeId":3,"sourceRole":"magic_ground_control","frequency; t+10.843s telegc: {"type":"scanner_event","event":"auto_shared_rx_complete","sourceRole":"magic_ground_control","nodeId":3,"frequencyMhz":

## Bind And Search
- Search events: 88
- Bind progress events: 9
- Assignment events: 10
- Assignment event counts: telemetry_period_observed=2, post_bind_first_telemetry=2, telemetry_period_locked=2, silence_sent=1, assign_sent=1, join_ack_received=1, telemetry_period_rejected=1
- Auto shared RX: starts=0, active_ticks=1, joins=0, completes=1
- Auto shared RX complete reasons: post_bind_acquire_pending
- Empty-assignment shared RX: starts=0, active_ticks=172, joins=0, completes=0, oocr_deferred=0
- t+4.815s node 3: assign - silence_sent
- t+6.036s node 3: ack - assign_sent
- t+7.848s node 3: timing - telemetry_period_observed
- t+7.863s node 3: telemetry_bind - telemetry_live
- t+8.060s node 6: timing - telemetry_period_observed
- t+8.072s node 6: telemetry_bind - telemetry_live
- t+8.415s node 3: timing - telemetry_period_rejected
- t+8.454s node 6: complete - telemetry_period_locked
- t+10.654s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=0
- node 3; ACK->telemetry 0.834s
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 27

## Short-Loss Guard
- Telemetry rebind events: 17
- Short-loss event counts: short_loss_guard_active=4, short_loss_guard_started=2, short_loss_recovered=2
- Short-loss recovered observed gaps: count=2, avg=2.5, max=3
- Recent short-loss events: t+11.497s node 6 short_loss_guard_started miss=1 gap=-; t+11.590s node 6 short_loss_guard_active miss=2 gap=-; t+11.790s node 6 short_loss_guard_active miss=3 gap=-; t+11.963s node 6 short_loss_guard_active miss=4 gap=-; t+12.047s node 6 short_loss_recovered miss=4 gap=3; t+15.266s node 6 short_loss_guard_started miss=1 gap=-; t+15.375s node 6 short_loss_guard_active miss=2 gap=-; t+15.452s node 6 short_loss_recovered miss=2 gap=2

## Telemetry Sequence Gaps
- Observed sequence gaps: 23
- node 3: t+7.887s seq 4 -> t+8.415s seq 6; missing [5]
- node 3: t+8.415s seq 6 -> t+10.843s seq 18; missing [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
- node 3: t+10.843s seq 18 -> t+11.213s seq 20; missing [19]
- node 3: t+11.213s seq 20 -> t+11.497s seq 22; missing [21]
- node 3: t+11.497s seq 22 -> t+12.424s seq 26; missing [23, 24, 25]
- node 3: t+12.424s seq 26 -> t+12.817s seq 28; missing [27]
- node 3: t+12.817s seq 28 -> t+13.221s seq 30; missing [29]
- node 3: t+13.221s seq 30 -> t+13.610s seq 32; missing [31]
- node 3: t+13.610s seq 32 -> t+14.016s seq 34; missing [33]
- node 3: t+14.016s seq 34 -> t+14.424s seq 36; missing [35]
- node 3: t+14.424s seq 36 -> t+14.816s seq 38; missing [37]
- node 3: t+14.816s seq 38 -> t+15.219s seq 40; missing [39]

## Transport Findings
- Rejected ACK reasons: inter_gc_forward_failed=1
- Malformed serial JSON payloads: 6.

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 131
- search_event: 88
- inter_gc_status: 36
- drone_telemetry: 27
- telemetry_rebind_event: 17
- assignment_event: 10
- bind_progress_event: 9
- assignments: 6
- drone_link_status: 2
- assignment_timing_hint: 2
- command: 2
- command_ack: 2
- session_event: 2
