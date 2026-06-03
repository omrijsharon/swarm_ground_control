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
  - [x] Show RSSI.
  - [x] Show SNR.
  - [x] Show satellite count.
  - [x] Show assigned frequency MHz.
  - [x] Show last update age.

- [x] Milestone 8: Add GC/radio status display
  - [x] Show GC serial connection state.
  - [x] Show shared frequency.
  - [x] Show active SF/BW/CR.
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
- When real serial `drone_telemetry` arrives, live mock drones are cleared so hardware telemetry owns the map.
- Verification completed in this implementation pass: `node --check script.js`, `node --check serial_probe.js`, and static HTTP fetch of `http://localhost:8000/`.
- Browser visual verification could not be completed in this session because the in-app browser backend was unavailable.
