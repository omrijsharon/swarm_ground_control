# Live Debug Tooling Plan

## Goal

Make live debugging first-class across SGC, TeleGC, MaGC, and a USB-connected drone node.

The debugger should be able to mirror what the SGC operator sees, query TeleGC and MaGC while physically connected only to TeleGC over USB, hold or trigger a drone JOIN request from USB, soft-reboot the drone into a held JOIN state, and capture reproducible JSONL evidence for bind freezes such as a stall around `0.84` progress.

USB reset means `ESP.restart()` plus serial reconnect. It is not electrical power removal.

## Public Interfaces

Targeted GC commands sent to TeleGC USB:

```json
{"type":"command","target":"magc","command":"get_status","commandId":"dbg-001"}
{"type":"command","target":"telegc","command":"get_status","commandId":"dbg-002"}
{"type":"command","target":"magc","command":"start_search","commandId":"dbg-003"}
{"type":"command","target":"magc","command":"cancel_search","commandId":"dbg-004"}
```

Drone USB debug commands:

```json
{"type":"command","command":"debug_join_control","commandId":"drone-001","joinMode":"hold"}
{"type":"command","command":"debug_restart_join","commandId":"drone-002","hold":true}
{"type":"command","command":"debug_send_join_request","commandId":"drone-003"}
{"type":"command","command":"debug_pause_telemetry","commandId":"drone-004","enabled":true}
{"type":"command","command":"debug_simulate_rf_loss","commandId":"drone-005","cycles":2}
{"type":"command","command":"debug_drop_telemetry","commandId":"drone-006","cycles":2}
{"type":"command","command":"debug_reboot","commandId":"drone-007","bootJoinMode":"hold","delayMs":250}
```

## Checklist

### Firmware

- [x] Add optional `target` handling for USB command envelopes.
- [x] Execute `target:"telegc"` commands locally on TeleGC.
- [x] Forward `target:"magc"` commands from TeleGC to MaGC over Inter-GC UART.
- [x] Include `target` and `sourceRole` on forwarded/local command ACKs where practical.
- [x] Add MaGC `cancel_search` command and `search_event` emission.
- [x] Ensure MaGC command ACKs are forwarded back through TeleGC USB.
- [x] Read drone USB serial JSON commands in the live-position drone role.
- [x] Add non-persistent `DroneDebugControl` runtime state.
- [x] Add one-shot RTC boot flag for reboot-into-JOIN-hold.
- [x] Add drone debug commands for status, JOIN hold, restart JOIN, send one JOIN, pause telemetry, bounded telemetry drops, and soft reboot.
- [x] Add `drone_debug_status` and `drone_debug_event` output.
- [x] Add fast first-JOIN backoff for live-position drone nodes.
- [x] Keep later drone JOIN retries on the normal randomized backoff.
- [x] Report drone JOIN attempt count, backoff kind, backoff duration, and LBT/TX failures.
- [x] Start drone LoRa JOIN mode before Web OTA and FC/MSP readiness can block the first JOIN.
- [x] Add MaGC automatic shared-RX rejoin windows for lost persisted assignments.
- [x] Reuse the reliable shared-RX implementation for manual bind and automatic rebind.
- [x] Prioritize automatic shared RX over stale assignment recovery, bridge backhaul, OOCR, and assigned-channel probing while active.
- [x] Expose automatic shared-RX state in `gc_status`.
- [x] Forward TeleGC-to-MaGC commands over reliable Inter-GC UART frames.
- [x] Dedupe repeated forwarded MaGC commands by `commandId`.
- [x] Queue MaGC-targeted SGC commands on TeleGC when the Inter-GC reliable slot is busy.
- [x] Report command-specific Inter-GC timeouts with `reason:"magc_ack_timeout"`.
- [x] Route MaGC live/debug event output through a single Inter-GC event outbox instead of direct UART writes.
- [x] Expose Inter-GC reliable queue depth, event outbox depth, drop counters, and queued command age in `inter_gc_status`.

### SGC Webapp

- [x] Add advanced live debug drawer gated behind `?debug=1` or the localStorage debug flag.
- [x] Keep normal operator path clean when debug mode is disabled.
- [x] Log targeted command direction as `sgc_to_telegc`, `sgc_to_magc`, and `sgc_to_drone`.
- [x] Log `sourceRole`, `target`, matched ACK latency, and pending command timeout context.
- [x] Add TeleGC/MaGC status, MaGC bind, and MaGC cancel controls.
- [x] Add optional second Web Serial connection for drone debug control.
- [x] Add drone hold, JOIN now, restart JOIN hold, pause telemetry, drop two telemetry cycles, and reboot hold controls.
- [x] Add bind progress stall detection, including the `telemetry_bind` / `0.84` region.
- [x] Keep relay viewer mode read-only.
- [x] Include debug source metadata and binding placeholders in diagnostic snapshots.
- [x] Show MaGC automatic shared-RX rebind state separately from manual bind/search state.
- [x] Log automatic shared-RX events in the same diagnostic stream as manual bind events.

### Host Tools

- [x] Add `tools/sgc_live_debug.py` as the main TeleGC/MaGC/drone live debug tool.
- [x] Support `--telegc COMx` and optional `--drone COMy`.
- [x] Support targeted send commands and interactive commands.
- [x] Support `--scenario bind-from-held-drone`.
- [x] Support `--scenario auto-rebind-after-reset`.
- [x] Support `--scenario-join-delay` for early/middle/late operator-search JOIN timing tests.
- [x] Support `magc probe [durationMs]` for bounded MaGC shared-channel RX probes.
- [x] Capture all RX/TX lines to JSONL.
- [x] Add `tools/analyze_live_debug_log.py`.
- [x] Summarize ACKs, bind timeline, JOIN/debug events, assignment events, stalls, and state flicker.
- [x] Summarize automatic shared-RX starts, active ticks, JOIN detections, completions, and completion reasons.
- [x] Summarize Inter-GC command queue health, duplicate/missing ACKs, malformed serial JSON payloads, suspicious JSON fragments, and event outbox drops.
- [x] Keep `tools/gc_bridge_serial_debug.py` for bridge-specific testing.
- [x] Add `tools/ota_upload_firmware.ps1` for command-line Web OTA uploads and reboot polling.

### Documentation

- [x] Document the debug workflow in `AGENTS.md`.
- [x] Document how to query MaGC through TeleGC.
- [x] Document how to hold/release and soft-reboot a USB-connected drone.
- [x] Document the held-drone bind reproduction scenario.
- [x] Document that USB soft reboot is not electrical power removal.
- [x] Document automatic MaGC rebind and fast first-JOIN expectations.
- [x] Document queued MaGC command forwarding and clean Inter-GC event outbox expectations.

### Verification

- [x] `pio run -e seeed-xiao-s3` in `simple-mesh`.
- [x] `node --check script.js`.
- [x] `python tools/sgc_live_debug.py --help`.
- [x] `python tools/analyze_live_debug_log.py --help`.
- [x] TeleGC-only bench: `telegc status`, `magc status`, `magc bind`, `magc cancel`.
- [x] Drone USB bench: hold, join-now, restart-join hold, reboot hold.
- [x] End-to-end bind scenario with `--scenario bind-from-held-drone`.
- [ ] SGC UI bench with `?debug=1` and optional second drone serial port.
- [ ] Drone fast-JOIN bench: reset Drone 7 ten times and verify first JOIN averages below 500 ms after JOIN mode starts.
- [ ] Automatic MaGC rebind bench: power-cycle Drone 7 ten times with no manual bind and verify MaGC rebinds automatically.
- [ ] Reliability regression: manual bind early/middle/late JOIN, cancel during shared RX, stale assignments present, and no state flicker storm.
- [x] Inter-GC transport stress: burst MaGC commands, clear-all/requeue, bind/cancel queue, and zero malformed MaGC event output.

## Main Host Commands

```powershell
python tools\sgc_live_debug.py --telegc COM18 --duration 60 --log logs_summary\live_debug_gc.jsonl
python tools\sgc_live_debug.py --telegc COM18 --send telegc:status --send magc:status
python tools\sgc_live_debug.py --telegc COM18 --send "magc:probe 15000"
python tools\sgc_live_debug.py --drone COM13 --startup-delay 26 --send drone:status --send drone:hold
python tools\sgc_live_debug.py --telegc COM18 --drone COM22 --interactive --log logs_summary\live_debug_interactive.jsonl
python tools\sgc_live_debug.py --telegc COM18 --drone COM22 --scenario bind-from-held-drone --log logs_summary\live_debug_bind.jsonl
python tools\sgc_live_debug.py --telegc COM18 --drone COM22 --startup-delay 24 --scenario bind-from-held-drone --scenario-join-delay 13 --log logs_summary\live_debug_bind_late.jsonl
python tools\sgc_live_debug.py --telegc COM16 --drone COM13 --scenario auto-rebind-after-reset --duration 60 --log logs_summary\auto_rebind_after_reset.jsonl
python tools\analyze_live_debug_log.py logs_summary\live_debug_bind.jsonl -o logs_summary\live_debug_bind_summary.md
.\tools\ota_upload_firmware.ps1 -Hostname simple-mesh-magc -WaitForReboot
```

## Bench Expectations

- `telegc status` should return a TeleGC role-tagged ACK/status from the USB-connected device.
- `magc status` should travel through TeleGC, execute on MaGC, and return MaGC role-tagged output.
- `magc cancel` should stop an operator-requested search/bind window.
- `drone hold` should prevent automatic JOIN requests.
- `drone join-now` should send exactly one JOIN request from a held/backoff/waiting drone.
- `drone restart-join hold` should clear assignment/runtime state and remain held on the shared-channel JOIN path.
- `drone reboot hold` should soft reboot the ESP32 and report held JOIN mode before any automatic JOIN.
- A normal drone boot should schedule its first JOIN with a `first_fast` 100-500 ms backoff once LoRa JOIN mode is active.
- Later JOIN retries should use the normal 1-5 second randomized backoff.
- MaGC should automatically enter shared RX after likely assigned-link recovery failure and should not require the operator to click `bind` for Drone 7 power-cycle recovery.
- `gc_status.autoSharedRxActive`, `autoSharedRxNodeId`, `autoSharedRxRemainingMs`, and `autoSharedRxReason` should explain automatic rebind state.

## Bench Run 2026-06-19

- [x] Built generic `seeed-xiao-s3` firmware.
- [x] OTA uploaded final firmware to MaGC, TeleGC, and bridge.
- [x] USB firmware-only flashed drone node 7 on `COM13` after LAN OTA discovery failed.
- [x] Confirmed bridge receiver on `COM4` returns `get_status`.
- [x] Confirmed drone `get_status` and `debug_join_control joinMode:"hold"` on `COM13`.
- [x] Confirmed held drone sends exactly one forced JOIN on `debug_send_join_request`.
- [x] Confirmed `debug_restart_join hold` clears runtime state and remains held.
- [x] Fixed and confirmed `debug_reboot bootJoinMode:"hold"` persists across soft reboot before automatic JOIN.
- [x] Confirmed SGC `?debug=1` renders the debug drawer in Chrome with no console warnings/errors.
- [x] Confirmed TeleGC on `COM16` can return TeleGC status and MaGC status through TeleGC USB.
- [x] Confirmed MaGC `start_search` and `cancel_search` ACK through TeleGC USB when commands are spaced.
- [x] Captured stale persisted assignment flicker before cleanup: `nodeId:6` and `nodeId:7` rapidly alternate `locking`/`offline` when their persisted assignments exist but no telemetry is present.
- [x] Confirmed `magc clear-all` clears MaGC persisted assignments and TeleGC later mirrors `assignments: []`; its ACK can be delayed/lost because the command runs a blocking rescan before ACK.
- [x] Confirmed `magc probe 15000` plus held drone `join-now` binds node 7 successfully: MaGC saw `packetsSeen:1`, `joinRequestsSeen:1`, assigned channel 49 / `927 MHz`, TeleGC received live `drone_telemetry`, and the drone entered `assigned_telemetry`.
- [x] Fixed normal MaGC `start_search`/`magc bind` to stay in a continuous operator shared-RX lock instead of short shared-listen slices.
- [x] Fixed persisted assignment startup semantics so boot-loaded assignments are `bootUnverified` hints, emit one stable `offline` status when unseen, and no longer flicker rapidly between `locking` and `offline`.
- [x] Confirmed normal operator-search bind with held drone early in the search window: `operator_search_fix_bind_normal_v4.jsonl` / summary show `join_request_received`, `assign_sent`, `join_ack_received`, `telemetry_period_locked`, 200 telemetry rows, and no rapid state flicker.
- [x] Confirmed normal operator-search bind with held drone in the middle of the search window using `--scenario-join-delay 7`: `operator_search_fix_bind_normal_middle_v2.jsonl` / summary show one JOIN inside the operator shared-RX GC window, telemetry lock, 164 telemetry rows, and no rapid state flicker.
- [x] Confirmed normal operator-search bind with held drone late in the search window using `--scenario-join-delay 13`: `operator_search_fix_bind_normal_late_v1.jsonl` / summary show one JOIN inside the operator shared-RX GC window, telemetry lock, 99 telemetry rows, and no rapid state flicker.
- [ ] Mid-window `magc cancel` is not yet instantaneous during the continuous MaGC operator shared-RX lock; expect cancellation to take effect after JOIN handling or search timeout.
- [ ] SGC `?debug=1` UI was not rerun after the MaGC bind reliability firmware change.

## Fast Auto-Rebind Implementation 2026-06-19

- [x] Implemented drone first-JOIN fast backoff (`100-500 ms`) with up to three fast LBT/TX retry attempts before returning to normal retry timing.
- [x] Implemented drone JOIN debug reporting for attempt count, backoff kind, backoff duration, and LBT/TX failure counters.
- [x] Moved live-position drone LoRa JOIN startup ahead of Web OTA and FC/MSP readiness blocking paths.
- [x] Implemented MaGC automatic shared-RX rejoin windows after assigned-channel recovery failure or lost-link state.
- [x] Made automatic shared RX use the same shared-channel JOIN handler and telemetry-lock continuation as manual bind.
- [x] Updated TeleGC-to-MaGC forwarded commands to use reliable UART frames and MaGC command dedupe.
- [x] Updated SGC debug UI state and diagnostics for automatic shared RX.
- [x] Added `sgc_live_debug.py --scenario auto-rebind-after-reset` for no-manual-bind bench capture.
- [x] Updated log analyzer summaries for automatic shared-RX coverage.
- [x] OTA flashed MaGC and TeleGC with the final automatic shared-RX firmware; flashed Drone 7 over `COM13` with the fast first-JOIN firmware.
- [x] Captured one successful no-manual-bind automatic rebind in `logs_summary/auto_rebind_after_reset_v4.jsonl`; MaGC entered automatic shared RX, heard Drone 7 JOIN, sent assignment, received JOIN ACK, and later telemetry locked.
- [ ] Run 10-cycle Drone 7 automatic power-cycle/rebind bench with no manual bind.
- [ ] Run SGC `?debug=1` UI validation against the new automatic rebind events.

## Zero-Gap Post-Bind Telemetry Implementation 2026-06-20

- [x] Implemented drone post-assignment first-telemetry burst: first three assigned telemetry packets skip blocking MSP refresh and use cached telemetry.
- [x] Added drone debug events for `first_assigned_telemetry_tx` and `post_assign_burst_tx`.
- [x] Strengthened GC post-ACK lock into a 3 second post-bind acquire window with an 800 ms minimum assigned-channel listen.
- [x] Added compact post-bind acquire events: `post_bind_acquire_started`, `post_bind_first_telemetry`, and `post_bind_acquire_timeout`.
- [x] Added immediate MaGC-to-TeleGC `assignment_upsert` for fresh post-bind assignments, with normal assignment snapshots still following as fallback.
- [x] Added normal-bind `assignment_timing_hint` after MaGC telemetry timing lock.
- [x] Updated SGC binding display so MaGC timing/bind progress does not complete the visible bind before local TeleGC `drone_telemetry`.
- [x] Updated SGC terminal link-state handling so stale `offline` cannot clear an active bind/acquire state.
- [x] Updated `sgc_live_debug.py --scenario auto-rebind-after-reset` to mark/fail post-bind telemetry latency above 3 seconds.
- [x] Updated `analyze_live_debug_log.py` with post-bind telemetry latency summary.
- [x] Static checks passed: `pio run -e seeed-xiao-s3`, `node --check script.js`, and Python compile for debug tools.
- [x] Rendered `http://localhost:8000/?debug=1` in Chrome: map/canvas, live drones panel, and debug controls loaded with no startup console errors.
- [x] Fixed drone live loop so Web OTA auto-start cannot block first assigned telemetry; drone Web OTA is not auto-started during live radio operation.
- [x] Fixed GC link-state expiry so a recent telemetry packet suppresses false `offline` link status during timing/acquire windows.
- [x] OTA flashed MaGC and TeleGC with zero-gap/no-flicker firmware.
- [x] Flashed Drone 7 over `COM13` with zero-gap/no-OTA-block firmware.
- [x] Ran `auto-rebind-after-reset` and confirmed `join_ack_received -> first TeleGC drone_telemetry <= 3s`.
- [x] Captured final passing bench in `logs_summary/zero_gap_auto_rebind_no_flicker_20260620.jsonl` / summary: ACK-to-telemetry `0.014s`, assigned-to-telemetry `0.174s`, drone assignment-to-first-TX `25ms`, no post-bind acquire timeout, and no rapid state flicker.
- [ ] Run SGC `?debug=1` UX check and confirm no `OFFLINE` gap during bind/acquire.
- [ ] Run 10-cycle power/reset timing bench.

## Drone-Side Lost-Packet Simulation 2026-06-20

- [x] Added `debug_drop_telemetry` with `cycles` to skip a bounded number of assigned telemetry transmissions without clearing assignment or rebooting.
- [x] Added `debug_simulate_rf_loss` with `cycles` to consume assigned telemetry sequence IDs and TX counters while suppressing RF delivery, so TeleGC sees a sequence gap.
- [x] Added drone debug status/event fields: `telemetryDropRemaining` and `telemetryDropTotalCount`.
- [x] Added drone debug status/event fields: `telemetryRfLossRemaining` and `telemetryRfLossTotalCount`.
- [x] Added `drone rf-loss [cycles]` and `drone drop-silent [cycles]` to `tools/sgc_live_debug.py`.
- [x] Added SGC debug drawer buttons `RF Loss 2` and `Drop 2 Cycles`.
- [x] Updated `analyze_live_debug_log.py` to summarize simulated RF-loss events and observed telemetry sequence gaps.
- [x] Flashed Drone 7 over `COM13` and bench-tested `drone drop 2` with TeleGC on `COM16`.
- [x] Captured `logs_summary/drone_drop_2_cycles_assigned_20260620.jsonl` / summary: command accepted, exactly two `telemetry_cycle_dropped` events emitted, TeleGC observed a 300 ms telemetry gap around the drop, and no non-online link status appeared after the drone was online.
- [x] Flashed Drone 7 over `COM13` and bench-tested `drone rf-loss 2` with TeleGC on `COM16`.
- [x] Captured final race-fixed RF-loss bench in `logs_summary/drone_rf_loss_2_cycles_racefix_20260620.jsonl` / summary: command accepted, drone simulated RF loss for sequence IDs `122` and `123`, TeleGC jumped from sequence `121` to `124`, and no non-online link status appeared after the drone was online.

## Short-Loss Continuity Guard 2026-06-20

- [x] Added GC short-loss guard constants so the assigned-channel path absorbs up to 8 missed telemetry packets before escalating to shared-channel rebind or assisted recovery.
- [x] Added `short_loss_guard` scanner candidate priority so MaGC/TeleGC keep listening on the assigned channel during short RF-loss bursts.
- [x] Added `telemetry_rebind_event` entries for `short_loss_guard_started`, `short_loss_guard_active`, `short_loss_recovered`, and `short_loss_guard_expired`.
- [x] Added GC status fields: `shortLossGuardActive`, `shortLossGuardNodeId`, `shortLossGuardMissCount`, and `shortLossGuardRemainingMs`.
- [x] Updated SGC debug display/logging so short-loss continuity is shown separately from assisted/shared-channel rebind.
- [x] Updated `run_rf_loss_bench.py` to report observed missing packet count and extra missing packet count.
- [x] Updated `analyze_live_debug_log.py` to summarize short-loss guard events and RF-loss bench batches.
- [x] Static checks passed after short-loss guard changes: `pio run -e seeed-xiao-s3`, `node --check script.js`, and Python compile for debug tools.
- [x] OTA flashed MaGC and TeleGC with the short-loss guard build; Drone 7 was refreshed over `COM13` before the 40-test bench.
- [x] Ran 40-test RF-loss bench for 2, 3, 4, and 5 skipped transmitted packets.
- [x] Ran one post-final-OTA smoke trial: 1/1 continuity pass, zero non-online link events, and zero post-simulation extra loss.
- [ ] Acceptance: 40/40 telemetry continuity and zero visible non-online link states passed. The latest coverage-fixed bench removed steady baseline gaps, but RF-loss command timing can still create an occasional one-packet boundary extra gap; tighten the bench trigger before requiring exact missing-ID equality.

## Baseline TeleGC Assigned-Channel Coverage 2026-06-20

- [x] Added TeleGC assigned-RX coverage counters to `gc_status`: coverage mode, packet count, sequence-gap count, missing sequence IDs, max gap, slot misses, non-assigned preemptions, next assigned slack, and last preemption reason.
- [x] Made TeleGC telemetry-first behavior explicit so bridge/backhaul/background paths cannot preempt assigned-channel receive while TeleGC has active assignments.
- [x] Suppressed MaGC background `channel_scan_event` and non-critical `orphan_recovery_event` forwarding through TeleGC while active assignments exist, reducing USB/debug chatter during assigned receive.
- [x] Added `tools\measure_telemetry_coverage.py` to capture warmup-filtered TeleGC sequence coverage and write Markdown summaries.
- [x] Updated SGC diagnostics/debug status display with TeleGC coverage fields.
- [x] Updated analyzer output with a Telemetry Coverage section from `gc_status`.
- [x] Changed normal assigned telemetry baseline to 200 ms / 5 Hz, matching the branch 2-5 Hz goal and reducing receiver pressure from the previous ~100 ms stream.
- [x] Added timing-inference guard so a single long startup interval cannot lock a bogus steady period.
- [x] Added persisted-assignment timing invalidation for profile-impossible periods, so stale values such as `txPeriodMs:1190` are reacquired after reboot.
- [x] Static checks passed after the coverage/timing changes: `pio run -e seeed-xiao-s3`, `node --check script.js`, and Python compile for debug tools.
- [x] OTA flashed MaGC and TeleGC with the coverage/timing build; flashed Drone 7 over `COM13` with the same build.
- [x] Ran steady TeleGC coverage bench: `logs_summary\telemetry_coverage_75s_200ms_guarded_20260620.jsonl` / summary showed 301 warmup-filtered telemetry rows, 0 sequence gaps, 0 missing sequence IDs, 0 non-online link events, 0 non-assigned preemptions, and average interval 203 ms.
- [x] Ran 40-trial RF-loss regression after the coverage fix: `logs_summary\rf_loss_bench_40_after_coverage_20260620.jsonl` / summary showed 10/10 pass for 2, 3, 4, and 5 simulated lost packets, 0 non-online link events, and 0 full rebind trials.
- [ ] Tighten RF-loss bench command timing so the observed missing IDs exactly match the commanded loss count without the occasional one-packet command-boundary extra gap.

## CAD Validation And Fast OOCR Recovery 2026-06-20

- [x] Added repeated CAD validation before a channel/profile becomes `cad_suspect`: 3 samples, 2 required hits, 20 ms repeat gap, and 12 ms scan retune settle.
- [x] Added CAD evidence fields to scan output: `cadSampleCount`, `cadHitCount`, `cadValidated`, `cadRejected`, and `cadAgeMs`.
- [x] Changed one-hit CAD detections into rejected hints that do not become sticky spectrum state or OOCR recovery input.
- [x] Added volatile recently-cleared assignment hints before `clear_all_assignments` empties RAM/LittleFS, with a 120 second TTL and no operator-visible assignment.
- [x] Replaced MaGC background OOCR single pending candidate with a ranked queue and adaptive fast/no-assignment timing.
- [x] Kept restoration strict: only decoded telemetry plus second-packet period inference recreates an assignment.
- [x] Updated SGC spectrum rendering so CAD is low-confidence `cad-suspect`, expires after 5 seconds, and is cleared by later free scans.
- [x] Updated analyzer output with CAD sample/reject/validate counts, OOCR queue/confirmation summaries, and reset-to-orphan telemetry timing.
- [x] Static checks passed: `pio run -e seeed-xiao-s3`, `node --check script.js`, and `python tools\analyze_live_debug_log.py --help`.
- [ ] CAD false-positive bench: Drone 7 off, 60 second MaGC/TeleGC capture, verify one-hit CAD events are rejected and SGC does not accumulate persistent yellow bars.
- [ ] Reset rediscovery bench: clear assignments while Drone 7 keeps transmitting, verify no drones shown immediately, then decoded telemetry restores Drone 7 within the target window.
- [ ] Cold OOCR bench: empty `/live_assignments.json`, no recent hints, Drone 7 already transmitting assigned telemetry, verify recovery with fewer false confirmations.
- [ ] Regression: manual bind, automatic shared-channel rebind, and active telemetry links remain stable.

## Empty-Assignment Shared Discovery 2026-06-20

- [x] Added MaGC empty-assignment shared RX mode so an empty assignment table immediately prioritizes shared-channel JOIN discovery.
- [x] Deferred MaGC background OOCR during the strong empty-shared RX window and allowed only periodic OOCR slices after the shared channel has had priority.
- [x] Changed `clear_all_assignments` to clear RAM/LittleFS and ACK immediately instead of blocking on a full channel rescan before shared listening.
- [x] Added empty-shared RX status fields to `gc_status`: `emptySharedRxActive`, `emptySharedRxStrongRemainingMs`, poll/no-packet/join counters, OOCR defer count, and reason.
- [x] Added `empty_shared_rx_*` search/scanner events and analyzer summaries.
- [x] Added `sgc_live_debug.py --scenario magc-clear-then-drone-auto-join` for the exact reset-then-drone-power-on bench without manual `magc bind`.
- [x] Updated SGC debug status display with `Empty RX`.
- [x] Static checks after this change: `pio run -e seeed-xiao-s3`, `node --check script.js`, and Python tool compile/help.
- [x] OTA flash MaGC and TeleGC with this build.
- [x] Bench: clear MaGC, reboot Drone 7 in auto JOIN mode, and verify reset-to-MaGC 0% is within the target window without manual bind. Final log: `logs_summary\magc_clear_then_drone_auto_join_final_20260620.jsonl`; reset-to-JOIN-mode 2.618s, reset-to-first-JOIN-TX 4.254s, reset-to-MaGC-0% 4.307s, reset-to-first-TeleGC-telemetry 9.407s.

## Drone Wi-Fi Debug Control 2026-06-20

- [x] Added drone Web OTA/debug endpoints: `GET /debug/status` and `POST /debug/command`.
- [x] Reused the existing USB drone debug command parser for Wi-Fi commands.
- [x] Added a bounded HTTP-to-drone-loop queue so Wi-Fi handlers do not mutate `DroneRuntime` or LoRa state directly.
- [x] Added a low-priority Web OTA/debug background task for drone live mode; LoRa JOIN starts before Wi-Fi service initialization.
- [x] Added CORS headers so SGC served from `localhost` can call drone debug endpoints.
- [x] Added `tools\drone_wifi_debug.py` for remote bench commands over `simple-mesh-7.local:8080`.
- [x] Added SGC debug drawer controls for a Wi-Fi drone host/IP.
- [x] Updated `AGENTS.md` with the Wi-Fi debug workflow.
- [x] Static checks passed: `pio run -e seeed-xiao-s3`, `node --check script.js`, `python tools\drone_wifi_debug.py --help`, and Python compile for debug tools.
- [x] Flash Drone 7 and verify `http://simple-mesh-7.local:8080/debug/status`.
  - 2026-06-20: Drone 7 was flashed over `COM13` and `/wifi_ota.json` was reprovisioned over USB. LoRa JOIN and assigned telemetry remained healthy while the background Wi-Fi service ran, but Drone 7 still timed out joining SSID `Don't Forget` and fell back to AP `simple-mesh-7` at `192.168.4.1`, so LAN `/debug/status` remains unverified.
  - 2026-06-20 after adding the 2.4 GHz antenna: Drone 7 joined the LAN as `simple-mesh-7` at `192.168.68.100`, `/ota_status` reported `transport:"sta"`, `droneDebug:true`, RSSI `-55`, channel `2`, and `tools\drone_wifi_debug.py --host simple-mesh-7.local status` returned drone status over Wi-Fi.
- [ ] Bench Wi-Fi `rf-loss 2`, `drop-silent 2`, `hold`, `join-now`, and `reboot hold`.
  - 2026-06-20: Smoke-tested `rf-loss 1` over Wi-Fi; command ACK was accepted and `telemetry_rf_loss_started` was emitted while Drone 7 was in `assigned_telemetry`.
- [ ] Confirm Wi-Fi debug enabled does not regress reset-to-JOIN or steady TeleGC coverage.

## Split-GC Wi-Fi Debug 2026-06-25

- [x] Generalized the Web OTA/debug HTTP queue so split-GC roles can use the same `/debug/status` and `/debug/command` NDJSON endpoints as drones.
- [x] Started MaGC and TeleGC Web OTA/debug service from the low-priority background task so HTTP commands can wait while the main loop drains the command queue safely.
- [x] Added `processGcWifiCommands()` so MaGC/TeleGC Wi-Fi commands reuse the existing GC serial command parser and `gc_status` output.
- [x] OTA flashed MaGC `192.168.68.101` and TeleGC `192.168.68.100` with the split-GC Wi-Fi debug build.
- [x] Verified MaGC Wi-Fi `get_status` returns `sourceRole:"magic_ground_control"` and MaGC shared-owner/bridge diagnostics.
- [x] Verified TeleGC Wi-Fi `get_status` returns receiver-budget diagnostics needed to debug offline/stale node servicing.
  - 2026-06-25: Binding/servicing evidence showed node 2 recovered after temporary `knownPhase:false` acquisition, while node 6 was still transmitting assigned telemetry on Wi-Fi but TeleGC kept it `knownPhase:false` / `lastRxAgeMs:-1`; `lastRecoveryBudgetDeniedNodeId:6`, `lastHealthyProtectedNodeId:7`, and rising `healthyServiceProtectedCount` point to receiver recovery fairness/starvation, not a MaGC JOIN failure.

## Multi-Drone Safe Rollout 2026-06-20

- [x] Added `tools\drone_safe_rollout.py` to audit one USB-connected drone before firmware rollout.
- [x] Rollout helper verifies loaded drone identity from USB status, refuses `--flash` without `--expected-node-id`, uses firmware-only flashing, and re-audits after flashing.
- [x] Ran audit-only workflow on current Drone 7 at `COM13`: observed `nodeId:7`, `Node Role: drone`, `sourceRole:"drone"`, Wi-Fi STA at `192.168.68.100`, `droneDebug:true`, and assigned telemetry.
- [x] Added read-only LittleFS inspection commands: `get_config` returns raw `/config.json` plus redacted `/wifi_ota.json`; `get_files` lists LittleFS files.
- [x] Updated `tools\drone_wifi_debug.py`, `tools\sgc_live_debug.py`, and `tools\drone_safe_rollout.py` to use `config` / `files` commands.
- [x] Ran `tools\drone_safe_rollout.py --port COM13 --expected-node-id 7 --flash`; firmware-only flash preserved LittleFS and post-flash audit showed `/config.json` with `node_id:7`, `node_role:"drone"`, `/wifi_ota.json` present/redacted, and files `config.json`, `wifi_ota.json`.
- [x] Verified Wi-Fi `config` and `files` commands on `simple-mesh-7.local`.
- [x] Ran DSR workflow on a newly connected unknown drone at `COM11`: discovered `node_id:6`, firmware-only flashed it, detected missing `/wifi_ota.json` and stale LoRa config, provisioned LittleFS with `tools\provision_node.ps1 -Role drone -NodeId 6 -ConfigOnly`, and verified `simple-mesh-6.local` status/config over Wi-Fi.
- [x] Ran DSR workflow on a newly connected unknown drone at `COM15`: discovered `node_id:2`, firmware-only flashed it, detected missing `/wifi_ota.json` and stale LoRa config, provisioned LittleFS with `tools\provision_node.ps1 -Role drone -NodeId 2 -ConfigOnly`, and verified `simple-mesh-2.local` status/config/files over Wi-Fi.
- [x] Ran DSR workflow on a newly connected unknown drone at `COM7`: discovered `node_id:3`, firmware-only flashed it, detected missing `/wifi_ota.json` and stale LoRa config, provisioned LittleFS with `tools\provision_node.ps1 -Role drone -NodeId 3 -ConfigOnly`, and verified `simple-mesh-3.local` status/config/files over Wi-Fi.
- [ ] Repeat safe audit/flash workflow for each additional drone before multi-drone stress testing.

## Inter-GC Command Queue And Clean Event Transport 2026-06-21

- [x] Added a bounded reliable FIFO in `LinkState` so TeleGC queues MaGC-targeted SGC commands instead of rejecting them when one reliable frame is already in flight.
- [x] Preserved real MaGC ACK semantics: queued MaGC commands produce an `inter_gc_command_queued` debug event first, then the real MaGC `command_ack` after MaGC executes the command.
- [x] Added command-specific MaGC ACK timeout reporting with `reason:"magc_ack_timeout"`.
- [x] Routed MaGC live/debug event output through a single Inter-GC event outbox so best-effort event lines do not interleave with reliable frames.
- [x] Added event outbox priority/drop/coalescing/compaction counters to `inter_gc_status`.
- [x] Added compact forwarding for large MaGC command result bodies such as `assignments` and `channel_table`; assignment sync remains the source of truth.
- [x] Added USB command line queuing on TeleGC so a scripted burst is drained before forwarding work blocks the USB reader.
- [x] Added `sgc_live_debug.py --send-interval-ms`; scripted sends default to 50 ms pacing, with `0` reserved for raw USB burst abuse tests.
- [x] Added analyzer reporting for command ACK coverage, queued command events, duplicate ACKs, rejected reasons, malformed JSON payloads, suspicious JSON fragments, queue depths, and event outbox drops.
- [x] Static checks passed after transport changes: `pio run -e seeed-xiao-s3`, `node --check script.js`, `python tools\sgc_live_debug.py --help`, and `python tools\analyze_live_debug_log.py --help`.
- [x] OTA flashed MaGC and TeleGC with the transport build.
- [x] Status smoke passed: `logs_summary\intergc_s00_status_smoke_stackfix_20260621.jsonl` / summary showed 2/2 command ACKs, 0 duplicate ACKs, 0 malformed JSON, and no queue drops/timeouts.
- [x] MaGC command burst passed: `logs_summary\intergc_s01_magc_burst_compactbody_20260621.jsonl` / summary showed 7/7 command ACKs, 6 queued command events, max reliable queue depth 3, 0 duplicate ACKs, 0 malformed JSON, 0 suspicious fragments, and no drops/timeouts.
- [x] Bind/cancel queue passed: `logs_summary\intergc_s02_bind_cancel_queue_20260621.jsonl` / summary showed 5/5 command ACKs, 5 queued command events, 0 duplicate ACKs, 0 malformed JSON, and no fragments.
- [x] Clear-all/requeue transport path passed before session cutoff: `logs_summary\intergc_s03_clearall_requeue_20260621.jsonl` / summary showed 5/5 command ACKs, 5 queued command events, 0 duplicate ACKs, 0 malformed JSON, and no fragments.
- [x] Post-cutoff status resume passed: `logs_summary\intergc_s04_post_cutoff_status_20260621.jsonl` / summary showed 2/2 command ACKs, one queued MaGC command, ACK latency max 171 ms, 0 malformed JSON, 0 suspicious fragments, and no drops/timeouts.
- [x] Clear-all/requeue lifecycle tail: reran with drones controlled over Wi-Fi debug; MaGC cleared assignments, drones rebooted into auto JOIN, and both nodes rejoined.
- [x] Two-drone reset/rejoin transport stress with remote drone control: discovered node 3 at `192.168.68.107` and node 6 at `192.168.68.111` through `/ota_status`, controlled both through `/debug/command`, and captured final passing transport log `logs_summary\intergc_s09_two_drone_wifi_clear_rejoin_uartbuf_20260621.jsonl`.
- [x] Fixed two-drone Inter-GC event corruption found during Wi-Fi lifecycle stress by compacting reliable assignment sync, prioritizing reliable assignment sync ahead of best-effort event output, suppressing MaGC `*_active` search/scanner event chatter, compacting MaGC assignment/bind/rebind event output, and increasing split-GC `Serial1` buffers to RX 8192 / TX 2048 bytes.
- [x] Final two-drone transport acceptance: `logs_summary\intergc_s09_two_drone_wifi_clear_rejoin_uartbuf_20260621_summary.md` showed 2/2 command ACKs, 0 rejected, 0 queue drops/timeouts, 0 malformed RX JSON payload lines, and 0 suspicious JSON fragment lines.
- [x] Implemented owed-packet fairness scheduler for overlapping assigned-channel receive windows: scheduler-caused skips emit `rx_candidate_skipped`, add bounded owed credit, and prefer owed drones on the next catchable cycle.
- [x] Added fairness fields to `gc_status` and scanner diagnostics: `owedRxActive`, `owedRxNodeId`, `owedRxCount`, `fairnessSkipCount`, `fairnessOwedSelectedCount`, `fairnessOwedMissedCount`, and `maxConsecutiveSchedulerSkips`.
- [x] Added one-shot drone `debug_delay_next_telemetry` / `delay-next` command for phase disturbance and short-loss guard bench tests without consuming a sequence ID.
- [x] Updated SGC debug drawer, Wi-Fi/USB debug tools, coverage summaries, and analyzer output for owed-packet fairness events.
- [x] Added defensive owed-priority score math: cap skip-derived score bonus, normalize candidate age against the current conflict-set baseline, and clamp final priority score to `int32_t`.
- [x] Follow-up bench after priority score bounding: OTA flashed MaGC/TeleGC, reran two-drone assigned coverage for node 6 and node 3, and captured `logs_summary\score_normalized_coverage_node6_20260621_summary.md` plus `logs_summary\score_normalized_coverage_node3_20260621_summary.md`; both had 0 non-online link events, 0 non-assigned preemptions, and bounded scheduler skips (`maxConsecutiveSchedulerSkips <= 1`). Node 6 still showed four single-packet warmup-filtered sequence gaps in 60s, so RF/slot loss is not yet perfect.
- [x] Added deterministic forced-overlap debug interfaces: drone `debug_schedule_next_telemetry` schedules a future assigned telemetry target, and TeleGC `debug_schedule_assignment_overlap` updates volatile assignment TST predictions without writing `/live_assignments.json`.
- [x] Added `tools\run_forced_overlap_bench.py` to calibrate TeleGC/drone clocks, schedule two drones into the same receiver conflict window, capture JSONL evidence, and summarize pass/fail by trial.
- [x] Updated `analyze_live_debug_log.py` and `AGENTS.md` for forced-overlap trial summaries and the new rule that `delay-next` is not the deterministic owed-overlap trigger.
- [x] Deterministic forced-overlap bench: run `tools\run_forced_overlap_bench.py` with node 3 and node 6 and verify `rx_candidate_skipped -> owed_rx_selected -> owed_rx_cleared`, no `owed_rx_missed`, no non-online link events after warmup, and score fields on `owed_rx_selected`.
  - 2026-06-21: After adding temporary TeleGC debug timing uncertainty for forced-overlap schedules, `logs_summary\forced_overlap_bench_v4_20260621_summary.md` passed 5/5 trials with alternating `[0,20]` / `[20,0]` offsets, max consecutive scheduler skips `1`, no rejected commands, no `owed_rx_missed`, and no non-online link events. Post-bench coverage `logs_summary\forced_overlap_post_coverage_node3_20260621_summary.md` showed no non-online link events, no owed misses, max scheduler skips `1`, and `nonAssignedPreemptions: 0`.

## Two-Drone Startup And Broken-Link Stress 2026-06-21

- [x] Added `tools\run_multi_drone_stress.py` for Wi-Fi-controlled multi-drone startup/rebind stress through one TeleGC USB serial connection.
- [x] The runner clears MaGC assignments, restarts all listed drones into shared-channel auto JOIN, waits for TeleGC telemetry from all nodes, then runs sequential target-drone `rf-loss` plus `restart-join auto` recovery tests.
- [x] The runner writes a JSONL evidence log and Markdown summary with startup bind timing, broken-link recovery timing, non-target stability, and Inter-GC transport health.
- [x] Static checks passed: `python -m py_compile tools\run_multi_drone_stress.py`, `python tools\run_multi_drone_stress.py --help`, and `python tools\analyze_live_debug_log.py --help`.
- [x] Added drone JOIN LBT debug visibility and bounded fallback: `drone_debug_status` now exposes JOIN LBT fail/bypass counters, and after repeated JOIN LBT blocks the drone emits `join_request_lbt_bypass` and sends one JOIN so a rejoin cannot stall forever behind local channel sensing.
- [x] Strengthened MaGC automatic shared-RX recovery for multi-drone loss: MaGC now scans all assignments for auto-shared-RX candidates and can service auto shared RX for a lost node even while another assigned drone has short-loss guard activity.
- [x] OTA flashed updated firmware to drone 3 (`192.168.68.107`), drone 6 (`192.168.68.111`), MaGC (`192.168.68.101`), and TeleGC (`192.168.68.106`) before the final stress run.
- [x] Two-drone stress bench: node 3 at `192.168.68.107`, node 6 at `192.168.68.111`, TeleGC on `COM16`, loss cycles `9`, and final summary reports `READY FOR 4 DRONES`.
  - 2026-06-21 final run: `logs_summary\multi_drone_stress_2node_v4_autoshared_20260621_summary.md` passed. Startup first TeleGC telemetry was node 3 `14005.1 ms` and node 6 `7827.7 ms`. Broken-link recovery passed for node 3 with restart-to-telemetry `5092.9 ms` and non-target node 6 max gap `2525.0 ms`; node 6 passed with restart-to-telemetry `11674.7 ms` and non-target node 3 max gap `2717.2 ms`. Transport health was clean: `11/11` command ACKs, zero rejected commands, zero MaGC ACK timeouts, zero Inter-GC forward failures, zero malformed serial JSON, zero suspicious fragments, and zero queue/outbox drops.
  - Follow-up analyzer output is `logs_summary\multi_drone_stress_2node_v4_autoshared_20260621_analyzed.md`. It showed fast post-bind telemetry latencies (`join_ack_received -> first TeleGC drone_telemetry` around `0.12-0.22 s`) and no transport corruption. Residual item before/while scaling: target-node recovery can still take about `12 s` in this stress path, so four-drone testing should watch recovery latency and owed-packet counters, not only pass/fail.

## Four-Drone Fleet Stress 2026-06-21

- [x] Added Wi-Fi retry handling to `tools\run_multi_drone_stress.py` for safe commands (`status`, `debug_reboot`, and `debug_restart_join`) so a transient HTTP timeout during reboot does not fail the fleet test before the radio path is exercised.
- [x] Added phased assignment support for multi-drone startup: drones advertise phase-slot capability, MaGC assigns initial telemetry offsets, assignment sync mirrors phase metadata to TeleGC, and drones keep the assigned phased period instead of dropping back to the old 200 ms default.
- [x] Added MaGC missing-recent-clear-hint shared RX renewal so `clear_all_assignments` keeps listening on the shared channel until all recently-cleared drones have had a chance to rejoin, even after the first subset of drones has already bound.
- [x] Added TeleGC first-telemetry acquisition priority for freshly assigned nodes with no local telemetry yet.
- [x] Static firmware build passed after the four-drone fixes: `pio run -e seeed-xiao-s3`.
- [x] OTA flashed MaGC (`192.168.68.101`), TeleGC (`192.168.68.106`), and the reachable drones used in the fleet bench as needed during the fix/test loop.
- [x] Four-drone stress command used TeleGC `COM16` and Wi-Fi nodes: node 2 `192.168.68.112`, node 3 `192.168.68.107`, node 6 `192.168.68.111`, node 7 `192.168.68.100`.
- [x] Latest valid four-drone startup run: `logs_summary\multi_drone_stress_4node_phase_slots_v8_firstacq_20260621_summary.md` / `logs_summary\multi_drone_stress_4node_phase_slots_v8_firstacq_20260621_analyzed.md`.
  - Transport passed: `11/11` command ACKs, zero rejected commands, zero MaGC ACK timeouts, zero Inter-GC forward failures, zero malformed serial JSON, zero suspicious JSON fragments, and zero queue/outbox drops.
  - MaGC bound all four nodes: node 2, 3, 6, and 7 each reached `join_request_received`, `assign_sent`, `join_ack_received`, and `assignment_completed`.
  - TeleGC received first telemetry for node 6 at `17621.2 ms`, node 7 at `22212.0 ms`, and node 3 at `30629.4 ms`.
  - Node 2 failed the fleet startup acceptance: MaGC completed bind, but TeleGC never received local `drone_telemetry` before timeout. Analyzer showed node 2 with repeated `post_bind_acquire_timeout` events.
  - Node 2 direct Wi-Fi debug still reported `assigned_telemetry` and the corrected `txPeriodMs:250`, so the immediate failure is not drone runtime state or Inter-GC command transport.
  - Node 2 radio evidence was weak in the successful bind path (`rssi` around `-101 dBm`, `snr` around `-4.75` to `-10.75 dB` in captured MaGC events), unlike the other drones. Treat this as a node-2 RF/antenna/placement/hardware suspect before assuming another shared-channel software bug.
- [ ] Four-drone broken-link stages are still unchecked because startup did not pass for all four nodes.
- [ ] Software hardening follow-up: a node that binds but never yields first TeleGC telemetry must not poison known-phase fairness indefinitely. Cap stored `consecutive_scheduler_skips` and quarantine/rehunt first-telemetry failures after `GC_FIRST_TELEMETRY_ACQUIRE_PRIORITY_MISSES` instead of letting owed-packet counters spiral.
- [ ] Bench follow-up: move or inspect node 2 antenna/radio path, run a single-node node 2 close-range bind/coverage capture, then rerun the four-drone fleet stress before moving on to four-drone broken-link recovery.

## Non-Disruptive Bind And Auto Rejoin Abuse 2026-06-21

- [x] Changed `start_search` behavior for MaGC with active assignments: it now starts a safe operator discovery lease instead of the old blocking operator shared-RX search.
- [x] Kept strong continuous shared-RX bind for the no-assignment case.
- [x] Added safe shared-RX chunking for automatic lost-drone shared rejoin; MaGC only borrows shared RX when post-bind acquire, timing acquire, short-loss guard, and near assigned slots are not due.
- [x] Decoupled MaGC shared-rejoin intent from the full short-loss threshold: MaGC can decide a missing node might be on shared after a couple of missed assigned probes, while safe-slice guards prevent disruption during short-loss continuity.
- [x] Changed `cancel_search` to cancel operator-requested discovery/search without cancelling automatic lost-drone rejoin.
- [x] Added `operatorDiscovery*` fields to `gc_status` and SGC debug/status rendering.
- [x] Fixed SGC state precedence so recent TeleGC telemetry wins over any terminal `drone_link_status`; ignored terminal statuses are logged as `terminal_link_status_ignored_recent_telemetry`.
- [x] Fixed bridge-originated `START_SEARCH` so it uses safe operator discovery when assignments exist instead of the old blocking shared-RX search.
- [x] Fixed MaGC shared-rejoin priority so it renews the matching auto shared-RX lease while the lost-drone recovery remains active, and clears only when that recovery state is explicitly resolved/removed.
- [x] Fixed MaGC shared-RX dwell starvation from bridge fallback: extended JOIN airtime now sizes the shared dwell, MaGC-owned discovery no longer relies on 75 ms LoRa receive windows, and LoRa bridge fallback waits until the active shared dwell ends while ESP-NOW continues during RX.
- [x] Fixed the active-assignment variant of shared JOIN starvation: MaGC auto/operator discovery now uses a dedicated continuous `1200 ms` JOIN dwell and does not cut it short for assigned-slot slack; the `75 ms` constant remains only a short non-JOIN borrow chunk.
- [x] Fixed automatic lost assigned-link recovery so MaGC tries assigned-channel recovery first (`3 * txPeriodMs + guard`), then one `6000 ms` shared JOIN fallback, then one assigned retry before `lost_link_recovery_exhausted`; TeleGC no longer parks local assigned recovery immediately after sending the assist request.
- [x] Fixed dual-GC MaGC shared-owner mode so active assignments no longer stop
  routine shared discovery. MaGC now runs repeated full shared discovery dwell
  windows while TeleGC handles assigned telemetry; `magicSharedOwner*`
  `gc_status` counters expose the behavior for bench checks.
- [x] Bench with Drone 6 intentionally powered off: after flashing MaGC/TeleGC,
  bridge USB capture `logs_summary\magc_shared_owner_drone6_off_bridge.jsonl`
  showed 100 ESP-NOW `drones_state` snapshots in about 35 seconds, nodes `2`,
  `3`, and `7` online, max per-node bridge ages under `1 s`, and no state
  flicker or terminal-state regressions.
- [ ] Direct MaGC `magicSharedOwner*` counter read remains pending until TeleGC
  or MaGC is available over USB/serial; the bridge USB path exposes bridge
  receiver status, not MaGC internal `gc_status`.
- [x] Updated `tools\run_multi_drone_stress.py` with optional abuse phases:
  - `--manual-bind-abuse` for repeated bind/cancel non-disruption testing.
  - `--rf-loss-only-cycles ...` and `--rf-loss-only-repeats ...` for Wi-Fi simulated RF-loss matrices before destructive rejoin tests.
- [x] Updated `tools\analyze_live_debug_log.py` with manual-bind, RF-loss-only, broken-link marker summaries and a `Terminal State Over Recent Telemetry` regression section.
- [x] Static checks passed: `pio run -e seeed-xiao-s3`, `node --check script.js`, `python -m py_compile tools\run_multi_drone_stress.py tools\analyze_live_debug_log.py`, `python tools\run_multi_drone_stress.py --help`, and `python tools\analyze_live_debug_log.py --help`.
- [x] OTA flashed TeleGC (`192.168.68.106`) with the final build, including the post-audit bridge-safe-bind and shared-priority-latch fixes.
- [x] OTA flashed MaGC, TeleGC, and drones 3/6/7 with the first non-disruptive bind build; node 2 was not reachable over Wi-Fi at `192.168.68.112` and `simple-mesh-2.local` was not found by subnet scan.
- [x] OTA flashed MaGC with the final scheduler/timing-hint hardening build after MaGC recovery.
  - 2026-06-22: MaGC (`192.168.68.101`) and TeleGC (`192.168.68.106`) OTA succeeded, and reachable drones 3/6/7 were OTA flashed with the same generic firmware.
- [x] Final three-node abuse bench after MaGC recovery:
  - Run three/four-node startup.
  - Run manual bind non-disruption.
  - Run RF-loss-only matrix.
  - Run sequential broken-link rejoin.
  - Required: zero non-target terminal states, clean Inter-GC transport, bounded fairness counters, and successful auto rejoin.
  - 2026-06-22: `logs_summary\20260622_receiver_budget_budgetgate1_summary.md` passed for nodes 3/6/7 on TeleGC `COM16`: startup passed for all three reachable drones, manual bind non-disruption passed, RF-loss-only cycles=4 passed for each drone, sequential broken-link rejoin passed for nodes 3/6/7, command ACK coverage was `46/46`, and there were zero rejected commands, malformed serial JSON rows, suspicious fragments, queue/outbox drops, or non-target link-state events.
- [ ] Four-node abuse bench remains open until node 2 Wi-Fi/RF reachability is healthy again.
- [x] Historical smoke result before MaGC final OTA blocker: `logs_summary\non_disruptive_bind_3node_abuse_20260621_summary.md` showed startup passed for nodes 3/6/7 and RF-loss-only passed 9/9, but manual bind still had one node-7 telemetry gap over the strict test threshold and node-7 destructive rejoin failed after scheduler fairness counters were poisoned by a stale/weak node-2 assignment. Superseded by the 2026-06-22 passing receiver-budget stress run above.

## Drone-Owned Timing And Receiver Budget Enforcement

- [x] Added a backward-compatible extended JOIN request. Legacy 5-byte JOIN requests are still accepted; new drones advertise `JOIN_CAP_DRONE_OWNED_TIMING`, requested assigned radio profile, and requested nominal telemetry period.
- [x] Stopped advertising phase-slot delay capability from the normal drone JOIN path. The phase-delay machinery remains for compatibility/debug paths, but normal reliability is no longer based on MaGC commanding exact transmit phases.
- [x] MaGC now treats the configured default assignment profile as authoritative for new assignments. Extended drone JOIN requests may advertise a requested profile for diagnostics, but drone-owned timing only controls the requested telemetry period after validation against the MaGC-selected profile. Legacy drones still use Fast fallback when they lack profile-switch or extended-period capability.
- [x] Added TeleGC receiver-budget enforcement around all acquisition/recovery candidates. Healthy assigned telemetry has a profile-aware service deadline, and recovery is denied when it would overlap or endanger that healthy service.
- [x] Added receiver-budget status fields to `gc_status`: `receiverBudgetMode`, `receiverUtilization`, `receiverOverloaded`, recovery budget counters, healthy-service protection counters, and per-node budget rows.
- [x] Added scanner events for `recovery_budget_used`, `recovery_budget_denied`, `healthy_service_protected`, `receiver_budget_overloaded`, plus `owed_service_selected` / `owed_service_cleared` aliases for the existing owed-RX behavior.
- [x] Updated `tools\analyze_live_debug_log.py`, `tools\measure_telemetry_coverage.py`, and `tools\run_multi_drone_stress.py` to summarize receiver-budget behavior, overload, and recovery denials.
- [x] Static checks for this receiver-budget build: `pio run -e seeed-xiao-s3`, `node --check script.js`, and `python -m py_compile tools\run_multi_drone_stress.py tools\analyze_live_debug_log.py tools\measure_telemetry_coverage.py`.
- [x] OTA flashed MaGC, TeleGC, and reachable drones with the receiver-budget build.
  - 2026-06-22: flashed MaGC `192.168.68.101`, TeleGC `192.168.68.106`, drone 3 `192.168.68.107`, drone 6 `192.168.68.111`, and drone 7 `192.168.68.100`.
- [x] Added final receiver-budget hardening after the first three-drone stress failure:
  - Reverted `DRONE_FIRST_JOIN_FAST_ATTEMPTS` to `10` after the `24`-attempt build caused multi-drone shared-channel contention.
  - Superseded the immediate TeleGC local-recovery defer: automatic lost assigned links now keep assigned recovery available while MaGC runs assigned-first recovery, one `6000 ms` shared fallback, and one assigned retry.
  - Changed MaGC shared-rejoin priority to renew auto shared RX instead of falling out when the current shared-RX lease expires.
  - Treated missed known-phase candidates as recovery-budget consumers, and fixed stale recovery deadlines so overdue missing nodes cannot outrank healthy service deadlines.
- [x] Bench validation for reachable drones 3/6/7:
  - Clean startup passed for all three reachable drones.
  - Manual Bind with all drones online passed with max non-target gaps: node 3 `608 ms`, node 6 `1000 ms`, node 7 `616 ms`, and zero non-target link events.
  - RF-loss-only cycles=4 passed for each drone, with zero non-target link events.
  - Sequential broken-link rejoin passed for nodes 3, 6, and 7. Non-target max gaps stayed within the `1500 ms` budget: target 3 recovery kept node 6 at `1000 ms` and node 7 at `601 ms`; target 6 recovery kept node 3 at `1200 ms` and node 7 at `800 ms`; target 7 recovery kept node 3 at `1210 ms` and node 6 at `800 ms`.
  - Transport health passed: `46/46` command ACKs, zero rejected commands, zero MaGC ACK timeouts, zero Inter-GC forward failures, zero malformed serial JSON, zero suspicious fragments, and zero queue/outbox drops.
  - Receiver budget evidence: `recovery_budget_denied=208`, `healthy_service_protected=208`, `recovery_budget_used=25`, and no receiver overload events.
- [ ] Mixed-profile bench when at least one non-Fast drone is available.
