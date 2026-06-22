# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_rf4_guardfix1.jsonl`

## Preflight

| Check | Result |
|---|---|
| Drone Wi-Fi status | pass |
| TeleGC status ACK | fail |
| MaGC status ACK through TeleGC | pass |

## Startup Bind

- MaGC clear-all ACK: `accepted`
- Startup verdict: `pass`
- Startup failures: `-`

| Node | Startup command ACK | First TeleGC telemetry ms | <=30s target | <=60s target | Milestones | Pass |
|---:|---|---:|---|---|---|---|
| 3 | `accepted` | 24082.3 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent | pass |
| 6 | `accepted` | 14969.6 | yes | yes | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent | pass |
| 7 | `accepted` | 18749.2 | yes | yes | post_bind_first_telemetry, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 8798.4 | 3:gap=1400.0ms,events=0; 6:gap=1460.0ms,events=0; 7:gap=1401.0ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 4 | 1 | 87->90(2) | short_loss_guard_started, short_loss_recovered | - | 6:gap=800.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |
| 6 | 4 | 1 | 219->222(2),222->225(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=609.0ms,events=0; 7:gap=601.0ms,events=0 | pass | - |
| 7 | 4 | 1 | 201->204(2),204->207(2),207->210(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=1200.0ms,events=0; 6:gap=1200.0ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | - | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 11157.7 | 4401.3ms:wait_assignment,attempts=2,joinTx=-,backoff=first_fast,next=72312<br>7642.2ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=75201<br>10763.9ms:assigned_telemetry,attempts=3,joinTx=-,backoff=first_fast,next=75201 | 6:gap=1600.0ms,events=0; 7:gap=1607.0ms,events=0 | fail | non_target_6_not_stable, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `21/21`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `2`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `0`
- Recovery budget denied: `56`
- Healthy service protected: `56`
- Receiver overload events/statuses: `0`
- Transport verdict: `fail`
- Transport failures: `suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
