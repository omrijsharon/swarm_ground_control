# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_defer1.jsonl`

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
| 3 | `accepted` | 6873.9 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |
| 6 | `accepted` | 13353.9 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |
| 7 | `accepted` | 22608.6 | yes | yes | join_request_received, post_bind_first_telemetry | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9658.4 | 3:gap=613.4ms,events=0; 6:gap=634.4ms,events=0; 7:gap=606.7ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 136->139(2),139->142(2),142->145(2),145->148(2),148->151(2),151->154(2),154->157(2),157->160(2),160->163(2) | - | - | 6:gap=614.4ms,events=0; 7:gap=699.0ms,events=0 | pass | - |
| 6 | 1 | 1 | 159->162(2),162->165(2),165->168(2),168->171(2),171->174(2),174->177(2),177->180(2),180->183(2),183->186(2),186->189(2) | - | - | 3:gap=601.3ms,events=0; 7:gap=601.4ms,events=0 | pass | - |
| 7 | 1 | 1 | 173->176(2),176->178(1),178->181(2),181->184(2),184->187(2),187->190(2),190->193(2),193->196(2),196->199(2),199->202(2) | - | - | 3:gap=890.0ms,events=0; 6:gap=799.8ms,events=0 | pass | - |
| 3 | 2 | 1 | 51->54(2),54->57(2),57->60(2),60->63(2),63->66(2),66->69(2),69->72(2),72->75(2),75->78(2),78->81(2) | - | - | 6:gap=613.2ms,events=0; 7:gap=601.2ms,events=0 | pass | - |
| 6 | 2 | 1 | 80->82(1),82->84(1),84->86(1),86->88(1),88->90(1),90->92(1),92->94(1),94->96(1),96->98(1),98->100(1),100->102(1),102->104(1),104->106(1) | - | - | 3:gap=792.9ms,events=0; 7:gap=985.6ms,events=0 | pass | - |
| 7 | 2 | 1 | 90->92(1),92->94(1),94->97(2),97->100(2),100->103(2),103->106(2),106->109(2),109->112(2),112->115(2),115->118(2) | - | - | 3:gap=612.3ms,events=0; 6:gap=610.6ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 234->237(2),237->241(3),241->244(2),244->247(2),247->250(2),250->253(2),253->7(9),8->10(1),10->12(1),12->14(1) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 25135.2 | 3192.3ms:backoff,attempts=1,joinTx=-,backoff=first_fast,next=112822<br>7263.4ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=115421<br>10438.5ms:backoff,attempts=3,joinTx=-,backoff=retry_normal,next=120712<br>13581.1ms:wait_assignment,attempts=4,joinTx=-,backoff=retry_normal,next=120712<br>16763.4ms:backoff,attempts=4,joinTx=-,backoff=retry_normal,next=127279<br>19959.4ms:wait_assignment,attempts=5,joinTx=-,backoff=retry_normal,next=127279<br>23183.7ms:assigned_telemetry,attempts=5,joinTx=-,backoff=retry_normal,next=127279 | 6:gap=1997.1ms,events=0; 7:gap=1809.8ms,events=0 | fail | non_target_6_not_stable, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `30/30`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `31`
- Recovery budget denied: `113`
- Healthy service protected: `113`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
