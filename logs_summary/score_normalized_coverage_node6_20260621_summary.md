# Telemetry Coverage Summary

- TeleGC: `COM16`
- Node: `6`
- Duration: `60.0s`
- Warmup excluded: `8.0s` after startup delay
- Log: `logs_summary\score_normalized_coverage_node6_20260621.jsonl`

## Results
- Telemetry rows after warmup: 256
- Sequence gap events after warmup: 4
- Missing sequence IDs after warmup: 4
- Max sequence gap after warmup: 1
- Non-online link events: 0
- Telemetry interval: avg 204 ms, max 457 ms

## Latest GC Coverage Status
- telemetryCoverageMode: `telemetry_first`
- assignedRxCoveragePct: `99`
- assignedPacketsReceived: `486`
- assignedSequenceGapEvents: `6`
- assignedSequenceGaps: `6`
- assignedMaxGap: `1`
- assignedSlotMisses: `1`
- nonAssignedPreemptions: `0`
- nextAssignedSlackMs: `0`
- lastNonAssignedPreemptionReason: ``
- owedRxActive: `False`
- owedRxNodeId: `0`
- owedRxCount: `0`
- fairnessSkipCount: `3`
- fairnessOwedSelectedCount: `3`
- fairnessOwedMissedCount: `0`
- maxConsecutiveSchedulerSkips: `1`

## Owed-Packet Fairness
- Event counts: owed_rx_cleared=6, owed_rx_selected=6, rx_candidate_skipped=6
- Node 3: owed_rx_cleared=2, owed_rx_selected=2, rx_candidate_skipped=2
- Node 6: owed_rx_cleared=4, owed_rx_selected=4, rx_candidate_skipped=4
- Recent fairness events:
  - t+43.634s owed_rx_cleared node 6, owed 1, skips 1
  - t+53.237s rx_candidate_skipped node 6, selected 3, owed 1, skips 1
  - t+53.247s owed_rx_selected node 6, selected 6, owed 1, skips 1
  - t+53.363s rx_candidate_skipped node 3, selected 6, owed 1, skips 1
  - t+53.363s owed_rx_cleared node 6, owed 1, skips 1
  - t+53.393s owed_rx_selected node 3, selected 3, owed 1, skips 1
  - t+53.596s rx_candidate_skipped node 6, selected 3, owed 1, skips 1
  - t+53.645s owed_rx_cleared node 3, owed 1, skips 1
  - t+53.765s owed_rx_selected node 6, selected 6, owed 1, skips 1
  - t+53.828s owed_rx_cleared node 6, owed 1, skips 1

## Sequence Gaps
| Time s | From | To | Missing |
|---:|---:|---:|---|
| 43.185 | 148 | 150 | 149 |
| 43.634 | 150 | 152 | 151 |
| 53.377 | 199 | 201 | 200 |
| 53.834 | 201 | 203 | 202 |
