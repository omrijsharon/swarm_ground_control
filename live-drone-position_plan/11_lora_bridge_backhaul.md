# Part 11: LoRa Bridge Backhaul Plan

Goal: add an optional one-way LoRa bridge path so the GC can be placed on a
rooftop while the computer connects to a nearby ESP32+SX1262 bridge receiver.

## Summary

Target topology:

```text
Classic mode:
Drones -> GC -> UF LoRa backhaul -> Bridge receiver -> USB -> SGC

Dual-GC mode:
Drones -> TeleGC
TeleGC -> MaGC over Inter-GC UART
MaGC -> UF LoRa backhaul -> Bridge receiver -> USB -> SGC
```

Direct USB output from the real GC remains unchanged. Bridge mode is additive:
the same GC can still be connected directly to SGC over USB, or it can transmit
a compact RF scene snapshot to the bridge receiver.

## RF Backhaul

- Dedicated GC-to-bridge backhaul:
  - Frequency: `902.0 MHz`.
  - Profile: `SF7 / BW500 / CR4/5`.
  - Preamble: `8`.
  - LoRa PHY CRC: enabled.
  - TX power: existing firmware default, `22 dBm`.
  - Default period: `1000 ms`.
- Reserve drone telemetry channel centers from `902.5 MHz` through `904.0 MHz`.
- Expose these channels only as normal `reserved` channels in SGC/channel-table
  output; do not expose a separate backhaul reason in the UI.
- Do not send HOME data over the RF backhaul. HOME markers remain local to SGC
  and Cloudflare browser mirroring.

## Backhaul Packet

- Add a new binary packet type, `BRIDGE_SNAPSHOT`, packet ID `0xB1`.
- Use one full snapshot packet per backhaul transmission.
- V1 maximum: `5` drone records per snapshot.
- Packet header, little-endian:
  - `packet_type uint8 = 0xB1`
  - `version uint8 = 1`
  - `snapshot_sequence uint8`
  - `flags uint8`, bit `0 = truncated`
  - `gc_millis uint32`
  - `record_count uint8`
- Drone record size: `31 bytes`.
  - `node_id uint8`
  - `display_state uint8`
  - `telemetry_flags uint8`
  - `lat_e7 int32`
  - `lng_e7 int32`
  - `alt_cm uint16`
  - `heading_ddeg uint16`
  - `course_ddeg uint16`
  - `yaw_deg int16`
  - `ground_speed_cms uint16`
  - `satellite_count uint8`
  - `telemetry_sequence_id uint8`
  - `age_ms uint16`
  - `drone_rssi_dbm int8`
  - `drone_snr_q4 int8`
  - `channel_index uint8`
  - `radio_profile_id uint8`
  - `tx_period_ms uint16`
- Five records plus header: `164 bytes`, expected airtime about `66.6 ms` at
  `SF7/BW500/CR4/5`.
- No extra payload CRC; rely on LoRa PHY CRC.
- If more than five drones are active, send the freshest five and set the
  truncated flag. Multi-packet snapshots are out of scope for v1.

## Firmware Roles And Scheduling

- Preserve existing `ground_station`, `magic_ground_control`, and
  `telemetry_ground_control` behavior.
- Add new role: `bridge_receiver`, with aliases `bridge` and `lora_bridge`.
- Add config under `live_position.backhaul`:
  - `enabled`
  - `frequency_mhz`, default `902.0`
  - `period_ms`, default `1000`
  - `max_drones`, default `5`
- In classic `ground_station` mode:
  - Continue normal USB JSON output unchanged.
  - If backhaul is enabled, transmit one bridge snapshot every `1000 ms` from
    the latest GC telemetry state.
  - Schedule the backhaul TX as low priority; do not interrupt active shared
    bind/ACK windows or critical assigned-channel RX windows.
- In dual-GC mode:
  - TeleGC remains the source of assigned telemetry truth.
  - Add a TeleGC-to-MaGC Inter-GC message carrying the latest compact drone
    scene records.
  - MaGC stores the latest TeleGC scene snapshot and transmits it over the
    bridge backhaul every `1000 ms`.
  - MaGC does not invent drone telemetry; if TeleGC data is stale, MaGC forwards
    stale age/state.
- Bridge receiver mode:
  - Does no bind, scan, assignment, MSP, or persistence.
  - Stays fixed on `902.0 MHz / SF7 / BW500 / CR4/5`.
  - Decodes `BRIDGE_SNAPSHOT`.
  - Emits USB JSON for SGC.

## USB/SGC Interface

- Bridge receiver emits `drones_state` JSON over USB, not per-drone
  `drone_telemetry`.
- `drones_state.sentAt` may be bridge `millis()`; SGC must not require wall-clock
  time for USB bridge snapshots.
- SGC must treat USB `drones_state` as a local serial telemetry source:
  - Stop mock telemetry.
  - Update live drones from snapshot entries.
  - Preserve local drone aliases by `nodeId`.
  - Omit map markers for entries without valid GPS.
- Bridge receiver also emits periodic `gc_status` with:
  - `bridgeMode: true`
  - `backhaulFrequencyMhz`
  - `backhaulProfile: "SF7/BW500/CR4/5"`
  - `backhaulLastPacketAgeMs`
  - `backhaulRssi`
  - `backhaulSnr`
  - `assignedDrones`
- V1 behavior: when `bridgeMode === true`, SGC disables GC-mutating controls:
  Reset, Bind, Re-bind, Re-scan, Delete assignment, and Profile Apply.
- V2 behavior is documented in `12_lora_bridge_bidirectional_v2.md`: mutating
  controls may be enabled when the bridge reports a fresh `bridgeControl` link.
- Local SGC-only tools remain available: HOME markers, drone aliases, distance
  measurement, and Cloudflare publishing.
- Cloudflare Worker changes are not required; the browser can publish
  bridge-fed `drones_state` the same way it publishes direct-GC scene state.

## Milestones And Tasks

- [x] Add backhaul constants, packet structs, static size checks, and airtime
  diagnostics.
- [x] Reserve `902.5-904.0 MHz` channel centers from drone allocation and channel
  scan assignment.
- [x] Add bridge receiver role and config aliases.
- [x] Add GC/MaGC backhaul scheduler with low-priority `1000 ms` snapshot TX.
- [x] Add TeleGC-to-MaGC scene snapshot forwarding for dual-GC mode.
- [x] Add bridge receiver packet decode and USB `drones_state` / `gc_status`
  output.
- [x] Update SGC to accept USB `drones_state` as local telemetry.
- [x] Update SGC to detect `bridgeMode` and disable GC-mutating controls.
- [x] Update build/flash guide with classic GC, MaGC, TeleGC, and bridge receiver
  examples.
- [x] Update serial JSON and firmware plan docs with the bridge mode contract.

Implementation note: static firmware and SGC checks pass, but RF bench verification
of the bridge transmitter/receiver path remains pending.

## Test Plan

- Static:
  - `pio run -e seeed-xiao-s3`
  - `node --check script.js`
  - `git diff --check`
- Firmware bench:
  - Flash a classic GC with backhaul enabled and confirm normal USB JSON still
    works.
  - Confirm channel table marks `902.5-904.0 MHz` as `reserved`.
  - Confirm GC transmits one bridge snapshot about every `1000 ms`.
  - Confirm five-record snapshot airtime is about `66-67 ms`.
  - Confirm bridge receiver decodes snapshots and emits valid USB
    `drones_state`.
  - Confirm packet loss only causes one stale snapshot and recovers on the next
    snapshot.
- Dual-GC bench:
  - TeleGC receives drone telemetry.
  - TeleGC forwards scene records to MaGC over Inter-GC UART.
  - MaGC transmits bridge snapshots.
  - Bridge receiver outputs the same drone positions to SGC.
- SGC checks:
  - SGC connected directly to GC still works unchanged.
  - SGC connected to bridge receiver shows drones from USB `drones_state`.
  - GC-mutating controls are disabled in bridge mode.
  - HOME markers and drone aliases remain local and editable.
  - Cloudflare remote viewers receive bridge-fed drone state when the
    bridge-connected SGC browser is online.

## Assumptions

- V1 is one-way only: bridge receiver cannot send Bind/Re-bind/Profile/Reset
  commands back to the roof GC.
- Bridge mode is display/dashboard mode, not remote GC control mode.
- V1 target is up to five live drones per snapshot.
- SGC-ready records are preferred over exact raw 20-byte drone packets, even
  though the RF snapshot grows to about `164 bytes`.
- The backhaul frequency is fixed at `902.0 MHz` for v1.
- Drone channels in the reserved range are excluded regardless of LoRa spreading
  factor.
- Direct GC USB output remains unchanged and supported.
