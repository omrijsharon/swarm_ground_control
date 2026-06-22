# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_allocator_fix_status_20260622.jsonl`
- Parsed records: 844
- Approx duration: 35.1s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 19 ms, max 116 ms, avg 67 ms
- Inter-GC queued command events: 1
- t+10.021s ACK telegc/telemetry_ground_control get_status accepted: -
- t+10.169s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 11
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
- Bind progress events: 4
- Assignment events: 4
- Assignment event counts: telemetry_period_observed=2, telemetry_period_locked=2
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=1
- Auto shared RX scanner events: 1
- Auto shared RX complete reasons: auto_shared_rx_timeout
- t+4.885s node 2: timing - telemetry_period_observed
- t+5.631s node 2: complete - telemetry_period_locked
- t+11.137s node 2: timing - telemetry_period_observed
- t+11.907s node 2: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=0
- node 2

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 114

## Short-Loss Guard
- Telemetry rebind events: 40
- No short-loss guard events found.

## Receiver Budget
- Events: recovery_budget_denied=112, healthy_service_protected=111, recovery_budget_used=108
- Recovery denials by reason: healthy_service_window_too_close=64, overlaps_healthy_service_window=48
- Recent denied recovery:
  - t+33.342s target=3 protected=2 reason=healthy_service_window_too_close
  - t+33.455s target=6 protected=2 reason=healthy_service_window_too_close
  - t+33.642s target=3 protected=2 reason=healthy_service_window_too_close
  - t+34.090s target=6 protected=2 reason=healthy_service_window_too_close
  - t+34.343s target=3 protected=2 reason=healthy_service_window_too_close
  - t+34.596s target=6 protected=2 reason=healthy_service_window_too_close
  - t+34.845s target=3 protected=2 reason=healthy_service_window_too_close
  - t+35.095s target=6 protected=2 reason=healthy_service_window_too_close

## Telemetry Coverage
- Latest status at t+10.086s: mode `telemetry_first`
- Assigned packets received: 19
- Assigned RX coverage: 33%
- Sequence gap events: 1
- Missing sequence IDs: 2
- Max sequence gap: 2
- Assigned slot misses: 37
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 5%
- Receiver overloaded: False
- Recovery budget used: 44
- Recovery budget denied: 18
- Healthy service protected: 18
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 3
- node 2: t+4.899s seq 94 -> t+5.814s seq 97; missing [95, 96]
- node 2: t+10.139s seq 115 -> t+11.150s seq 119; missing [116, 117, 118]
- node 2: t+11.150s seq 119 -> t+11.920s seq 122; missing [120, 121]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 542
- drone_telemetry: 114
- telemetry_rebind_event: 40
- inter_gc_status: 11
- assignments: 10
- drone_link_status: 8
- assignment_event: 4
- bind_progress_event: 4
- assignment_timing_hint: 2
- command: 2
- command_ack: 2
- gc_status: 1
- inter_gc_command_queued: 1
- search_event: 1
