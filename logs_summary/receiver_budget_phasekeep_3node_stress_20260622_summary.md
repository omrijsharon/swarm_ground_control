# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_phasekeep_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 20496.8 | yes | yes | join_request_received, post_bind_first_telemetry | pass |
| 6 | `accepted` | 6418.0 | yes | yes | join_request_received, post_bind_first_telemetry, telemetry_period_locked, assign_sent, join_ack_received, assignment_completed | pass |
| 7 | `accepted` | 14578.2 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `fail`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 9671.1 | 3:gap=2585.4ms,events=0; 6:gap=1638.7ms,events=0; 7:gap=1364.7ms,events=0 | fail | node_3_affected_by_bind, node_6_affected_by_bind |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 55->58(2),58->61(2),61->64(2),64->67(2),67->70(2),70->73(2),73->76(2),76->79(2),79->82(2),82->85(2) | - | - | 6:gap=615.9ms,events=0; 7:gap=780.8ms,events=0 | pass | - |
| 6 | 1 | 1 | 183->186(2),186->189(2),189->192(2),192->195(2),195->198(2),198->201(2),201->204(2),204->207(2),207->210(2) | - | - | 3:gap=781.3ms,events=0; 7:gap=780.9ms,events=0 | pass | - |
| 7 | 1 | 1 | 202->205(2),205->207(1),207->209(1),209->211(1),211->213(1),213->215(1),215->217(1),217->219(1),219->221(1),221->224(2),224->226(1),226->228(1),228->230(1) | - | - | 3:gap=2378.7ms,events=0; 6:gap=1674.9ms,events=0 | fail | non_target_3_not_stable, non_target_6_not_stable |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 237->239(1),239->248(8),248->250(1),250->252(1) | - | - | 6:gap=5003.4ms,events=0; 7:gap=1416.1ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join, non_target_6_not_stable |

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
- Recovery budget used: `232`
- Recovery budget denied: `214`
- Healthy service protected: `214`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
