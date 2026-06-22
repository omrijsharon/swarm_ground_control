# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_transport_guard1.jsonl`
- Parsed records: 1915
- Approx duration: 135.5s

## Commands
- Sent commands: 24
- ACKs: 24 (0 rejected)
- Derived ACK latency: min 28 ms, max 1261 ms, avg 170 ms
- Inter-GC queued command events: 2
- t+98.122s ACK drone/drone get_status accepted: -
- t+101.220s ACK drone/drone get_status accepted: -
- t+107.139s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+113.249s ACK drone/drone debug_restart_join accepted: -
- t+117.689s ACK drone/drone get_status accepted: -
- t+120.924s ACK drone/drone get_status accepted: -
- t+124.080s ACK drone/drone get_status accepted: -
- t+127.238s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 68
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
- Search events: 24
- Bind progress events: 56
- Assignment events: 62
- Assignment event counts: telemetry_period_observed=9, telemetry_period_locked=9, join_request_received=6, post_bind_first_telemetry=6, silence_sent=6, assign_sent=6, join_ack_received=6, post_bind_acquire_started=6, assign_created=3, assign_reused=3, telemetry_period_rejected=2
- Auto shared RX: starts=2, active_ticks=0, joins=2, completes=2
- Auto shared RX scanner events: 2
- Auto shared RX complete reasons: join_handled, join_handled
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=7, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+25.964s to t+90.608s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+101.697s node 6: telemetry_bind - assignment_completed
- t+101.781s node 6: timing - telemetry_period_observed
- t+101.794s node 6: telemetry_bind - telemetry_live
- t+102.010s node 6: complete - telemetry_period_locked
- t+129.824s node 7: quiet - join_request_received
- t+129.874s node 7: quiet - assign_reused
- t+129.888s node 7: timing - telemetry_period_observed
- t+129.902s node 7: telemetry_bind - telemetry_live
- t+129.954s node 7: assign - silence_sent
- t+129.954s node 7: ack - assign_sent
- t+130.014s node 7: telemetry_bind - assignment_completed
- t+130.111s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=12, first_telemetry=12, timeouts=0
- node 3; ACK->telemetry -52.704s; acquire->telemetry -52.816s
- node 6; ACK->telemetry -60.871s; acquire->telemetry -60.871s
- node 7; ACK->telemetry -48.357s; acquire->telemetry -48.357s

## Drone Debug
- Drone JOIN events: 6
- JOIN event counts: join_start_shared_channel=3, join_backoff=3
- JOIN backoff kinds: first_fast=3
- Drone debug events/status rows: 30
- Drone telemetry rows: 639
- t+90.687s node 6: drone_debug_status backoff
- t+95.016s node 6: drone_debug_status wait_assignment
- t+98.122s node 6: drone_debug_status wait_assignment
- t+101.220s node 6: drone_debug_status assigned_telemetry
- t+107.139s node 7: drone_debug_event telemetry_rf_loss_started
- t+107.140s node 7: drone_debug_status assigned_telemetry
- t+113.249s node 7: drone_debug_event join_runtime_reset
- t+113.249s node 7: drone_debug_status backoff
- t+117.689s node 7: drone_debug_status wait_assignment
- t+120.924s node 7: drone_debug_status wait_assignment
- t+124.081s node 7: drone_debug_status wait_assignment
- t+127.239s node 7: drone_debug_status wait_assignment

## Short-Loss Guard
- Telemetry rebind events: 16
- Short-loss event counts: short_loss_guard_started=3
- Recent short-loss events: t+64.886s node 3 short_loss_guard_started miss=1 gap=-; t+85.025s node 6 short_loss_guard_started miss=1 gap=-; t+107.869s node 7 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=59, owed_rx_selected=59, owed_service_selected=59, owed_rx_cleared=56, owed_service_cleared=56, owed_rx_missed=2
- Scheduler-caused skips by node: 3=21, 6=16, 7=22
- Owed selections by node: 3=21, 6=15, 7=23
- Owed listens that still missed by node: 7=2
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+107.574s node 6 owed_rx_cleared owed=1 skips=1; t+107.588s node 6 owed_service_cleared owed=1 skips=1; t+107.600s node 7 owed_rx_selected selected=7 owed=1 skips=1; t+107.811s node 7 owed_service_selected selected=7 owed=1 skips=1; t+107.869s node 7 owed_rx_missed owed=1 skips=1; t+130.214s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+130.227s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+130.372s node 6 owed_service_selected selected=6 owed=1 skips=1; t+130.372s node 6 owed_rx_cleared owed=1 skips=1; t+130.385s node 6 owed_service_cleared owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 3/3
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 6917.7 | -1564.9 | - |
| 6 | 9 | yes | 11120.3 | 110.5 | - |
| 7 | 9 | yes | 16653.4 | -53.7 | - |

## Receiver Budget
- Events: recovery_budget_denied=130, healthy_service_protected=130, owed_service_selected=59, owed_service_cleared=56, recovery_budget_used=8
- Recovery denials by reason: healthy_service_deadline_risk=130
- Recent denied recovery:
  - t+114.430s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+114.597s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+114.828s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+115.011s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+115.236s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+115.393s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+115.630s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+115.824s target=7 protected=3 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.363s: mode `telemetry_first`
- Assigned packets received: 164
- Assigned RX coverage: 99%
- Sequence gap events: 160
- Missing sequence IDs: 164
- Max sequence gap: 3
- Assigned slot misses: 1
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 14%
- Receiver overloaded: False
- Recovery budget used: 8
- Recovery budget denied: 1
- Healthy service protected: 1
- Owed RX active: False node=0 count=0
- Fairness skips: 1
- Owed selections: 1
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 528
- node 7: t+3.482s seq 101 -> t+4.047s seq 104; missing [102, 103]
- node 7: t+4.047s seq 104 -> t+4.448s seq 106; missing [105]
- node 7: t+4.448s seq 106 -> t+4.920s seq 108; missing [107]
- node 7: t+4.920s seq 108 -> t+5.314s seq 110; missing [109]
- node 7: t+5.314s seq 110 -> t+5.723s seq 112; missing [111]
- node 7: t+5.723s seq 112 -> t+6.241s seq 114; missing [113]
- node 7: t+6.241s seq 114 -> t+6.649s seq 116; missing [115]
- node 7: t+6.649s seq 116 -> t+7.039s seq 118; missing [117]
- node 7: t+7.039s seq 118 -> t+7.447s seq 120; missing [119]
- node 7: t+7.447s seq 120 -> t+7.854s seq 122; missing [121]
- node 7: t+7.854s seq 122 -> t+8.151s seq 124; missing [123]
- node 7: t+8.151s seq 124 -> t+8.529s seq 126; missing [125]

## State Flicker
- Node 3: 1 rapid state transitions: t+3.435s offline->online

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 766
- drone_telemetry: 639
- inter_gc_status: 68
- assignment_event: 62
- bind_progress_event: 56
- bench_marker: 27
- command: 24
- command_ack: 24
- search_event: 24
- drone_debug_status: 21
- assignments: 20
- telemetry_rebind_event: 16
- drone_live_status: 12
- drone_link_status: 10
- assignment_timing_hint: 9
- drone_debug_event: 9
- drone_join_event: 6
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
