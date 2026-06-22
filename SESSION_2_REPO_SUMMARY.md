# Swarm Ground Control - Session 2 Repo Summary

Date reviewed: 2026-06-12
Branch reviewed: `feature/live-drone-position`
Main branch reference: `main` at `fc78c3499cb039fcafcef9cc12ddbe186e1d9c06`

Note: the working tree already had local uncommitted edits when this review started, so I inspected `main` through Git object reads instead of checking out and disturbing the current branch state. The active branch remained `feature/live-drone-position`.

## High-Level Understanding

Swarm Ground Control started as a browser-only C2 design mock for managing many drones on a Leaflet map. The original `main` branch is not connected to real vehicles. It simulates a large swarm, command menus, teams, waypoints, follow/return/orbit/flank visuals, and command sequence planning entirely in memory.

The current `feature/live-drone-position` branch deliberately narrows that broader mock into a live drone position viewer. The current goal is not mission command. The goal is to show about five live drones on the map using telemetry from one ground-control ESP32 connected to the browser by USB serial.

The branch's core question is:

```text
Can SGC reliably show about five real drones on a map at 2-5 Hz with heading, freshness, and radio link context?
```

Everything else should stay subordinate to that.

## What Main Branch Provides

The `main` branch is a static web app with:

- `index.html`, `style.css`, `config.js`, and one monolithic `script.js`.
- Leaflet map centered around Tel Aviv.
- Esri basemap options and a custom canvas overlay.
- A deterministic mock swarm of 104 drones.
- Simulated local telemetry: position drift, heading, altitude, battery, RSSI, stale gaps, command state, and rescue phase.
- Right-side `Drones` panel for drone/team status.
- Left-side `Commands Sequence` panel for planned commands.
- In-memory teams, waypoints, ground stations, return-home anchors, follow targets, orbit targets, and flank previews.
- Local command gating for `Arm`, `Disarm`, `Takeoff`, `Land`, `Hold position`, and `Return to Home`.
- Sequence entries for local commands, goto waypoint, return home, follow, orbit, flank, and placeholders.
- Placeholder command labels such as `Search target`, `Attack target`, and `Boid group`, but these are UI/mock labels only.

There is no backend, no serial link, no WebSocket telemetry path, no real command transport, no persistence, and no build system.

Important inherited cautions:

- `script.js` is stateful and monolithic.
- Many UI interactions depend on global selection state, tooltip modes, menu suppression timers, and dynamically created DOM.
- Command sequence playback parses string labels such as `Goto WP #...` and `Return home #...`; command labels should not be changed casually.
- `solution_for_repeated_issues.md` says menu reopen suppression and selection clearing were important fixes for command-finalization behavior.

## Current Branch Direction

The live-position branch keeps the old prototype code available, but the normal operator path is the live position UI.

Branch defaults and behavior:

- `APP_MODE` defaults to `live-position`.
- The left command sequence panel is hidden in live-position mode.
- Command menus, team controls, waypoint mission behavior, and old C2 controls are out of the normal live-position path.
- Mock live telemetry is available internally, but production UI defaults to no mock button and expects real serial or relay telemetry.
- Drones are created dynamically from telemetry `nodeId`.
- Live mode uses the real `nodeId` directly, not the old zero-based `id + 1` display rule.

The SGC browser app should render and inspect telemetry. It should not own LoRa timing, channel allocation, scanning, or assignment persistence. Those belong to the GC ESP32 firmware.

## Repo Layout

Current root-level app files:

- `index.html`: static app shell. Loads Leaflet CDN, `config.js`, `style.css`, and `script.js`.
- `style.css`: all styling, including live controls, GC/radio panel, spectrum panel, drone cards, map overlays, command prototype styles, and mobile handling.
- `config.js`: small config object. Current branch adds live-position defaults such as `LIVE_POSITION_MOCK_DEFAULT: false` and `LIVE_POSITION_AUTO_CONNECT: true`.
- `script.js`: monolithic app logic. It now contains both the inherited prototype and the live-position subsystem.
- `serial_probe.html/css/js`: standalone Web Serial probe for early GC serial testing.
- `usb_probe.html/css/js`: WebUSB investigation/probe from mobile/USB testing.
- `tools/gc_serial_logger.ps1`: Windows serial JSONL logger and summarizer for GC ESP32 captures.
- `cloudflare/sgc-live-relay/`: Cloudflare Worker/Durable Object live relay.
- `live-drone-position_plan/`: branch plans and checklists.
- `logs_summary/`: analyzed field/bench serial-log summaries.

No package manifest, bundler, test runner, or framework exists.

Run locally with:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Internet access is needed for Leaflet, Google Fonts, and map tiles. Web Serial requires a supporting browser such as desktop Chrome or Edge and a user-granted serial port.

## Companion Firmware Repo

The companion firmware lives at:

```text
C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh
```

I also directly inspected this repo during Session 2. It is on branch `feature/live-drone-position` and already had uncommitted edits in:

- `include/live_position_protocol.h`
- `src/live_position_protocol.cpp`

I did not modify the firmware repo. I used it to update this understanding of the actual active code, not only the SGC-side notes.

Files inspected directly included:

- `platformio.ini`
- `data/config.json`
- `README.md`
- `ARCHITECTURE.md`
- `STATUS.md`
- `SESSION_SUMMARY.md`
- `FC_GPS_INTEGRATION_SUMMARY.md`
- `BANDIT_NANO_PORT.md`
- `include/config.h`
- `include/message.h`
- `include/live_position_protocol.h`
- `include/radio_backend.h`
- `include/BetaflightMSP.h`
- `src/main.cpp`
- `src/config.cpp`
- `src/mesh.cpp`
- `src/live_position_protocol.cpp`
- `src/radio_backend.cpp`
- `src/BetaflightMSP.cpp`
- ground-station GPS/portal and Web OTA files

Important model:

- GC ESP32 connects to SGC over USB serial.
- Drone ESP32 nodes connect to flight controllers through Betaflight MSP.
- Drone nodes transmit compact binary LoRa telemetry.
- GC ESP32 owns LoRa channel scanning, joins, assignments, heading fusion, scanner timing, link diagnosis, and persisted assignment state.
- SGC does not talk LoRa directly.

The older firmware had a flood mesh frame and follow/RTH command experiments. The live-position branch moves toward a single-GC star protocol for telemetry visibility, not mission actuation.

### Firmware Repo Reality From Direct Read

`simple-mesh` is a PlatformIO Arduino project with two build targets:

- `seeed-xiao-s3`: Seeed XIAO ESP32-S3 with SX1262 through RadioLib.
- `bandit-nano-900mhz`: RadioMaster Bandit Nano 900 MHz with SX127x/ELRS driver, external PA/fan control, and OLED/joystick support.

Current `seeed-xiao-s3` build flags include:

- `ARDUINO_USB_CDC_ON_BOOT=1`
- `HARDWARE_SEEED_XIAO_S3`
- `USE_FAKE_GPS=0`
- `ENABLE_SGC_SERIAL_JSON_SMOKE_TEST=0`
- `ENABLE_LIVE_POSITION_PROTOCOL=1`
- `ENABLE_WEB_OTA=1`

The current `data/config.json` is configured as a ground-control node:

```json
{
  "node_id": 0,
  "node_role": "ground_station"
}
```

It still contains legacy LoRa config fields, but in live-position mode the code applies the live-position radio profile at runtime.

`src/main.cpp` is the active runtime entrypoint:

- Starts USB serial at `921600`.
- Loads `config.json` from LittleFS.
- Applies live-position radio defaults when `ENABLE_LIVE_POSITION_PROTOCOL` is enabled.
- Starts Web OTA before mesh runtime.
- Initializes MSP on `Serial1` for non-Bandit builds, RX `44`, TX `43`.
- Creates `SimpleMesh`.
- For GC role, scans telemetry channels, loads persisted assignments, prints channel table JSON, then in loop processes GC serial commands and live-position scanner/assignment logic.
- For drone role, starts the live-position join runtime and in loop runs join/timing/telemetry logic.
- Skips the old `mesh->loop()` path while live-position mode owns the radio.

`include/live_position_protocol.h` and `src/live_position_protocol.cpp` are now the center of the branch. They define:

- Live packet structs and static size checks.
- Control packet IDs `0xA1-0xA6`.
- 20-byte telemetry packet.
- Fast/Balanced/Robust and deterministic advanced radio profile IDs.
- Shared discovery profile and assigned telemetry profiles.
- Channel table scanning.
- Assignment persistence.
- GC join handling.
- Drone join state machine.
- Drone timing proposal and GC timing ACK.
- GC scanner scheduling.
- Search mode.
- Link states and link recovery.
- SGC serial command parsing.
- GC-to-SGC JSON output.

The direct source read confirmed the branch has gone beyond planning: GC serial commands such as `start_search`, `clear_assignment`, and `set_radio_profile` are implemented in `processGcSerialCommands()`, and telemetry/status/channel-table JSON is emitted from active firmware code.

### Legacy Mesh Code Still Exists

The legacy mesh protocol remains in:

- `include/message.h`
- `src/message.cpp`
- `include/mesh.h`
- `src/mesh.cpp`

It defines the older frame:

```text
[START][TYPE][SENDER][RECIPIENT][LEN][PAYLOAD][FWD_COUNT][CRC8]
```

Message types include GPS, command, test, ACK, and orbit telemetry. The code still supports duplicate suppression, LBT, forwarding, raw packet helpers, and JSON/text event logging. In live-position mode, `SimpleMesh` is mostly used as the radio/raw-packet abstraction and profile/frequency control surface, while the old flood-mesh loop is bypassed for the live role path.

Important old protocol caveat remains: `BROADCAST_ADDR` and `GROUND_CONTROL_ADDR` are both `0xFF`.

### Radio Backends

`src/radio_backend.cpp` abstracts radio operations behind `IRadioBackend`.

For Seeed XIAO ESP32-S3:

- Uses RadioLib `SX1262`.
- Enables LoRa PHY CRC with `setCRC(2)`.
- Uses RadioLib CAD/channel scan for LBT and activity detection.
- Supports runtime frequency, TX power, and LoRa profile changes.
- Clamps TX power for the hardware.

For Bandit Nano:

- Uses bundled ELRS SX127x code.
- Maps frequency/profile settings into SX127x driver parameters.
- Uses RSSI-threshold fallback for LBT/activity detection.
- Controls external PA/fan through the Bandit hardware path.

`scanChannelActivity()` is part of the backend interface and matters for Search/link diagnosis, but field notes warn that SX1262 CAD is not passive and must not interrupt active RX windows.

### Betaflight MSP Integration

`BetaflightMSP` supports both older mission-control experiments and live-position telemetry:

- `MSP_RAW_GPS` for GPS fix, sats, lat/lon, alt, speed, and ground course.
- `MSP_ATTITUDE` for yaw/attitude.
- `MSP_ALTITUDE` for altitude.
- `MSP_MULTIPLE_MSP` for batched live-position reads.

The live-position path uses `getLivePositionBatch()` to request RAW_GPS, ATTITUDE, and ALTITUDE together. Drone telemetry packing uses real FC values when valid and can use simulated-FC mode for bench scheduler testing.

The repo also still contains high-level FC control helpers, mission manager, and orbit controller code. Those are part of the older experimental command/navigation direction and should not be treated as active SGC live-position operator controls.

### Ground Station GPS, Portal, And Web OTA

Ground-station GPS support still exists:

- USB MSP `MSP_SET_RAW_GPS` parsing.
- UART MSP fallback.
- Saved web coordinates in LittleFS.
- Source freshness and fallback logic.

In live-position GC mode, `src/main.cpp` treats the GC as owning USB serial for SGC JSON/commands, so the USB MSP ground-station GPS loop is not the normal live-position USB path.

Web OTA is enabled for the XIAO build. It starts a node-specific AP:

```text
simple-mesh-<node_id>
```

The OTA page is served from the AP, and serial diagnostics periodically print SSID, URL, and station count. This is intended to make field firmware updates possible.

### Docs In `simple-mesh`

The firmware repo has many older docs that are useful historical context but not always current:

- `README.md`, `ARCHITECTURE.md`, `STATUS.md`, and serial API docs describe the original flooding mesh and a serial API.
- `FC_GPS_INTEGRATION_SUMMARY.md` describes the follow/RTH-by-updating-Betaflight-GPS-home experiment.
- `SESSION_SUMMARY.md`, `ORBIT_*`, and mission docs describe orbit/mission work from January 2026.
- `BANDIT_NANO_PORT.md` describes the Bandit Nano hardware abstraction and PA path.

For live-position work, trust active source files and the SGC `live-drone-position_plan/` docs over older firmware README/API claims.

## Live Air Protocol

The live-position LoRa air protocol is single-GC star, not flood mesh.

Default assigned telemetry profile:

```text
SF8
BW500 kHz
CR 4/5
preamble 8
SX1262 TX power 22 dBm
```

Shared discovery/control channel:

```text
915.0 MHz
```

The shared discovery profile is more robust:

```text
SF11
BW250 kHz
CR 4/8
```

Assigned telemetry is per-drone on GC-selected channels. The channel table spans 902.5 to 927.5 MHz at 500 kHz center spacing. `915.0 MHz` is shared, and `914.5` / `915.5 MHz` are guard channels.

Final 20-byte telemetry payload:

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
```

Important rules:

- LoRa telemetry excludes derived `heading` and `headingSource`.
- GC firmware derives heading from raw course over ground, yaw, speed, yaw bias, and validity.
- LoRa PHY CRC is used instead of a second payload CRC.
- `sequence_id` is a small wrapping counter for gap/repeat diagnostics.

Control packet IDs were moved to the high `0xA1-0xA6` range to avoid collisions with assigned telemetry packets whose first byte is the drone node ID. This is a breaking air-protocol change; GC and every drone ESP32 must be reflashed together when using that protocol version.

## USB Serial JSON Protocol

SGC receives newline-delimited JSON from the GC ESP32 over USB serial.

The serial protocol uses human-readable units:

- `lat` / `lng`: decimal degrees.
- `alt`: meters.
- `groundSpeed`: meters per second.
- `heading`, `courseOverGround`, `yaw`: degrees.
- `frequencyMhz`: MHz.
- `rssi`: dBm.
- `snr`: dB.

Main GC-to-SGC message types:

- `drone_telemetry`
- `gc_status`
- `assignment_event`
- `scanner_event`
- `search_event`
- `drone_link_status`
- `channel_scan_event`
- `channel_table`
- `assignments`
- `session_event`
- `command_ack`
- `warning`
- `error`

SGC-to-GC commands include:

- `ping`
- `get_status`
- `get_channel_table`
- `get_assignments`
- `clear_all_assignments`
- `rescan_channels`
- `start_search`
- `relock_drone`
- `clear_assignment`
- `set_radio_profile`

The browser parser is intentionally tolerant of development logs:

- Parse complete newline-delimited JSON only.
- Ignore empty lines.
- Keep non-JSON lines in diagnostics.
- Validate known message types.
- Drop invalid telemetry without crashing.
- Store/export unknown fields where practical.

Current default baud is `921600`, raised from `115200` after bench work showed JSON output time can matter.

## SGC Live UI

The live UI has these major parts:

- USB Serial control row with `Open`, `Close`, and `Reset`.
- GC diagnostic log row with `Download` and `Clear`.
- Online relay status.
- GC/radio panel with shared frequency, profile, discovery profile, TX power, channels, Search, and spectrum/profile controls.
- Live drone cards showing operator-facing essentials.
- Canvas overlay markers with heading arrows and freshness/link-state styling.
- Local HOME placement and management in live-position mode.
- Touch-friendly drone action sheet for rename/delete.

Live drone telemetry stores/display fields such as:

- `nodeId`
- position
- altitude
- derived heading
- raw course over ground
- raw yaw
- heading-fusion debug fields
- speed
- satellite count
- RSSI/SNR
- assigned frequency
- radio profile
- TX period
- telemetry airtime
- expected update interval
- sequence ID
- receive timestamps

Operator-facing drone cards were intentionally simplified. They emphasize timing/update rate, altitude, speed, RSSI/SNR, satellite count, channel/profile/sequence details, aliases, and freshness/link state.

Freshness states:

- Base Fast thresholds: online under 1000 ms, late 1000-2000 ms, stale 2000-5000 ms, offline over 5000 ms.
- SGC scales thresholds using `expectedUpdateMs` from the GC scheduler for slower Balanced/Robust profiles.
- Link states from firmware include `locking`, `weak`, `offline`, and `off`.
- `WEAK` and `OFFLINE` badges can trigger `relock_drone` when connected to the GC serial port.
- Remote viewer mode disables maintenance commands.

Local HOME behavior:

- Live mode starts without a default HOME marker.
- Right-click/long-press can place HOME.
- Multiple local HOME markers are allowed.
- HOME markers are local UI objects only and do not command drones.
- HOME markers can be selected, moved, renamed, and deleted locally.

## GC Lifecycle, Spectrum, Search, And Recovery

The branch has a strong GC lifecycle model:

- GC boot scans telemetry candidate channels and reports spectrum/noise-floor data.
- GC persists valid assignments in ESP32 flash.
- GC reset should reload persisted assignments and reacquire telemetry timing.
- Drone reset should return the drone to shared channel and rejoin.
- Explicit operator `Reset` / fresh session clears persisted assignments and rescans channels.
- SGC should not guess a new day/session automatically in v1.

Spectrum behavior:

- GC emits `channel_scan_event` messages during boot, fresh reset, and manual rescan.
- SGC renders a temporary boot/fresh-session scan animation.
- SGC also has an on-demand spectrum panel opened from `Channels`.
- Manual `Re-scan` sends `rescan_channels` and should preserve assignments.

Search behavior:

- Routine shared-channel visits were replaced by operator-controlled Search while assigned drones exist.
- If there are no assignments, shared discovery remains automatic.
- Search preempts normal telemetry slots so the GC actually dwells on the shared channel.
- Search is bounded to avoid looking stuck.
- After successful assignment/timing lock, GC runs one assigned telemetry scanner round.

Recovery/link diagnosis:

- The GC uses profile-aware receive windows and scheduler fairness.
- The GC classifies link state using valid telemetry, CAD/activity detection, and no-activity evidence.
- `OFF` is conservative and requires repeated no-activity attempts.
- CAD is kept out of active shared Search RX and post-ACK/manual assigned RX windows because SX1262 CAD is not passive.
- SGC debounces link-state display so a single missed window does not flicker fresh telemetry offline.

## Cloudflare Live Relay

The branch adds a Cloudflare Worker/Durable Object relay at:

```text
wss://www.flying-agents.com/swarm_ground_control/live/ws
```

It also proxies the static app path:

```text
https://www.flying-agents.com/swarm_ground_control/
```

Relay model:

- One public session named `public`.
- One publisher: the field/operator browser with USB Serial connected.
- Multiple viewers: remote browsers.
- Viewers are read-only.
- The operator UI automatically switches between viewer and publisher based on USB Serial state.
- Raw firmware logs are not relayed.
- Only display-oriented SGC JSON message types are relayed.
- Reset, Search, Re-lock, Delete, Re-scan, and Profile Apply are disabled in viewer mode.

Deployment files live in:

```text
cloudflare/sgc-live-relay/
```

Deploy command from the README:

```powershell
cd C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\cloudflare\sgc-live-relay
npx wrangler deploy
```

## Serial Probe And Logging Tools

`serial_probe.*` was the first proof that browser SGC can open the ESP32 serial port, read mixed logs/JSON, parse valid JSON, and survive reconnect/reset scenarios.

`usb_probe.*` was used to explore WebUSB/mobile behavior. The plan notes say Android browser testing could see USB attachment behavior, but Web Serial did not expose a compatible ESP32 serial device and WebUSB could not claim the CDC data interface. Laptop Web Serial remains the v1 baseline.

`tools/gc_serial_logger.ps1` captures GC USB serial into JSONL and produces summary stats such as packet counts, per-node rates, sequence gaps, duplicates, scanner misses, and command/event counts. This is important for scheduler and field debugging.

## Recent Field Log Understanding

The analyzed log summary under `logs_summary/` describes a long GC/SGC run from 2026-06-11.

Main observations:

- Only nodes `2` and `3` appeared, not the target of about five drones.
- Spectrum was crowded: scans found only 5 clear channels and 43 noisy channels, with fallback quietest-channel behavior.
- Received telemetry rates were much lower than configured TX periods.
- Node 3 on Robust profile had especially poor observed rate and long gaps.
- Both drones had frequent missed windows and link-state churn.
- Node 3 often showed CAD/activity without valid packets, consistent with energy present but undecodable packets.
- Search and relock were used heavily.
- Both links eventually ended as `off`.
- Node 2 had mixed real/simulated GPS and no-fix packets, so GPS source/fix quality matter during tests.
- Browser serial auto-reconnect entered a repeated `port is already open` failure loop after reconnecting.

That last point looks like an SGC-side follow-up candidate: the reconnect path should avoid repeated open attempts when the browser already considers the port open.

## Current Open Work And Risks

The plans show that much of the static SGC live UI is implemented, but several items remain open or need verification:

- Manual browser verification for on-demand spectrum panel open/close, rescan cancel/confirm, and telemetry recovery after rescan.
- Manual/browser verification for `OFFLINE -> LOCKING -> ONLINE` relock and failed relock timeout.
- Browser verification for Search with flashed GC.
- Browser verification for HOME placement and local alias/delete workflows on the target touchscreen.
- Browser verification for Cloudflare operator publishing and remote browser viewing.
- Firmware/field verification with GC and all drone ESP32s reflashed to the same high-range control-packet/profile-aware protocol.
- Bench verification of one Fast, one Balanced, and one Robust assignment.
- Bench/field verification of stable multi-drone tracking, especially about five drones.
- Real GPS and heading-fusion validation against flight-controller truth.
- Regulatory validation for 902-928 MHz channel plan and transmit power before real transmission in the deployment region.

The branch also has ongoing dirty worktree changes in:

- `index.html`
- `script.js`
- `style.css`
- several `live-drone-position_plan/*.md` files
- untracked `logs_summary/`

Those changes should be treated as user/current-session work unless explicitly told otherwise.

## Engineering Guidance For Future Work

Keep changes focused on the live-position goal:

- Do not expand the old command system unless explicitly asked.
- Do not add arming, launch, land, mission, payload, target, or attack behavior in this branch.
- Keep GC firmware as the source of truth for radio allocation, channel scanning, assignment persistence, and LoRa timing.
- Keep SGC as the renderer/operator inspection surface plus GC lifecycle command sender.
- Prefer small live-position helpers/adapters over broad rewrites of `script.js`.
- Update the relevant `live-drone-position_plan/` checklist whenever implementing plan work.
- Use manual browser verification after UI changes because there are no automated tests.
- Use `node --check script.js`, `node --check serial_probe.js`, and `git diff --check` as baseline static checks.
- Use `tools/gc_serial_logger.ps1` for real GC scheduler/link investigations.

## Mental Model To Carry Forward

This repo is now two systems in one file tree:

1. The inherited `main` app: a broad UI-only swarm C2 prototype.
2. The live-position branch: a practical telemetry viewer for one GC ESP32 and about five drone ESP32 nodes.

For this branch, treat the old C2 prototype as background code and the live-position path as the product. The important operator experience is seeing live drone positions, freshness, heading, radio quality, assigned channel/profile, and GC lifecycle state clearly enough to debug and field-test the firmware.
