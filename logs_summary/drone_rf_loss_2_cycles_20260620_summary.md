# Live Debug Log Summary

- Source: `logs_summary\drone_rf_loss_2_cycles_20260620.jsonl`
- Parsed records: 840
- Approx duration: 65.1s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- t+45.038s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+45.055s ACK drone/drone get_status accepted: -

## Bind And Search
- Search events: 11
- Bind progress events: 10
- Assignment events: 13
- Assignment event counts: telemetry_period_observed=3, post_bind_first_telemetry=2, telemetry_period_locked=2, post_bind_acquire_timeout=1, join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, telemetry_period_rejected=1
- Auto shared RX: starts=0, active_ticks=9, joins=0, completes=1
- Auto shared RX complete reasons: auto_shared_rx_timeout
- t+23.422s node 7: quiet - join_request_received
- t+24.449s node 7: assign - silence_sent
- t+26.837s node 7: timing - telemetry_period_observed
- t+26.857s node 7: telemetry_bind - telemetry_live
- t+27.067s node 7: timing - telemetry_period_observed
- t+27.087s node 7: telemetry_bind - telemetry_live
- t+27.916s node 7: complete - telemetry_period_locked
- t+28.908s node 7: timing - telemetry_period_observed
- t+29.127s node 7: timing - telemetry_period_rejected
- t+29.159s node 7: complete - telemetry_period_locked

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=4, timeouts=2
- node 7; ACK->telemetry 0.137s; drone assigned->telemetry 0.387s; drone first TX->telemetry 0.336s; timeouts=2

## Drone Debug
- Drone JOIN events: 23
- JOIN event counts: join_backoff=6, join_request_lbt_blocked_or_tx_failed=3, join_request_sent=3, silence_received=2, post_assign_burst_tx=2, join_start_shared_channel=1, join_assign_ignored=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, first_assigned_telemetry_tx=1, msp_fixed_slot_learned=1
- JOIN backoff kinds: first_fast=3, retry_normal=3
- Drone debug events/status rows: 5
- Drone telemetry rows: 362
- t+25.684s node 7: drone_join_event join_assign_accepted
- t+26.470s node 7: drone_join_event join_ack_sent
- t+26.470s node 7: drone_join_event assigned_telemetry_started
- t+26.521s node 7: drone_join_event first_assigned_telemetry_tx
- t+26.714s node 7: drone_join_event post_assign_burst_tx
- t+26.916s node 7: drone_join_event post_assign_burst_tx
- t+26.916s node 7: drone_join_event msp_fixed_slot_learned
- t+45.038s node 7: drone_debug_event telemetry_rf_loss_started
- t+45.055s node 7: drone_debug_status assigned_telemetry
- t+45.098s node 7: drone_debug_status assigned_telemetry
- t+45.305s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+45.305s node 7: drone_debug_event telemetry_rf_loss_simulated

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 362
- scanner_event: 46
- drone_live_status: 39
- drone_fc_status: 39
- drone_join_event: 23
- channel_scan_event: 19
- assignment_event: 13
- search_event: 11
- bind_progress_event: 10
- orphan_recovery_event: 8
- assignments: 4
- drone_link_status: 4
- inter_gc_status: 4
- drone_debug_event: 3
- telemetry_rebind_event: 2
- assignment_timing_hint: 2
- command: 2
- command_ack: 2
- drone_debug_status: 2
