# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\manual_bind_abuse_after_first_packet_lock_20260622.jsonl`

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
| 3 | `accepted` | 91.8 | yes | yes | join_request_received, telemetry_period_locked, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 16714.5 | yes | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked, post_bind_first_telemetry | pass |
| 7 | `accepted` | 22004.8 | yes | yes | telemetry_period_locked, post_bind_first_telemetry | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 15879.1 | 3:gap=881.3ms,events=0; 6:gap=2011.9ms,events=0; 7:gap=2002.9ms,events=0 | fail | node_6_affected_by_bind, node_7_affected_by_bind |

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 124->135(10),135->137(1),137->139(1),139->141(1),141->143(1),143->145(1),145->147(1),147->2(110),2->76(73) | join_request_received, telemetry_period_locked, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed | 87642.3 | 6:gap=1218.1ms,events=0; 7:gap=1691.7ms,events=0 | fail | non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `21/21`
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
