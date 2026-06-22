# Multi-Drone Stress Summary

- TeleGC: `COM16`
- Nodes: `3=http://192.168.68.107:8080, 6=http://192.168.68.111:8080, 7=http://192.168.68.100:8080`
- Loss cycles: `9`
- Log: `logs_summary\20260622_receiver_budget_final_abuse_3node_contractfix2.jsonl`

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
| 3 | `accepted` | 26278.8 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent | pass |
| 6 | `accepted` | 15218.3 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, telemetry_period_locked | pass |
| 7 | `accepted` | 20972.3 | yes | yes | join_request_received, post_bind_first_telemetry, assign_sent, join_ack_received, telemetry_period_locked, assignment_completed | pass |

## Bind Button Non-Disruption

- Verdict: `pass`

| Run | Duration ms | Per-node max gap/events | Pass | Failures |
|---:|---:|---|---|---|
| 1 | 15773.9 | 3:gap=800.0ms,events=0; 6:gap=869.0ms,events=0; 7:gap=800.0ms,events=0 | pass | - |

## RF-Loss Only Matrix

- Verdict: `fail`

| Target | Cycles | Trial | Target gaps | Short-loss events | Rejoin events | Non-target stability | Pass | Failures |
|---:|---:|---:|---|---|---|---|---|---|
| 3 | 1 | 1 | 90->93(2),93->96(2),96->99(2),99->102(2),102->105(2),105->108(2),108->111(2),111->114(2),114->117(2) | short_loss_guard_started, short_loss_recovered | - | 6:gap=600.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |
| 6 | 1 | 1 | 222->225(2),225->228(2),228->231(2),231->234(2),234->237(2),237->240(2),240->243(2),243->246(2),246->249(2) | - | - | 3:gap=601.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |
| 7 | 1 | 1 | 189->192(2),192->195(2),195->198(2),198->201(2),201->204(2),204->207(2),207->210(2),210->213(2),213->216(2) | - | - | 3:gap=601.0ms,events=0; 6:gap=600.0ms,events=0 | pass | - |
| 3 | 2 | 1 | 203->206(2),206->209(2),209->212(2),212->215(2),215->218(2),218->221(2),221->224(2),224->227(2) | - | - | 6:gap=800.0ms,events=0; 7:gap=606.0ms,events=0 | pass | - |
| 6 | 2 | 1 | 81->84(2),84->87(2),87->90(2),90->93(2),93->96(2),96->99(2),99->102(2),102->105(2),105->108(2) | short_loss_guard_started, short_loss_recovered | - | 3:gap=608.0ms,events=0; 7:gap=600.0ms,events=0 | pass | - |
| 7 | 2 | 1 | 44->47(2),47->50(2),50->53(2),53->56(2),56->59(2),59->62(2),62->65(2),65->68(2),68->71(2),71->74(2) | - | - | 3:gap=608.0ms,events=0; 6:gap=600.0ms,events=0 | pass | - |
| 3 | 4 | 1 | - | short_loss_guard_started | - | 6:gap=600.0ms,events=0; 7:gap=800.0ms,events=0 | fail | target_not_fresh_after_rf_loss |

## Broken-Link Recovery

| Target | RF loss ACK | Restart ACK | Observed sequence gaps | Rebind milestones | Restart -> telemetry ms | Drone JOIN/status samples | Non-target stability | Pass | Failures |
|---:|---|---|---|---|---:|---|---|---|---|
| 3 | `accepted` | `accepted` | - | - | - | 64808.7ms:backoff,attempts=15,joinTx=-,backoff=retry_normal,next=202836<br>68917.5ms:wait_assignment,attempts=16,joinTx=-,backoff=retry_normal,next=202836<br>72191.0ms:backoff,attempts=16,joinTx=-,backoff=retry_normal,next=209785<br>75832.5ms:wait_assignment,attempts=17,joinTx=-,backoff=retry_normal,next=209785<br>79080.0ms:backoff,attempts=17,joinTx=-,backoff=retry_normal,next=217748<br>82376.2ms:backoff,attempts=17,joinTx=-,backoff=retry_normal,next=217748<br>85445.0ms:wait_assignment,attempts=18,joinTx=-,backoff=retry_normal,next=217748<br>88678.8ms:backoff,attempts=18,joinTx=-,backoff=retry_normal,next=223982 | 6:gap=414.0ms,events=0; 7:gap=412.0ms,events=0 | fail | target_not_online_before_rebind_timeout, missing_rebind_milestones_after_restart_join |

## Transport Health

- Command ACK coverage: `54/54`
- Missing ACKs: `-`
- Rejected commands: `0`
- MaGC ACK timeouts: `0`
- Inter-GC forward failures: `0`
- Malformed serial JSON: `1`
- Suspicious serial fragments: `0`
- Max reliable queue depth: `0`
- Max event outbox depth: `0`
- Event drop counters: `{"eventOutboxDroppedHigh": 0, "eventOutboxDroppedLow": 0, "eventOutboxDroppedMedium": 0, "eventOutboxNonJsonDropped": 0, "reliableQueueFullDrops": 0}`
- Recovery budget used: `3`
- Recovery budget denied: `24`
- Healthy service protected: `24`
- Receiver overload events/statuses: `0`
- Transport verdict: `fail`
- Transport failures: `malformed_serial_json`

## Final Verdict

`NOT READY FOR 4 DRONES`
