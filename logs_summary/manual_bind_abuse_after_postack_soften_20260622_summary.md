# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\manual_bind_abuse_after_postack_soften_20260622.jsonl`

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
| 3 | `accepted` | 8277.1 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |
| 6 | `accepted` | 14599.3 | yes | yes | join_request_received, assign_sent, join_ack_received, post_bind_first_telemetry, assignment_completed, telemetry_period_locked | pass |
| 7 | `accepted` | 22137.2 | yes | yes | join_request_received, post_bind_first_telemetry | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 16032.9 | 3:gap=6027.7ms,events=1; 6:gap=5068.4ms,events=0; 7:gap=2500.2ms,events=0 | fail | node_3_affected_by_bind, node_6_affected_by_bind, node_7_affected_by_bind |

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 3->5(1) | telemetry_period_locked, post_bind_first_telemetry, join_request_received, assign_sent, join_ack_received, assignment_completed | 5940.9 | 6:gap=11917.7ms,events=0; 7:gap=11229.4ms,events=0 | fail | non_target_6_not_stable, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `21/21`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `1`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Transport verdict: `fail`
- Transport failures: `suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
