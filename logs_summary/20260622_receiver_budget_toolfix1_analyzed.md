# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_toolfix1.jsonl`
- Parsed records: 3089
- Approx duration: 171.8s

## Commands
- Sent commands: 40
- ACKs: 40 (0 rejected)
- Derived ACK latency: min 22 ms, max 1327 ms, avg 212 ms
- Inter-GC queued command events: 2
- t+140.892s ACK drone/drone get_status accepted: -
- t+144.103s ACK drone/drone get_status accepted: -
- t+147.346s ACK drone/drone get_status accepted: -
- t+150.568s ACK drone/drone get_status accepted: -
- t+153.803s ACK drone/drone get_status accepted: -
- t+157.055s ACK drone/drone get_status accepted: -
- t+160.269s ACK drone/drone get_status accepted: -
- t+163.533s ACK drone/drone get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 112
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
- Search events: 20
- Bind progress events: 60
- Assignment events: 66
- Assignment event counts: telemetry_period_observed=9, post_bind_first_telemetry=9, telemetry_period_locked=9, join_request_received=6, silence_sent=6, assign_sent=6, join_ack_received=6, post_bind_acquire_started=6, assign_created=3, assign_reused=3, telemetry_period_rejected=3
- Auto shared RX: starts=2, active_ticks=0, joins=1, completes=0
- Auto shared RX scanner events: 1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=7, completes=2, oocr_deferred=0
- Empty-assignment shared RX observed: t+27.690s to t+73.365s
- Empty-assignment shared RX complete reasons: enrollment_window_complete, enrollment_window_complete
- t+81.810s node 6: timing - telemetry_period_rejected
- t+82.039s node 6: complete - telemetry_period_locked
- t+166.073s node 7: quiet - join_request_received
- t+166.146s node 7: quiet - assign_reused
- t+166.146s node 7: assign - silence_sent
- t+166.157s node 7: ack - assign_sent
- t+166.157s node 7: timing - telemetry_period_observed
- t+166.169s node 7: telemetry_bind - telemetry_live
- t+166.240s node 7: telemetry_bind - assignment_completed
- t+166.379s node 7: timing - telemetry_period_rejected
- t+166.577s node 7: timing - telemetry_period_rejected
- t+166.898s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=11, first_telemetry=18, timeouts=0
- node 3; ACK->telemetry -36.074s; acquire->telemetry -36.074s
- node 6; ACK->telemetry -42.315s; acquire->telemetry -42.315s
- node 7; ACK->telemetry -30.812s; acquire->telemetry -30.812s

## Drone Debug
- Drone JOIN events: 6
- JOIN event counts: join_start_shared_channel=3, join_backoff=3
- JOIN backoff kinds: first_fast=3
- Drone debug events/status rows: 46
- Drone telemetry rows: 1083
- t+128.247s node 7: drone_debug_status wait_assignment
- t+131.459s node 7: drone_debug_status backoff
- t+134.624s node 7: drone_debug_status wait_assignment
- t+137.849s node 7: drone_debug_status backoff
- t+140.892s node 7: drone_debug_status wait_assignment
- t+144.103s node 7: drone_debug_status backoff
- t+147.346s node 7: drone_debug_status wait_assignment
- t+150.568s node 7: drone_debug_status backoff
- t+153.803s node 7: drone_debug_status backoff
- t+157.055s node 7: drone_debug_status wait_assignment
- t+160.270s node 7: drone_debug_status backoff
- t+163.533s node 7: drone_debug_status wait_assignment

## Short-Loss Guard
- Telemetry rebind events: 65
- Short-loss event counts: short_loss_guard_started=3
- Recent short-loss events: t+48.073s node 3 short_loss_guard_started miss=1 gap=-; t+68.582s node 6 short_loss_guard_started miss=1 gap=-; t+87.561s node 7 short_loss_guard_started miss=1 gap=-

## Owed-Packet Fairness
- Fairness event counts: rx_candidate_skipped=175, owed_rx_selected=174, owed_service_selected=174, owed_rx_cleared=167, owed_service_cleared=167, owed_rx_missed=4
- Scheduler-caused skips by node: 3=45, 6=59, 7=71
- Owed selections by node: 3=42, 6=60, 7=72
- Owed listens that still missed by node: 3=2, 6=2
- Max consecutive scheduler skips observed: 2
- Recent fairness events: t+171.357s node 3 rx_candidate_skipped selected=7 owed=1 skips=1; t+171.357s node 7 owed_rx_cleared owed=1 skips=1; t+171.357s node 7 owed_service_cleared owed=1 skips=1; t+171.383s node 3 owed_rx_selected selected=3 owed=1 skips=1; t+171.548s node 3 owed_service_selected selected=3 owed=1 skips=1; t+171.548s node 6 rx_candidate_skipped selected=3 owed=1 skips=1; t+171.559s node 3 owed_rx_cleared owed=1 skips=1; t+171.559s node 3 owed_service_cleared owed=1 skips=1; t+171.586s node 6 owed_rx_selected selected=6 owed=1 skips=1; t+171.788s node 6 owed_service_selected selected=6 owed=1 skips=1

## Multi-Drone Broken-Link Markers
- Pass: 3/3
| Target | Loss cycles | Pass | Restart -> telemetry ms | Join ACK -> telemetry ms | Failures |
|---:|---:|---|---:|---:|---|
| 3 | 9 | yes | 6936.1 | -1670.6 | - |
| 6 | 9 | yes | 8054.5 | 49.6 | - |
| 7 | 9 | yes | 72999.9 | -32.9 | - |

## Receiver Budget
- Events: owed_service_selected=174, owed_service_cleared=167, recovery_budget_denied=126, healthy_service_protected=126
- Recovery denials by reason: healthy_service_deadline_risk=126
- Recent denied recovery:
  - t+94.817s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+94.978s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+95.217s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+95.364s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+95.618s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+95.768s target=7 protected=6 reason=healthy_service_deadline_risk
  - t+96.018s target=7 protected=3 reason=healthy_service_deadline_risk
  - t+96.189s target=7 protected=6 reason=healthy_service_deadline_risk

## Telemetry Coverage
- Latest status at t+25.788s: mode `telemetry_first`
- Assigned packets received: 105
- Assigned RX coverage: 100%
- Sequence gap events: 102
- Missing sequence IDs: 204
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
- Fairness skips: 60
- Owed selections: 60
- Owed misses: 0
- Max scheduler skips: 1
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 459
- node 3: t+4.875s seq 135 -> t+5.603s seq 138; missing [136, 137]
- node 3: t+5.603s seq 138 -> t+6.036s seq 141; missing [139, 140]
- node 3: t+6.036s seq 141 -> t+6.805s seq 144; missing [142, 143]
- node 3: t+6.805s seq 144 -> t+7.248s seq 147; missing [145, 146]
- node 3: t+7.248s seq 147 -> t+7.835s seq 150; missing [148, 149]
- node 3: t+7.835s seq 150 -> t+8.445s seq 153; missing [151, 152]
- node 3: t+8.445s seq 153 -> t+9.037s seq 156; missing [154, 155]
- node 3: t+9.037s seq 156 -> t+9.810s seq 159; missing [157, 158]
- node 3: t+9.810s seq 159 -> t+10.253s seq 162; missing [160, 161]
- node 3: t+10.253s seq 162 -> t+10.836s seq 165; missing [163, 164]
- node 3: t+10.836s seq 165 -> t+11.445s seq 168; missing [166, 167]
- node 3: t+11.445s seq 168 -> t+12.035s seq 171; missing [169, 170]

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 1318
- drone_telemetry: 1083
- inter_gc_status: 112
- assignment_event: 66
- telemetry_rebind_event: 65
- bind_progress_event: 60
- bench_marker: 43
- command: 40
- command_ack: 40
- drone_debug_status: 37
- drone_live_status: 28
- search_event: 20
- assignments: 19
- drone_link_status: 9
- assignment_timing_hint: 9
- drone_debug_event: 9
- drone_join_event: 6
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
