# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_margin_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 22226.3 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 14593.2 | yes | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 6477.3 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9838.9 | 3:gap=1001.2ms,events=0; 6:gap=925.5ms,events=0; 7:gap=1404.3ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 59->62(2),62->64(1),64->66(1),66->68(1),68->70(1),70->72(1),72->74(1),74->76(1),77->79(1),79->81(1),81->84(2),84->86(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=859.9ms,events=0; 7:gap=1402.3ms,events=0 | pass | - |
| 6 | 1 | 1 | 150->153(2),153->155(1),155->158(2),158->160(1),160->163(2),163->165(1),165->168(2),168->170(1),170->173(2),173->175(1),175->178(2),178->180(1) | - | - | 3:gap=424.0ms,events=0; 7:gap=684.0ms,events=0 | pass | - |
| 7 | 1 | 1 | 253->255(1),255->2(2),3->6(2),7->10(2),11->14(2),15->18(2),19->22(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=607.0ms,events=0; 6:gap=1146.3ms,events=0 | pass | - |
| 3 | 2 | 1 | 233->236(2),236->238(1),238->240(1),240->242(1),242->246(3),246->248(1),248->250(1),250->252(1),252->0(3),0->2(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=800.1ms,events=0; 7:gap=801.3ms,events=0 | pass | - |
| 6 | 2 | 1 | 66->72(5),72->74(1),74->76(1),76->78(1),78->80(1),80->85(4),85->87(1),87->89(1),89->91(1),91->93(1),93->95(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=604.3ms,events=0; 7:gap=473.9ms,events=0 | pass | - |
| 7 | 2 | 1 | 164->169(4),169->171(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=518.1ms,events=0; 6:gap=1229.0ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 155->157(1),157->159(1),159->161(1),161->163(1),163->165(1),165->167(1),167->169(1),169->172(2),172->174(1) | - | - | 6:gap=1006.0ms,events=0; 7:gap=1010.7ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join |

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
- Recovery budget used: `210`
- Recovery budget denied: `344`
- Healthy service protected: `344`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
