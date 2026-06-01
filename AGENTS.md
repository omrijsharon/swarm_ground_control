# Swarm Ground Control Agent Guide

This repo is a browser-based ground-control/C2 prototype for managing a swarm of drones on a map. It is meant to explore the operator experience for monitoring many drones, selecting drones or teams, planning command sequences, creating waypoints, using ground-station anchors, and visualizing drone relationships such as goto, follow, return-to-home, orbit, and flank paths.

The current implementation is a UI-only mock. There is no backend, no serial/radio link, no WebSocket, no telemetry server, and no real command transport. Commands mutate in-memory JavaScript state so the interface can show how a real control surface should feel. Treat it as a design/prototype shell for a future live C2 system, not as an operational drone controller.

## What It Does Today

- Shows a Leaflet map centered on Tel Aviv with Esri basemap options and optional overlays.
- Draws drones, ground stations, waypoints, route links, selection glow, stale-link labels, orbit previews, and flank previews on a custom canvas overlay.
- Creates a deterministic mock swarm at startup: 104 drones spread around Tel Aviv and surrounding clusters.
- Simulates telemetry locally per drone: position drift, heading changes, altitude changes, battery drain, RSSI variation, and occasional stale-link gaps.
- Shows a right-side `Drones` panel with drones and teams, mission status, status LEDs, and battery indicators.
- Shows a left-side `Commands Sequence` panel for the selected drone/team. When a non-user ground station is selected, this panel becomes a simple comms thread.
- Supports selecting drones, creating teams, removing team members, and unifying teams.
- Supports in-memory waypoints that can be created, moved, edited, deleted, and targeted by drones/teams.
- Supports in-memory ground stations, including a default Tel Aviv home anchor and an optional user home from browser geolocation.
- Provides local command gating for `Arm`, `Disarm`, `Takeoff`, `Land`, `Hold position`, and `Return to Home`.
- Supports planned sequence entries for local commands, goto waypoint, return home, follow, orbit, and flank. Playback currently handles local commands, goto waypoint, and return home; several context-heavy entries are planned/visual only.
- Includes placeholder command names for `Search target`, `Attack target`, and `Boid group`, but these are not implemented as real behaviors.

## What It Is Made For

The app is made for designing and iterating on the human-machine interface of a swarm ground-control station. The important product questions in this repo are about:

- How an operator sees many drones at once.
- How an operator distinguishes assigned command vs. current reported behavior.
- How an operator selects one drone, a team, a waypoint, or a ground station.
- How waypoint, return-home, follow, orbit, and flank interactions should feel on desktop and mobile.
- How command sequences should be represented before they are connected to a real mission/command backend.

Do not assume that any UI action currently reaches real vehicles. Any future live integration should explicitly add telemetry ingress, command egress, authorization, safety checks, acknowledgements, failure states, and audit logging.

## Repository Layout

- `index.html`: Static HTML shell. Loads Leaflet from CDN, `config.js`, `style.css`, and `script.js`.
- `style.css`: All visual styling, responsive panel sizing, map overlay UI, command chips, status panel, comms panel, and mobile viewport handling.
- `config.js`: Small config object for telemetry history, battery-rate smoothing, stale-link threshold, and selection glow tuning.
- `script.js`: The entire application. It contains the data model, mock telemetry, map setup, command logic, menus, panels, drawing, and interaction handlers.
- `ACTIONS.md`: Notes on the command/action catalog and local command gating.
- `TODO.md`: Known future work and currently known UI/domain gaps.
- `solution_for_repeated_issues.md`: Prior fix notes. Read this before changing menu selection/tooltip behavior.

There is no package manifest, build system, test runner, bundler, module loader, or framework.

## Running It

This is a static web app.

Open `index.html` directly in a browser, or serve the folder with a simple local server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

Notes:

- Internet access is needed for Leaflet, Google Fonts, and Esri map tiles.
- Browser geolocation usually requires `localhost` or HTTPS. If opened directly as a file, user-home geolocation may fail or prompt differently.
- App state is in memory only. Reloading the page resets drones, teams, waypoints, comms, and command sequences.

## Main Runtime Flow

On `DOMContentLoaded`, `script.js`:

1. Initializes the timestamp, viewport/keyboard handling, collapsible panels, and command sequence buttons.
2. Creates `groundControl = new GroundControl()`.
3. Initializes the Leaflet map and layer picker with `initMapOnline()`.
4. Builds the mock swarm with `makeMockSwarm()`.
5. Adds default ground stations with `initGroundStations()`.
6. Attempts to add a user home from browser geolocation with `tryAddUserHomeFromDevice()`.
7. Sets up the canvas overlay with `setupOverlay()`.
8. Registers map hover/click/context-menu/long-press handlers with `setupHoverHandlers()`.
9. Refreshes the status list, sequence panel, and tooltip every second.
10. Draws the overlay once the Leaflet map is ready.

## Core Data Model

`Drone`

- Holds `id`, `type`, telemetry `history`, current telemetry, last receive time, and command cooldown.
- `updateTelemetry(packet)` normalizes incoming packet fields and stores current state.
- Telemetry packet fields used by the UI include `uptimeSec`, `lat`, `lng`, `alt`, `heading`, `battery`, `rssi`, `command`, `armed`, and `rescuePhase`.
- Internal drone IDs are zero-based. UI labels display `Drone #${id + 1}`.

`GroundStation`

- Holds `id`, `lat`, `lng`, `alt`, and optional `name`.
- Ground stations are drawn as home/HQ anchors and are used for return-home commands and comms.
- The default ground station is `Tel-Aviv`.

`GroundControl`

- Tracks assigned missions in `assigned: Map<droneId, { command, issuedAt }>` and planned command sequences in `planned: Map<selectionKey, { commands, updatedAt }>`.
- A selection key is a string like `drone:4` or `team:2`.
- Planned commands are currently stored as strings. Be careful changing command labels because some execution paths parse those strings with regexes.

Important global state:

- `drones`: all `Drone` instances.
- `groundStations`: all `GroundStation` instances.
- `waypoints`: `Map<wpId, { id, lat, lng, name? }>`.
- `waypointTargets`: drone-to-waypoint relationships for goto visualization.
- `followTargets`: follower drone ID -> target drone ID.
- `homeTargets`: drone ID -> ground station ID.
- `orbitTargets`: drone ID -> last orbit visualization spec.
- `teams`: team objects with a `members` set.
- `pinnedDroneId` / `pinnedTeamId`: current selected entity.

## UI And Interaction Model

The app is mostly event-driven and stores UI state in global variables.

- Hovering a drone shows the info tooltip.
- Clicking a drone selects/focuses it.
- Clicking the selected drone opens its local commands.
- Long-pressing a drone opens commands or relationship actions, depending on the current selection.
- Right-clicking or long-pressing the map with a selected drone/team opens waypoint actions.
- Long-pressing a waypoint with no selection opens waypoint edit/delete.
- Clicking a ground station with a selected drone/team opens return-home actions.
- Clicking a ground station with no selected drone/team opens the ground-station menu.
- The right `Drones` panel can select drones/teams; long-press opens commands or member actions.
- The left `Commands Sequence` panel edits planned commands and can trigger the selected/active sequence item where execution is implemented.

Many menus are dynamically created DOM elements in `script.js`. Most close functions also set short suppression timers so menus do not immediately reopen after a command. Preserve these suppression patterns unless you are deliberately redesigning the interaction.

## Command Behavior

Local commands:

- `Arm`: sets `armed = true`.
- `Disarm`: confirms if the drone is considered in-air, sets `armed = false`, forces `alt = 0`, and starts a 3 second cooldown.
- `Takeoff`: arms and raises altitude to at least 5 m.
- `Land`: reduces altitude.
- `Hold position`: changes the current command without changing position.
- `Return to Home`: creates a relationship to a selected or closest ground station; supports `land` and `hover` modes in labels.

Relative/spatial commands:

- `Goto WP`: creates or reuses a waypoint, stores speed/altitude, and draws a dashed line to the waypoint.
- `Follow drone`: stores a follower -> target relationship and draws a dashed arrow.
- `Orbit`: appends a goto/follow/home pre-command plus an orbit sequence item and draws an orbit preview/spec.
- `Flank`: appends a flank command around a waypoint or home anchor and draws the approach geometry while the menu is open.

Sequence playback:

- Implemented for local commands, parsed `Goto WP #...` commands, and parsed return-home commands.
- `Follow drone`, `Search target`, `Attack target`, and `Boid group` are explicitly blocked from sequence execution because they require more context.
- `Orbit` and `Flank` can be added as sequence entries/visual planning artifacts, but there is no real backend execution path for them in this mock.

Placeholder commands:

- `Search target`, `Attack target`, and `Boid group` appear in command lists or mock missions, but they do not have real target objects or execution behavior.
- `TODO.md` explicitly calls out adding a `Target` object type so Flank can target a target entity, not only waypoint/home/drone anchors.

Landed/in-air logic:

- `isInAir()` prefers `rescuePhase` when present.
- `RESCUE_COMPLETE` means landed.
- Any other rescue phase is treated as in-air/landing.
- If no rescue phase exists, altitude above 2 m means in-air.
- Drawing uses `isTelemetryLanded()`, which also falls back to altitude `<= 2` m.

## Rendering Model

Leaflet owns the map. The custom canvas `#overlay` owns nearly everything tactical:

- Ground station icons and labels.
- Drones and selection highlights.
- Stale telemetry labels.
- Waypoint pins.
- Follow, goto-WP, and return-home dashed links.
- Waypoint previews.
- Orbit geometry and animated orbit preview.
- Flank path geometry.

`draw()` clears and redraws the full canvas. Call `draw()` or `forceRedraw()` after changing state that affects the map overlay. For state that affects side panels, also call `updateStatusList()`, `updateCommandSequencePanel()`, and/or `updateTooltip()` as appropriate.

## Important Implementation Cautions

- `script.js` is monolithic and stateful. Small changes can have side effects across menus, panels, selection, and drawing.
- There are no modules or tests, so verify behavior manually in the browser after UI changes.
- Do not replace string command labels casually. Sequence playback relies on labels such as `Goto WP #<id> (spd <n> km/h, alt <m> m)` and `Return home #<id> (land|hover)`.
- Internal IDs are zero-based; UI labels are one-based. Keep this consistent for drones, teams, waypoints, and homes.
- Menus are often recreated on every open. Event handlers are usually attached immediately after `innerHTML` assignment.
- Tooltip/menu reopening was a repeated issue. See `solution_for_repeated_issues.md` before changing command-finalization behavior.
- `config.js` is loaded before `script.js`; use `cfg()`/`SETTINGS` for config-style tuning rather than hard-coding where possible.
- There is no persistence layer. Adding persistence should be a deliberate design decision, not an incidental side effect.
- The mock telemetry path is `makeMockSwarm()` -> `startMockTelemetryLoop(drone)` -> `Drone.updateTelemetry(packet)`. A real telemetry integration should feed the same normalized packet shape or add a clean adapter.
- Command issuing functions currently update UI state optimistically. A real backend should separate "requested", "accepted", "rejected", "in progress", and "reported current state".

## Known Gaps And Owner Questions

- What flight stack/protocol is intended for live integration: Betaflight/MSP, MAVLink, custom radio, WebSocket backend, or something else?
- What should the authoritative source of truth be for command state: local UI intent, backend mission state, or vehicle telemetry?
- What safety/authorization model should gate arming, disarming, takeoff, landing, and any future high-risk commands?
- How should target entities work? The repo currently has target command labels but no `Target` object model.
- Should command sequences eventually be structured objects instead of strings?
- Should teams map to real swarm-control groups on the backend, or are they only an operator-side selection convenience?
- Should comms be ground-station chat, operator notes, radio messages, or backend command logs?

## Safety Note For Future Agents

This code uses C2 language and includes placeholder labels such as `Attack target`. In the current repo those are inert UI/mock labels. Do not add real-world targeting, payload, or attack behavior without explicit owner direction, legal/safety review, and a clear separation between UI mock behavior and live actuation.
