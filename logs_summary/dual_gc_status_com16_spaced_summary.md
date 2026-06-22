# Live Debug Log Summary

- Source: `logs_summary\dual_gc_status_com16_spaced.jsonl`
- Parsed records: 477
- Approx duration: 30.1s

## Commands
- Sent commands: 4
- ACKs: 4 (0 rejected)
- t+18.012s ACK telegc/telemetry_ground_control get_status accepted: -
- t+19.091s ACK magc/magic_ground_control get_status accepted: -
- t+21.172s ACK magc/magic_ground_control start_search accepted: -
- t+25.193s ACK magc/magic_ground_control cancel_search accepted: -

## Bind And Search
- Search events: 1
- Bind progress events: 0
- Assignment events: 0

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 0

## State Flicker
- Node 6: 220 rapid state transitions: t+10.840s locking->offline, t+11.003s offline->locking, t+11.003s locking->offline, t+11.167s offline->locking, t+11.167s locking->offline, t+11.332s offline->locking, +214 more

## Event Counts
- drone_link_status: 221
- scanner_event: 112
- telemetry_rebind_event: 11
- inter_gc_status: 9
- assignments: 5
- command: 4
- command_ack: 4
- gc_status: 2
- search_event: 1
