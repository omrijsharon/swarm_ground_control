# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_final_abuse_3node.jsonl`
- Parsed records: 1301
- Approx duration: 146.5s

## Commands
- Sent commands: 9
- ACKs: 9 (0 rejected)
- Derived ACK latency: min 30 ms, max 253 ms, avg 110 ms
- Inter-GC queued command events: 2
- t+0.170s ACK drone/drone get_status accepted: -
- t+0.276s ACK drone/drone get_status accepted: -
- t+25.317s ACK telegc/telemetry_ground_control get_status accepted: -
- t+25.482s ACK magc/magic_ground_control get_status accepted: -
- t+25.768s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+25.876s ACK drone/drone debug_reboot accepted: -
- t+25.976s ACK drone/drone debug_reboot accepted: -
- t+26.077s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 99
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
- Bind progress events: 34
- Assignment events: 37
- Assignment event counts: telemetry_period_observed=6, post_bind_first_telemetry=6, telemetry_period_locked=6, join_request_received=3, assign_created=3, silence_sent=3, assign_sent=3, join_ack_received=3, post_bind_acquire_started=3, telemetry_period_rejected=1
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=0
- Auto shared RX scanner events: 1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=3, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+25.972s to t+44.126s
- t+39.521s node 7: ack - assign_sent
- t+39.545s node 7: timing - telemetry_period_rejected
- t+39.755s node 7: complete - telemetry_period_locked
- t+43.518s node 7: telemetry_bind - assignment_completed
- t+43.530s node 3: quiet - join_request_received
- t+43.530s node 3: timing - telemetry_period_observed
- t+43.554s node 3: telemetry_bind - telemetry_live
- t+43.722s node 3: quiet - assign_created
- t+43.734s node 3: complete - telemetry_period_locked
- t+43.834s node 3: assign - silence_sent
- t+44.126s node 3: telemetry_bind - assignment_completed
- t+44.126s node 3: ack - assign_sent

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=4, first_telemetry=12, timeouts=0
- node 3; ACK->telemetry -39.763s; acquire->telemetry -39.763s
- node 6; ACK->telemetry -29.953s; acquire->telemetry -29.954s
- node 7; ACK->telemetry -39.432s; acquire->telemetry -39.614s

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 9
- Drone telemetry rows: 725
- t+0.074s node 3: drone_debug_status assigned_telemetry
- t+0.170s node 6: drone_debug_status assigned_telemetry
- t+0.276s node 7: drone_debug_status assigned_telemetry
- t+25.876s node 3: drone_debug_event reboot_scheduled
- t+25.876s node 3: drone_debug_status assigned_telemetry
- t+25.976s node 6: drone_debug_event reboot_scheduled
- t+25.977s node 6: drone_debug_status assigned_telemetry
- t+26.077s node 7: drone_debug_event reboot_scheduled
- t+26.077s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 58
- Short-loss event counts: short_loss_guard_started=1
- Recent short-loss events: t+39.838s node 6 short_loss_guard_started miss=1 gap=-

## Receiver Budget
- Events: recovery_budget_denied=42, healthy_service_protected=42
- Recovery denials by reason: healthy_service_deadline_risk=42
- Recent denied recovery:
  - t+47.133s target=6 protected=3 reason=healthy_service_deadline_risk
  - t+47.349s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+47.538s target=6 protected=3 reason=healthy_service_deadline_risk
  - t+47.740s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+47.937s target=6 protected=3 reason=healthy_service_deadline_risk
  - t+48.145s target=6 protected=7 reason=healthy_service_deadline_risk
  - t+48.343s target=6 protected=3 reason=healthy_service_deadline_risk
  - t+48.557s target=6 protected=7 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.381s: mode `telemetry_first`
- Assigned packets received: 160
- Assigned RX coverage: 100%
- Sequence gap events: 157
- Missing sequence IDs: 160
- Max sequence gap: 2
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 14%
- Receiver overloaded: False
- Recovery budget used: 0
- Recovery budget denied: 0
- Healthy service protected: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 676
- node 7: t+3.904s seq 0 -> t+4.593s seq 2; missing [1]
- node 7: t+4.593s seq 2 -> t+4.994s seq 5; missing [3, 4]
- node 7: t+4.994s seq 5 -> t+5.366s seq 7; missing [6]
- node 7: t+5.366s seq 7 -> t+5.771s seq 9; missing [8]
- node 7: t+5.771s seq 9 -> t+6.163s seq 11; missing [10]
- node 7: t+6.163s seq 11 -> t+6.573s seq 13; missing [12]
- node 7: t+6.573s seq 13 -> t+6.964s seq 15; missing [14]
- node 7: t+6.964s seq 15 -> t+7.371s seq 17; missing [16]
- node 7: t+7.371s seq 17 -> t+7.762s seq 19; missing [18]
- node 7: t+7.762s seq 19 -> t+8.167s seq 21; missing [20]
- node 7: t+8.167s seq 21 -> t+8.572s seq 23; missing [22]
- node 7: t+8.572s seq 23 -> t+8.963s seq 25; missing [24]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 725
- scanner_event: 162
- inter_gc_status: 99
- telemetry_rebind_event: 58
- assignment_event: 37
- bind_progress_event: 34
- assignments: 10
- command: 9
- command_ack: 9
- bench_marker: 7
- search_event: 7
- drone_debug_status: 6
- drone_link_status: 6
- assignment_timing_hint: 6
- drone_live_status: 3
- drone_debug_event: 3
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
