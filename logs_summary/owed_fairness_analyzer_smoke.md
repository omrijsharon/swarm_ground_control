# Live Debug Log Summary

- Source: `logs_summary\intergc_s09_two_drone_wifi_clear_rejoin_uartbuf_20260621.jsonl`
- Parsed records: 974
- Approx duration: 149.9s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 159 ms, max 315 ms, avg 237 ms
- Inter-GC queued command events: 2
- t+8.161s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+8.368s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 56
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
- Search events: 9
- Bind progress events: 20
- Assignment events: 22
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=3, join_request_received=2, assign_created=2, silence_sent=2, assign_sent=2, join_ack_received=2, post_bind_acquire_started=2, post_bind_first_telemetry=2, telemetry_period_rejected=1
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=2
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=2, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+8.575s to t+23.119s
- t+22.899s node 6: telemetry_bind - assignment_completed
- t+22.899s node 6: timing - telemetry_period_observed
- t+22.926s node 6: telemetry_bind - telemetry_live
- t+23.119s node 6: complete - telemetry_period_locked
- t+29.190s node 3: quiet - join_request_received
- t+29.190s node 3: quiet - assign_created
- t+29.227s node 3: assign - silence_sent
- t+29.227s node 3: ack - assign_sent
- t+29.310s node 3: telemetry_bind - assignment_completed
- t+29.533s node 3: timing - telemetry_period_observed
- t+29.546s node 3: telemetry_bind - telemetry_live
- t+30.563s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=4, first_telemetry=4, timeouts=0
- node 3; ACK->telemetry -23.521s; acquire->telemetry -23.522s
- node 6; ACK->telemetry -17.646s; acquire->telemetry -17.646s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 628

## Short-Loss Guard
- Telemetry rebind events: 30
- Short-loss event counts: short_loss_guard_active=7, short_loss_guard_started=1, short_loss_guard_expired=1
- Recent short-loss events: t+30.883s node 6 short_loss_guard_active miss=2 gap=-; t+31.082s node 6 short_loss_guard_active miss=3 gap=-; t+31.281s node 6 short_loss_guard_active miss=4 gap=-; t+31.482s node 6 short_loss_guard_active miss=5 gap=-; t+31.680s node 6 short_loss_guard_active miss=6 gap=-; t+31.879s node 6 short_loss_guard_active miss=7 gap=-; t+32.079s node 6 short_loss_guard_active miss=8 gap=-; t+32.280s node 6 short_loss_guard_expired miss=9 gap=-

## Telemetry Sequence Gaps
- Observed sequence gaps: 593
- node 6: t+5.237s seq 22 -> t+5.693s seq 24; missing [23]
- node 6: t+5.693s seq 24 -> t+6.051s seq 26; missing [25]
- node 6: t+6.051s seq 26 -> t+22.926s seq 2; missing [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, +17 more]
- node 6: t+29.519s seq 34 -> t+29.720s seq 36; missing [35]
- node 6: t+29.720s seq 36 -> t+32.730s seq 50; missing [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
- node 6: t+32.730s seq 50 -> t+32.936s seq 52; missing [51]
- node 6: t+32.936s seq 52 -> t+33.344s seq 54; missing [53]
- node 6: t+33.344s seq 54 -> t+33.753s seq 56; missing [55]
- node 6: t+33.753s seq 56 -> t+34.163s seq 58; missing [57]
- node 6: t+34.163s seq 58 -> t+34.571s seq 60; missing [59]
- node 6: t+34.571s seq 60 -> t+34.977s seq 62; missing [61]
- node 6: t+34.977s seq 62 -> t+35.384s seq 64; missing [63]

## State Flicker
- Node 3: 1 rapid state transitions: t+5.899s offline->online

## Event Counts
- drone_telemetry: 628
- scanner_event: 65
- inter_gc_status: 56
- telemetry_rebind_event: 30
- assignment_event: 22
- bind_progress_event: 20
- search_event: 9
- assignments: 8
- drone_link_status: 5
- assignment_timing_hint: 3
- command: 2
- inter_gc_command_queued: 2
- command_ack: 2
- session_event: 2
- gc_status: 1
