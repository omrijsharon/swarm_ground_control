# Live Debug Log Summary

- Source: `logs_summary\20260622_receiver_budget_rf4_guardfix4_fast24.jsonl`
- Parsed records: 1033
- Approx duration: 149.4s

## Commands
- Sent commands: 9
- ACKs: 9 (0 rejected)
- Derived ACK latency: min 23 ms, max 1295 ms, avg 464 ms
- Inter-GC queued command events: 2
- t+1.082s ACK drone/drone get_status accepted: -
- t+1.135s ACK drone/drone get_status accepted: -
- t+26.167s ACK telegc/telemetry_ground_control get_status accepted: -
- t+27.439s ACK magc/magic_ground_control get_status accepted: -
- t+28.753s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+29.154s ACK drone/drone debug_reboot accepted: -
- t+29.201s ACK drone/drone debug_reboot accepted: -
- t+29.244s ACK drone/drone debug_reboot accepted: -

## Inter-GC Transport
- Inter-GC status rows: 90
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
- Search events: 1
- Bind progress events: 18
- Assignment events: 30
- Assignment event counts: silence_sent=8, post_bind_acquire_timeout=6, assign_sent=5, join_ack_timeout=5, join_request_received=3, assign_created=2, assign_reused=1
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=0, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+29.372s to t+29.372s
- t+43.425s node 6: assign - silence_sent
- t+57.659s node 7: quiet - join_request_received
- t+61.613s node 7: quiet - assign_created
- t+62.935s node 7: assign - silence_sent
- t+64.025s node 7: ack - assign_sent
- t+81.786s node 7: assign - silence_sent
- t+83.152s node 7: ack - assign_sent
- t+84.426s node 7: assign - silence_sent
- t+85.819s node 7: quiet - join_request_received
- t+87.155s node 7: quiet - assign_reused
- t+88.534s node 7: assign - silence_sent
- t+91.115s node 7: ack - assign_sent

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=12
- node 6; timeouts=8
- node 7; timeouts=4

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 9
- Drone telemetry rows: 0
- t+0.088s node 3: drone_debug_status wait_assignment
- t+1.082s node 6: drone_debug_status wait_assignment
- t+1.136s node 7: drone_debug_status wait_assignment
- t+29.154s node 3: drone_debug_event reboot_scheduled
- t+29.154s node 3: drone_debug_status wait_assignment
- t+29.201s node 6: drone_debug_event reboot_scheduled
- t+29.201s node 6: drone_debug_status backoff
- t+29.244s node 7: drone_debug_event reboot_scheduled
- t+29.244s node 7: drone_debug_status wait_assignment

## Short-Loss Guard
- Telemetry rebind events: 64
- No short-loss guard events found.

## Receiver Budget
- Events: recovery_budget_used=213

## Telemetry Coverage
- Latest status at t+26.233s: mode `telemetry_first`
- Assigned packets received: 0
- Assigned RX coverage: 0%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 6
- Non-assigned preemptions: 0
- Receiver budget mode: `drone_owned_timing`
- Receiver utilization: 0%
- Receiver overloaded: False
- Recovery budget used: 60
- Recovery budget denied: 0
- Healthy service protected: 0
- Owed RX active: False node=0 count=0
- Fairness skips: 0
- Owed selections: 0
- Owed misses: 0
- Max scheduler skips: 0
- Coverage modes seen: telemetry_first=1

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- scanner_event: 664
- inter_gc_status: 90
- telemetry_rebind_event: 64
- assignment_event: 30
- bind_progress_event: 18
- assignments: 10
- command: 9
- command_ack: 9
- bench_marker: 7
- drone_debug_status: 6
- drone_link_status: 5
- drone_live_status: 3
- drone_debug_event: 3
- inter_gc_command_queued: 2
- session_event: 2
- gc_status: 1
- search_event: 1
