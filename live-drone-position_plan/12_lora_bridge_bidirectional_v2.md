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

- Keep the bridge channel at `902.0 MHz / SF7 / BW500 / CR4/5`.
- GC/MaGC supports bridge backhaul by default, but only sends full snapshots
  after a bridge presence handshake.
- When no bridge session is active, GC/MaGC sends a small `BRIDGE_BEACON`
  (`0xB0`) about every `1000 ms`, then opens the normal scheduled uplink slot.
- The bridge receiver listens continuously and replies with `BRIDGE_HELLO`
  (`0xC0`) in that slot. The next full snapshot is the hello ACK.
- While active, the bridge sends a queued command if one exists; otherwise it
  sends a `BRIDGE_HELLO` heartbeat at least every `2000 ms`.
- If GC/MaGC receives no bridge hello/command for `6000 ms`, it stops full
  snapshots and returns to beacon mode.
- GC/MaGC sends one normal downlink frame every `1000 ms`.
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

Upgrade the current `BRIDGE_SNAPSHOT` to version `2`.

Downlink must carry:

- Drone scene records, including GPS when known.
- Assignment placeholders even when no post-boot telemetry exists.
- Link states: `online`, `binding`, `weak`, `offline`, `off`, `unknown`.
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

Add a small `BRIDGE_EVENT_BATCH` packet only if needed for smooth UI. It may
carry compact assignment/search/scanner events during Bind/Search/scan. Default
behavior:

- Full scene snapshot: `1000 ms`.
- Compact status/event downlink during Bind/Search/scan: up to `4 Hz`.
- Do not send large channel tables at high rate.

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
- [x] Add bridge presence handshake packets: `BRIDGE_BEACON 0xB0` and
  `BRIDGE_HELLO 0xC0`.
- [x] Gate full GC/MaGC snapshots behind an active bridge session; use beacon
  mode while inactive and return to beacon mode after session timeout.
- [x] Service due bridge beacons/snapshots from a safe post-telemetry RX slot so
  a healthy fast assigned drone does not starve the bridge handshake.
- [x] Service due bridge beacons/snapshots while passively listening on shared
  Bind/search windows so a zero-assignment or all-lost GC still stays visible
  to the bridge.
- [x] Add bridge receiver hello-on-beacon and hello-heartbeat behavior.
- [x] Make GC/MaGC provisioning enable backhaul by default while keeping an
  explicit disable override for bench use.
- [x] Add command duplicate cache and retry-safe ACK state.
- [x] Add assignment placeholder records to bridge snapshots.
- [x] Schedule GC/MaGC downlink TX followed by uplink RX slot.
- [x] Decode `BRIDGE_COMMAND`, map it into existing command handling, and ACK
  accepted/rejected/duplicate.
- [x] Include bridge ACK/control status in downlink.
- [x] Send safe bridge progress snapshots from inside the shared-channel Bind
  flow after assignment creation and after ACK/completion, then retune to shared
  discovery before continuing Bind.
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
- Default bridge downlink remains `1000 ms`; compact status/event bursts up to
  `4 Hz` are allowed only during active Bind/Search/scan.
