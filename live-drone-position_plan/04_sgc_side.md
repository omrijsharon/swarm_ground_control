# Part 4: SGC Side Plan

Goal: turn SGC into a simple live drone position viewer for this branch while keeping existing C2 prototype code available but out of the operator path.

## Milestones And Tasks

- [x] Milestone 1: Add live-position mode
  - [x] Add a clear runtime mode for live drone position viewing.
  - [x] Default this branch to the live-position-oriented UI.
  - [x] Keep mock mode available for development.
  - [x] Hide command sequence UI in live-position mode.
  - [x] Hide command menus in live-position mode.
  - [x] Hide or disable team/waypoint/mission controls in live-position mode.
  - [x] Keep existing C2 code available for future branches.

- [x] Milestone 2: Add serial connection UI
  - [x] Add a compact USB serial connection control.
  - [x] Show connected/disconnected state.
  - [x] Show selected port state where browser APIs allow it.
  - [x] Show baud rate.
  - [x] Show last received message time.
  - [x] Show JSON parse errors in a debug area.
  - [x] Show browser compatibility message when Web Serial is unavailable.

- [x] Milestone 3: Implement serial telemetry ingestion
  - [x] Read newline-delimited serial lines.
  - [x] Parse `drone_telemetry` messages.
  - [x] Parse `gc_status` messages.
  - [x] Parse `assignment_event` messages.
  - [x] Parse `channel_table` messages.
  - [x] Ignore unrelated firmware logs safely.
  - [x] Validate required telemetry fields.
  - [x] Convert incoming JSON to the internal SGC drone state.

- [x] Milestone 4: Update live drone data model
  - [x] Use real `nodeId` directly.
  - [x] Do not apply `id + 1` in live mode.
  - [x] Create a drone when the first telemetry packet for its node ID arrives.
  - [x] Update existing drones by node ID.
  - [x] Store latitude and longitude in degrees.
  - [x] Store altitude in meters.
  - [x] Store heading in degrees.
  - [x] Store course over ground in degrees.
  - [x] Store yaw in degrees.
  - [x] Store heading-fusion debug fields.
    - `yawHeading`, `yawBiasDeg`, `yawBiasValid`, `yawBiasSamples`, `cogWeight`, and `cogTrusted`.
  - [x] Store speed in meters per second.
  - [x] Store satellite count.
  - [x] Store RSSI and SNR.
  - [x] Store assigned frequency in MHz.
  - [x] Store sequence ID.
  - [x] Store last received timestamp.

- [x] Milestone 5: Implement freshness states
  - [x] Mark drone fresh when packet age is `< 1000 ms`.
  - [x] Mark drone late when packet age is `1000-2000 ms`.
  - [x] Mark drone stale when packet age is `2000-5000 ms`.
  - [x] Mark drone offline when packet age is `> 5000 ms`.
  - [x] Display the fresh state as `ONLINE` in the operator UI.
  - [x] Update marker style based on freshness.
  - [x] Update list/panel style based on freshness.
  - [x] Show packet age in tooltip or detail panel.

- [x] Milestone 6: Update map rendering
  - [x] Draw one marker per live drone.
  - [x] Draw heading arrow from the derived `heading` field.
  - [x] Show stale/offline state clearly on the map.
  - [x] Keep map redraw efficient for 2-5 Hz updates per drone.
  - [x] Avoid command relationship visuals in live-position mode.
  - [x] Avoid mock swarm clutter in live mode.

- [x] Milestone 7: Replace right-side status content for live mode
  - [x] Show drone node ID.
  - [x] Show freshness state.
  - [x] Show altitude.
  - [x] Show speed in m/s and optionally km/h.
  - [x] Show heading.
  - [x] Show heading-fusion source/debug summary.
  - [x] Show RSSI.
  - [x] Show SNR.
  - [x] Show satellite count.
  - [x] Show assigned frequency MHz.
  - [x] Show last update age.

- [x] Milestone 8: Add GC/radio status display
  - [x] Show GC serial connection state.
  - [x] Show shared frequency.
  - [x] Show active telemetry SF/BW/CR.
  - [x] Show robust discovery/join SF/BW/CR when GC reports it.
  - [x] Show TX power as fixed `22 dBm`.
  - [x] Show computed telemetry airtime.
  - [x] Show configured airtime buffer.
  - [x] Show assigned drone count.
  - [x] Show clear/noisy channel counts.
  - [x] Show recent assignment events.

- [x] Milestone 9: Add radio settings UI
  - [x] Let the user view active spreading factor.
  - [x] Let the user view active bandwidth.
  - [x] Let the user view active coding rate.
  - [x] Let the user view active airtime buffer.
  - [x] Add controls for SF/BW/CR/buffer only after serial command support exists.
  - [x] Keep TX power read-only at `22 dBm`.
  - [x] Show recalculated airtime after setting changes.

- [x] Milestone 10: Add live-position mock mode
  - [x] Simulate about 5 drones by default.
  - [x] Simulate 2-5 Hz telemetry updates.
  - [x] Simulate heading/course/yaw fields.
  - [x] Simulate RSSI and SNR.
  - [x] Simulate satellite count.
  - [x] Simulate assigned frequencies.
  - [x] Simulate stale/late/offline behavior.
  - [x] Keep old 104-drone mock only as optional stress/demo mode if still needed.

- [x] Milestone 11: Manual verification
  - [x] Verify SGC can run without serial connected. Verified manually.
  - [x] Verify mock mode displays 5 drones. Verified manually.
  - [x] Verify serial mode creates drones dynamically. Verified manually.
  - [x] Verify map heading arrows follow telemetry. Verified manually.
  - [x] Verify freshness thresholds update correctly. Verified manually; thresholds updated to fresh `< 1000 ms`, late `1000-2000 ms`, stale `2000-5000 ms`, offline `> 5000 ms`.
  - [x] Verify command UI is hidden in live-position mode. Verified manually.
  - [x] Verify UI remains usable on desktop viewport. Verified manually in full-screen and non-full-screen desktop browser windows.
  - [x] Verify UI remains usable on mobile/tablet viewport where Web Serial is supported. Verified manually.

- [x] Milestone 12: Add GC lifecycle and spectrum UI
  - [x] Request `get_status` after the USB serial connection opens.
  - [x] Request `get_channel_table` after the USB serial connection opens.
  - [x] Parse and store `channel_scan_event` messages.
  - [x] Show a boot/scanning state while channel scan messages arrive.
  - [x] Render a compact spectrum/noise-floor visualization in the GC/radio panel.
  - [x] Mark shared, guard, clear, noisy, and assigned channels in the spectrum view.
  - [x] Keep the existing clear/noisy count summary.
  - [x] Add an operator fresh-session control.
    - First implemented as `Start Fresh Session` in the GC/radio panel; later moved to the top USB serial control row as `Reset`.
  - [x] Show a confirmation dialog before sending the fresh-session command.
  - [x] Confirmation copy states that previous channel assignments will be deleted.
  - [x] Send `clear_all_assignments` with `reason:"start_fresh_session"` after confirmation.
  - [x] Disable the button while the command is pending.
  - [x] Show accepted/rejected command feedback in the serial/debug area.
  - [x] Clear live drone cards only after GC confirms assignments were cleared or drones go stale/offline naturally.
  - [x] Remove live drone cards immediately after GC confirms `clear_all_assignments`.
  - [x] Parse `scanner_event` messages.
  - [x] Show scanner acquisition, missed-packet, and stale-slot events in the existing debug area.

- [x] Milestone 13: Boot scan animation and serial reset recovery
  - [x] Render channel scan events progressively so the spectrum bars fill during a live scan.
  - [x] Keep updating spectrum bars when the GC rechecks initially noisy channels.
  - [x] Show a debug line when the GC starts noisy-channel recheck.
  - [x] Hide the spectrum view about 3 seconds after `scan_complete`.
  - [x] Keep the GC clear/noisy/assigned summary visible after the spectrum hides.
  - [x] Remember the last successfully opened Web Serial port for the current page session.
  - [x] Retry granted serial ports after GC disconnect/reset.
  - [x] Re-request `get_status` and `get_channel_table` after automatic reconnect.
  - [x] Stop automatic reconnect after the user clicks `Close`.
  - [x] Manually verify GC reset reconnects SGC without clicking `Open`.
    - User manual browser check passed.
  - [x] Manually verify boot/fresh-session scan animation fills live and then hides.
    - User manual browser check passed.
  - [x] Manually verify closing the port disables reset auto-reconnect.
    - User manual browser check passed.

- [x] Milestone 14: Production UI first pass
  - [x] Replace the visible mock on/off button with a production `Reset` button.
  - [x] Keep mock mode available internally but remove it from the normal operator path.
  - [x] Wire `Reset` to the existing confirmed fresh-session command.
  - [x] Remove the duplicate `Start Fresh` button from the GC/radio panel.
  - [x] Remove operator text that points to hidden mock mode.
  - [x] Add browser receive timestamps to live telemetry history.
  - [x] Add a fixed-width drone card timing line so the age value does not shift as digit count changes.
  - [x] Add recent update-rate display from the last three receive intervals.

- [x] Milestone 15: Production UI cleanup second pass
  - [x] Remove USB serial metadata and visible serial/debug log text below the control buttons.
  - [x] Remove the `Assigned debug` line from the GC/radio panel.
  - [x] Remove the `Last command` line from the GC/radio panel.
  - [x] Remove heading, fusion, and GPS rows from live drone cards.
  - [x] Show live drone speed in km/h only.
  - [x] Apply the same live drone detail simplification to the hover/pinned tooltip.

- [x] Milestone 16: SGC-only radio profile picker preparation
  - [x] Make the GC `Profile` field clickable.
  - [x] Render an inline segmented profile picker for spreading factor, bandwidth, and coding rate.
  - [x] Locally preview 20-byte LoRa telemetry airtime from the selected profile.
  - [x] Mark the picker as applying to future assignments only.
  - [x] Keep Apply disabled with `Firmware update required` until GC firmware implements `set_radio_profile`.
  - [x] Add a helper that builds the future `set_radio_profile` command payload without sending it.
  - [x] Store live drone `radioProfileId`, `txPeriodMs`, and `telemetryAirtimeMs` from telemetry.
  - [x] Use `channel_table.assignments[]` as a fallback source for drone profile display.
  - [x] Show each drone card's assigned profile.
  - [x] Keep the inline profile picker stable by avoiding GC-panel rerenders from telemetry packets and one-second age refreshes.

- [ ] Milestone 17: On-demand spectrum panel
  - [x] Make the GC `Channels` field clickable.
  - [x] Open an inline spectrum panel from the `Channels` label/value.
  - [x] Reuse the latest `channel_table.channels[]` data when opening the panel after a completed scan.
  - [x] Keep the panel open until the operator closes it.
  - [x] Add a close icon to the spectrum panel.
  - [x] Add clear/noisy/assigned scan metadata to the panel.
  - [x] Add a confirmed `Re-scan` action that sends `rescan_channels`.
  - [x] Show operator-facing status for re-scan send, accepted, rejected, timeout, scanning, and complete states.
  - [x] Keep boot/fresh-session scan animation behavior unchanged when the panel is closed.
  - [ ] Manually verify opening and closing the spectrum panel in the browser.
  - [ ] Manually verify canceling `Re-scan` sends no command.
  - [ ] Manually verify confirming `Re-scan` fills the spectrum live and telemetry recovers after scan.

- [ ] Milestone 18: Drone TST re-lock UI
  - [x] Add transient `LOCKING` display state for manual TST recovery.
  - [x] Make only the `OFFLINE` badge clickable.
  - [x] Clicking `OFFLINE` sends `relock_drone` with the drone `nodeId`.
  - [x] Stop badge clicks from also selecting/focusing the drone card.
  - [x] Clear `LOCKING` immediately when telemetry arrives for that node.
  - [x] Expire `LOCKING` after `8 seconds` if telemetry does not resume.
  - [x] Apply `ONLINE`/`LOCKING` label mapping in the drone tooltip.
  - [ ] Manually verify `OFFLINE -> LOCKING -> ONLINE` in the browser.
  - [ ] Manually verify failed relock returns to `OFFLINE` after timeout.

## Out Of Scope

- [x] Do not add mission execution.
- [x] Do not add arm/disarm/takeoff/land controls.
- [x] Do not add attack/search/target behavior.
- [x] Do not implement team control.
- [x] Do not implement waypoint command behavior.

## Implementation Notes

- Live-position mode is the default branch UI through `APP_MODE = "live-position"`.
- Existing C2 prototype code remains in `script.js`, but the left command sequence panel is hidden in live mode.
- The right panel now owns USB serial controls, GC/radio status, and live drone status.
- `Reset` uses the same in-panel fresh-session confirmation block instead of native `window.confirm()`, because the native browser dialog produced no visible response in manual testing.
- When real serial `drone_telemetry` arrives, live mock drones are cleared so hardware telemetry owns the map.
- Mock mode now starts off by default; the browser attempts to auto-open a single remembered Web Serial port.
- The production operator UI hides serial debug text, assigned-count debug text, and last-command debug text.
- Drone cards and tooltips keep the operator-facing essentials: timing/update rate, altitude, speed, RSSI/SNR, satellite count, and channel/sequence details where applicable.
- The GC profile picker now sends `set_radio_profile`; profile changes apply only to future assignments.
- Browser smoke check after adding heading-fusion debug fields passed manually in SGC.
- Production UI first pass static verification completed: `node --check script.js`, `git diff --check`, and local static fetch confirmed `Reset` exists and the visible mock toggle is absent.
- Verification completed in this implementation pass: `node --check script.js`, `node --check serial_probe.js`, and static HTTP fetch of `http://localhost:8000/`.
- Browser visual verification could not be completed in this session because the in-app browser backend was unavailable.

## Field Follow-Up UI

These tasks mirror `08_field_test_followups.md`.

- [x] Add a `Search` button to the USB Serial panel.
- [x] Disable and style Search while the GC reports active Search mode.
- [x] Parse `search_event` and `gc_status.searchMode`.
- [x] Parse `drone_link_status`.
- [x] Display `ONLINE`, `LOCKING`, `WEAK`, `OFFLINE`, and `OFF`.
- [x] Make `WEAK` orange, `OFFLINE` red, and `OFF` gray.
- [x] Let `WEAK` and `OFFLINE` badges request `relock_drone`.
- [x] Add a live-mode Home map tool for local HOME placement.
- [x] Add drone-card long-press action sheet.
- [x] Add drone-marker long-press action sheet.
- [x] Add local drone aliases stored in `localStorage`.
- [x] Hide Delete while a drone is `ONLINE`.
- [x] Delete a non-online drone only through `clear_assignment` and GC ACK.
- [x] Replace the profile picker preview with an active Simple/Advanced profile selector.
- [x] Add Fast, Balanced, and Robust preset buttons.
- [x] Send `set_radio_profile` for future assignments only.
- [x] Decode deterministic profile IDs for drone-card profile display.
- [ ] Browser-verify Search mode with a flashed GC.
- [ ] Browser-verify Home placement on the target touchscreen.
- [ ] Browser-verify Rename persistence after reload.
- [ ] Browser-verify Delete is hidden for online drones and works for offline/stale drones.
- [ ] Browser-verify profile Apply changes the profile used by future assignments only.

## Cloudflare Live Relay UI

These tasks mirror `09_cloudflare_live_relay.md`.

- [x] Add a compact telemetry source selector.
- [x] Support `USB Serial`, `Live Endpoint`, and `USB + Broadcast`.
- [x] Default to `USB Serial`.
- [x] Add relay endpoint, session ID, and publish-token controls.
- [x] Hide publish-token input unless `USB + Broadcast` is selected.
- [x] Store source mode, endpoint, and session ID in localStorage.
- [x] Keep publish token in page memory only.
- [x] Connect to the live relay as a viewer in `Live Endpoint` mode.
- [x] Connect to the live relay as a publisher in `USB + Broadcast` mode.
- [x] Publish parsed GC JSON after local serial handling.
- [x] Consume relay messages through the same live protocol handler used by USB serial.
- [x] Show live relay connection state.
- [x] Disable Reset, Search, Re-lock, Delete, Re-scan, and Profile Apply in viewer mode.
- [x] Show viewer-friendly empty-state text when no relay telemetry has arrived.
- [ ] Browser-verify the operator can use USB Serial normally after adding source modes.
- [ ] Browser-verify `USB + Broadcast` publishes telemetry to Cloudflare.
- [ ] Browser-verify a second browser in `Live Endpoint` mode sees the same drones.
- [ ] Browser-verify remote command controls are unavailable.
