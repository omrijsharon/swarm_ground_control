# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_deadline_gate_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 26435.0 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 8462.7 | yes | yes | post_bind_first_telemetry, join_request_received, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 17497.8 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 10032.1 | 3:gap=1224.4ms,events=0; 6:gap=808.2ms,events=0; 7:gap=1213.6ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 61->64(2),64->67(2),67->70(2),70->73(2),73->76(2),76->79(2),79->82(2),82->85(2),85->88(2) | - | - | 6:gap=802.4ms,events=0; 7:gap=614.4ms,events=0 | pass | - |
| 6 | 1 | 1 | 206->209(2),209->212(2),212->215(2),215->218(2),218->221(2),221->224(2),224->227(2),227->230(2),230->233(2) | - | - | 3:gap=955.0ms,events=0; 7:gap=601.9ms,events=0 | pass | - |
| 7 | 1 | 1 | 223->226(2),226->229(2),229->232(2),232->235(2),235->238(2),238->241(2),241->244(2),244->247(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=611.7ms,events=0; 6:gap=608.5ms,events=0 | pass | - |
| 3 | 2 | 1 | 234->237(2),237->240(2),240->243(2),243->246(2),246->249(2),249->252(2),252->255(2),255->2(2),2->5(2) | - | - | 6:gap=801.3ms,events=0; 7:gap=615.7ms,events=0 | pass | - |
| 6 | 2 | 1 | 123->126(2),126->129(2),129->132(2),132->135(2),135->138(2),138->141(2),141->144(2),144->147(2),147->150(2) | - | - | 3:gap=756.3ms,events=0; 7:gap=601.6ms,events=0 | pass | - |
| 7 | 2 | 1 | 140->143(2),143->146(2),146->149(2),149->152(2),152->155(2),155->158(2),158->161(2),161->164(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=602.6ms,events=0; 6:gap=610.8ms,events=0 | pass | - |
| 3 | 4 | 1 | 153->156(2),156->159(2),159->162(2),162->164(1),164->167(2),167->170(2),170->173(2),173->176(2) | - | - | 6:gap=795.4ms,events=0; 7:gap=1770.7ms,events=0 | fail | non_target_7_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 215->218(2),218->221(2),221->223(1),223->226(2),226->229(2),229->232(2),232->235(2),235->0(20),0->4(3) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 10766.0 | 6:gap=1411.4ms,events=0; 7:gap=1811.5ms,events=0 | fail | non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `24/24`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `97`
- Recovery budget denied: `44`
- Healthy service protected: `44`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
