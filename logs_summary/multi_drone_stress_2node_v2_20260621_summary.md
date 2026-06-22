# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080`
- Loss cycles: `9`
- Log: `logs_summary\multi_drone_stress_2node_v2_20260621.jsonl`

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
| 3 | `accepted` | 0.6 | yes | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | pass |
| 6 | `accepted` | 8106.6 | yes | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry, telemetry_period_locked | pass |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 5->3(253) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 5309.5 | 6:gap=2788.2ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 129->140(10),140->142(1),142->144(1),144->146(1),146->148(1),148->150(1),150->152(1),152->154(1),154->156(1),156->158(1) | - | - | 3:gap=2761.4ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join |

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
