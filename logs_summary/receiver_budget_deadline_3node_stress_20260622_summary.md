# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_deadline_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 22210.4 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 6591.5 | yes | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 14499.6 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9740.5 | 3:gap=594.2ms,events=0; 6:gap=1522.1ms,events=0; 7:gap=602.3ms,events=0 | fail | node_6_affected_by_bind |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 55->57(1),57->59(1),59->61(1),61->63(1),63->65(1),65->67(1),67->69(1),69->71(1),71->73(1),73->75(1),75->77(1),77->79(1),79->81(1),81->83(1),83->85(1) | - | - | 6:gap=579.6ms,events=0; 7:gap=545.7ms,events=0 | pass | - |
| 6 | 1 | 1 | 196->198(1),198->200(1),200->202(1),202->205(2),205->207(1),208->210(1),210->212(1),212->214(1),214->216(1),216->218(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=668.7ms,events=0; 7:gap=626.0ms,events=0 | pass | - |
| 7 | 1 | 1 | 207->209(1),209->211(1),211->213(1),213->215(1),215->217(1),217->219(1),219->221(1),221->223(1),223->225(1),225->227(1),227->229(1),229->231(1),231->233(1),233->235(1),235->237(1) | - | - | 3:gap=421.8ms,events=0; 6:gap=421.6ms,events=0 | pass | - |
| 3 | 2 | 1 | 235->237(1),237->239(1),239->241(1),241->243(1),243->245(1),245->247(1),247->249(1),249->251(1),251->253(1),253->255(1),255->1(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=1614.1ms,events=0; 7:gap=582.1ms,events=0 | fail | non_target_6_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 29->40(10),40->42(1),42->44(1),44->46(1),46->48(1),48->50(1),50->52(1),52->54(1),54->56(1),56->58(1) | - | - | 6:gap=2411.1ms,events=0; 7:gap=1016.5ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join, non_target_6_not_stable |

## Transport Health

- Command ACK coverage: `21/21`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `198`
- Recovery budget denied: `221`
- Healthy service protected: `221`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
