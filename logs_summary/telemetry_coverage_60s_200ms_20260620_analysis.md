# Live Debug Log Summary

- Source: `logs_summary\telemetry_coverage_60s_200ms_20260620.jsonl`
- Parsed records: 462
- Approx duration: 66.5s

## Commands
- Sent commands: 7
- ACKs: 7 (1 rejected)
- t+10.603s ACK telegc/telemetry_ground_control get_status accepted: -
- t+10.807s ACK magc/telemetry_ground_control get_status rejected: magc_link_unavailable
- t+16.193s ACK telegc/telemetry_ground_control get_status accepted: -
- t+26.310s ACK telegc/telemetry_ground_control get_status accepted: -
- t+36.403s ACK telegc/telemetry_ground_control get_status accepted: -
- t+46.500s ACK telegc/telemetry_ground_control get_status accepted: -
- t+56.597s ACK telegc/telemetry_ground_control get_status accepted: -

## Bind And Search
- Search events: 10
- Bind progress events: 9
- Assignment events: 12
- Assignment event counts: telemetry_period_observed=2, telemetry_period_rejected=2, telemetry_period_locked=2, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, post_bind_first_telemetry=1
- Auto shared RX: starts=0, active_ticks=8, joins=0, completes=1
- Auto shared RX scanner events: 3
- Auto shared RX complete reasons: auto_shared_rx_timeout
- t+17.352s node 7: quiet - join_request_received
- t+18.380s node 7: assign - silence_sent
- t+20.719s node 7: timing - telemetry_period_observed
- t+20.814s node 7: timing - telemetry_period_rejected
- t+21.041s node 7: complete - telemetry_period_locked
- t+27.110s node 7: timing - telemetry_period_observed
- t+27.130s node 7: telemetry_bind - telemetry_live
- t+27.443s node 7: timing - telemetry_period_rejected
- t+28.618s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=2, timeouts=0
- node 7; ACK->telemetry 0.103s; acquire->telemetry 0.103s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 223

## Short-Loss Guard
- Telemetry rebind events: 4
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+56.639s: mode `telemetry_first`
- Assigned packets received: 173
- Assigned RX coverage: 82%
- Sequence gap events: 2
- Missing sequence IDs: 7
- Max sequence gap: 6
- Assigned slot misses: 37
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=5, waiting_assignments=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 3
- node 7: t+20.730s seq 0 -> t+21.020s seq 2; missing [1]
- node 7: t+27.007s seq 31 -> t+27.130s seq 33; missing [32]
- node 7: t+28.827s seq 35 -> t+29.025s seq 42; missing [36, 37, 38, 39, 40, 41]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 223
- scanner_event: 42
- assignment_event: 12
- inter_gc_status: 10
- search_event: 10
- bind_progress_event: 9
- command: 7
- command_ack: 7
- gc_status: 6
- telemetry_rebind_event: 4
- drone_link_status: 3
- coverage_marker: 2
- assignments: 2
- assignment_timing_hint: 2
