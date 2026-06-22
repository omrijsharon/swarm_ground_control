# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\non_disruptive_bind_3node_abuse_20260621.jsonl`

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
| 3 | `accepted` | 8033.6 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |
| 6 | `accepted` | 31597.2 | no | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |
| 7 | `accepted` | 37439.7 | no | yes | join_request_received, post_bind_first_telemetry | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 10109.7 | 3:gap=2625.0ms,events=0; 6:gap=2868.7ms,events=0; 7:gap=3613.3ms,events=0 | fail | node_7_affected_by_bind |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 219->222(2),222->224(1),224->226(1),226->228(1),228->230(1),230->232(1),232->234(1),234->236(1),236->238(1),238->240(1),240->242(1),242->244(1),244->246(1),246->248(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=912.5ms,events=0; 7:gap=743.5ms,events=0 | pass | - |
| 6 | 1 | 1 | 178->180(1),180->182(1),182->184(1),184->186(1),186->188(1),188->190(1),190->192(1),192->194(1),194->196(1),196->198(1),198->200(1),200->202(1),202->204(1),204->206(1) | - | - | 3:gap=607.3ms,events=0; 7:gap=599.7ms,events=0 | pass | - |
| 7 | 1 | 1 | 207->209(1),209->211(1),211->213(1),213->215(1),215->217(1),217->219(1),219->221(1),221->223(1),223->225(1),225->227(1),227->229(1),229->231(1),231->233(1) | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 3:gap=865.6ms,events=0; 6:gap=675.9ms,events=0 | pass | - |
| 3 | 4 | 1 | 119->121(1),121->123(1),123->125(1),125->127(1),127->129(1),129->131(1),131->133(1),133->135(1),135->137(1),137->139(1),139->141(1),141->143(1) | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 6:gap=1888.4ms,events=0; 7:gap=1297.1ms,events=0 | pass | - |
| 6 | 4 | 1 | 79->82(2),82->84(1),84->86(1),86->88(1),88->90(1),90->92(1),92->94(1),94->96(1),96->98(1),98->100(1) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=1192.8ms,events=0; 7:gap=1040.6ms,events=0 | pass | - |
| 7 | 4 | 1 | 104->106(1),106->108(1),108->110(1),110->112(1),112->114(1),114->116(1),116->118(1),118->120(1),120->122(1),122->124(1),124->126(1) | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 3:gap=1048.9ms,events=0; 6:gap=805.8ms,events=0 | pass | - |
| 3 | 8 | 1 | 8->18(9),18->20(1),20->22(1),22->24(1),24->26(1),26->28(1),28->30(1),30->32(1),32->34(1),34->36(1) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 6:gap=865.1ms,events=0; 7:gap=944.3ms,events=0 | pass | - |
| 6 | 8 | 1 | 222->232(9),232->235(2),235->237(1),237->239(1),239->241(1),241->243(1),243->245(1),245->247(1),247->249(1) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=1197.2ms,events=0; 7:gap=1158.9ms,events=0 | pass | - |
| 7 | 8 | 1 | 249->2(8),2->4(1),4->6(1),6->9(2),9->11(1),11->13(1),13->15(1),15->17(1),17->19(1),19->21(1) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=1204.3ms,events=0; 6:gap=1292.3ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 168->170(1),170->172(1),172->174(1),174->176(1),176->178(1),178->180(1),180->182(1),182->2(75) | post_bind_first_telemetry, join_request_received, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | 5526.0 | 6:gap=1182.6ms,events=0; 7:gap=1386.6ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 144->146(1),146->148(1),148->150(1),150->152(1),152->154(1),154->156(1),156->158(1),158->0(97),0->5(4) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 5932.5 | 3:gap=2749.3ms,events=0; 7:gap=1755.9ms,events=0 | pass | - |
| 7 | `accepted` | `accepted` | - | - | - | 3:gap=110430.9ms,events=0; 6:gap=110828.3ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join, non_target_3_not_stable, non_target_6_not_stable |

## Transport Health

- Command ACK coverage: `30/30`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `4`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Transport verdict: `fail`
- Transport failures: `suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
