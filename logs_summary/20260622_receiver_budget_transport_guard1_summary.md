# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_transport_guard1.jsonl`

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
| 3 | `accepted` | 28829.9 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 37103.6 | no | yes | join_request_received, post_bind_first_telemetry | pass |
| 7 | `accepted` | 24008.2 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 13->16(2),16->19(2) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received | 6917.7 | 3178.1ms:wait_assignment,attempts=1,joinTx=-,backoff=first_fast,next=44973<br>6318.2ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=44973 | 6:gap=985.0ms,events=0; 7:gap=1006.0ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | - | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 11120.3 | 4329.2ms:wait_assignment,attempts=2,joinTx=-,backoff=first_fast,next=67712<br>7434.4ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=70457<br>10532.8ms:assigned_telemetry,attempts=3,joinTx=-,backoff=first_fast,next=70457 | 3:gap=601.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |
| 7 | `accepted` | `accepted` | - | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed | 16653.4 | 4440.0ms:wait_assignment,attempts=2,joinTx=-,backoff=first_fast,next=90301<br>7675.2ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=92921<br>10832.4ms:wait_assignment,attempts=4,joinTx=-,backoff=first_fast,next=95883<br>13989.9ms:wait_assignment,attempts=5,joinTx=-,backoff=first_fast,next=98676 | 3:gap=600.0ms,events=0; 6:gap=800.0ms,events=0 | pass | - |

## Transport Health

- Command ACK coverage: `24/24`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `8`
- Recovery budget denied: `130`
- Healthy service protected: `130`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`READY FOR 4 DRONES`
