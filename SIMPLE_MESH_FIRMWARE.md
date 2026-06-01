# Simple Mesh Firmware Notes

Source repo reviewed: `C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh`

Review note: this was written against the local working tree, not a clean tagged release. At review time, `simple-mesh` had uncommitted edits in `data/config.json`, `platformio.ini`, `src/main.cpp`, and `src/radio_backend.cpp`, plus new `web_ota` files.

This document summarizes the firmware/hardware repo that this webapp is intended to interact with. It is written from the current active PlatformIO source, especially `platformio.ini`, `src/main.cpp`, `src/mesh.cpp`, `include/message.h`, `include/config.h`, `src/radio_backend.cpp`, and the ground-station support files.

## Purpose

`simple-mesh` is an ESP32/LoRa firmware project for drone swarm communication. Its current active runtime is centered on:

- Broadcasting node GPS positions over LoRa.
- Receiving remote GPS positions.
- Using received GPS positions to update a Betaflight flight controller's GPS home through MSP.
- Letting Betaflight GPS Rescue/RTH behavior act as the low-level movement mechanism.
- Supporting a simple flooding mesh protocol with duplicate suppression and optional forwarding.
- Supporting two hardware targets: Seeed XIAO ESP32-S3 + SX1262, and RadioMaster Bandit Nano 900 MHz + SX127x/external PA.

The most important mental model: this is not a full autopilot by itself. It is a radio/bridge/control-assist firmware that can talk LoRa on one side and Betaflight MSP on the other. For follow-me style behavior, the firmware receives a remote node's GPS and writes that coordinate into the flight controller as GPS home, so an FC already configured for GPS Rescue/RTH can fly toward it.

## Current Build Targets

`platformio.ini` defines two environments.

- `seeed-xiao-s3`
  - Board: `seeed_xiao_esp32s3`
  - Radio path: SX1262 via RadioLib
  - Hardware flag: `HARDWARE_SEEED_XIAO_S3`
  - `USE_FAKE_GPS=0`
  - MSP UART is initialized on `Serial1` with RX pin `44`, TX pin `43`.

- `bandit-nano-900mhz`
  - Board: `esp32dev`
  - Radio path: SX127x through the bundled ELRS SX127x driver in `lib/elrs_sx127x`
  - Hardware flag: `HARDWARE_BANDIT_NANO`
  - Has external PA/fan control, OLED, and joystick UI.
  - MSP/FC UART init is skipped in `src/main.cpp`.

Useful commands:

```powershell
pio run -e seeed-xiao-s3
pio run -e bandit-nano-900mhz
pio run -e seeed-xiao-s3 -t upload
pio run -e seeed-xiao-s3 -t uploadfs
pio device monitor -b 115200
```

## Runtime Configuration

Runtime config is loaded from LittleFS at `/config.json`, sourced from `data/config.json` when uploaded with `pio run -t uploadfs`.

The current checked-in `data/config.json` says:

- `node_id`: `2`
- `node_role`: `drone`
- Frequency: `915.0` MHz
- TX power: `22` dBm
- Spreading factor: `9`
- Bandwidth: `125000`
- Coding rate: `8`
- Max forwards: `0`
- Duplicate buffer size: `50`
- LBT threshold: `-120` dBm
- Backoff: `100-1000` ms
- Test timeout: `10` seconds

Roles are defined in `include/config.h`:

- `ground_station` = `0`
- `drone` = `1`
- `plane` = `2`
- `vehicle` = `3`

Important: `max_forwards = 0` disables mesh forwarding. That makes the current config behave as direct LoRa peers rather than a multi-hop flood mesh.

## Active Firmware Flow

On boot, `src/main.cpp`:

1. Starts USB serial at `115200`.
2. Loads and prints `config.json`.
3. Starts ground-station GPS support if `node_role == ground_station`.
4. Initializes the ground-station portal object.
5. Optionally starts Web OTA if `ENABLE_WEB_OTA` is compiled as `1`; it is `0` by default.
6. On non-Bandit builds, starts MSP on `Serial1` and binds `BetaflightMSP` to it.
7. Creates `SimpleMesh` and initializes the selected radio backend.
8. On Bandit builds, starts the OLED/joystick UI.
9. Enters the main loop.

In `loop()`:

- The Bandit UI runs first, if present.
- Ground-station GPS sources are processed when the node role is `ground_station`.
- Web OTA and ground-station portal loops run when enabled/active.
- `mesh->loop()` receives, validates, forwards, and reports radio packets.
- Non-Bandit builds check the flight-controller MSP connection every 2 seconds.
- GPS is broadcast periodically:
  - Ground-station role currently broadcasts fixed jittered test coordinates because `ENABLE_GS_FIXED_TEST_GPS` is `true`.
  - Drone/plane/vehicle roles broadcast real Betaflight `MSP_RAW_GPS` every roughly 500 ms when `fc_connected` and GPS fix/satellite conditions pass.
  - If `USE_FAKE_GPS=1`, drone role cycles through fake city coordinates instead.

## Mesh Protocol

Frame layout from `include/message.h` and `src/mesh.cpp`:

```text
[START][TYPE][SENDER][RECIPIENT][LEN][PAYLOAD...][FWD_COUNT][CRC8]
```

Field details:

- Start marker: `0x3C` (`<`)
- Max payload: `20` bytes
- Max frame: `27` bytes
- Broadcast address: `0xFF`
- Ground-control address is also defined as `0xFF`, so address `255` currently carries both meanings.
- CRC8 covers `RECIPIENT + PAYLOAD_LEN + PAYLOAD`.
- Duplicate hash covers `RECIPIENT + PAYLOAD`; sender, type, and forward count are not part of the duplicate key.

Message types:

- `0x47` / `G`: GPS position
- `0x43` / `C`: command
- `0x54` / `T`: test/heartbeat
- `0x41` / `A`: ACK
- `0x4F` / `O`: orbit telemetry

Payloads:

- GPS: `lat int32`, `lon int32`, `altitude_cm uint16`, `node_role uint8`; 11 byte payload, 18 byte frame.
- Command: `cmd_type uint8`, `param1 uint8`, `param2 uint16`; 4 byte payload, 11 byte frame.
- Test: `counter uint16`; 2 byte payload, 9 byte frame.
- ACK: `orig_msg_hash uint16`, `status uint8`; 3 byte payload, 10 byte frame.
- Orbit telemetry: center lat/lon, radius, altitude, angle, laps, progress, direction, status; 20 byte payload, 27 byte frame.

Command IDs:

- `MSG_CMD_FOLLOW = 0x01`
- `MSG_CMD_GOTO = 0x02`
- `MSG_CMD_LAND = 0x03`
- `MSG_CMD_RTH = 0x04`
- `MSG_CMD_HOLD_POSITION = 0x05`

ACK statuses:

- `RECEIVED = 0`
- `EXECUTING = 1`
- `SUCCESS = 2`
- `FAILED = 3`
- `REJECTED = 4`

## Mesh Behavior

`SimpleMesh` is responsible for:

- Creating a duplicate hash buffer.
- Initializing the selected radio backend.
- Listen-before-talk before transmit.
- Packing/unpacking the compact binary frame.
- Validating CRC.
- Dropping duplicates.
- Reporting RX events in either human-readable serial logs or JSON event logs.
- Forwarding when `shouldForward()` allows it.

Forwarding rules:

- A node never forwards its own messages.
- A node does not forward when `forward_count >= config.mesh.max_forwards`.
- Broadcasts are forwarded if the above checks pass.
- Direct messages not addressed to this node are forwarded if the above checks pass.
- Direct messages addressed to this node are not forwarded.

The active config has `max_forwards = 0`, so no packets are forwarded.

## Radio Backends

`src/radio_backend.cpp` abstracts radio operations behind `IRadioBackend`.

Seeed XIAO ESP32-S3:

- Uses RadioLib `SX1262`.
- Uses RadioLib channel scan for LBT.
- Clamps TX power for SX1262 hardware.
- Uses DIO2 RF switch and SX1262 CRC.

Bandit Nano:

- Uses the bundled ELRS SX127x driver.
- Uses RSSI threshold fallback for LBT.
- Maps requested dBm to ELRS/SX127x power values and external PA DAC levels.
- Controls external PA/fan through `PAControl`.
- Supports selectable 100/250/500/1000 mW output through the OLED UI.

## Betaflight MSP Integration

`BetaflightMSP` implements MSP v1 helpers for reading telemetry and sending FC commands. The active `src/main.cpp` uses it mainly to:

- Check FC presence with `MSP_STATUS`.
- Read local GPS with `MSP_RAW_GPS`.
- Write synthetic/current GPS with `MSP_SET_RAW_GPS`.
- Set GPS home with `MSP_WP`.
- Try to verify GPS home through `MSP_DEBUG` when FC debug mode exposes GPS home.

Core follow-me behavior:

- `mesh.cpp` receives a GPS message.
- `updateNodeLocation()` in `src/main.cpp` stores the sender's location.
- If the sender is not this node, `updateNodeLocation()` immediately calls `setGPSHome(lat, lon, alt)`.
- `setGPSHome()` first sends `MSP_SET_RAW_GPS` to establish a valid GPS fix, then sends `MSP_WP` to set the FC home coordinate, then attempts debug readback.

Current caveat: although the code has `follow_mode_active` and `follow_target_node_id`, `updateNodeLocation()` currently updates FC home for any remote GPS sender, not only the configured follow target.

## Ground Station Features

Ground-station GPS is managed by `GroundStationGpsManager`.

Supported sources:

- USB MSP stream: parses host-to-device `MSP_SET_RAW_GPS` frames arriving on USB serial.
- UART MSP: can use FC GPS on non-Bandit builds.
- Web-saved coordinates: persisted to LittleFS at `/gs_coords.json`.

Source behavior:

- USB MSP has highest priority while fresh.
- UART MSP and USB MSP sources time out after 5 seconds.
- If a runtime source goes stale and a saved fix exists, it falls back to saved coordinates.
- Stable USB GPS for 60 seconds can autosave a fallback.

Bandit-only portal:

- `GroundStationPortal` can start a Wi-Fi AP named `ground station`.
- Captive DNS redirects to `http://192.168.4.1/`.
- A simple form accepts `lat, lon` and saves it through `GroundStationGpsManager`.
- The Bandit OLED UI has a `Set GPS` menu action that starts this portal.

Web OTA:

- `WebOtaService` exists but is disabled unless `ENABLE_WEB_OTA=1`.
- When enabled it starts a Wi-Fi AP and serves an upload page on port `8080`.

## Autonomous Mission Code

The repo contains substantial navigation helpers:

- `BetaflightMSP` high-level helpers: `gotoWaypoint`, `returnToHome`, `holdPosition`, `landNow`, `takeoff`, and `orbit`.
- `OrbitController`: non-blocking orbit controller with dynamic center updates.
- `MissionManager`: in-memory mission sequence with takeoff, waypoint, RTH, land, hold, orbit, waits, checks, jumps, repeats, and abort behavior.

These files are compiled as part of the PlatformIO project, but the active `src/main.cpp` does not instantiate `MissionManager` or `OrbitController`. Treat them as available firmware capabilities/experiments, not as the currently wired mesh command path.

## Current Serial/API Reality

Several older docs in `simple-mesh` describe a text/JSON serial API with commands like `HELP`, `STATUS`, `GPS`, `CMD`, and `JSON ON`. The current active `src/main.cpp` does not contain a serial command parser for those commands.

What exists now:

- Human-readable serial logs are printed by default.
- `mesh.cpp` can emit JSON event lines if global `json_mode` is `true`.
- `json_mode` is currently hardcoded `false` in `src/main.cpp`.
- USB serial input is used by `GroundStationGpsManager` to parse binary MSP `MSP_SET_RAW_GPS` frames for ground-station GPS input, not to receive high-level C2 commands.

For the webapp to command the mesh reliably, a new bridge is still needed. Reasonable options:

- Add a real serial command/API layer in firmware.
- Add a local backend that speaks USB serial to a ground-station node and exposes WebSocket/HTTP to the webapp.
- Enable/clean up JSON line events for telemetry and add JSON line commands for TX.

## How This Relates To `swarm_ground_control`

The webapp currently has a simulated `Drone.updateTelemetry()` shape:

- `lat`
- `lng`
- `alt`
- `heading`
- `battery`
- `rssi`
- `command`
- `armed`
- `rescuePhase`

The firmware currently emits/contains:

- Mesh sender node ID.
- GPS lat/lon/alt.
- Node role.
- RF RSSI/SNR.
- ACK events.
- Command RX events.
- Orbit telemetry events.

Missing for full webapp fidelity:

- Heading.
- Battery percentage.
- Armed state.
- Betaflight rescue phase/state.
- Current command/reporting state from the vehicle.
- A structured command result lifecycle.
- A host API for issuing commands from the webapp.

Suggested telemetry mapping for an early integration:

- `sender` -> drone/ground-station ID.
- GPS `lat/lon/alt` -> webapp `lat/lng/alt`.
- GPS `role` -> decide whether to render as drone, ground station, plane, or vehicle.
- RX `rssi`/`snr` -> link quality.
- Serial timestamp or receive time -> link freshness.
- Unknown fields like heading, battery, armed, and rescue phase should be explicit `null`/unknown until a firmware payload is added.

Suggested command mapping work:

- Webapp `Return to Home` can map to `MSG_CMD_RTH`, but the firmware's RTH currently expects a home coordinate in `locationBuffer[255]`, while `255` is also broadcast/ground-control. This should be clarified before relying on it.
- Webapp `Follow drone` can map to `MSG_CMD_FOLLOW`, but the current follow target state is not enforced by the GPS update path.
- Webapp `Goto WP`, `Land`, and `Hold position` have command IDs but limited/no complete execution path in active `mesh.cpp`.
- Webapp `Arm`, `Disarm`, `Takeoff`, `Orbit`, `Flank`, `Search target`, `Attack target`, and team commands do not have matching active mesh command payloads.

## Main Integration Gaps To Resolve

- Decide the ground-control host path: browser Web Serial, local Node/Python bridge, or firmware-hosted HTTP/WebSocket.
- Add a current, tested command API. The older serial API docs do not match active source.
- Decide whether telemetry should stay within 20 byte LoRa payloads or use multiple message types/fragments.
- Add FC telemetry payloads for battery, armed state, rescue phase, heading, and current mode.
- Separate broadcast address from ground-control address. Both are currently `0xFF`.
- Decide whether node IDs are vehicle IDs, radio IDs, or UI IDs.
- Clarify whether roles should affect forwarding, rendering, and command eligibility.
- Decide if follow-me should follow every remote GPS sender or only the selected `follow_target_node_id`.
- Add authentication/encryption before any real operational use.
- Define command acknowledgement semantics: accepted, rejected, executing, completed, failed, timed out.

## Safety And Security Notes

- The mesh protocol has no encryption, authentication, replay protection, or command authorization.
- Anyone transmitting compatible packets on the same LoRa settings could inject or observe messages.
- The Bandit ground-station portal AP is intended for local configuration, not hardened access control.
- Web OTA is compile-time disabled by default, but when enabled it should be treated as sensitive firmware-update surface.
- The firmware can write GPS/home state to a Betaflight flight controller. Any live command path must include explicit safety gating, operator confirmation, and clear command/telemetry separation.

## Files Worth Reading First

- `platformio.ini`: build environments and compile flags.
- `data/config.json`: active runtime config uploaded to LittleFS.
- `src/main.cpp`: active runtime flow and follow-me behavior.
- `include/message.h`: binary mesh protocol.
- `src/mesh.cpp`: mesh TX/RX/forwarding and command handling.
- `src/radio_backend.cpp`: SX1262 vs SX127x radio abstraction.
- `include/config.h` and `src/config.cpp`: roles and config persistence.
- `src/ground_station_gps.cpp`: ground-station GPS source handling.
- `src/ground_station_portal.cpp`: Bandit AP coordinate-entry portal.
- `src/BetaflightMSP.cpp`: MSP protocol and FC navigation helpers.
- `src/MissionManager.cpp` and `src/OrbitController.cpp`: mission/orbit code that exists but is not wired into active `main`.

## Caution About Existing Docs

The `simple-mesh` repo has many Markdown files from earlier implementation phases. They are useful context, but some describe features or defaults that no longer match active source. In particular:

- Older docs mention SX1262/SF12 defaults; current checked-in config uses SF9.
- Older docs mention a full text/JSON serial API; current active `src/main.cpp` does not expose that parser.
- Older docs list GPS payload sizes before `node_role` was added.
- Some docs describe planned mission/orbit features as complete, but active `main` does not wire them into mesh command execution.

When building webapp integration, trust active `src/` and `include/` code over older summary documents.
