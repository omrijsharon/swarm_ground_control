# Part 10: Dual-LoRa Ground Station Plan

Goal: make the ground station feel automatic by supporting both the existing
single-GC mode and a two-module MaGC/TeleGC mode.

## Concept

The single-GC mode remains available as `ground_station`.

The dual-GC mode splits the work:

- MaGC (`magic_ground_control` / `magc`) owns shared-channel discovery, Bind,
  channel scan, allocation, persisted assignments, and orphan recovery.
- TeleGC (`telemetry_ground_control` / `telegc`) owns assigned-channel telemetry
  receive, TST/period tracking, and the USB serial connection to SGC.

SGC connects only to TeleGC. MaGC and TeleGC exchange newline-delimited JSON over
UART at `921600`.

## Implemented Interface

- Config supports new roles `magic_ground_control` and `telemetry_ground_control`,
  including aliases `magc` and `telegc`.
- Config supports `live_position.inter_gc` with:
  - `enabled`
  - `baud`
  - `rx_pin`
  - `tx_pin`
- Inter-GC messages include:
  - `hello`
  - `uart_ack`
  - `assignment_snapshot`
  - `assignment_upsert`
  - `assignment_remove`
  - `assignments_clear`
  - `assignment_timing_hint`
  - `assignment_snapshot_request`
  - `clock_sync_request`
  - `clock_sync_response`
  - `sgc_command`
  - `telemetry_rebind_request`
  - `telemetry_rebind_cancel`
  - `telemetry_rebind_event`
  - `bind_progress_event`
- Reliable MaGC-to-TeleGC assignment snapshots use `messageId`, ACK, retry every
  `100 ms`, and stop after `10` attempts with degraded link status.
- TeleGC merges MaGC assignment snapshots. For unchanged node/channel/profile
  assignments, TeleGC preserves its local telemetry-owned runtime state:
  accepted TX period, TST, next receive window, link state, RSSI/SNR, sequence
  evidence, miss counters, and recovery state. A new join nonce or changed
  channel/profile is treated as a real re-bind and resets acquisition state.
- TeleGC sends NTP-style clock sync bursts. Every `5000 ms`, it sends four
  probes spaced `4 ms`, protects the burst with a `35 ms` low-priority quiet
  window, accepts any sane sample under `10000 us` uncertainty as fresh, smooths
  the offset from the best burst sample, and treats MaGC timing as an
  acquisition hint only. Received telemetry is still the final TST source.
- TeleGC routes SGC magic commands to MaGC and handles local telemetry commands
  such as status and assignments. Manual Re-bind first asks MaGC to reacquire
  the stale drone, then falls back to local TeleGC recovery if the MaGC link is
  unavailable.
- Both MaGC and TeleGC identify their role over USB status paths. If MaGC is
  connected directly to SGC by mistake, SGC can show a clear MaGC warning rather
  than labeling it as a generic GC.
- When an assigned drone misses one expected TST/packet, TeleGC sends an urgent
  `telemetry_rebind_request`; MaGC treats assigned-drone recovery as
  top-priority non-critical work, listens on the assigned channel/profile with
  its independent radio, and returns `assignment_timing_hint` if it decodes
  telemetry. TeleGC still confirms final TST from its own received telemetry.
- For a lost normal-profile assigned drone, MaGC gets only two quick
  assigned-channel chances, with a combined budget under `2 s`. If both fail,
  MaGC enters shared-channel rejoin priority for that node and defers further
  automatic stale-channel requests. The extra-long `SF12/BW125/CR4/8` profile
  gets one profile-aware long assigned sweep before shared priority.
- MaGC starts shared-channel listening immediately on boot; full boot spectrum
  scan is deferred so new drones can be heard as soon as possible.
- MaGC also runs a low-disturbance background OOCR scheduler. It checks one
  Fast/Balanced/Robust CAD cursor slice at most every `250 ms`, restores shared
  RX immediately, queues CAD hits, and only runs decoded-telemetry confirmation
  after the shared channel has been quiet for about `2 s`.
- MaGC mirrors shared-channel bind phase changes as best-effort
  `bind_progress_event` lines over Inter-GC UART. TeleGC forwards them to SGC so
  the browser can show a blue pre-telemetry `BINDING` row as soon as MaGC hears
  the drone.

## Milestones And Tasks

- [x] Add MaGC and TeleGC runtime roles while preserving `ground_station`.
- [x] Add configurable Inter-GC UART settings.
- [x] Start MSP UART only for drone-like roles.
- [x] Start Inter-GC UART only for MaGC/TeleGC roles.
- [x] Add line-delimited Inter-GC JSON transport.
- [x] Add MaGC assignment snapshot mirror with ACK/retry.
- [x] Add TeleGC in-RAM assignment mirror.
- [x] Preserve TeleGC telemetry timing/runtime state when MaGC sends unchanged
  assignment snapshots.
- [x] Add TeleGC snapshot request on boot/reconnect.
- [x] Add TeleGC-to-MaGC SGC command forwarding.
- [x] Add MaGC command execution through the existing GC command handler.
- [x] Add TeleGC-local manual Re-bind path.
- [x] Add Inter-GC clock sync and timing-hint conversion support.
- [x] Upgrade Inter-GC clock sync to burst sampling with separate freshness,
  best-offset smoothing, uncertainty diagnostics, and hint acquisition guard.
- [x] Tighten clock sync to a low-disturbance `4 x 4 ms` burst every `5 s` with
  a `35 ms` quiet window and `15 s` validity.
- [x] Add MaGC-assisted telemetry Re-bind request/cancel/event messages.
- [x] Add TeleGC early assisted Re-bind requests after one missed expected
  packet/TST, with per-node cooldown.
- [x] Add MaGC assigned-channel RX reacquire worker and timing-hint sender.
- [x] Add MaGC periodic background OOCR scheduler with strict radio-use limits.
  - MaGC OOCR is split into short CAD slices and deferred RX confirmation. A CAD
    hit queues a candidate; it does not immediately start the long confirmation
    listen in the same scheduler pass.
  - Confirmation is limited to one candidate per `10 s` cycle and is deferred
    while shared bind, operator Bind/Search, or assigned-drone recovery needs
    the radio.
- [x] Restore MaGC shared-channel RX after assisted Re-bind / OOCR side work.
  - MaGC may briefly tune to assigned telemetry or candidate orphan channels, but
    it must always return the SX1262 to shared discovery before the next passive
    listen. Otherwise a rebooted assigned drone can keep sending JOIN requests
    while MaGC still believes it is listening on shared but the radio is tuned
    elsewhere.
- [x] Give rebooted assigned drones shared-JOIN priority after bounded assigned
  checks.
  - Normal profiles get at most two quick assigned-channel chances with a
    combined budget under `2 s`; the SF12/BW125/CR4/8 long-range profile gets
    one existing long sweep. If those fail, MaGC stops repeating stale assigned
    recovery and keeps shared discovery as the priority for the lost node's JOIN
    requests.
- [x] Let recent Inter-GC RX traffic keep recovery usable even when the reliable
  link status is degraded.
  - A stale failed reliable send should not permanently block TeleGC from
    sending later missed-TST assisted re-bind requests while MaGC is still
    sending hello/status/sync traffic.
- [x] Add assisted Re-bind status fields to `inter_gc_status`.
- [x] Add role-specific scanner mode:
  - single GC: shared + assigned telemetry
  - MaGC: shared/bind only
  - TeleGC: assigned telemetry only
- [x] Add MaGC-to-TeleGC best-effort `bind_progress_event` mirroring for
  pre-telemetry SGC bind rows.
- [x] Add USB role reporting for MaGC/TeleGC so SGC can warn when MaGC is
  connected instead of TeleGC.
- [x] Add MaGC USB-visible shared-RX diagnostics in `gc_status` so bench tests
  can distinguish no shared RF packets from malformed or rejected JOIN packets.
- [x] Extend provisioning helper for `magc` and `telegc`.
- [ ] Bench-verify two physical ESP32+SX1262 modules exchange Inter-GC UART
  messages at `921600`.
- [ ] Bench-verify SGC connected to TeleGC can Bind a drone through MaGC.
- [ ] Bench-verify TeleGC receives normal `drone_telemetry` after MaGC assignment.
- [ ] Bench-verify TeleGC sends `telemetry_rebind_request` after one missed
  expected assigned packet/TST.
- [ ] Bench-verify MaGC sends `telemetry_rebind_event` and
  `assignment_timing_hint` after decoding stale-drone telemetry.
- [ ] Bench-verify MaGC background OOCR runs about every `10 s`, pauses for
  critical bind phases, and recovers an orphan transmitting drone without a
  manual scan.
- [ ] Bench-verify a healthy drone keeps updating while MaGC reacquires a stale
  drone.
- [ ] Bench-verify binding a second drone does not reset or drop telemetry from
  an already-bound healthy drone.
- [ ] Bench-verify MaGC-assisted Re-bind falls back to local TeleGC recovery
  when the Inter-GC link is unavailable.
- [ ] Bench-verify MaGC reset and TeleGC reset snapshot recovery.
- [ ] Bench-verify single-GC mode still binds and receives telemetry.

## Bench Flow

1. Provision MaGC with `node_role = magic_ground_control`.
2. Provision TeleGC with `node_role = telemetry_ground_control`.
3. Wire MaGC TX to TeleGC RX, MaGC RX to TeleGC TX, and common GND.
4. Connect SGC USB serial to TeleGC only.
5. Open SGC and click Bind.
6. Confirm SGC receives command ACK/status through TeleGC.
7. Confirm MaGC sends assignment snapshot and TeleGC ACKs it.
8. Confirm TeleGC emits `drone_telemetry`.
9. Confirm `inter_gc_status.clockSyncValid` remains `true`,
   `clockLastSyncMsAgo` rises to about `5000 ms` and then returns near zero,
   and `clockUncertaintyUs <= 10000`.
10. Stop one assigned drone's telemetry long enough to miss one expected TST.
11. Confirm TeleGC emits `telemetry_rebind_request` and keeps servicing other
    drones.
12. Confirm MaGC emits `telemetry_rebind_event` and sends
    `assignment_timing_hint` when it decodes the stale drone.
13. Confirm TeleGC uses the hint only to reacquire, then marks the drone online
    after its own valid telemetry.

## Notes

- MaGC owns `/live_assignments.json` in v1.
- TeleGC does not persist mirrored assignments in v1.
- Inter-GC timing hints are optional; TeleGC locks real TST from telemetry.
- Clock-sync status exposes accepted/rejected sample counts, best burst delay,
  uncertainty, and the last reject reason for bench diagnosis.
- If the Inter-GC link drops, TeleGC continues receiving already mirrored drones
  and reports the link as waiting/degraded.
