# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_handoff2.jsonl`

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
| 3 | `accepted` | 39872.7 | no | yes | join_request_received, assign_sent, post_bind_first_telemetry | pass |
| 6 | `accepted` | 6625.4 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 40033.6 | no | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9756.2 | 3:gap=779.0ms,events=0; 6:gap=991.3ms,events=0; 7:gap=766.2ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 57->59(1),59->61(1),61->63(1),63->65(1),65->67(1),67->69(1),69->71(1),71->73(1),73->75(1),75->77(1),77->79(1),79->81(1),81->83(1),83->85(1),85->87(1) | - | - | 6:gap=437.8ms,events=0; 7:gap=485.0ms,events=0 | pass | - |
| 6 | 1 | 1 | 25->27(1),27->29(1),29->31(1),31->33(1),33->35(1),35->37(1),37->39(1),39->41(1),41->43(1),43->45(1),45->47(1),47->49(1),49->51(1),51->53(1) | - | - | 3:gap=531.7ms,events=0; 7:gap=482.6ms,events=0 | pass | - |
| 7 | 1 | 1 | - | short_loss_guard_started, short_loss_recovered | - | 3:gap=931.1ms,events=0; 6:gap=467.5ms,events=0 | pass | - |
| 3 | 2 | 1 | 233->235(1),235->237(1),237->239(1),239->241(1),241->243(1),243->245(1),245->247(1),247->249(1),249->251(1),251->253(1),253->255(1),255->1(1),1->3(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=552.7ms,events=0; 7:gap=598.4ms,events=0 | pass | - |
| 6 | 2 | 1 | 195->200(4),200->202(1),202->204(1),204->206(1),206->208(1),208->210(1),210->212(1),212->214(1),214->216(1),216->218(1),218->220(1),220->222(1),222->224(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=586.9ms,events=0; 7:gap=514.1ms,events=0 | pass | - |
| 7 | 2 | 1 | - | short_loss_guard_started, short_loss_recovered | - | 3:gap=467.4ms,events=0; 6:gap=584.0ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 157->159(1),159->162(2),162->165(2),165->168(2),168->171(2),171->174(2),174->11(92),12->14(1),14->16(1),16->18(1) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 58276.7 | 34321.6ms:backoff,attempts=7,joinTx=-,backoff=retry_normal,next=164019<br>37435.0ms:backoff,attempts=7,joinTx=-,backoff=retry_normal,next=164019<br>40846.9ms:wait_assignment,attempts=8,joinTx=-,backoff=retry_normal,next=164019<br>45173.9ms:wait_assignment,attempts=9,joinTx=-,backoff=retry_normal,next=170376<br>48449.3ms:backoff,attempts=9,joinTx=-,backoff=retry_normal,next=176630<br>51679.9ms:wait_assignment,attempts=10,joinTx=-,backoff=retry_normal,next=176630<br>54871.4ms:assigned_telemetry,attempts=10,joinTx=-,backoff=retry_normal,next=176630<br>58061.0ms:assigned_telemetry,attempts=10,joinTx=-,backoff=retry_normal,next=176630 | 6:gap=1406.3ms,events=0; 7:gap=2092.1ms,events=0 | fail | non_target_7_not_stable |

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
- Recovery budget used: `58`
- Recovery budget denied: `156`
- Healthy service protected: `156`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
