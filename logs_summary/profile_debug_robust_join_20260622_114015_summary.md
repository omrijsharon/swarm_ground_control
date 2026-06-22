# Live Debug Log Summary

- Source: `logs_summary\profile_debug_robust_join_20260622_114015.jsonl`
- Parsed records: 269
- Approx duration: 41.6s

## Commands
- Sent commands: 4
- ACKs: 4 (0 rejected)
- Derived ACK latency: min 118 ms, max 280 ms, avg 199 ms
- Inter-GC queued command events: 4
- t+10.174s ACK magc/magic_ground_control set_radio_profile accepted: -
- t+10.174s ACK magc/magic_ground_control get_status accepted: -
- t+10.387s ACK magc/magic_ground_control clear_all_assignments accepted: -
- t+10.387s ACK magc/magic_ground_control start_search accepted: -

## Inter-GC Transport
- Inter-GC status rows: 31
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
- Search events: 5
- Bind progress events: 0
- Assignment events: 0
- Operator shared/discovery RX: starts=1, active_ticks=0, completes=1
- Operator shared/discovery RX scanner events: 2
- Operator shared/discovery RX GC window: 9277675 to 9292623 ms (14.9s)
- Operator shared/discovery RX window observed: t+10.588s to t+25.501s
- Operator shared RX complete reasons: search_timeout
- Empty-assignment shared RX: starts=2, active_ticks=0, joins=0, completes=0, oocr_deferred=0
- Empty-assignment shared RX observed: t+25.501s to t+25.501s

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=0
- No post-bind timing rows found.

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 0

## Short-Loss Guard
- Telemetry rebind events: 0
- No short-loss guard events found.

## Receiver Budget
- Events: recovery_budget_used=4

## State Flicker
- No rapid state flicker detected from available state rows.

## Terminal State Over Recent Telemetry
- No terminal link states were observed within 5s of same-node telemetry.

## Event Counts
- inter_gc_status: 31
- scanner_event: 22
- search_event: 5
- assignments: 4
- command: 4
- inter_gc_command_queued: 4
- command_ack: 4
- session_event: 2
