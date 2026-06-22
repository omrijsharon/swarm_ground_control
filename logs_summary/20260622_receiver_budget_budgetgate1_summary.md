# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_budgetgate1.jsonl`

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
| 3 | `accepted` | 33820.1 | no | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 26697.1 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 9639.4 | yes | yes | join_request_received, assign_sent, post_bind_first_telemetry, telemetry_period_locked, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 8605.3 | 3:gap=608.0ms,events=0; 6:gap=1000.0ms,events=0; 7:gap=616.0ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 4 | 1 | 56->59(2),59->62(2),62->65(2),65->68(2),68->71(2),71->74(2),74->77(2),77->80(2),80->83(2),83->86(2),86->89(2) | - | - | 6:gap=617.0ms,events=0; 7:gap=1000.0ms,events=0 | pass | - |
| 6 | 4 | 1 | 133->136(2),136->139(2),139->142(2),142->144(1),144->146(1),146->149(2),149->152(2),152->154(1),154->156(1),156->159(2),159->162(2),162->164(1),164->167(2) | - | - | 3:gap=1189.0ms,events=0; 7:gap=801.0ms,events=0 | pass | - |
| 7 | 4 | 1 | 9->12(2),12->15(2),15->18(2),18->21(2),21->24(2),24->27(2),27->30(2),30->33(2),33->36(2),36->39(2),39->42(2) | - | - | 3:gap=614.0ms,events=0; 6:gap=1000.0ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 20->23(2),23->26(2) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 28283.6 | 7247.4ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=83583<br>10379.5ms:wait_assignment,attempts=4,joinTx=-,backoff=first_fast,next=86426<br>13513.3ms:wait_assignment,attempts=5,joinTx=-,backoff=first_fast,next=89264<br>16624.5ms:backoff,attempts=6,joinTx=-,backoff=first_fast,next=94817<br>19737.8ms:backoff,attempts=7,joinTx=-,backoff=first_fast,next=98066<br>22868.2ms:wait_assignment,attempts=8,joinTx=-,backoff=first_fast,next=98066<br>26066.1ms:assigned_telemetry,attempts=8,joinTx=-,backoff=first_fast,next=98066<br>29262.4ms:assigned_telemetry,attempts=8,joinTx=-,backoff=first_fast,next=98066 | 6:gap=1000.0ms,events=0; 7:gap=601.0ms,events=0 | pass | - |
| 6 | `accepted` | `accepted` | 153->183(29),183->12(84),13->15(1),15->17(1) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 49.0 | 10541.0ms:wait_assignment,attempts=4,joinTx=-,backoff=first_fast,next=123235<br>14888.3ms:wait_assignment,attempts=6,joinTx=-,backoff=first_fast,next=128761<br>18160.3ms:wait_assignment,attempts=7,joinTx=-,backoff=first_fast,next=131462<br>21465.5ms:wait_assignment,attempts=8,joinTx=-,backoff=first_fast,next=134278<br>25878.6ms:wait_assignment,attempts=10,joinTx=-,backoff=first_fast,next=139725<br>29457.5ms:wait_assignment,attempts=11,joinTx=-,backoff=retry_normal,next=143339<br>32671.6ms:assigned_telemetry,attempts=11,joinTx=-,backoff=retry_normal,next=143339<br>35903.5ms:assigned_telemetry,attempts=11,joinTx=-,backoff=retry_normal,next=143339 | 3:gap=1200.0ms,events=0; 7:gap=800.0ms,events=0 | pass | - |
| 7 | `accepted` | `accepted` | 230->5(30),6->8(1),8->10(1),10->12(1) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received | 16991.1 | 4251.4ms:wait_assignment,attempts=2,joinTx=-,backoff=first_fast,next=161915<br>7556.1ms:wait_assignment,attempts=3,joinTx=-,backoff=first_fast,next=164824<br>10702.4ms:wait_assignment,attempts=4,joinTx=-,backoff=first_fast,next=167583<br>13903.8ms:wait_assignment,attempts=5,joinTx=-,backoff=first_fast,next=170436<br>17169.5ms:assigned_telemetry,attempts=5,joinTx=-,backoff=first_fast,next=170436 | 3:gap=1210.0ms,events=0; 6:gap=800.0ms,events=0 | pass | - |

## Transport Health

- Command ACK coverage: `46/46`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `25`
- Recovery budget denied: `208`
- Healthy service protected: `208`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`READY FOR 4 DRONES`
