# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `2=http://192.168.68.112:8080, 3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\multi_drone_stress_4node_phase_slots_v7_missinghint_20260621.jsonl`

## Preflight

| Check | Result |
|---|---|
| Drone Wi-Fi status | pass |
| TeleGC status ACK | pass |
| MaGC status ACK through TeleGC | pass |

## Startup Bind

- MaGC clear-all ACK: `accepted`
- Startup verdict: `fail`
- Startup failures: `not_all_nodes_online_before_startup_timeout`

| Node | Startup command ACK | First TeleGC telemetry ms | <=30s target | <=60s target | Milestones | Pass |
|---:|---|---:|---|---|---|---|
| 2 | `accepted` | - | no | no | join_request_received, assign_sent, join_ack_received, assignment_completed | fail |
| 3 | `accepted` | 15800.3 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 38402.8 | no | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry, telemetry_period_locked | pass |
| 7 | `accepted` | 22054.8 | yes | yes | join_request_received, assign_sent, post_bind_first_telemetry, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|

## Transport Health

- Command ACK coverage: `11/11`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
