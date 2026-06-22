# MaGC Bind Timing From Drone Reset

- Created: 2026-06-19T18:36:57+00:00
- Log: `logs_summary\bind_timing_reset_10_retry_20260619.jsonl`
- TeleGC: `COM16`
- Drone: `COM13`
- Trials requested: 10
- Successful trials: 7
- Reset origin: host timestamp when `debug_reboot` is sent to the drone.
- MaGC 0% bind: first MaGC `join_request_received` / quiet bind-progress event.
- MaGC 100% bind: first MaGC `telemetry_period_locked` / complete bind-progress event.

## Trial Table

| Trial | Success | Reset->join mode s | Reset->JOIN TX s | Reset->0% s | Reset->100% s | 0%->100% s | Channel | Notes |
|---:|:---:|---:|---:|---:|---:|---:|---:|---|
| 1 | yes | 28.781 | 33.062 | 33.125 | 36.578 | 3.453 | 33 / 919 MHz | - |
| 2 | yes | 26.578 | 33.734 | 33.812 | 39.250 | 5.438 | 33 / 919 MHz | - |
| 3 | yes | 26.625 | 28.860 | 28.844 | 35.485 | 6.641 | 33 / 919 MHz | - |
| 4 | no | 26.594 | 31.469 | - | - | - | - | timeout |
| 5 | no | 26.610 | 32.297 | 32.422 | - | - | 33 / 919 MHz | timeout |
| 6 | yes | 26.640 | 29.484 | 43.640 | 49.344 | 5.704 | 33 / 919 MHz | magc_bind_attempts=6 |
| 7 | yes | 26.578 | 28.609 | 28.687 | 35.468 | 6.781 | 33 / 919 MHz | - |
| 8 | yes | 26.578 | 32.265 | 32.390 | 39.796 | 7.406 | 33 / 919 MHz | - |
| 9 | yes | 26.625 | 33.531 | 41.828 | 47.219 | 5.391 | 33 / 919 MHz | magc_bind_attempts=4 |
| 10 | no | 55.391 | 60.078 | - | - | - | - | timeout |

## Summary Statistics

| Metric | N | Average s | Std dev s |
|---|---:|---:|---:|
| Reset->drone JOIN TX | 10 | 34.339 | 9.239 |
| Reset->MaGC 0% bind | 8 | 34.344 | 5.529 |
| Reset->MaGC 100% bind | 7 | 40.449 | 5.646 |
| MaGC 0%->100% bind | 7 | 5.831 | 1.295 |

## Reset To 100% Chart

- Trial 01: `########################` 36.578s
- Trial 02: `#########################` 39.250s
- Trial 03: `#######################` 35.485s
- Trial 04: `` -s
- Trial 05: `` -s
- Trial 06: `################################` 49.344s
- Trial 07: `#######################` 35.468s
- Trial 08: `##########################` 39.796s
- Trial 09: `###############################` 47.219s
- Trial 10: `` -s
