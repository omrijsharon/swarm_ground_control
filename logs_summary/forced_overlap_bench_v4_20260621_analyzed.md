# Live Debug Log Summary

- Source: `logs_summary\forced_overlap_bench_v4_20260621.jsonl`
- Parsed records: 1789
- Approx duration: 72.2s

## Commands
- Sent commands: 81
- ACKs: 81 (0 rejected)
- Derived ACK latency: min 2 ms, max 199 ms, avg 50 ms
- t+61.148s ACK drone/drone get_status accepted: -
- t+61.297s ACK drone/drone get_status accepted: -
- t+61.401s ACK drone/drone get_status accepted: -
- t+61.510s ACK drone/drone get_status accepted: -
- t+61.660s ACK drone/drone get_status accepted: -
- t+61.758s ACK drone/drone debug_schedule_next_telemetry accepted: -
- t+61.812s ACK drone/drone debug_schedule_next_telemetry accepted: -
- t+66.085s ACK telegc/telemetry_ground_control debug_schedule_assignment_overlap accepted: -

## Inter-GC Transport
- Inter-GC status rows: 53
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
- Search events: 0
- Bind progress events: 6
- Assignment events: 6
- Assignment event counts: telemetry_period_observed=2, post_bind_first_telemetry=2, telemetry_period_locked=2
- t+3.854s node 3: timing - telemetry_period_observed
- t+3.875s node 3: telemetry_bind - telemetry_live
- t+4.080s node 6: timing - telemetry_period_observed
- t+4.090s node 6: telemetry_bind - telemetry_live
- t+4.282s node 3: complete - telemetry_period_locked
- t+4.473s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=0
- node 3
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 60
- Drone telemetry rows: 315
- t+60.717s node 3: drone_debug_status assigned_telemetry
- t+60.911s node 3: drone_debug_status assigned_telemetry
- t+61.041s node 3: drone_debug_status assigned_telemetry
- t+61.148s node 3: drone_debug_status assigned_telemetry
- t+61.297s node 6: drone_debug_status assigned_telemetry
- t+61.401s node 6: drone_debug_status assigned_telemetry
- t+61.510s node 6: drone_debug_status assigned_telemetry
- t+61.660s node 6: drone_debug_status assigned_telemetry
- t+61.758s node 3: drone_debug_event telemetry_phase_scheduled
- t+61.758s node 3: drone_debug_status assigned_telemetry
- t+61.812s node 6: drone_debug_event telemetry_phase_scheduled
- t+61.812s node 6: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 30
- Short-loss event counts: short_loss_guard_active=16, short_loss_guard_started=4, short_loss_guard_expired=2, short_loss_recovered=2
- Recent short-loss events: t+43.070s node 3 short_loss_guard_active miss=5 gap=-; t+43.277s node 3 short_loss_guard_active miss=6 gap=-; t+43.480s node 3 short_loss_guard_active miss=7 gap=-; t+43.688s node 3 short_loss_guard_active miss=8 gap=-; t+43.880s node 3 short_loss_guard_expired miss=9 gap=-; t+66.563s node 3 short_loss_guard_started miss=1 gap=-; t+66.625s node 3 short_loss_guard_active miss=2 gap=-; t+66.786s node 3 short_loss_recovered miss=2 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=300, owed_rx_selected=294, owed_rx_cleared=288
- Scheduler-caused skips by node: 3=152, 6=148
- Owed selections by node: 3=149, 6=145
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+71.576s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+71.584s node 3 owed_rx_cleared owed=1 skips=1; t+71.604s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+71.799s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+71.799s node 6 owed_rx_cleared owed=1 skips=1; t+71.818s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+71.986s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+71.986s node 3 owed_rx_cleared owed=1 skips=1; t+72.191s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+72.191s node 3 rx_candidate_skipped selected=6 owed=1 skips=1

## Forced Overlap Bench Trials
- Pass: 5/5
| Trial | Offsets ms | Pass | Skipped | Owed selected | Owed cleared | Max skips | Score fields | Failures |
|---:|---|---|---|---|---|---:|---|---|
| 1 | 0,20 | yes | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,6 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3 | 1 | yes | - |
| 2 | 20,0 | yes | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 1 | yes | - |
| 3 | 0,20 | yes | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,3,6 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3 | 3,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,3 | 1 | yes | - |
| 4 | 20,0 | yes | 3,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 3,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 3,3,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 1 | yes | - |
| 5 | 0,20 | yes | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 1 | yes | - |

## Telemetry Coverage
- Latest status at t+66.137s: mode `telemetry_first`
- Assigned packets received: 287
- Assigned RX coverage: 93%
- Sequence gap events: 284
- Missing sequence IDs: 317
- Max sequence gap: 9
- Assigned slot misses: 21
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 274
- Owed selections: 269
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=31

## Telemetry Sequence Gaps
- Observed sequence gaps: 311
- node 3: t+3.875s seq 77 -> t+4.292s seq 79; missing [78]
- node 3: t+4.292s seq 79 -> t+4.659s seq 81; missing [80]
- node 3: t+4.659s seq 81 -> t+5.055s seq 83; missing [82]
- node 3: t+5.055s seq 83 -> t+5.465s seq 85; missing [84]
- node 3: t+5.465s seq 85 -> t+5.859s seq 87; missing [86]
- node 3: t+5.859s seq 87 -> t+6.263s seq 89; missing [88]
- node 3: t+6.263s seq 89 -> t+6.661s seq 91; missing [90]
- node 3: t+6.661s seq 91 -> t+7.055s seq 93; missing [92]
- node 3: t+7.055s seq 93 -> t+7.460s seq 95; missing [94]
- node 3: t+7.460s seq 95 -> t+7.860s seq 97; missing [96]
- node 3: t+7.860s seq 97 -> t+8.271s seq 99; missing [98]
- node 3: t+8.271s seq 99 -> t+8.663s seq 101; missing [100]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 964
- drone_telemetry: 315
- command: 81
- command_ack: 81
- inter_gc_status: 53
- drone_debug_status: 50
- drone_live_status: 40
- gc_status: 31
- telemetry_rebind_event: 30
- bench_marker: 12
- drone_debug_event: 10
- assignment_event: 6
- bind_progress_event: 6
- assignments: 3
- drone_link_status: 2
- assignment_timing_hint: 2
