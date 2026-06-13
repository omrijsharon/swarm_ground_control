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
- Reliable MaGC-to-TeleGC assignment snapshots use `messageId`, ACK, retry every
  `100 ms`, and stop after `10` attempts with degraded link status.
- TeleGC sends NTP-style clock sync requests. TeleGC treats MaGC timing as an
  acquisition hint only; received telemetry is still the final TST source.
- TeleGC routes SGC magic commands to MaGC and handles local telemetry commands
  such as status, assignments, and manual Re-bind.

## Milestones And Tasks

- [x] Add MaGC and TeleGC runtime roles while preserving `ground_station`.
- [x] Add configurable Inter-GC UART settings.
- [x] Start MSP UART only for drone-like roles.
- [x] Start Inter-GC UART only for MaGC/TeleGC roles.
- [x] Add line-delimited Inter-GC JSON transport.
- [x] Add MaGC assignment snapshot mirror with ACK/retry.
- [x] Add TeleGC in-RAM assignment mirror.
- [x] Add TeleGC snapshot request on boot/reconnect.
- [x] Add TeleGC-to-MaGC SGC command forwarding.
- [x] Add MaGC command execution through the existing GC command handler.
- [x] Add TeleGC-local manual Re-bind path.
- [x] Add Inter-GC clock sync and timing-hint conversion support.
- [x] Add role-specific scanner mode:
  - single GC: shared + assigned telemetry
  - MaGC: shared/bind only
  - TeleGC: assigned telemetry only
- [x] Extend provisioning helper for `magc` and `telegc`.
- [ ] Bench-verify two physical ESP32+SX1262 modules exchange Inter-GC UART
  messages at `921600`.
- [ ] Bench-verify SGC connected to TeleGC can Bind a drone through MaGC.
- [ ] Bench-verify TeleGC receives normal `drone_telemetry` after MaGC assignment.
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

## Notes

- MaGC owns `/live_assignments.json` in v1.
- TeleGC does not persist mirrored assignments in v1.
- Inter-GC timing hints are optional; TeleGC locks real TST from telemetry.
- If the Inter-GC link drops, TeleGC continues receiving already mirrored drones
  and reports the link as waiting/degraded.
