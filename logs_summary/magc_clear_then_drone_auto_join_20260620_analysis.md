# Live Debug Log Summary

- Source: `logs_summary\magc_clear_then_drone_auto_join_20260620.jsonl`
- Parsed records: 827
- Approx duration: 106.0s

## Commands
- Sent commands: 5
- ACKs: 5 (1 rejected)
- t+16.206s ACK drone/drone debug_reboot accepted: -
- t+50.939s ACK telegc/telemetry_ground_control get_status accepted: -
- t+51.160s ACK magc/telemetry_ground_control get_status rejected: magc_link_unavailable
- t+52.393s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+53.403s ACK drone/drone debug_reboot accepted: -

## Bind And Search
- Search events: 1
- Bind progress events: 4
- Assignment events: 6
- Assignment event counts: join_request_received=1, silence_sent=1, assign_sent=1, join_ack_received=1, telemetry_period_observed=1, post_bind_first_telemetry=1
- t+101.242s node 7: quiet - join_request_received
- t+102.272s node 7: assign - silence_sent
- t+105.856s node 7: timing - telemetry_period_observed
- t+105.867s node 7: telemetry_bind - telemetry_live

## CAD And OOCR
- Channel scan events: 13
- Channel scan event counts: channel_scanned=13
- CAD samples: rows=8, validated=0, rejected=8, one_hit_rejected=8
- OOCR events: 72
- OOCR event counts: candidate_failed=15, background_oocr_complete=15, background_oocr_started=14, background_oocr_confirmation_started=14, confirmation_listen=14
- Recent OOCR confirmations: t+76.119s ch 33/p0 score 2000 reason recent_clear_hint; t+78.378s ch 33/p0 score 2000 reason recent_clear_hint; t+80.632s ch 33/p0 score 2000 reason recent_clear_hint; t+82.893s ch 33/p0 score 2000 reason recent_clear_hint; t+91.980s ch 33/p0 score 2000 reason recent_clear_hint; t+94.445s ch 33/p0 score 2000 reason recent_clear_hint; t+96.709s ch 33/p0 score 2000 reason recent_clear_hint; t+98.968s ch 33/p0 score 2000 reason recent_clear_hint
- Failed candidate confirmations: 15

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=2, timeouts=0
- node 7; ACK->telemetry 1.518s; drone assigned->telemetry 99.133s; drone first TX->telemetry 99.076s

## Drone Debug
- Drone JOIN events: 47
- JOIN event counts: join_backoff=10, join_request_sent=9, post_assign_burst_tx=6, join_start_shared_channel=3, silence_received=3, join_assign_accepted=3, join_ack_sent=3, assigned_telemetry_started=3, first_assigned_telemetry_tx=3, msp_fixed_slot_learned=3, join_request_lbt_blocked_or_tx_failed=1
- JOIN backoff kinds: retry_normal=6, first_fast=4
- Drone debug events/status rows: 4
- Drone telemetry rows: 1
- t+102.197s node 7: drone_join_event silence_received
- t+103.228s node 7: drone_join_event join_assign_accepted
- t+104.185s node 7: drone_join_event join_ack_sent
- t+104.185s node 7: drone_join_event assigned_telemetry_started
- t+104.238s node 7: drone_join_event first_assigned_telemetry_tx
- t+104.445s node 7: drone_join_event post_assign_burst_tx
- t+104.653s node 7: drone_join_event post_assign_burst_tx
- t+104.853s node 7: drone_join_event msp_fixed_slot_learned
- t+16.206s node 7: drone_debug_event reboot_scheduled
- t+16.413s node 7: drone_debug_status assigned_telemetry
- t+53.403s node 7: drone_debug_event reboot_scheduled
- t+53.538s node 7: drone_debug_status assigned_telemetry

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Telemetry Coverage
- Latest status at t+50.979s: mode `waiting_assignments`
- Assigned packets received: 0
- Assigned RX coverage: 100%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 0
- Non-assigned preemptions: 0
- Coverage modes seen: waiting_assignments=1

## State Flicker
- No rapid state flicker detected from available state rows.

## Event Counts
- orphan_recovery_event: 72
- drone_join_event: 47
- drone_live_status: 43
- drone_fc_status: 43
- channel_scan_event: 13
- bench_marker: 8
- inter_gc_status: 6
- assignment_event: 6
- command: 5
- command_ack: 5
- assignments: 4
- bind_progress_event: 4
- scanner_event: 3
- session_event: 3
- drone_debug_event: 2
- drone_debug_status: 2
- gc_status: 1
- search_event: 1
- drone_telemetry: 1
