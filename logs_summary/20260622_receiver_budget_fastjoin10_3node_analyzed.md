# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_fastjoin10_3node.jsonl`
- Parsed records: 1660
- Approx duration: 150.7s

## Commands
- Sent commands: 9
- ACKs: 9 (0 rejected)
- Derived ACK latency: min 28 ms, max 1419 ms, avg 562 ms
- Inter-GC queued command events: 2
- t+2.447s ACK drone/drone get_status accepted: -
- t+2.526s ACK drone/drone get_status accepted: -
- t+27.568s ACK telegc/telemetry_ground_control get_status accepted: -
- t+28.508s ACK magc/magic_ground_control get_status accepted: -
- t+29.941s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+30.087s ACK drone/drone debug_reboot accepted: -
- t+30.135s ACK drone/drone debug_reboot accepted: -
- t+30.172s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 117
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
- Search events: 12
- Bind progress events: 34
- Assignment events: 41
- Assignment event counts: silence_sent=6, assign_sent=5, join_request_received=4, telemetry_period_observed=4, post_bind_first_telemetry=4, telemetry_period_locked=4, assign_created=3, join_ack_received=3, post_bind_acquire_started=3, join_ack_timeout=2, post_bind_acquire_timeout=2, assign_reused=1
- Auto shared RX: starts=2, active_ticks=0, joins=0, completes=0
- Auto shared RX scanner events: 2
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+30.356s to t+51.035s
- t+44.945s node 6: telemetry_bind - telemetry_live
- t+45.039s node 6: ack - assign_sent
- t+45.162s node 6: complete - telemetry_period_locked
- t+45.280s node 6: telemetry_bind - assignment_completed
- t+50.418s node 3: quiet - join_request_received
- t+50.432s node 3: timing - telemetry_period_observed
- t+50.445s node 3: telemetry_bind - telemetry_live
- t+50.526s node 3: quiet - assign_created
- t+50.628s node 3: assign - silence_sent
- t+50.628s node 3: complete - telemetry_period_locked
- t+50.727s node 3: ack - assign_sent
- t+50.883s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=6, first_telemetry=8, timeouts=4
- node 3; ACK->telemetry -0.413s; acquire->telemetry -0.413s; timeouts=2
- node 6; ACK->telemetry -0.157s; acquire->telemetry -0.157s; timeouts=2
- node 7; ACK->telemetry -25.852s; acquire->telemetry -25.852s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 9
- Drone telemetry rows: 847
- t+1.318s node 3: drone_debug_status wait_assignment
- t+2.448s node 6: drone_debug_status wait_assignment
- t+2.526s node 7: drone_debug_status assigned_telemetry
- t+30.087s node 3: drone_debug_event reboot_scheduled
- t+30.087s node 3: drone_debug_status wait_assignment
- t+30.135s node 6: drone_debug_event reboot_scheduled
- t+30.135s node 6: drone_debug_status backoff
- t+30.172s node 7: drone_debug_event reboot_scheduled
- t+30.173s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 85
- Short-loss event counts: short_loss_guard_started=1
- Recent short-loss events: t+45.943s node 6 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=2, owed_rx_selected=2, owed_service_selected=2, owed_rx_cleared=2, owed_service_cleared=2
- Scheduler-caused skips by node: 6=1, 7=1
- Owed selections by node: 6=1, 7=1
- Max consecutive scheduler skips observed: 1
- Recent fairness events: t+45.192s node 6 rx_candidate_skipped selected=7 owed=1 skips=1; t+45.307s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+45.512s node 6 owed_service_selected selected=6 owed=1 skips=1; t+45.532s node 6 owed_rx_cleared owed=1 skips=1; t+45.532s node 6 owed_service_cleared owed=1 skips=1; t+45.889s node 7 rx_candidate_skipped selected=6 owed=1 skips=1; t+45.970s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+45.984s node 7 owed_service_selected selected=7 owed=1 skips=1; t+46.088s node 7 owed_rx_cleared owed=1 skips=1; t+46.102s node 7 owed_service_cleared owed=1 skips=1

## Receiver Budget
- Events: recovery_budget_denied=95, healthy_service_protected=95, recovery_budget_used=13, owed_service_selected=2, owed_service_cleared=2
- Recovery denials by reason: healthy_service_deadline_risk=95
- Recent denied recovery:
  - t+53.437s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+53.705s target=6 protected=3 reason=healthy_service_deadline_risk
  - t+53.842s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+54.105s target=6 protected=3 reason=healthy_service_deadline_risk
  - t+54.250s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+54.505s target=6 protected=3 reason=healthy_service_deadline_risk
  - t+54.638s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+54.917s target=6 protected=3 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+27.632s: mode `telemetry_first`
- Assigned packets received: 41
- Assigned RX coverage: 80%
- Sequence gap events: 4
- Missing sequence IDs: 30
- Max sequence gap: 24
- Assigned slot misses: 10
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 5%
- Receiver overloaded: False
- Recovery budget used: 13
- Recovery budget denied: 40
- Healthy service protected: 40
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 272
- node 7: t+13.541s seq 83 -> t+18.552s seq 108; missing [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, +8 more]
- node 7: t+18.552s seq 108 -> t+19.127s seq 111; missing [109, 110]
- node 7: t+19.321s seq 112 -> t+19.922s seq 115; missing [113, 114]
- node 7: t+19.922s seq 115 -> t+20.519s seq 118; missing [116, 117]
- node 7: t+29.726s seq 164 -> t+39.091s seq 2; missing [165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, +17 more]
- node 7: t+44.703s seq 30 -> t+45.293s seq 33; missing [31, 32]
- node 7: t+45.293s seq 33 -> t+45.889s seq 35; missing [34]
- node 7: t+45.889s seq 35 -> t+46.102s seq 37; missing [36]
- node 7: t+50.310s seq 58 -> t+50.896s seq 61; missing [59, 60]
- node 7: t+50.896s seq 61 -> t+51.291s seq 63; missing [62]
- node 7: t+51.291s seq 63 -> t+51.692s seq 65; missing [64]
- node 7: t+51.692s seq 65 -> t+52.091s seq 67; missing [66]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 847
- scanner_event: 349
- inter_gc_status: 117
- telemetry_rebind_event: 85
- assignment_event: 41
- bind_progress_event: 34
- search_event: 12
- assignments: 10
- command: 9
- command_ack: 9
- bench_marker: 7
- drone_debug_status: 6
- drone_link_status: 6
- assignment_timing_hint: 4
- drone_live_status: 3
- drone_debug_event: 3
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
