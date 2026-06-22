# Live Debug Log Summary

- Source: `logs_summary\drone_drop_2_cycles_assigned_20260620.jsonl`
- Parsed records: 855
- Approx duration: 65.0s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- t+45.027s ACK drone/drone debug_drop_telemetry accepted: -
- t+45.038s ACK drone/drone get_status accepted: -

## Bind And Search
- Search events: 18
- Bind progress events: 13
- Assignment events: 17
- Assignment event counts: telemetry_period_rejected=4, telemetry_period_observed=3, post_bind_acquire_timeout=2, post_bind_first_telemetry=2, telemetry_period_locked=2, join_ack_timeout=1, join_request_received=1, silence_sent=1, join_ack_received=1
- Auto shared RX: starts=0, active_ticks=14, joins=1, completes=2
- Auto shared RX scanner events: 14
- Auto shared RX complete reasons: auto_shared_rx_timeout, auto_shared_rx_timeout
- t+33.563s node 7: assign - silence_sent
- t+35.817s node 7: timing - telemetry_period_observed
- t+35.827s node 7: telemetry_bind - telemetry_live
- t+35.999s node 7: timing - telemetry_period_rejected
- t+36.524s node 7: timing - telemetry_period_observed
- t+36.534s node 7: telemetry_bind - telemetry_live
- t+36.716s node 7: timing - telemetry_period_rejected
- t+36.727s node 7: timing - telemetry_period_rejected
- t+36.848s node 7: complete - telemetry_period_locked
- t+38.418s node 7: timing - telemetry_period_observed
- t+38.527s node 7: timing - telemetry_period_rejected
- t+38.652s node 7: complete - telemetry_period_locked

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=4
- node 7; ACK->telemetry 0.194s; drone assigned->telemetry 0.434s; drone first TX->telemetry 0.383s; timeouts=4

## Drone Debug
- Drone JOIN events: 26
- JOIN event counts: join_backoff=7, join_request_sent=4, join_request_lbt_blocked_or_tx_failed=3, join_assign_ignored=2, silence_received=2, post_assign_burst_tx=2, join_start_shared_channel=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, first_assigned_telemetry_tx=1, msp_fixed_slot_learned=1
- JOIN backoff kinds: retry_normal=4, first_fast=3
- Drone debug events/status rows: 5
- Drone telemetry rows: 268
- t+34.656s node 7: drone_join_event join_assign_accepted
- t+35.555s node 7: drone_join_event join_ack_sent
- t+35.555s node 7: drone_join_event assigned_telemetry_started
- t+35.606s node 7: drone_join_event first_assigned_telemetry_tx
- t+35.795s node 7: drone_join_event post_assign_burst_tx
- t+35.999s node 7: drone_join_event post_assign_burst_tx
- t+35.999s node 7: drone_join_event msp_fixed_slot_learned
- t+45.027s node 7: drone_debug_event telemetry_drop_started
- t+45.038s node 7: drone_debug_status assigned_telemetry
- t+45.261s node 7: drone_debug_status assigned_telemetry
- t+45.465s node 7: drone_debug_event telemetry_cycle_dropped
- t+45.465s node 7: drone_debug_event telemetry_cycle_dropped

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 268
- scanner_event: 148
- drone_live_status: 30
- drone_fc_status: 30
- drone_join_event: 26
- channel_scan_event: 20
- search_event: 18
- assignment_event: 17
- bind_progress_event: 13
- telemetry_rebind_event: 8
- inter_gc_status: 6
- orphan_recovery_event: 6
- drone_link_status: 5
- assignments: 4
- drone_debug_event: 3
- assignment_timing_hint: 2
- command: 2
- command_ack: 2
- drone_debug_status: 2
