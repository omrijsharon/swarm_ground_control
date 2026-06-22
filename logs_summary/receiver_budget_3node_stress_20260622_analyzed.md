# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_3node_stress_20260622.jsonl`
- Parsed records: 3337
- Approx duration: 204.5s

## Commands
- Sent commands: 18
- ACKs: 18 (0 rejected)
- Derived ACK latency: min 21 ms, max 343 ms, avg 122 ms
- Inter-GC queued command events: 8
- t+42.888s ACK magc/magic_ground_control cancel_search accepted: -
- t+43.686s ACK magc/magic_ground_control start_search accepted: -
- t+44.960s ACK magc/magic_ground_control cancel_search accepted: -
- t+45.756s ACK magc/magic_ground_control start_search accepted: -
- t+46.883s ACK magc/magic_ground_control cancel_search accepted: -
- t+66.512s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+102.850s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+108.924s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 92
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
- Search events: 17
- Bind progress events: 71
- Assignment events: 78
- Assignment event counts: telemetry_period_observed=21, post_bind_first_telemetry=21, telemetry_period_locked=6, silence_sent=5, assign_sent=5, join_request_received=4, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, post_bind_acquire_timeout=2, join_ack_timeout=1, telemetry_period_rejected=1, assign_reused=1
- Operator shared/discovery RX: starts=3, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+42.115s to t+46.087s
- JOINs received during operator shared/discovery RX: 0
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+10.945s to t+158.554s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+47.304s node 6: telemetry_bind - telemetry_live
- t+47.562s node 7: timing - telemetry_period_observed
- t+47.576s node 7: telemetry_bind - telemetry_live
- t+47.827s node 3: timing - telemetry_period_observed
- t+47.841s node 3: telemetry_bind - telemetry_live
- t+48.087s node 6: timing - telemetry_period_rejected
- t+48.293s node 7: complete - telemetry_period_locked
- t+114.158s node 3: quiet - join_request_received
- t+114.351s node 3: quiet - assign_reused
- t+114.351s node 3: assign - silence_sent
- t+114.491s node 3: ack - assign_sent
- t+114.671s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 1
- OOCR event counts: confirmed_drone=1
- Reset/clear to confirmed orphan telemetry: 176.809s

## Post-Bind Telemetry
- Post-bind acquire events: starts=7, first_telemetry=42, timeouts=4
- node 3; ACK->telemetry -35.952s; acquire->telemetry -35.952s; timeouts=2
- node 6; ACK->telemetry -15.545s; acquire->telemetry -15.545s
- node 7; ACK->telemetry 10.100s; acquire->telemetry 9.904s; timeouts=2

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 15
- Drone telemetry rows: 948
- t+10.929s node 3: drone_debug_event reboot_scheduled
- t+10.930s node 3: drone_debug_status assigned_telemetry
- t+10.995s node 6: drone_debug_event reboot_scheduled
- t+10.995s node 6: drone_debug_status assigned_telemetry
- t+11.038s node 7: drone_debug_event reboot_scheduled
- t+11.038s node 7: drone_debug_status wait_assignment
- t+66.512s node 3: drone_debug_event telemetry_rf_loss_started
- t+66.513s node 3: drone_debug_status assigned_telemetry
- t+102.850s node 3: drone_debug_event telemetry_rf_loss_started
- t+102.850s node 3: drone_debug_status assigned_telemetry
- t+108.924s node 3: drone_debug_event join_runtime_reset
- t+108.924s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 1
- Short-loss event counts: short_loss_guard_started=1
- Recent short-loss events: t+40.524s node 6 short_loss_guard_started miss=1 gap=-

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 10106.8 | no | node_3_affected_by_bind,node_6_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 0/1
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | no | - | non_target_6_not_stable,target_not_fresh_after_rf_loss |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,non_target_6_not_stable |

## Receiver Budget
- Events: recovery_budget_denied=871, healthy_service_protected=871, recovery_budget_used=31
- Recovery denials by reason: healthy_service_window_too_close=756, overlaps_healthy_service_window=115
- Recent denied recovery:
  - t+203.148s target=6 protected=7 reason=healthy_service_window_too_close
  - t+203.348s target=6 protected=7 reason=healthy_service_window_too_close
  - t+203.551s target=6 protected=7 reason=healthy_service_window_too_close
  - t+203.565s target=6 protected=7 reason=healthy_service_window_too_close
  - t+203.777s target=6 protected=7 reason=healthy_service_window_too_close
  - t+203.968s target=6 protected=7 reason=healthy_service_window_too_close
  - t+204.169s target=6 protected=7 reason=healthy_service_window_too_close
  - t+204.549s target=6 protected=7 reason=healthy_service_window_too_close

## Telemetry Coverage
- Latest status at t+10.357s: mode `telemetry_first`
- Assigned packets received: 33
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
- Recovery budget denied: 31
- Healthy service protected: 31
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 24
- node 6: t+3.727s seq 109 -> t+4.135s seq 111; missing [110]
- node 6: t+10.388s seq 142 -> t+18.905s seq 2; missing [143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, +17 more]
- node 6: t+40.295s seq 109 -> t+41.914s seq 117; missing [110, 111, 112, 113, 114, 115, 116]
- node 6: t+41.914s seq 117 -> t+42.726s seq 121; missing [118, 119, 120]
- node 6: t+42.901s seq 122 -> t+43.308s seq 124; missing [123]
- node 6: t+43.308s seq 124 -> t+44.129s seq 128; missing [125, 126, 127]
- node 6: t+44.129s seq 128 -> t+45.315s seq 134; missing [129, 130, 131, 132, 133]
- node 6: t+45.315s seq 134 -> t+46.113s seq 138; missing [135, 136, 137]
- node 6: t+46.113s seq 138 -> t+46.936s seq 142; missing [139, 140, 141]
- node 6: t+46.936s seq 142 -> t+47.317s seq 144; missing [143]
- node 6: t+47.317s seq 144 -> t+48.111s seq 148; missing [145, 146, 147]
- node 3: t+3.925s seq 141 -> t+41.054s seq 12; missing [142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, +17 more]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1850
- drone_telemetry: 948
- inter_gc_status: 92
- assignment_event: 78
- bind_progress_event: 71
- assignments: 45
- drone_link_status: 21
- bench_marker: 19
- command: 18
- command_ack: 18
- search_event: 17
- drone_debug_status: 9
- inter_gc_command_queued: 8
- assignment_timing_hint: 6
- drone_debug_event: 6
- drone_live_status: 3
- session_event: 2
- drone_join_event: 2
- gc_status: 1
- telemetry_rebind_event: 1
