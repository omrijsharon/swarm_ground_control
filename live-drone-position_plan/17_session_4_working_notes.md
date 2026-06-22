# Session 4 Working Notes

Date: 2026-06-22

Scope:

- SGC repo: `C:\Users\tamipinhasi\Documents\repos\swarm_ground_control`
- Firmware repo: `C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh`

This note complements `AGENTS.md`. It intentionally does not restate the branch goal, packet layout, freshness thresholds, serial JSON contract, common command examples, or live debug command catalog already covered there. It is a working map of the current repo reality, code landmarks, current blockers, and likely first fix points.

## Current Source Of Truth

Prefer these docs when facts conflict:

1. `simple-mesh\LIVE_POSITION_DUAL_GC.md`
   - Current firmware behavior and dual-GC operator flow.
   - Treat older simple-mesh README/SETUP/STATUS/SERIAL_API/flood-mesh docs as historical unless explicitly working on legacy mesh behavior.

2. `live-drone-position_plan\16_live_debug_tooling_plan.md`
   - Current bench changelog and validation status.
   - The late sections are more current than older milestone checklists.

3. `logs_summary\20260622_receiver_budget_budgetgate1_summary.md`
   - Latest strong passing hardware gate for reachable drones 3, 6, and 7.
   - The `READY FOR 4 DRONES` verdict means the system is ready to try the four-drone gate, not that four drones have passed.

4. `live-drone-position_plan\15_session_3_dual_gc_repo_review.md`
   - Still useful for architecture risk and stale-doc contradictions.
   - Some items have since been fixed or superseded by the 2026-06-22 receiver-budget work.

5. `live-drone-position_plan\04_sgc_side.md` and `08_field_test_followups.md`
   - Useful for SGC UI behavior and field-failure reasoning.
   - Many unchecked items are manual/browser/RF verification, not necessarily missing code.

## Current Bench Reality

Latest reliable baseline:

- Drones 3, 6, and 7 passed startup bind, manual Bind non-disruption, RF-loss-only cycles, sequential broken-link rejoin, and clean Inter-GC transport.
- Evidence: `logs_summary\20260622_receiver_budget_budgetgate1_summary.md`.
- Transport evidence: 46/46 command ACKs, 0 rejected commands, 0 MaGC ACK timeouts, 0 Inter-GC forward failures, 0 malformed serial JSON, 0 suspicious fragments, and 0 queue/outbox drops.
- Receiver-budget evidence: recovery was denied when it would threaten healthy service, and no receiver overload was reported.

Four-drone state:

- Node 2 is the blocker.
- In the last four-node run, MaGC bound node 2 but TeleGC never emitted local `drone_telemetry` for it before timeout.
- Node 2 showed repeated `post_bind_acquire_timeout` and weak RF evidence compared with other drones.
- Next bench step should be hardware/RF first: move or inspect node 2 antenna/placement, run a single-node close-range bind/coverage capture, then rerun four-node startup before broken-link stages.
- Do not interpret node 2's MaGC assignment completion as operator success. Operator success is first TeleGC `drone_telemetry`.

Open software hardening tied to that failure:

- A node that binds but never yields first TeleGC telemetry can poison scheduler/fairness state.
- Current plan calls for capping stored `consecutive_scheduler_skips` and quarantining or rehunting first-telemetry failures after `GC_FIRST_TELEMETRY_ACQUIRE_PRIORITY_MISSES`.

Other validation still open:

- Mixed-profile bench with at least one non-Fast drone.
- Browser checks for `?debug=1`, spectrum panel/rescan, Search with flashed firmware, HOME behavior, Delete visibility, profile apply, relay, and bridge controls/status.
- Bridge ESP-NOW 4 Hz / LoRa fallback / promotion-back checks.
- CAD false-positive, reset rediscovery, cold OOCR, and real weak-link/OFF classification.

## SGC Code Map

The browser app has no build system. It is a static HTML/CSS/JS app.

Core files:

- `index.html`
  - Static shell, Leaflet includes, map container, overlay canvas, live panel, hidden debug drawer.
- `config.js`
  - Runtime knobs. Live mock is off by default and serial auto-connect is on.
- `style.css`
  - Live layout, cards, GC/radio grid, debug drawer, spectrum UI, bridge/relay indicators.
- `script.js`
  - Monolithic application. Old C2 prototype and live-position behavior coexist.

Important `script.js` landmarks:

- `liveState` around line 217
  - Central live-mode state: serial, pending commands, GC status, Inter-GC status, channel table, binding/recovery/link maps, debug ports, relay state.
- `Drone` around line 1470
  - Still the telemetry holder. It stores live fields including CoG/yaw/speed/sats/RSSI/SNR/frequency/profile/timing/sequence.
- `GroundControl` around line 1649
  - Old command/mission assignment model. Do not use it as live radio assignment truth.
- Diagnostic log helpers around line 3440
  - `recordLiveGcDiagnosticLine()` and event logging for exported JSONL-style captures.
- Live protocol schemas around line 6463
  - Strict validation happens before dispatch. This is a known issue for compact bridge and radio-down status variants.
- Display-state/freshness helpers around line 4075
  - Freshness scales from `expectedUpdateMs` when firmware provides it.
- `getLiveDisplayState()` around line 4147
  - Preserves recent telemetry over terminal `drone_link_status`.
- GC/radio status render around line 6274
  - Add compact status rows here for Inter-GC, receiver budget, or bridge status.
- Binding/recovery helpers around line 6912
  - Binding progress, phase transitions, and recovery row state.
- `applyLiveTelemetry()` around line 7587
  - Creates/updates live drones by real `nodeId`, clears binding/recovery, stores telemetry, redraws, and publishes relay state.
- `handleLiveProtocolMessage()` around line 7775
  - Main JSON dispatcher.
- `processLiveSerialLine()` around line 8126
  - Ignores non-JSON firmware logs and parses complete JSON lines only.
- `sendLiveSerialCommand()` around line 8154
  - Adds command IDs, tracks pending ACKs, records direction, and writes NDJSON.
- `openLiveSerialPort()` around line 8411
  - Opens Web Serial and requests snapshots.
- Drone USB/Wi-Fi debug around lines 8539 and 8698
  - Browser debug drawer path, separate from normal operator UI.
- `renderLiveStatusList()` around line 9479
  - Drone cards, live badges, and per-drone fields.
- `drawLivePositionDrones()` around line 14022
  - Canvas overlay markers; live drones are not Leaflet markers.
- `draw()` around line 14228
  - Live mode returns before old C2 drawing paths.

SGC implementation invariants:

- Recent TeleGC telemetry wins over stale/terminal link status. Preserve this if touching link-state display.
- Bind is operator-complete only after first TeleGC-local `drone_telemetry`, not merely MaGC `assignment_completed`, `join_ack_received`, or `telemetry_period_locked`.
- Live protocol changes must update `liveProtocolSchemas` or valid firmware messages may be dropped before handlers see them.
- Relay/bridge `drones_state` is treated as a full scene snapshot. Do not send partial deltas under that message type.
- If adding a telemetry field, update `Drone.updateTelemetry()`, `applyLiveTelemetry()`, relay snapshot publish/apply paths if needed, card/tooltip rendering, and protocol schema.
- If touching old menus/tooltips, reread `solution_for_repeated_issues.md`. Selection and close-suppression timers are easy to regress.

## Firmware Code Map

Current Seeed XIAO S3 build has live-position and Web OTA enabled in `platformio.ini`.

Core files:

- `include\config.h`
  - `NodeRole`, role helpers, live-position config defaults, Inter-GC UART defaults.
- `src\config.cpp`
  - Loads `/config.json`, including role, simulated FC settings, Inter-GC UART, backhaul, and bridge transport config.
- `src\main.cpp`
  - Runtime dispatch by role.
- `include\live_position_protocol.h`
  - Air packets, assignment/runtime structs, timing constants, exported live-position API.
- `src\live_position_protocol.cpp`
  - Main live-position firmware implementation.
- `include\inter_gc_link.h` and `src\inter_gc_link.cpp`
  - MaGC/TeleGC UART transport, reliable queue, assignment sync, command forwarding, clock sync, assisted rebind.
- `src\web_ota.cpp`
  - OTA status/update endpoints and drone Wi-Fi debug bridge.
- `src\BetaflightMSP.cpp`
  - FC/MSP telemetry readout.

Important firmware landmarks:

- `include\config.h`
  - `NodeRole` around line 49.
  - Inter-GC UART defaults around lines 166-172.
- `src\main.cpp`
  - Config/radio/profile setup around line 557.
  - Inter-GC UART or MSP UART setup depending on role around line 602.
  - Drone fast JOIN starts before Web OTA/background services around line 745.
  - Loop dispatch starts around line 847.
- `include\live_position_protocol.h`
  - Join capability flags around line 107.
  - Receiver/scheduler constants around lines 159-220.
  - `DroneAssignment` around line 449.
  - `DroneRuntime` around line 493.
  - `TelemetryPacket` around line 710.
  - Static packet-size assertions around line 842.
- `src\live_position_protocol.cpp`
  - Assignment save/load around lines 1021 and 1062.
  - Channel allocation/reuse around line 1236.
  - GC shared JOIN handling around line 1877.
  - Drone JOIN start/send/apply around lines 2831, 2838, and 2990.
  - Drone debug command handling around line 3779.
  - Drone state machine around line 4637.
  - Short-loss helpers around line 5403.
  - Scanner candidate selection around line 7418.
  - Scheduler window selection around line 8705.
  - Miss handling around line 8910.
  - `emitDroneTelemetryJson()` around line 9438.
  - Assigned packet parse around line 12465.
  - `processGcLivePosition()` around line 12682.
  - Command ACK/status/command parsing around lines 13382, 15255, and 15899.
- `src\inter_gc_link.cpp`
  - Reliable enqueue/retry around lines 382 and 1000.
  - Event outbox/coalescing around line 628.
  - Assignment sync around line 1122.
  - Assisted rebind around line 1868.
  - TeleGC USB command routing around line 2598.
  - MaGC/TeleGC services around line 3008.
- `src\web_ota.cpp`
  - HTTP routes around line 585.
  - `/ota_status` around line 855.
  - Drone debug HTTP bridge around line 886.
  - Queue handoff back into drone loop around line 1073.

Firmware implementation invariants:

- `src\live_position_protocol.cpp` is large and global-state-heavy. Keep fixes narrow and verify with logs.
- MaGC and TeleGC separation is enforced by `main.cpp` role dispatch, not by isolated module instances.
- Persisted assignments are unverified hints until real telemetry or a deliberate relock proves the drone alive.
- Do not revive the old `TX_PERIOD_PROPOSAL` / `TX_PERIOD_ACK` handshake for normal operation. Drone-owned timing is the active path.
- Inter-GC event output is intentionally compacted/coalesced/dropped for low-value chatter. Avoid adding large high-rate JSON payloads without considering queue/outbox pressure.
- Web debug commands should queue into the drone loop before touching LoRa runtime. Do not run radio mutations directly in HTTP handler context.
- `simple-mesh\data\config.json` still says `node_role:"ground_station"`. Treat it as dangerous for normal rollout unless intentionally provisioning. Normal firmware flash/OTA must preserve LittleFS identity.

## Known Risk And Fix Queue

### 1. Node 2 / Four-Drone Gate

Symptoms:

- MaGC can bind node 2.
- TeleGC does not receive local node 2 telemetry in the latest four-node run.
- Analyzer shows repeated `post_bind_acquire_timeout`.
- RF evidence is weak compared with nodes 3, 6, and 7.

Likely first actions:

- Inspect node 2 antenna, power, placement, and Wi-Fi/debug status.
- Run single-node node 2 close-range coverage before changing shared-channel software.
- Rerun four-node startup only after node 2 has a clean single-node baseline.

### 2. First-Telemetry Failure Scheduler Poisoning

Symptoms:

- A node that binds but never produces first TeleGC telemetry can accumulate scheduler skip/owed state.
- Open plan calls out `consecutive_scheduler_skips` cap and quarantine/rehunt after `GC_FIRST_TELEMETRY_ACQUIRE_PRIORITY_MISSES`.

Likely code touch points:

- `include\live_position_protocol.h`: `GC_FIRST_TELEMETRY_ACQUIRE_PRIORITY_MISSES`, `DroneAssignment::consecutive_scheduler_skips`, `owed_rx_count`.
- `src\live_position_protocol.cpp`: candidate selection, miss handling, post-bind acquire timeout, recovery escalation.

Verification:

- Four-node startup with node 2 included.
- Confirm other nodes do not suffer long gaps or terminal link states while node 2 is failing first telemetry.

### 3. SGC Protocol Schema Too Strict

Symptoms:

- Valid useful firmware variants can be dropped before dispatch.
- Known cases: compact bridge `channel_table` and radio-down/minimal `gc_status`.

Likely code touch points:

- `script.js`: `liveProtocolSchemas`, `validateLiveProtocolMessage()`, `handleLiveProtocolMessage()`.

Fix direction:

- Make validation source/type aware.
- Keep hard requirements only for fields a handler truly needs.
- Allow degraded `gc_status` with `meshReady:false` / `radioReady:false` and compact bridge table variants.

Verification:

- Browser accepts a radio-down status and displays useful error state.
- Browser accepts bridge compact channel/status messages.
- `node --check script.js`.

### 4. Inter-GC Health Visibility In SGC

Current state:

- Firmware emits rich `inter_gc_status`.
- SGC stores it, but operator-visible UI mostly uses source/role labels.

Likely code touch points:

- `script.js`: `liveState.interGcStatus`, `renderLiveGcStatus()`, command disable/warning logic.
- `style.css`: small GC grid/status styling.

Useful visible summary:

- Link online/degraded/waiting.
- Last RX age.
- Assignment snapshot state.
- Pending reliable command/message.
- Queue/outbox drops.
- Clock sync validity if relevant to scheduler/debug.

### 5. Simulated GPS Presentation

Current state:

- Firmware emits `gpsSimulated` / `gpsSource`.
- SGC stores and labels GPS source.

Risk:

- Simulated Tel Aviv fallback can look like real map movement in a field demo.

Fix direction:

- Make `GPS SIM` visually strong in card/tooltip/marker styling.
- Consider hiding normal marker confidence or using a distinct marker style when GPS is simulated.

### 6. Mixed Profile And Bridge/Relay Checks

Still open:

- Fast/Balanced/Robust or mixed-profile bench.
- Bridge ESP-NOW/fallback and mutating ACKs.
- Cloudflare relay multi-browser verification.

Do not let these distract from node 2/four-drone receiver coverage unless the user asks for bridge/relay work.

## Tooling Map

Use the SGC repo `tools\` directory as the host-side control plane.

- `sgc_live_debug.py`
  - Best daily capture/control tool.
  - Use for TeleGC/MaGC status, held-drone bind scenarios, auto rebind, and clear-then-auto-join scenarios.
  - Produces JSONL evidence suitable for analyzer.

- `analyze_live_debug_log.py`
  - Run after every significant JSONL capture.
  - Summarizes command ACKs, Inter-GC transport, bind/search events, post-bind telemetry, short-loss, owed fairness, receiver budget, sequence gaps, flicker, and terminal-state-over-recent-telemetry regressions.

- `measure_telemetry_coverage.py`
  - Steady assigned-channel coverage check.
  - Use warmup-filtered sequence gaps and non-online link events for real acceptance, not lifetime counters alone.

- `run_rf_loss_bench.py`
  - Short-loss continuity guard.
  - PASS means expected sequence gap, telemetry resumed, and no non-online state in the trial window.

- `run_forced_overlap_bench.py`
  - Deterministic owed-packet scheduler proof.
  - Must show skipped candidate, owed selected, owed cleared, no owed misses, no non-online link event, and score fields.

- `run_multi_drone_stress.py`
  - Fleet gate.
  - Covers preflight, clear-all startup, optional bind/cancel abuse, optional RF-loss-only matrix, sequential broken-link rejoin, and transport health.

- `drone_wifi_debug.py`
  - Wi-Fi debug control for reachable drones on port 8080.
  - Friendly commands map to firmware debug JSON.

- `drone_safe_rollout.py`
  - Use before flashing a USB-connected drone.
  - Confirms expected node identity, preserves LittleFS on firmware-only flash, and re-audits afterward.

- PowerShell helpers:
  - `build_ota_firmware.ps1`: builds generic firmware only.
  - `flash_firmware_only.ps1`: USB firmware-only flash.
  - `ota_upload_firmware.ps1`: uploads `firmware.bin` to `/update`.
  - `provision_node.ps1`: intentional identity/config provisioning only.
  - `provision_wifi_ota.ps1`: OTA credentials only.
  - `find_ota_device.ps1`: finds `/ota_status` by hostname/IP/subnet scan.

## Historical Or Stale Areas To Avoid

- SGC `ACTIONS.md` and `TODO.md` describe older command/C2 ideas. Do not expand them for live-position work unless explicitly requested.
- simple-mesh `README.md`, `ARCHITECTURE.md`, `STATUS.md`, `SETUP.md`, and broad `SERIAL_API*.md` docs still contain old flood mesh / generic serial API framing.
- Top-level `simple-mesh\main.cpp` exists, but active PlatformIO source is `src\main.cpp`.
- Single-GC `ground_station` remains a code path, but the normal current operator path is dual-GC.
- Older checklist files can be stale. Prefer latest logs and the later sections of Part 16 when deciding what is actually done.

## Quick Start For A Future Fix

1. Identify which surface owns the behavior:
   - SGC UI/parser/display: `script.js`, `style.css`, `index.html`.
   - MaGC admission/allocation/recovery: `live_position_protocol.cpp`.
   - TeleGC visible telemetry/scheduler: `live_position_protocol.cpp` plus `inter_gc_link.cpp`.
   - Drone JOIN/telemetry/debug: `live_position_protocol.cpp`, `web_ota.cpp`, `BetaflightMSP.cpp`.

2. Read the newest relevant plan section:
   - Scheduler/recovery: Part 16 late sections plus latest `logs_summary`.
   - SGC live UI: Part 4 and Part 8.
   - Dual-GC firmware architecture: Part 10 plus `LIVE_POSITION_DUAL_GC.md`.

3. Keep the change narrow.
   - This codebase has large stateful modules; avoid broad cleanup during behavior fixes.

4. Verify with the smallest useful gate.
   - Syntax/static check for browser changes: `node --check script.js`.
   - Firmware static check: `pio run -e seeed-xiao-s3`.
   - Behavioral check: pick the targeted SGC tool, then run `analyze_live_debug_log.py` on the output.

5. Update the relevant checklist only when the specific task is actually complete.
