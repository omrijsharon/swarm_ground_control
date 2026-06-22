# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_channel_guard_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 8756.8 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |
| 6 | `accepted` | 23051.2 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent | pass |
| 7 | `accepted` | 15844.0 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9769.6 | 3:gap=819.5ms,events=0; 6:gap=2196.8ms,events=0; 7:gap=1600.3ms,events=0 | fail | node_6_affected_by_bind, node_7_affected_by_bind |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 129->131(1),131->133(1),133->135(1),135->137(1),137->139(1),139->141(1),141->143(1),143->145(1),145->147(1),147->149(1),149->151(1),151->153(1),153->155(1),155->157(1) | - | - | 6:gap=410.3ms,events=0; 7:gap=411.9ms,events=0 | pass | - |
| 6 | 1 | 1 | 113->115(1),115->117(1),117->119(1),119->121(1),121->123(1),123->125(1),125->127(1),127->129(1),129->131(1),131->133(1),133->135(1),135->137(1),137->139(1),139->141(1),141->143(1) | - | - | 3:gap=461.9ms,events=0; 7:gap=413.0ms,events=0 | pass | - |
| 7 | 1 | 1 | - | short_loss_guard_started, short_loss_recovered | - | 3:gap=1461.8ms,events=0; 6:gap=1404.7ms,events=0 | pass | - |
| 3 | 2 | 1 | 84->91(6),91->98(6),98->105(6),105->112(6) | - | - | 6:gap=1206.4ms,events=0; 7:gap=Nonems,events=0 | fail | non_target_7_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 223->225(1),225->227(1),227->229(1),229->231(1),231->233(1),233->235(1),235->237(1),237->239(1),239->241(1),241->243(1),243->2(14),3->5(1) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 6171.2 | 6:gap=2329.8ms,events=0; 7:gap=1403.7ms,events=0 | fail | non_target_6_not_stable |

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
- Recovery budget used: `374`
- Recovery budget denied: `113`
- Healthy service protected: `113`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
