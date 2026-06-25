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

## ESP32 Build, Flash, And OTA Guide

Build, USB flash, provisioning, and drone OTA instructions live in:

```text
ESP32_BUILD_FLASH_OTA_GUIDE.md
```

Read this guide before building or flashing GC/drone ESP32 firmware. It documents the PowerShell helper scripts under `tools/`, the generic firmware/OTA workflow, and the rule that normal firmware-only or OTA updates must preserve the existing LittleFS `/config.json` identity unless provisioning is explicitly intended.

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
- `06_gc_lifecycle_spectrum_plan.md`: cross-cutting plan for JOIN retry hardening, fresh-session reset, GC lifecycle commands, and SGC spectrum/boot visibility.
- `10_dual_lora_ground_station.md`: MaGC/TeleGC split-mode architecture, UART protocol, clock sync, and bench checklist.
- `16_live_debug_tooling_plan.md`: live debug tooling across SGC, TeleGC, MaGC, drone USB, host scripts, and JSONL analysis.

## Checklist Behavior

When implementing work from `live-drone-position_plan/`, update the relevant markdown checklist as part of the same change.

Rules:

- Mark a task from `[ ]` to `[x]` only when that task is actually complete.
- Mark a milestone `[x]` only when all of its child tasks are complete.
- If a task is partially complete, leave it unchecked and add a short note only if the partial state would confuse the next agent.
- Do not check off future work just because the design is agreed.
- If implementation changes the plan, update the plan text before or alongside the code change.

This checklist behavior is part of the desired workflow for this branch.

## Context Retrieval And Semantic Search

When a task needs retrieval, semantic search, or summarization inside a large file or code path, spawn a sub-agent for that retrieval pass whenever sub-agent tools are available.

Use sub-agents especially for:

- Summarizing long code files such as `script.js` or simple-mesh `src\live_position_protocol.cpp`.
- Finding all relevant call sites or behavior paths for a feature or bug.
- Searching documentation, logs, or plans for source-backed context.
- Producing compact cheatsheets before making an implementation change.

The goal is to preserve the main context window for decisions, edits, and verification. Keep delegated retrieval tasks narrow and read-only unless the user explicitly asks for parallel implementation work.

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
6. GC lifecycle, fresh-session reset, and spectrum/boot visibility.

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
fresh:   < 1500 ms
late:    1500-3000 ms
stale:   3000-6000 ms
offline: >= 6000 ms
```

When firmware provides `expectedUpdateMs`, SGC scales the thresholds to `max(1500, expectedUpdateMs * 2.0)`, `max(3000, expectedUpdateMs * 3.0)`, and `max(6000, expectedUpdateMs * 6.0)` for fresh, late, and stale respectively.

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

## Live Debug Workflow

The primary live debug tool is:

```powershell
python tools\sgc_live_debug.py --telegc COM18 --duration 60 --log logs_summary\live_debug_gc.jsonl
```

Use this instead of rewriting one-off serial monitor scripts. It captures RX/TX as JSONL, parses JSON lines when possible, and can talk to TeleGC, MaGC-through-TeleGC, and an optional USB-connected drone.

Scripted `--send` commands are paced by default with `--send-interval-ms 50` so the USB CDC command reader and the Inter-GC reliable queue are stressed realistically without losing host-side command lines. Use `--send-interval-ms 0` only when deliberately testing raw USB burst abuse.

Common commands:

```powershell
python tools\sgc_live_debug.py --telegc COM18 --send telegc:status --send magc:status
python tools\sgc_live_debug.py --telegc COM18 --send magc:bind
python tools\sgc_live_debug.py --telegc COM18 --send magc:cancel
python tools\sgc_live_debug.py --telegc COM18 --send "magc:probe 15000"
python tools\sgc_live_debug.py --telegc COM18 --drone COM22 --interactive --log logs_summary\live_debug_interactive.jsonl
python tools\sgc_live_debug.py --drone COM13 --startup-delay 26 --send drone:status --send drone:hold
python tools\sgc_live_debug.py --telegc COM18 --drone COM22 --scenario bind-from-held-drone --log logs_summary\live_debug_bind.jsonl
python tools\sgc_live_debug.py --telegc COM18 --drone COM22 --startup-delay 24 --scenario bind-from-held-drone --scenario-join-delay 7 --log logs_summary\live_debug_bind_mid.jsonl
python tools\sgc_live_debug.py --telegc COM16 --drone COM13 --scenario auto-rebind-after-reset --duration 60 --log logs_summary\auto_rebind_after_reset.jsonl
python tools\sgc_live_debug.py --telegc COM16 --drone COM13 --startup-delay 25 --scenario magc-clear-then-drone-auto-join --duration 120 --log logs_summary\magc_clear_then_drone_auto_join.jsonl
python tools\measure_bind_timing.py --telegc COM16 --drone COM13 --count 10 --log logs_summary\bind_timing_reset_10.jsonl --summary logs_summary\bind_timing_reset_10_summary.md
python tools\measure_telemetry_coverage.py --telegc COM16 --node-id 7 --duration 75 --startup-delay 25 --warmup 15 --log logs_summary\telemetry_coverage_75s.jsonl --summary logs_summary\telemetry_coverage_75s_summary.md
python tools\run_forced_overlap_bench.py --telegc COM16 --node 3=192.168.68.107 --node 6=192.168.68.111 --trials 5 --alternate-offsets --lead-ms 5000 --offset-ms 20 --log logs_summary\forced_overlap_bench.jsonl --summary logs_summary\forced_overlap_bench_summary.md
python tools\run_multi_drone_stress.py --telegc COM16 --node 3=192.168.68.107 --node 6=192.168.68.111 --loss-cycles 9 --startup-timeout 120 --rebind-timeout 90 --log logs_summary\multi_drone_stress_2node.jsonl --summary logs_summary\multi_drone_stress_2node_summary.md
```

Interactive commands include:

```text
telegc status
magc status
magc bind
magc cancel
magc probe 15000
magc clear-all
drone hold
drone join-now
drone restart-join hold
drone pause
drone resume
drone reboot hold
```

Analyze a captured log with:

```powershell
python tools\analyze_live_debug_log.py logs_summary\live_debug_bind.jsonl -o logs_summary\live_debug_bind_summary.md
```

`tools\gc_bridge_serial_debug.py` remains the lower-level GC/bridge tool. Use `tools\sgc_live_debug.py` for normal TeleGC/MaGC/drone live debugging.

Use `tools\measure_bind_timing.py` when measuring repeated drone-reset-to-bind timing. It keeps TeleGC and drone serial ports open, reboots the drone for each trial, starts normal `magc bind` when the drone reports shared-channel JOIN mode, records MaGC 0% (`join_request_received`) and 100% (`telemetry_period_locked`) timing, and writes both JSONL evidence and a Markdown summary.

Normal `magc bind` is the primary bind path. On MaGC it should enter an operator shared-RX lock, stay on the shared discovery channel until JOIN or timeout, and report `operator_shared_rx_*` search/scanner events. The held-drone scenario supports `--scenario-join-delay` so early, middle, and late JOINs can be tested inside the operator search window. `magc probe 15000` is only a diagnostic comparison tool for bounded shared-channel receive testing. Current tradeoff: while MaGC is in the continuous operator shared-RX lock, a newly sent `magc cancel` may not be processed until the JOIN is handled or the search window times out.

Drone live-position firmware now uses a fast first-JOIN path: once LoRa JOIN mode starts, the first JOIN is scheduled with a `first_fast` 100-500 ms backoff while still using CAD/LBT. Later retries stay on the normal 1-5 second randomized backoff. `drone_debug_status` and `drone_debug_event` include JOIN attempt count, backoff kind, backoff duration, and LBT/TX failure counters for timing analysis. After repeated JOIN LBT blocks, the drone emits `join_request_lbt_bypass` and sends one bounded fallback JOIN so a bench rejoin cannot stall indefinitely behind local channel sensing; status includes `joinLbtFailCount` and `joinLbtBypassCount`.

MaGC should automatically enter shared RX after assigned-channel recovery fails or a known drone goes offline. This automatic rebind path emits `auto_shared_rx_*` search/scanner events, appears in `gc_status` as `autoSharedRxActive`, `autoSharedRxNodeId`, `autoSharedRxRemainingMs`, and `autoSharedRxReason`, and should not require the operator to click `bind` for normal Drone 7 power-cycle recovery. Use `--scenario auto-rebind-after-reset` to capture this path without sending a manual MaGC bind command.

Bind is considered operator-complete only when TeleGC receives and forwards local `drone_telemetry`, not merely when MaGC reports `join_ack_received` or `telemetry_period_locked`. Post-bind acquisition emits `post_bind_acquire_started`, `post_bind_first_telemetry`, and `post_bind_acquire_timeout`; the analyzer summarizes `join_ack_received -> first TeleGC drone_telemetry` latency. Treat any SGC `OFFLINE` display during an active post-bind acquire window as a UX bug.

Drone live radio must not be blocked by Web OTA startup. Drone-role firmware starts LoRa JOIN first, then starts Web OTA/debug from a low-priority background task so Wi-Fi scan/connect does not run on the main radio loop. Actual firmware upload through `/update` is still a maintenance operation.

GC link-state output must also respect recent telemetry. A missed assigned-channel listen window may schedule another acquire/recovery pass, but it should not emit `drone_link_status offline` when that node has delivered telemetry within the normal 5 second freshness window.

Persisted MaGC assignments loaded after boot are treated as unverified hints until real telemetry or a manual relock proves the drone is alive. They may appear as `bootUnverified`, but they should not rapidly flicker between `locking` and `offline`, and they must not preempt an operator bind window.

CAD is a weak spectrum hint, not proof of a drone. MaGC only treats a channel/profile as `cad_suspect` after repeated validation (`2 of 3` CAD samples, 20 ms apart, after a 12 ms retune settle). SGC expires CAD hints after about 5 seconds and must keep them visually separate from confirmed decoded telemetry. After `clear_all_assignments`, MaGC may keep volatile recently-cleared channel hints for OOCR ranking, but `/live_assignments.json`, RAM assignments, and the operator-visible assignment table remain empty until decoded telemetry plus period inference restores a drone.

When `/live_assignments.json` is empty, MaGC should immediately prefer shared-channel discovery over OOCR. This path emits `empty_shared_rx_*` events and appears in `gc_status` as `emptySharedRxActive`, `emptySharedRxStrongRemainingMs`, and related counters. Use `--scenario magc-clear-then-drone-auto-join` to verify that a MaGC reset followed by a drone reboot binds without sending manual `magc bind`.

For command-line OTA uploads, use:

```powershell
.\tools\build_ota_firmware.ps1
.\tools\ota_upload_firmware.ps1 -Hostname simple-mesh-magc -WaitForReboot
.\tools\ota_upload_firmware.ps1 -Url http://192.168.68.107:8080 -WaitForReboot
```

`ota_upload_firmware.ps1` posts `firmware.bin` to `/update` and polls `/ota_status`. It does not upload LittleFS or change board identity.

### Debugging Through TeleGC

The normal dual-GC bench connection is USB only to TeleGC. Commands sent to TeleGC can include `target`:

```json
{"type":"command","target":"telegc","command":"get_status","commandId":"dbg-001"}
{"type":"command","target":"magc","command":"get_status","commandId":"dbg-002"}
```

`target:"telegc"` executes locally on TeleGC. `target:"magc"` is forwarded over the Inter-GC UART to MaGC and the response is forwarded back to the USB client. Prefer role-tagged ACK/status output (`sourceRole`, `target`) when debugging conflicts.

TeleGC forwards MaGC-targeted SGC commands through a bounded reliable Inter-GC queue. A `magc:*` command should not fail merely because another reliable message is pending; it should either produce a real MaGC `command_ack` or a command-specific timeout such as `magc_ack_timeout`. `inter_gc_status` reports `reliableQueueDepth`, `eventOutboxDepth`, event drop counters, and queued command age. Treat any `inter_gc_forward_failed`, duplicate `command_ack`, malformed JSON payload, or corrupted event type as a transport failure.

MaGC-to-TeleGC debug/event output is routed through a single Inter-GC event outbox. Critical command ACKs, assignment sync, bind milestones, post-bind acquire events, and telemetry timing hints have priority; low-value scanner/spectrum chatter may be coalesced or dropped under pressure and should be visible in the outbox counters. Large command result bodies such as `assignments` and `channel_table` may be compacted instead of forwarded as best-effort event lines; assignment sync remains the source of truth for those data sets.

### Split-GC Wi-Fi Debug

MaGC and TeleGC expose the same Web OTA/debug endpoints as drones after the split-GC Wi-Fi debug build:

```powershell
python tools\drone_wifi_debug.py --host simple-mesh-magc.local status
python tools\drone_wifi_debug.py --host simple-mesh-telegc.local status
python tools\drone_wifi_debug.py --host 192.168.68.101 raw "{\"type\":\"command\",\"command\":\"get_assignments\"}"
```

Use MaGC Wi-Fi status for shared-owner, bridge, and MaGC recovery fields. Use TeleGC Wi-Fi status for receiver-budget diagnostics such as `receiverBudgetNodes`, `recoveryBudgetDeniedCount`, `lastRecoveryBudgetDeniedNodeId`, `lastHealthyProtectedNodeId`, and owed-RX counters. The HTTP route queues commands for the firmware main loop; do not add handlers that mutate radio state directly from the WebServer task.

### USB-Connected Drone Debug

When a drone ESP32 is connected by USB, live-position drone firmware accepts JSON debug commands:

```json
{"type":"command","command":"debug_join_control","commandId":"drone-001","joinMode":"hold"}
{"type":"command","command":"debug_send_join_request","commandId":"drone-002"}
{"type":"command","command":"debug_restart_join","commandId":"drone-003","hold":true}
{"type":"command","command":"debug_pause_telemetry","commandId":"drone-004","enabled":true}
{"type":"command","command":"debug_simulate_rf_loss","commandId":"drone-005","cycles":2}
{"type":"command","command":"debug_drop_telemetry","commandId":"drone-006","cycles":2}
{"type":"command","command":"debug_reboot","commandId":"drone-007","bootJoinMode":"hold","delayMs":250}
```

Use `drone hold` before starting a bind/search when you need to control the exact JOIN request. Use `drone join-now` to send one JOIN request. Use `drone restart-join hold` to clear runtime assignment state and keep JOIN held. Use `drone rf-loss 1` or `drone rf-loss 2` to simulate packets that were transmitted from the drone perspective but lost before TeleGC receives them; this consumes sequence IDs and should make TeleGC see a sequence gap. Use `drone drop-silent 1` or `drone drop-silent 2` to simulate the drone not transmitting for one or two slots. Use `drone pause` only for longer outage tests that require manual `drone resume`. Use `drone reboot hold` to soft reboot into JOIN hold.

USB soft reboot is `ESP.restart()` plus serial reconnect. It is not electrical power removal; true power cycling still needs external USB power switching hardware.

The same drone debug commands are available over the drone Web OTA/debug server when the drone has Wi-Fi OTA configured. The firmware starts this server from a low-priority background task after live LoRa JOIN is initialized, and HTTP requests are queued back into the normal drone loop before they touch LoRa runtime state. Use this for remote bench control:

```powershell
python tools\drone_wifi_debug.py --host simple-mesh-7.local status
python tools\drone_wifi_debug.py --host simple-mesh-7.local config
python tools\drone_wifi_debug.py --host simple-mesh-7.local files
python tools\drone_wifi_debug.py --host simple-mesh-7.local rf-loss 2
python tools\drone_wifi_debug.py --host simple-mesh-7.local drop-silent 2
python tools\drone_wifi_debug.py --host simple-mesh-7.local delay-next 20
python tools\drone_wifi_debug.py --host simple-mesh-7.local schedule-next 1234567
python tools\drone_wifi_debug.py --host simple-mesh-7.local hold
python tools\drone_wifi_debug.py --host simple-mesh-7.local join-now
python tools\drone_wifi_debug.py --host simple-mesh-7.local restart-join hold
python tools\drone_wifi_debug.py --host simple-mesh-7.local reboot hold
```

The HTTP API is `GET /debug/status` and `POST /debug/command` on port `8080`; `POST /debug/command` accepts the same JSON command body as USB serial and returns NDJSON ACK/status/event lines. `get_config` returns raw `/config.json` plus redacted `/wifi_ota.json`, and `get_files` lists LittleFS files. Firmware upload through `/update` is still a maintenance path and may pause non-critical work; normal Wi-Fi debug commands are separate from OTA upload.

The configured Wi-Fi must be ESP32-compatible 2.4 GHz. If `simple-mesh-<nodeId>.local` does not resolve after flashing/provisioning, check the drone USB log for `AP running` and verify the configured SSID has a 2.4 GHz BSSID; the drone cannot join a 5 GHz-only network. When LAN association fails, the drone falls back to AP `simple-mesh-<nodeId>` with password `n3v3rd1sarm`, and the same HTTP endpoints are available at `http://192.168.4.1:8080` after connecting a client to that AP.

On Windows, `.local` mDNS may fail even when the drone is reachable. In that case scan the bench subnet for `/ota_status` on port `8080`, identify drones with `droneDebug:true`, and call `tools\drone_wifi_debug.py --host <ip> ...` directly. For example, node 3 and node 6 have been controlled successfully by IP at `192.168.68.107` and `192.168.68.111`.

Short simulated RF-loss bursts should stay on the assigned channel. GC firmware has a short-loss continuity guard for up to 8 missed telemetry packets; it emits `short_loss_guard_*` `telemetry_rebind_event` rows and should not escalate to shared-channel rebind or show an operator-visible offline state for 2-5 skipped transmitted packets. Use `tools\run_rf_loss_bench.py` for repeated 2/3/4/5 packet-loss tests and check the observed missing packet count, not only pass/fail continuity. The reports split missing sequence IDs into pre-simulation baseline loss and post-simulation extra loss; post-simulation extra should stay at zero for a clean guarded recovery. Use `delay-next 20` only as a one-shot phase disturbance/short-loss trigger; it does not also update TeleGC's predicted TST and therefore is not deterministic for owed-overlap scheduler tests.

Use `tools\run_forced_overlap_bench.py` for deterministic owed-packet scheduler tests. It schedules the next telemetry target on each drone over Wi-Fi, then shortly before the target sends TeleGC `debug_schedule_assignment_overlap` so TeleGC's volatile assignment timing model expects the same conflict. TeleGC applies temporary debug-only timing uncertainty to those volatile assignment predictions so normal Wi-Fi clock jitter does not turn the test into a false phase-miss recovery test; the uncertainty is cleared on telemetry reception. Passing logs must show `rx_candidate_skipped -> owed_rx_selected -> owed_rx_cleared`, no `owed_rx_missed`, no non-online link states after warmup, and score fields on `owed_rx_selected`.

Use `tools\measure_telemetry_coverage.py` for baseline TeleGC assigned-channel receive checks. The normal assigned telemetry baseline is 200 ms (5 Hz), matching the branch target of 2-5 Hz instead of the earlier 100 ms stream. TeleGC should report `telemetryCoverageMode:"telemetry_first"`, zero `nonAssignedPreemptions`, and no warmup-filtered sequence gaps during a steady assigned-channel run. Startup/reacquire gaps may still appear in lifetime GC counters, so use the tool summary's warmup-filtered sequence-gap section for the actual steady-state result. When assigned-drone TST windows overlap, TeleGC may intentionally skip one packet, but that node must receive owed-packet priority on the next catchable cycle; logs should show `rx_candidate_skipped`, then `owed_rx_selected`, then `owed_rx_cleared` when telemetry is received. Scheduler-caused skips are not RF misses and should not by themselves escalate to shared-channel rebind or OFFLINE.

Normal assigned telemetry timing is drone-owned. Current firmware accepts legacy 5-byte JOIN requests, and newer drones advertise an extended JOIN with `JOIN_CAP_DRONE_OWNED_TIMING`, requested assigned profile, and requested nominal period. MaGC may accept or fall back to a valid profile/period, but normal reliability must not depend on MaGC commanding exact phase slots. TeleGC protects healthy online drones through profile-aware receiver budgeting: `gc_status.receiverBudgetMode` should be `drone_owned_timing`, `receiverBudgetNodes` show per-node `rxCostMs` and `gapBudgetMs`, and `recovery_budget_denied` / `healthy_service_protected` events mean recovery was deferred so online drones stay visible. If `receiverOverloaded` or `receiver_budget_overloaded` appears, treat the profile mix as exceeding one receiver's budget instead of interpreting the resulting gaps as a bind/rejoin bug.

GC timing inference should not trust a single long startup interval as the steady telemetry period. For the normal profile, persisted timing above the practical profile window is invalidated on boot and reacquired, preventing stale values such as `txPeriodMs:1190` from poisoning TeleGC scanner scheduling.

Use `tools\run_multi_drone_stress.py` for the startup, bind-button abuse, RF-loss, and broken-link stress gate. It controls drones over Wi-Fi debug and captures the dual-GC view through TeleGC USB. The runner clears MaGC assignments, restarts all listed drones into shared-channel auto JOIN, waits for TeleGC telemetry from every node, can repeatedly issue MaGC `bind/cancel` with `--manual-bind-abuse`, can run Wi-Fi RF-loss-only matrices with `--rf-loss-only-cycles`, then breaks one drone at a time with `rf-loss` followed by `restart-join auto`. A passing run requires startup binds, zero non-target non-online link events during manual bind and RF-loss tests, each target's rebind through shared JOIN, and clean Inter-GC transport. Manual bind with active assignments must be treated as safe MaGC discovery on every command surface, including bridge-originated start-search commands; SGC should ignore terminal link status for nodes with recent TeleGC telemetry and record `terminal_link_status_ignored_recent_telemetry` diagnostics instead.

Before rolling new firmware across multiple drones, audit each USB-connected drone with:

```powershell
python tools\drone_safe_rollout.py --port COM13 --expected-node-id 7
```

This reads the identity loaded from LittleFS through the running firmware, verifies Wi-Fi OTA/debug when reachable, and writes a Markdown report under `logs_summary/`. Firmware-only flashing is explicit and guarded:

```powershell
python tools\drone_safe_rollout.py --port COM13 --expected-node-id 7 --flash
```

`--flash` refuses to run without `--expected-node-id`, uses `tools\flash_firmware_only.ps1`, does not upload LittleFS, and re-audits the node after flashing. On firmware with `get_config`, the audit compares runtime `nodeId` to raw `/config.json` `node_id` and verifies `node_role:"drone"`.

### SGC Debug Drawer

Open the webapp with `?debug=1` to show the advanced live debug drawer:

```text
http://localhost:8000/?debug=1
```

The normal operator path stays clean when debug mode is off. The drawer can query TeleGC/MaGC, start/cancel MaGC bind/search, open a second Web Serial port to a drone, or send the same drone debug commands over Wi-Fi to a configured drone host/IP. It supports hold/release JOIN behavior, a single JOIN, RF-loss simulation, silent telemetry drops, telemetry pause/resume, and reboot into JOIN hold. Relay viewer mode remains read-only.

The SGC diagnostic export records targeted command direction, role-tagged ACKs, ACK latency, pending command context, bind progress stalls, and the telemetry-bind `0.84` stall region.

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
