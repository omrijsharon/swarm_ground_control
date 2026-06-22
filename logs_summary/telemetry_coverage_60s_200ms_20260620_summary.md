# Telemetry Coverage Summary

- TeleGC: `COM16`
- Node: `7`
- Duration: `60.0s`
- Warmup excluded: `5.0s` after startup delay
- Log: `logs_summary\telemetry_coverage_60s_200ms_20260620.jsonl`

## Results
- Telemetry rows after warmup: 221
- Sequence gap events after warmup: 3
- Missing sequence IDs after warmup: 8
- Max sequence gap after warmup: 6
- Non-online link events: 1
- Telemetry interval: avg 206 ms, max 1384 ms

## Latest GC Coverage Status
- telemetryCoverageMode: `telemetry_first`
- assignedRxCoveragePct: `82`
- assignedPacketsReceived: `173`
- assignedSequenceGapEvents: `2`
- assignedSequenceGaps: `7`
- assignedMaxGap: `6`
- assignedSlotMisses: `37`
- nonAssignedPreemptions: `0`
- nextAssignedSlackMs: `977`
- lastNonAssignedPreemptionReason: ``

## Sequence Gaps
| Time s | From | To | Missing |
|---:|---:|---:|---|
| 21.020 | 0 | 2 | 1 |
| 27.130 | 31 | 33 | 32 |
| 29.025 | 35 | 42 | 36,37,38,39,40,41 |

## Link Events
- t+11.222s offline: persisted_assignment_not_seen_on_boot
