# Session 3 Dual-GC Repo Review

Date: 2026-06-19

Scope:

- SGC repo: `C:\Users\tamipinhasi\Documents\repos\swarm_ground_control`
- Firmware repo: `C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh`
- Current working assumption from this session: single GC is deprecated. The normal operator architecture is dual GC only.

I used six read-only subagents for parallel review:

- SGC planning docs.
- SGC browser code.
- simple-mesh docs.
- simple-mesh dual-GC firmware path.
- simple-mesh drone/MSP telemetry path.
- Cross-repo protocol compatibility.

No code was changed in either repo by those reviews. This file is the only intended output from this session.

## Executive Summary

The two repos are intertwined in a clear way now:

```text
Betaflight FC
  -> Drone ESP32 over MSP UART
  -> compact LoRa telemetry on assigned channel
  -> TeleGC ESP32
  -> USB serial newline JSON
  -> SGC browser map UI

Drone ESP32 boot/rejoin
  -> shared LoRa JOIN at 915.0 MHz
  -> MaGC ESP32 bind/search/allocation
  -> reliable assignment snapshot over Inter-GC UART
  -> TeleGC starts assigned-channel telemetry RX
```

The current code supports this dual-GC split:

- MaGC (`magic_ground_control`) owns shared-channel Bind/Search, channel allocation, persisted assignments, shared-channel recovery, OOCR, and bridge/backhaul publication.
- TeleGC (`telemetry_ground_control`) owns SGC USB serial, assigned-channel telemetry receive, TST/period lock, Inter-GC clock sync, and local telemetry recovery.
- SGC should connect to TeleGC only. If MaGC is plugged into SGC by USB, the browser has role-detection code and should warn the operator.

The main problem is not that the dual-GC implementation is missing. The main problem is that docs, checked-in configs, and some compatibility validators still carry the older single-GC/flooding/serial-API story. A person following the wrong markdown can easily provision or test the wrong system.

My strongest recommendation: make `10_dual_lora_ground_station.md` and the MaGC/TeleGC provisioning flow the documented source of truth, then demote single `ground_station` to legacy/debug compatibility everywhere else.

## What SGC Does

SGC is a static browser app. It has no backend, build system, package manifest, bundler, or test runner. The important files are:

- `index.html`: static shell, Leaflet map, overlay canvas, right-side live panel, hidden legacy command panel.
- `config.js`: small runtime defaults. Live mock is off by default and serial auto-connect is on.
- `style.css`: live mode, map, panels, GC/radio status, drone cards, bridge and spectrum UI.
- `script.js`: monolithic app with old C2 prototype code plus live-position behavior.

Runtime behavior:

1. `DOMContentLoaded` initializes live mode, map, ground stations, overlay canvas, hover/click handlers, serial UI, relay UI, and the one-second refresh loop.
2. In live-position mode, SGC skips the old 104-drone mock swarm.
3. Web Serial opens at `921600` by default.
4. Incoming serial is split on CR/LF.
5. Non-JSON firmware logs are stored in the diagnostic ring and ignored by the protocol handler.
6. JSON lines go through `handleLiveProtocolMessage()`.
7. `drone_telemetry` creates or updates a `Drone` by real `nodeId`, not the older mock `id + 1` display rule.
8. `drones_state` supports bridge/relay snapshots.
9. `gc_status`, `channel_table`, `assignment_event`, `search_event`, `scanner_event`, `drone_link_status`, `bind_progress_event`, `telemetry_rebind_event`, and `command_ack` drive the GC/radio panel, drone cards, binding UI, recovery state, and logs.

The live UI is mostly aligned with the branch goal:

- It displays location, altitude, heading, speed, freshness, RSSI/SNR, satellites, assigned frequency, profile, sequence, and age.
- It scales freshness from firmware-provided `expectedUpdateMs`, so slower profiles do not become falsely stale under the old 1/2/5 second fixed thresholds.
- It hides the old left command sequence panel in live-position mode.
- It keeps local maintenance controls: Bind, Reset/Fresh Session, Re-bind, Delete assignment, Re-scan, and profile apply.

That last point is important: SGC is not a pure passive viewer. It is not mission/C2 anymore, but it is still the operator control surface for radio maintenance.

## What simple-mesh Does

simple-mesh is the ESP32/LoRa firmware. The active PlatformIO entrypoint is `src/main.cpp`, not the older top-level `main.cpp`.

Important files:

- `platformio.ini`: Seeed XIAO S3 build enables `ENABLE_LIVE_POSITION_PROTOCOL=1`; Bandit Nano currently does not.
- `include/config.h`: roles, defaults, LittleFS config model.
- `src/config.cpp`: loads/saves `/config.json`.
- `include/live_position_protocol.h`: live protocol constants and packed packets.
- `src/live_position_protocol.cpp`: shared-channel join, assignment, scanning, telemetry RX/TX, heading fusion, bridge backhaul, SGC serial JSON.
- `include/inter_gc_link.h` and `src/inter_gc_link.cpp`: MaGC/TeleGC UART JSON, snapshots, ACK/retry, clock sync, assisted rebind, command forwarding.
- `src/BetaflightMSP.cpp`: batched MSP reads from the FC.
- `src/web_ota.cpp`: Web OTA and role-specific AP/hostname behavior.
- `data/config.json`: checked-in example/provisioning config. It still says `node_role: "ground_station"`.

Roles in current code:

| Role | Current meaning |
| --- | --- |
| `magic_ground_control` / `magc` | MaGC. Shared-channel discovery, Bind/Search, channel allocation, persisted assignments, bridge publication, assigned-drone recovery assist. |
| `telemetry_ground_control` / `telegc` | TeleGC. USB serial to SGC, assigned telemetry RX, TST/period tracking, assignment mirror from MaGC. |
| `bridge_receiver` | USB bridge receiver. Reconstructs `drones_state`/`gc_status` for SGC from ESP-NOW primary and LoRa fallback. |
| `drone`, `plane`, `vehicle` | Drone-like roles. Read FC telemetry by MSP and transmit compact assigned-channel LoRa telemetry. |
| `ground_station` | Single-GC compatibility path. Still active in code, but deprecated for the current architecture. |

## Dual-GC Runtime Flow

### Boot And Provisioning

All boards load identity from LittleFS `/config.json`.

The normal dual-GC system needs explicit per-board config:

- MaGC: `node_id: 0`, `node_role: "magic_ground_control"`.
- TeleGC: `node_id: 0`, `node_role: "telemetry_ground_control"`.
- Drone nodes: unique `node_id`, `node_role: "drone"` or equivalent drone-like role.

Firmware-only flash and OTA should preserve LittleFS identity. Uploading LittleFS or using `uploadfs` can overwrite role identity. This is a serious operational hazard because the checked-in `data/config.json` is still a single `ground_station`.

On Seeed XIAO S3 dual-GC roles:

- USB serial is `921600`.
- Inter-GC UART is `Serial1` at `921600`.
- Default Inter-GC pins are RX `44`, TX `43`.
- Drone-like roles use `Serial1` for MSP instead, so the same pins mean different things by role.

### MaGC Boot

MaGC:

- Applies live radio profile.
- Loads default assignment radio profile.
- Initializes the BW500 channel table as valid.
- Loads persisted `/live_assignments.json`.
- Defers boot CAD/noise scan so shared-channel JOIN listening starts immediately.
- Emits the channel table, but normal live/bind output goes to Inter-GC UART when Inter-GC is enabled.

This is different from older lifecycle docs that expect boot spectrum scan animation at startup.

### TeleGC Boot

TeleGC:

- Initializes an empty valid channel table.
- Does not load persisted assignments from flash.
- Waits for MaGC assignment snapshots.
- Starts Inter-GC service.
- Starts processing SGC USB commands.
- Runs assigned-channel telemetry scanning only.

If Inter-GC wiring, baud, role config, or UART pin config is wrong, TeleGC can sit with no assignments and therefore no drone telemetry.

### Bind/Search

The current normal flow:

1. Operator clicks Bind in SGC.
2. SGC sends newline JSON command to TeleGC USB.
3. TeleGC forwards most MaGC-owned commands to MaGC as `sgc_command`.
4. MaGC listens on shared discovery `915.0 MHz`, currently SF12/BW125/CR4/8.
5. Drone sends a 5-byte `JOIN_REQUEST`.
6. MaGC allocates or reuses an assignment.
7. MaGC persists the assignment to `/live_assignments.json`.
8. MaGC sends shared-channel `SILENCE` and `JOIN_ASSIGN`.
9. Drone sends `JOIN_ACK`.
10. MaGC sends reliable `assignment_snapshot` to TeleGC over UART.
11. TeleGC ACKs and mirrors the assignment in RAM.
12. Drone switches to assigned telemetry channel.
13. TeleGC receives assigned-channel telemetry and emits `drone_telemetry` JSON to SGC.

The code still supports single `ground_station` doing all of this on one module, but that should now be treated as legacy/debug.

### Drone Telemetry

Drone nodes:

- Read `MSP_RAW_GPS`, `MSP_ATTITUDE`, and `MSP_ALTITUDE` as a batched MSP request with a 50 ms timeout.
- Build the packed 20-byte telemetry packet:

```text
node_id            uint8
flags              uint8
lat_e7             int32
lng_e7             int32
alt_cm             uint16
course_ddeg        uint16
yaw_deg            int16
ground_speed_cms   uint16
satellite_count    uint8
sequence_id        uint8
```

Important details:

- Drone packets do not include derived heading.
- Sequence ID is 8-bit and wraps.
- Altitude is `uint16` centimeters, so it caps at 655.35 m and negative altitude becomes 0.
- If real GPS is unavailable, firmware can still send plausible Tel Aviv fallback coordinates with `GPS_SIMULATED` set.
- SGC currently has enough data to label `GPS SIM`, `GPS FC`, or `GPS NONE`, but simulated positions still appear on the map unless the UI makes that state prominent enough.

### TeleGC Telemetry RX

TeleGC:

- Scans assigned channels from its mirrored assignments.
- Rejects exact duplicate sequence IDs.
- Infers telemetry period from received packets.
- Emits `expectedUpdateMs` for SGC freshness scaling.
- Emits RSSI/SNR measured by the receiving GC.
- Performs GC-side heading fusion from raw CoG, yaw, speed, GPS quality, and learned yaw bias.

The production `drone_telemetry` JSON is compatible with SGC's expected fields and units:

- `lat`/`lng`: decimal degrees.
- `alt`: meters.
- `groundSpeed`: meters per second.
- `heading`, `courseOverGround`, `yaw`: degrees.
- `frequencyMhz`: MHz.
- `rssi`: dBm.
- `snr`: dB.
- `expectedUpdateMs`: scheduler/service target.

### Recovery

Recovery is split:

- TeleGC detects missed expected packets/TST windows on assigned channels.
- After one missed expected packet, TeleGC can send `telemetry_rebind_request` to MaGC.
- MaGC attempts bounded assigned-channel recovery.
- If assigned-channel recovery fails, MaGC prioritizes shared-channel rejoin for a reset drone.
- MaGC sends `assignment_timing_hint` if it decodes telemetry.
- TeleGC treats timing hints as optional and still locks final TST from its own telemetry.
- MaGC runs background OOCR after boot grace, one CAD slice roughly every 250 ms, with at most one decode confirmation per 10 second cycle.

This is conceptually right for dual GC: MaGC can help find lost assigned drones without making TeleGC abandon healthy telemetry too aggressively.

### Bridge And Remote Viewing

There are now two remote-ish paths:

- Bridge receiver USB to SGC: ESP-NOW primary from GC/MaGC to bridge, LoRa fallback at `902.0 MHz`.
- Cloudflare live relay: browser-level public viewer mirroring.

SGC supports bridge `drones_state` snapshots and treats them as serial-local telemetry. It also supports remote viewers as read-only through the relay. Mutating bridge commands are meant to be enabled only when bridge control is fresh.

Bridge snapshots are capped at five records by `BRIDGE_SNAPSHOT_MAX_RECORDS = 5`, matching the target of about five drones.

## Expected Vs Actual Behavior

| Area | Expected under current dual-GC direction | Actual code/docs behavior | Impact |
| --- | --- | --- | --- |
| GC architecture | Dual GC only: SGC USB to TeleGC, MaGC for shared Bind/Search. | Code supports this, but docs and config still preserve single `ground_station`. | Operators can provision/test the deprecated path by accident. |
| SGC USB endpoint | TeleGC only. | SGC warns when MaGC is connected, but MaGC USB still accepts some status/debug commands. | Direct MaGC USB can mislead testing because live bind output goes mostly to UART. |
| Assignment persistence | MaGC owns persistent assignments. | Correct. TeleGC keeps only RAM mirror. | Good, but TeleGC depends on snapshot recovery. |
| Boot spectrum | Older docs expect boot spectrum scan/animation. | MaGC defers boot scan to hear shared JOIN immediately. | Docs/UI expectations are stale for dual GC. |
| Command forwarding | SGC commands routed through TeleGC to MaGC. | Commands are forwarded as best-effort UART `sgc_command`; snapshots/timing hints are reliable. | Lost forwarded commands can timeout without retry. |
| Telemetry packet | 20-byte compact binary with raw course/yaw/speed. | Matches code and static asserts. | Good. |
| Heading | Derived by GC, not drone. | Matches code. | Good. |
| Freshness | Scaled by expected update period. | Firmware emits `expectedUpdateMs`; SGC uses it. | Good. |
| Bridge `drones_state` | SGC accepts bridge full-scene snapshots. | Compatible. | Good if snapshots are complete. |
| Bridge `channel_table` | SGC should display bridge summaries. | SGC validator rejects compact bridge `channel_table` because required arrays are missing. | Bridge channel UI can silently lose data. |
| Radio-down status | SGC should show firmware/radio failure status. | Minimal `gc_status` with `meshReady:false` is rejected by SGC schema. | Operator may not see the useful error state. |
| Real GPS | Real FC GPS should be visible and simulated GPS obvious. | Simulated fallback coordinates are sent and marked, but still plausible. | Field operator can mistake simulated map positions for real unless UI is explicit. |
| Docs | Docs should describe dual GC as normal. | Many docs still describe flood mesh, single GC, old serial API, or old uploadfs flow. | Highest onboarding risk. |

## Specific Problems I Would Fix

### P0 - Documentation And Provisioning Must Stop Leading To Single GC

Several SGC planning docs still say one GC is active or define a single-GC star protocol. In context, those lines should now mean "not flood mesh", not "one physical GC".

Stale or misleading SGC docs:

- `AGENTS.md`: says one GC ESP32 over USB.
- `live-drone-position_plan/00_overview.md`: says one GC is active.
- `live-drone-position_plan/02_air_protocol_binary.md`: says single-GC star.
- `live-drone-position_plan/05_simple_mesh_firmware_side.md`: starts with only GC/drone and later says multi-GC is out of scope.
- `live-drone-position_plan/07_future_features.md`: treats multi-GC as future work.
- `SESSION_2_REPO_SUMMARY.md`: useful history, but stale for dual-GC.

Stale or misleading simple-mesh docs:

- `README.md`, `ARCHITECTURE.md`, `STATUS.md`, `SERIAL_API.md`, `BUILD.md`, and `SETUP.md` still describe the older flooding mesh, broad serial command API, and C2-ish commands.
- `plan.md` has older role scope and does not document MaGC/TeleGC as the current path.
- `BUILD.md` and `SETUP.md` still encourage `uploadfs` style flows without enough warning that LittleFS contains identity.
- `data/config.json` still provisions `ground_station`.

Recommended fix:

- Add a current top-level `CURRENT_LIVE_POSITION_ARCHITECTURE.md` in simple-mesh or update `README.md` to point to dual-GC first.
- Rename the old serial/flood docs as legacy or add strong banners at the top.
- Update SGC `00_overview.md` to mark single GC as deprecated and point to Part 10.
- Replace checked-in `data/config.json` with templates, or add role-specific config templates such as `config.magc.json`, `config.telegc.json`, `config.drone.example.json`.
- Make the build/flash guide say normal firmware updates must not run `uploadfs`.

### P0 - SGC Protocol Validator Is Too Strict For Real Firmware Variants

SGC schema validation requires every listed field. That blocks valid useful messages:

- Bridge receiver compact `channel_table` has `channels[]`, `assignments[]`, counts, and `gcMillis`, but lacks full direct-GC frequency arrays.
- Mesh/radio failure `gc_status` has `meshReady:false`, `radioReady:false`, and `radioError`, but lacks normal radio fields.
- Optional smoke-test telemetry is stale versus the current full schema.

The renderer can already handle some of the compact forms after validation. The validator is the blocker.

Recommended fix:

- Make schema validation type-aware but not all-fields-required for `gc_status`, `channel_table`, and diagnostic/smoke paths.
- Use per-source variants, for example direct TeleGC, bridge receiver, radio-down, smoke.
- Treat missing optional fields as absent, not invalid.
- Keep hard requirements only where the handler truly cannot proceed, such as `type` and `nodeId` for `drone_telemetry`.

### P0 - Bench Verification Is Still The Main Unknown

The checklists correctly leave many physical tests open. I would prioritize:

1. MaGC and TeleGC UART at `921600`, with real wiring and common GND.
2. SGC connected to TeleGC can Bind a drone through MaGC.
3. TeleGC receives normal `drone_telemetry` after MaGC assignment.
4. A second drone can bind without dropping an already healthy drone.
5. TeleGC sends assisted rebind after one missed expected packet.
6. MaGC recovery does not starve shared JOIN or healthy assigned telemetry.
7. ESP-NOW bridge connects at about 4 Hz and LoRa fallback/promote-back works.
8. Mutating bridge commands ACK reliably.
9. Real Betaflight `MSP_MULTIPLE_MSP` batch behavior on the target FC.
10. Fast, Balanced, Robust, and profile `64` with real radios.

### P1 - Command Forwarding Should Be Reliable Or Explicitly Timed Out

Inter-GC assignment snapshots and timing hints use a reliable one-pending-message path with ACK/retry. TeleGC-to-MaGC `sgc_command` forwarding is best-effort serialization to UART.

Impact:

- If a forwarded Bind/Re-scan/Profile command line is lost, SGC may wait until timeout.
- The UI might report a generic timeout rather than "TeleGC could not deliver command to MaGC".
- Under field conditions, UART noise or boot/reconnect timing can look like a UI or radio bug.

Recommended fix:

- Put `sgc_command` through the same reliable Inter-GC mechanism, or add command-level ACK/retry with a clear timeout event.
- Surface MaGC link state prominently before enabling MaGC-owned commands.

### P1 - Surface Inter-GC Health In SGC

Firmware emits rich `inter_gc_status`:

- Link state.
- Last RX age.
- Pending message ID/attempts.
- Snapshot applied.
- Clock sync validity, offset, uncertainty, delay, reject reason.
- Assisted rebind fields.
- MaGC recovery fields.

SGC stores this, but the visible UI mostly uses the role/source label.

Recommended fix:

- Add a compact `Inter-GC` row to GC status: online/waiting/degraded, last RX, snapshot applied, clock valid, pending attempts.
- Disable or warn on Bind/Re-scan/Profile when MaGC link is waiting/degraded.

### P1 - Make Simulated GPS Hard To Miss

Drone firmware can send plausible fallback coordinates with `gpsSimulated=true` when no real GPS fix exists. This is useful for bench work, but dangerous for interpretation.

Recommended fix:

- Add a strong `SIM GPS` badge on drone cards and tooltips.
- Consider different marker styling for simulated positions.
- Consider a mode where simulated GPS does not place a normal map marker unless bench mode is enabled.

### P1 - Decide And Document Dual-GC Boot Spectrum Behavior

Older docs say the first UI should show boot spectrum/noise visibility. Current dual-GC code defers MaGC boot scan so the shared channel is ready for JOIN immediately.

I think the current code behavior is the right tradeoff for field use: hear drones first, scan later. But the docs and UI expectations should be updated.

Recommended fix:

- In Part 6 and Part 10, state that MaGC dual-GC boot defers full scan.
- Show a status like "MaGC listening on shared channel; boot scan deferred" instead of expecting a scan animation.
- Keep manual Re-scan/on-demand spectrum for operator diagnostics.

### P1 - MaGC Reboot Can Reset TeleGC Acquisition State

Inter-GC snapshots include `joinNonce`, and TeleGC preserves runtime state when node/channel/profile/nonce identity matches. But `joinNonce` is not persisted in `/live_assignments.json`.

After MaGC reboot, the persisted assignment may be mirrored without the same nonce identity, so TeleGC may treat it as a new assignment and reset local acquisition state.

This may be acceptable, but it should be deliberate.

Recommended fix:

- Persist join nonce, or explicitly treat post-MaGC-reboot snapshots as same identity when channel/profile/node match and no new assignment event occurred.
- Add a bench test for MaGC reset while TeleGC is receiving telemetry.

### P1 - JOIN Capability Bits Are Not Fully Consistent

Drone telemetry includes course/speed, but the join request reportedly does not advertise `JOIN_CAP_GPS_COURSE_SPEED`. Current GC does not enforce that flag.

Recommended fix:

- Either set the capability bit or remove it from the contract.
- Avoid capability flags that are not enforced or do not match actual payload behavior.

### P2 - Normal Telemetry Plausibility Checks Are Light

Orphan recovery uses stricter plausible telemetry checks. Normal assigned receive mostly validates node ID, length, duplicate sequence, and relies on LoRa PHY CRC.

This is probably acceptable for v1, but if field logs show impossible jumps, add basic plausibility checks before updating TST and emitting SGC telemetry.

### P2 - Bridge Snapshot Semantics Need To Stay Full-Scene

SGC treats `drones_state` as authoritative full scene and removes local live drones missing from a snapshot. That is correct only if bridge receiver snapshots are always full scene snapshots, not partial deltas.

Recommended fix:

- Keep this explicit in the bridge USB contract.
- If partial bridge deltas are introduced later, use a different message type or add a `partial:true` field and change SGC merge behavior.

## What I Think We Expect

This is the expected field behavior under the current architecture:

1. Operator opens SGC on laptop or supported desktop browser.
2. Operator connects USB serial to TeleGC only.
3. SGC shows TeleGC role and Inter-GC health.
4. MaGC starts shared-channel listening immediately after boot.
5. Drones boot, read FC telemetry over MSP, and send shared-channel JOIN.
6. MaGC hears JOIN, allocates a channel/profile, persists it, and mirrors assignment to TeleGC.
7. TeleGC receives assigned-channel telemetry and emits `drone_telemetry`.
8. SGC shows about five drones on the map at useful update rates, with heading, speed, altitude, freshness, RSSI/SNR, satellites, frequency, and profile.
9. If a drone goes stale, TeleGC detects missed windows and asks MaGC for assisted recovery.
10. If a drone reboots, MaGC eventually gives shared rejoin priority so it can be reassigned or reused.
11. If the operator is remote, Cloudflare relay or bridge receiver provides read-only viewing unless bridge control is explicitly fresh.

## What Actually Arises From The Code

Mostly the above, with these caveats:

- Single-GC remains a real runtime path.
- The checked-in firmware config still creates a single `ground_station`.
- MaGC direct USB is not the normal live-output path in dual-GC because output is routed to `Serial1` for TeleGC.
- TeleGC waits for assignment snapshots. Without Inter-GC, it has no persisted assignment truth.
- MaGC boot scan is deferred, so the channel table can start optimistic/clear until later scan/OOCR.
- Command forwarding from TeleGC to MaGC is not retried at the Inter-GC transport layer.
- Some valid firmware diagnostic messages can be rejected by SGC's strict schema validation.
- Simulated GPS fallback can create plausible map positions.
- The old command/C2 code still exists in SGC and simple-mesh, but live mode mostly hides or bypasses it.

## Repo-Specific Cleanup Notes

### SGC Repo

Keep:

- Live-position mode in `script.js`.
- Web Serial NDJSON parser.
- Dynamic live drone creation by real `nodeId`.
- `expectedUpdateMs` freshness scaling.
- MaGC role warning.
- Bridge `drones_state` handling.
- Local diagnostic log export.

Improve:

- Relax protocol validation for bridge and failure-status variants.
- Surface `inter_gc_status`.
- Make simulated GPS visually stronger.
- Make relay/viewer empty state less confusing when USB controls are the visible path.
- Continue isolating live-position work from old command/mission code.

### simple-mesh Repo

Keep:

- Role-gated MaGC/TeleGC/drone behavior.
- 20-byte telemetry packet.
- MaGC-owned assignment persistence.
- TeleGC-only SGC USB path.
- GC-side heading fusion.
- `expectedUpdateMs` emission.
- Assisted rebind and OOCR concepts.

Improve:

- Documentation and checked-in config must stop pointing at `ground_station`.
- Make MaGC command forwarding reliable or visibly degraded.
- Verify real MSP batch behavior on Betaflight.
- Reconcile capability bits.
- Decide if simulated fallback GPS should be compiled out or made explicit for production.
- Add/prove MaGC reset and TeleGC reset recovery behavior.

## Short Priority List

1. Update docs and provisioning so dual GC is the only normal path.
2. Fix SGC schema validation for bridge `channel_table` and radio-down `gc_status`.
3. Bench-verify MaGC/TeleGC UART, Bind through MaGC, and TeleGC telemetry RX.
4. Add visible Inter-GC health to SGC.
5. Make TeleGC-to-MaGC command forwarding reliable or clearly timeout with link diagnostics.
6. Make simulated GPS impossible to confuse with real GPS.
7. Verify real Betaflight MSP batch reads.
8. Verify bridge ESP-NOW primary, LoRa fallback, and command ACKs.

## Bottom Line

The current codebase is no longer just planning. It has a real dual-GC architecture in code. The SGC browser, TeleGC, MaGC, drone firmware, Inter-GC UART, bridge receiver, and relay pieces are all present and mostly line up.

The main risk is operational coherence: stale docs and default configs can put the system into the old single-GC/flooding mental model. The second risk is validation/edge behavior around bridge/status messages and un-retried MaGC commands. The third risk is field validation: many of the right checkboxes are implemented, but the physical dual-GC bench matrix still needs to be burned down.

If I were taking the next session, I would not add features first. I would make the docs/config unambiguously dual-GC, fix the SGC parser compatibility issues, and run the physical MaGC/TeleGC/drone bench checklist until the expected behavior above is boringly repeatable.
