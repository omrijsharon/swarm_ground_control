# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_3node_stress_slice_20260622.jsonl`
- Parsed records: 3520
- Approx duration: 131.8s

## Commands
- Sent commands: 9
- ACKs: 9 (0 rejected)
- Derived ACK latency: min 26 ms, max 774 ms, avg 152 ms
- Inter-GC queued command events: 2
- t+0.121s ACK drone/drone get_status accepted: -
- t+0.895s ACK drone/drone get_status accepted: -
- t+10.937s ACK telegc/telemetry_ground_control get_status accepted: -
- t+11.070s ACK magc/magic_ground_control get_status accepted: -
- t+11.316s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+11.381s ACK drone/drone debug_reboot accepted: -
- t+11.417s ACK drone/drone debug_reboot accepted: -
- t+11.454s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 83
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
- Search events: 11
- Bind progress events: 25
- Assignment events: 33
- Assignment event counts: silence_sent=6, assign_sent=5, join_request_received=4, assign_created=3, join_ack_received=3, post_bind_acquire_started=3, post_bind_acquire_timeout=3, join_ack_timeout=2, assign_reused=1, telemetry_period_observed=1, post_bind_first_telemetry=1, telemetry_period_locked=1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+11.518s to t+49.623s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+19.233s node 6: complete - telemetry_period_locked
- t+19.465s node 6: telemetry_bind - assignment_completed
- t+26.226s node 7: quiet - join_request_received
- t+26.330s node 7: quiet - assign_created
- t+26.428s node 7: assign - silence_sent
- t+26.531s node 7: ack - assign_sent
- t+26.624s node 7: telemetry_bind - assignment_completed
- t+35.029s node 3: quiet - join_request_received
- t+35.134s node 3: quiet - assign_created
- t+35.229s node 3: assign - silence_sent
- t+35.335s node 3: ack - assign_sent
- t+35.533s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=2, timeouts=6
- node 3; timeouts=2
- node 6; ACK->telemetry -0.342s; acquire->telemetry -0.342s
- node 7; timeouts=4

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 9
- Drone telemetry rows: 564
- t+0.075s node 3: drone_debug_status backoff
- t+0.121s node 6: drone_debug_status backoff
- t+0.895s node 7: drone_debug_status wait_assignment
- t+11.381s node 3: drone_debug_event reboot_scheduled
- t+11.381s node 3: drone_debug_status backoff
- t+11.417s node 6: drone_debug_event reboot_scheduled
- t+11.417s node 6: drone_debug_status wait_assignment
- t+11.454s node 7: drone_debug_event reboot_scheduled
- t+11.454s node 7: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Receiver Budget
- Events: recovery_budget_denied=528, healthy_service_protected=528, recovery_budget_used=522
- Recovery denials by reason: healthy_service_window_too_close=498, overlaps_healthy_service_window=30
- Recent denied recovery:
  - t+130.272s target=3 protected=6 reason=healthy_service_window_too_close
  - t+130.622s target=3 protected=6 reason=healthy_service_window_too_close
  - t+130.818s target=3 protected=6 reason=healthy_service_window_too_close
  - t+130.869s target=3 protected=6 reason=healthy_service_window_too_close
  - t+131.069s target=3 protected=6 reason=healthy_service_window_too_close
  - t+131.272s target=3 protected=6 reason=healthy_service_window_too_close
  - t+131.620s target=3 protected=6 reason=healthy_service_window_too_close
  - t+131.820s target=3 protected=6 reason=healthy_service_window_too_close

## Telemetry Coverage
- Latest status at t+10.989s: mode `telemetry_first`
- Assigned packets received: 0
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 0%
- Receiver overloaded: False
- Recovery budget used: 19
- Recovery budget denied: 0
- Healthy service protected: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 2636
- drone_telemetry: 564
- inter_gc_status: 83
- assignment_event: 33
- bind_progress_event: 25
- assignments: 16
- search_event: 11
- command: 9
- command_ack: 9
- bench_marker: 7
- drone_debug_status: 6
- drone_live_status: 3
- drone_debug_event: 3
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
- drone_link_status: 1
- assignment_timing_hint: 1
