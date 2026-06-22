# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\non_disruptive_bind_3node_full_stress_after_linkstate_fix_20260622.jsonl`

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
| 3 | `accepted` | 14773.5 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 23044.0 | yes | yes | join_request_received, assign_sent, post_bind_first_telemetry, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 8441.5 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 15798.6 | 3:gap=2249.9ms,events=0; 6:gap=4011.7ms,events=0; 7:gap=1282.5ms,events=0 | fail | node_3_affected_by_bind, node_6_affected_by_bind |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 104->106(1),106->108(1),108->110(1),110->112(1),112->114(1),114->116(1),116->118(1),118->120(1),120->122(1),122->124(1),124->126(1),126->128(1),128->130(1) | - | - | 6:gap=749.4ms,events=0; 7:gap=623.1ms,events=0 | pass | - |
| 6 | 1 | 1 | - | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=496.7ms,events=0; 7:gap=703.4ms,events=0 | pass | - |
| 7 | 1 | 1 | 225->230(4),232->234(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=683.0ms,events=0; 6:gap=628.4ms,events=0 | pass | - |
| 3 | 1 | 2 | 247->249(1),249->251(1),251->253(1),253->255(1),255->1(1),1->3(1),3->5(1),5->7(1),7->9(1),9->11(1),11->13(1),13->15(1),15->17(1),17->19(1) | - | - | 6:gap=646.6ms,events=0; 7:gap=586.9ms,events=0 | pass | - |
| 6 | 1 | 2 | - | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=495.1ms,events=0; 7:gap=703.3ms,events=0 | pass | - |
| 7 | 1 | 2 | 114->119(4) | short_loss_guard_started, short_loss_recovered | - | 3:gap=669.3ms,events=0; 6:gap=648.2ms,events=0 | pass | - |
| 3 | 1 | 3 | 136->138(1),138->140(1),140->142(1),142->144(1),144->146(1),146->148(1),148->150(1),150->152(1),152->154(1),154->156(1),156->158(1),158->160(1),160->162(1),162->164(1) | - | - | 6:gap=702.9ms,events=0; 7:gap=588.8ms,events=0 | pass | - |
| 6 | 1 | 3 | 170->172(1),172->174(1),174->176(1),176->178(1),178->180(1),180->182(1),182->184(1),184->186(1),186->188(1),188->190(1),190->192(1),192->194(1),194->196(1),196->198(1) | - | - | 3:gap=505.6ms,events=0; 7:gap=344.7ms,events=0 | pass | - |
| 7 | 1 | 3 | - | short_loss_guard_started, short_loss_recovered | - | 3:gap=706.5ms,events=0; 6:gap=589.1ms,events=0 | pass | - |
| 3 | 2 | 1 | 38->73(34) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 6:gap=554.7ms,events=0; 7:gap=419.7ms,events=0 | pass | - |
| 6 | 2 | 1 | - | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=521.6ms,events=0; 7:gap=689.1ms,events=0 | pass | - |
| 7 | 2 | 1 | - | short_loss_guard_started, short_loss_recovered | - | 3:gap=678.0ms,events=0; 6:gap=693.3ms,events=0 | pass | - |
| 3 | 2 | 2 | 206->209(2),209->211(1),211->213(1),213->215(1),215->217(1),217->219(1),219->221(1),221->223(1),223->225(1),225->227(1),227->229(1),229->231(1),231->233(1) | - | - | 6:gap=745.9ms,events=0; 7:gap=350.7ms,events=0 | pass | - |
| 6 | 2 | 2 | 220->0(35) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=520.0ms,events=0; 7:gap=704.9ms,events=0 | pass | - |
| 7 | 2 | 2 | 75->80(4) | short_loss_guard_started, short_loss_recovered | - | 3:gap=677.8ms,events=0; 6:gap=606.3ms,events=0 | pass | - |
| 3 | 2 | 3 | - | short_loss_guard_active, short_loss_recovered | - | 6:gap=610.7ms,events=0; 7:gap=391.8ms,events=0 | pass | - |
| 6 | 2 | 3 | - | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=495.3ms,events=0; 7:gap=701.6ms,events=0 | pass | - |
| 7 | 2 | 3 | 234->236(1),240->242(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=682.1ms,events=0; 6:gap=691.6ms,events=0 | pass | - |
| 3 | 4 | 1 | 243->24(36) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 6:gap=1002.2ms,events=0; 7:gap=458.2ms,events=0 | pass | - |
| 6 | 4 | 1 | - | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 3:gap=527.8ms,events=0; 7:gap=701.9ms,events=0 | pass | - |
| 7 | 4 | 1 | - | short_loss_guard_started, short_loss_recovered | - | 3:gap=1012.0ms,events=0; 6:gap=750.8ms,events=0 | pass | - |
| 3 | 4 | 2 | 190->192(1),192->194(1),194->196(1),196->198(1) | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 6:gap=1061.4ms,events=0; 7:gap=453.2ms,events=0 | pass | - |
| 6 | 4 | 2 | 185->221(35) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=496.3ms,events=0; 7:gap=703.8ms,events=0 | pass | - |
| 7 | 4 | 2 | - | short_loss_guard_started, short_loss_recovered | - | 3:gap=681.3ms,events=0; 6:gap=642.7ms,events=0 | pass | - |
| 3 | 4 | 3 | 61->98(36) | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 6:gap=996.6ms,events=0; 7:gap=454.8ms,events=0 | pass | - |
| 6 | 4 | 3 | - | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 3:gap=494.0ms,events=0; 7:gap=703.4ms,events=0 | pass | - |
| 7 | 4 | 3 | - | short_loss_guard_started, short_loss_recovered | - | 3:gap=752.4ms,events=0; 6:gap=898.6ms,events=0 | pass | - |
| 3 | 8 | 1 | - | short_loss_guard_started, short_loss_guard_active, short_loss_guard_expired | - | 6:gap=986.2ms,events=0; 7:gap=516.7ms,events=0 | pass | - |
| 6 | 8 | 1 | 246->248(1),248->250(1),250->252(1),252->254(1),254->0(1),0->2(1),2->4(1),4->6(1),6->8(1) | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 3:gap=1000.1ms,events=0; 7:gap=720.2ms,events=0 | pass | - |
| 7 | 8 | 1 | 83->92(8) | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 3:gap=2068.8ms,events=0; 6:gap=1067.7ms,events=0 | fail | non_target_3_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | - | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 10447.9 | 6:gap=1133.8ms,events=0; 7:gap=620.0ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 189->191(1),191->193(1),193->195(1),195->197(1),197->199(1),199->201(1),201->2(56) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 5026.6 | 3:gap=3012.7ms,events=0; 7:gap=864.2ms,events=0 | fail | non_target_3_not_stable |

## Transport Health

- Command ACK coverage: `53/53`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `1`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Transport verdict: `fail`
- Transport failures: `malformed_serial_json`

## Final Verdict

`NOT READY FOR 4 DRONES`
