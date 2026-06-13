# Field Test Follow-Ups

Goal: address the first field-test findings without expanding this branch into mission control. This plan keeps the GC focused on live position tracking, operator-controlled admission of new drones, link diagnosis, touch-friendly local UI tools, and per-assignment radio robustness.

## Milestone 1: Operator-Controlled Search Mode

- [x] Add an SGC `Bind` button in the USB Serial panel above `Open` and `Close`.
- [x] Add SGC command support for `start_search`.
- [x] Add GC command support for `start_search`.
- [x] Add `gc_status.searchMode`.
- [x] Add `search_event` serial messages for search lifecycle.
- [x] Stop automatic shared-channel visits while assigned drones exist and search mode is inactive.
- [x] Keep the GC on shared discovery automatically when no drones are assigned.
- [x] In search mode, listen on the shared channel for join requests.
- [x] Make operator Search preempt normal assigned-channel telemetry slots.
  - Field diagnostic `sgc_gc_serial_2026-06-10T22-57-14-585Z.jsonl` showed the GC accepted `start_search` while node `7` was streaming, but the scheduler kept choosing node `7`'s near-future assigned TST and Search timed out without a real shared dwell. Operator Search now forces a shared-channel dwell unless the GC is in a timing/acquisition or required search telemetry-round window.
- [x] Keep CAD/activity probing out of active shared-channel Search RX windows.
  - Field diagnostics `sgc_gc_serial_2026-06-10T23-07-48-914Z.jsonl` and `sgc_gc_serial_2026-06-10T23-16-15-771Z.jsonl` showed the GC really entered `shared_search_listen`, but did not receive the second node. Direct node `6` serial then showed repeated `join_request_sent` followed by `join_assign_timeout`, proving the missing node was transmitting join requests. The GC no longer runs periodic CAD probes during the same shared RX window because SX1262 CAD is not passive and can interrupt packet receive.
- [x] After a successful assignment/timing lock, run one telemetry scanner round before returning to shared discovery.
- [x] Keep the post-assignment telemetry round from penalizing drones skipped during Search.
  - Field diagnostic `sgc_gc_serial_2026-06-10T23-58-12-628Z.jsonl` showed the GC could admit node `6` and node `7`, but whichever node was already online was immediately marked missed/offline after the other node joined. The special `search_telemetry_round` selector was using stale predicted TST values from before the shared-channel Search dwell. It now advances known-phase assignments to the next catchable packet window before choosing a post-assignment listen slot.
- [x] Stop search after a shared dwell with no valid join request and no LoRa CAD activity.
- [x] Compute Search shared dwell from `3 * max discovery control packet airtime + guard` instead of a fixed magic value.
- [x] Emit `gc_status.searchSharedDwellMs`.
- [x] Keep operator Search bounded so it cannot look stuck while telemetry is flowing.
  - Field diagnostics showed the earlier `10 s` minimum Search window could keep the button in `Searching...` even while the GC had already assigned a drone and was receiving assigned-channel telemetry.
  - Search now stops after the long-range shared dwell when packet-free, and otherwise has a hard maximum of `15 s` before the GC emits `search_timeout` with reason `max_duration_elapsed`.
  - Superseded after switching discovery to `SF12 / BW125 / CR4/8`: with CAD removed from active RX, Search continues shared RX windows until a join is found or the `15 s` hard cap is reached. The airtime-derived dwell is about `3584 ms`.
- [ ] Bench-verify active drones do not lag from periodic shared-channel visits while Search is off.
- [x] Bench-verify Search admits a new drone and then stops after the shared channel is packet-free.
  - After clearing a stale node `6` assignment, serial-triggered Search received `JOIN_REQUEST`, assigned `904.0 MHz`, completed `JOIN_ACK`, accepted timing, and then emitted steady `drone_telemetry`.
- [ ] Bench-verify Search dwell is about `3584 ms` with the current discovery profile.
  - Expected after the SF12 discovery change; keep unchecked until the GC is flashed and reports the new `searchSharedDwellMs`.

## Milestone 2: Link Diagnosis And Recovery

- [x] Add radio backend support for LoRa CAD/activity detection.
- [x] Use RadioLib `scanChannel()` on SX1262 backends instead of RSSI-only detection.
- [x] Add GC link states: `locking`, `weak`, `offline`, and `off`.
- [x] Preserve TST phase after the first two missed assigned-channel listen windows.
  - The GC now treats early misses as scheduler misses, advances to the next catchable predicted slot, and does not clear runtime TST state.
- [x] After three consecutive listened misses, run CAD/LBT first on that drone's assigned channel/profile.
  - The GC queues event-driven CAD recovery slots. Each slot runs one automatic CAD/LBT probe for one stale assignment; full automatic RX relock is CAD-gated and capped. Manual relock remains operator-requested.
- [x] During recovery, use CAD/activity detection as the cheap gate and valid telemetry as the only proof of recovery.
- [x] If CAD/LBT sees no LoRa activity, avoid full RX relock unless the last RSSI was weak enough to justify one immediate link-loss relock.
- [x] Emit `OFF` only after confirmed no-activity evidence.
  - Confirmation requires `2` separate CAD/LBT no-activity probes and last RSSI stronger than `-114 dBm`.
  - Last RSSI `<= -114 dBm` or unknown is classified as `OFFLINE`, not `OFF`.
- [x] Stop automatic recovery after `5` CAD recovery slots.
  - Failed RX listens back off to later CAD slots by `1s`, `2s`, `3s`, then `4s`; manual relock resets the recovery counters.
- [x] If the completed recovery probe sees LoRa activity but no valid telemetry, emit `WEAK`.
- [x] Treat malformed assigned-channel packets, wrong-node packets, duplicate packets, control echoes, and CAD hits as activity evidence.
  - These do not count as valid telemetry, but they prevent one negative recovery window from falsely proving the drone is powered off.
- [x] Clear terminal `OFF` runtime state when Search rediscovers the same node or when valid assigned-channel telemetry arrives, so rejoin/acquisition is not blocked by stale OFF state.
- [x] Treat "all active assignments are terminal OFF" as shared-channel rejoin discovery instead of scanner idle.
  - Field diagnostics `sgc_gc_serial_2026-06-10T22-17-44-551Z.jsonl` and `sgc_gc_serial_2026-06-10T22-20-40-474Z.jsonl` showed node `6` only rejoined after Delete because deleting made `assignedDrones = 0`, which kept the GC on shared discovery. The GC now uses the same shared rejoin behavior when assignments still exist but every active assignment is already classified `OFF`.
- [x] Fix Search-mode stale-assignment rejoin probing so reset drones on the shared channel can actually be rediscovered.
- [x] Roll back pending assignments when JOIN_ACK retries are exhausted.
  - The field diagnostic showed `join_ack_retries_exhausted` leaving node `6` active with `timingAccepted=false`, after which the scanner chased it and emitted `LOCKING`/`WEAK`. A failed ACK now restores the previous assignment or removes the new pending assignment from RAM/flash.
- [x] Move live-position control packet IDs out of the telemetry node-ID range.
  - Control packets now use `0xA1-0xA6`, while assigned-channel telemetry still starts with `node_id`.
  - This removes the node `6` collision where telemetry began with the old `0x06` timing-proposal value.
  - This is a breaking air-protocol change; GC and all drone ESP32s must be reflashed together.
- [x] Accept matching late JOIN_ACK packets during assigned-channel acquisition.
  - Field diagnostic `sgc_gc_serial_2026-06-10T19-22-26-027Z.jsonl` showed node `6` sending repeated late ACK packets after the GC had already left the strict ACK wait. The GC stores the active join nonce, treats a matching late JOIN_ACK as a control packet, and resumes assigned-channel acquisition instead of logging it as wrong-size telemetry.
- [x] Replace active timing proposal/ACK exchange with telemetry-period inference.
  - Drone starts telemetry after `JOIN_ACK`, measures MSP read time locally, waits out a fixed MSP slot with a `15 ms` guard, and does not wait for `TX_PERIOD_ACK`.
  - GC accepts valid telemetry during assignment acquisition, rejects `sequenceDelta == 0`, infers the period from packet-to-packet RX timestamps, and persists `timingAccepted` after the first valid delta.
  - Legacy `TX_PERIOD_PROPOSAL` / `TX_PERIOD_ACK` packets remain reserved for mixed-firmware diagnostics but are not part of the current bind path.
- [x] Clamp inferred periods to the assigned profile's safe TX period.
  - Field diagnostic `sgc_gc_serial_2026-06-10T19-34-35-217Z.jsonl` showed Robust profile telemetry airtime of about `395 ms`, but old proposal handling accepted `256 ms`. Current inference requires at least `telemetryTxPeriodMs(assigned_profile)`.
- [x] Remove legacy `0x06` timing-proposal compatibility.
  - Field diagnostic `sgc_gc_serial_2026-06-10T19-57-32-998Z.jsonl` showed node `6` stuck in repeated `tx_period_proposal_received` / `tx_period_ack_sent` after timing was already accepted. Removing the old `0x06` proposal path prevents node-ID `6` packet collisions from keeping the scanner in the control-packet path.
- [x] Validate persisted assignment timing against the stored radio profile on GC boot.
  - If a saved `txPeriodMs` is too short for the saved profile, the GC keeps the channel/profile assignment but invalidates timing so the drone must reacquire safely.
- [x] Make unknown-phase assigned-channel reacquire windows profile-aware.
  - Robust assignments now get a receive window large enough for their airtime/period instead of the old fixed `140 ms` acquisition slice.
- [x] Guard post-ACK first telemetry lock against ACK-shaped stale/control packets.
  - Field diagnostic `sgc_gc_serial_2026-06-10T21-10-59-288Z.jsonl` showed no `drone_telemetry`, but 425 ignored packets with `packetLen=12` and `firstByte=0xA6` after `tx_period_ack_sent`.
  - Current firmware no longer sends `TX_PERIOD_ACK`, but GC still ignores `0xA6` ACK-shaped packets during assigned telemetry acquisition for mixed-firmware safety.
- [x] Clear stale receive flags around GC LoRa CAD/activity scans.
  - Field diagnostic `sgc_gc_serial_2026-06-10T21-27-09-251Z.jsonl` showed a power-cycled node `6` only recovered after assignment deletion because CAD/activity probing could cause the GC to reread stale assigned-channel packets during recovery and post-ACK acquisition.
  - `SimpleMesh::scanChannelActivity()` now clears the pending receive flag before CAD and after RX restart, preventing stale packet/FIFO state from blocking Search or relock.
- [x] Keep CAD/activity probing out of active assigned-channel RX windows.
  - Field diagnostic `sgc_gc_serial_2026-06-10T21-40-11-023Z.jsonl` showed Search completed assignment and `tx_period_ack_sent`, but the GC then repeatedly reported `cad_activity_detected` / `activity_without_valid_packet` and did not emit `drone_telemetry` until the serial close/open reset the GC.
  - The scanner now treats post-ACK/manual relock as clean receive-only windows. CAD is deferred so it cannot pull the SX1262 out of RX while the GC is trying to catch the first steady telemetry packet.
- [x] Increase predicted assigned-channel receive tolerance to `22 ms` pre-tune guard and `12 ms` post guard.
- [x] Make assigned-channel receive windows profile-aware.
  - The GC now uses `max(22 ms, ceil(3 symbols))` pre-tune guard and `max(12 ms, ceil(2 symbols))` post guard, then adds each assignment's telemetry airtime.
- [x] Make GC scheduler fairness profile-aware.
  - The scanner computes a cycle budget from active known-phase assignments and schedules each drone by service stride instead of assuming every drone can be caught every TX period.
- [x] Score overlapping receive windows by normalized age.
  - Slow Robust profiles are compared against their own target service interval, so they do not dominate Fast drones merely because their natural period is longer.
- [x] Emit per-drone `expectedUpdateMs` in `drone_telemetry` and `channel_table.assignments[]`.
  - SGC uses this expected service interval to scale ONLINE/LATE/STALE/OFFLINE thresholds, so four Robust drones at about `0.3-0.5 Hz` are not falsely marked stale when that rate is within receiver capacity.
- [x] Use a broad one-drone assigned-channel listen window when Search is inactive.
- [x] Replace the old immediate single-miss recovery with three-miss bounded recovery.
- [x] Emit `drone_link_status` JSON with `nodeId`, `state`, `activityDetected`, `txPeriodMs`, and `gcMillis`.
- [x] Show `LOCKING`, `WEAK`, `OFFLINE`, and `OFF` in SGC.
- [x] Use orange for `WEAK`, red for `OFFLINE`, and gray for `OFF`.
- [x] Let the operator click `OFFLINE` or `WEAK` to request `relock_drone`.
- [x] Add an SGC post-assignment telemetry watchdog for legacy `tx_period_ack_sent` logs.
  - If the browser sees the ACK event but no `drone_telemetry` for that node within about two seconds, SGC requests `get_status` and `get_channel_table` only. Automatic recovery belongs in the GC firmware; SGC does not silently send `relock_drone` because that creates operator-requested manual re-bind windows that can disrupt healthy drones.
  - Superseded by telemetry-period inference for current firmware: SGC should rely on `telemetry_period_observed` / `telemetry_period_locked` and normal telemetry freshness, while still tolerating old ACK events in logs.
- [x] Keep automatic SGC watchdogs from forcing manual re-bind.
  - Log `sgc_gc_serial_2026-06-12T21-39-22-826Z.jsonl` showed a stale node `6` assignment repeatedly entering `manual_relock_listen` while a strong node `7` missed robust-profile TST windows. The watchdog now records `assignment_watchdog_no_telemetry` and refreshes status without sending `relock_drone`.
- [x] Add visible SGC diagnostic-log controls for reproducing Search/relock failures.
  - The exported JSONL includes GC serial lines, outgoing SGC commands, local Bind/Re-bind click markers, serial open/close events, command timeouts, and a current-state snapshot.
  - The visible logger row was restored for the four-drone scheduler investigation.
- [x] Do not clear newly rejoined drones on `fresh_session_complete`.
  - Local drone clearing already happens when assignments are actually cleared; clearing again at completion can remove a drone that rejoined quickly during reset/search testing.
- [x] Debounce SGC terminal link display so a single missed receive window or one stray recovery packet cannot flicker a drone between `ONLINE` and `OFFLINE`.
  - `drone_link_status: offline` no longer overrides a fresh/late packet age.
  - Any valid `drone_telemetry` now clears stored `LOCKING`/`WEAK`/`OFF`/`OFFLINE` link status for that node immediately.
  - SGC ignores `drone_link_status` events whose `gcMillis` is older than or equal to the latest accepted telemetry for that node.
  - GC rejects duplicate telemetry `sequence_id` values before updating TST or emitting `drone_telemetry`.
  - SGC ignores duplicate per-drone `sequenceId` telemetry if it still arrives from any source.
- [ ] Bench-verify power-off classification becomes `OFF`.
- [ ] Bench-verify a disconnected drone stays in a stable non-online state without `ONLINE`/`OFFLINE` flicker.
- [ ] Field-verify weak-signal classification becomes `WEAK` when activity exists but packets do not decode.
- [ ] Bench-verify recovery does not permanently starve healthy drones.

## Milestone 3: Touch-Friendly Local Operator Tools

- [x] Start live-position mode without a default HOME marker.
- [x] Add a map long-touch/right-click menu action for HOME placement.
- [x] Let the operator choose `Set HOME here` or `Move HOME here` from that map menu.
- [x] Allow multiple local HOME markers.
- [x] Select HOME with long-touch/right-click on the HOME icon.
- [x] Keep HOME icon size constant and expand only the selected glow radius.
- [x] Keep a smaller glow around deselected HOME markers.
- [x] Deselect HOME on empty-map click.
- [x] Add selected-HOME `Move HOME` and `Delete HOME` actions.
- [x] Automatically center the map when HOME is selected.
- [x] Keep the selected-HOME menu anchored next to HOME after auto-centering.
- [x] Hide the selected-HOME menu when the rename menu opens.
- [x] Require confirmation before deleting a HOME marker.
- [x] Show a top helper while choosing the moved HOME coordinate.
- [x] Keep HOME local to SGC; do not command drones.
- [x] Add a live drone action bottom sheet for touch use.
- [x] Open the drone action sheet from drone-card long press.
- [x] Open the drone action sheet from drone-marker long press.
- [x] Add local rename support with aliases stored in `localStorage` by `nodeId`.
- [x] Display aliases on drone cards and tooltips while keeping node ID visible as secondary context.
- [x] Hide Delete while a drone is `ONLINE`.
- [x] Add `clear_assignment` SGC command support.
- [x] Add GC `clear_assignment` command support.
- [x] Delete a non-online drone only after operator confirmation and GC ACK.
- [ ] Browser-verify Home placement on the target touchscreen.
- [ ] Browser-verify multiple HOME creation, HOME selection, HOME move, and HOME delete.
- [ ] Browser-verify rename persists after page reload.
- [ ] Bench-verify Delete removes a stale/offline assignment from GC flash and SGC.

## Milestone 4: Per-Assignment Radio Profiles

- [x] Keep profile ID `0` as Fast: `SF8 / BW500 / CR4/5`.
- [x] Add deterministic profile ID encoding for advanced SF/BW/CR combinations.
- [x] Add simple presets:
  - [x] Fast: `SF8 / BW500 / CR4/5`.
  - [x] Balanced: `SF10 / BW500 / CR4/6`.
  - [x] Robust: `SF11 / BW250 / CR4/7`.
- [x] Add GC command support for `set_radio_profile`.
- [x] Persist the default profile for future assignments.
- [x] Apply the selected profile to newly allocated drones via `JOIN_ASSIGN.radio_profile_id`.
- [x] Add drone capability gating so non-profile-capable drones are assigned Fast profile `0` instead of the selected future profile.
- [x] Add extended-period capability gating so drones with older profile firmware fall back to Fast when Balanced/Robust would exceed the old `250 ms` assignment-period limit.
- [x] Reassign a rediscovered node when its existing assignment profile differs from the currently selected future profile, instead of silently reusing the old profile.
- [x] Have the drone decode and apply the assigned telemetry profile after assignment.
- [x] Have the GC switch to each drone's assigned profile while scanning.
- [x] Add SGC simple/advanced profile UI.
- [x] Render simple profile presets as one row of name-only buttons.
- [x] Make SGC Apply send `set_radio_profile` for future assignments only.
- [x] Close the profile picker after `set_radio_profile` is successfully sent.
- [x] Show each drone's assigned profile on its card.
- [x] Allow profile `64` (`SF12 / BW125 / CR4/8`) as an assigned telemetry profile.
  - The 20-byte telemetry airtime is about `1712 ms`; with the default `74 ms` airtime buffer, the computed TX period is about `1787 ms`.
  - GC and drone now share `TX_PERIOD_MAX_ACCEPT_MS = 2000`, so the drone can accept the assignment and timing ACK.
  - GC post-ACK lock, manual re-bind, automatic recovery, Search telemetry-round, and OOCR windows are no longer clipped by the old sub-second assumptions.
- [ ] Reflash GC and all drone ESP32s after the profile-ID change.
  - GC `COM18` has been flashed with the high-range control packet IDs (`0xA1-0xA6`) and profile-aware timing validation. Leave this unchecked until every drone ESP32 is flashed with the same firmware image.
- [ ] Bench-verify one Fast, one Balanced, and one Robust assignment.
- [ ] Field-verify Robust gives better reliability at the preferred lower update rate.

## Milestone 5: Three-Profile CAD Spectrum Scan

- [x] Replace the RSSI-first spectrum scan with profile-aware CAD/LBT scanning.
- [x] Scan each telemetry candidate channel with Fast, Balanced, and Robust profiles.
- [x] Classify channels as `free`, `occupied`, `assigned`, or `reserved`.
- [x] Keep assigned channels unavailable regardless of CAD result.
- [x] Measure RSSI only for occupied/assigned display and clamp SGC bar height from `-120` to `-30 dBm`.
- [x] Preserve compatibility fields: `clear`, `clearFrequencyMhz`, `noisyFrequencyMhz`, `medianRssi`, and `maxRssi`.
- [x] Add explicit serial fields: `activityDetected`, `detectedProfileIds`, `displayRssi`, `freeChannels`, `occupiedChannels`, and `assignedChannels`.
- [x] Render Free green, Occupied yellow, Assigned red, Shared blue, and reserved/guard neutral in SGC.
- [x] Treat CAD hits as low-confidence `cad_suspect` activity and confirm drone ownership only after decoded telemetry.
- [x] Add channel activity fields for `activitySource`, `activityConfidence`, `cadStatus`, `cadError`, `listenAttempted`, `confirmedDrone`, and `decodedNodeId`.
- [x] Use OOCR normal RX listen attempts to confirm CAD-suspect orphan channels instead of repeated CAD sampling.
- [ ] Bench-verify no-drone scan reports free telemetry candidates except real RF activity.
- [ ] Bench-verify an active unassigned LoRa transmitter reports occupied with its detecting profile ID.
- [ ] Bench-verify an assigned channel stays red/assigned even when CAD does not detect activity during the scan.
- [ ] Browser-verify the updated spectrum panel colors, labels, and RSSI-height scaling.

## Static Checks

- [x] SGC `node --check script.js`.
- [x] SGC `node --check serial_probe.js`.
- [x] SGC `git diff --check`.
- [x] Firmware `pio run -e seeed-xiao-s3`.
- [x] Firmware `git diff --check`.

## Out Of Scope

- [x] Do not add arming, launch, land, mission, payload, or other vehicle-actuation controls.
- [x] Do not make Delete a drone command; it only removes the persisted GC assignment.
- [x] Do not make HOME a drone command in this slice.
- [x] Do not use RSSI alone to infer LoRa activity.
