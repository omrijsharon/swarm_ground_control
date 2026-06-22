# SGC GC Serial Log Summary - 2026-06-12T14-24-52-643Z

Source log:

```text
C:\Users\tamipinhasi\Downloads\sgc_gc_serial_2026-06-12T14-24-52-643Z.jsonl
```

Parsed as newline-delimited JSON. The outer JSONL was valid: 675 rows, 0 malformed rows, about 686 KB.

## Time Span

| Span | Start | End | Duration |
| --- | --- | --- | --- |
| Captured rows | 2026-06-12T14:21:39.386Z | 2026-06-12T14:24:52.641Z | 3m 13.255s |
| Serial traffic after open | 2026-06-12T14:21:42.606Z | 2026-06-12T14:24:48.522Z | 3m 05.916s |
| Live node 6 telemetry | 2026-06-12T14:23:11.573Z | 2026-06-12T14:23:28.022Z | 16.449s |
| Export snapshot row | 2026-06-12T14:24:52.641Z | 2026-06-12T14:24:52.641Z | instant |

The first file row is an `export_snapshot` captured at the end. The chronological log begins on row 1 with `serial_open_requested`.

## Message Counts

| Category | Count |
| --- | ---: |
| Total rows | 675 |
| `sgc-web-serial` rows | 669 |
| `sgc-ui` rows | 6 |
| `gc_to_sgc` rows | 658 |
| `sgc_to_gc` rows | 11 |
| Local UI rows | 6 |
| Complete JSON serial rows | 627 |
| Non-JSON serial rows | 42 |
| `channel_scan_event` | 504 |
| `drone_telemetry` | 36 |
| `scanner_event` | 15 |
| `session_event` | 12 |
| `command` | 11 |
| `command_ack` | 11 |
| `gc_status` | 10 |
| `search_event` | 9 |
| `channel_table` | 7 |
| `assignment_event` | 7 |
| `warning` | 3 |
| `drone_link_status` | 2 |
| `orphan_recovery_event` | 0 |

Command rows plus ACKs: `rescan_channels` appeared 8 times, `start_search` 6, `clear_all_assignments` 4, `get_status` 2, and `get_channel_table` 2.

## Assignment And Search Sequence

| Time | Event |
| --- | --- |
| 14:21:42.767Z | GC reported 3 persisted assignments: node 2 at 905.5 MHz p55, node 3 at 904 MHz p55, node 6 at 920 MHz p55. |
| 14:21:53.170Z | Operator started fresh session with `clear_all_assignments`; assignments were cleared and persisted assignments erased. |
| 14:21:57.365Z | Fresh-session scan completed with 0 assigned drones, 45 clear channels, 3 noisy channels. |
| 14:22:53.689Z | Operator started search. |
| 14:22:56.691Z | Search timed out after about 3 seconds. |
| 14:23:09.198Z | Node 6 JOIN request was detected after the search timeout, while `searchMode` was false. |
| 14:23:09.213Z | GC created node 6 assignment on 910.0 MHz, channel 15, profile 55, `txPeriodMs=470`. |
| 14:23:10.024Z | Node 6 JOIN ACK received. |
| 14:23:11.137Z | GC ACKed node 6 TX period proposal and saved the assignment. |
| 14:23:11.573Z - 14:23:28.022Z | Node 6 sent 36 telemetry packets, sequence 1-36, about 2.19 Hz. |
| 14:23:28.081Z | Operator started another fresh session, clearing assignments while node 6 was still broadcasting. |
| 14:23:29.366Z onward | Scan repeatedly saw channel 15 / 910.0 MHz as strongly occupied, but GC had 0 assignments. |
| 14:24:24.968Z and 14:24:35.212Z | Two later `start_search` attempts both timed out with no JOIN or recovery. |

Node 6 was the only node with live telemetry in this capture. RSSI was very strong, -21 to -20 dBm, SNR 5.5 to 6.75 dB. All telemetry was simulated GPS: `gpsSource=simulated`, `gpsFixQuality=0`, `satelliteCount=0`, `headingSource=yaw`, `cogTrusted=false`, and `yawBiasValid=false`.

## Scan And OOCR Observations

Six spectrum scans were captured.

| Start time | Trigger | Result | Notes |
| --- | --- | --- | --- |
| 14:21:53.193Z | fresh session | 45 clear / 3 noisy | Old RSSI-style scan; no fallback. |
| 14:22:34.948Z | manual rescan | 45 clear / 3 noisy | Old RSSI-style scan; no fallback. |
| 14:23:28.103Z | fresh session after node 6 assignment | 5 clear / 43 noisy | Fallback used; `few_clear_channels` warning. |
| 14:23:46.440Z | manual rescan | 5 clear / 43 noisy | Fallback used; `few_clear_channels` warning. |
| 14:24:10.500Z | manual rescan | 7 clear / 41 noisy | No fallback, still very crowded. |
| 14:24:40.629Z | manual rescan | 5 clear / 43 noisy | Fallback used; `few_clear_channels` warning. |

The captured scan protocol looks like the old RSSI-first scanner, not the new three-profile CAD scanner:

- Raw firmware logs say `scanning 48 BW500 telemetry candidate channels` and `rechecking ... initially noisy channels`.
- Events are `scan_started`, `channel_scanned`, `noisy_rescan_started`, and `scan_complete`; there is no `profile_scan_started`.
- `channel_scanned` rows do not contain `radioProfileId`, `profileName`, or `activityDetected`.
- `channel_table.channels[]` uses `state: "clear" | "noisy"` and `forcedClear`; it does not include `activityDetected`, `detectedProfileIds`, `displayRssi`, or `state: "free" | "occupied" | "assigned" | "reserved"`.
- Three scan completions used fallback and warnings: `few_clear_channels` / `using the quietest channels as fallback`.

OOCR did not run in this capture:

- There are 0 `orphan_recovery_event` messages.
- The final export snapshot has `recentOrphanRecoveryEvents: []`.
- There is no `assignment_event` named `orphan_assignment_recovered`.
- No `gc_status` row contains `orphanRecoveryActive`, `orphanRecoveryCandidates`, or `orphanRecoveredCount`.

The likely orphan channel is 910.0 MHz / channel 15:

| Time | Scan pass | Median RSSI | Max RSSI | State |
| --- | --- | ---: | ---: | --- |
| 14:21:54.454Z | before node 6 assignment | -100 | -98 | clear |
| 14:22:36.211Z | before node 6 assignment | -100 | -98 | clear |
| 14:23:29.366Z | after clearing node 6 assignment | -19 | -19 | noisy |
| 14:23:47.699Z | later rescan | -19 | -18 | noisy |
| 14:24:15.611Z | later noisy recheck | -19 | -18 | noisy |
| 14:24:45.732Z | final noisy recheck | -19 | -18 | noisy |

This is the bench condition OOCR is meant to solve: the drone kept transmitting on its previously assigned channel, but GC had no assignment for it.

## Errors, Warnings, And Likely Bench Issues

- The test did not actually exercise the new three-profile CAD scan. The log schema and firmware text are from the old RSSI/noisy-clear scanner.
- The test did not exercise OOCR. There were no orphan recovery events, no recovery counters, and no recovered assignment.
- Clearing assignments while node 6 was still broadcasting created the expected orphan condition. The GC recognized the channel as very busy on 910.0 MHz but did not bind to it.
- `start_search` timed out twice after the orphan condition. Search only waited for shared-channel JOIN behavior; it did not use occupied-channel recovery.
- The first `start_search` timed out, but node 6 still joined about 12.5 seconds later while `searchMode=false`. That means the UI search state and actual shared-channel listening behavior are not fully aligned.
- Scan fallback is still active in this captured firmware. It forced 5 channels clear when only 5 clear channels were available and emitted `few_clear_channels`; this conflicts with the newer plan where RSSI/fallback should not decide assignability.
- The warning text says `Boot scan found too few clear telemetry channels` even for manual/fresh-session rescans.
- Node 6 telemetry was simulated GPS with zero satellites and no trusted course-over-ground, so this bench did not validate real GPS or heading fusion.
- Non-JSON OTA AP heartbeat lines are frequent but expected development noise. One truncated JSON fragment appeared immediately after serial open, which is expected when connecting mid-line.
