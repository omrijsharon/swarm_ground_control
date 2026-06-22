# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_postbind_until_lock1.jsonl`

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
| 3 | `accepted` | 6547.7 | yes | yes | post_bind_first_telemetry, join_request_received, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 18361.9 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received | pass |
| 7 | `accepted` | 12736.0 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, assignment_completed | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 65->75(9),75->78(2),78->81(2),81->84(2),84->87(2),87->90(2),90->93(2),93->0(162),0->3(2),4->7(2) | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | 6333.5 | 3134.7ms:wait_assignment,attempts=1,joinTx=-,backoff=first_fast,next=26540<br>6333.4ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=26540 | 6:gap=5400.0ms,events=0; 7:gap=5401.0ms,events=0 | fail | non_target_6_not_stable, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `13/13`
- Missing ACKs: `-`
- Rejected commands: `1`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `2`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `28`
- Recovery budget denied: `2`
- Healthy service protected: `2`
- Receiver overload events/statuses: `0`
- Transport verdict: `fail`
- Transport failures: `rejected_command, suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
