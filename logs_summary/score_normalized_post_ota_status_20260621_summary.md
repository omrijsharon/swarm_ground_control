# Live Debug Log Summary

- Source: `logs_summary\score_normalized_post_ota_status_20260621.jsonl`
- Parsed records: 368
- Approx duration: 25.0s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 35 ms, max 97 ms, avg 66 ms
- Inter-GC queued command events: 1
- t+8.041s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.153s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 8
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
- Bind progress events: 9
- Assignment events: 9
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, telemetry_period_rejected=1
- t+3.937s node 6: timing - telemetry_period_observed
- t+4.211s node 3: timing - telemetry_period_observed
- t+4.481s node 6: complete - telemetry_period_locked
- t+4.602s node 3: complete - telemetry_period_locked
- t+8.544s node 6: timing - telemetry_period_observed
- t+8.613s node 3: timing - telemetry_period_observed
- t+8.750s node 6: timing - telemetry_period_rejected
- t+8.811s node 3: complete - telemetry_period_locked
- t+8.966s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=0
- node 3
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 200

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=2, owed_rx_selected=2, owed_rx_cleared=2
- Scheduler-caused skips by node: 3=1, 6=1
- Owed selections by node: 3=1, 6=1
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+18.780s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+18.818s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+18.942s node 3 rx_candidate_skipped selected=6 owed=1 skips=1; t+18.942s node 6 owed_rx_cleared owed=1 skips=1; t+19.203s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+19.326s node 3 owed_rx_cleared owed=1 skips=1

## Telemetry Coverage
- Latest status at t+8.087s: mode `telemetry_first`
- Assigned packets received: 38
- Assigned RX coverage: 92%
- Sequence gap events: 3
- Missing sequence IDs: 3
- Max sequence gap: 1
- Assigned slot misses: 3
- Non-assigned preemptions: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 9
- node 6: t+3.984s seq 206 -> t+4.492s seq 208; missing [207]
- node 6: t+4.492s seq 208 -> t+4.804s seq 210; missing [209]
- node 6: t+8.153s seq 227 -> t+8.601s seq 229; missing [228]
- node 6: t+18.577s seq 23 -> t+19.141s seq 25; missing [24]
- node 3: t+4.334s seq 219 -> t+4.804s seq 221; missing [220]
- node 3: t+8.041s seq 238 -> t+8.728s seq 241; missing [239, 240]
- node 3: t+8.837s seq 242 -> t+9.328s seq 244; missing [243]
- node 3: t+18.567s seq 34 -> t+18.811s seq 36; missing [35]
- node 3: t+18.811s seq 36 -> t+19.326s seq 38; missing [37]

## State Flicker
- Node 3: 2 rapid state transitions: t+4.334s offline->online, t+8.728s offline->online
- Node 6: 1 rapid state transitions: t+3.984s offline->online

## Event Counts
- drone_telemetry: 200
- scanner_event: 14
- assignment_event: 9
- bind_progress_event: 9
- inter_gc_status: 8
- drone_link_status: 7
- assignments: 6
- assignment_timing_hint: 4
- command: 2
- command_ack: 2
- gc_status: 2
- inter_gc_command_queued: 1
