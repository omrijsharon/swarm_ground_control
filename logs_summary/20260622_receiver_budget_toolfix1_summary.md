# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_toolfix1.jsonl`

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
| 3 | `accepted` | 11815.2 | yes | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 17998.7 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked | pass |
| 7 | `accepted` | 6613.1 | yes | yes | post_bind_first_telemetry, join_request_received, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 12->15(2),15->18(2) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 6936.1 | 3184.6ms:wait_assignment,attempts=1,joinTx=-,backoff=first_fast,next=25910<br>6413.0ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=25910 | 6:gap=1198.0ms,events=0; 7:gap=1191.0ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 106->3(152) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 8054.5 | 4181.6ms:wait_assignment,attempts=2,joinTx=-,backoff=first_fast,next=48724<br>7354.6ms:assigned_telemetry,attempts=2,joinTx=-,backoff=first_fast,next=48724 | 3:gap=1000.0ms,events=0; 7:gap=801.0ms,events=0 | pass | - |
| 7 | `accepted` | `accepted` | - | join_request_received, assign_sent, post_bind_first_telemetry, join_ack_received, assignment_completed | 72999.9 | 47710.2ms:wait_assignment,attempts=9,joinTx=-,backoff=retry_normal,next=111631<br>50921.1ms:backoff,attempts=9,joinTx=-,backoff=retry_normal,next=118068<br>54164.3ms:wait_assignment,attempts=10,joinTx=-,backoff=retry_normal,next=118068<br>57386.0ms:backoff,attempts=10,joinTx=-,backoff=retry_normal,next=126976<br>60620.7ms:backoff,attempts=10,joinTx=-,backoff=retry_normal,next=126976<br>63873.6ms:wait_assignment,attempts=11,joinTx=-,backoff=retry_normal,next=126976<br>67087.9ms:backoff,attempts=11,joinTx=-,backoff=retry_normal,next=132985<br>70350.8ms:wait_assignment,attempts=12,joinTx=-,backoff=retry_normal,next=132985 | 3:gap=601.0ms,events=0; 6:gap=600.0ms,events=0 | pass | - |

## Transport Health

- Command ACK coverage: `40/40`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `0`
- Recovery budget denied: `126`
- Healthy service protected: `126`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`READY FOR 4 DRONES`
