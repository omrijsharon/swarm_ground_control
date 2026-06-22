# Live Debug Log Summary

- Source: `logs_summary\rf_loss_short_guard_post_final_ota_smoke_20260620.jsonl`
- Parsed records: 639
- Approx duration: 44.9s

## Commands
- Sent commands: 25
- ACKs: 22 (3 rejected)
- Pending/no ACK command IDs: rf-bench-magc-status-0004, rf-bench-magc-status-0005, rf-bench-magc-status-0006
- t+34.836s ACK drone/drone get_status accepted: -
- t+34.853s ACK telegc/telemetry_ground_control get_status accepted: -
- t+35.503s ACK magc/telemetry_ground_control start_search rejected: inter_gc_forward_failed
- t+35.586s ACK drone/drone debug_restart_join accepted: -
- t+38.367s ACK drone/drone debug_send_join_request accepted: -
- t+40.026s ACK telegc/telemetry_ground_control get_status accepted: -
- t+40.026s ACK drone/drone get_status accepted: -
- t+42.918s ACK drone/drone debug_simulate_rf_loss accepted: -

## Bind And Search
- Search events: 17
- Bind progress events: 10
- Assignment events: 13
- Assignment event counts: telemetry_period_rejected=4, telemetry_period_observed=2, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, post_bind_acquire_started=1, post_bind_first_telemetry=1, telemetry_period_locked=1
- Auto shared RX: starts=0, active_ticks=14, joins=0, completes=2
- Auto shared RX scanner events: 4
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout
- t+38.471s node 7: quiet - join_request_received
- t+39.511s node 7: assign - silence_sent
- t+41.894s node 7: timing - telemetry_period_observed
- t+42.094s node 7: timing - telemetry_period_rejected
- t+42.263s node 7: timing - telemetry_period_rejected
- t+42.313s node 7: timing - telemetry_period_rejected
- t+42.604s node 7: timing - telemetry_period_observed
- t+42.617s node 7: telemetry_bind - telemetry_live
- t+42.719s node 7: timing - telemetry_period_rejected
- t+43.022s node 7: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 5
- Channel scan event counts: background_oocr_slice=5
- CAD samples: rows=5, validated=1, rejected=4, one_hit_rejected=4
- OOCR events: 2
- OOCR event counts: candidate_failed=1, background_oocr_started=1
- Failed candidate confirmations: 1

## Post-Bind Telemetry
- Post-bind acquire events: starts=1, first_telemetry=2, timeouts=0
- node 7; ACK->telemetry 0.212s; drone assigned->telemetry 0.546s; acquire->telemetry 0.212s; drone first TX->telemetry 0.494s

## Drone Debug
- Drone JOIN events: 21
- JOIN event counts: join_backoff=6, join_request_sent=4, join_start_shared_channel=3, post_assign_burst_tx=2, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, first_assigned_telemetry_tx=1, msp_fixed_slot_learned=1
- JOIN backoff kinds: first_fast=3, retry_normal=3
- Drone debug events/status rows: 20
- Drone telemetry rows: 14
- Simulated RF-loss packets: 2 sequenceIds=14, 15
- t+29.836s node 7: drone_debug_status backoff
- t+35.043s node 7: drone_debug_status backoff
- t+35.380s node 7: drone_debug_event join_hold_enabled
- t+35.586s node 7: drone_debug_event join_runtime_reset
- t+35.586s node 7: drone_debug_status backoff
- t+38.367s node 7: drone_debug_event forced_join_request_sent
- t+38.574s node 7: drone_debug_status wait_assignment
- t+40.234s node 7: drone_debug_status wait_assignment
- t+42.918s node 7: drone_debug_event telemetry_rf_loss_started
- t+43.127s node 7: drone_debug_status assigned_telemetry
- t+43.127s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+43.127s node 7: drone_debug_event telemetry_rf_loss_simulated

## Short-Loss Guard
- Telemetry rebind events: 14
- No short-loss guard events found.

## RF Loss Bench Trials
| Lost packets | Trials | Pass | Avg pre-sim missing | Avg post-sim extra | Avg missing count | Avg extra missing | Max extra missing | Link events | Rebind trials |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2 | 1 | 1/1 | 5.0 | 0.0 | 7.0 | +5.0 | +5.0 | 0 | 1/1 |

## Telemetry Sequence Gaps
- Observed sequence gaps: 8
- node 7: t+42.085s seq 0 -> t+42.251s seq 4; missing [1, 2, 3]
- node 7: t+42.251s seq 4 -> t+42.313s seq 6; missing [5]
- node 7: t+42.703s seq 8 -> t+42.929s seq 11; missing [9, 10]
- node 7: t+43.223s seq 12 -> t+43.464s seq 16; missing [13, 14, 15]
- node 7: t+43.464s seq 16 -> t+43.614s seq 18; missing [17]
- node 7: t+43.614s seq 18 -> t+43.824s seq 20; missing [19]
- node 7: t+44.054s seq 21 -> t+44.503s seq 23; missing [22]
- node 7: t+44.503s seq 23 -> t+44.711s seq 29; missing [24, 25, 26, 27, 28]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- scanner_event: 187
- command: 25
- command_ack: 22
- drone_join_event: 21
- search_event: 17
- bench_marker: 16
- telemetry_rebind_event: 14
- drone_telemetry: 14
- assignment_event: 13
- inter_gc_status: 11
- drone_debug_status: 11
- drone_live_status: 10
- bind_progress_event: 10
- drone_debug_event: 9
- gc_status: 6
- assignments: 5
- channel_scan_event: 5
- drone_fc_status: 4
- drone_link_status: 3
- orphan_recovery_event: 2
