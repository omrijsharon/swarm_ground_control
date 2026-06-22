# Live Debug Log Summary

- Source: `logs_summary\forced_overlap_bench_v2_20260621.jsonl`
- Parsed records: 1822
- Approx duration: 71.5s

## Commands
- Sent commands: 81
- ACKs: 81 (0 rejected)
- Derived ACK latency: min 11 ms, max 140 ms, avg 45 ms
- t+60.836s ACK drone/drone get_status accepted: -
- t+60.923s ACK drone/drone get_status accepted: -
- t+61.017s ACK drone/drone get_status accepted: -
- t+61.107s ACK drone/drone get_status accepted: -
- t+61.201s ACK drone/drone get_status accepted: -
- t+61.323s ACK drone/drone debug_schedule_next_telemetry accepted: -
- t+61.357s ACK drone/drone debug_schedule_next_telemetry accepted: -
- t+65.617s ACK telegc/telemetry_ground_control debug_schedule_assignment_overlap accepted: -

## Inter-GC Transport
- Inter-GC status rows: 42
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
- t+3.790s node 3: timing - telemetry_period_observed
- t+3.803s node 3: telemetry_bind - telemetry_live
- t+4.006s node 6: timing - telemetry_period_observed
- t+4.019s node 6: telemetry_bind - telemetry_live
- t+4.216s node 3: complete - telemetry_period_locked
- t+4.402s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 299
- t+60.522s node 3: drone_debug_status assigned_telemetry
- t+60.630s node 3: drone_debug_status assigned_telemetry
- t+60.735s node 3: drone_debug_status assigned_telemetry
- t+60.836s node 3: drone_debug_status assigned_telemetry
- t+60.923s node 6: drone_debug_status assigned_telemetry
- t+61.018s node 6: drone_debug_status assigned_telemetry
- t+61.107s node 6: drone_debug_status assigned_telemetry
- t+61.202s node 6: drone_debug_status assigned_telemetry
- t+61.323s node 3: drone_debug_event telemetry_phase_scheduled
- t+61.323s node 3: drone_debug_status assigned_telemetry
- t+61.357s node 6: drone_debug_event telemetry_phase_scheduled
- t+61.357s node 6: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 67
- Short-loss event counts: short_loss_guard_active=31, short_loss_guard_started=10, short_loss_recovered=6, short_loss_guard_expired=4
- Short-loss recovered observed gaps: count=4, avg=2.8, max=4
- Recent short-loss events: t+54.865s node 6 short_loss_guard_active miss=5 gap=-; t+55.064s node 6 short_loss_guard_active miss=6 gap=-; t+55.265s node 6 short_loss_guard_active miss=7 gap=-; t+55.464s node 6 short_loss_guard_active miss=8 gap=-; t+55.664s node 6 short_loss_guard_expired miss=9 gap=-; t+66.299s node 6 short_loss_guard_started miss=1 gap=-; t+66.474s node 6 short_loss_guard_active miss=2 gap=-; t+66.549s node 6 short_loss_recovered miss=2 gap=4

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=285, rx_candidate_skipped=279, owed_rx_cleared=267, owed_rx_missed=9
- Scheduler-caused skips by node: 3=136, 6=143
- Owed selections by node: 3=139, 6=146
- Owed listens that still missed by node: 3=9
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+70.954s node 6 owed_rx_cleared owed=1 skips=1; t+71.121s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+71.121s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+71.133s node 3 owed_rx_cleared owed=1 skips=1; t+71.148s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+71.342s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+71.356s node 6 owed_rx_cleared owed=1 skips=1; t+71.369s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+71.530s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+71.530s node 3 owed_rx_cleared owed=1 skips=1

## Forced Overlap Bench Trials
- Pass: 4/5
| Trial | Offsets ms | Pass | Skipped | Owed selected | Owed cleared | Max skips | Score fields | Failures |
|---:|---|---|---|---|---|---:|---|---|
| 1 | 0,20 | yes | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 1 | yes | - |
| 2 | 20,0 | yes | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 1 | yes | - |
| 3 | 0,20 | no | 6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,6,3,6,3,6,3,6,3,6 | 3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,3,3,3,6,6,6,6,6,6,6,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3 | 2 | yes | owed_rx_missed |
| 4 | 20,0 | yes | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6 | 2 | yes | - |
| 5 | 0,20 | yes | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,3,3,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 2 | yes | - |

## Telemetry Coverage
- Latest status at t+65.889s: mode `telemetry_first`
- Assigned packets received: 271
- Assigned RX coverage: 86%
- Sequence gap events: 262
- Missing sequence IDs: 341
- Max sequence gap: 12
- Assigned slot misses: 44
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 253
- Owed selections: 258
- Owed misses: 9
- Max scheduler skips: 2
- Coverage modes seen: telemetry_first=31

## Telemetry Sequence Gaps
- Observed sequence gaps: 288
- node 3: t+3.804s seq 174 -> t+4.228s seq 176; missing [175]
- node 3: t+4.228s seq 176 -> t+4.783s seq 179; missing [177, 178]
- node 3: t+4.783s seq 179 -> t+5.185s seq 181; missing [180]
- node 3: t+5.185s seq 181 -> t+5.595s seq 183; missing [182]
- node 3: t+5.595s seq 183 -> t+5.991s seq 185; missing [184]
- node 3: t+5.991s seq 185 -> t+6.398s seq 187; missing [186]
- node 3: t+6.398s seq 187 -> t+6.785s seq 189; missing [188]
- node 3: t+6.785s seq 189 -> t+7.196s seq 191; missing [190]
- node 3: t+7.196s seq 191 -> t+7.591s seq 193; missing [192]
- node 3: t+7.591s seq 193 -> t+7.988s seq 195; missing [194]
- node 3: t+7.988s seq 195 -> t+8.386s seq 197; missing [196]
- node 3: t+8.386s seq 197 -> t+8.793s seq 199; missing [198]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 987
- drone_telemetry: 299
- command: 81
- command_ack: 81
- telemetry_rebind_event: 67
- drone_debug_status: 50
- inter_gc_status: 42
- drone_live_status: 40
- gc_status: 31
- bench_marker: 12
- drone_debug_event: 10
- assignment_event: 6
- bind_progress_event: 6
- assignments: 3
- drone_link_status: 2
- assignment_timing_hint: 2
