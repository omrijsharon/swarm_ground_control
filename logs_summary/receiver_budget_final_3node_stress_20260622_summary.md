# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_final_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 21028.0 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 6667.0 | yes | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 13803.9 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 10195.6 | 3:gap=616.6ms,events=0; 6:gap=778.0ms,events=0; 7:gap=813.5ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 60->63(2),63->65(1),65->68(2),68->71(2),71->74(2),74->77(2),77->80(2),80->83(2),83->86(2),86->89(2) | - | - | 6:gap=802.5ms,events=0; 7:gap=914.3ms,events=0 | pass | - |
| 6 | 1 | 1 | 188->191(2),191->194(2),194->197(2),197->200(2),200->203(2),203->206(2),206->209(2),209->212(2),212->215(2) | - | - | 3:gap=601.4ms,events=0; 7:gap=600.4ms,events=0 | pass | - |
| 7 | 1 | 1 | 211->214(2),214->217(2),217->220(2),220->223(2),223->226(2),226->229(2),229->232(2),232->235(2),235->238(2) | - | - | 3:gap=665.0ms,events=0; 6:gap=606.6ms,events=0 | pass | - |
| 3 | 2 | 1 | 234->237(2),237->239(1),239->242(2),242->245(2),245->248(2),248->251(2),251->254(2),254->1(2),1->4(2) | - | - | 6:gap=800.0ms,events=0; 7:gap=910.3ms,events=0 | pass | - |
| 6 | 2 | 1 | 103->106(2),106->109(2),109->112(2),112->115(2),115->118(2),118->121(2),121->124(2),124->127(2),127->130(2),130->133(2) | - | - | 3:gap=601.6ms,events=0; 7:gap=602.1ms,events=0 | pass | - |
| 7 | 2 | 1 | 130->132(1),132->135(2),135->138(2),138->141(2),141->144(2),144->147(2),147->150(2),150->153(2),153->156(2) | - | - | 3:gap=997.3ms,events=0; 6:gap=1316.5ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 157->160(2),160->163(2),163->166(2),166->169(2),169->172(2),172->175(2) | - | - | 6:gap=2013.1ms,events=0; 7:gap=2790.6ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join, non_target_6_not_stable, non_target_7_not_stable |

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
- Recovery budget used: `23`
- Recovery budget denied: `71`
- Healthy service protected: `71`
- Receiver overload events/statuses: `0`
- Transport verdict: `fail`
- Transport failures: `suspicious_serial_fragment`

## Final Verdict

`NOT READY FOR 4 DRONES`
