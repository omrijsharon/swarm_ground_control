# Part 12: LoRa Bridge Downlink/Uplink V2 Plan

## Summary

Upgrade the LoRa bridge from one-way dashboard snapshots into a bidirectional
"feels like direct GC USB" link.

The GC/MaGC remains the radio time master. It sends compact downlink state on
the bridge channel, then opens a short scheduled uplink receive slot. The
bridge only transmits queued SGC commands inside that slot, then waits for a GC
ACK in a later downlink. Direct GC USB behavior remains unchanged.

Target behavior:

```text
Drones <-> GC/MaGC
GC/MaGC -> bridge downlink state/events/ACKs
Bridge -> GC/MaGC scheduled uplink commands
Bridge USB <-> SGC
```

The bridge should show drones, assignments, OFF/OFFLINE states, binding
progress, scan/search status, and command ACKs closely enough that SGC feels
connected to the GC, only at a lower update rate.

## RF Scheduling And Reliability

- Keep the bridge downlink channel at `902.0 MHz`; the bridge-selected profile
  starts at `SF7 / BW500 / CR4/5` and can fall back through a known profile
  ladder if no MaGC downlink is heard.
- GC/MaGC supports bridge backhaul by default, but only sends LoRa full
  snapshots after a bridge-initiated presence handshake.
- MaGC no longer transmits unsolicited LoRa bridge presence packets. When the
  bridge has no fresh ESP-NOW or LoRa downlink for `6000 ms`, it sends a compact
  3-byte shared-channel bridge join request containing packet type, requested
  profile ID, and session sequence.
- MaGC listens for that bridge join on the normal shared discovery channel,
  switches the bridge backhaul profile to the accepted profile, and then sends
  snapshots/deltas on `902 MHz`. A compact 3-byte bridge join ACK may be sent
  for diagnostics, but the bridge immediately listens on `902 MHz` after each
  join request and retries with the next profile only after `6000 ms` without
  downlink.
- While active, the bridge sends a queued command if one exists in the scheduled
  uplink slot after a valid downlink; otherwise it stays silent.
- If GC/MaGC receives no bridge command/uplink contact and the bridge stops
  hearing downlink, the bridge restarts discovery by ESP-NOW hello first and
  then shared-channel LoRa bridge join after the stale timeout.
- When ESP-NOW is not fresh and a LoRa bridge session is active, GC/MaGC sends
  compact `BRIDGE_LIVE_DELTA` frames every `250 ms`.
- GC/MaGC still sends a full `BRIDGE_SNAPSHOT` on session activation and then
  about every `5000 ms` so the bridge cache can refresh assignment metadata.
- After every downlink TX, GC/MaGC opens a bridge uplink RX window:
  - `BRIDGE_UPLINK_GUARD_MS = 10`
  - `BRIDGE_UPLINK_RX_WINDOW_MS = 35`
- Bridge transmits only after receiving a valid GC/MaGC downlink:
  - Wait `10 ms` after downlink RX-done.
  - If a command is queued, send exactly one uplink command.
  - If no command is queued, stay silent.
- Bridge retries a queued command once per received downlink frame until ACKed
  or rejected.
- GC/MaGC keeps a duplicate-command cache of the last `16` command sequence
  numbers and payload hashes. Duplicates are ACKed again but not executed again.
- GC/MaGC includes command ACK fields in every downlink:
  - `ack_command_seq uint16`
  - `ack_status uint8`: `none | accepted | rejected | duplicate`
  - `ack_reason uint8`: compact reason code.
- Bridge maps `command_seq` back to the browser `commandId` and emits normal USB
  `command_ack` JSON to SGC.

## Binary Uplink Commands

Add packet type `BRIDGE_COMMAND`, `0xC1`, version `1`.

Header, little-endian:

```text
packet_type     uint8   0xC1
version         uint8   1
command_seq     uint16
command_type    uint8
flags           uint8
payload         0-N bytes
```

Supported command types:

```text
0  ping
1  get_status
2  get_channel_table
3  get_assignments
4  start_search
5  relock_drone        payload: node_id uint8
6  rescan_channels
7  set_radio_profile   payload: radio_profile_id uint8
8  clear_assignment    payload: node_id uint8
9  clear_all_assignments
```

Uplink airtime at UF profile:

```text
6-byte commands:  ~9.024 ms
7-byte commands:  ~9.024 ms
9-byte commands: ~10.304 ms
```

SGC should keep its existing confirmation UI for destructive commands. The
bridge only transports the already-confirmed command.

## Downlink State Mirror

Upgrade the current `BRIDGE_SNAPSHOT` to version `3`, and add compact
`BRIDGE_LIVE_DELTA` (`0xB2`) for fast LoRa fallback updates.

Downlink must carry:

- Drone scene records, including GPS when known.
- Assignment placeholders even when no post-boot telemetry exists.
- Link states: `online`, `binding`, `weak`, `offline`, `off`, `unknown`.
- Compact bind-progress metadata on each drone record: phase, status, reason,
  elapsed phase time, expected phase duration, and timing observation count.
- GC status summary:
  - assigned count
  - search/bind state
  - all-lost recovery state
  - default assignment profile
  - scan/search mode
  - bridge control enabled/stale indicators
- ACK fields for the latest bridge command.
- Optional compact scan/channel summary:
  - free/occupied/assigned/reserved counts
  - current scan phase when scanning.

Fix the current empty-snapshot issue: if the GC has a persisted assignment but
no live telemetry since boot, the bridge snapshot must still include a
card-only record with no GPS and an `offline`, `off`, or `binding` display
state. SGC must render it in the drone list and omit the map marker until valid
coordinates exist.

`BRIDGE_LIVE_DELTA` is optimized for frequent LoRa fallback updates:

- Header: `32 bytes`.
- Drone record: `20 bytes`.
- Five records plus header: `132 bytes`.
- Coordinates are encoded as meter offsets from the packet origin.
- Altitude is meters, heading is compact 0-254, speed is km/h, age is deciseconds.
- Each record carries bind phase/status/reason and elapsed/expected phase time.
- Assignment metadata that does not change often remains in the full snapshot
  cache and is refreshed by periodic `BRIDGE_SNAPSHOT` packets.

Default behavior:

- Full scene snapshot: immediately after session activation, then every `5000 ms`.
- Compact live delta: every `250 ms` while LoRa fallback is carrying an active
  bridge session.
- Do not send large channel tables at high rate.

Critical shared-channel Bind timing stays protected. During `SILENCE` /
`JOIN_ASSIGN` / `JOIN_ACK` phases, GC/MaGC defers non-terminal LoRa bridge
updates instead of retuning away from the shared channel. Terminal bind events
and telemetry timing transitions may send a safe snapshot/delta, then retune to
the shared discovery channel before continuing. During long CAD scans, GC/MaGC
may pause between channel/profile samples once every `250 ms` to send a compact
delta and service the bridge uplink slot.

## Bridge Receiver USB Behavior

Bridge receiver should convert RF packets into the same USB JSON shapes SGC
already understands:

- `drones_state`
- `gc_status`
- `channel_table` summary when available
- `assignment_event`
- `scanner_event`
- `search_event`
- `command_ack`

In bridge mode, SGC mutating controls become enabled only when:

- USB bridge is connected.
- Bridge has a fresh GC/MaGC downlink.
- `bridgeControl: true` is reported.
- No command queue failure is active.

Read-only/local commands can be answered by the bridge from cache:

- `ping`
- `get_status`
- `get_channel_table`
- `get_assignments`

Mutating/action commands are queued for RF uplink:

- `start_search`
- `relock_drone`
- `rescan_channels`
- `set_radio_profile`
- `clear_assignment`
- `clear_all_assignments`

Queue defaults:

- FIFO depth: `16`.
- One RF command per uplink slot.
- Queue full emits local USB `command_ack accepted:false
  reason:"bridge_queue_full"`.

## Edge Cases

- **Downlink lost:** bridge does not transmit; it waits for the next valid
  downlink.
- **Uplink lost:** no ACK appears; bridge retries the same command in the next
  uplink slot.
- **ACK downlink lost:** bridge retries; GC/MaGC detects duplicate and ACKs
  without executing twice.
- **GC busy:** GC/MaGC ACKs `accepted` once it accepts the command into its
  normal command path; long operations report progress through normal downlink
  events/status.
- **Bridge stale:** if no downlink for more than `3 s`, SGC disables mutating
  controls and shows bridge stale/reconnecting.
- **Drone off after GC reboot:** persisted assignment is still mirrored as a
  card-only `OFFLINE/OFF/BINDING` drone.
- **No GPS:** show drone card only; no map marker.
- **Multiple browser clicks:** SGC should not enqueue duplicate commands while
  the same command is pending for the same node/action.
- **Fresh session/reset:** preserve existing SGC confirmations; bridge
  transport must not bypass confirmation.
- **Dual-GC:** MaGC owns bridge RF and command execution for Bind/Search/scan/
  allocation; TeleGC remains telemetry truth source and forwards scene data to
  MaGC over Inter-GC UART.
- **Direct USB fallback:** unchanged. If SGC connects directly to GC, it uses
  existing USB serial JSON command flow.

## Implementation Tasks

- [x] Add V2 bridge packet constants, command enum, ACK enum, static size checks,
  and airtime diagnostics.
- [x] Add bridge presence handshake packets and later replace unsolicited
  MaGC-originated presence with bridge-originated ESP-NOW hello and compact
  shared-channel LoRa bridge join packets.
- [x] Gate full GC/MaGC snapshots behind an active bridge session; while
  inactive, wait for bridge-originated ESP-NOW hello or LoRa bridge join.
- [x] Service due bridge snapshots from a safe post-telemetry RX slot so a
  healthy fast assigned drone does not starve the bridge backhaul.
- [x] Service due bridge snapshots between complete shared Bind/search
  listen windows so a zero-assignment or all-lost GC still stays visible to the
  bridge without fragmenting SF12 discovery RX.
  - SF12/BW125 discovery JOIN requests take about `925.7 ms` for legacy JOIN
    and about `1187.8 ms` for extended JOIN; bridge LoRa maintenance must not
    retune away from shared inside that receive window.
  - Zero-assignment passive Bind / MaGC shared listening now uses the longer
    discovery dwell instead of the old short shared dwell, so bridge backhaul
    work does not phase-lock against long JOIN requests.
- [x] Give critical shared discovery priority over LoRa bridge fallback during
  the initial no-assignment strong shared-RX window, operator Bind/Search, auto
  shared-RX recovery, and all-lost shared recovery. ESP-NOW bridge updates
  continue because they do not retune the SX1262; LoRa bridge deltas are allowed
  again during idle shared listening only after a bridge session exists.
- [x] Fix dual-GC bridge backhaul starvation: MaGC now services ESP-NOW bridge
  snapshots before shared-discovery LoRa guards, and LoRa fallback uses only
  critical-window suppression rather than a permanent MaGC shared-listen block.
- [x] Fix MaGC shared-RX window starvation: `discoverySearchSharedDwellMs()`
  includes extended JOIN airtime, MaGC-owned discovery keeps unbroken shared RX
  dwell deadlines, and LoRa bridge fallback is allowed only after the current
  shared dwell has completed. ESP-NOW remains the 4 Hz bridge path during RX.
- [x] Fix active-assignment JOIN starvation: MaGC auto/operator recovery now uses
  a continuous `1200 ms` shared JOIN dwell, while `MAGC_SAFE_SHARED_RX_CHUNK_MS`
  stays at `75 ms` for short non-JOIN opportunistic borrowing.
- [x] Avoid sending LoRa bridge updates from bind-progress callbacks before a
  bridge LoRa session exists; pre-session bind progress should use ESP-NOW or
  wait until the shared bind sequence is complete.
- [x] Add bridge receiver ESP-NOW hello probing and shared-channel LoRa bridge
  join fallback behavior.
- [x] Make GC/MaGC provisioning enable backhaul by default while keeping an
  explicit disable override for bench use.
- [x] Add command duplicate cache and retry-safe ACK state.
- [x] Add assignment placeholder records to bridge snapshots.
- [x] Add compact bind-progress fields to bridge snapshots so bridge-connected
  SGC can animate Bind phases like direct GC USB.
- [x] Add compact `BRIDGE_LIVE_DELTA 0xB2/v1` packets for frequent LoRa fallback
  scene/status updates without sending full 214-byte snapshots every time.
- [x] Send LoRa compact deltas every `250 ms` only when ESP-NOW is stale and a
  LoRa bridge session is active.
- [x] Keep full `BRIDGE_SNAPSHOT 0xB1/v3` packets for session activation,
  metadata refresh, and cache recovery every about `5000 ms`.
- [x] Schedule GC/MaGC downlink TX followed by uplink RX slot.
- [x] Decode `BRIDGE_COMMAND`, map it into existing command handling, and ACK
  accepted/rejected/duplicate.
- [x] Include bridge ACK/control status in downlink.
- [x] Send safe bridge progress snapshots from inside the shared-channel Bind
  flow at assignment creation, silence, assign, ACK, completion, failure, and
  telemetry timing transitions, then retune to shared discovery before
  continuing Bind.
- [x] Defer non-terminal LoRa bridge updates during the critical shared-channel
  Bind dialog so bridge traffic does not disturb timing.
- [x] Service active LoRa bridge sessions during long CAD scans between samples,
  with compact scan status in the live delta header.
- [x] Queue browser commands on the bridge receiver, transmit one command in the
  scheduled uplink slot, and retry until ACK.
- [x] Emit standard USB `command_ack` when ACK arrives.
- [x] Convert V2 downlink state into existing SGC JSON. Event-batch downlink is
  still deferred.
- [x] Enable GC-mutating controls in bridge mode only when `bridgeControl` is
  fresh.
- [x] Route bridge-mode mutating commands to the bridge serial queue instead of
  rejecting them.
- [x] Render card-only bridge drones without GPS.
- [x] Show bridge command pending/ACK states in existing UI/debug areas.
- [x] Update bridge, serial JSON, firmware, and SGC plan docs.
- [x] Update build/flash guide with "GC with backhaul control enabled" and
  bridge receiver test steps.

## Test Plan

- Static:
  - `pio run -e seeed-xiao-s3`
  - `node --check script.js`
  - `git diff --check`
- RF bench:
  - GC and bridge connected by USB simultaneously.
  - Confirm GC downlink frames arrive at bridge.
  - Queue `ping`; confirm bridge transmits only after downlink and SGC receives
    ACK.
  - Drop/ignore one ACK and confirm retry does not execute duplicate command
    twice.
  - Send `start_search` through bridge and verify GC enters Bind/Search.
  - Send `relock_drone nodeId=6` through bridge and verify normal Re-bind
    behavior.
  - Send `set_radio_profile` through bridge and verify new joins use the
    profile.
  - Send `rescan_channels` through bridge and verify scan status appears in SGC.
  - Send `clear_assignment` and `clear_all_assignments` only after existing SGC
    confirmations.
- UI bench:
  - With drone off and persisted assignment present, bridge SGC shows a
    card-only `OFFLINE/OFF/BINDING` drone.
  - During Bind/Search, bridge SGC shows binding progress/status.
  - With no bridge downlink for `>3 s`, controls disable and stale status
    appears.
  - Direct GC USB still works exactly as before.
- Range bench:
  - Test bridge in same room, then roof/room separation.
  - Confirm command ACK latency is normally under `2 s` and retries recover after
    occasional packet loss.

## Assumptions

- V2 still uses one GC-side LoRa radio; bridge command uplink is scheduled
  immediately after GC downlink to avoid random collisions.
- One bridge receiver is active per GC/MaGC in v2.
- Bridge command queue is RAM-only.
- HOME markers remain local/browser/cloud state and are not sent over RF bridge.
- Full raw USB JSON forwarding over LoRa is intentionally avoided; RF uses
  compact binary state and command packets.
- Default LoRa full-snapshot downlink remains slow metadata refresh; compact
  live deltas provide the normal `4 Hz` LoRa fallback scene update.
