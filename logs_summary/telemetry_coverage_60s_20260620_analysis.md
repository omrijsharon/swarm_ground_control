# Live Debug Log Summary

- Source: `logs_summary\telemetry_coverage_60s_20260620.jsonl`
- Parsed records: 785
- Approx duration: 72.5s

## Commands
- Sent commands: 7
- ACKs: 7 (0 rejected)
- t+12.026s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.425s ACK magc/magic_ground_control get_status accepted: -
- t+22.180s ACK telegc/telemetry_ground_control get_status accepted: -
- t+32.303s ACK telegc/telemetry_ground_control get_status accepted: -
- t+42.479s ACK telegc/telemetry_ground_control get_status accepted: -
- t+52.593s ACK telegc/telemetry_ground_control get_status accepted: -
- t+62.719s ACK telegc/telemetry_ground_control get_status accepted: -

## Bind And Search
- Search events: 0
- Bind progress events: 3
- Assignment events: 3
- Assignment event counts: telemetry_period_observed=1, telemetry_period_rejected=1, telemetry_period_locked=1
- t+12.871s node 7: timing - telemetry_period_observed
- t+12.966s node 7: timing - telemetry_period_rejected
- t+13.062s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 35
- Channel scan event counts: background_oocr_slice=35
- CAD samples: rows=8, validated=0, rejected=8, one_hit_rejected=8
- OOCR events: 16
- OOCR event counts: candidate_failed=4, background_oocr_started=4, background_oocr_confirmation_started=3, background_oocr_complete=3, confirmation_listen=2
- Recent OOCR confirmations: t+11.412s ch 35/p0 score 300 reason cad_candidate; t+22.753s ch 35/p55 score 300 reason cad_candidate; t+36.438s ch 38/p0 score 300 reason cad_candidate
- Failed candidate confirmations: 4

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=0
- node 7

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 562

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+62.759s: mode `telemetry_first`
- Assigned packets received: 479
- Assigned RX coverage: 100%
- Sequence gap events: 16
- Missing sequence IDs: 20
- Max sequence gap: 4
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=5, waiting_assignments=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 30
- node 7: t+13.353s seq 107 -> t+13.353s seq 109; missing [108]
- node 7: t+22.753s seq 202 -> t+22.865s seq 204; missing [203]
- node 7: t+34.585s seq 63 -> t+34.585s seq 65; missing [64]
- node 7: t+34.914s seq 66 -> t+35.125s seq 69; missing [67, 68]
- node 7: t+35.125s seq 69 -> t+35.125s seq 71; missing [70]
- node 7: t+35.553s seq 73 -> t+35.553s seq 75; missing [74]
- node 7: t+36.052s seq 78 -> t+36.052s seq 80; missing [79]
- node 7: t+36.438s seq 82 -> t+36.553s seq 84; missing [83]
- node 7: t+36.553s seq 84 -> t+36.754s seq 86; missing [85]
- node 7: t+47.901s seq 196 -> t+47.901s seq 198; missing [197]
- node 7: t+48.141s seq 199 -> t+48.141s seq 201; missing [200]
- node 7: t+48.446s seq 203 -> t+48.551s seq 205; missing [204]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 562
- channel_scan_event: 35
- inter_gc_status: 18
- orphan_recovery_event: 16
- command: 7
- command_ack: 7
- gc_status: 6
- assignment_event: 3
- bind_progress_event: 3
- coverage_marker: 2
- assignments: 2
- scanner_event: 1
- drone_link_status: 1
- assignment_timing_hint: 1
