# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_provisional_phase1.jsonl`

## Preflight

| Check | Result |
|---|---|
| Drone Wi-Fi status | pass |
| TeleGC status ACK | fail |
| MaGC status ACK through TeleGC | fail |

## Startup Bind

- MaGC clear-all ACK: `missing`
- Startup verdict: `fail`
- Startup failures: `missing_or_rejected_magc_clear_all_ack`

| Node | Startup command ACK | First TeleGC telemetry ms | <=30s target | <=60s target | Milestones | Pass |
|---:|---|---:|---|---|---|---|
| 3 | `accepted` | 20341.1 | yes | yes | telemetry_period_locked, post_bind_first_telemetry, join_request_received, assign_sent, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 35940.3 | no | yes | telemetry_period_locked, post_bind_first_telemetry | pass |
| 7 | `accepted` | 12236.3 | yes | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|

## Transport Health

- Command ACK coverage: `8/9`
- Missing ACKs: `multi-stress-magc-clear_all_assignments-0009`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `40`
- Recovery budget denied: `16`
- Healthy service protected: `16`
- Receiver overload events/statuses: `0`
- Transport verdict: `fail`
- Transport failures: `missing_command_ack:1`

## Final Verdict

`NOT READY FOR 4 DRONES`
