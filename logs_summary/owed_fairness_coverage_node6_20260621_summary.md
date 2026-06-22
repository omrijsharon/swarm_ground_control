# Telemetry Coverage Summary

- TeleGC: `COM16`
- Node: `6`
- Duration: `45.0s`
- Warmup excluded: `8.0s` after startup delay
- Log: `logs_summary\owed_fairness_coverage_node6_20260621.jsonl`

## Results
- Telemetry rows after warmup: 93
- Sequence gap events after warmup: 93
- Missing sequence IDs after warmup: 93
- Max sequence gap after warmup: 1
- Non-online link events: 0
- Telemetry interval: avg 403 ms, max 705 ms

## Latest GC Coverage Status
- telemetryCoverageMode: `telemetry_first`
- assignedRxCoveragePct: `98`
- assignedPacketsReceived: `194`
- assignedSequenceGapEvents: `192`
- assignedSequenceGaps: `194`
- assignedMaxGap: `2`
- assignedSlotMisses: `3`
- nonAssignedPreemptions: `0`
- nextAssignedSlackMs: `75`
- lastNonAssignedPreemptionReason: ``
- owedRxActive: `True`
- owedRxNodeId: `6`
- owedRxCount: `1`
- fairnessSkipCount: `95`
- fairnessOwedSelectedCount: `95`
- fairnessOwedMissedCount: `0`
- maxConsecutiveSchedulerSkips: `1`

## Owed-Packet Fairness
- Event counts: owed_rx_cleared=106, owed_rx_selected=106, rx_candidate_skipped=107
- Node 3: owed_rx_cleared=2, owed_rx_selected=2, rx_candidate_skipped=2
- Node 6: owed_rx_cleared=104, owed_rx_selected=104, rx_candidate_skipped=105
- Recent fairness events:
  - t+45.854s rx_candidate_skipped node 6, selected 3, owed 1, skips 1
  - t+46.046s owed_rx_selected node 6, selected 6, owed 1, skips 1
  - t+46.046s owed_rx_cleared node 6, owed 1, skips 1
  - t+46.254s rx_candidate_skipped node 6, selected 3, owed 1, skips 1
  - t+46.442s owed_rx_selected node 6, selected 6, owed 1, skips 1
  - t+46.442s owed_rx_cleared node 6, owed 1, skips 1
  - t+46.643s rx_candidate_skipped node 6, selected 3, owed 1, skips 1
  - t+46.839s owed_rx_selected node 6, selected 6, owed 1, skips 1
  - t+46.839s owed_rx_cleared node 6, owed 1, skips 1
  - t+47.045s rx_candidate_skipped node 6, selected 3, owed 1, skips 1

## Sequence Gaps
| Time s | From | To | Missing |
|---:|---:|---:|---|
| 10.257 | 245 | 247 | 246 |
| 10.649 | 247 | 249 | 248 |
| 11.056 | 249 | 251 | 250 |
| 11.440 | 251 | 253 | 252 |
| 11.849 | 253 | 255 | 254 |
| 12.195 | 255 | 1 | 0 |
| 12.445 | 1 | 3 | 2 |
| 13.044 | 3 | 5 | 4 |
| 13.457 | 5 | 7 | 6 |
| 13.844 | 7 | 9 | 8 |
| 14.254 | 9 | 11 | 10 |
| 14.651 | 11 | 13 | 12 |
| 15.057 | 13 | 15 | 14 |
| 15.446 | 15 | 17 | 16 |
| 15.845 | 17 | 19 | 18 |
| 16.247 | 19 | 21 | 20 |
| 16.651 | 21 | 23 | 22 |
| 17.039 | 23 | 25 | 24 |
| 17.457 | 25 | 27 | 26 |
| 17.846 | 27 | 29 | 28 |
