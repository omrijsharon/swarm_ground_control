# Live Debug Log Summary

- Source: `logs_summary\dual_gc_status_com16.jsonl`
- Parsed records: 1896
- Approx duration: 60.1s

## Commands
- Sent commands: 4
- ACKs: 2 (0 rejected)
- Pending/no ACK command IDs: live-dbg-magc-0003, live-dbg-magc-0004
- t+18.027s ACK telegc/telemetry_ground_control get_status accepted: -
- t+18.490s ACK magc/magic_ground_control get_status accepted: -

## Bind And Search
- Search events: 0
- Bind progress events: 0
- Assignment events: 0

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 0

## State Flicker
- Node 6: 575 rapid state transitions: t+12.021s locking->offline, t+12.196s offline->locking, t+12.330s locking->offline, t+12.357s offline->locking, t+12.493s locking->offline, t+12.524s offline->locking, +569 more
- Node 7: 573 rapid state transitions: t+12.196s locking->offline, t+12.330s offline->locking, t+12.357s locking->offline, t+12.493s offline->locking, t+12.524s locking->offline, t+12.664s offline->locking, +567 more

## Event Counts
- drone_link_status: 1150
- scanner_event: 576
- telemetry_rebind_event: 28
- inter_gc_status: 26
- command: 4
- assignments: 3
- command_ack: 2
- gc_status: 1
