# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_3node_stress_20260622.jsonl`

## Preflight

| Check | Result |
|---|---|
| Drone Wi-Fi status | pass |
| TeleGC status ACK | pass |
| MaGC status ACK through TeleGC | pass |

## Startup Bind

- MaGC clear-all ACK: `accepted`
- Startup verdict: `pass`
- Startup failures: `-`

| Node | Startup command ACK | First TeleGC telemetry ms | <=30s target | <=60s target | Milestones | Pass |
|---:|---|---:|---|---|---|---|
| 3 | `accepted` | 30573.4 | no | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | pass |
| 6 | `accepted` | 8424.6 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 30302.4 | no | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 10106.8 | 3:gap=3603.6ms,events=0; 6:gap=3347.5ms,events=0; 7:gap=1403.9ms,events=0 | fail | node_3_affected_by_bind, node_6_affected_by_bind |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | - | - | - | 6:gap=Nonems,events=0; 7:gap=214.0ms,events=0 | fail | non_target_6_not_stable, target_not_fresh_after_rf_loss |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | - | join_request_received, assign_sent, join_ack_received, assignment_completed | - | 6:gap=Nonems,events=0; 7:gap=220.4ms,events=0 | fail | target_not_online_before_rebind_timeout, non_target_6_not_stable |

## Transport Health

- Command ACK coverage: `18/18`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `31`
- Recovery budget denied: `869`
- Healthy service protected: `868`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
