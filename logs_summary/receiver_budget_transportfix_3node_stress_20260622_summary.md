# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_transportfix_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 19695.6 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 25799.3 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked | pass |
| 7 | `accepted` | 12156.7 | yes | yes | post_bind_first_telemetry, join_request_received, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9804.9 | 3:gap=575.2ms,events=0; 6:gap=585.0ms,events=0; 7:gap=693.7ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 87->89(1),89->91(1),91->93(1),93->95(1),95->97(1),97->99(1),99->101(1),101->103(1),103->105(1),105->107(1),107->109(1),109->111(1),111->113(1),113->115(1),115->117(1) | - | - | 6:gap=421.8ms,events=0; 7:gap=445.2ms,events=0 | pass | - |
| 6 | 1 | 1 | 122->124(1),124->126(1),126->128(1),128->130(1),130->132(1),132->134(1),134->136(1),136->138(1),138->140(1),140->142(1),142->144(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=869.3ms,events=0; 7:gap=795.8ms,events=0 | pass | - |
| 7 | 1 | 1 | 240->242(1),242->244(1),244->246(1),246->248(1),248->250(1),250->252(1),252->254(1),254->0(1),0->2(1),2->4(1),4->6(1),6->8(1),8->10(1),10->12(1) | - | - | 3:gap=489.1ms,events=0; 6:gap=512.9ms,events=0 | pass | - |
| 3 | 2 | 1 | 9->13(3),13->15(1),15->17(1),17->19(1),19->21(1),21->23(1),23->25(1),25->27(1),27->29(1),29->31(1),31->33(1),33->35(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=1858.9ms,events=0; 7:gap=797.8ms,events=0 | fail | non_target_6_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 74->76(1),76->78(1),78->80(1),80->82(1),82->84(1),84->86(1),86->88(1),88->90(1),90->92(1) | - | - | 6:gap=3008.7ms,events=0; 7:gap=3798.9ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join, non_target_6_not_stable, non_target_7_not_stable |

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
- Recovery budget used: `379`
- Recovery budget denied: `144`
- Healthy service protected: `144`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
