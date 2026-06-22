# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_sharedrenew1.jsonl`

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
| 3 | `accepted` | 26419.9 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 15405.7 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked | pass |
| 7 | `accepted` | 20841.1 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 8585.1 | 3:gap=415.0ms,events=0; 6:gap=801.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 4 | 1 | 49->104(54) | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 6:gap=600.0ms,events=0; 7:gap=599.0ms,events=0 | pass | - |
| 6 | 4 | 1 | 207->213(5),213->215(1),215->217(1),217->219(1),219->221(1),221->223(1),223->225(1),225->227(1),227->229(1),229->231(1),231->233(1),233->235(1),235->237(1),237->239(1),239->241(1),241->243(1),243->245(1),245->247(1) | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 3:gap=813.0ms,events=0; 7:gap=806.0ms,events=0 | pass | - |
| 7 | 4 | 1 | 184->225(40) | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 3:gap=600.0ms,events=0; 6:gap=600.0ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 13->15(1),15->17(1),17->19(1) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 31934.5 | 7477.6ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=79552<br>10629.7ms:wait_assignment,attempts=4,joinTx=-,backoff=first_fast,next=82188<br>15114.9ms:wait_assignment,attempts=6,joinTx=-,backoff=first_fast,next=87759<br>18401.1ms:wait_assignment,attempts=7,joinTx=-,backoff=first_fast,next=90469<br>21632.8ms:wait_assignment,attempts=8,joinTx=-,backoff=first_fast,next=93335<br>24881.7ms:backoff,attempts=9,joinTx=-,backoff=first_fast,next=98945<br>28077.8ms:wait_assignment,attempts=10,joinTx=-,backoff=first_fast,next=98945<br>31357.3ms:assigned_telemetry,attempts=10,joinTx=-,backoff=first_fast,next=98945 | 6:gap=1000.0ms,events=0; 7:gap=1599.0ms,events=0 | fail | non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `27/27`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `4`
- Recovery budget denied: `78`
- Healthy service protected: `78`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
