# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_autoshared_refresh1.jsonl`

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
| 3 | `accepted` | 20112.7 | yes | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | pass |
| 6 | `accepted` | 6671.1 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, assignment_completed, telemetry_period_locked | pass |
| 7 | `accepted` | 13622.0 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked, join_ack_received, assignment_completed | pass |

## Bind Button Non-Disruption

- Not run.

## RF-Loss Only Matrix

- Not run.

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | 18->21(2),21->24(2),24->27(2),27->30(2),30->33(2),33->36(2),36->0(219),0->6(5) | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry | 6189.2 | 3109.8ms:wait_assignment,attempts=1,joinTx=-,backoff=first_fast,next=28093 | 6:gap=2584.0ms,events=0; 7:gap=2200.0ms,events=0 | fail | non_target_6_not_stable, non_target_7_not_stable |

## Transport Health

- Command ACK coverage: `12/12`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `0`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `29`
- Recovery budget denied: `35`
- Healthy service protected: `35`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
