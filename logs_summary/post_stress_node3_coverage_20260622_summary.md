# Telemetry Coverage Summary

- TeleGC: `COM16`
- Node: `3`
- Duration: `45.0s`
- Warmup excluded: `12.0s` after startup delay
- Log: `logs_summary\post_stress_node3_coverage_20260622.jsonl`

## Results
- Telemetry rows after warmup: 33
- Sequence gap events after warmup: 33
- Missing sequence IDs after warmup: 145
- Max sequence gap after warmup: 93
- Non-online link events: 1
- Telemetry interval: avg 1436 ms, max 23521 ms

## Latest GC Coverage Status
- telemetryCoverageMode: `telemetry_first`
- assignedRxCoveragePct: `61`
- assignedPacketsReceived: `185`
- assignedSequenceGapEvents: `91`
- assignedSequenceGaps: `312`
- assignedMaxGap: `93`
- assignedSlotMisses: `116`
- nonAssignedPreemptions: `0`
- nextAssignedSlackMs: `52`
- lastNonAssignedPreemptionReason: ``
- owedRxActive: `True`
- owedRxNodeId: `3`
- owedRxCount: `1`
- fairnessSkipCount: `56`
- fairnessOwedSelectedCount: `46`
- fairnessOwedMissedCount: `0`
- maxConsecutiveSchedulerSkips: `3`

## Owed-Packet Fairness
- Event counts: owed_rx_cleared=55, owed_rx_selected=55, rx_candidate_skipped=64
- Node 3: owed_rx_cleared=32, owed_rx_selected=32, rx_candidate_skipped=41
- Node 6: owed_rx_cleared=1, owed_rx_selected=1, rx_candidate_skipped=1
- Node 7: owed_rx_cleared=22, owed_rx_selected=22, rx_candidate_skipped=22
- Recent fairness events:
  - t+51.555s owed_rx_cleared node 3, owed 1, skips 1
  - t+51.766s rx_candidate_skipped node 3, selected 7, owed 1, skips 1
  - t+51.954s owed_rx_selected node 3, selected 3, owed 1, skips 1
  - t+51.964s owed_rx_cleared node 3, owed 1, skips 1
  - t+52.247s rx_candidate_skipped node 3, selected 7, owed 1, skips 1
  - t+52.465s owed_rx_selected node 3, selected 3, owed 1, skips 1
  - t+52.465s owed_rx_cleared node 3, owed 1, skips 1
  - t+52.750s rx_candidate_skipped node 3, selected 7, owed 1, skips 1
  - t+52.958s owed_rx_selected node 3, selected 3, owed 1, skips 1
  - t+53.055s owed_rx_cleared node 3, owed 1, skips 1

## Sequence Gaps
| Time s | From | To | Missing |
|---:|---:|---:|---|
| 32.032 | 109 | 203 | 110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202 |
| 32.555 | 203 | 205 | 204 |
| 33.048 | 205 | 207 | 206 |
| 33.545 | 207 | 209 | 208 |
| 34.054 | 209 | 211 | 210 |
| 34.555 | 211 | 213 | 212 |
| 35.059 | 213 | 215 | 214 |
| 35.539 | 215 | 217 | 216 |
| 36.044 | 217 | 219 | 218 |
| 36.543 | 219 | 221 | 220 |
| 37.044 | 221 | 223 | 222 |
| 37.546 | 223 | 225 | 224 |
| 38.041 | 225 | 227 | 226 |
| 38.566 | 227 | 229 | 228 |
| 43.964 | 229 | 251 | 230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250 |
| 44.542 | 251 | 253 | 252 |
| 45.054 | 253 | 255 | 254 |
| 45.555 | 255 | 1 | 0 |
| 46.048 | 1 | 3 | 2 |
| 46.556 | 3 | 5 | 4 |

## Link Events
- t+13.700s offline: listen_window_expired
