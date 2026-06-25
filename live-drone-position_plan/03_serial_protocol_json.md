# Part 3: USB Serial JSON Protocol Plan

Goal: define the serial protocol between SGC and the GC ESP32.

This protocol is separate from the LoRa air protocol. LoRa stays compact binary. USB serial uses newline-delimited JSON so SGC can parse and display data easily.

## Transport Decisions

- [x] Use USB serial between browser SGC and GC ESP32.
- [x] Start with baud rate `115200` unless testing shows it is too slow.
  - Bench update: GC USB serial and SGC defaults were raised to `921600` to reduce JSON output time. This helps the host-side pipeline, but it did not by itself make a `65 ms` assigned telemetry period reliable.
- [x] Use newline-delimited JSON, one JSON object per line.
- [x] Allow non-JSON firmware logs during development, but SGC should ignore or display them separately.
- [x] Prefer stable field names over compact JSON names.
- [x] Use human-readable units in serial JSON.

## Units

- [x] Latitude: decimal degrees.
- [x] Longitude: decimal degrees.
- [x] Altitude: meters.
- [x] Ground speed: meters per second.
- [x] Heading/course/yaw: degrees.
- [x] Frequency: MHz.
- [x] RSSI: dBm.
- [x] SNR: dB.
- [x] Time: milliseconds where relative, Unix milliseconds where host-provided. Smoke test uses firmware-relative `gcMillis`.

## GC To SGC Messages

- [x] Milestone 1: Define drone telemetry JSON
  - [x] Include `type`.
  - [x] Include `nodeId`.
  - [x] Include `lat`.
  - [x] Include `lng`.
  - [x] Include `alt`.
  - [x] Include `heading`.
  - [x] Include `headingSource`.
  - [x] Include `courseOverGround`.
  - [x] Include `yaw`.
  - [x] Include `yawHeading`, `yawBiasDeg`, `yawBiasValid`, `yawBiasSamples`, `cogWeight`, and `cogTrusted` for heading fusion debug.
  - [x] Include `groundSpeed`.
  - [x] Include `satelliteCount`.
  - [x] Include `gpsSource`.
  - [x] Include `gpsSimulated`.
  - [x] Include `gpsFixQuality`.
  - [x] Include `rssi`.
  - [x] Include `snr`.
  - [x] Include `frequencyMhz`.
  - [x] Include `radioProfileId`.
  - [x] Include `txPeriodMs`.
  - [x] Include `telemetryAirtimeMs`.
  - [x] Include optional period diagnostics: `periodSource`, `periodConfidence`, `timingAccepted`, and `timingObservationCount`.
  - [x] Include `expectedUpdateMs` from the GC scheduler so SGC can scale freshness for Fast/Balanced/Robust profiles.
  - [x] Include `sequenceId`.
  - [x] Include firmware-relative `gcMillis` timestamp.

Candidate:

```json
{"type":"drone_telemetry","nodeId":1,"lat":32.0596637,"lng":34.8503487,"alt":12.3,"heading":88.0,"headingSource":"yaw","courseOverGround":91.0,"yaw":88.0,"yawHeading":88.0,"yawBiasDeg":0.0,"yawBiasValid":false,"yawBiasSamples":0,"cogWeight":0.0,"cogTrusted":false,"groundSpeed":4.2,"satelliteCount":0,"gpsSource":"simulated","gpsSimulated":true,"gpsFixQuality":0,"rssi":-82,"snr":9.5,"frequencyMhz":916.0,"radioProfileId":0,"txPeriodMs":103,"telemetryAirtimeMs":25.7,"periodSource":"inferred_telemetry","periodConfidence":"locked","timingAccepted":true,"timingObservationCount":2,"expectedUpdateMs":320,"sequenceId":1,"gcMillis":123456}
```

- [x] Milestone 2: Define GC status JSON
  - [x] Include `type`.
  - [x] Include GC node ID.
  - [x] Include configured node role so SGC can distinguish single GC, MaGC, TeleGC, and bridge receiver USB sources.
  - [x] Include shared frequency.
  - [x] Include active radio profile.
  - [x] Include robust discovery radio profile.
  - [x] Include telemetry airtime estimate.
  - [x] Include discovery control-packet airtime estimates.
  - [x] Include telemetry transmit period.
  - [x] Include assigned drone count.
  - [x] Include clear channel count.
  - [x] Include current scan mode.
  - [x] Include optional orphan occupied-channel recovery status.
  - [x] Include optional all-lost recovery status.

Candidate:

```json
{"type":"gc_status","nodeId":0,"nodeRole":"telemetry_ground_control","sharedFrequencyMhz":915.0,"spreadingFactor":8,"bandwidthHz":500000,"codingRate":5,"discoverySpreadingFactor":12,"discoveryBandwidthHz":125000,"discoveryCodingRate":8,"discoveryJoinRequestAirtimeMs":925.7,"discoveryJoinAssignAirtimeMs":1187.8,"discoveryJoinAckAirtimeMs":925.7,"searchSharedDwellMs":3584,"txPowerDbm":22,"telemetryAirtimeMs":25.7,"txPeriodMs":100,"assignedDrones":1,"clearChannels":48,"allLostRecoveryActive":false,"allLostAssignedCount":0,"orphanRecoveryActive":false,"orphanRecoveryCandidates":0,"orphanRecoveredCount":0,"scanMode":"serial_json_smoke","gcMillis":123456}
```

All-lost recovery fields are optional. When the GC still has assignments but every active assignment is `OFFLINE` or `OFF`, firmware reports `allLostRecoveryActive:true`, `allLostRecoveryPhase:"shared_bind"` or `"assigned_rebind"`, and `allLostAssignedCount`. SGC uses `shared_bind` as the user-facing signal that the GC is already in shared-channel Bind mode even though assignments still exist.

`nodeRole` is `ground_station`, `magic_ground_control`,
`telemetry_ground_control`, or `bridge_receiver`. SGC accepts `ground_station`,
`telemetry_ground_control`, and `bridge_receiver` as valid direct USB sources.
If SGC sees `magic_ground_control` over USB, it warns the operator to connect
TeleGC instead.

Dual-GC TeleGC or MaGC mode may also emit `inter_gc_status` for the UART link.
SGC may infer the connected USB module from `inter_gc_status.source` when normal
`gc_status` has not arrived yet.
Clock-sync diagnostics include `clockSyncValid`, `clockOffsetUs`,
`clockUncertaintyUs`, `clockLastSyncMsAgo`, `clockBurstBestDelayUs`,
`clockAcceptedSamples`, `clockRejectedSamples`, `clockLastRejectReason`, and
`clockQuietActive`. `clockLastSyncMsAgo` should climb toward about `5000 ms` and
then return near zero while MaGC and TeleGC are connected, even if the best
offset estimate is only updated from the best sample in each sync burst.
MaGC recovery diagnostics may include `magcRecoveryActive`,
`magcRecoveryMode:"assigned_rebind"|"shared_rejoin"|"background_oocr"|"idle"`,
`magcRecoveryNodeId`, `magcRecoveryQueueDepth`, `magcNextOocrInMs`,
`magcLastRecoveryReason`, `magcSharedRejoinPriorityActive`,
`magcSharedRejoinWindowActive`, `magcSharedRejoinNodeId`,
`magcSharedRejoinRemainingMs`, `magcLostRecoveryPhase`,
`magcAssignedRecoveryAttempts`, `magcAssignedRecoveryMaxListenMs`, and
`magcSharedFallbackListenMs`. TeleGC asks MaGC for urgent assisted re-bind
after missed assigned telemetry; MaGC first listens on the drone's assigned
channel for `3 * txPeriodMs + max(120 ms, 2 * airtime)`, then opens one
`6000 ms` shared JOIN fallback, then retries assigned recovery once before
emitting `lost_link_recovery_exhausted`. MaGC background OOCR reports
progress through
`orphan_recovery_event` values such as `background_oocr_started`,
`background_oocr_slice`, `background_oocr_candidate_queued`,
`background_oocr_confirmation_deferred`, `background_oocr_confirmation_started`,
`background_oocr_paused`, and `background_oocr_complete`. Optional diagnostics
include `magcOocrChannelCursor`, `magcOocrProfileCursor`,
`magcOocrPendingConfirmation`, `magcOocrPendingChannelIndex`,
`magcOocrPendingRadioProfileId`, `magcOocrPendingAgeMs`,
`magcOocrNextSliceInMs`, and `magcOocrLastDeferReason`.

Bridge receiver mode uses the same USB serial transport but emits scene snapshots
instead of per-packet telemetry. A `bridge_receiver` device emits:

- `drones_state` with `source:"espnow_bridge"` or `source:"lora_bridge"`,
  `schemaVersion:1`, `sentAt`
  using bridge `millis()`, and a full `drones[]` snapshot decoded from
  `BRIDGE_SNAPSHOT` or reconstructed from compact `BRIDGE_LIVE_DELTA` packets.
- `gc_status` with `bridgeMode:true`, `backhaulFrequencyMhz`,
  `backhaulProfile:"SF7/BW500/CR4/5"`, `backhaulLastPacketAgeMs`,
  `backhaulRssi`, `backhaulSnr`, and `assignedDrones`.
- LoRa fallback bridge status may also include `bridgeLiveDeltaRxCount`,
  `bridgeFullSnapshotAirtimeMs`, and `txPeriodMs:250` while compact live deltas
  are the active downlink.
- ESP-NOW primary bridge status may also include `bridgeTransport`,
  `bridgePrimary`, `bridgeFallback`, `espnowBridgeLive`,
  `espnowBeaconLive`, `espnowProbing`, `espnowLastPacketAgeMs`,
  `espnowLastSnapshotAgeMs`, `loraFallbackLive`, `loraLastPacketAgeMs`,
  `bridgeFallbackReason`, `bridgePromotionCount`, and `bridgeDemotionCount`.

SGC treats serial `drones_state` as local telemetry: it stops mock mode, updates
live drones by `nodeId`, preserves local aliases, and can publish the same scene
to Cloudflare. In `bridgeMode`, SGC enables GC-mutating controls only when
`bridgeControl:true` and the bridge downlink is fresh.

Example bridge serial messages:

```json
{"type":"drones_state","schemaVersion":1,"sentAt":123456,"source":"lora_bridge","drones":[{"nodeId":6,"lat":32.0596637,"lng":34.8503487,"alt":18.4,"heading":127.5,"headingSource":"bridge_snapshot","courseOverGround":127.5,"yaw":130,"groundSpeed":8.4,"satelliteCount":12,"rssi":-78,"snr":9.5,"frequencyMhz":905.5,"radioProfileId":0,"sequenceId":44,"ageMs":180,"displayState":"online","txPeriodMs":100}]}
{"type":"gc_status","nodeId":0,"radioProfileId":9,"sharedFrequencyMhz":915.0,"spreadingFactor":7,"bandwidthHz":500000,"codingRate":5,"txPowerDbm":22,"telemetryAirtimeMs":66.6,"txPeriodMs":1000,"assignedDrones":1,"bridgeMode":true,"backhaulFrequencyMhz":902.0,"backhaulProfile":"SF7/BW500/CR4/5","backhaulLastPacketAgeMs":250,"backhaulRssi":-61,"backhaulSnr":12.5,"scanMode":"bridge_receiver","gcMillis":123456}
```

- [x] Milestone 3: Define assignment event JSON
  - [x] Emit an event when a join request is received.
  - [x] Emit an event when a silence message is sent.
  - [x] Emit an event when a join assignment is sent.
  - [x] Emit an event when a join ACK is received.
  - [x] Emit an event when a channel assignment becomes active.
  - [x] Emit an event when a channel assignment expires or is removed.

Required common fields:

- `type`: always `assignment_event`.
- `event`: one of `join_request_received`, `silence_sent`, `assign_sent`, `join_ack_received`, `late_join_ack_received`, `assignment_active`, `assignment_expired`, `assignment_removed`.
- Telemetry period inference events also use this type: `telemetry_period_observed`, `telemetry_period_locked`, and `telemetry_period_rejected`.
- Deprecated timing-handshake compatibility events may still appear from mixed/old firmware: `tx_period_proposal_ignored`.
- `gcMillis`: firmware-relative GC timestamp.

Optional event fields:

- `nodeId`: drone node ID when the event is drone-specific.
- `recipientNodeId`: packet recipient, usually the drone node ID or `255` for broadcast.
- `frequencyMhz`: assigned telemetry frequency.
- `channelIndex`: allocator index of the assigned telemetry channel.
- `leaseSeconds`: assignment lease duration when leases are enabled.
- `attempt`: retry/attempt counter for repeated assign/silence cycles.
- `rssi`, `snr`: link metrics when the event came from a received packet.
- `reason`: reason for expiration/removal/failure.
- `timingAccepted`: true after the GC infers the assigned-channel TX period from telemetry.
- `periodSource`, `periodConfidence`, `sequenceDelta`, `observedPeriodMs`, `previousObservedPeriodMs`, `timingObservationCount`: telemetry-period inference diagnostics.
- `measuredCycleMs`, `proposedPeriodMs`, `mspBatchMs`, `txDurationMs`, `mspFlags`, `ackStatus`: deprecated timing-proposal compatibility diagnostics.

Examples:

```json
{"type":"assignment_event","event":"join_request_received","nodeId":2,"rssi":-61,"snr":11.5,"gcMillis":123456}
{"type":"assignment_event","event":"silence_sent","recipientNodeId":255,"attempt":1,"gcMillis":123470}
{"type":"assignment_event","event":"assign_sent","nodeId":2,"recipientNodeId":2,"frequencyMhz":916.0,"channelIndex":27,"attempt":1,"gcMillis":123500}
{"type":"assignment_event","event":"join_ack_received","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"rssi":-63,"snr":10.8,"gcMillis":123540}
{"type":"assignment_event","event":"late_join_ack_received","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"reason":"join_ack","rssi":-63,"snr":10.8,"gcMillis":123900}
{"type":"assignment_event","event":"assignment_active","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"leaseSeconds":60,"gcMillis":123550}
{"type":"assignment_event","event":"assignment_removed","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"reason":"operator_clear","gcMillis":183550}
{"type":"assignment_event","event":"telemetry_period_observed","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"radioProfileId":0,"txPeriodMs":100,"timingAccepted":false,"periodSource":"inferred_telemetry","periodConfidence":"first_packet","sequenceId":41,"timingObservationCount":1,"gcMillis":123620}
{"type":"assignment_event","event":"telemetry_period_locked","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"radioProfileId":0,"txPeriodMs":103,"timingAccepted":true,"periodSource":"inferred_telemetry","periodConfidence":"single_delta","sequenceId":42,"sequenceDelta":1,"observedPeriodMs":103,"timingObservationCount":2,"gcMillis":123723}
```

Current timing note: the GC no longer waits for a separate timing proposal packet. It accepts valid 20-byte telemetry after `JOIN_ACK`, emits a first-packet observation, then locks the period from the next valid packet with a nonzero `sequenceDelta`.

SGC binding UI note: the web app now creates a pre-telemetry drone row from existing bind lifecycle events. `join_request_received` / `search_event.join_detected` starts the blue `BINDING` row, `silence_sent`, `assign_sent`, `join_ack_received`, `assignment_active`, `post_ack_lock_listen`, `assigned_acquire_listen`, and `telemetry_period_observed` advance the progress ring. First `drone_telemetry` moves the row to `Timing 1/2`; only `telemetry_period_locked` or telemetry with `timingAccepted:true` completes the temporary bind state. Firmware event names remain unchanged for compatibility.

Dual-GC binding progress note: MaGC may also emit best-effort `bind_progress_event` lines over the Inter-GC UART, and TeleGC forwards them to SGC over USB. These messages are UI-only and are not ACKed or retried; missing one must not affect binding. SGC uses `phase`, `phaseElapsedMs`, and `phaseExpectedMs` to animate the same pre-telemetry `BINDING` row used by direct GC USB and bridge snapshots.

```json
{"type":"bind_progress_event","event":"join_request_received","nodeId":6,"phase":"quiet","status":"active","phaseElapsedMs":0,"phaseExpectedMs":2500,"rssi":-72,"snr":9.5,"gcMillis":123456}
{"type":"bind_progress_event","event":"assign_sent","nodeId":6,"phase":"ack","status":"active","phaseElapsedMs":0,"phaseExpectedMs":1800,"frequencyMhz":916.0,"channelIndex":27,"radioProfileId":0,"txPeriodMs":103,"telemetryAirtimeMs":25,"gcMillis":123900}
{"type":"bind_progress_event","event":"telemetry_period_locked","nodeId":6,"phase":"complete","status":"complete","phaseElapsedMs":0,"phaseExpectedMs":200,"timingObservationCount":2,"reason":"single_delta","gcMillis":125200}
```

Protocol note: live-position air control packets now use high-range packet IDs `0xA1-0xA6`. These IDs are not exposed directly in serial JSON, but the change prevents assigned-channel telemetry from node IDs such as `6` from being mistaken for legacy timing-control packets. This is a breaking firmware change; the GC and all drone ESP32s must be reflashed together.

- [x] Milestone 3b: Define scanner event JSON
  - [x] Emit scheduler state changes and timing corrections as `scanner_event`.
  - [x] Include node/channel details for assigned-channel events.
  - [x] Include GC-local listen-window timing fields where useful.
  - [x] Include miss count and skipped-slot details for recovery debugging.
  - [x] Include profile-aware scheduler diagnostics where useful.
    - Scanner events may include `listenWindowMs`, `targetServiceMs`, `serviceStride`, and `schedulerCycleBudgetMs`.

Examples:

```json
{"type":"scanner_event","event":"assigned_listen","nodeId":2,"frequencyMhz":917.5,"channelIndex":30,"nextTstGcMillis":123456,"listenStartGcMillis":123448,"listenDeadlineGcMillis":123486,"listenWindowMs":60,"targetServiceMs":300,"serviceStride":3,"schedulerCycleBudgetMs":272,"missCount":0,"gcMillis":123440}
{"type":"scanner_event","event":"telemetry_period_acquire_missed","nodeId":2,"frequencyMhz":917.5,"channelIndex":30,"reason":"listen_window_expired","gcMillis":123610}
{"type":"scanner_event","event":"telemetry_received","nodeId":2,"estimatedTstGcMillis":123456,"nextTstGcMillis":123483,"missCount":0,"gcMillis":123482}
{"type":"scanner_event","event":"telemetry_missed","nodeId":2,"nextTstGcMillis":123510,"missCount":1,"reason":"listen_window_expired","gcMillis":123490}
{"type":"scanner_event","event":"phase_preserved_after_miss","nodeId":2,"missCount":1,"reason":"known_tst_preserved","gcMillis":123520}
{"type":"scanner_event","event":"cad_recovery_queued","nodeId":2,"missCount":12,"reason":"missed_expected_windows","gcMillis":123900}
{"type":"scanner_event","event":"cad_recovery_probe","nodeId":2,"activityDetected":false,"cadStatus":"free","autoRelockAttempt":1,"noActivityProbeCount":1,"reason":"no_activity_probe_pending","gcMillis":124000}
{"type":"scanner_event","event":"auto_relock_scheduled","nodeId":2,"autoRelockAttempt":1,"autoRelockMaxAttempts":5,"nextAutoRelockInMs":0,"reason":"weak_rssi_link_loss","gcMillis":124010}
{"type":"scanner_event","event":"auto_relock_listen","nodeId":2,"autoRelockAttempt":1,"reason":"cad_gated_auto_relock","gcMillis":124020}
{"type":"scanner_event","event":"search_skip_no_miss","nodeId":2,"skippedSlots":9,"reason":"shared_search_dwell","gcMillis":124200}
{"type":"scanner_event","event":"all_lost_shared_bind","reason":"all_assignments_lost","gcMillis":125000}
{"type":"scanner_event","event":"all_lost_assigned_rebind","nodeId":2,"frequencyMhz":917.5,"channelIndex":30,"reason":"all_lost_assigned_rebind","gcMillis":128600}
{"type":"scanner_event","event":"all_lost_recovery_recovered","reason":"assigned_rebind_telemetry_received","gcMillis":129200}
```

Default firmware behavior suppresses high-rate scanner events such as `assigned_listen`, `assigned_acquire_listen`, `shared_listen`, and `telemetry_received` unless `LIVE_POSITION_VERBOSE_SCANNER_EVENTS` is enabled. Keep normal `drone_telemetry` output lightweight enough that USB serial does not block the LoRa receive loop.

All-lost recovery events are emitted when the GC has at least one assignment and every active assignment is already classified `OFFLINE` or `OFF`. The GC alternates between `all_lost_shared_bind` on the robust discovery channel and `all_lost_assigned_rebind` full-RX windows on the existing assignments until valid telemetry or a successful bind recovers at least one drone. This loop does not delete persisted assignments.

- [x] Milestone 3c: Define orphan occupied-channel recovery JSON
  - [x] Emit recovery lifecycle events as `orphan_recovery_event`.
  - [x] Include candidate channel/profile details while listening.
  - [x] Include decoded node/sequence/RSSI/SNR details when packets are seen.
  - [x] Distinguish CAD-suspect channels from decoded/confirmed drone telemetry.
  - [x] Emit `confirmation_listen` and `confirmed_drone` events before assignment recovery.
  - [x] Emit `assignment_event.event = "orphan_assignment_recovered"` after a recovered assignment is recreated.
  - [x] Keep recovered drones on the normal `drone_telemetry`, `assignments`, and `channel_table` paths after recovery.

Examples:

```json
{"type":"orphan_recovery_event","event":"started","reason":"boot_no_assignments","candidateChannels":2,"recoveredCount":0,"gcMillis":123500}
{"type":"orphan_recovery_event","event":"confirmation_listen","channelIndex":27,"frequencyMhz":916.0,"radioProfileId":46,"profileName":"balanced","listenMs":720,"candidateChannels":2,"recoveredCount":0,"gcMillis":123510}
{"type":"orphan_recovery_event","event":"packet_seen","channelIndex":27,"frequencyMhz":916.0,"radioProfileId":46,"profileName":"balanced","nodeId":2,"sequenceId":44,"rssi":-74,"snr":8.5,"candidateChannels":2,"recoveredCount":0,"gcMillis":123620}
{"type":"orphan_recovery_event","event":"confirmed_drone","channelIndex":27,"frequencyMhz":916.0,"radioProfileId":46,"profileName":"balanced","nodeId":2,"sequenceId":44,"rssi":-74,"snr":8.5,"candidateChannels":2,"recoveredCount":0,"gcMillis":123621}
{"type":"orphan_recovery_event","event":"assignment_recovered","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"radioProfileId":46,"txPeriodMs":154,"rssi":-74,"snr":8.5,"candidateChannels":2,"recoveredCount":1,"gcMillis":123770}
{"type":"assignment_event","event":"orphan_assignment_recovered","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"radioProfileId":46,"txPeriodMs":154,"rssi":-74,"snr":8.5,"reason":"orphan_telemetry","gcMillis":123770}
{"type":"orphan_recovery_event","event":"complete","reason":"boot_no_assignments","candidateChannels":2,"recoveredCount":1,"gcMillis":124600}
```

- [x] Milestone 3d: Add GC serial capture diagnostics
  - [x] Add a laptop-side serial logger that writes timestamped JSONL from the GC USB serial stream.
    - Tool: `tools/gc_serial_logger.ps1`.
    - Default capture target: `COM18` at `921600` baud.
    - Generated logs are written under ignored `logs/`.
  - [x] Include host timestamps, firmware `gcMillis`, raw lines, parsed JSON, node IDs, sequence IDs, TST/listen-window fields, RSSI/SNR, and command/assignment/scanner event fields where present.
  - [x] Add summary output with per-node packet rate, sequence gaps, duplicates, and `telemetry_missed` counts.
    - Smoke run on GC `COM18` captured `184` `drone_telemetry` lines in `10 s` across nodes `1`, `2`, and `3`, with `0` `telemetry_missed` events and no parse errors.
  - [x] Keep a silent in-browser rolling diagnostic log of the Web Serial stream while SGC owns the port.
    - It records incoming GC lines and outgoing SGC commands with a `direction` field.
    - Browser console helpers: `downloadLiveGcLog()` exports JSONL, and `getLiveGcLog()` returns the current in-memory entries.
    - The retained browser log is a fixed `1024` entry ring with `logSequence`, `logSlot`, and `loggedAt` metadata so long bench runs cannot grow memory without bound.
  - [x] Expose the in-browser diagnostic log in the SGC USB panel for field debugging.
    - `Download` exported JSONL with a leading snapshot of current drones, assignments, link states, pending commands, recent scanner/search/assignment events, and GC status.
    - `Clear` reset the capture before reproducing a field issue.
    - Local UI actions such as Bind, Re-bind, serial open/close, and command timeouts are recorded alongside serial lines.
    - The visible controls were restored for the four-drone scheduler investigation.
  - [ ] Use a long capture during a multi-drone failure and attach the generated JSONL/summary notes to the scheduler bench results.

- [x] Milestone 4: Define channel table JSON
  - [x] Report shared channel.
  - [x] Report reserved channels.
  - [x] Report candidate telemetry channels.
  - [x] Report free and occupied candidate channels.
  - [x] Report active assignments.

The GC firmware owns the channel table. SGC should display it and request refreshes, but should not independently allocate channels.

Required fields:

- `type`: always `channel_table`.
- `sharedFrequencyMhz`: discovery/assignment channel.
- `reservedFrequencyMhz`: frequencies excluded from telemetry assignment. This includes the shared channel guard area.
- `candidateFrequencyMhz`: all telemetry-center frequencies considered by the allocator.
- `clearFrequencyMhz`: compatibility array for candidate frequencies classified `free` by CAD/LBT scan.
- `noisyFrequencyMhz`: compatibility array for candidate frequencies classified `occupied` by CAD/LBT scan.
- `assignments`: active or persisted assignment records.
- `gcMillis`: firmware-relative GC timestamp.

Optional fields:

- `bandwidthHz`: bandwidth used when the table was produced.
- `channelSpacingMhz`: frequency spacing between candidate channel centers.
- `updatedAtGcMillis`: timestamp of the last scan/allocation update.
- `freeChannels`, `occupiedChannels`, `assignedChannels`: summary counts.
- `channels[]`: per-channel objects with `state`, `activityDetected`, `detectedProfileIds`, and optional `displayRssi`.
- `state` may be `"unknown"` for telemetry candidates when CAD returned an error/unknown result; those channels are not counted as free or occupied.
- New activity-detail fields:
  - `activitySource`: `"none"`, `"cad"`, or `"decoded_telemetry"`.
  - `activityConfidence`: `"free"`, `"cad_suspect"`, `"confirmed_drone"`, or `"scan_error"`.
  - `cadStatus`: `"free"`, `"detected"`, or `"error"`.
  - `cadError`: true when CAD returned an error/unknown state that is not occupied evidence.
  - `listenAttempted`: true when OOCR tried normal RX confirmation on that channel/profile.
  - `confirmedDrone`: true after decoding a valid live-position telemetry packet.
  - `decodedNodeId`: node ID from the decoded packet when known.

Assignment record fields:

- `nodeId`
- `frequencyMhz`
- `channelIndex`
- `persisted`
- `lastSeenGcMillis`
- `rssi`
- `snr`
- `txPeriodMs`
- `telemetryAirtimeMs`
- `expectedUpdateMs`
- `timingAccepted`
- `missCount`
- `lastSequenceId`

Example:

```json
{"type":"channel_table","sharedFrequencyMhz":915.0,"reservedFrequencyMhz":[914.5,915.0,915.5],"candidateFrequencyMhz":[902.5,903.0,903.5,916.0],"clearFrequencyMhz":[902.5,903.0],"noisyFrequencyMhz":[903.5],"freeChannels":2,"occupiedChannels":1,"assignedChannels":1,"assignments":[{"nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"txPeriodMs":103,"expectedUpdateMs":320,"persisted":true,"lastSeenGcMillis":123456,"rssi":-82,"snr":9.5}],"channels":[{"channelIndex":2,"frequencyMhz":903.5,"role":"telemetry_candidate","state":"occupied","activityDetected":true,"activitySource":"cad","activityConfidence":"cad_suspect","cadStatus":"detected","cadError":false,"listenAttempted":false,"confirmedDrone":false,"detectedProfileIds":[46],"displayRssi":-76}],"bandwidthHz":500000,"discoverySpreadingFactor":12,"discoveryBandwidthHz":125000,"discoveryCodingRate":8,"channelSpacingMhz":0.5,"gcMillis":123500}
```

- [x] Milestone 5: Define error/warning JSON
  - [x] Report serial protocol errors.
  - [x] Report LoRa radio errors.
  - [x] Report assignment failures.
  - [x] Report MSP read failures.
  - [x] Report flash persistence failures.

Use `warning` for recoverable conditions and `error` for conditions that prevent the requested action or core telemetry path from continuing.

Required fields:

- `type`: `warning` or `error`.
- `code`: stable snake_case machine-readable code.
- `message`: short human-readable text for SGC logs.
- `gcMillis`: firmware-relative GC timestamp.

Optional fields:

- `nodeId`: affected drone.
- `subsystem`: `serial`, `lora`, `assignment`, `msp`, `flash`, or `radio_profile`.
- `severity`: `info`, `warning`, or `error`.
- `recoverable`: boolean.
- `detail`: small object with debugging fields.

Examples:

```json
{"type":"warning","code":"join_ack_timeout","nodeId":2,"subsystem":"assignment","severity":"warning","recoverable":true,"message":"JOIN_ACK not received after assignment retry window","gcMillis":123456}
{"type":"error","code":"flash_persist_failed","subsystem":"flash","severity":"error","recoverable":false,"message":"Channel assignment could not be saved to flash","detail":{"nodeId":2},"gcMillis":123500}
```

## SGC To GC Messages

- [x] Milestone 6: Define read-only v1 commands
  - [x] Define `get_status`.
  - [x] Define `get_channel_table`.
  - [x] Define `get_assignments`.
  - [x] Define `ping`.

SGC command rules:

- Commands are newline-delimited JSON objects sent from the browser to the GC ESP32 over the same USB serial connection.
- Every command should include a unique `commandId` generated by SGC.
- `hostMillis` is optional browser time. The GC should use `gcMillis` in responses.
- The GC should respond with `command_ack` for acceptance/rejection and then emit the requested data message when applicable.

Read-only command examples:

```json
{"type":"command","command":"ping","commandId":"sgc-0001","hostMillis":1710000000000}
{"type":"command","command":"get_status","commandId":"sgc-0002"}
{"type":"command","command":"get_channel_table","commandId":"sgc-0003"}
{"type":"command","command":"get_assignments","commandId":"sgc-0004"}
```

Response examples:

```json
{"type":"command_ack","commandId":"sgc-0001","command":"ping","accepted":true,"message":"pong","gcMillis":123456}
{"type":"gc_status","nodeId":0,"sharedFrequencyMhz":915.0,"spreadingFactor":8,"bandwidthHz":500000,"codingRate":5,"discoverySpreadingFactor":12,"discoveryBandwidthHz":125000,"discoveryCodingRate":8,"discoveryJoinRequestAirtimeMs":925.7,"discoveryJoinAssignAirtimeMs":1187.8,"discoveryJoinAckAirtimeMs":925.7,"searchSharedDwellMs":3584,"txPowerDbm":22,"telemetryAirtimeMs":25.7,"txPeriodMs":100,"assignedDrones":1,"clearChannels":48,"scanMode":"telemetry","gcMillis":123456}
```

- [x] Milestone 7: Define configurable radio settings
  - [x] Define a command to set spreading factor.
  - [x] Define a command to set bandwidth.
  - [x] Define a command to set coding rate.
  - [x] Define a command to set airtime buffer.
  - [x] Keep TX power fixed at `22 dBm` for SX1262.
  - [x] Decide whether settings apply immediately or after reboot.
  - [x] Decide whether settings are persisted automatically or only after explicit save.

Radio profile decision:

- Assigned telemetry profile `0` remains SF8 / BW500 / CR4/5.
- Shared discovery/join profile is firmware-known SF12 / BW125 / CR4/8 and is not assigned through `JOIN_ASSIGN`.
- TX power stays fixed at `22 dBm` in firmware and is reported in `gc_status`.
- Valid `spreadingFactor` values for this branch: `7`, `8`, `9`, `10`, `11`, `12`. UI should default to `8`.
- Valid `bandwidthHz` values for this branch: `125000`, `250000`, `500000`. UI should default to `500000`.
- Valid `codingRate` values use RadioLib denominator style: `5`, `6`, `7`, `8`, representing 4/5 through 4/8. UI should default to `5`.
- `airtimeBufferMs` is added to the computed telemetry airtime to define the scheduled transmit period.
- The computed assigned telemetry period must be no more than `TX_PERIOD_MAX_ACCEPT_MS = 2000`; otherwise the GC rejects `set_radio_profile` with `reason:"tx_period_out_of_range"`.
- Settings apply at the next GC radio idle boundary, not mid-packet.
- Settings persist only when `persist` is `true`; SGC should send `persist:true` for operator profile changes.
- After accepting a change, GC emits `command_ack`, a new `gc_status`, and a new `channel_table` if the table changed.

Command example:

```json
{"type":"command","command":"set_radio_profile","commandId":"sgc-0100","spreadingFactor":8,"bandwidthHz":500000,"codingRate":5,"airtimeBufferMs":44,"persist":true}
```

Implementation note: SGC now has a production UI picker that sends `set_radio_profile` for future assignments and previews local telemetry airtime. Firmware implements runtime switching between the fixed discovery profile and the selected assigned telemetry profile.

- [x] Milestone 8: Define assignment maintenance commands
  - [x] Define a command to clear one assignment.
  - [x] Define a command to clear all assignments.
  - [x] Define a command to force a channel rescan.
  - [x] Define a command to force runtime TST re-lock for one assigned drone.
  - [x] Define a command to reassign a drone to a new clear channel.

Assignment maintenance command examples:

```json
{"type":"command","command":"clear_assignment","commandId":"sgc-0200","nodeId":2,"persist":true}
{"type":"command","command":"clear_all_assignments","commandId":"sgc-0201","persist":true}
{"type":"command","command":"rescan_channels","commandId":"sgc-0202","persist":true}
{"type":"command","command":"relock_drone","commandId":"sgc-0205","nodeId":2}
{"type":"command","command":"reassign_drone","commandId":"sgc-0203","nodeId":2,"persist":true}
{"type":"command","command":"reassign_drone","commandId":"sgc-0204","nodeId":2,"frequencyMhz":917.0,"persist":true}
```

Maintenance response rules:

- Accepted maintenance commands emit `command_ack`.
- Commands that change assignments also emit one or more `assignment_event` messages.
- Commands that change channel availability or assignments emit an updated `channel_table`.
- Rejected commands emit `command_ack` with `accepted:false` and may also emit `warning` or `error`.

Implementation note: `rescan_channels` is implemented for manual spectrum refresh. It preserves existing assignments, emits `command_ack`, runs the GC channel scan, then emits fresh `channel_scan_event`, `channel_table`, and `gc_status` output. If the scan finds CAD-suspect telemetry candidates while there are zero active assignments, GC also enters Search/OOCR and may emit `search_event`, `orphan_recovery_event`, recovered assignments, and normal telemetry before the final `channel_table`/`gc_status`.

Implementation note: `relock_drone` is implemented for manual runtime TST recovery. It preserves the assignment and flash state, emits `command_ack`, emits `scanner_event.event = "manual_relock_scheduled"`, and lets the GC reacquire phase from normal assigned-channel telemetry.

Scheduler note: manual relock is intentionally preemptive for a bounded runtime-only window. The GC emits `scanner_event.event = "manual_relock_listen"` while it reserves assigned-channel receive time for that node, `manual_relock_retry` if a relock listen expires without telemetry, and `manual_relock_expired` if the bounded relock window elapses without reacquisition. This can temporarily reduce other drones' update rates, which is expected during operator-requested recovery.

Post-join lock note: after `JOIN_ACK`, the GC uses a bounded preemptive first-telemetry lock window. The current implementation still uses `post_ack_lock_*` scanner-event names internally, but the behavior now means “post assignment ACK, before telemetry-period lock” rather than “after TX_PERIOD_ACK.”

## Parser Rules

- [x] Milestone 9: Define SGC parser behavior
  - [x] Parse only complete newline-delimited JSON objects.
  - [x] Ignore empty lines.
  - [x] Show non-JSON lines in a debug log.
  - [x] Validate required fields per message type.
  - [x] Drop invalid telemetry without crashing.
  - [x] Store unknown fields for debugging where practical.

Implemented in `serial_probe.js` for the standalone probe:

- Known GC-to-SGC types are schema-checked: `drone_telemetry`, `gc_status`, `assignment_event`, `scanner_event`, `channel_table`, `command_ack`, `warning`, and `error`.
- Malformed JSON remains in the raw log with a parse error.
- Valid JSON with a known protocol `type` but missing/wrong required fields is moved to the raw log with `protocol invalid`.
- Valid JSON with no `type` or an unknown `type` remains visible in the parsed log with `_protocolWarnings`.
- Known typed messages with extra fields remain visible in the parsed log with `_unknownFields`.

- [x] Milestone 10: Define firmware serializer behavior
  - [x] Keep telemetry JSON line length reasonable.
  - [x] Avoid pretty-printing JSON over serial.
  - [x] Always terminate JSON messages with newline.
  - [x] Avoid mixing partial log text into JSON lines.
  - [x] Consider disabling human logs when SGC is connected.

Decision for this branch stage: keep human firmware logs enabled during development and smoke tests. The SGC probe explicitly tolerates mixed JSON/non-JSON streams. Before the serial protocol becomes the production operator path, add a GC firmware setting such as `serialMode:"json_only"` or `logLevel:"debug"` if raw logs become noisy or affect performance.

## Lifecycle And Spectrum Extensions

These tasks support `06_gc_lifecycle_spectrum_plan.md`.

- [x] Milestone 11: Implement GC lifecycle command handling
  - [x] GC accepts newline-delimited command JSON from SGC.
  - [x] GC implements `ping`.
  - [x] GC implements `get_status`.
  - [x] GC implements `get_channel_table`.
  - [x] GC implements `get_assignments`.
  - [x] GC implements `clear_all_assignments` as the serial command behind SGC `Start Fresh Session`.
  - [x] GC emits `command_ack` for every accepted or rejected command.
  - [x] GC emits updated `gc_status` after lifecycle commands.
  - [x] GC emits updated `channel_table` after commands that affect channels or assignments.

Fresh-session command:

```json
{"type":"command","target":"magc","command":"clear_all_assignments","commandId":"sgc-0300","persist":true,"reason":"start_fresh_session"}
```

Expected ACK:

```json
{"type":"command_ack","commandId":"sgc-0300","command":"clear_all_assignments","accepted":true,"message":"assignments cleared","gcMillis":123456}
```

- [x] Milestone 12: Define and implement scan progress JSON
  - [x] Emit `channel_scan_event` when the GC starts scanning.
  - [x] Emit per-channel scan results or compact batches while scanning.
  - [x] Emit `channel_scan_event` when scanning completes.
  - [x] Include `frequencyMhz`, `channelIndex`, and `state`.
  - [x] Emit `profile_scan_started` for each simple CAD pass: Fast, Balanced, and Robust.
  - [x] Include `radioProfileId`, `profileName`, `activityDetected`, and optional RSSI fields on profile-aware `channel_scanned` events.
  - [x] Include shared/guard/candidate role information where useful for SGC rendering.
  - [x] Keep the final `channel_table` as the authoritative post-scan state.
  - [x] Use the existing scan JSON stream for the temporary boot animation; no extra schema is required.
  - [x] Re-emit `channel_scanned` per profile pass so SGC updates the same bars as activity evidence accumulates.
  - [x] Include optional `scanPass` for scan debugging; consumers may ignore it.

Scan event examples:

```json
{"type":"channel_scan_event","event":"scan_started","candidateChannels":48,"gcMillis":123000}
{"type":"channel_scan_event","event":"profile_scan_started","candidateChannels":48,"radioProfileId":0,"profileName":"fast","gcMillis":123010}
{"type":"channel_scan_event","event":"channel_scanned","channelIndex":6,"frequencyMhz":905.5,"state":"occupied","activityDetected":true,"activitySource":"cad","activityConfidence":"cad_suspect","cadStatus":"detected","cadError":false,"detectedProfileIds":[0],"radioProfileId":0,"profileName":"fast","displayRssi":-82,"gcMillis":123050}
{"type":"channel_scan_event","event":"scan_complete","clearChannels":42,"noisyChannels":6,"freeChannels":42,"occupiedChannels":6,"assignedChannels":1,"fallbackUsed":false,"gcMillis":124200}
```

- [x] Milestone 13: Extend `channel_table` for spectrum rendering
  - [x] Include per-channel details in addition to the existing clear/noisy frequency arrays.
  - [x] Mark `shared`, `guard`, `telemetry_candidate`, `free`, `occupied`, and `assigned` channel states.
  - [x] Include `activityDetected`, `detectedProfileIds`, and `displayRssi` where useful for spectrum rendering.
  - [x] Include median and max RSSI values only when RSSI was measured for occupied/assigned display.
  - [x] Preserve the existing compact arrays for simple SGC summary counts.
  - [x] Keep `clearFrequencyMhz` as a free-channel compatibility array and `noisyFrequencyMhz` as an occupied-channel compatibility array.

Candidate extension:

```json
{"type":"channel_table","channels":[{"channelIndex":6,"frequencyMhz":905.5,"role":"telemetry_candidate","clear":false,"state":"occupied","activityDetected":true,"activitySource":"decoded_telemetry","activityConfidence":"confirmed_drone","cadStatus":"detected","cadError":false,"listenAttempted":true,"confirmedDrone":true,"decodedNodeId":2,"detectedProfileIds":[0,46],"displayRssi":-82},{"channelIndex":25,"frequencyMhz":915.0,"role":"shared","clear":false,"state":"reserved"}],"gcMillis":124250}
```

## Smoke Test Verification

- [x] `serial_probe.js` passes JavaScript syntax check with `node --check serial_probe.js`.
- [x] simple-mesh `seeed-xiao-s3` firmware builds with `ENABLE_SGC_SERIAL_JSON_SMOKE_TEST=1`.
- [x] simple-mesh `seeed-xiao-s3` firmware was uploaded to the connected ESP32 on `COM18`.
- [x] Direct `COM18` serial read parsed live smoke JSON from the ESP32: 10 `drone_telemetry` lines and 4 `gc_status` lines in a 6 second sample, mixed with 3 raw firmware log lines.
- [x] Browser Web Serial read after this smoke firmware flash is confirmed in `serial_probe.html` with live JSON appearing in the Parsed JSON panel.

## Field Follow-Up Serial Extensions

These tasks mirror `08_field_test_followups.md`.

- [x] Add SGC-to-GC `start_search`.
- [x] Add `gc_status.searchMode`.
- [x] Add `gc_status.searchSharedDwellMs` so SGC/debug can verify the discovery Search dwell.
- [x] Add `search_event` lifecycle messages: `search_started`, `join_detected`, `assignment_completed`, `search_telemetry_round`, `search_complete`, and `search_timeout`.
- [x] Add `drone_link_status` with `nodeId`, `state`, `activityDetected`, `txPeriodMs`, and `gcMillis`.
- [x] Define link states `locking`, `weak`, `offline`, and `off`.
- [x] Treat `off` as confirmed no-activity only.
  - GC emits `reason:"confirmed_no_activity"` only after two separate CAD/LBT no-activity probes on a drone that previously had RSSI stronger than `-114 dBm`.
  - Last RSSI `<= -114 dBm` or unknown keeps the missing drone `offline` rather than `off`.
- [x] Add CAD-gated auto relock diagnostics to `drone_link_status`.
  - Optional fields include `lastRssi`, `recoveryPhase`, `autoRelockAttempt`, `autoRelockMaxAttempts`, `nextAutoRelockInMs`, and `noActivityProbeCount`.
  - `autoRelockAttempt` now represents the CAD recovery slot number. A full RX re-bind listen is a pending action from that slot, not a periodic timer.
- [x] Add SGC-to-GC `clear_assignment` for deleting one persisted assignment.
- [x] Add SGC-to-GC `set_radio_profile` for future assignments.
- [x] Include default-assignment profile information in `gc_status`.
- [x] Include supported radio profile metadata in `channel_table` where useful.
- [x] Reject future assignment profiles whose computed TX period exceeds `2000 ms`.
- [ ] Bench-verify `start_search`, `clear_assignment`, and `set_radio_profile` from the browser against a flashed GC.

## Cloudflare Live Relay Extension

These tasks mirror `09_cloudflare_live_relay.md`.

- [x] Keep USB serial JSON as the authoritative operator-browser ingress from the GC ESP32.
- [x] Relay parsed GC-to-SGC JSON through a Cloudflare WebSocket endpoint for remote viewers.
- [x] Use `wss://www.flying-agents.com/swarm_ground_control/live/ws` as the live endpoint.
- [x] Use `role=publisher` for the operator browser and `role=viewer` for remote browsers.
- [x] Use one public `sessionId` named `public`.
- [x] Allow one public publisher connection for the field laptop.
- [x] Keep viewer connections read-only.
- [x] Relay display-oriented message types such as `drone_telemetry`, `gc_status`, `channel_table`, assignment/search/scanner/link/scan/session events, and `command_ack`.
- [x] Do not relay raw firmware log text.
- [x] Deploy and verify the Worker live endpoint with a direct WebSocket publisher/viewer smoke test.
- [ ] Verify a remote SGC browser can display relayed telemetry from an operator browser.

## LoRa Bridge V2 USB Contract

These tasks mirror `12_lora_bridge_bidirectional_v2.md`.

- [x] Bridge receiver emits USB `drones_state` with `source:"lora_bridge"` for RF snapshots.
- [x] Bridge receiver emits card-only drone entries when the GC reports an assignment but no GPS telemetry is known yet.
  - These entries include `nodeId`, `displayState`, `frequencyMhz`, `radioProfileId`, `txPeriodMs`, RSSI/SNR when known, and omit `lat`/`lng`.
- [x] Bridge receiver emits USB `gc_status` with `bridgeMode:true`, `bridgeControl`, `bridgeStale`, `bridgeCommandQueueDepth`, `backhaulLastPacketAgeMs`, `backhaulRssi`, and `backhaulSnr`.
- [x] Bridge receiver emits optional `bridgeHandshake` status such as `waiting_for_beacon`, `beacon_seen`, `live`, or `stale`.
- [x] Bridge receiver emits USB `command_ack` when a queued RF command is ACKed, rejected, or duplicate-ACKed by the GC/MaGC.
- [x] Fresh Session clears both bridge receiver cache and MaGC/TeleGC bridge scene caches so accepted bridge `clear_all_assignments` ACKs are followed by empty `drones_state`, `assignments`, `channel_table` when available, and `gc_status` until drones freshly rejoin.
- [x] After Fresh Session, MaGC ignores delayed non-empty Inter-GC bridge scene snapshots until TeleGC sends the first empty bridge scene snapshot, preventing one-frame stale card replay.
- [x] Inter-GC `bridge_scene_snapshot` is treated as a full scene snapshot: empty snapshots clear MaGC bridge scene records, and omitted nodes are invalidated instead of kept as stale cards.
- [x] Bridge receiver emits compact `assignments` and `channel_table` summaries from the latest RF snapshot.
- [x] Bridge receiver reconstructs USB `drones_state` and `gc_status` from compact `BRIDGE_LIVE_DELTA` LoRa fallback packets without requiring new SGC message types.
- [ ] Add a compact bridge event-batch USB mapping if we need event-level Bind/Search mirroring beyond the 250 ms compact snapshot/status path.

## ESP-NOW Bridge Primary USB Contract

These tasks mirror `14_espnow_bridge_primary_lora_fallback.md`.

- [x] Accept `drones_state` with `source:"espnow_bridge"`.
- [x] Add bridge status fields for ESP-NOW probing, snapshot age, fallback reason, and promotion/demotion counters.
- [x] Keep `source:"lora_bridge"` as fallback-compatible serial scene input.
- [x] Add bridge transport status fields for ESP-NOW primary and LoRa fallback.
