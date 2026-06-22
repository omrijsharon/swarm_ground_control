# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_handoff1.jsonl`

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
| 3 | `accepted` | 6738.7 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 22424.7 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 7 | `accepted` | 13235.3 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9864.2 | 3:gap=589.9ms,events=0; 6:gap=569.5ms,events=0; 7:gap=609.5ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 140->142(1),142->144(1),144->146(1),146->148(1),148->150(1),150->152(1),152->154(1),154->156(1),156->158(1),158->160(1),160->162(1),162->164(1),164->166(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=607.0ms,events=0; 7:gap=507.5ms,events=0 | pass | - |
| 6 | 1 | 1 | 114->116(1),116->118(1),118->120(1),120->122(1),122->124(1),124->126(1),126->128(1),128->130(1),130->132(1),132->134(1),134->136(1),136->138(1),138->140(1),140->142(1),142->144(1) | - | - | 3:gap=583.8ms,events=0; 7:gap=567.2ms,events=0 | pass | - |
| 7 | 1 | 1 | 220->222(1),222->224(1),224->226(1),226->228(1),228->230(1),230->232(1),232->234(1),234->236(1),236->238(1),238->240(1),240->242(1),242->244(1),244->246(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=585.4ms,events=0; 6:gap=510.8ms,events=0 | pass | - |
| 3 | 2 | 1 | 51->57(5),57->59(1),59->61(1),61->63(1),63->65(1),65->67(1),67->69(1),69->71(1),71->73(1),73->75(1),75->77(1),77->79(1),79->81(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=511.8ms,events=0; 7:gap=587.0ms,events=0 | pass | - |
| 6 | 2 | 1 | 29->35(5),35->37(1),37->39(1),39->41(1),41->43(1),43->45(1),45->47(1),47->49(1),49->51(1),51->53(1),53->55(1),55->57(1),57->59(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=585.2ms,events=0; 7:gap=502.3ms,events=0 | pass | - |
| 7 | 2 | 1 | 132->137(4),137->139(1),139->141(1),141->143(1),143->145(1),145->147(1),147->149(1),149->151(1),151->153(1),153->155(1),155->157(1),157->159(1),159->161(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=493.5ms,events=0; 6:gap=514.5ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 233->235(1),235->237(1),237->239(1),239->241(1),241->243(1),243->245(1),245->247(1),247->249(1),249->251(1),251->253(1),253->3(5) | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | 23554.6 | 3163.2ms:backoff,attempts=1,joinTx=-,backoff=first_fast,next=112293<br>7114.0ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=114863<br>10326.9ms:backoff,attempts=3,joinTx=-,backoff=retry_normal,next=119599<br>13704.4ms:wait_assignment,attempts=4,joinTx=-,backoff=retry_normal,next=119599<br>16875.2ms:backoff,attempts=4,joinTx=-,backoff=retry_normal,next=127259<br>20086.3ms:wait_assignment,attempts=5,joinTx=-,backoff=retry_normal,next=127259<br>23312.0ms:assigned_telemetry,attempts=5,joinTx=-,backoff=retry_normal,next=127259 | 6:gap=1224.9ms,events=0; 7:gap=1128.7ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 74->76(1),76->78(1),78->81(2),81->84(2),84->87(2),87->90(2),90->93(2),93->14(176),15->18(2) | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | 32257.9 | 7663.0ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=150210<br>11341.2ms:wait_assignment,attempts=4,joinTx=-,backoff=retry_normal,next=154188<br>14530.8ms:backoff,attempts=4,joinTx=-,backoff=retry_normal,next=160684<br>17830.2ms:wait_assignment,attempts=5,joinTx=-,backoff=retry_normal,next=160684<br>20987.9ms:backoff,attempts=5,joinTx=-,backoff=retry_normal,next=168290<br>24167.9ms:backoff,attempts=5,joinTx=-,backoff=retry_normal,next=168290<br>27335.3ms:wait_assignment,attempts=6,joinTx=-,backoff=retry_normal,next=168290<br>30610.3ms:assigned_telemetry,attempts=6,joinTx=-,backoff=retry_normal,next=168290 | 3:gap=2272.1ms,events=0; 7:gap=1404.9ms,events=0 | fail | non_target_3_not_stable |

## Transport Health

- Command ACK coverage: `41/41`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `64`
- Recovery budget denied: `130`
- Healthy service protected: `130`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
