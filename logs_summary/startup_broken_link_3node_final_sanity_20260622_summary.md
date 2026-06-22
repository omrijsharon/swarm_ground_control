# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\startup_broken_link_3node_final_sanity_20260622.jsonl`

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
| 3 | `accepted` | 24321.6 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 15514.6 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 8436.5 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 4->14(9),14->16(1),16->18(1),18->20(1),20->22(1),22->24(1),24->26(1),26->28(1),28->3(230) | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | 5991.0 | 6:gap=1004.9ms,events=0; 7:gap=730.9ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 105->115(9),115->117(1),117->119(1),119->121(1),121->123(1),123->125(1),125->127(1),127->129(1),129->3(129),4->20(15),20->22(1),22->24(1),24->26(1),26->33(6),33->41(7),41->43(1),43->51(7),51->54(2),54->56(1),56->60(3),60->68(7),68->70(1),70->78(7),78->80(1),80->82(1),82->90(7),90->98(7),98->100(1),100->108(7),108->116(7),116->118(1),118->121(2),121->123(1),123->132(8),132->134(1),134->142(7),142->146(3),146->154(7),154->162(7),162->170(7),170->172(1),172->180(7),180->182(1),182->186(3),186->188(1),188->196(7),196->198(1),198->202(3),202->204(1),204->206(1),206->208(1),208->210(1),210->212(1),212->214(1),214->216(1),216->218(1),218->220(1),220->222(1),222->224(1),224->227(2),227->229(1),229->231(1),231->233(1),233->235(1),235->237(1),237->239(1),239->241(1),241->243(1),243->245(1),245->247(1),247->249(1),249->251(1),251->253(1),253->255(1),255->1(1),1->3(1),3->5(1),5->7(1),7->10(2),10->12(1),12->14(1),14->16(1),16->18(1),18->20(1),20->22(1),22->24(1),24->26(1),26->28(1),28->30(1),30->32(1),32->34(1),34->36(1),36->38(1),38->40(1),40->42(1),42->44(1),44->46(1),46->48(1),48->50(1),50->52(1),52->54(1),54->56(1),56->58(1),58->60(1),60->62(1),62->64(1),64->66(1),66->68(1),68->70(1),70->72(1),72->74(1),74->76(1),76->78(1),78->80(1),80->82(1),82->84(1),84->86(1),86->88(1),88->90(1),90->92(1),92->94(1),94->96(1),96->98(1),98->100(1),100->102(1),102->104(1),104->106(1),106->108(1),108->110(1),110->112(1),112->114(1),114->116(1),116->118(1),118->120(1),120->122(1),122->124(1),124->126(1),126->134(7),134->136(1),136->148(11),148->150(1),150->152(1),152->154(1),154->156(1),156->158(1),158->160(1),160->162(1),162->164(1),164->166(1),166->168(1),168->171(2),171->173(1),173->175(1),175->177(1),177->179(1),179->181(1),181->183(1),183->185(1),185->187(1),187->189(1),189->191(1),191->193(1),193->195(1),195->197(1),197->199(1),199->201(1),201->203(1),203->205(1) | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, assignment_completed | - | 3:gap=1077.8ms,events=0; 7:gap=2496.5ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `13/13`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `1`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Transport verdict: `fail`
- Transport failures: `suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
