# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\startup_broken_link_3node_after_shortloss_throttle_20260622.jsonl`

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
| 3 | `accepted` | 22518.6 | yes | yes | post_bind_first_telemetry | pass |
| 6 | `accepted` | 8181.8 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 15465.3 | yes | yes | join_request_received, assign_sent, post_bind_first_telemetry, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 3->16(12),27->1(229),1->3(1) | join_request_received, assign_sent, post_bind_first_telemetry, join_ack_received, assignment_completed, telemetry_period_locked | 5970.0 | 6:gap=896.4ms,events=0; 7:gap=1000.2ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 136->138(1),138->140(1),140->142(1),142->144(1),144->146(1),146->148(1),148->150(1),150->0(105),3->5(1) | post_bind_first_telemetry, join_request_received, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | 5943.9 | 3:gap=546.8ms,events=0; 7:gap=4490.7ms,events=0 | fail | non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `13/13`
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
