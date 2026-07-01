# Part 13: GC/Bridge Serial Debug Pipeline

## Summary

Goal: make GC/bridge debugging possible without SGC by using newline-delimited
JSON serial commands on both USB ports and one correlated host-side log.

Current bench defaults:

- GC: `COM18`, `921600`, role `ground_station`.
- Bridge: `COM4`, `921600`, role `bridge_receiver`.
- Bridge RF: `902.0 MHz / SF7 / BW500 / CR4/5`.

Direct GC serial commands already exist. Bridge USB commands also exist and now
serve read-only cache queries locally while forwarding action commands to the GC
through the scheduled RF uplink.

## Serial Commands

All commands use one JSON object per line:

```json
{"type":"command","command":"get_status","commandId":"dbg-001"}
{"type":"command","command":"get_channel_table","commandId":"dbg-002"}
{"type":"command","command":"get_assignments","commandId":"dbg-003"}
{"type":"command","command":"start_search","commandId":"dbg-004"}
{"type":"command","command":"rescan_channels","commandId":"dbg-005"}
{"type":"command","command":"relock_drone","commandId":"dbg-006","nodeId":7}
{"type":"command","command":"set_radio_profile","commandId":"dbg-007","radioProfileId":0,"persist":true}
{"type":"command","command":"clear_assignment","commandId":"dbg-008","nodeId":7}
{"type":"command","command":"clear_all_assignments","commandId":"dbg-009"}
```

Bridge receiver behavior:

- `ping`, `get_status`, `get_channel_table`, and `get_assignments` answer from
  the bridge cache immediately.
- `start_search`, `rescan_channels`, `set_radio_profile`, `relock_drone`,
  `clear_assignment`, and `clear_all_assignments` are queued for RF uplink.
- RF command ACKs are emitted as normal USB `command_ack` lines.

## Debug Tool

Use `tools/gc_bridge_serial_debug.py`:

```powershell
python tools/gc_bridge_serial_debug.py --gc COM18 --bridge COM4 --duration 60 --log logs_summary/gc_bridge_debug.jsonl
```

Send canned commands:

```powershell
python tools/gc_bridge_serial_debug.py --gc COM18 --bridge COM4 --duration 20 --send gc:status --send bridge:status
python tools/gc_bridge_serial_debug.py --gc COM18 --bridge COM4 --duration 30 --send gc:bind
python tools/gc_bridge_serial_debug.py --gc COM18 --bridge COM4 --duration 30 --send bridge:bind
python tools/gc_bridge_serial_debug.py --gc COM18 --bridge COM4 --duration 30 --send bridge:rebind:7
```

Interactive mode:

```powershell
python tools/gc_bridge_serial_debug.py --gc COM18 --bridge COM4 --interactive --log logs_summary/gc_bridge_interactive.jsonl
```

Interactive examples:

```text
gc status
bridge status
both assignments
gc bind
bridge bind
bridge rebind 7
bridge profile 0 persist
```

Do not keep SGC open on the same COM port while using this tool.

## Required Diagnostics

GC `gc_status` should include:

- `bridgeJoinRequestRxCount`
- `bridgeJoinAckTxCount`
- `bridgeBackhaulProfileId`
- `bridgeSnapshotTxCount`
- `bridgeHelloRxCount`
- `bridgeCommandRxCount`
- `bridgeLastServiceReason`
- `bridgeSessionActive`

Bridge `gc_status` should include:

- `bridgeHandshake`
- `bridgeJoinAttemptCount`
- `bridgeJoinAckRxCount`
- `bridgeJoinRequestedProfileId`
- `bridgeJoinAcceptedProfileId`
- `bridgeSnapshotRxCount`
- `bridgeHelloTxCount`
- `bridgeCommandTxCount`
- `bridgeLastRfEvent`
- `bridgeCommandQueueDepth`

Expected healthy sequence:

```text
Bridge: ESP-NOW hello probe tx
GC:     BRIDGE session active source=espnow
GC:     BRIDGE backhaul snapshot tx ok
Bridge: bridgeHandshake:"live", bridgeControl:true
Bridge: drones_state source:"lora_bridge"
```

If ESP-NOW does not produce a downlink for more than `6 s`, the expected LoRa
fallback sequence is:

```text
Bridge: shared-channel bridge join tx profile=<id>
GC:     bridgeJoinRequestRxCount increments
GC:     bridgeJoinAckTxCount increments
Bridge: bridgeJoinAckRxCount increments
Bridge: bridgeHandshake:"joined_waiting_downlink" then "live"
```

## Current Bench Finding

The first dual-port capture after this tool was added showed:

- GC `COM18` booted as `ground_station` with `backhaul enabled: yes`.
- Bridge `COM4` booted as `bridge_receiver`, initialized its SX1262, and answered
  cached USB commands.
- GC radio init failed with `SX1262 begin() failed: -2`.
- `-2` is RadioLib `RADIOLIB_ERR_CHIP_NOT_FOUND`.
- GC entered OTA-only mode with `meshReady:false`, `radioReady:false`, and
  `radioError:"mesh_init_failed"`.
- Because the GC mesh/radio was not ready, it could not receive bridge join
  requests or transmit snapshots, so the bridge correctly stayed in discovery.

This failure is therefore below the bridge protocol layer. Check that `COM18` is
the real GC LoRa board, then power-cycle or inspect the GC SX1262 wiring/module.
The terminal fallback should still answer `ping` and `get_status` in this state.

## Debug Pipeline

1. Flash both boards from the same firmware build.
   - GC on `COM18`: use GC provisioning if config may be stale, or firmware-only
     flash when LittleFS config is known-good.
   - Bridge on `COM4`: provision as `bridge_receiver`.
2. Start dual-port capture for at least `60 s`.
3. Confirm boot roles and bridge profile.
4. Confirm handshake counters:
   - Bridge `bridgeHelloTxCount` increases while probing ESP-NOW.
   - GC `bridgeHelloRxCount` increases after bridge ESP-NOW hello.
   - If ESP-NOW is stale, Bridge `bridgeJoinAttemptCount` increases.
   - If MaGC hears shared-channel fallback, GC `bridgeJoinRequestRxCount` and
     `bridgeJoinAckTxCount` increase.
   - Bridge `bridgeJoinAttemptCount` increases after no downlink for about
     `6 s`, and the requested profile rotates through the fallback ladder if no
     downlink follows.
   - GC `bridgeSnapshotTxCount` increases after session activation.
   - Bridge `bridgeSnapshotRxCount` increases after snapshots.
5. Confirm drone path:
   - Direct GC: `gc status`, `gc assignments`.
   - Bridge cache: `bridge status`, `bridge assignments`.
   - If no assignment exists, run `gc bind` first.
   - Then run `bridge bind` and verify RF command ACK behavior.
6. Reproduce historical failure modes:
   - zero assignments/passive Bind still accepts bridge-originated discovery.
   - shared Bind/Search still allows ESP-NOW snapshots or delayed LoRa snapshots
     between complete shared-RX windows.
   - healthy 10 Hz assigned drone still allows about 1 Hz bridge snapshots.
   - bridge powered after GC becomes live through ESP-NOW when available.
   - bridge with no ESP-NOW downlink starts shared-channel LoRa join after about
     `6 s`.

## Checklist

- [x] Direct GC serial commands support the required JSON command set.
- [x] Bridge serial commands support the same JSON command envelope.
- [x] Bridge read-only commands emit cached status/table/assignments immediately.
- [x] Add GC bridge counters and last service reason to `gc_status`.
- [x] Add bridge RF counters and last RF event to bridge `gc_status`.
- [x] Add host-side dual-port serial debug tool.
- [ ] Bench-verify direct GC `start_search` and `rescan_channels` through the debug tool.
- [ ] Bench-verify bridge RF `start_search` command and ACK through the debug tool.
- [ ] Bench-verify bridge stays live during Bind/Search and after telemetry lock.
