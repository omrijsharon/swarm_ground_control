# Telemetry Coverage Summary

- TeleGC: `COM16`
- Node: `3`
- Duration: `60.0s`
- Warmup excluded: `10.0s` after startup delay
- Log: `logs_summary\forced_overlap_post_coverage_node3_20260621.jsonl`

## Results
- Telemetry rows after warmup: 126
- Sequence gap events after warmup: 126
- Missing sequence IDs after warmup: 126
- Max sequence gap after warmup: 1
- Non-online link events: 0
- Telemetry interval: avg 402 ms, max 810 ms

## Latest GC Coverage Status
- telemetryCoverageMode: `telemetry_first`
- assignedRxCoveragePct: `99`
- assignedPacketsReceived: `275`
- assignedSequenceGapEvents: `271`
- assignedSequenceGaps: `271`
- assignedMaxGap: `1`
- assignedSlotMisses: `1`
- nonAssignedPreemptions: `0`
- nextAssignedSlackMs: `70`
- lastNonAssignedPreemptionReason: ``
- owedRxActive: `True`
- owedRxNodeId: `6`
- owedRxCount: `1`
- fairnessSkipCount: `268`
- fairnessOwedSelectedCount: `267`
- fairnessOwedMissedCount: `0`
- maxConsecutiveSchedulerSkips: `1`

## Owed-Packet Fairness
- Event counts: owed_rx_cleared=311, owed_rx_selected=313, rx_candidate_skipped=313
- Node 3: owed_rx_cleared=155, owed_rx_selected=156, rx_candidate_skipped=156
- Node 6: owed_rx_cleared=156, owed_rx_selected=157, rx_candidate_skipped=157
- Recent fairness events:
  - t+67.659s owed_rx_selected node 3, selected 3, owed 1, skips 1
  - t+67.822s rx_candidate_skipped node 6, selected 3, owed 1, skips 1
  - t+67.822s owed_rx_cleared node 3, owed 1, skips 1
  - t+67.847s owed_rx_selected node 6, selected 6, owed 1, skips 1
  - t+68.042s rx_candidate_skipped node 3, selected 6, owed 1, skips 1
  - t+68.042s owed_rx_cleared node 6, owed 1, skips 1
  - t+68.218s owed_rx_selected node 3, selected 3, owed 1, skips 1
  - t+68.218s rx_candidate_skipped node 6, selected 3, owed 1, skips 1
  - t+68.231s owed_rx_cleared node 3, owed 1, skips 1
  - t+68.243s owed_rx_selected node 6, selected 6, owed 1, skips 1

## Sequence Gaps
| Time s | From | To | Missing |
|---:|---:|---:|---|
| 18.226 | 86 | 88 | 87 |
| 18.649 | 88 | 90 | 89 |
| 19.036 | 90 | 92 | 91 |
| 19.432 | 92 | 94 | 93 |
| 19.841 | 94 | 96 | 95 |
| 20.236 | 96 | 98 | 97 |
| 20.633 | 98 | 100 | 99 |
| 21.042 | 100 | 102 | 101 |
| 21.447 | 102 | 104 | 103 |
| 21.835 | 104 | 106 | 105 |
| 22.231 | 106 | 108 | 107 |
| 22.639 | 108 | 110 | 109 |
| 23.036 | 110 | 112 | 111 |
| 23.431 | 112 | 114 | 113 |
| 23.833 | 114 | 116 | 115 |
| 24.251 | 116 | 118 | 117 |
| 24.639 | 118 | 120 | 119 |
| 25.035 | 120 | 122 | 121 |
| 25.431 | 122 | 124 | 123 |
| 25.839 | 124 | 126 | 125 |
