# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_reset_rejoin_guardfix_20260620.jsonl`
- Parsed records: 1663
- Approx duration: 135.1s

## Commands
- Sent commands: 1
- ACKs: 1 (0 rejected)
- t+25.597s ACK magc/magic_ground_control clear_all_assignments accepted: -

## Bind And Search
- Search events: 48
- Bind progress events: 18
- Assignment events: 23
- Assignment event counts: telemetry_period_observed=5, telemetry_period_locked=5, join_request_received=2, silence_sent=2, assign_sent=2, join_ack_received=2, post_bind_first_telemetry=2, assign_created=1, orphan_assignment_recovered=1, telemetry_period_rejected=1
- Auto shared RX: starts=0, active_ticks=17, joins=0, completes=3
- Auto shared RX scanner events: 6
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout, auto_shared_rx_timeout
- Empty-assignment shared RX: starts=0, active_ticks=8, joins=0, completes=0, oocr_deferred=45
- t+38.897s node 3: ack - assign_sent
- t+40.804s node 3: timing - telemetry_period_observed
- t+40.816s node 3: telemetry_bind - telemetry_live
- t+41.005s node 3: complete - telemetry_period_locked
- t+60.386s node 6: timing - telemetry_period_observed
- t+60.779s node 6: timing - telemetry_period_rejected
- t+63.430s node 6: complete - telemetry_period_locked
- t+92.000s node 6: assign - silence_sent
- t+93.239s node 6: ack - assign_sent
- t+98.393s node 6: timing - telemetry_period_observed
- t+98.400s node 6: telemetry_bind - telemetry_live
- t+101.771s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=0
- node 3; ACK->telemetry -36.169s
- node 6; ACK->telemetry -90.329s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 481

## Short-Loss Guard
- Telemetry rebind events: 242
- Short-loss event counts: short_loss_guard_active=120, short_loss_guard_started=44, short_loss_recovered=32, short_loss_guard_expired=9
- Short-loss recovered observed gaps: count=32, avg=4.5, max=13
- Recent short-loss events: t+133.794s node 3 short_loss_guard_active miss=5 gap=-; t+133.998s node 3 short_loss_recovered miss=5 gap=6; t+134.208s node 3 short_loss_guard_started miss=1 gap=-; t+134.482s node 3 short_loss_recovered miss=1 gap=1; t+134.499s node 6 short_loss_guard_started miss=1 gap=-; t+134.791s node 6 short_loss_recovered miss=1 gap=8; t+134.891s node 6 short_loss_guard_started miss=1 gap=-; t+134.943s node 6 short_loss_guard_active miss=2 gap=-

## Telemetry Sequence Gaps
- Observed sequence gaps: 187
- node 3: t+4.043s seq 31 -> t+4.373s seq 33; missing [32]
- node 3: t+13.565s seq 78 -> t+13.888s seq 80; missing [79]
- node 3: t+14.771s seq 85 -> t+15.288s seq 87; missing [86]
- node 3: t+17.373s seq 97 -> t+17.581s seq 99; missing [98]
- node 3: t+18.200s seq 101 -> t+18.496s seq 103; missing [102]
- node 3: t+18.634s seq 104 -> t+18.965s seq 106; missing [105]
- node 3: t+19.569s seq 108 -> t+20.499s seq 113; missing [109, 110, 111, 112]
- node 3: t+21.129s seq 116 -> t+21.497s seq 118; missing [117]
- node 3: t+25.179s seq 137 -> t+40.992s seq 5; missing [138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, +17 more]
- node 3: t+60.285s seq 101 -> t+61.008s seq 106; missing [102, 103, 104, 105]
- node 3: t+61.008s seq 106 -> t+63.803s seq 119; missing [107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118]
- node 3: t+63.803s seq 119 -> t+64.011s seq 121; missing [120]

## State Flicker
- Node 6: 1 rapid state transitions: t+60.537s offline->online

## Event Counts
- scanner_event: 604
- drone_telemetry: 481
- telemetry_rebind_event: 242
- search_event: 48
- assignment_event: 23
- inter_gc_status: 21
- bind_progress_event: 18
- assignments: 11
- drone_link_status: 7
- assignment_timing_hint: 5
- session_event: 2
- command: 1
- command_ack: 1
