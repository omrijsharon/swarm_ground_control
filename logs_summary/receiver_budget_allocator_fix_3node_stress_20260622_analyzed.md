# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_allocator_fix_3node_stress_20260622.jsonl`
- Parsed records: 2304
- Approx duration: 131.5s

## Commands
- Sent commands: 9
- ACKs: 9 (0 rejected)
- Derived ACK latency: min 24 ms, max 219 ms, avg 86 ms
- Inter-GC queued command events: 2
- t+0.167s ACK drone/drone get_status accepted: -
- t+0.208s ACK drone/drone get_status accepted: -
- t+10.252s ACK telegc/telemetry_ground_control get_status accepted: -
- t+10.382s ACK magc/magic_ground_control get_status accepted: -
- t+10.664s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+10.840s ACK drone/drone debug_reboot accepted: -
- t+10.893s ACK drone/drone debug_reboot accepted: -
- t+10.944s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 77
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
- Search events: 7
- Bind progress events: 28
- Assignment events: 36
- Assignment event counts: silence_sent=6, join_request_received=4, assign_sent=4, post_bind_acquire_timeout=4, telemetry_period_observed=3, telemetry_period_locked=3, assign_created=3, post_bind_first_telemetry=2, join_ack_received=2, post_bind_acquire_started=2, join_ack_timeout=2, assign_reused=1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=4, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+10.867s to t+48.920s
- t+39.753s node 3: assign - silence_sent
- t+39.848s node 7: quiet - join_request_received
- t+39.848s node 7: quiet - assign_created
- t+40.119s node 7: assign - silence_sent
- t+42.738s node 7: timing - telemetry_period_observed
- t+42.751s node 7: telemetry_bind - telemetry_live
- t+43.158s node 7: complete - telemetry_period_locked
- t+48.129s node 3: quiet - join_request_received
- t+48.332s node 3: quiet - assign_reused
- t+48.332s node 3: assign - silence_sent
- t+48.441s node 3: ack - assign_sent
- t+48.560s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=4, first_telemetry=4, timeouts=8
- node 2
- node 3; timeouts=6
- node 6; ACK->telemetry -0.191s; acquire->telemetry -0.321s
- node 7; timeouts=2

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 9
- Drone telemetry rows: 560
- t+0.102s node 3: drone_debug_status wait_assignment
- t+0.167s node 6: drone_debug_status backoff
- t+0.208s node 7: drone_debug_status wait_assignment
- t+10.839s node 3: drone_debug_event reboot_scheduled
- t+10.840s node 3: drone_debug_status backoff
- t+10.893s node 6: drone_debug_event reboot_scheduled
- t+10.893s node 6: drone_debug_status wait_assignment
- t+10.943s node 7: drone_debug_event reboot_scheduled
- t+10.944s node 7: drone_debug_status wait_assignment

## Short-Loss Guard
- Telemetry rebind events: 95
- Short-loss event counts: short_loss_guard_started=1
- Recent short-loss events: t+37.744s node 6 short_loss_guard_started miss=1 gap=-

## Receiver Budget
- Events: recovery_budget_denied=475, healthy_service_protected=475, recovery_budget_used=119
- Recovery denials by reason: overlaps_healthy_service_window=269, healthy_service_window_too_close=206
- Recent denied recovery:
  - t+130.119s target=3 protected=7 reason=healthy_service_window_too_close
  - t+130.320s target=6 protected=7 reason=healthy_service_window_too_close
  - t+130.333s target=3 protected=7 reason=healthy_service_window_too_close
  - t+130.541s target=3 protected=7 reason=healthy_service_window_too_close
  - t+130.737s target=3 protected=7 reason=healthy_service_window_too_close
  - t+130.937s target=3 protected=7 reason=healthy_service_window_too_close
  - t+131.135s target=3 protected=7 reason=healthy_service_window_too_close
  - t+131.334s target=3 protected=7 reason=healthy_service_window_too_close

## Telemetry Coverage
- Latest status at t+10.315s: mode `telemetry_first`
- Assigned packets received: 21
- Assigned RX coverage: 25%
- Sequence gap events: 1
- Missing sequence IDs: 2
- Max sequence gap: 2
- Assigned slot misses: 60
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 5%
- Receiver overloaded: False
- Recovery budget used: 66
- Recovery budget denied: 20
- Healthy service protected: 20
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 2
- node 2: t+4.593s seq 97 -> t+5.366s seq 100; missing [98, 99]
- node 7: t+42.751s seq 20 -> t+43.171s seq 22; missing [21]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1318
- drone_telemetry: 560
- telemetry_rebind_event: 95
- inter_gc_status: 77
- assignment_event: 36
- bind_progress_event: 28
- assignments: 18
- drone_link_status: 10
- command: 9
- command_ack: 9
- bench_marker: 7
- search_event: 7
- drone_debug_status: 6
- drone_live_status: 3
- assignment_timing_hint: 3
- drone_debug_event: 3
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
