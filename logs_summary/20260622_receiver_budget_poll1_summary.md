# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_poll1.jsonl`

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
| 3 | `accepted` | 11820.6 | yes | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 6 | `accepted` | 18750.0 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent | pass |
| 7 | `accepted` | 6526.1 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 10012.3 | 3:gap=602.6ms,events=0; 6:gap=1269.7ms,events=0; 7:gap=584.5ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 91->93(1),93->95(1),95->97(1),97->99(1),99->101(1),101->103(1),103->105(1),105->107(1),107->109(1),109->111(1),111->113(1),113->115(1),115->117(1),117->119(1),119->121(1) | - | - | 6:gap=407.8ms,events=0; 7:gap=541.6ms,events=0 | pass | - |
| 6 | 1 | 1 | 114->116(1),116->118(1),118->120(1),120->122(1),122->124(1),124->126(1),126->128(1),128->130(1),130->132(1),132->134(1),134->136(1),136->138(1),138->140(1),140->142(1),142->144(1) | - | - | 3:gap=480.8ms,events=0; 7:gap=540.0ms,events=0 | pass | - |
| 7 | 1 | 1 | 236->238(1),238->240(1),240->242(1),242->244(1),244->246(1),246->248(1),248->250(1),250->252(1),252->254(1),254->0(1),0->2(1) | short_loss_guard_started, short_loss_recovered | - | 3:gap=1086.4ms,events=0; 6:gap=556.1ms,events=0 | pass | - |
| 3 | 2 | 1 | 7->12(4),12->14(1),14->16(1),16->18(1),18->20(1),20->22(1),22->24(1),24->26(1),26->28(1),28->30(1),30->32(1),32->34(1),34->36(1) | short_loss_guard_started, short_loss_recovered | - | 6:gap=492.2ms,events=0; 7:gap=599.0ms,events=0 | pass | - |
| 6 | 2 | 1 | 34->37(2),37->40(2),40->43(2),43->46(2),46->49(2),49->52(2),52->55(2),55->58(2),58->61(2) | - | - | 3:gap=799.2ms,events=0; 7:gap=707.5ms,events=0 | pass | - |
| 7 | 2 | 1 | 148->151(2),151->154(2),154->157(2),157->160(2),160->163(2),163->166(2),166->169(2),169->172(2),172->175(2),175->178(2) | - | - | 3:gap=601.3ms,events=0; 6:gap=605.1ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 191->193(1),193->195(1),195->197(1),197->199(1),199->201(1),201->203(1),203->205(1),205->207(1),207->209(1),209->3(49) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 47454.6 | 23922.7ms:wait_assignment,attempts=6,joinTx=-,backoff=retry_normal,next=127902<br>27057.4ms:backoff,attempts=6,joinTx=-,backoff=retry_normal,next=134241<br>30115.0ms:wait_assignment,attempts=7,joinTx=-,backoff=retry_normal,next=134241<br>33297.2ms:backoff,attempts=7,joinTx=-,backoff=retry_normal,next=141225<br>36927.4ms:wait_assignment,attempts=8,joinTx=-,backoff=retry_normal,next=141225<br>40154.9ms:backoff,attempts=8,joinTx=-,backoff=retry_normal,next=147901<br>43596.6ms:wait_assignment,attempts=9,joinTx=-,backoff=retry_normal,next=147901<br>46808.9ms:assigned_telemetry,attempts=9,joinTx=-,backoff=retry_normal,next=147901 | 6:gap=1993.1ms,events=0; 7:gap=1821.6ms,events=0 | fail | non_target_6_not_stable, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `37/37`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `32`
- Recovery budget denied: `52`
- Healthy service protected: `52`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
