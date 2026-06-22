# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_uncertainty_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 6751.5 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 18689.5 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 7 | `accepted` | 13200.9 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9776.2 | 3:gap=785.3ms,events=0; 6:gap=763.5ms,events=0; 7:gap=814.6ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 116->119(2),119->122(2),122->124(1),124->126(1),126->129(2),129->132(2),132->135(2),135->138(2),138->141(2),141->144(2),144->147(2) | - | - | 6:gap=810.2ms,events=0; 7:gap=793.8ms,events=0 | pass | - |
| 6 | 1 | 1 | 113->116(2),116->119(2),119->122(2),122->125(2),125->128(2),128->131(2),131->134(2),134->137(2),137->140(2) | short_loss_guard_started | - | 3:gap=784.1ms,events=0; 7:gap=816.5ms,events=0 | pass | - |
| 7 | 1 | 1 | 24->27(2),27->30(2),30->33(2),33->36(2),36->39(2),39->42(2),42->45(2),45->48(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=771.3ms,events=0; 6:gap=21841.6ms,events=0 | fail | non_target_6_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 118->121(2),121->124(2),124->127(2),127->130(2),130->133(2),133->135(1),135->138(2) | - | - | 6:gap=1407.6ms,events=0; 7:gap=1387.7ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join |

## Transport Health

- Command ACK coverage: `20/20`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `243`
- Recovery budget denied: `213`
- Healthy service protected: `213`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
