# Live Debug Log Summary

- Source: `logs_summary\non_disruptive_bind_3node_full_stress_after_linkstate_fix_20260622.jsonl`
- Parsed records: 7004
- Approx duration: 478.2s

## Commands
- Sent commands: 53
- ACKs: 53 (0 rejected)
- Derived ACK latency: min 25 ms, max 408 ms, avg 99 ms
- Inter-GC queued command events: 12
- t+388.884s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+400.408s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+413.738s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+425.291s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+441.785s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+447.847s ACK drone/drone debug_restart_join accepted: -
- t+462.732s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+468.825s ACK drone/drone debug_restart_join accepted: -

## Inter-GC Transport
- Inter-GC status rows: 110
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Event compacted: 0
- Malformed RX JSON payload lines: 1
- Suspicious JSON fragment lines: 0
- Malformed samples: t+51.949s telegc: {"type":"drone_telemetry","sourceRo,"yaw":216,"yawHeading":216,"yawBiasDeg":0,"yawBiasValid":false,awBiasSamples":0,"cog

## Bind And Search
- Search events: 29
- Bind progress events: 97
- Assignment events: 102
- Assignment event counts: telemetry_period_observed=31, post_bind_first_telemetry=28, telemetry_period_locked=13, join_request_received=5, silence_sent=5, assign_sent=5, join_ack_received=5, post_bind_acquire_started=5, assign_created=3, assign_reused=2
- Operator shared/discovery RX: starts=5, active_ticks=0, completes=0
- Operator shared/discovery RX window observed: t+36.697s to t+44.756s
- JOINs received during operator shared/discovery RX: 0
- Auto shared RX: starts=0, active_ticks=0, joins=0, completes=4
- Auto shared RX scanner events: 4
- Auto shared RX complete reasons: post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending, post_bind_acquire_pending
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=6, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+13.140s to t+49.436s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+458.036s node 3: telemetry_bind - assignment_completed
- t+458.256s node 3: timing - telemetry_period_observed
- t+458.269s node 3: telemetry_bind - telemetry_live
- t+458.516s node 3: complete - telemetry_period_locked
- t+473.687s node 6: quiet - join_request_received
- t+473.708s node 6: quiet - assign_reused
- t+473.708s node 6: assign - silence_sent
- t+473.759s node 6: ack - assign_sent
- t+473.800s node 6: telemetry_bind - assignment_completed
- t+473.814s node 6: timing - telemetry_period_observed
- t+473.827s node 6: telemetry_bind - telemetry_live
- t+474.082s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=10, first_telemetry=56, timeouts=0
- node 3; ACK->telemetry -23.646s; acquire->telemetry -23.646s
- node 6; ACK->telemetry -30.786s; acquire->telemetry -30.786s
- node 7; ACK->telemetry -16.977s; acquire->telemetry -16.978s

## Drone Debug
- Drone JOIN events: 4
- JOIN event counts: join_start_shared_channel=2, join_backoff=2
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 77
- Drone telemetry rows: 3187
- t+413.737s node 6: drone_debug_event telemetry_rf_loss_started
- t+413.738s node 6: drone_debug_status assigned_telemetry
- t+425.291s node 7: drone_debug_event telemetry_rf_loss_started
- t+425.291s node 7: drone_debug_status assigned_telemetry
- t+441.785s node 3: drone_debug_event telemetry_rf_loss_started
- t+441.785s node 3: drone_debug_status assigned_telemetry
- t+447.847s node 3: drone_debug_event join_runtime_reset
- t+447.847s node 3: drone_debug_status backoff
- t+462.732s node 6: drone_debug_event telemetry_rf_loss_started
- t+462.733s node 6: drone_debug_status assigned_telemetry
- t+468.824s node 6: drone_debug_event join_runtime_reset
- t+468.825s node 6: drone_debug_status backoff

## Short-Loss Guard
- Telemetry rebind events: 286
- Short-loss event counts: short_loss_guard_active=125, short_loss_guard_started=33, short_loss_recovered=18, short_loss_guard_expired=14
- Short-loss recovered observed gaps: count=18, avg=14.8, max=63
- Recent short-loss events: t+464.657s node 3 short_loss_guard_active miss=5 gap=-; t+464.911s node 6 short_loss_guard_active miss=3 gap=-; t+465.493s node 3 short_loss_recovered miss=5 gap=21; t+465.789s node 6 short_loss_recovered miss=3 gap=13; t+469.308s node 6 short_loss_guard_started miss=1 gap=-; t+470.453s node 6 short_loss_guard_active miss=2 gap=-; t+474.815s node 6 short_loss_guard_started miss=1 gap=-; t+476.043s node 6 short_loss_recovered miss=1 gap=5

## Owed-Packet Fairness
- Fairness event counts: owed_rx_selected=628, rx_candidate_skipped=607, owed_rx_cleared=592, owed_rx_missed=79
- Scheduler-caused skips by node: 3=466, 6=41, 7=100
- Owed selections by node: 3=494, 6=32, 7=102
- Owed listens that still missed by node: 3=76, 7=3
- Max consecutive scheduler skips observed: 3
- Recent fairness events: t+476.744s node 7 rx_candidate_skipped selected=3 owed=1 skips=1; t+476.935s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+477.035s node 7 owed_rx_cleared owed=1 skips=1; t+477.244s node 7 rx_candidate_skipped selected=3 owed=1 skips=1; t+477.434s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+477.535s node 7 owed_rx_cleared owed=1 skips=1; t+477.745s node 7 rx_candidate_skipped selected=3 owed=1 skips=1; t+477.935s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+477.935s node 7 owed_rx_cleared owed=1 skips=1; t+478.245s node 7 rx_candidate_skipped selected=3 owed=1 skips=1

## Manual Bind Non-Disruption
- Pass: 0/1
| Run | Duration ms | Pass | Failures |
|---:|---:|---|---|
| 1 | 15798.6 | no | node_3_affected_by_bind,node_6_affected_by_bind |

## RF-Loss Only Matrix
- Pass: 29/30
| Target | Cycles | Trial | Pass | Rejoin events | Failures |
|---:|---:|---:|---|---|---|
| 3 | 1 | 1 | yes | - | - |
| 6 | 1 | 1 | yes | - | - |
| 7 | 1 | 1 | yes | - | - |
| 3 | 1 | 2 | yes | - | - |
| 6 | 1 | 2 | yes | - | - |
| 7 | 1 | 2 | yes | - | - |
| 3 | 1 | 3 | yes | - | - |
| 6 | 1 | 3 | yes | - | - |
| 7 | 1 | 3 | yes | - | - |
| 3 | 2 | 1 | yes | - | - |
| 6 | 2 | 1 | yes | - | - |
| 7 | 2 | 1 | yes | - | - |
| 3 | 2 | 2 | yes | - | - |
| 6 | 2 | 2 | yes | - | - |
| 7 | 2 | 2 | yes | - | - |
| 3 | 2 | 3 | yes | - | - |
| 6 | 2 | 3 | yes | - | - |
| 7 | 2 | 3 | yes | - | - |
| 3 | 4 | 1 | yes | - | - |
| 6 | 4 | 1 | yes | - | - |
| 7 | 4 | 1 | yes | - | - |
| 3 | 4 | 2 | yes | - | - |
| 6 | 4 | 2 | yes | - | - |
| 7 | 4 | 2 | yes | - | - |
| 3 | 4 | 3 | yes | - | - |
| 6 | 4 | 3 | yes | - | - |
| 7 | 4 | 3 | yes | - | - |
| 3 | 8 | 1 | yes | - | - |
| 6 | 8 | 1 | yes | - | - |
| 7 | 8 | 1 | no | - | non_target_3_not_stable |

## Multi-Drone Broken-Link Markers
- Pass: 1/2
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 10447.9 | 276.3 | - |
| 6 | 9 | no | 5026.6 | 93.4 | non_target_3_not_stable |

## Telemetry Coverage
- Latest status at t+12.377s: mode `telemetry_first`
- Assigned packets received: 45
- Assigned RX coverage: 81%
- Sequence gap events: 42
- Missing sequence IDs: 50
- Max sequence gap: 5
- Assigned slot misses: 10
- Non-assigned preemptions: 0
- Owed RX active: True node=3 count=1
- Fairness skips: 13
- Owed selections: 13
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 1386
- node 3: t+4.032s seq 191 -> t+5.416s seq 197; missing [192, 193, 194, 195, 196]
- node 3: t+5.416s seq 197 -> t+5.949s seq 199; missing [198]
- node 3: t+5.949s seq 199 -> t+6.449s seq 201; missing [200]
- node 3: t+6.449s seq 201 -> t+6.950s seq 203; missing [202]
- node 3: t+6.950s seq 203 -> t+7.451s seq 205; missing [204]
- node 3: t+7.451s seq 205 -> t+7.952s seq 207; missing [206]
- node 3: t+7.952s seq 207 -> t+8.440s seq 209; missing [208]
- node 3: t+8.440s seq 209 -> t+8.941s seq 211; missing [210]
- node 3: t+8.941s seq 211 -> t+9.441s seq 213; missing [212]
- node 3: t+9.441s seq 213 -> t+9.941s seq 215; missing [214]
- node 3: t+9.941s seq 215 -> t+10.441s seq 217; missing [216]
- node 3: t+10.441s seq 217 -> t+10.940s seq 219; missing [218]

## Transport Findings
- Malformed serial JSON payloads: 1.

## State Flicker
- Node 3: 2 rapid state transitions: t+4.032s offline->online, t+441.526s offline->online
- Node 6: 1 rapid state transitions: t+4.971s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- drone_telemetry: 3187
- scanner_event: 2627
- telemetry_rebind_event: 286
- inter_gc_status: 110
- assignment_event: 102
- bind_progress_event: 97
- bench_marker: 83
- assignments: 62
- command: 53
- command_ack: 53
- drone_debug_status: 40
- drone_debug_event: 37
- drone_link_status: 36
- search_event: 29
- assignment_timing_hint: 13
- gc_status: 12
- inter_gc_command_queued: 12
- drone_join_event: 4
- drone_live_status: 3
- session_event: 2
