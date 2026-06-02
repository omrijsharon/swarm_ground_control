# Part 4: SGC Side Plan

Goal: turn SGC into a simple live drone position viewer for this branch while keeping existing C2 prototype code available but out of the operator path.

## Milestones And Tasks

- [ ] Milestone 1: Add live-position mode
  - [ ] Add a clear runtime mode for live drone position viewing.
  - [ ] Default this branch to the live-position-oriented UI.
  - [ ] Keep mock mode available for development.
  - [ ] Hide command sequence UI in live-position mode.
  - [ ] Hide command menus in live-position mode.
  - [ ] Hide or disable team/waypoint/mission controls in live-position mode.
  - [ ] Keep existing C2 code available for future branches.

- [ ] Milestone 2: Add serial connection UI
  - [ ] Add a compact USB serial connection control.
  - [ ] Show connected/disconnected state.
  - [ ] Show selected port state where browser APIs allow it.
  - [ ] Show baud rate.
  - [ ] Show last received message time.
  - [ ] Show JSON parse errors in a debug area.
  - [ ] Show browser compatibility message when Web Serial is unavailable.

- [ ] Milestone 3: Implement serial telemetry ingestion
  - [ ] Read newline-delimited serial lines.
  - [ ] Parse `drone_telemetry` messages.
  - [ ] Parse `gc_status` messages.
  - [ ] Parse `assignment_event` messages.
  - [ ] Parse `channel_table` messages.
  - [ ] Ignore unrelated firmware logs safely.
  - [ ] Validate required telemetry fields.
  - [ ] Convert incoming JSON to the internal SGC drone state.

- [ ] Milestone 4: Update live drone data model
  - [ ] Use real `nodeId` directly.
  - [ ] Do not apply `id + 1` in live mode.
  - [ ] Create a drone when the first telemetry packet for its node ID arrives.
  - [ ] Update existing drones by node ID.
  - [ ] Store latitude and longitude in degrees.
  - [ ] Store altitude in meters.
  - [ ] Store heading in degrees.
  - [ ] Store course over ground in degrees.
  - [ ] Store yaw in degrees.
  - [ ] Store speed in meters per second.
  - [ ] Store satellite count.
  - [ ] Store RSSI and SNR.
  - [ ] Store assigned frequency in MHz.
  - [ ] Store sequence ID.
  - [ ] Store last received timestamp.

- [ ] Milestone 5: Implement freshness states
  - [ ] Mark drone fresh when packet age is `< 500 ms`.
  - [ ] Mark drone late when packet age is `500-1500 ms`.
  - [ ] Mark drone stale when packet age is `1500-5000 ms`.
  - [ ] Mark drone offline when packet age is `> 5000 ms`.
  - [ ] Update marker style based on freshness.
  - [ ] Update list/panel style based on freshness.
  - [ ] Show packet age in tooltip or detail panel.

- [ ] Milestone 6: Update map rendering
  - [ ] Draw one marker per live drone.
  - [ ] Draw heading arrow from the derived `heading` field.
  - [ ] Show stale/offline state clearly on the map.
  - [ ] Keep map redraw efficient for 2-5 Hz updates per drone.
  - [ ] Avoid command relationship visuals in live-position mode.
  - [ ] Avoid mock swarm clutter in live mode.

- [ ] Milestone 7: Replace right-side status content for live mode
  - [ ] Show drone node ID.
  - [ ] Show freshness state.
  - [ ] Show altitude.
  - [ ] Show speed in m/s and optionally km/h.
  - [ ] Show heading.
  - [ ] Show RSSI.
  - [ ] Show SNR.
  - [ ] Show satellite count.
  - [ ] Show assigned frequency MHz.
  - [ ] Show last update age.

- [ ] Milestone 8: Add GC/radio status display
  - [ ] Show GC serial connection state.
  - [ ] Show shared frequency.
  - [ ] Show active SF/BW/CR.
  - [ ] Show TX power as fixed `22 dBm`.
  - [ ] Show computed telemetry airtime.
  - [ ] Show configured airtime buffer.
  - [ ] Show assigned drone count.
  - [ ] Show clear/noisy channel counts.
  - [ ] Show recent assignment events.

- [ ] Milestone 9: Add radio settings UI
  - [ ] Let the user view active spreading factor.
  - [ ] Let the user view active bandwidth.
  - [ ] Let the user view active coding rate.
  - [ ] Let the user view active airtime buffer.
  - [ ] Add controls for SF/BW/CR/buffer only after serial command support exists.
  - [ ] Keep TX power read-only at `22 dBm`.
  - [ ] Show recalculated airtime after setting changes.

- [ ] Milestone 10: Add live-position mock mode
  - [ ] Simulate about 5 drones by default.
  - [ ] Simulate 2-5 Hz telemetry updates.
  - [ ] Simulate heading/course/yaw fields.
  - [ ] Simulate RSSI and SNR.
  - [ ] Simulate satellite count.
  - [ ] Simulate assigned frequencies.
  - [ ] Simulate stale/late/offline behavior.
  - [ ] Keep old 104-drone mock only as optional stress/demo mode if still needed.

- [ ] Milestone 11: Manual verification
  - [ ] Verify SGC can run without serial connected.
  - [ ] Verify mock mode displays 5 drones.
  - [ ] Verify serial mode creates drones dynamically.
  - [ ] Verify map heading arrows follow telemetry.
  - [ ] Verify freshness thresholds update correctly.
  - [ ] Verify command UI is hidden in live-position mode.
  - [ ] Verify UI remains usable on desktop viewport.
  - [ ] Verify UI remains usable on mobile/tablet viewport where Web Serial is supported.

## Out Of Scope

- [ ] Do not add mission execution.
- [ ] Do not add arm/disarm/takeoff/land controls.
- [ ] Do not add attack/search/target behavior.
- [ ] Do not implement team control.
- [ ] Do not implement waypoint command behavior.
