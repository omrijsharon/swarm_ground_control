# RF Loss Bench Summary

- TeleGC: `COM16`
- Drone: `COM13`
- Node: `7`
- Log: `logs_summary\rf_loss_short_guard_post_final_ota_smoke_20260620.jsonl`

## Per-Trial Results

| Lost packets | Trial | Result | Sim seq IDs | Pre-sim missing | Post-sim extra | Observed missing | Missing count | Extra missing | Gap ms | Cmd->resume ms | Link state events | Rebind events | Notes |
|---:|---:|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|
| 2 | 1 | PASS | 14,15 | 9,10,11,12,13 | - | 9,10,11,12,13,14,15 | 7 | +5 | 761 | 555 | 0 | 1 | - |

## Batch Summary

| Lost packets | Pass | Gap seen | Recovered | Non-online link events | Rebind trials | Rebind events | Avg pre-sim missing | Avg post-sim extra | Avg missing count | Std missing count | Avg extra missing | Max extra missing | Avg gap ms | Std gap ms | Max gap ms | Avg cmd->resume ms | Std cmd->resume ms |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 2 | 1/1 | 1/1 | 1/1 | 0 | 1/1 | 1 | 5 | 0 | 7 | 0 | +5 | +5 | 761 | 0 | 761 | 555 | 0 |

## Interpretation

- PASS means TeleGC observed the simulated sequence gap, telemetry resumed, and no non-online link status was emitted during the trial window.
- Rebind events are counted separately. For 2-5 missed packets, the desired behavior is normally no full bind; the link should bridge the short RF loss without user-visible interruption.
