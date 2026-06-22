# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_postbind_soft1.jsonl`

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
| 3 | `accepted` | 14265.5 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |
| 6 | `accepted` | 20978.4 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 7 | `accepted` | 6532.9 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 52->54(1),55->57(1),57->59(1),59->61(1),61->63(1),63->65(1),65->67(1),67->69(1),69->71(1),71->0(184),0->2(1),2->4(1) | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed | - | 67652.2ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29021<br>70723.4ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29021<br>74010.9ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29021<br>77074.5ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29021<br>80327.7ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29021<br>83408.7ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29021<br>86710.7ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29021<br>89808.3ms:assigned_telemetry,attempts=1,joinTx=-,backoff=first_fast,next=29021 | 6:gap=815.0ms,events=0; 7:gap=807.0ms,events=0 | fail | target_not_online_before_rebind_timeout |

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
- Recovery budget used: `43`
- Recovery budget denied: `144`
- Healthy service protected: `144`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
