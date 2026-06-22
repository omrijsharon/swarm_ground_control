# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_handoff3.jsonl`

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
| 3 | `accepted` | 6537.0 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 24549.2 | yes | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | pass |
| 7 | `accepted` | 14924.9 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 10003.5 | 3:gap=406.0ms,events=0; 6:gap=434.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 151->153(1),153->155(1),155->157(1),157->159(1),159->161(1),161->163(1),163->165(1),165->167(1),167->169(1),169->171(1),171->173(1),173->175(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=406.0ms,events=0; 7:gap=404.0ms,events=0 | pass | - |
| 6 | 1 | 1 | 121->123(1),123->125(1),125->127(1),127->129(1),129->131(1),131->133(1),133->135(1),135->137(1),137->139(1),139->141(1),141->143(1),143->145(1),145->147(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=401.0ms,events=0; 7:gap=405.0ms,events=0 | pass | - |
| 7 | 1 | 1 | 220->222(1),222->224(1),224->226(1),226->228(1),228->230(1),230->232(1),232->234(1),234->236(1),236->238(1),238->240(1),240->242(1),242->244(1),244->246(1),246->248(1),248->250(1) | - | - | 3:gap=402.0ms,events=0; 6:gap=408.0ms,events=0 | pass | - |
| 3 | 2 | 1 | 63->69(5),69->71(1),71->73(1),73->75(1),75->77(1),77->79(1),79->81(1),81->83(1),83->85(1),85->87(1),87->89(1),89->91(1),91->93(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=406.0ms,events=0; 7:gap=404.0ms,events=0 | pass | - |
| 6 | 2 | 1 | 33->39(5),39->41(1),41->43(1),43->45(1),45->47(1),47->49(1),49->51(1),51->53(1),53->55(1),55->57(1),57->59(1),59->61(1),61->63(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=400.0ms,events=0; 7:gap=404.0ms,events=0 | pass | - |
| 7 | 2 | 1 | 136->142(5),142->144(1),144->146(1),146->148(1),148->150(1),150->152(1),152->154(1),154->156(1),156->158(1),158->160(1),160->162(1),162->164(1),164->166(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=600.0ms,events=0; 6:gap=409.0ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 235->245(9),245->247(1),247->249(1),249->251(1),251->253(1),253->255(1),255->1(1),1->3(1),3->5(1),5->7(1),7->9(1) | - | - | 64959.4ms:backoff,attempts=10,joinTx=-,backoff=retry_normal,next=178951<br>68859.4ms:wait_assignment,attempts=11,joinTx=-,backoff=retry_normal,next=178951<br>72054.5ms:backoff,attempts=11,joinTx=-,backoff=retry_normal,next=185421<br>75330.8ms:wait_assignment,attempts=12,joinTx=-,backoff=retry_normal,next=185421<br>78525.1ms:backoff,attempts=12,joinTx=-,backoff=retry_normal,next=193036<br>82941.7ms:wait_assignment,attempts=13,joinTx=-,backoff=retry_normal,next=193036<br>86131.5ms:backoff,attempts=13,joinTx=-,backoff=retry_normal,next=200480<br>90386.4ms:wait_assignment,attempts=14,joinTx=-,backoff=retry_normal,next=200480 | 6:gap=1200.0ms,events=0; 7:gap=1805.0ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `50/50`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `2`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `33`
- Recovery budget denied: `45`
- Healthy service protected: `45`
- Receiver overload events/statuses: `0`
- Transport verdict: `fail`
- Transport failures: `suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
