# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_rf4_guardfix3.jsonl`

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
| 3 | `accepted` | 73102.8 | no | no | join_request_received, assign_sent, post_bind_first_telemetry | pass |
| 6 | `accepted` | 45225.4 | no | yes | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent | pass |
| 7 | `accepted` | 53050.4 | no | yes | join_request_received, assign_sent, post_bind_first_telemetry, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9280.7 | 3:gap=412.0ms,events=0; 6:gap=800.0ms,events=0; 7:gap=993.0ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 4 | 1 | - | short_loss_guard_started, short_loss_guard_active, short_loss_recovered | - | 6:gap=600.0ms,events=0; 7:gap=599.0ms,events=0 | pass | - |
| 6 | 4 | 1 | 9->15(5),15->17(1),17->19(1),19->21(1),21->23(1),23->25(1),25->27(1),27->29(1),29->31(1),31->34(2),34->37(2),37->39(1),39->41(1),41->43(1),43->45(1),45->47(1),47->49(1) | - | - | 3:gap=800.0ms,events=0; 7:gap=1000.0ms,events=0 | pass | - |
| 7 | 4 | 1 | 9->15(5),16->18(1),18->21(2),21->24(2),24->27(2),27->30(2),30->33(2),33->36(2),36->39(2),39->42(2),42->45(2),45->48(2),48->51(2) | - | - | 3:gap=600.0ms,events=0; 6:gap=1000.0ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 198->4(61) | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed | 61984.1 | 38313.3ms:wait_assignment,attempts=12,joinTx=-,backoff=retry_normal,next=155676<br>41524.6ms:backoff,attempts=12,joinTx=-,backoff=retry_normal,next=163060<br>45467.3ms:wait_assignment,attempts=13,joinTx=-,backoff=retry_normal,next=163060<br>48659.5ms:backoff,attempts=13,joinTx=-,backoff=retry_normal,next=168822<br>51847.2ms:wait_assignment,attempts=14,joinTx=-,backoff=retry_normal,next=168822<br>55054.7ms:backoff,attempts=14,joinTx=-,backoff=retry_normal,next=175505<br>58261.3ms:wait_assignment,attempts=15,joinTx=-,backoff=retry_normal,next=175505<br>61462.6ms:assigned_telemetry,attempts=15,joinTx=-,backoff=retry_normal,next=175505 | 6:gap=1600.0ms,events=0; 7:gap=1600.0ms,events=0 | fail | non_target_6_not_stable, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `36/36`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `52`
- Recovery budget denied: `85`
- Healthy service protected: `85`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
