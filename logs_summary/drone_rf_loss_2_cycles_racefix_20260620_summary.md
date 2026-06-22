# Live Debug Log Summary

- Source: `logs_summary\drone_rf_loss_2_cycles_racefix_20260620.jsonl`
- Parsed records: 877
- Approx duration: 65.2s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- t+45.065s ACK drone/drone debug_simulate_rf_loss accepted: -
- t+45.085s ACK drone/drone get_status accepted: -

## Bind And Search
- Search events: 0
- Bind progress events: 3
- Assignment events: 3
- Assignment event counts: telemetry_period_observed=1, post_bind_first_telemetry=1, telemetry_period_locked=1
- t+14.769s node 7: timing - telemetry_period_observed
- t+14.781s node 7: telemetry_bind - telemetry_live
- t+14.893s node 7: complete - telemetry_period_locked

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=2, timeouts=0
- node 7; drone assigned->telemetry 7.561s; drone first TX->telemetry 7.510s

## Drone Debug
- Drone JOIN events: 13
- JOIN event counts: join_backoff=2, post_assign_burst_tx=2, join_start_shared_channel=1, join_request_lbt_blocked_or_tx_failed=1, join_request_sent=1, silence_received=1, join_assign_accepted=1, join_ack_sent=1, assigned_telemetry_started=1, first_assigned_telemetry_tx=1, msp_fixed_slot_learned=1
- JOIN backoff kinds: first_fast=2
- Drone debug events/status rows: 5
- Drone telemetry rows: 501
- Simulated RF-loss packets: 2 sequenceIds=122, 123
- t+6.462s node 7: drone_join_event join_assign_accepted
- t+7.284s node 7: drone_join_event join_ack_sent
- t+7.301s node 7: drone_join_event assigned_telemetry_started
- t+7.352s node 7: drone_join_event first_assigned_telemetry_tx
- t+7.562s node 7: drone_join_event post_assign_burst_tx
- t+7.562s node 7: drone_join_event post_assign_burst_tx
- t+7.775s node 7: drone_join_event msp_fixed_slot_learned
- t+45.065s node 7: drone_debug_event telemetry_rf_loss_started
- t+45.085s node 7: drone_debug_status assigned_telemetry
- t+45.122s node 7: drone_debug_status assigned_telemetry
- t+45.330s node 7: drone_debug_event telemetry_rf_loss_simulated
- t+45.330s node 7: drone_debug_event telemetry_rf_loss_simulated

## Telemetry Sequence Gaps
- Observed sequence gaps: 1
- node 7: t+45.165s seq 121 -> t+45.365s seq 124; missing [122, 123]

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- drone_telemetry: 501
- drone_live_status: 58
- drone_fc_status: 58
- drone_join_event: 13
- scanner_event: 3
- assignment_event: 3
- bind_progress_event: 3
- drone_debug_event: 3
- inter_gc_status: 2
- command: 2
- command_ack: 2
- drone_debug_status: 2
- assignments: 1
- drone_link_status: 1
- assignment_timing_hint: 1
