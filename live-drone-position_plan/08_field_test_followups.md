# Field Test Follow-Ups

Goal: address the first field-test findings without expanding this branch into mission control. This plan keeps the GC focused on live position tracking, operator-controlled admission of new drones, link diagnosis, touch-friendly local UI tools, and per-assignment radio robustness.

## Milestone 1: Operator-Controlled Search Mode

- [x] Add an SGC `Search` button in the USB Serial panel above `Open` and `Close`.
- [x] Add SGC command support for `start_search`.
- [x] Add GC command support for `start_search`.
- [x] Add `gc_status.searchMode`.
- [x] Add `search_event` serial messages for search lifecycle.
- [x] Stop automatic shared-channel visits while assigned drones exist and search mode is inactive.
- [x] Keep the GC on shared discovery automatically when no drones are assigned.
- [x] In search mode, listen on the shared channel for join requests.
- [x] After a successful assignment/timing lock, run one telemetry scanner round before returning to shared discovery.
- [x] Stop search after a shared dwell with no valid join request and no LoRa CAD activity.
- [ ] Bench-verify active drones do not lag from periodic shared-channel visits while Search is off.
- [ ] Bench-verify Search admits a new drone and then stops after the shared channel is packet-free.

## Milestone 2: Link Diagnosis And Recovery

- [x] Add radio backend support for LoRa CAD/activity detection.
- [x] Use RadioLib `scanChannel()` on SX1262 backends instead of RSSI-only detection.
- [x] Add GC link states: `locking`, `weak`, `offline`, and `off`.
- [x] When assigned telemetry is missed, spend `3 * txPeriodMs` trying to reacquire that drone.
- [x] During recovery, use CAD/activity detection plus normal packet receive.
- [x] Emit `drone_link_status` JSON with `nodeId`, `state`, `activityDetected`, `txPeriodMs`, and `gcMillis`.
- [x] Show `LOCKING`, `WEAK`, `OFFLINE`, and `OFF` in SGC.
- [x] Use orange for `WEAK`, red for `OFFLINE`, and gray for `OFF`.
- [x] Let the operator click `OFFLINE` or `WEAK` to request `relock_drone`.
- [ ] Bench-verify power-off classification becomes `OFF`.
- [ ] Field-verify weak-signal classification becomes `WEAK` when activity exists but packets do not decode.
- [ ] Bench-verify recovery does not permanently starve healthy drones.

## Milestone 3: Touch-Friendly Local Operator Tools

- [x] Start live-position mode without a default HOME marker.
- [x] Add a map long-touch/right-click menu action for HOME placement.
- [x] Let the operator choose `Set HOME here` or `Move HOME here` from that map menu.
- [x] Allow multiple local HOME markers.
- [x] Select HOME with long-touch/right-click on the HOME icon.
- [x] Make selected HOME visually larger with stronger glow.
- [x] Add selected-HOME `Move HOME` and `Delete HOME` actions.
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
- [x] Have the drone decode and apply the assigned telemetry profile after assignment.
- [x] Have the GC switch to each drone's assigned profile while scanning.
- [x] Add SGC simple/advanced profile UI.
- [x] Make SGC Apply send `set_radio_profile` for future assignments only.
- [x] Show each drone's assigned profile on its card.
- [ ] Reflash GC and all drone ESP32s after the profile-ID change.
- [ ] Bench-verify one Fast, one Balanced, and one Robust assignment.
- [ ] Field-verify Robust gives better reliability at the preferred lower update rate.

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
