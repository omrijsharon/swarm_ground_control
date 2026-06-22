# Live Debug Log Summary

- Source: `logs_summary\post_stress_node3_coverage_20260622.jsonl`
- Parsed records: 895
- Approx duration: 53.5s

## Commands
- Sent commands: 6
- ACKs: 6 (0 rejected)
- Derived ACK latency: min 10 ms, max 169 ms, avg 51 ms
- Inter-GC queued command events: 1
- t+8.044s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.173s ACK magc/magic_ground_control get_status accepted: -
- t+18.224s ACK telegc/telemetry_ground_control get_status accepted: -
- t+28.280s ACK telegc/telemetry_ground_control get_status accepted: -
- t+38.503s ACK telegc/telemetry_ground_control get_status accepted: -
- t+48.652s ACK telegc/telemetry_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 12
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
- Search events: 5
- Bind progress events: 17
- Assignment events: 17
- Assignment event counts: telemetry_period_observed=6, post_bind_first_telemetry=6, telemetry_period_locked=5
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=5
- Auto shared RX scanner events: 5
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- t+4.832s node 6: telemetry_bind - telemetry_live
- t+5.008s node 7: complete - telemetry_period_locked
- t+5.552s node 6: complete - telemetry_period_locked
- t+8.476s node 3: timing - telemetry_period_observed
- t+8.487s node 3: telemetry_bind - telemetry_live
- t+8.760s node 7: timing - telemetry_period_observed
- t+8.782s node 7: telemetry_bind - telemetry_live
- t+9.059s node 6: timing - telemetry_period_observed
- t+9.080s node 6: telemetry_bind - telemetry_live
- t+9.282s node 7: complete - telemetry_period_locked
- t+9.802s node 6: complete - telemetry_period_locked
- t+31.998s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=12, timeouts=0
- node 3
- node 6
- node 7

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 223

## Short-Loss Guard
- Telemetry rebind events: 42
- No short-loss guard events found.

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=65, owed_rx_selected=56, owed_rx_cleared=56
- Scheduler-caused skips by node: 3=42, 6=1, 7=22
- Owed selections by node: 3=33, 6=1, 7=22
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+51.965s node 3 owed_rx_cleared owed=1 skips=1; t+52.248s node 3 rx_candidate_skipped selected=7 owed=1 skips=1; t+52.466s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+52.466s node 3 owed_rx_cleared owed=1 skips=1; t+52.751s node 3 rx_candidate_skipped selected=7 owed=1 skips=1; t+52.959s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+53.056s node 3 owed_rx_cleared owed=1 skips=1; t+53.274s node 3 rx_candidate_skipped selected=7 owed=1 skips=1; t+53.461s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+53.461s node 3 owed_rx_cleared owed=1 skips=1

## Telemetry Coverage
- Latest status at t+48.708s: mode `telemetry_first`
- Assigned packets received: 185
- Assigned RX coverage: 61%
- Sequence gap events: 91
- Missing sequence IDs: 312
- Max sequence gap: 93
- Assigned slot misses: 116
- Non-assigned preemptions: 0
- Owed RX active: True node=3 count=1
- Fairness skips: 56
- Owed selections: 46
- Owed misses: 0
- Max scheduler skips: 3
- Coverage modes seen: telemetry_first=5

## Telemetry Sequence Gaps
- Observed sequence gaps: 113
- node 3: t+4.242s seq 92 -> t+8.512s seq 109; missing [93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108]
- node 3: t+8.512s seq 109 -> t+32.033s seq 203; missing [110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, +17 more]
- node 3: t+32.033s seq 203 -> t+32.556s seq 205; missing [204]
- node 3: t+32.556s seq 205 -> t+33.049s seq 207; missing [206]
- node 3: t+33.049s seq 207 -> t+33.546s seq 209; missing [208]
- node 3: t+33.546s seq 209 -> t+34.055s seq 211; missing [210]
- node 3: t+34.055s seq 211 -> t+34.556s seq 213; missing [212]
- node 3: t+34.556s seq 213 -> t+35.060s seq 215; missing [214]
- node 3: t+35.060s seq 215 -> t+35.540s seq 217; missing [216]
- node 3: t+35.540s seq 217 -> t+36.045s seq 219; missing [218]
- node 3: t+36.045s seq 219 -> t+36.544s seq 221; missing [220]
- node 3: t+36.544s seq 221 -> t+37.045s seq 223; missing [222]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 432
- drone_telemetry: 223
- telemetry_rebind_event: 42
- assignment_event: 17
- bind_progress_event: 17
- inter_gc_status: 12
- assignments: 8
- drone_link_status: 8
- command: 6
- command_ack: 6
- gc_status: 6
- assignment_timing_hint: 5
- search_event: 5
- coverage_marker: 2
- inter_gc_command_queued: 1
