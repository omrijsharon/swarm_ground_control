# MaGC Bind Timing From Drone Reset

- Created: 2026-06-19T18:25:26+00:00
- Log: `logs_summary\bind_timing_reset_10_20260619.jsonl`
- TeleGC: `COM16`
- Drone: `COM13`
- Trials requested: 10
- Successful trials: 4
- Reset origin: host timestamp when `debug_reboot` is sent to the drone.
- MaGC 0% bind: first MaGC `join_request_received` / quiet bind-progress event.
- MaGC 100% bind: first MaGC `telemetry_period_locked` / complete bind-progress event.

## Trial Table

| Trial | Success | Reset->join mode s | Reset->JOIN TX s | Reset->0% s | Reset->100% s | 0%->100% s | Channel | Notes |
|---:|:---:|---:|---:|---:|---:|---:|---:|---|
| 1 | no | 2.078 | 34.468 | - | - | - | - | timeout |
| 2 | yes | 26.532 | 28.813 | 28.969 | 32.500 | 3.531 | 33 / 919 MHz | - |
| 3 | yes | 26.625 | 32.593 | 32.718 | 37.062 | 4.344 | 33 / 919 MHz | - |
| 4 | no | 26.578 | 31.312 | - | - | - | - | timeout |
| 5 | yes | 26.531 | 32.328 | 32.375 | 38.125 | 5.750 | 33 / 919 MHz | - |
| 6 | no | 26.578 | 31.734 | - | - | - | - | timeout |
| 7 | no | 27.125 | 0.609 | - | - | - | - | timeout |
| 8 | yes | 26.532 | 30.875 | 30.782 | 34.875 | 4.093 | 33 / 919 MHz | - |
| 9 | no | 26.579 | 30.297 | - | - | - | - | timeout |
| 10 | no | 26.531 | 29.812 | - | - | - | - | timeout |

## Summary Statistics

| Metric | N | Average s | Std dev s |
|---|---:|---:|---:|
| Reset->drone JOIN TX | 10 | 28.284 | 9.852 |
| Reset->MaGC 0% bind | 4 | 31.211 | 1.716 |
| Reset->MaGC 100% bind | 4 | 35.641 | 2.493 |
| MaGC 0%->100% bind | 4 | 4.429 | 0.944 |

## Reset To 100% Chart

- Trial 01: `` -s
- Trial 02: `###########################` 32.500s
- Trial 03: `###############################` 37.062s
- Trial 04: `` -s
- Trial 05: `################################` 38.125s
- Trial 06: `` -s
- Trial 07: `` -s
- Trial 08: `#############################` 34.875s
- Trial 09: `` -s
- Trial 10: `` -s
