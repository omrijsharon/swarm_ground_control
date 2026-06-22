# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_deadline_protect1.jsonl`

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
| 3 | `accepted` | 6648.7 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 14673.7 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 21628.9 | yes | yes | join_request_received, post_bind_first_telemetry | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 80->4(179),5->8(2) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | - | 66734.5ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29775<br>69939.4ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29775<br>73118.7ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29775<br>76303.2ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29775<br>79514.7ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29775<br>82710.6ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29775<br>85926.8ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29775<br>89128.1ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29775 | 6:gap=799.0ms,events=0; 7:gap=800.0ms,events=0 | fail | target_not_online_before_rebind_timeout |

## Transport Health

- Command ACK coverage: `39/39`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `17`
- Recovery budget denied: `91`
- Healthy service protected: `91`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
