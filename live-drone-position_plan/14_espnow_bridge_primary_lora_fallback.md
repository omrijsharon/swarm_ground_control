# Part 14: ESP-NOW Bridge Primary With LoRa Fallback

## Summary

Use ESP-NOW as the primary GC/MaGC-to-bridge transport so bridge-connected SGC
feels closer to direct USB. Keep the existing LoRa bridge as automatic fallback.
LoRa fallback must not be a dead end: while LoRa is carrying the live bridge,
both devices keep probing ESP-NOW and promote back automatically when ESP-NOW
snapshots become fresh.

The current PlatformIO/Arduino ESP32 stack exposes `ESP_NOW_MAX_DATA_LEN = 250`,
so v1 reuses the compact existing bridge binary packets instead of large JSON
frames. The current V3 bridge snapshot, including bind-progress metadata, fits
under that limit.

## Key Changes

- Reuse existing bridge packet types over ESP-NOW, but make discovery bridge-initiated:
  - `BRIDGE_HELLO`
  - `BRIDGE_SNAPSHOT`
  - `BRIDGE_COMMAND`
- Keep LoRa bridge on known `902.0 MHz`; negotiate the fallback radio profile
  with a compact shared-channel bridge join.
- Add 3-byte shared-channel LoRa fallback discovery packets:
  - `BRIDGE_JOIN_REQUEST`: `packet_type`, `requested_profile_id`, `session_seq`
  - `BRIDGE_JOIN_ACK`: `packet_type`, `accepted_profile_id`, `session_seq`;
    MaGC sends it on `902 MHz` with the accepted profile, and the bridge listens
    there immediately after sending the request.
- While LoRa fallback is active, use compact `BRIDGE_LIVE_DELTA` frames every
  `250 ms`; keep full `BRIDGE_SNAPSHOT` frames for activation and periodic
  metadata refresh.
- Add `live_position.bridge_transport` config:
  - `enabled`
  - `primary: "espnow"`
  - `fallback: "lora"`
  - `espnow_channel`
  - `espnow_snapshot_period_ms`
  - `espnow_command_retry_ms`
  - `espnow_stale_ms`
  - `lora_fallback_after_ms`
- GC/MaGC behavior:
  - Listen for bridge-originated ESP-NOW hello/probe packets in the background.
  - Store the bridge MAC after `BRIDGE_HELLO`.
  - Send unicast snapshots every `250 ms` while ESP-NOW is live.
  - Keep command ACK/retry/duplicate behavior from LoRa V2.
  - Stop broadcasting unsolicited bridge beacons over ESP-NOW or LoRa.
  - Use LoRa fallback only after a bridge-originated shared-channel join request.
  - Promote back to ESP-NOW immediately after a valid ESP-NOW hello/command.
- Bridge receiver behavior:
  - Send periodic ESP-NOW broadcast hello probes while ESP-NOW snapshots are not fresh.
  - Prefer ESP-NOW snapshots when fresh.
  - If no MaGC downlink is heard for `6000 ms`, send a 3-byte bridge join on
    the shared discovery channel.
  - If no `902 MHz` LoRa downlink follows the join request within `6000 ms`,
    retry with the next profile in the fallback ladder.
  - Suppress duplicate LoRa snapshot USB output while ESP-NOW snapshots are fresh.
  - Emit the same USB JSON shapes SGC already consumes.
- SGC behavior:
  - Accept bridge snapshots from `source:"espnow_bridge"` and `source:"lora_bridge"`.
  - Show the active bridge transport plus standby/probing state in the GC status grid.
  - Keep controls enabled only when `bridgeControl` is fresh.

## Checklist

- [x] Add ESP-NOW bridge transport config and defaults.
- [x] Add ESP-NOW frame size checks for current 250-byte payload limit.
- [x] Add GC/MaGC ESP-NOW snapshot/command handling after bridge-originated hello.
- [x] Add bridge receiver ESP-NOW hello-probe/snapshot/command handling.
- [x] Keep LoRa bridge fallback automatic through bridge-originated shared join.
- [x] Keep ESP-NOW probing active while LoRa fallback is carrying the bridge.
- [x] Promote back to ESP-NOW automatically when ESP-NOW snapshots become fresh.
- [x] Use compact LoRa live deltas during fallback so LoRa source mode keeps
  updating near `4 Hz` without sending full snapshots every `250 ms`.
- [x] Add SGC parsing/display for `espnow_bridge` source and active bridge transport.
- [x] Add SGC display for `LoRa live | ESP-NOW probing` and `ESP-NOW live | LoRa standby`.
- [x] Preserve detailed bind-progress phases through ESP-NOW bridge snapshots.
- [x] Update provisioning helper for ESP-NOW primary and LoRa fallback defaults.
- [x] Keep MaGC ESP-NOW bridge service active in dual-GC shared-listen mode so
  shared-channel LoRa priority cannot starve bridge hello processing/snapshots.
- [x] Use the runtime Wi-Fi STA channel for ESP-NOW peers and reinitialize
  ESP-NOW if the STA channel changes.
- [x] Replace MaGC-originated ESP-NOW/LoRa bridge beacons with bridge-originated
  ESP-NOW hello probes and 3-byte shared-channel LoRa join/ACK.
- [x] Add bridge LoRa profile retry ladder for rooftop/indoor fallback links.
- [x] Make the LoRa bridge JOIN ACK part of the backhaul handshake: MaGC ACKs on
  `902 MHz` with the accepted profile, and bridge status requires
  `bridgeJoinAckRxCount` to move for a clean handshake.
- [x] Keep LoRa fallback freshness aligned with MaGC shared-RX dwell cadence:
  first snapshot follows the ACK, later LoRa packets are sent between completed
  shared dwells, and bridge stale timeout is `6 s`.
- [ ] Bench-verify ESP-NOW bridge connects and updates at about 4 Hz.
- [ ] Bench-verify mutating commands ACK over ESP-NOW.
- [ ] Bench-verify LoRa fallback after ESP-NOW stale/loss and promotion back to ESP-NOW.

## Test Plan

- Static:
  - `pio run -e seeed-xiao-s3`
  - `node --check script.js`
  - `git diff --check`
- Bench:
  - Flash GC and bridge with current configs.
  - Confirm SGC shows `ESP-NOW live`.
  - Confirm drone snapshots arrive at about 4 Hz.
  - Confirm `Bind`, `Re-bind`, profile apply, re-scan, and clear commands ACK.
  - Move/separate devices enough to break ESP-NOW and confirm LoRa fallback status.
  - Restore ESP-NOW range/conditions and confirm SGC promotes back to `ESP-NOW bridge`.

## Assumptions

- Current v1 uses the installed 250-byte ESP-NOW payload limit.
- One bridge receiver is paired with one GC/MaGC.
- Web OTA AP channel `1` is the default ESP-NOW channel for node `0` devices.
- HOME data remains local/browser/cloud state only.
