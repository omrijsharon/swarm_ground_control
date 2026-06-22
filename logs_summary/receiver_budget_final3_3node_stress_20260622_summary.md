# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_final3_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 20595.0 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 6331.8 | yes | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 12988.6 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 10001.9 | 3:gap=616.4ms,events=0; 6:gap=617.6ms,events=0; 7:gap=837.8ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 59->62(2),62->65(2),65->68(2),68->71(2),71->74(2),74->77(2),77->80(2),80->83(2),83->86(2) | - | - | 6:gap=603.9ms,events=0; 7:gap=610.9ms,events=0 | pass | - |
| 6 | 1 | 1 | 185->188(2),188->191(2),191->194(2),194->197(2),197->200(2),200->203(2),203->206(2),206->209(2),209->212(2) | - | - | 3:gap=800.1ms,events=0; 7:gap=800.8ms,events=0 | pass | - |
| 7 | 1 | 1 | 209->212(2),212->215(2),215->218(2),218->221(2),221->224(2),224->227(2),227->230(2),230->233(2),233->236(2),236->239(2) | - | - | 3:gap=601.5ms,events=0; 6:gap=601.4ms,events=0 | pass | - |
| 3 | 2 | 1 | 232->235(2),235->238(2),238->241(2),241->244(2),244->247(2),247->250(2),250->253(2),253->0(2),0->3(2) | - | - | 6:gap=800.1ms,events=0; 7:gap=798.2ms,events=0 | pass | - |
| 6 | 2 | 1 | 104->107(2),107->110(2),110->113(2),113->116(2),116->119(2),119->122(2),122->125(2),125->128(2),128->131(2) | - | - | 3:gap=794.2ms,events=0; 7:gap=946.6ms,events=0 | pass | - |
| 7 | 2 | 1 | 130->133(2),133->136(2),136->139(2),139->142(2),142->145(2),145->148(2),148->151(2),151->154(2),154->157(2) | - | - | 3:gap=806.6ms,events=0; 6:gap=998.6ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 146->156(9),156->158(1),158->161(2),161->164(2),164->167(2),167->170(2),170->173(2),173->176(2),176->3(82) | join_request_received, assign_sent, post_bind_first_telemetry, join_ack_received, assignment_completed | 73718.1 | 6:gap=1813.3ms,events=0; 7:gap=1790.2ms,events=0 | fail | non_target_6_not_stable, non_target_7_not_stable |

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
- Recovery budget used: `41`
- Recovery budget denied: `23`
- Healthy service protected: `23`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
