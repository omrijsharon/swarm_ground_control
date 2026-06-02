# Swarm Ground Control Agent Guide

This repo is currently on the `feature/live-drone-position` branch. In this branch, Swarm Ground Control is being narrowed from a broad browser-based C2 mockup into a live drone position viewer.

The goal for this branch is simple and specific:

- Show about five live drones on the map.
- Receive telemetry from one ground-control ESP32 over USB serial.
- Display each drone's location, altitude, heading, speed, freshness, RSSI/SNR, satellite count, and assigned LoRa frequency.
- Hide command, mission, team, waypoint, and other C2 controls from the normal operator path.

Do not treat this branch as a general mission-command implementation. The branch is for live position visibility first.

## Related Repos

The companion firmware repo is:

```text
C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh
```

That repo owns the ESP32/LoRa firmware. In this branch design:

- The GC ESP32 is connected to SGC by USB serial.
- The GC ESP32 owns LoRa channel allocation, join handling, channel scanning, heading fusion, and persisted channel assignments.
- Drone ESP32 nodes read flight-controller telemetry through Betaflight MSP and transmit compact binary LoRa telemetry.
- SGC does not talk LoRa directly and does not own timing-critical radio behavior.

## Planning Docs

The branch plan lives in:

```text
live-drone-position_plan/
```

Read these files before implementing branch work:

- `00_overview.md`: branch scope, assumptions, defaults, and overall milestones.
- `01_small_serial_test.md`: first required proof that browser SGC can read ESP32 USB serial.
- `02_air_protocol_binary.md`: compact LoRa air protocol and 20-byte telemetry packet.
- `03_serial_protocol_json.md`: USB serial JSON contract between GC ESP32 and SGC.
- `04_sgc_side.md`: SGC UI and telemetry ingestion plan.
- `05_simple_mesh_firmware_side.md`: firmware role plan for GC and drone ESP32 nodes.

## Checklist Behavior

When implementing work from `live-drone-position_plan/`, update the relevant markdown checklist as part of the same change.

Rules:

- Mark a task from `[ ]` to `[x]` only when that task is actually complete.
- Mark a milestone `[x]` only when all of its child tasks are complete.
- If a task is partially complete, leave it unchecked and add a short note only if the partial state would confuse the next agent.
- Do not check off future work just because the design is agreed.
- If implementation changes the plan, update the plan text before or alongside the code change.

This checklist behavior is part of the desired workflow for this branch.

## Current Repo Reality

At the time this guide was updated, the checked-in SGC app defaults to the live-position branch UI while retaining the older C2 prototype code:

- Static web app: `index.html`, `style.css`, `config.js`, and monolithic `script.js`.
- Leaflet map centered around Tel Aviv.
- Canvas overlay for live drones, heading arrows, freshness labels, and ground stations in live-position mode.
- Compact USB serial control panel in the right-side `Live Drones` panel.
- Web Serial ingestion for newline-delimited JSON from the GC ESP32.
- Live telemetry creates/updates drones by real `nodeId`.
- Live-position mock mode simulates about five drones for development without hardware.
- GC/radio status display shows serial state, shared frequency, SF/BW/CR, TX power, airtime, channel counts, and recent assignment events.
- The older deterministic 104-drone mock and command UI still exist in code for non-live/prototype paths.
- The left-side `Commands Sequence` panel is hidden in live-position mode.
- In-memory teams, waypoints, ground stations, command sequences, and command labels.
- No backend.
- No WebSocket telemetry path.
- No real command transport.

For this branch, do not expand the old command system unless the user explicitly asks. Prefer isolating live-position work from existing C2 mock behavior.

## Branch Architecture

The agreed project split is:

1. Small serial test.
2. Air protocol, compact binary over LoRa.
3. USB serial protocol, JSON between SGC and GC ESP32.
4. SGC live-position UI and telemetry ingestion.
5. simple-mesh ESP32/LoRa firmware changes.

Keep these boundaries clear. The browser app should render and inspect telemetry; the GC firmware should own radio allocation and scanning.

## Radio And Protocol Summary

Default radio profile for this branch:

```text
SF8
BW500 kHz
CR 4/5
preamble 8
TX power 22 dBm on SX1262
```

The shared discovery/control channel is planned at `915.0 MHz`.

Telemetry uses assigned per-drone channels. The GC cycles through known assigned channels and periodically returns to the shared channel to discover new drones.

The agreed air protocol direction:

- Use a single-GC star protocol, not the older flood mesh frame.
- Use compact type-specific shared-channel packets.
- Use a 20-byte assigned-channel telemetry packet.
- Do not include derived `heading` or `headingSource` in LoRa telemetry.
- Let the GC firmware derive heading from raw CoG, yaw, speed, and yaw bias.
- Use LoRa PHY CRC rather than adding a second payload CRC in v1.

Planned 20-byte telemetry payload:

```text
node_id            uint8    1
flags              uint8    1
lat_e7             int32    4
lng_e7             int32    4
alt_cm             uint16   2
course_ddeg        uint16   2
yaw_deg            int16    2
ground_speed_cms   uint16   2
satellite_count    uint8    1
sequence_id        uint8    1
-----------------------------
total                      20 bytes
```

`sequence_id` is a small wrapping counter used for debugging missed/repeated packets and avoiding identical repeated telemetry payloads.

## USB Serial JSON Summary

SGC receives newline-delimited JSON over USB serial from the GC ESP32.

The serial JSON should use human-readable units:

- `lat`/`lng`: decimal degrees.
- `alt`: meters.
- `groundSpeed`: meters per second.
- `heading`, `courseOverGround`, `yaw`: degrees.
- `frequencyMhz`: MHz.
- `rssi`: dBm.
- `snr`: dB.

Candidate drone telemetry shape:

```json
{"type":"drone_telemetry","nodeId":2,"lat":32.0596637,"lng":34.8503487,"alt":18.4,"heading":127.5,"headingSource":"course_over_ground","courseOverGround":127.5,"yaw":132.0,"groundSpeed":4.2,"satelliteCount":12,"rssi":-82,"snr":9.5,"frequencyMhz":916.0,"sequenceId":44,"receivedAt":1710000000000}
```

SGC should tolerate normal firmware log lines on serial during development and parse only complete JSON lines.

## SGC Live-Position Behavior

Live mode should:

- Create drones dynamically from telemetry `nodeId`.
- Use real `nodeId` directly. Do not apply the old mock `id + 1` display rule in live mode.
- Use `heading` from serial JSON for the map arrow.
- Also store/display raw `courseOverGround` and `yaw`.
- Show `frequencyMhz` per drone.
- Show RSSI/SNR measured by the GC receiver.
- Show satellite count.
- Show speed in meters per second and optionally convert to km/h in UI.
- Show packet age and freshness state.
- Hide command sequence UI and command menus from the normal live-position operator path.

Freshness thresholds:

```text
fresh:   < 500 ms
late:    500-1500 ms
stale:   1500-5000 ms
offline: > 5000 ms
```

Mock mode for this branch should simulate the real target:

- About five drones.
- 2-5 Hz telemetry.
- Heading, CoG, yaw, speed, satellite count, RSSI/SNR, assigned frequency, and stale/offline behavior.

The older 104-drone swarm can remain as an optional stress/demo mode if useful, but it should not be the default live-position branch experience.

## Repository Layout

- `index.html`: Static HTML shell. Loads Leaflet from CDN, `config.js`, `style.css`, and `script.js`.
- `style.css`: Visual styling, panel sizing, map overlay UI, command chips, status panel, comms panel, and mobile viewport handling.
- `config.js`: Small config object for telemetry history, battery-rate smoothing, stale-link threshold, and selection glow tuning.
- `script.js`: The current monolithic application. It contains data model, mock telemetry, map setup, command logic, menus, panels, drawing, and interaction handlers.
- `SIMPLE_MESH_FIRMWARE.md`: Notes about the companion firmware repo and how it relates to SGC.
- `live-drone-position_plan/`: Branch implementation plans and checklists.
- `ACTIONS.md`: Older notes on command/action catalog and local command gating.
- `TODO.md`: Older future-work notes.
- `solution_for_repeated_issues.md`: Prior fix notes. Read before changing menu selection/tooltip behavior.

There is no package manifest, build system, test runner, bundler, module loader, or framework in the SGC repo.

## Running It

This is a static web app.

Open `index.html` directly in a browser, or serve the folder with a simple local server:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Notes:

- Internet access is needed for Leaflet, Google Fonts, and Esri map tiles.
- Browser geolocation usually requires `localhost` or HTTPS.
- Browser Web Serial also depends on browser support and user permission.
- App state is currently in memory only.

## Current Runtime Flow

On `DOMContentLoaded`, the current `script.js`:

1. Initializes timestamp, viewport/keyboard handling, collapsible panels, and command sequence buttons.
2. Creates `groundControl = new GroundControl()`.
3. Initializes the Leaflet map and layer picker with `initMapOnline()`.
4. Builds the old mock swarm with `makeMockSwarm()`.
5. Adds default ground stations with `initGroundStations()`.
6. Attempts to add user home from browser geolocation with `tryAddUserHomeFromDevice()`.
7. Sets up the canvas overlay with `setupOverlay()`.
8. Registers map hover/click/context-menu/long-press handlers with `setupHoverHandlers()`.
9. Refreshes the status list, sequence panel, and tooltip every second.
10. Draws the overlay once the Leaflet map is ready.

Live-position work should introduce a clean telemetry ingress path rather than scattering serial parsing through unrelated menu or command code.

## Current Data Model Notes

`Drone`

- Holds `id`, `type`, telemetry `history`, current telemetry, last receive time, and command cooldown.
- `updateTelemetry(packet)` normalizes incoming packet fields and stores current state.
- Existing telemetry fields include `uptimeSec`, `lat`, `lng`, `alt`, `heading`, `battery`, `rssi`, `command`, `armed`, and `rescuePhase`.
- Existing mock IDs are zero-based and labels use `Drone #${id + 1}`. Live mode must not use this offset.

`GroundControl`

- Tracks assigned missions and planned command sequences in the old prototype.
- For live-position work, do not reuse this mission model as the radio assignment source of truth. GC firmware owns channel assignments.

Important global state in the old prototype includes `drones`, `groundStations`, `waypoints`, `waypointTargets`, `followTargets`, `homeTargets`, `orbitTargets`, `teams`, `pinnedDroneId`, and `pinnedTeamId`.

## Implementation Cautions

- `script.js` is monolithic and stateful. Small changes can affect menus, panels, selection, drawing, and mock telemetry.
- Prefer adding small, clearly named live-position helpers/adapters over rewriting large unrelated sections.
- Do not replace old command labels casually. Existing sequence playback parses strings such as `Goto WP #<id> (spd <n> km/h, alt <m> m)`.
- Existing menu close functions often set short suppression timers. Preserve them unless deliberately redesigning those interactions.
- Read `solution_for_repeated_issues.md` before changing command-finalization, menu reopening, or tooltip behavior.
- `config.js` is loaded before `script.js`; use config-style settings there when practical.
- There is no persistence layer in SGC. GC assignment persistence belongs in firmware flash, not browser local state, unless explicitly requested.
- Manual browser verification is required after UI changes because there are no automated tests.

## Safety And Scope Notes

This repo still contains C2 language and inert placeholder labels such as `Attack target` from the older prototype. Do not add real-world targeting, payload, attack, arming, takeoff, landing, or mission-actuation behavior in this branch.

This branch should prove one thing:

```text
Can SGC reliably show about five real drones on a map at 2-5 Hz with heading, freshness, and radio link context?
```

Keep work focused on that outcome.
