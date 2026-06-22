# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_narrow_shortloss1.jsonl`

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
| 3 | `accepted` | 57548.2 | no | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | pass |
| 6 | `accepted` | 44221.4 | no | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 27119.0 | yes | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 5->3(253) | join_request_received, assign_sent, join_ack_received, post_bind_first_telemetry, assignment_completed, telemetry_period_locked | 8293.5 | 4440.6ms:wait_assignment,attempts=2,joinTx=-,backoff=first_fast,next=68333<br>7662.9ms:assigned_telemetry,attempts=2,joinTx=-,backoff=first_fast,next=68333 | 6:gap=600.0ms,events=0; 7:gap=999.0ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 189->3(69) | join_request_received, assign_sent, join_ack_received, post_bind_first_telemetry, assignment_completed | 72943.6 | 47885.6ms:backoff,attempts=13,joinTx=-,backoff=retry_normal,next=135393<br>51668.9ms:wait_assignment,attempts=14,joinTx=-,backoff=retry_normal,next=135393<br>54901.6ms:backoff,attempts=14,joinTx=-,backoff=retry_normal,next=141168<br>58157.8ms:wait_assignment,attempts=15,joinTx=-,backoff=retry_normal,next=141168<br>61331.5ms:backoff,attempts=15,joinTx=-,backoff=retry_normal,next=147439<br>64522.4ms:wait_assignment,attempts=16,joinTx=-,backoff=retry_normal,next=147439<br>67764.1ms:backoff,attempts=16,joinTx=-,backoff=retry_normal,next=152800<br>70810.7ms:wait_assignment,attempts=17,joinTx=-,backoff=retry_normal,next=152800 | 3:gap=400.0ms,events=0; 7:gap=401.0ms,events=0 | pass | - |
| 7 | `accepted` | `accepted` | - | join_request_received, assign_sent, post_bind_first_telemetry, join_ack_received, assignment_completed, telemetry_period_locked | 8376.8 | 4141.0ms:wait_assignment,attempts=2,joinTx=-,backoff=first_fast,next=172301<br>7342.9ms:assigned_telemetry,attempts=2,joinTx=-,backoff=first_fast,next=172301 | 3:gap=400.0ms,events=0; 6:gap=402.0ms,events=0 | pass | - |

## Transport Health

- Command ACK coverage: `40/40`
- Missing ACKs: `-`
- Rejected commands: `1`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `20`
- Recovery budget denied: `254`
- Healthy service protected: `254`
- Receiver overload events/statuses: `0`
- Transport verdict: `fail`
- Transport failures: `rejected_command`

## Final Verdict

`NOT READY FOR 4 DRONES`
