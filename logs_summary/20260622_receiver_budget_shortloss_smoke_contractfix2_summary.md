# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_shortloss_smoke_contractfix2.jsonl`

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
| 3 | `accepted` | 37132.8 | no | yes | join_request_received, assign_sent, post_bind_first_telemetry, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 47035.3 | no | yes | join_request_received, post_bind_first_telemetry | pass |
| 7 | `accepted` | 33687.2 | no | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 8792.7 | 3:gap=607.0ms,events=0; 6:gap=414.0ms,events=0; 7:gap=591.0ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 99->101(1),101->103(1),103->105(1),105->107(1),107->109(1),109->111(1),111->113(1),113->115(1),115->117(1),117->119(1),119->121(1),121->123(1),123->125(1),125->127(1),127->129(1) | - | - | 6:gap=413.0ms,events=0; 7:gap=409.0ms,events=0 | pass | - |
| 6 | 1 | 1 | 90->92(1),92->94(1),94->96(1),96->98(1),98->100(1),100->102(1),102->104(1),104->106(1),106->108(1),108->110(1),110->112(1),112->114(1),114->116(1),116->118(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=601.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |
| 7 | 1 | 1 | 211->213(1),213->215(1),215->217(1),217->219(1),219->221(1),221->223(1),223->225(1),225->227(1),227->229(1),229->231(1),231->233(1),233->235(1),235->237(1),237->239(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=600.0ms,events=0; 6:gap=403.0ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | - | join_request_received, assign_sent, join_ack_received, post_bind_first_telemetry | 27813.4 | 3175.7ms:backoff,attempts=1,joinTx=-,backoff=first_fast,next=89322<br>7060.0ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=91934<br>10223.1ms:wait_assignment,attempts=4,joinTx=-,backoff=first_fast,next=94837<br>13382.7ms:wait_assignment,attempts=5,joinTx=-,backoff=first_fast,next=97683<br>16619.7ms:wait_assignment,attempts=6,joinTx=-,backoff=first_fast,next=100437<br>19768.7ms:backoff,attempts=7,joinTx=-,backoff=first_fast,next=106112<br>23964.9ms:wait_assignment,attempts=9,joinTx=-,backoff=first_fast,next=108843<br>27211.7ms:assigned_telemetry,attempts=9,joinTx=-,backoff=first_fast,next=108843 | 6:gap=600.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 83->3(175) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 10823.5 | 4191.7ms:wait_assignment,attempts=2,joinTx=-,backoff=first_fast,next=124167<br>7421.4ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=126955<br>10595.8ms:assigned_telemetry,attempts=3,joinTx=-,backoff=first_fast,next=126955 | 3:gap=600.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |
| 7 | `accepted` | `accepted` | - | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 8249.4 | 4222.4ms:wait_assignment,attempts=2,joinTx=-,backoff=first_fast,next=142547<br>7466.7ms:assigned_telemetry,attempts=2,joinTx=-,backoff=first_fast,next=142547 | 3:gap=1200.0ms,events=0; 6:gap=800.0ms,events=0 | pass | - |

## Transport Health

- Command ACK coverage: `35/35`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `38`
- Recovery budget denied: `173`
- Healthy service protected: `173`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`READY FOR 4 DRONES`
