# Live Debug Log Summary

- Source: `logs_summary\receiver_budget_3node_stress_slice260_20260622.jsonl`
- Parsed records: 3870
- Approx duration: 219.8s

## Commands
- Sent commands: 18
- ACKs: 18 (0 rejected)
- Derived ACK latency: min 22 ms, max 893 ms, avg 180 ms
- Inter-GC queued command events: 8
- t+72.580s ACK magc/magic_ground_control cancel_search accepted: -
- t+74.012s ACK magc/magic_ground_control start_search accepted: -
- t+75.165s ACK magc/magic_ground_control cancel_search accepted: -
- t+76.120s ACK magc/magic_ground_control start_search accepted: -
- t+77.366s ACK magc/magic_ground_control cancel_search accepted: -
- t+82.233s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+118.416s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+124.477s ACK drone/drone debug_restart_join accepted: -

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
- Search events: 32
- Bind progress events: 78
- Assignment events: 91
- Assignment event counts: telemetry_period_observed=18, post_bind_first_telemetry=17, telemetry_period_locked=11, silence_sent=8, assign_sent=7, join_request_received=5, post_bind_acquire_timeout=5, join_ack_received=4, post_bind_acquire_started=4, assign_created=3, join_ack_timeout=3, telemetry_period_rejected=3, assign_reused=2, orphan_assignment_recovered=1
- Operator shared/discovery RX: starts=2, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+74.364s to t+76.346s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=18
- Auto shared RX scanner events: 1
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=4, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+10.976s to t+48.155s
- t+79.467s node 7: telemetry_bind - telemetry_live
- t+79.559s node 6: timing - telemetry_period_rejected
- t+79.773s node 3: complete - telemetry_period_locked
- t+82.455s node 7: complete - telemetry_period_locked
- t+84.322s node 2: timing - telemetry_period_observed
- t+203.558s node 6: timing - telemetry_period_rejected
- t+203.957s node 6: complete - telemetry_period_locked
- t+206.537s node 3: quiet - join_request_received
- t+206.537s node 3: quiet - assign_reused
- t+206.582s node 3: assign - silence_sent
- t+206.582s node 3: ack - assign_sent
- t+206.746s node 3: telemetry_bind - assignment_completed

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 3
- OOCR event counts: confirmed_drone=1, assignment_recovered=1, oocr_recovered_from_cad=1
- Reset/clear to confirmed orphan telemetry: 67.837s

## Post-Bind Telemetry
- Post-bind acquire events: starts=7, first_telemetry=34, timeouts=10
- node 2
- node 3; ACK->telemetry -37.625s; acquire->telemetry -37.625s; timeouts=8
- node 6; ACK->telemetry -15.544s; acquire->telemetry -15.544s
- node 7; ACK->telemetry 22.526s; acquire->telemetry 22.526s; timeouts=2

## Drone Debug
- Drone JOIN events: 2
- JOIN event counts: join_start_shared_channel=1, join_backoff=1
- JOIN backoff kinds: first_fast=1
- Drone debug events/status rows: 15
- Drone telemetry rows: 998
- t+10.918s node 3: drone_debug_event reboot_scheduled
- t+10.920s node 3: drone_debug_status assigned_telemetry
- t+10.968s node 6: drone_debug_event reboot_scheduled
- t+10.968s node 6: drone_debug_status assigned_telemetry
- t+11.005s node 7: drone_debug_event reboot_scheduled
- t+11.005s node 7: drone_debug_status backoff
- t+82.233s node 3: drone_debug_event telemetry_rf_loss_started
- t+82.233s node 3: drone_debug_status assigned_telemetry
- t+118.415s node 3: drone_debug_event telemetry_rf_loss_started
- t+118.416s node 3: drone_debug_status assigned_telemetry
- t+124.477s node 3: drone_debug_event join_runtime_reset
- t+124.477s node 3: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 69
- Short-loss event counts: short_loss_guard_started=8, short_loss_recovered=2
- Short-loss recovered observed gaps: count=2, avg=7.5, max=8
- Recent short-loss events: t+7.698s node 3 short_loss_recovered miss=1 gap=8; t+8.103s node 3 short_loss_guard_started miss=1 gap=-; t+9.497s node 3 short_loss_recovered miss=1 gap=7; t+10.108s node 3 short_loss_guard_started miss=1 gap=-; t+69.764s node 6 short_loss_guard_started miss=1 gap=-; t+77.173s node 6 short_loss_guard_started miss=1 gap=-; t+82.386s node 3 short_loss_guard_started miss=1 gap=-; t+203.073s node 7 short_loss_guard_started miss=1 gap=-

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 10969 | no | node_3_affected_by_bind,node_6_affected_by_bind,node_7_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 0/1
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | no | - | non_target_6_not_stable,target_not_fresh_after_rf_loss |

## Multi-Drone Broken-Link Markers
- Pass: 0/1
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | no | - | - | target_not_online_before_rebind_timeout,non_target_6_not_stable,non_target_7_not_stable |

## Receiver Budget
- Events: recovery_budget_denied=910, healthy_service_protected=910, recovery_budget_used=129
- Recovery denials by reason: healthy_service_window_too_close=720, overlaps_healthy_service_window=190
- Recent denied recovery:
  - t+218.345s target=2 protected=6 reason=healthy_service_window_too_close
  - t+218.440s target=2 protected=6 reason=healthy_service_window_too_close
  - t+218.690s target=2 protected=6 reason=healthy_service_window_too_close
  - t+218.766s target=3 protected=6 reason=overlaps_healthy_service_window
  - t+218.966s target=2 protected=6 reason=healthy_service_window_too_close
  - t+219.348s target=2 protected=6 reason=healthy_service_window_too_close
  - t+219.361s target=3 protected=6 reason=healthy_service_window_too_close
  - t+219.563s target=2 protected=6 reason=healthy_service_window_too_close

## Telemetry Coverage
- Latest status at t+10.326s: mode `telemetry_first`
- Assigned packets received: 11
- Assigned RX coverage: 37%
- Sequence gap events: 4
- Missing sequence IDs: 22
- Max sequence gap: 8
- Assigned slot misses: 18
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 9%
- Receiver overloaded: False
- Recovery budget used: 23
- Recovery budget denied: 9
- Healthy service protected: 9
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 31
- node 6: t+3.988s seq 62 -> t+4.905s seq 66; missing [63, 64, 65]
- node 6: t+4.905s seq 66 -> t+19.198s seq 3; missing [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, +17 more]
- node 6: t+69.563s seq 255 -> t+71.811s seq 10; missing [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
- node 6: t+71.811s seq 10 -> t+72.384s seq 13; missing [11, 12]
- node 6: t+72.384s seq 13 -> t+74.198s seq 22; missing [14, 15, 16, 17, 18, 19, 20, 21]
- node 6: t+74.198s seq 22 -> t+74.605s seq 24; missing [23]
- node 6: t+75.179s seq 27 -> t+76.384s seq 33; missing [28, 29, 30, 31, 32]
- node 6: t+76.384s seq 33 -> t+77.100s seq 36; missing [34, 35]
- node 6: t+77.100s seq 36 -> t+78.980s seq 46; missing [37, 38, 39, 40, 41, 42, 43, 44, 45]
- node 6: t+78.980s seq 46 -> t+79.582s seq 49; missing [47, 48]
- node 6: t+79.582s seq 49 -> t+203.571s seq 157; missing [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, +17 more]
- node 6: t+203.571s seq 157 -> t+203.998s seq 159; missing [158]

## State Flicker
- Node 6: 1 rapid state transitions: t+203.571s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 2227
- drone_telemetry: 998
- assignment_event: 91
- inter_gc_status: 83
- bind_progress_event: 78
- telemetry_rebind_event: 69
- assignments: 39
- search_event: 32
- drone_link_status: 26
- bench_marker: 19
- command: 18
- command_ack: 18
- assignment_timing_hint: 11
- drone_debug_status: 9
- inter_gc_command_queued: 8
- drone_debug_event: 6
- drone_live_status: 3
- orphan_recovery_event: 3
- session_event: 2
- drone_join_event: 2
