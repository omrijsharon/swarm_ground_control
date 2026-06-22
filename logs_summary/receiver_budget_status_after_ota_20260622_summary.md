# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_status_after_ota_20260622.jsonl`
- Parsed records: 469
- Approx duration: 25.0s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 19 ms, max 132 ms, avg 75 ms
- Inter-GC queued command events: 1
- t+10.023s ACK telegc/telemetry_ground_control get_status accepted: -
- t+10.187s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 4
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
- Bind progress events: 10
- Assignment events: 10
- Assignment event counts: telemetry_period_observed=4, post_bind_first_telemetry=4, telemetry_period_locked=2
- t+3.857s node 6: timing - telemetry_period_observed
- t+3.867s node 6: telemetry_bind - telemetry_live
- t+4.042s node 3: timing - telemetry_period_observed
- t+4.069s node 3: telemetry_bind - telemetry_live
- t+4.245s node 6: complete - telemetry_period_locked
- t+10.653s node 6: timing - telemetry_period_observed
- t+10.665s node 6: telemetry_bind - telemetry_live
- t+10.841s node 3: timing - telemetry_period_observed
- t+10.861s node 3: telemetry_bind - telemetry_live
- t+11.220s node 6: complete - telemetry_period_locked

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
- Drone telemetry rows: 103

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Receiver Budget
- Events: recovery_budget_denied=99, healthy_service_protected=99, recovery_budget_used=6
- Recovery denials by reason: overlaps_healthy_service_window=99
- Recent denied recovery:
  - t+23.634s target=7 protected=6 reason=overlaps_healthy_service_window
  - t+23.845s target=7 protected=6 reason=overlaps_healthy_service_window
  - t+23.855s target=7 protected=6 reason=overlaps_healthy_service_window
  - t+24.063s target=7 protected=6 reason=overlaps_healthy_service_window
  - t+24.256s target=7 protected=6 reason=overlaps_healthy_service_window
  - t+24.641s target=7 protected=6 reason=overlaps_healthy_service_window
  - t+24.843s target=7 protected=6 reason=overlaps_healthy_service_window
  - t+24.854s target=7 protected=6 reason=overlaps_healthy_service_window

## Telemetry Coverage
- Latest status at t+10.085s: mode `telemetry_first`
- Assigned packets received: 31
- Assigned RX coverage: 100%
- Sequence gap events: 1
- Missing sequence IDs: 1
- Max sequence gap: 1
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 5%
- Receiver overloaded: False
- Recovery budget used: 3
- Recovery budget denied: 29
- Healthy service protected: 29
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 5
- node 6: t+3.888s seq 52 -> t+4.291s seq 54; missing [53]
- node 6: t+10.117s seq 83 -> t+10.680s seq 86; missing [84, 85]
- node 6: t+10.680s seq 86 -> t+11.230s seq 88; missing [87]
- node 6: t+11.230s seq 88 -> t+11.453s seq 90; missing [89]
- node 3: t+4.069s seq 84 -> t+10.871s seq 118; missing [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, +17 more]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 218
- drone_telemetry: 103
- assignments: 10
- assignment_event: 10
- bind_progress_event: 10
- drone_link_status: 4
- inter_gc_status: 4
- assignment_timing_hint: 2
- command: 2
- command_ack: 2
- gc_status: 1
- inter_gc_command_queued: 1
