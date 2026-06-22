# RF Loss Bench Summary

- TeleGC: `COM16`
- Drone: `COM13`
- Node: `7`
- Log: `logs_summary\rf_loss_smoke_20260620.jsonl`

## Per-Trial Results

| Lost packets | Trial | Result | Sim seq IDs | Observed missing | Gap ms | Cmd->resume ms | Link state events | Rebind events | Notes |
|---:|---:|---|---|---|---:|---:|---:|---:|---|
| 2 | 1 | PASS | 23,24 | 14,15,16,17,18,19,20,21,22,23,24,25,26,27 | 813 | 718 | 0 | 1 | - |

## Batch Summary

| Lost packets | Pass | Gap seen | Recovered | Non-online link events | Rebind trials | Rebind events | Avg gap ms | Std gap ms | Max gap ms | Avg cmd->resume ms | Std cmd->resume ms |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2 | 1/1 | 1/1 | 1/1 | 0 | 1/1 | 1 | 813 | 0 | 813 | 718 | 0 |

## Interpretation

- PASS means TeleGC observed the simulated sequence gap, telemetry resumed, and no non-online link status was emitted during the trial window.
- Rebind events are counted separately. For 2-5 missed packets, the desired behavior is normally no full bind; the link should bridge the short RF loss without user-visible interruption.
