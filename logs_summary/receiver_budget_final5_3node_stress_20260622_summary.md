# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_final5_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 6452.0 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 25973.0 | yes | yes | join_request_received, assign_sent, post_bind_first_telemetry | pass |
| 7 | `accepted` | 19790.1 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 10097.7 | 3:gap=1182.0ms,events=0; 6:gap=607.8ms,events=0; 7:gap=605.1ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 158->160(1),160->162(1),162->164(1),164->166(1),166->171(4),171->173(1),173->175(1),175->177(1),177->179(1),179->181(1),181->183(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=491.1ms,events=0; 7:gap=611.0ms,events=0 | pass | - |
| 6 | 1 | 1 | 115->122(6),122->124(1),124->127(2),127->129(1),129->132(2),132->134(1),134->137(2),137->139(1),139->142(2),142->144(1),144->147(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=659.1ms,events=0; 7:gap=510.7ms,events=0 | pass | - |
| 7 | 1 | 1 | 204->207(2),207->209(1),209->212(2),212->214(1),214->217(2),217->219(1),219->222(2),222->224(1),224->227(2),227->229(1),229->232(2),232->234(1) | - | - | 3:gap=671.6ms,events=0; 6:gap=616.0ms,events=0 | pass | - |
| 3 | 2 | 1 | 74->77(2),77->80(2),80->82(1),82->85(2),85->87(1),87->90(2),90->92(1),92->95(2),95->97(1),97->100(2) | - | - | 6:gap=869.3ms,events=0; 7:gap=587.6ms,events=0 | pass | - |
| 6 | 2 | 1 | 37->40(2),40->42(1),42->45(2),45->47(1),47->50(2),50->52(1),52->55(2),55->57(1),57->60(2),60->62(1) | - | - | 3:gap=795.9ms,events=0; 7:gap=793.4ms,events=0 | pass | - |
| 7 | 2 | 1 | 127->129(1),129->131(1),131->133(1),133->135(1),135->137(1),137->139(1),139->141(1),141->143(1),143->145(1),145->147(1),147->149(1),149->151(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=1196.4ms,events=0; 6:gap=587.7ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 243->254(10),254->0(1),0->2(1),2->4(1),4->6(1),6->8(1),8->10(1),10->12(1),12->14(1),14->16(1) | - | - | 6:gap=1085.6ms,events=0; 7:gap=1197.7ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join |

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
- Recovery budget used: `36`
- Recovery budget denied: `110`
- Healthy service protected: `110`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
