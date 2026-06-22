# Live Debug Log Summary

- Source: `logs_summary\operator_search_fix_clear_only.jsonl`
- Parsed records: 291
- Approx duration: 44.7s

## Commands
- Sent commands: 2
- ACKs: 2 (2 rejected)
- t+10.657s ACK magc/telemetry_ground_control clear_all_assignments rejected: magc_link_unavailable
- t+10.865s ACK magc/telemetry_ground_control get_status rejected: magc_link_unavailable

## Bind And Search
- Search events: 0
- Bind progress events: 2
- Assignment events: 2
- Assignment event counts: telemetry_period_observed=1, telemetry_period_locked=1
- t+11.056s node 7: timing - telemetry_period_observed
- t+11.170s node 7: complete - telemetry_period_locked

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 57

## State Flicker
- Node 7: 29 rapid state transitions: t+10.937s locking->offline, t+11.043s offline->locking, t+11.056s locking->timing, t+11.141s timing->online, t+11.141s online->locking, t+11.170s locking->complete, +23 more

## Event Counts
- scanner_event: 61
- drone_telemetry: 57
- drone_link_status: 31
- telemetry_rebind_event: 25
- orphan_recovery_event: 3
- command: 2
- command_ack: 2
- assignment_event: 2
- bind_progress_event: 2
- assignments: 1
- inter_gc_status: 1
