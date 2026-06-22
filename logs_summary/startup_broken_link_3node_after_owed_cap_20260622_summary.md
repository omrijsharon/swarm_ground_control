# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\startup_broken_link_3node_after_owed_cap_20260622.jsonl`

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
| 3 | `accepted` | 22860.3 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 8255.7 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |
| 7 | `accepted` | 14305.8 | yes | yes | join_request_received, assign_sent, post_bind_first_telemetry, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 20->22(1),29->2(228) | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked | 5321.9 | 6:gap=705.2ms,events=0; 7:gap=1141.8ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 127->137(9),137->139(1),139->141(1),141->143(1),143->145(1),145->147(1),147->149(1),149->151(1),151->0(104),2->7(4) | post_bind_first_telemetry, join_request_received, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | 6513.6 | 3:gap=868.7ms,events=0; 7:gap=4404.7ms,events=0 | fail | non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `13/13`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `1`
- Suspicious serial fragments: `1`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Transport verdict: `fail`
- Transport failures: `malformed_serial_json, suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
