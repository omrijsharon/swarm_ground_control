# Live Debug Log Summary

- Source: `logs_summary\forced_overlap_bench_v3_20260621.jsonl`
- Parsed records: 1741
- Approx duration: 74.5s

## Commands
- Sent commands: 82
- ACKs: 82 (0 rejected)
- Derived ACK latency: min 2 ms, max 207 ms, avg 55 ms
- t+63.673s ACK drone/drone get_status accepted: -
- t+63.829s ACK drone/drone get_status accepted: -
- t+63.929s ACK drone/drone get_status accepted: -
- t+64.039s ACK drone/drone get_status accepted: -
- t+64.146s ACK drone/drone get_status accepted: -
- t+64.289s ACK drone/drone debug_schedule_next_telemetry accepted: -
- t+64.329s ACK drone/drone debug_schedule_next_telemetry accepted: -
- t+68.571s ACK telegc/telemetry_ground_control debug_schedule_assignment_overlap accepted: -

## Inter-GC Transport
- Inter-GC status rows: 61
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
- t+4.704s node 3: timing - telemetry_period_observed
- t+4.725s node 3: telemetry_bind - telemetry_live
- t+4.787s node 6: timing - telemetry_period_observed
- t+4.808s node 6: telemetry_bind - telemetry_live
- t+4.927s node 3: complete - telemetry_period_locked
- t+5.183s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 342
- t+63.265s node 3: drone_debug_status assigned_telemetry
- t+63.396s node 3: drone_debug_status assigned_telemetry
- t+63.518s node 3: drone_debug_status assigned_telemetry
- t+63.673s node 3: drone_debug_status assigned_telemetry
- t+63.829s node 6: drone_debug_status assigned_telemetry
- t+63.929s node 6: drone_debug_status assigned_telemetry
- t+64.039s node 6: drone_debug_status assigned_telemetry
- t+64.146s node 6: drone_debug_status assigned_telemetry
- t+64.289s node 3: drone_debug_event telemetry_phase_scheduled
- t+64.289s node 3: drone_debug_status assigned_telemetry
- t+64.329s node 6: drone_debug_event telemetry_phase_scheduled
- t+64.340s node 6: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 75
- Short-loss event counts: short_loss_guard_active=35, short_loss_guard_started=11, short_loss_recovered=7, short_loss_guard_expired=4
- Short-loss recovered observed gaps: count=3, avg=2.0, max=3
- Recent short-loss events: t+69.655s node 3 short_loss_guard_active miss=2 gap=-; t+69.845s node 3 short_loss_guard_active miss=3 gap=-; t+70.044s node 3 short_loss_guard_active miss=4 gap=-; t+70.248s node 3 short_loss_guard_active miss=5 gap=-; t+70.446s node 3 short_loss_guard_active miss=6 gap=-; t+70.643s node 3 short_loss_guard_active miss=7 gap=-; t+70.846s node 3 short_loss_guard_active miss=8 gap=-; t+71.047s node 3 short_loss_guard_expired miss=9 gap=-

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=204, rx_candidate_skipped=201, owed_rx_cleared=189
- Scheduler-caused skips by node: 3=101, 6=100
- Owed selections by node: 3=97, 6=107
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+73.911s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+74.066s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+74.078s node 3 owed_rx_cleared owed=1 skips=1; t+74.089s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+74.287s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+74.287s node 6 owed_rx_cleared owed=1 skips=1; t+74.322s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+74.473s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+74.473s node 3 owed_rx_cleared owed=1 skips=1; t+74.489s node 6 owed_rx_selected selected=6 owed=1 skips=1

## Forced Overlap Bench Trials
- Pass: 4/5
| Trial | Offsets ms | Pass | Skipped | Owed selected | Owed cleared | Max skips | Score fields | Failures |
|---:|---|---|---|---|---|---:|---|---|
| 1 | 0,20 | yes | 6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6 | 6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6 | 3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3 | 1 | yes | - |
| 2 | 20,0 | no | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,6 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,6,6 | 3,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 3 | yes | non_online_link_event |
| 3 | 0,20 | yes | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 3 | yes | - |
| 4 | 20,0 | yes | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,6,6,6,6,6,6,6,6,6,3,6,3,6,3,6,3,6 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 3 | yes | - |
| 5 | 0,20 | yes | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3 | 3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,6,3,6,3,6,3,6,3,6,3 | 6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6,3,6 | 3 | yes | - |

## Telemetry Coverage
- Latest status at t+68.628s: mode `telemetry_first`
- Assigned packets received: 322
- Assigned RX coverage: 83%
- Sequence gap events: 190
- Missing sequence IDs: 300
- Max sequence gap: 40
- Assigned slot misses: 63
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 184
- Owed selections: 187
- Owed misses: 0
- Max scheduler skips: 3
- Coverage modes seen: telemetry_first=32

## Telemetry Sequence Gaps
- Observed sequence gaps: 208
- node 3: t+5.046s seq 236 -> t+5.382s seq 238; missing [237]
- node 3: t+11.133s seq 11 -> t+11.576s seq 13; missing [12]
- node 3: t+18.103s seq 43 -> t+18.526s seq 46; missing [44, 45]
- node 3: t+18.526s seq 46 -> t+18.942s seq 48; missing [47]
- node 3: t+18.942s seq 48 -> t+19.336s seq 50; missing [49]
- node 3: t+19.336s seq 50 -> t+19.733s seq 52; missing [51]
- node 3: t+19.733s seq 52 -> t+20.126s seq 54; missing [53]
- node 3: t+20.126s seq 54 -> t+20.533s seq 56; missing [55]
- node 3: t+20.533s seq 56 -> t+20.925s seq 58; missing [57]
- node 3: t+20.925s seq 58 -> t+21.343s seq 60; missing [59]
- node 3: t+21.343s seq 60 -> t+21.743s seq 62; missing [61]
- node 3: t+21.743s seq 62 -> t+22.126s seq 64; missing [63]

## State Flicker
- Node 3: 2 rapid state transitions: t+32.787s locking->weak, t+33.991s weak->offline

## Event Counts
- scanner_event: 828
- drone_telemetry: 342
- command: 82
- command_ack: 82
- telemetry_rebind_event: 75
- inter_gc_status: 61
- drone_debug_status: 50
- drone_live_status: 40
- gc_status: 32
- bench_marker: 12
- drone_debug_event: 10
- assignment_event: 6
- bind_progress_event: 6
- drone_link_status: 6
- assignments: 3
- assignment_timing_hint: 2
