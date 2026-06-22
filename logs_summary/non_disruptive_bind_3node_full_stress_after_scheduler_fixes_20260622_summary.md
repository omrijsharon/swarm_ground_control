# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\non_disruptive_bind_3node_full_stress_after_scheduler_fixes_20260622.jsonl`

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
| 3 | `accepted` | 7942.3 | yes | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 14757.0 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |
| 7 | `accepted` | 22535.2 | yes | yes | join_request_received, post_bind_first_telemetry | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 15711.2 | 3:gap=897.7ms,events=6; 6:gap=1500.1ms,events=6; 7:gap=2271.1ms,events=2 | fail | node_3_affected_by_bind, node_6_affected_by_bind, node_7_affected_by_bind |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 126->128(1),128->130(1),130->132(1),132->134(1),134->136(1),136->138(1),138->140(1),140->142(1),142->144(1),144->146(1),146->148(1),148->150(1),150->152(1) | - | - | 6:gap=738.5ms,events=0; 7:gap=691.2ms,events=0 | pass | - |
| 6 | 1 | 1 | 150->152(1),152->154(1),154->156(1),156->158(1),158->160(1),160->162(1),162->164(1),164->166(1),166->168(1),168->170(1),170->172(1),172->174(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=592.5ms,events=0; 7:gap=688.7ms,events=0 | pass | - |
| 7 | 1 | 1 | 159->161(1),161->163(1),163->165(1),165->167(1),167->169(1),169->171(1),171->173(1),173->175(1),175->177(1),177->179(1),179->181(1),181->183(1),183->185(1),185->187(1) | - | - | 3:gap=509.9ms,events=0; 6:gap=676.4ms,events=0 | pass | - |
| 3 | 1 | 2 | 6->8(1),8->10(1),10->12(1),12->14(1),14->16(1),16->18(1),18->20(1),20->22(1),22->24(1),24->26(1),26->28(1),28->30(1),30->32(1),32->34(1) | - | - | 6:gap=677.8ms,events=0; 7:gap=502.4ms,events=0 | pass | - |
| 6 | 1 | 2 | 28->30(1),30->32(1),32->34(1),34->36(1),36->38(1),38->40(1),40->42(1),42->44(1),44->46(1),46->48(1),48->50(1),50->52(1),52->54(1),54->56(1) | - | - | 3:gap=502.9ms,events=0; 7:gap=701.8ms,events=0 | pass | - |
| 7 | 1 | 2 | 41->47(5),47->49(1),49->51(1),53->55(1),57->59(1),61->63(1),65->67(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=581.3ms,events=0; 6:gap=5780.6ms,events=0 | fail | non_target_6_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 236->238(1),238->240(1),240->242(1),242->244(1),244->246(1),246->248(1),248->0(7) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 7639.6 | 6:gap=1210.4ms,events=0; 7:gap=1000.8ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | - | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 9820.9 | 3:gap=545.7ms,events=0; 7:gap=591.3ms,events=0 | pass | - |
| 7 | `accepted` | `accepted` | 78->80(1),80->82(1),82->84(1),84->86(1),86->88(1),88->2(169),2->5(2) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 10897.7 | 3:gap=815.9ms,events=0; 6:gap=1114.9ms,events=0 | pass | - |

## Transport Health

- Command ACK coverage: `31/31`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
