# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_final_abuse_3node_contractfix.jsonl`

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
| 3 | `accepted` | 16190.2 | yes | yes | post_bind_first_telemetry, join_request_received | pass |
| 6 | `accepted` | 6675.8 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 11125.8 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 15606.3 | 3:gap=423.0ms,events=0; 6:gap=590.0ms,events=0; 7:gap=823.0ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | - | short_loss_guard_started | - | 6:gap=414.0ms,events=0; 7:gap=400.0ms,events=0 | fail | target_not_fresh_after_rf_loss |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | - | - | - | 66867.9ms:backoff,attempts=15,joinTx=-,backoff=retry_normal,next=148904<br>70127.8ms:wait_assignment,attempts=16,joinTx=-,backoff=retry_normal,next=148904<br>73316.5ms:backoff,attempts=16,joinTx=-,backoff=retry_normal,next=157602<br>76567.1ms:backoff,attempts=16,joinTx=-,backoff=retry_normal,next=157602<br>79781.2ms:wait_assignment,attempts=17,joinTx=-,backoff=retry_normal,next=157602<br>82980.4ms:backoff,attempts=17,joinTx=-,backoff=retry_normal,next=166560<br>86211.4ms:backoff,attempts=17,joinTx=-,backoff=retry_normal,next=166560<br>89432.3ms:wait_assignment,attempts=18,joinTx=-,backoff=retry_normal,next=166560 | 6:gap=214.0ms,events=0; 7:gap=213.0ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join |

## Transport Health

- Command ACK coverage: `49/49`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `15`
- Recovery budget denied: `90`
- Healthy service protected: `90`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
