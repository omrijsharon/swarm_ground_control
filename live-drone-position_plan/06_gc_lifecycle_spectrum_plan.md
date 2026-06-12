# Part 6: GC Lifecycle And Spectrum Visibility Plan

Goal: make the GC startup, assignment recovery, and session reset behavior clear and operator-controlled before scaling to the full multi-drone scanner.

This feature spans firmware, serial JSON, and SGC UI. Keep the detailed implementation tasks mirrored in:

- `03_serial_protocol_json.md`
- `04_sgc_side.md`
- `05_simple_mesh_firmware_side.md`

## Decisions

- [x] A drone reset should return the drone to the shared channel and rejoin.
- [x] The GC should reuse that drone's previous assignment when the persisted channel/profile is still valid.
- [x] The GC should reassign the drone only when the previous assignment is invalid, noisy, unsupported, or explicitly cleared.
- [x] A GC reset should reload valid persisted assignments from flash and then reacquire packet timing from live telemetry.
- [x] Packet phase, freshness, RSSI/SNR, and scanner timing are runtime state and should not be treated as persistent truth.
- [x] A new-day/new-session reset should be explicit operator action in SGC, not guessed by the GC.
- [x] The first operator action is `Start Fresh Session`, backed by a GC command that clears flash/RAM assignments and rescans channels.
- [x] The first v1 UI should show boot spectrum/noise-floor visibility from the GC channel scan.
- [x] The spectrum view should be a temporary boot/fresh-session animation, not a permanent panel.
- [x] SGC should auto-reconnect to the latest granted GC serial port after ESP32 reset unless the user clicked `Close`.

## Milestones And Tasks

- [x] Milestone 1: Harden drone reset and JOIN retry behavior
  - [x] GC repeats `SILENCE -> JOIN_ASSIGN -> wait for JOIN_ACK` up to the configured retry count.
  - [x] GC keeps the same assignment and request nonce during retries.
  - [x] GC emits `assignment_event` messages with the retry attempt number.
  - [x] GC does not delete a valid assignment just because one ACK attempt is missed.
  - [x] Drone reset bench test confirms the same node reuses its previous channel when still clear.
    - User manual bench test passed.

- [x] Milestone 2: Implement GC lifecycle serial commands
  - [x] GC parses newline-delimited SGC-to-GC command JSON.
  - [x] GC implements `ping`.
  - [x] GC implements `get_status`.
  - [x] GC implements `get_channel_table`.
  - [x] GC implements `get_assignments`.
  - [x] GC implements `clear_all_assignments` as the firmware side of `Start Fresh Session`.
  - [x] GC emits `command_ack` for accepted and rejected commands.
  - [x] Rejected commands include a stable reason code.

- [x] Milestone 3: Implement Start Fresh Session behavior
  - [x] SGC shows a confirmation dialog before sending the command.
  - [x] Confirmation copy clearly states that previous channel assignments will be deleted.
  - [x] GC clears `/live_assignments.json`.
  - [x] GC clears RAM assignment state.
  - [x] GC returns to the shared channel.
  - [x] GC reruns the boot noise scan or an equivalent channel rescan.
  - [x] GC emits `assignment_event` or `session_event` messages showing the reset progress.
  - [x] GC emits a fresh `channel_table` and `gc_status` after the reset.
  - [x] Drones currently in the air rejoin from the shared channel when they need assignment again.
    - User manual Start Fresh/browser check passed after switching to the in-panel confirmation flow.

- [x] Milestone 4: Emit detailed spectrum scan information
  - [x] GC emits a scan-start event before scanning telemetry candidate channels.
  - [x] GC emits `profile_scan_started` before each simple-profile CAD pass.
  - [x] GC emits per-channel scan progress during scanning.
  - [x] Per-channel scan data includes frequency, profile ID/name, activity detection, and optional RSSI.
  - [x] GC emits scan-complete summary with free/occupied/assigned counts and compatibility clear/noisy counts.
  - [x] Final `channel_table` includes enough per-channel data for SGC to render a spectrum view.
  - [x] SGC can request the latest channel table after connecting late, even if it missed GC boot.
  - [x] GC scans Fast, Balanced, and Robust profiles on every telemetry candidate channel.
  - [x] GC waits 4 ms after each frequency/profile tune before CAD/LBT.
  - [x] GC uses CAD/LBT, not RSSI, as the free/occupied decision source.
  - [x] GC measures RSSI only for occupied/assigned display.
  - [x] GC emits updated `channel_scanned` events for each profile pass so SGC can update spectrum bars live.

- [x] Milestone 5: Add SGC spectrum and lifecycle UI
  - [x] SGC requests status and channel table after serial connection opens.
  - [x] SGC shows a boot/scanning state while channel scan messages arrive.
  - [x] SGC renders a compact spectrum/activity visualization.
  - [x] SGC visually marks shared, guard, free, occupied, and assigned channels.
  - [x] SGC keeps showing free/occupied/assigned summary counts.
  - [x] SGC adds a `Start Fresh Session` control in the GC/radio panel.
  - [x] SGC disables the fresh-session control while a command is pending.
  - [x] SGC shows command ACK/failure feedback in the debug/status area.
  - [x] SGC renders channel scan events progressively so bars fill during the scan.
  - [x] SGC hides the spectrum about 3 seconds after scan completion.
  - [x] SGC keeps the normal GC summary visible after the spectrum hides.
  - [x] SGC remembers the last successfully opened serial port for automatic reset recovery.
  - [x] SGC retries `navigator.serial.getPorts()` and reopens the granted GC port after disconnect.
  - [x] SGC does not auto-reconnect after the user intentionally clicks `Close`.

- [ ] Milestone 5a: On-demand spectrum inspection and rescan
  - [x] SGC opens a persistent spectrum panel when the operator clicks `Channels`.
  - [x] SGC closes the panel without affecting the normal GC summary.
  - [x] SGC shows the latest channel table in the panel when no scan is active.
  - [x] SGC asks for confirmation before sending a manual channel rescan.
  - [x] SGC sends `rescan_channels` with `persist:true` after confirmation.
  - [x] SGC keeps the panel open and updates bars live during a manual rescan.
  - [x] SGC shows visible panel status for re-scan accepted/rejected/timeout/scanning/complete.
  - [x] GC implements `rescan_channels` without clearing assignments.
  - [x] GC emits scan events, a fresh `channel_table`, and `gc_status` after manual rescan.
    - Direct COM18 serial probe after flashing GC returned `command_ack accepted=true`, `scan_started`, `scan_complete`, `channel_table`, and `gc_status.scanMode = manual_rescan`.
  - [x] GC treats CAD hits as suspect activity and exposes decoded telemetry confirmation separately.
  - [x] GC enters Search/OOCR after manual rescan when CAD-suspect channels exist and there are zero active assignments.
  - [x] SGC renders CAD-suspect channels separately from decoded/confirmed drone channels.
  - [ ] Manually verify the browser panel open/close flow.
  - [ ] Manually verify the cancel-confirmation path sends no command.
  - [ ] Bench-verify manual rescan temporarily interrupts telemetry and then recovers.

- [ ] Milestone 6: Bench verification
  - [ ] Bench-measure the three-profile CAD scan duration.
  - [ ] Bench-verify free channels when no drones are transmitting.
  - [ ] Bench-verify occupied channels and detecting profile IDs with an active unassigned LoRa transmitter.
  - [ ] Bench-verify assigned channels stay assigned/red even if CAD does not detect activity during the scan.
  - [x] Reset the drone node and confirm it rejoins through the shared channel.
    - User manual bench test passed.
  - [x] Confirm the GC reuses the previous assignment for the same node when valid.
    - Direct serial bench after flashing showed node `2` join flow using `assign_reused`, `assign_sent`, and `join_ack_received`.
  - [x] Reset the GC and confirm it reloads valid flash assignments.
    - Reflash/reset preserved valid assignment state and telemetry resumed after boot.
  - [x] Confirm the GC reacquires live telemetry timing after reset.
    - GC resumed receiving node `2` telemetry with incrementing `sequenceId` after reflash/reset.
  - [x] Click `Start Fresh Session` and confirm assignments are removed from RAM and flash.
    - User manual browser check passed after switching to the in-panel confirmation flow.
  - [x] Confirm SGC `Assigned` drops to `0` after a fresh session when no drone has rejoined.
    - Direct GC serial command check showed `gc_status.assignedDrones = 0` after `clear_all_assignments`; SGC UI confirmation remains manual.
  - [x] Confirm a drone can rejoin after fresh session and get a new valid assignment.
    - Direct serial bench showed node `2` rejoined and telemetry resumed on `917.5 MHz`.
  - [x] Confirm SGC shows the spectrum scan/channel table after connecting late.
    - User manual browser check passed.
  - [x] Reset the GC from SGC and confirm automatic serial reconnect.
    - User manual browser check passed.
  - [x] Reset the GC from SGC and confirm the spectrum animation fills live, then hides after completion.
    - User manual browser check passed.
  - [x] Click SGC `Close`, reset the GC, and confirm SGC does not auto-reconnect.
    - User manual browser check passed.
  - [x] Confirm stale old sessions are not silently reused after an operator fresh reset.
    - Direct command check cleared assignments, rescanned, emitted fresh `channel_table`, and reported `assignedDrones = 0` before node `2` rejoined.

- [ ] Milestone 7: Fix stale assigned-channel recovery after drone power cycle
  - [x] Hold shared-channel listen windows until their deadline once the GC has tuned to shared.
    - This prevents stale assigned-channel recovery from immediately preempting the shared channel.
  - [x] Add forced shared rejoin probes after repeated assigned-channel misses.
    - After `3` misses, the GC uses a `160 ms` shared rejoin probe. After `8` misses, it uses an `1100 ms` extended shared window to catch a reset drone retrying `JOIN_REQUEST`.
  - [x] Keep one immediate assigned-channel recovery attempt after the first missed telemetry packet.
  - [x] Demote repeatedly missed assigned-channel recovery to a background retry cadence.
    - After `2` misses, the GC clears the stale runtime phase for that assignment and retries acquisition every `2 s` instead of letting an absent drone consume the normal scanner cadence.
  - [x] Protect healthy predicted drone slots from stale recovery windows.
    - Recovery/acquisition listens are clipped before the next known TST window from another active assignment, so a missing node should not make a live node miss enough packets to cascade offline.
  - [x] Keep rejoin timing acquisition responsive after `JOIN_ACK`.
    - The GC retries assigned-channel timing-proposal acquisition every `20 ms` after a miss, and drones retry proposals up to `12` times. This is intended to let a reconnected node become online while the GC is also protecting other live slots.
  - [x] Build-check the firmware after the scheduler change.
    - `pio run -e seeed-xiao-s3` passed.
  - [x] Bench-verify the exact regression: power-cycle drone node `2` while the GC remains on and confirm it rejoins instead of endless `telemetry_missed`.
    - User repeated this test several times; node `2` rejoined and telemetry resumed in about `3-4 seconds`.
  - [ ] Bench-verify the multi-node disconnect regression: disconnect node `1` while node `2` stays powered, and confirm node `2` remains online at its normal update rate.

## Future Ideas

- [ ] Infer likely new-session state by probing persisted channels and comparing them with drones present on the shared channel.
- [ ] Add a session ID or timestamp once SGC can provide trusted host time to the GC.
- [ ] Add a historical spectrum log for field debugging.

## Out Of Scope

- [ ] Do not implement automatic new-day detection in the first version.
- [ ] Do not delete persisted assignments without explicit operator action or clear invalidation.
- [ ] Do not add mission, arm, launch, land, or vehicle-actuation controls.
