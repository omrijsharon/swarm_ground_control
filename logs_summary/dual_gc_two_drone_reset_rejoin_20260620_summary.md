# Live Debug Log Summary

- Source: `logs_summary\dual_gc_two_drone_reset_rejoin_20260620.jsonl`
- Parsed records: 657
- Approx duration: 99.9s

## Commands
- Sent commands: 1
- ACKs: 1 (0 rejected)
- t+15.067s ACK magc/magic_ground_control clear_all_assignments accepted: -

## Bind And Search
- Search events: 15
- Bind progress events: 13
- Assignment events: 19
- Assignment event counts: join_request_received=3, silence_sent=3, assign_sent=2, join_ack_received=2, post_bind_acquire_timeout=2, telemetry_period_observed=2, post_bind_first_telemetry=2, telemetry_period_rejected=2, telemetry_period_locked=1
- Auto shared RX: starts=0, active_ticks=11, joins=0, completes=1
- Auto shared RX scanner events: 2
- Auto shared RX complete reasons: auto_shared_rx_timeout
- Empty-assignment shared RX: starts=0, active_ticks=0, joins=0, completes=0, oocr_deferred=2
- t+17.496s node 3: assign - silence_sent
- t+32.185s node 6: quiet - join_request_received
- t+33.224s node 6: assign - silence_sent
- t+40.001s node 3: quiet - join_request_received
- t+41.030s node 3: assign - silence_sent
- t+43.188s node 3: timing - telemetry_period_observed
- t+43.202s node 3: telemetry_bind - telemetry_live
- t+43.315s node 3: timing - telemetry_period_rejected
- t+43.539s node 3: timing - telemetry_period_observed
- t+43.552s node 3: telemetry_bind - telemetry_live
- t+43.700s node 3: timing - telemetry_period_rejected
- t+43.894s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 3
- OOCR event counts: candidate_failed=2, background_oocr_complete=1
- Failed candidate confirmations: 2

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=4
- node 3; ACK->telemetry 23.483s; timeouts=4
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 281

## Short-Loss Guard
- Telemetry rebind events: 12
- No short-loss guard events found.

## Telemetry Sequence Gaps
- Observed sequence gaps: 1
- node 3: t+50.818s seq 33 -> t+50.818s seq 38; missing [34, 35, 36, 37]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 281
- scanner_event: 92
- assignment_event: 19
- inter_gc_status: 15
- search_event: 15
- bind_progress_event: 13
- telemetry_rebind_event: 12
- assignments: 7
- drone_link_status: 5
- orphan_recovery_event: 3
- session_event: 2
- command: 1
- command_ack: 1
- assignment_timing_hint: 1
