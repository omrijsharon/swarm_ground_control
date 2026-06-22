# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_unprotected_shared_node3_rejoin_20260622.jsonl`
- Parsed records: 1861
- Approx duration: 90.1s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 15 ms, max 176 ms, avg 95 ms
- Inter-GC queued command events: 1
- t+8.017s ACK telegc/telemetry_ground_control get_status accepted: -
- t+8.229s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 43
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 0
- Suspicious JSON fragment lines: 1
- Fragment samples: t+6.819s telegc: ind_event","event":"deferred","sourceRole":"magic_ground_control","nodeId":3,"reason":"shared_bind_critica{"schemaVersio

## Bind And Search
- Search events: 1
- Bind progress events: 12
- Assignment events: 13
- Assignment event counts: telemetry_period_observed=3, telemetry_period_locked=3, join_request_received=1, assign_reused=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, post_bind_first_telemetry=1
- t+4.231s node 7: timing - telemetry_period_observed
- t+4.340s node 6: timing - telemetry_period_observed
- t+4.729s node 6: complete - telemetry_period_locked
- t+5.403s node 7: complete - telemetry_period_locked
- t+51.326s node 3: quiet - join_request_received
- t+51.378s node 3: quiet - assign_reused
- t+51.449s node 3: assign - silence_sent
- t+51.449s node 3: ack - assign_sent
- t+51.521s node 3: telemetry_bind - assignment_completed
- t+51.535s node 3: timing - telemetry_period_observed
- t+51.548s node 3: telemetry_bind - telemetry_live
- t+51.732s node 3: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=2, timeouts=0
- node 3; ACK->telemetry 0.123s; acquire->telemetry 0.123s
- node 6
- node 7

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 688

## Short-Loss Guard
- Telemetry rebind events: 68
- No short-loss guard events found.

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=1, owed_rx_cleared=1, owed_service_cleared=1
- Scheduler-caused skips by node: 7=1
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+8.124s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+8.229s node 7 owed_rx_cleared owed=1 skips=1; t+8.242s node 7 owed_service_cleared owed=1 skips=1

## Receiver Budget
- Events: recovery_budget_denied=395, healthy_service_protected=395, recovery_budget_used=12, owed_service_cleared=1
- Recovery denials by reason: no_safe_recovery_slice_before_known_service=327, healthy_service_deadline_risk=68
- Recent denied recovery:
  - t+50.539s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+50.637s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+50.816s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+50.863s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+51.018s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+51.123s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service
  - t+51.137s target=3 protected=7 reason=no_safe_recovery_slice_before_known_service
  - t+51.266s target=3 protected=6 reason=no_safe_recovery_slice_before_known_service

## Telemetry Coverage
- Latest status at t+8.094s: mode `telemetry_first`
- Assigned packets received: 18
- Assigned RX coverage: 85%
- Sequence gap events: 4
- Missing sequence IDs: 11
- Max sequence gap: 4
- Assigned slot misses: 3
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 9%
- Receiver overloaded: False
- Recovery budget used: 10
- Recovery budget denied: 15
- Healthy service protected: 15
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 292
- node 7: t+4.244s seq 28 -> t+5.417s seq 33; missing [29, 30, 31, 32]
- node 7: t+5.417s seq 33 -> t+5.829s seq 36; missing [34, 35]
- node 7: t+51.253s seq 7 -> t+51.926s seq 10; missing [8, 9]
- node 7: t+51.926s seq 10 -> t+52.322s seq 12; missing [11]
- node 7: t+52.322s seq 12 -> t+52.722s seq 14; missing [13]
- node 7: t+52.722s seq 14 -> t+53.123s seq 16; missing [15]
- node 7: t+53.123s seq 16 -> t+53.521s seq 18; missing [17]
- node 7: t+53.521s seq 18 -> t+53.921s seq 20; missing [19]
- node 7: t+53.921s seq 20 -> t+54.320s seq 22; missing [21]
- node 7: t+54.320s seq 22 -> t+54.721s seq 24; missing [23]
- node 7: t+54.721s seq 24 -> t+55.122s seq 26; missing [25]
- node 7: t+55.122s seq 26 -> t+55.522s seq 28; missing [27]

## Transport Findings
- Suspicious JSON fragments: 1.

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 905
- drone_telemetry: 688
- telemetry_rebind_event: 68
- inter_gc_status: 43
- assignment_event: 13
- bind_progress_event: 12
- assignments: 5
- drone_link_status: 4
- assignment_timing_hint: 3
- command: 2
- command_ack: 2
- gc_status: 1
- inter_gc_command_queued: 1
- search_event: 1
