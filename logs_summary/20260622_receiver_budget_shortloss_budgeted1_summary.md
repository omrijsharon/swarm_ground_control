# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_shortloss_budgeted1.jsonl`

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
| 3 | `accepted` | 11923.9 | yes | yes | join_request_received, assign_sent, post_bind_first_telemetry, join_ack_received, assignment_completed, telemetry_period_locked | pass |
| 6 | `accepted` | 20779.7 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received | pass |
| 7 | `accepted` | 6557.2 | yes | yes | post_bind_first_telemetry, join_request_received, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 11->14(2),14->16(1),16->18(1),18->20(1) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 8818.9 | 3180.2ms:wait_assignment,attempts=1,joinTx=-,backoff=first_fast,next=28718<br>6312.1ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=28718 | 6:gap=1200.0ms,events=0; 7:gap=1200.0ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | - | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 18769.3 | 3292.3ms:backoff,attempts=1,joinTx=-,backoff=first_fast,next=52510<br>7624.4ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=55104<br>10789.4ms:backoff,attempts=3,joinTx=-,backoff=retry_normal,next=62405<br>14939.8ms:wait_assignment,attempts=4,joinTx=-,backoff=retry_normal,next=62405<br>18094.5ms:assigned_telemetry,attempts=4,joinTx=-,backoff=retry_normal,next=62405 | 3:gap=5387.0ms,events=0; 7:gap=1600.0ms,events=0 | fail | non_target_3_not_stable, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `20/20`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `13`
- Recovery budget denied: `84`
- Healthy service protected: `84`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
