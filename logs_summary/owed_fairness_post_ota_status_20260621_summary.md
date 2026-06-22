# Live Debug Log Summary

- Source: `logs_summary\owed_fairness_post_ota_status_20260621.jsonl`
- Parsed records: 358
- Approx duration: 20.0s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 15 ms, max 172 ms, avg 93 ms
- Inter-GC queued command events: 1
- t+8.016s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.225s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 2
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
- Bind progress events: 12
- Assignment events: 12
- Assignment event counts: telemetry_period_observed=4, post_bind_first_telemetry=4, telemetry_period_locked=4
- t+3.828s node 6: timing - telemetry_period_observed
- t+3.846s node 6: telemetry_bind - telemetry_live
- t+4.062s node 3: timing - telemetry_period_observed
- t+4.083s node 3: telemetry_bind - telemetry_live
- t+4.229s node 6: complete - telemetry_period_locked
- t+4.498s node 3: complete - telemetry_period_locked
- t+8.626s node 6: timing - telemetry_period_observed
- t+8.646s node 6: telemetry_bind - telemetry_live
- t+8.865s node 3: timing - telemetry_period_observed
- t+8.878s node 3: telemetry_bind - telemetry_live
- t+9.021s node 6: complete - telemetry_period_locked
- t+9.300s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=8, timeouts=0
- node 3
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 79

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=38, owed_rx_selected=38, owed_rx_cleared=37
- Scheduler-caused skips by node: 3=3, 6=35
- Owed selections by node: 3=3, 6=35
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+18.623s node 6 owed_rx_cleared owed=1 skips=1; t+18.831s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+19.021s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+19.021s node 6 owed_rx_cleared owed=1 skips=1; t+19.228s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+19.425s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+19.425s node 6 owed_rx_cleared owed=1 skips=1; t+19.639s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+19.826s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+19.826s node 6 owed_rx_cleared owed=1 skips=1

## Telemetry Coverage
- Latest status at t+8.061s: mode `telemetry_first`
- Assigned packets received: 21
- Assigned RX coverage: 95%
- Sequence gap events: 19
- Missing sequence IDs: 19
- Max sequence gap: 1
- Assigned slot misses: 1
- Non-assigned preemptions: 0
- Owed RX active: True node=3 count=1
- Fairness skips: 11
- Owed selections: 10
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 77
- node 6: t+3.846s seq 65 -> t+4.262s seq 67; missing [66]
- node 6: t+4.262s seq 67 -> t+4.622s seq 69; missing [68]
- node 6: t+4.622s seq 69 -> t+5.240s seq 71; missing [70]
- node 6: t+5.240s seq 71 -> t+5.639s seq 73; missing [72]
- node 6: t+5.639s seq 73 -> t+5.832s seq 75; missing [74]
- node 6: t+5.832s seq 75 -> t+6.229s seq 77; missing [76]
- node 6: t+6.229s seq 77 -> t+6.826s seq 79; missing [78]
- node 6: t+6.826s seq 79 -> t+7.227s seq 81; missing [80]
- node 6: t+7.227s seq 81 -> t+7.638s seq 83; missing [82]
- node 6: t+7.638s seq 83 -> t+7.832s seq 85; missing [84]
- node 6: t+7.832s seq 85 -> t+8.856s seq 89; missing [86, 87, 88]
- node 6: t+8.856s seq 89 -> t+9.063s seq 91; missing [90]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 129
- drone_telemetry: 79
- assignment_event: 12
- bind_progress_event: 12
- assignments: 6
- drone_link_status: 4
- assignment_timing_hint: 4
- command: 2
- command_ack: 2
- gc_status: 2
- inter_gc_status: 2
- inter_gc_command_queued: 1
