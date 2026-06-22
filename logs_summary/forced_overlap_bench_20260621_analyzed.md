# Live Debug Log Summary

- Source: `logs_summary\forced_overlap_bench_20260621.jsonl`
- Parsed records: 1699
- Approx duration: 67.9s

## Commands
- Sent commands: 76
- ACKs: 76 (0 rejected)
- Derived ACK latency: min 6 ms, max 161 ms, avg 49 ms
- t+56.976s ACK drone/drone get_status accepted: -
- t+57.062s ACK drone/drone get_status accepted: -
- t+57.149s ACK drone/drone get_status accepted: -
- t+57.239s ACK drone/drone get_status accepted: -
- t+57.341s ACK drone/drone get_status accepted: -
- t+57.435s ACK drone/drone debug_schedule_next_telemetry accepted: -
- t+57.459s ACK drone/drone debug_schedule_next_telemetry accepted: -
- t+61.506s ACK telegc/telemetry_ground_control debug_schedule_assignment_overlap accepted: -

## Inter-GC Transport
- Inter-GC status rows: 31
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
- Search events: 1
- Bind progress events: 8
- Assignment events: 8
- Assignment event counts: telemetry_period_locked=3, telemetry_period_observed=2, post_bind_first_telemetry=2, telemetry_period_rejected=1
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=1
- Auto shared RX scanner events: 1
- Auto shared RX complete reasons: post_bind_acquire_pending
- t+3.876s node 3: timing - telemetry_period_observed
- t+3.887s node 3: telemetry_bind - telemetry_live
- t+4.123s node 6: timing - telemetry_period_observed
- t+4.133s node 6: telemetry_bind - telemetry_live
- t+4.303s node 3: complete - telemetry_period_locked
- t+4.503s node 6: timing - telemetry_period_rejected
- t+4.932s node 6: complete - telemetry_period_locked
- t+36.850s node 3: complete - telemetry_period_locked

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
- Drone telemetry rows: 245
- t+56.398s node 3: drone_debug_status assigned_telemetry
- t+56.599s node 3: drone_debug_status assigned_telemetry
- t+56.812s node 3: drone_debug_status assigned_telemetry
- t+56.976s node 3: drone_debug_status assigned_telemetry
- t+57.062s node 6: drone_debug_status assigned_telemetry
- t+57.149s node 6: drone_debug_status assigned_telemetry
- t+57.239s node 6: drone_debug_status assigned_telemetry
- t+57.341s node 6: drone_debug_status assigned_telemetry
- t+57.435s node 3: drone_debug_event telemetry_phase_scheduled
- t+57.435s node 3: drone_debug_status assigned_telemetry
- t+57.459s node 6: drone_debug_event telemetry_phase_scheduled
- t+57.459s node 6: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 123
- Short-loss event counts: short_loss_guard_active=56, short_loss_guard_started=14, short_loss_recovered=7, short_loss_guard_expired=7
- Short-loss recovered observed gaps: count=4, avg=5.0, max=10
- Recent short-loss events: t+62.836s node 3 short_loss_guard_active miss=2 gap=-; t+63.035s node 3 short_loss_guard_active miss=3 gap=-; t+63.234s node 3 short_loss_guard_active miss=4 gap=-; t+63.432s node 3 short_loss_guard_active miss=5 gap=-; t+63.632s node 3 short_loss_guard_active miss=6 gap=-; t+63.846s node 3 short_loss_guard_active miss=7 gap=-; t+64.041s node 3 short_loss_guard_active miss=8 gap=-; t+64.241s node 3 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=213, owed_rx_selected=207, owed_rx_cleared=200
- Scheduler-caused skips by node: 3=104, 6=109
- Owed selections by node: 3=100, 6=107
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+67.264s node 3 owed_rx_cleared owed=1 skips=1; t+67.485s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+67.485s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+67.498s node 6 owed_rx_cleared owed=1 skips=1; t+67.511s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+67.660s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+67.661s node 3 owed_rx_cleared owed=1 skips=1; t+67.686s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+67.885s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+67.885s node 6 owed_rx_cleared owed=1 skips=1

## Forced Overlap Bench Trials
- Pass: 4/5
| Trial | Offsets ms | Pass | Skipped | Owed selected | Owed cleared | Max skips | Score fields | Failures |
|---:|---|---|---|---|---|---:|---|---|
| 1 | 0,20 | yes | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 1 | yes | - |
| 2 | 20,0 | yes | 3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,3 | 6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 1 | yes | - |
| 3 | 0,20 | no | 3,6,6,6,6,3,6,3,6,3,6,3,6,3,6,6,3,6 | 3,6,6,6,6,3,6,3,6,3,6,3,6,3,6,3,6 | 6,3,6,6,3,6,3,6,3,6,3,6,6,3 | 3 | yes | non_online_link_event |
| 4 | 20,0 | yes | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 3 | yes | - |
| 5 | 0,20 | yes | 3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3 | 6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 3 | yes | - |

## Telemetry Coverage
- Latest status at t+61.723s: mode `telemetry_first`
- Assigned packets received: 223
- Assigned RX coverage: 75%
- Sequence gap events: 205
- Missing sequence IDs: 330
- Max sequence gap: 15
- Assigned slot misses: 74
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 195
- Owed selections: 190
- Owed misses: 0
- Max scheduler skips: 3
- Coverage modes seen: telemetry_first=26

## Telemetry Sequence Gaps
- Observed sequence gaps: 223
- node 3: t+3.907s seq 175 -> t+4.423s seq 177; missing [176]
- node 3: t+4.423s seq 177 -> t+4.676s seq 179; missing [178]
- node 3: t+4.676s seq 179 -> t+5.076s seq 181; missing [180]
- node 3: t+5.076s seq 181 -> t+5.486s seq 183; missing [182]
- node 3: t+5.486s seq 183 -> t+5.887s seq 185; missing [184]
- node 3: t+5.887s seq 185 -> t+6.293s seq 187; missing [186]
- node 3: t+6.293s seq 187 -> t+6.675s seq 189; missing [188]
- node 3: t+6.675s seq 189 -> t+7.082s seq 191; missing [190]
- node 3: t+7.082s seq 191 -> t+7.482s seq 193; missing [192]
- node 3: t+7.482s seq 193 -> t+7.886s seq 195; missing [194]
- node 3: t+7.886s seq 195 -> t+8.285s seq 197; missing [196]
- node 3: t+8.285s seq 197 -> t+8.686s seq 199; missing [198]

## State Flicker
- Node 3: 2 rapid state transitions: t+35.964s locking->weak, t+36.858s weak->online

## Event Counts
- scanner_event: 878
- drone_telemetry: 245
- telemetry_rebind_event: 123
- command: 76
- command_ack: 76
- drone_debug_status: 50
- drone_live_status: 40
- inter_gc_status: 31
- gc_status: 26
- bench_marker: 12
- drone_debug_event: 10
- assignment_event: 8
- bind_progress_event: 8
- drone_link_status: 5
- assignments: 3
- assignment_timing_hint: 3
- search_event: 1
