# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_final2_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 22895.0 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 16018.8 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |
| 7 | `accepted` | 6587.0 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9818.2 | 3:gap=800.4ms,events=0; 6:gap=832.9ms,events=0; 7:gap=886.7ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 56->59(2),59->62(2),62->65(2),65->68(2),68->71(2),71->74(2),74->77(2),77->80(2),80->83(2),83->86(2) | - | - | 6:gap=813.3ms,events=0; 7:gap=764.1ms,events=0 | pass | - |
| 6 | 1 | 1 | 149->152(2),152->155(2),155->158(2),158->161(2),161->164(2),164->167(2),167->170(2),170->173(2),173->176(2),176->179(2) | - | - | 3:gap=812.9ms,events=0; 7:gap=767.6ms,events=0 | pass | - |
| 7 | 1 | 1 | 0->3(2),3->6(2),6->9(2),9->12(2),12->15(2),15->18(2),18->21(2),21->24(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=616.3ms,events=0; 6:gap=790.3ms,events=0 | pass | - |
| 3 | 2 | 1 | 229->232(2),232->235(2),235->238(2),238->241(2),241->244(2),244->247(2),247->250(2),250->253(2),253->0(2),0->3(2) | - | - | 6:gap=791.1ms,events=0; 7:gap=610.0ms,events=0 | pass | - |
| 6 | 2 | 1 | 69->72(2),72->75(2),75->78(2),78->81(2),81->84(2),84->87(2),87->90(2),90->93(2) | - | - | 3:gap=614.2ms,events=0; 7:gap=804.1ms,events=0 | pass | - |
| 7 | 2 | 1 | 168->171(2),171->174(2),174->177(2),177->180(2),180->183(2),183->186(2),186->189(2),189->192(2),192->195(2),195->198(2) | - | - | 3:gap=812.2ms,events=0; 6:gap=800.9ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 157->160(2),160->163(2),163->166(2),166->169(2),169->172(2),172->175(2),175->21(101),22->26(3),26->29(2) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 105216.8 | 6:gap=2815.8ms,events=0; 7:gap=1996.1ms,events=0 | fail | non_target_6_not_stable, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `23/23`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `32`
- Recovery budget denied: `76`
- Healthy service protected: `76`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
