# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\non_disruptive_bind_3node_full_stress_20260622.jsonl`

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
| 3 | `accepted` | 8217.4 | yes | yes | post_bind_first_telemetry, join_request_received, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 26336.0 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 7 | `accepted` | 18061.0 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 15941.7 | 3:gap=1497.2ms,events=0; 6:gap=2004.5ms,events=0; 7:gap=1997.3ms,events=0 | fail | node_6_affected_by_bind, node_7_affected_by_bind |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 141->143(1),143->145(1),145->147(1),147->149(1),149->151(1),151->153(1),153->155(1),155->157(1),157->159(1),159->161(1),161->163(1),163->165(1),165->167(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=431.3ms,events=0; 7:gap=701.2ms,events=0 | pass | - |
| 6 | 1 | 1 | 115->126(10),126->128(1),128->130(1),130->132(1),132->134(1),134->136(1),136->138(1),138->140(1),140->142(1),142->144(1) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=2561.9ms,events=0; 7:gap=694.2ms,events=0 | fail | non_target_3_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 232->242(9),242->244(1),244->246(1),246->248(1),248->250(1),250->252(1),252->254(1),254->0(1),0->3(2),3->5(1) | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | 5722.4 | 6:gap=1249.5ms,events=0; 7:gap=3249.1ms,events=0 | fail | non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `23/23`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `2`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Transport verdict: `fail`
- Transport failures: `suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
