# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\receiver_budget_final4_3node_stress_20260622.jsonl`

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
| 3 | `accepted` | 32881.8 | no | yes | join_request_received, assign_sent, post_bind_first_telemetry, telemetry_period_locked | pass |
| 6 | `accepted` | 19505.3 | yes | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry, telemetry_period_locked | pass |
| 7 | `accepted` | 26269.1 | yes | yes | join_request_received, assign_sent, join_ack_received, assignment_completed, post_bind_first_telemetry, telemetry_period_locked | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 10212.4 | 3:gap=818.7ms,events=0; 6:gap=746.3ms,events=0; 7:gap=619.8ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `pass`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 62->65(2),65->68(2),68->71(2),71->74(2),74->77(2),77->80(2),80->83(2),83->86(2),86->89(2) | - | - | 6:gap=745.9ms,events=0; 7:gap=706.5ms,events=0 | pass | - |
| 6 | 1 | 1 | 194->197(2),197->200(2),200->203(2),203->206(2),206->209(2),209->212(2),212->215(2),215->218(2),218->221(2),221->224(2) | - | - | 3:gap=786.0ms,events=0; 7:gap=616.3ms,events=0 | pass | - |
| 7 | 1 | 1 | 221->224(2),224->227(2),227->230(2),230->233(2),233->236(2),236->239(2),239->242(2),242->245(2),245->248(2) | - | - | 3:gap=786.2ms,events=0; 6:gap=750.1ms,events=0 | pass | - |
| 3 | 2 | 1 | 233->236(2),236->239(2),239->242(2),242->245(2),245->248(2),248->251(2),251->254(2),254->1(2),1->4(2),4->7(2) | - | - | 6:gap=747.1ms,events=0; 7:gap=615.9ms,events=0 | pass | - |
| 6 | 2 | 1 | 119->122(2),122->125(2),125->128(2),128->131(2),131->134(2),134->137(2),137->140(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=796.9ms,events=0; 7:gap=786.4ms,events=0 | pass | - |
| 7 | 2 | 1 | 135->138(2),138->141(2),141->144(2),144->147(2),147->150(2),150->153(2),153->156(2),156->159(2),159->162(2),162->165(2) | - | - | 3:gap=747.0ms,events=0; 6:gap=810.5ms,events=0 | pass | - |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|
| 3 | `accepted` | `accepted` | 163->166(2),166->169(2),169->172(2),172->175(2),175->178(2),178->5(82),6->9(2),9->12(2),12->15(2) | post_bind_first_telemetry, telemetry_period_locked, join_request_received, assign_sent, join_ack_received, assignment_completed | 35264.8 | 6:gap=1413.5ms,events=0; 7:gap=1600.1ms,events=0 | fail | non_target_7_not_stable |

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
- Recovery budget used: `66`
- Recovery budget denied: `69`
- Healthy service protected: `69`
- Receiver overload events/statuses: `0`
- Transport verdict: `pass`
- Transport failures: `-`

## Final Verdict

`NOT READY FOR 4 DRONES`
