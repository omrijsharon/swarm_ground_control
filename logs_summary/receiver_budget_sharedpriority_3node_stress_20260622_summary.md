# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_sharedpriority_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 8843.9 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 87.8 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 7 | `accepted` | 16321.8 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9956.9 | 3:gap=1063.4ms,events=0; 6:gap=3177.4ms,events=0; 7:gap=998.1ms,events=0 | fail | node_6_affected_by_bind |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 134->136(1),136->138(1),138->140(1),140->142(1),142->144(1),144->146(1),146->148(1),148->150(1),150->152(1),152->154(1),154->156(1),156->158(1),158->160(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=470.9ms,events=0; 7:gap=612.3ms,events=0 | pass | - |
| 6 | 1 | 1 | 117->119(1),119->121(1),121->123(1),123->125(1),125->127(1),127->129(1),129->131(1),131->133(1),133->135(1),135->137(1),137->139(1),139->141(1),141->143(1),143->145(1),145->147(1) | - | - | 3:gap=461.9ms,events=0; 7:gap=411.4ms,events=0 | pass | - |
| 7 | 1 | 1 | 205->207(1),207->209(1),209->211(1),211->213(1),213->215(1),215->217(1),217->219(1),219->221(1),221->223(1),223->225(1),225->227(1),227->229(1),229->231(1),231->233(1),233->235(1) | - | - | 3:gap=460.2ms,events=0; 6:gap=411.1ms,events=0 | pass | - |
| 3 | 2 | 1 | 51->53(1),53->55(1),55->57(1),57->59(1),59->61(1),61->63(1),63->65(1),65->67(1),67->69(1),69->71(1),71->73(1),73->75(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=602.5ms,events=0; 7:gap=511.6ms,events=0 | pass | - |
| 6 | 2 | 1 | 42->44(1),44->46(1),46->48(1),48->50(1),50->52(1),52->54(1),54->56(1),56->58(1),58->60(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=1077.5ms,events=0; 7:gap=998.2ms,events=0 | pass | - |
| 7 | 2 | 1 | 122->125(2),125->127(1),127->129(1),129->131(1),134->139(4),139->141(1),141->143(1),143->146(2),146->148(1),148->150(1),150->152(1) | - | - | 3:gap=1071.9ms,events=0; 6:gap=2999.3ms,events=0 | fail | non_target_6_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 218->229(10),230->232(1),232->234(1),234->236(1),236->238(1),238->240(1),240->242(1),242->244(1),244->246(1),246->248(1) | - | - | 6:gap=1403.7ms,events=0; 7:gap=2806.7ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `23/23`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `2`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `394`
- Recovery budget denied: `146`
- Healthy service protected: `146`
- Receiver overload events/statuses: `0`
- Transport verdict: `fail`
- Transport failures: `suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
