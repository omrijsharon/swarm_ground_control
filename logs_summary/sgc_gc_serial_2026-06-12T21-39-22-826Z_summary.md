# SGC GC Serial Log Summary: 2026-06-12T21-39-22-826Z

Question: the single bound drone keeps losing its lock/TST. What clues in this log help solve it?

Source log: `C:\Users\tamipinhasi\Downloads\sgc_gc_serial_2026-06-12T21-39-22-826Z.jsonl`

## Capture Scope

- The file contains `164` JSONL records.
- Record `1` is an SGC UI export snapshot taken at `2026-06-12T21:39:22.825Z`; it contains current app state and recent event buffers.
- Records `2-164` are live GC serial lines from `2026-06-12T21:39:01.633Z` through `2026-06-12T21:39:22.803Z`, about `21.17 s`.
- Serial baud was `921600`.
- No parse errors, warnings, command ACKs, channel tables, channel scan events, orphan recovery events, or raw firmware log lines appear in the live serial portion.

## Observed Node IDs

- `nodeId 7`: the only node with decoded `drone_telemetry` in the live serial stream.
- `nodeId 6`: an existing assignment with repeated scanner/link recovery events, but zero decoded telemetry in this live serial stream.

Important mismatch: although the operator may have intended a single bound drone test, the exported SGC snapshot shows `assignedDrones: 2` with assignments for both node `7` and node `6`. Node `6` looks stale/lost and appears to keep the GC scheduler busy with recovery attempts.

## Assignment, Profile, Channel, And TX Period

Export snapshot `gcStatus`:

- Active GC profile reported as `radioProfileId: 55`, `SF11`, `BW250000`, `CR 4/7`, `txPowerDbm: 22`.
- Shared discovery channel: `915.0 MHz`.
- `searchMode: true`, `scanMode: "search"` in snapshot GC status at `gcMillis: 75692`, although the snapshot top-level `searchMode` was already `false`.
- `assignedDrones: 2`, `assignedChannels: 2`, `freeChannels: 43`, `occupiedChannels: 3`.

Snapshot assignments:

- Node `7`: `909.5 MHz`, channel index `14` from recent assignment event, `radioProfileId: 55`, `txPeriodMs: 470`, `expectedUpdateMs: 470`, `telemetryAirtimeMs: 395.264`, `timingAccepted: true`.
- Node `6`: `912.0 MHz`, channel index `19`, `radioProfileId: 0`, `txPeriodMs: 100`, `expectedUpdateMs: 100`, `telemetryAirtimeMs: 25.728`, `timingAccepted: true`, but no valid sequence state and no telemetry in the capture.

This is a mixed-profile scheduler situation: the live node is slow/robust at `470 ms`, while the stale node is still assigned a fast `100 ms` profile. That stale fast assignment is repeatedly recovered/relocked.

## Timeline

- Before this live serial capture, recent snapshot events show node `7` rejoined through Search:
  - `gcMillis 75690`: `search_started`, reason `operator_requested`.
  - `gcMillis 76606`: node `7` `join_request_received`.
  - `gcMillis 76608`: node `7` `assign_reused` on `909.5 MHz`, profile `55`, `txPeriodMs 470`.
  - `gcMillis 77167`: node `7` `assign_sent`.
  - `gcMillis 77422`: node `7` `join_ack_received`.
  - `gcMillis 79475`: node `7` `tx_period_proposal_received`, `measuredCycleMs 418`, `proposedPeriodMs 470`, `mspBatchMs 9`, `txDurationMs 409`, `mspFlags 7`.
  - `gcMillis 79773`: node `7` `tx_period_ack_sent`, `ackStatus 0`, `timingAccepted true`.
- `21:39:01.633Z` to `21:39:02.573Z`: node `7` telemetry arrives cleanly every `470 ms`, sequence `124,125,126`.
- `21:39:02.579Z` onward: node `6` recovery activity starts appearing in the live stream with `recovery_window_clipped`, then repeating `recovery_started_after_consecutive_misses`, `telemetry_missed`, `manual_relock_listen`, and link status changes.
- `21:39:04.453Z`: node `7` resumes at sequence `130`; sequence IDs `127-129` were missed.
- `21:39:05.393Z` to `21:39:10.563Z`: largest node `7` gap in this capture. It jumps from sequence `132` at `gcMillis 141777` to sequence `143` at `gcMillis 146947`, missing `10` packets over `5170 ms`.
- `21:39:09.716Z`: scanner emits node `7` `stale_slot_skipped`, reason `predicted_tst_already_passed`, with `estimatedTstGcMillis 141381` and `nextTstGcMillis 146551`. This is the clearest TST-loss clue for the live node.
- `21:39:13.383Z`, `21:39:17.613Z`, `21:39:21.843Z`: node `7` returns after further gaps, missing `3`, `6`, and `6` packets respectively.
- End of capture: node `7` is fresh with sequence `169`; node `6` remains `locking`, `missCount 125`, reason `phase_unknown`.

## Telemetry Received Vs Missed

Node `7` decoded telemetry:

- Received `18` packets over the live serial capture.
- Sequence range `124 -> 169`, inclusive span `46` expected sequence values.
- Missing sequence IDs from decoded telemetry continuity: `28`.
- Normal interval when healthy: exactly `470 ms`.
- Observed gaps:
  - `126 -> 130`: `1880 ms`, `3` missing packets.
  - `132 -> 143`: `5170 ms`, `10` missing packets.
  - `145 -> 149`: `1880 ms`, `3` missing packets.
  - `151 -> 158`: `3290 ms`, `6` missing packets.
  - `160 -> 167`: `3290 ms`, `6` missing packets.
- RSSI/SNR for node `7` are strong and stable: RSSI `-24` to `-22 dBm`, SNR `5.75` to `7.5 dB`. The missing telemetry does not look like a weak RF link in this log.

Node `6` decoded telemetry:

- Received `0` packets.
- Explicit live scanner `telemetry_missed` events: `27`.
- Snapshot recent scanner events show it was already at `missCount 123`; live stream spans `missCount 98 -> 125`, suggesting the SGC export buffer and live lines overlap around the end state.

## Scanner And Link Status Transitions

Live scanner events:

- `scanner_event`: `83` total.
- Node `6`: `82` scanner events.
  - `telemetry_missed`: `27`.
  - `recovery_started_after_consecutive_misses`: `22`.
  - `manual_relock_listen`: `22`.
  - `recovery_window_clipped`: `6`.
  - `assigned_recovery_cooldown`: `5`.
- Node `7`: `1` scanner event.
  - `stale_slot_skipped`, reason `predicted_tst_already_passed`.

Live link status events:

- `60` total, all for node `6`.
- Node `6` repeatedly cycles through:
  - `locking`, reason `operator_requested`, activity `false`: `22` times.
  - `offline`, reason `no_activity_reacquire_pending`, activity `false`: `17` times.
  - `locking`, reason `phase_unknown`, activity `false`: `6` times.
  - `offline`, reason `recovery_window_clipped`, activity `false`: `5` times.
  - `locking`, reason `cad_activity_detected`, activity `true`: `5` times.
  - `weak`, reason `activity_without_valid_packet`, activity `true`: `5` times.

The scanner/link stream is dominated by node `6`, not node `7`. Node `6` activity occasionally gets detected by CAD/LBT, but no valid telemetry packet is decoded from it.

## TST And Timing Clues

Node `7`:

- Join/timing handshake looks valid in snapshot: `tx_period_proposal_received` then `tx_period_ack_sent`, `timingAccepted true`.
- Timing proposal was coherent for profile `55`: `measuredCycleMs 418`, `proposedPeriodMs 470`, `txDurationMs 409`.
- Live telemetry proves the drone is transmitting at the accepted cadence when the GC catches it: healthy intervals are exactly `470 ms`.
- The single node `7` scanner diagnostic is `stale_slot_skipped`:
  - `gcMillis 146100`.
  - `estimatedTstGcMillis 141381`.
  - `nextTstGcMillis 146551`.
  - reason `predicted_tst_already_passed`.
- This event occurs inside the largest node `7` telemetry gap. It suggests the GC's predicted phase/TST for node `7` became stale while scheduler time was spent elsewhere, then the scheduler skipped or corrected a slot instead of staying locked to the live node.

Node `6`:

- Every scanner event reports `estimatedTstGcMillis: 0`, meaning phase is unknown/reset for node `6`.
- Snapshot recent events also show `lastRxDoneGcMillis: 0`; live flattened rows omit that field, but the embedded JSON follows the same pattern.
- Node `6` `nextTstGcMillis` advances even with `estimatedTstGcMillis 0`, often near current GC time during miss loops, then jumps after cooldown:
  - Example: after CAD activity without valid packet at `gcMillis 140083`, `nextTstGcMillis` becomes `141583`.
  - Similar cooldown jumps occur to `147589`, `150512`, `154927`, and `159155`.
- `recovery_window_clipped` uses reason `protect_known_tst`, implying the scheduler is trying not to damage known slots, but the repeated stale recovery windows still correlate with missing node `7` packets.

## Relock/Rebind Events

Rebind/join events:

- No live serial `assignment_event` lines appear in records `2-164`.
- Snapshot recent events show node `7` rejoined/reused its existing assignment before the capture.
- No node `6` join/rebind event appears in the snapshot recent assignment buffer.

Relock/recovery events:

- Node `6` has `22` `manual_relock_listen` events in the live serial stream.
- These are labeled `reason: "operator_requested"`, but there are no matching local SGC command records or `command_ack` records in this capture. From this log alone, it is unclear whether these came from repeated operator actions, an SGC/UI retry path, or firmware naming for a manual-relock mode that was already active.
- Each node `6` relock listen is about `500 ms`, for example `listenStartGcMillis 139033`, `listenDeadlineGcMillis 139533`.
- Node `6` relock/recovery never produces valid telemetry in this capture.

## CAD, OOCR, And Channel Activity

- No `orphan_recovery_event` records are present.
- No `channel_scan_event` records are present in the live serial portion.
- Node `6` has five CAD/activity indications:
  - `cad_activity_detected` at `gcMillis 140077`, `146084`, `149007`, `153421`, `157650`.
  - Each is followed immediately by `weak`, reason `activity_without_valid_packet`.
  - Each is followed by `assigned_recovery_cooldown`, reason `activity_without_valid_packet`.
- This means the GC sees RF activity on or around node `6`'s assigned channel/profile, but cannot decode it as valid live-position telemetry.

## Best Hypotheses From This Log Only

1. The "single bound drone" test is polluted by a stale second assignment. The GC still has node `6` assigned on `912.0 MHz` at fast profile `0`/`100 ms`, and node `6` consumes most scanner/recovery work while producing zero telemetry.

2. Node `7`'s RF link is probably not the primary failure. Its RSSI/SNR are very strong, and when received, its packets land exactly on the `470 ms` cadence. The missing packets look more like missed listen windows / scheduler lock loss than RF fade.

3. The strongest TST clue for the live drone is node `7`'s `stale_slot_skipped` with `predicted_tst_already_passed`. It appears after node `6` recovery loops and during the largest node `7` sequence gap, so the scheduler may be allowing stale-assignment recovery to starve or desynchronize a healthy assigned slot.

4. Node `6` is in phase-unknown recovery, not normal tracking. Its `estimatedTstGcMillis` is always `0`, yet it repeatedly schedules `manual_relock_listen` windows and increments misses. This can explain recurring scheduler disruption without any decoded node `6` telemetry.

5. CAD detects activity for node `6`, but decode fails every time. Possible log-only explanations are wrong profile/channel for node `6`, non-telemetry LoRa activity on that channel, stale assignment after the real node changed/reset, or a packet-format/profile mismatch. The log cannot choose between these.

6. The repeated `manual_relock_listen` events need investigation. They are reported as `operator_requested`, but the capture has no matching command records. If SGC or firmware is repeatedly triggering relock for stale node `6`, that would be a direct cause of healthy-node TST loss.

7. Mixed assignment profiles may be worsening scheduling behavior. Node `7` uses profile `55` with `470 ms` TX period and long `395 ms` airtime, while node `6` uses profile `0` with `100 ms` period. A stale fast-profile assignment can create frequent recovery pressure alongside a long-airtime robust-profile live node.

## Suggested Next Checks

- Clear node `6`'s stale assignment and repeat the single-drone capture with only node `7` assigned.
- Capture `assignment_event`, `command_ack`, and local outbound command records while reproducing, to identify why `manual_relock_listen` is repeatedly marked `operator_requested`.
- If node `6` should be gone, verify that `clear_assignment nodeId=6` or `Start Fresh Session` removes it from GC flash/RAM before binding node `7`.
- Add or enable a scheduler diagnostic that records when node `6` recovery windows preempt or delay node `7`'s expected TST listen.
- If node `6` is physically present, verify its firmware/profile/channel match the GC assignment: `912.0 MHz`, profile `0`, `txPeriodMs 100`.
