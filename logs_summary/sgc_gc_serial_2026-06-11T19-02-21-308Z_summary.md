# SGC GC Serial Log Summary - 2026-06-11T19-02-21-308Z

Source log:

```text
C:\Users\tamipinhasi\Downloads\sgc_gc_serial_2026-06-11T19-02-21-308Z.jsonl
```

Parsed as newline-delimited JSON. The outer JSONL was valid: 5,695 rows, 0 malformed rows, about 6.9 MB.

## Time Span

| Span | Start | End | Duration |
| --- | --- | --- | --- |
| Exported rows, excluding leading snapshot row | 2026-06-11T11:58:01.181Z | 2026-06-11T19:02:20.746Z | 7h 04m 19.565s |
| Live drone telemetry | 2026-06-11T11:58:01.181Z | 2026-06-11T12:12:57.900Z | 14m 56.719s |
| Scanner events | 2026-06-11T11:58:09.111Z | 2026-06-11T12:15:06.317Z | 16m 57.206s |
| Browser serial disconnect to later auto-open attempt | 2026-06-11T12:39:39.384Z | 2026-06-11T18:59:02.957Z | 6h 19m 23.573s |
| Export snapshot row | 2026-06-11T19:02:21.282Z | 2026-06-11T19:02:21.282Z | instant |

The first row in the file is an `export_snapshot` at 2026-06-11T19:02:21.282Z, then the normal captured log rows begin at 2026-06-11T11:58:01.181Z.

## Message Counts

| Category | Count |
| --- | ---: |
| Total rows | 5,695 |
| `sgc-web-serial` rows | 5,114 |
| `sgc-ui` rows | 581 |
| `gc_to_sgc` rows | 5,049 |
| `sgc_to_gc` rows | 65 |
| Local UI rows | 581 |
| Complete `drone_telemetry` JSON messages | 2,284 |
| `scanner_event` | 1,511 |
| `drone_link_status` | 746 |
| `channel_scan_event` | 198 |
| `command` | 65 |
| `command_ack` | 65 |
| `search_event` | 53 |
| `assignment_event` | 35 |
| `gc_status` | 23 |
| `session_event` | 8 |
| `channel_table` | 4 |
| `warning` | 2 |
| Non-JSON serial log lines | 120 |

Non-JSON serial lines were expected development/log output in most cases: 101 OTA AP heartbeat lines, 9 persisted-assignment save notices, 2 clear-persisted notices, 2 scan-start notices, 2 noisy-rescan notices, 2 scan-complete notices, and 2 truncated JSON fragments.

## Drones Seen

Only nodes `2` and `3` were seen in telemetry or link-state messages. No evidence of five live drones appears in this log.

| Node | Telemetry packets | First telemetry | Last telemetry | Overall received rate | Frequencies / profiles | RSSI | SNR | Satellites |
| --- | ---: | --- | --- | ---: | --- | --- | --- | --- |
| 2 | 1,519 | 2026-06-11T11:58:16.178Z | 2026-06-11T12:12:52.597Z | 1.73 Hz | 923.5 MHz p0, 926 MHz p46, 905.5 MHz p55 | min -96, avg -66.1, max -36 dBm | min -18.0, avg 1.7, max 14.5 dB | 0 to 20 |
| 3 | 765 | 2026-06-11T11:58:01.181Z | 2026-06-11T12:12:57.900Z | 0.85 Hz | 925 MHz p55, 924 MHz p46, 904 MHz p55 | min -102, avg -75.4, max -38 dBm | min -18.75, avg -2.5, max 9.5 dB | 13 to 25 |

Node 2 had mixed GPS quality: 1,228 `fc_gps` packets and 291 `simulated` packets. Its fix-quality counts were 915 packets at quality `3`, 309 at `2`, 4 at `1`, and 291 at `0`. Node 3 stayed at `fc_gps` with fix quality `3` for all 765 telemetry packets.

## Profiles And Frequencies

Shared/discovery frequency was reported as 915.0 MHz. Supported radio profiles in channel tables:

| Profile | Name | SF | BW | CR | Telemetry airtime | TX period |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 0 | fast | 8 | 500,000 Hz | 4/5 | 25.728 ms | 100 ms |
| 46 | balanced | 10 | 500,000 Hz | 4/6 | 102.912 ms | 177 ms |
| 55 | robust | 11 | 250,000 Hz | 4/7 | 395.264 ms | 470 ms |

Observed profile changes:

| Time | Event |
| --- | --- |
| 2026-06-11T12:01:45.321Z | `set_radio_profile` accepted, profile 46, SF10/BW500/CR6 |
| 2026-06-11T12:01:56.038Z | `clear_all_assignments` accepted, fresh session |
| 2026-06-11T12:08:25.206Z | GC status shows profile 55, SF11/BW250/CR7 |
| 2026-06-11T12:08:34.710Z | `clear_all_assignments` accepted, fresh session |

Channel tables repeatedly showed a crowded spectrum: 48 candidate telemetry channels scanned, only 5 clear and 43 noisy. Both scans emitted `few_clear_channels` warnings and used fallback/forced-clear channels.

Clear frequencies reported:

| Time | Clear frequencies |
| --- | --- |
| 2026-06-11T12:01:45.446Z | 920, 923.5, 924, 925, 925.5 MHz |
| 2026-06-11T12:01:56.022Z | 922.5, 924, 924.5, 925.5, 926 MHz |
| 2026-06-11T12:08:25.320Z | 922.5, 924, 924.5, 925.5, 926 MHz |
| 2026-06-11T12:08:42.567Z | 904, 905.5, 916, 924, 927.5 MHz |

## Search, Join, And Assignment Events

Search event counts:

| Event | Count |
| --- | ---: |
| `search_started` | 19 |
| `search_timeout` | 19 |
| `join_detected` | 5 |
| `assignment_completed` | 5 |
| `search_telemetry_round` | 5 |

Every explicit search cycle timed out after about 3 seconds. Five joins were detected and completed, but repeated later searches did not find additional drones.

Assignment event counts:

| Event | Count |
| --- | ---: |
| `join_request_received` | 5 |
| `assign_created` | 4 |
| `assign_reused` | 1 |
| `silence_sent` | 5 |
| `assign_sent` | 5 |
| `join_ack_received` | 5 |
| `tx_period_proposal_received` | 5 |
| `tx_period_ack_sent` | 5 |

Assignment timeline:

| Time | Node | Result |
| --- | ---: | --- |
| 2026-06-11T11:59:17.334Z | 3 | Join request at RSSI -89 dBm/SNR -18 dB; reused 925 MHz, channel 45, profile 55, TX 470 ms |
| 2026-06-11T12:01:57.221Z | 2 | Created 926 MHz, channel 47, profile 46, TX 177 ms |
| 2026-06-11T12:02:12.501Z | 3 | Created 924 MHz, channel 43, profile 46, TX 177 ms |
| 2026-06-11T12:08:43.475Z | 2 | Created 905.5 MHz, channel 6, profile 55, TX 470 ms |
| 2026-06-11T12:08:54.407Z | 3 | Created 904 MHz, channel 3, profile 55, TX 470 ms |

All 65 SGC-to-GC commands were accepted: 42 `relock_drone`, 19 `start_search`, 2 `set_radio_profile`, and 2 `clear_all_assignments`. Relock commands targeted node 2 sixteen times and node 3 twenty-six times.

## Telemetry Rates And Gaps

Observed received rates were below the configured TX periods, especially for node 3 after the second fresh session.

| Node | Frequency/profile | Packets | Segment | Expected TX cadence | Observed rate | Median interval | Max gap | Gaps >1s |
| ---: | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 2 | 923.5 MHz / p0 | 323 | 11:58:16.178Z to 12:01:45.276Z | 100 ms, 10.00 Hz | 1.54 Hz | 100 ms | 52.700 s | 15 |
| 2 | 926 MHz / p46 | 918 | 12:01:58.523Z to 12:08:23.318Z | 177 ms, 5.65 Hz | 2.38 Hz | 178 ms | 24.779 s | 32 |
| 2 | 905.5 MHz / p55 | 278 | 12:08:45.849Z to 12:12:52.597Z | 470 ms, 2.13 Hz | 1.12 Hz | 470 ms | 7.987 s | 52 |
| 3 | 925 MHz / p55 | 284 | 11:58:01.181Z to 12:01:41.171Z | 470 ms, 2.13 Hz | 1.29 Hz | 470 ms | 24.479 s | 17 |
| 3 | 924 MHz / p46 | 431 | 12:02:13.822Z to 12:08:23.202Z | 177 ms, 5.65 Hz | 1.16 Hz | 355 ms | 64.603 s | 20 |
| 3 | 904 MHz / p55 | 50 | 12:08:56.794Z to 12:12:57.900Z | 470 ms, 2.13 Hz | 0.20 Hz | 1,410 ms | 146.636 s | 43 |

Sequence counters also show many skipped packets and no duplicates: node 2 had 592 sequence irregularities, node 3 had 509. This matches the observed missed windows and long receive gaps.

## Link-State Transitions

Link-state churn was high. Node 2 had 238 link-status messages and 234 state transitions. Node 3 had 508 link-status messages and 441 state transitions.

| Node | State counts | Main reasons | Final link status |
| ---: | --- | --- | --- |
| 2 | offline 85, online 68, locking 63, off 18, weak 4 | `listen_window_expired` 85, `telemetry_received` 68, `operator_requested` 35, `phase_unknown` 24, `no_lora_activity` 18 | `off` at 2026-06-11T12:12:55.468Z, 905.5 MHz, missCount 3, reason `no_lora_activity` |
| 3 | locking 234, offline 119, weak 67, online 61, off 27 | `listen_window_expired` 119, `phase_unknown` 107, `cad_activity_detected` 67, `activity_without_valid_packet` 67, `telemetry_received` 61, `operator_requested` 60, `no_lora_activity` 27 | `off` at 2026-06-11T12:12:59.831Z, 904 MHz, missCount 3, reason `no_lora_activity` |

Node 3 had a much larger number of `weak` states and CAD activity without valid packets, especially late in the run. After both nodes were effectively off, scanner events continued with shared rejoin probing until 2026-06-11T12:15:06.317Z.

## Scanner And Scheduler Events

No `scheduler_event` messages were present.

Scanner event counts:

| Event | Count |
| --- | ---: |
| `telemetry_missed` | 410 |
| `shared_rejoin_probe` | 297 |
| `phase_preserved_after_miss` | 234 |
| `assigned_recovery_cooldown` | 116 |
| `recovery_window_clipped` | 101 |
| `manual_relock_listen` | 95 |
| `stale_slot_skipped` | 62 |
| `recovery_started_after_consecutive_misses` | 60 |
| `shared_search_listen` | 56 |
| `manual_relock_scheduled` | 42 |
| `manual_relock_expired` | 28 |
| `timing_probe_telemetry_ignored` | 5 |
| `shared_rejoin_extended` | 3 |
| `search_skip_no_miss` | 2 |

Scanner event distribution by node: node 2 had 704 scanner events, node 3 had 751, and 56 shared-search events had no node. The most common scanner reasons were `listen_window_expired` 410, `all_assignments_off_rejoin_discovery` 293, `known_tst_preserved` 183, `operator_requested` 137, and `protect_known_tst` 101.

## Warnings And Errors

GC warnings:

- 2 `few_clear_channels` warnings: `Boot scan found too few clear telemetry channels; using the quietest channels as fallback.`

UI/browser serial diagnostics:

| Diagnostic | Count | First | Last | Notes |
| --- | ---: | --- | --- | --- |
| `serial_disconnected` | 1 | 2026-06-11T12:39:39.384Z | 2026-06-11T12:39:39.384Z | `Selected port disconnected.` |
| `serial_opened` | 1 | 2026-06-11T18:59:03.008Z | 2026-06-11T18:59:03.008Z | Auto-open succeeded once |
| `serial_open_requested` | 259 | 2026-06-11T18:59:02.957Z | 2026-06-11T19:02:20.745Z | Auto reconnect loop |
| `serial_open_failed` | 258 | 2026-06-11T18:59:03.131Z | 2026-06-11T19:02:20.746Z | `Failed to execute 'open' on 'SerialPort': The port is already open.` |

Two non-JSON fragments look like truncated tail pieces of scanner-event JSON, one at 2026-06-11T12:39:39.403Z and one at 2026-06-11T18:59:03.011Z. The GC-to-SGC parser should continue tolerating these, but the reconnect path should avoid treating partial stale reads as normal lines.

## Main Problems Observed

1. Only two drones were seen, not the target of about five.
2. The RF scan was consistently poor: 5 clear channels and 43 noisy channels in both fresh-session scans, with fallback/forced-clear behavior.
3. Received telemetry rates were much lower than configured TX periods. Node 3 on 904 MHz/profile 55 was the worst case: only 50 packets over 241 seconds, 0.20 Hz observed, with a 146.636 second maximum gap.
4. Both drones had frequent missed windows and link-state churn. Node 3 repeatedly entered `weak` from CAD activity without valid packets, suggesting energy was detected but packets were not decodable.
5. Manual relock and search activity was heavy: 42 relocks and 19 searches. Searches mostly ended in 3 second timeouts after the two known nodes were assigned.
6. Both links ended `off` due to `no_lora_activity`, then the scanner continued shared rejoin probing.
7. Node 2 had mixed real/simulated GPS data and 291 no-fix packets, so its position/freshness display should make GPS source and fix quality very visible during tests.
8. The browser serial auto-reconnect logic entered a repeated `port is already open` failure loop after reconnecting, generating 258 failures in about 3 minutes.
