# Part 3: USB Serial JSON Protocol Plan

Goal: define the serial protocol between SGC and the GC ESP32.

This protocol is separate from the LoRa air protocol. LoRa stays compact binary. USB serial uses newline-delimited JSON so SGC can parse and display data easily.

## Transport Decisions

- [x] Use USB serial between browser SGC and GC ESP32.
- [x] Start with baud rate `115200` unless testing shows it is too slow.
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
  - [x] Include `groundSpeed`.
  - [x] Include `satelliteCount`.
  - [x] Include `rssi`.
  - [x] Include `snr`.
  - [x] Include `frequencyMhz`.
  - [x] Include `sequenceId`.
  - [x] Include firmware-relative `gcMillis` timestamp.

Candidate:

```json
{"type":"drone_telemetry","nodeId":1,"lat":32.0596637,"lng":34.8503487,"alt":12.3,"heading":91.0,"headingSource":"course_over_ground","courseOverGround":91.0,"yaw":88.0,"groundSpeed":4.2,"satelliteCount":12,"rssi":-82,"snr":9.5,"frequencyMhz":916.0,"sequenceId":1,"gcMillis":123456}
```

- [x] Milestone 2: Define GC status JSON
  - [x] Include `type`.
  - [x] Include GC node ID.
  - [x] Include shared frequency.
  - [x] Include active radio profile.
  - [x] Include telemetry airtime estimate.
  - [x] Include telemetry transmit period.
  - [x] Include assigned drone count.
  - [x] Include clear channel count.
  - [x] Include current scan mode.

Candidate:

```json
{"type":"gc_status","nodeId":0,"sharedFrequencyMhz":915.0,"spreadingFactor":8,"bandwidthHz":500000,"codingRate":5,"txPowerDbm":22,"telemetryAirtimeMs":25.7,"txPeriodMs":27,"assignedDrones":1,"clearChannels":48,"scanMode":"serial_json_smoke","gcMillis":123456}
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
- `event`: one of `join_request_received`, `silence_sent`, `assign_sent`, `join_ack_received`, `assignment_active`, `assignment_expired`, `assignment_removed`.
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

Examples:

```json
{"type":"assignment_event","event":"join_request_received","nodeId":2,"rssi":-61,"snr":11.5,"gcMillis":123456}
{"type":"assignment_event","event":"silence_sent","recipientNodeId":255,"attempt":1,"gcMillis":123470}
{"type":"assignment_event","event":"assign_sent","nodeId":2,"recipientNodeId":2,"frequencyMhz":916.0,"channelIndex":27,"attempt":1,"gcMillis":123500}
{"type":"assignment_event","event":"join_ack_received","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"rssi":-63,"snr":10.8,"gcMillis":123540}
{"type":"assignment_event","event":"assignment_active","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"leaseSeconds":60,"gcMillis":123550}
{"type":"assignment_event","event":"assignment_removed","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"reason":"operator_clear","gcMillis":183550}
```

- [x] Milestone 4: Define channel table JSON
  - [x] Report shared channel.
  - [x] Report reserved channels.
  - [x] Report candidate telemetry channels.
  - [x] Report noisy/discarded channels.
  - [x] Report active assignments.

The GC firmware owns the channel table. SGC should display it and request refreshes, but should not independently allocate channels.

Required fields:

- `type`: always `channel_table`.
- `sharedFrequencyMhz`: discovery/assignment channel.
- `reservedFrequencyMhz`: frequencies excluded from telemetry assignment. This includes the shared channel guard area.
- `candidateFrequencyMhz`: all telemetry-center frequencies considered by the allocator.
- `clearFrequencyMhz`: candidate frequencies accepted after noise scan.
- `noisyFrequencyMhz`: candidate frequencies rejected after noise scan.
- `assignments`: active or persisted assignment records.
- `gcMillis`: firmware-relative GC timestamp.

Optional fields:

- `bandwidthHz`: bandwidth used when the table was produced.
- `channelSpacingMhz`: frequency spacing between candidate channel centers.
- `updatedAtGcMillis`: timestamp of the last scan/allocation update.

Assignment record fields:

- `nodeId`
- `frequencyMhz`
- `channelIndex`
- `persisted`
- `lastSeenGcMillis`
- `rssi`
- `snr`

Example:

```json
{"type":"channel_table","sharedFrequencyMhz":915.0,"reservedFrequencyMhz":[914.5,915.0,915.5],"candidateFrequencyMhz":[902.5,903.0,903.5,916.0],"clearFrequencyMhz":[902.5,903.0,916.0],"noisyFrequencyMhz":[903.5],"assignments":[{"nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"persisted":true,"lastSeenGcMillis":123456,"rssi":-82,"snr":9.5}],"bandwidthHz":500000,"channelSpacingMhz":0.5,"gcMillis":123500}
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
{"type":"gc_status","nodeId":0,"sharedFrequencyMhz":915.0,"spreadingFactor":8,"bandwidthHz":500000,"codingRate":5,"txPowerDbm":22,"telemetryAirtimeMs":25.7,"txPeriodMs":27,"assignedDrones":1,"clearChannels":48,"scanMode":"telemetry","gcMillis":123456}
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

- Default radio profile for this branch is SF8 / BW500 / CR4/5.
- TX power stays fixed at `22 dBm` in firmware and is reported in `gc_status`.
- Valid `spreadingFactor` values for this branch: `7`, `8`, `9`, `10`, `11`, `12`. UI should default to `8`.
- Valid `bandwidthHz` values for this branch: `125000`, `250000`, `500000`. UI should default to `500000`.
- Valid `codingRate` values use RadioLib denominator style: `5`, `6`, `7`, `8`, representing 4/5 through 4/8. UI should default to `5`.
- `airtimeBufferMs` is added to the computed telemetry airtime to define the scheduled transmit period.
- Settings apply at the next GC radio idle boundary, not mid-packet.
- Settings persist only when `persist` is `true`; SGC should send `persist:true` for operator profile changes.
- After accepting a change, GC emits `command_ack`, a new `gc_status`, and a new `channel_table` if the table changed.

Command example:

```json
{"type":"command","command":"set_radio_profile","commandId":"sgc-0100","spreadingFactor":8,"bandwidthHz":500000,"codingRate":5,"airtimeBufferMs":1,"persist":true}
```

- [x] Milestone 8: Define assignment maintenance commands
  - [x] Define a command to clear one assignment.
  - [x] Define a command to clear all assignments.
  - [x] Define a command to force a channel rescan.
  - [x] Define a command to reassign a drone to a new clear channel.

Assignment maintenance command examples:

```json
{"type":"command","command":"clear_assignment","commandId":"sgc-0200","nodeId":2,"persist":true}
{"type":"command","command":"clear_all_assignments","commandId":"sgc-0201","persist":true}
{"type":"command","command":"rescan_channels","commandId":"sgc-0202","persist":true}
{"type":"command","command":"reassign_drone","commandId":"sgc-0203","nodeId":2,"persist":true}
{"type":"command","command":"reassign_drone","commandId":"sgc-0204","nodeId":2,"frequencyMhz":917.0,"persist":true}
```

Maintenance response rules:

- Accepted maintenance commands emit `command_ack`.
- Commands that change assignments also emit one or more `assignment_event` messages.
- Commands that change channel availability or assignments emit an updated `channel_table`.
- Rejected commands emit `command_ack` with `accepted:false` and may also emit `warning` or `error`.

## Parser Rules

- [x] Milestone 9: Define SGC parser behavior
  - [x] Parse only complete newline-delimited JSON objects.
  - [x] Ignore empty lines.
  - [x] Show non-JSON lines in a debug log.
  - [x] Validate required fields per message type.
  - [x] Drop invalid telemetry without crashing.
  - [x] Store unknown fields for debugging where practical.

Implemented in `serial_probe.js` for the standalone probe:

- Known GC-to-SGC types are schema-checked: `drone_telemetry`, `gc_status`, `assignment_event`, `channel_table`, `command_ack`, `warning`, and `error`.
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

## Smoke Test Verification

- [x] `serial_probe.js` passes JavaScript syntax check with `node --check serial_probe.js`.
- [x] simple-mesh `seeed-xiao-s3` firmware builds with `ENABLE_SGC_SERIAL_JSON_SMOKE_TEST=1`.
- [x] simple-mesh `seeed-xiao-s3` firmware was uploaded to the connected ESP32 on `COM18`.
- [x] Direct `COM18` serial read parsed live smoke JSON from the ESP32: 10 `drone_telemetry` lines and 4 `gc_status` lines in a 6 second sample, mixed with 3 raw firmware log lines.
- [x] Browser Web Serial read after this smoke firmware flash is confirmed in `serial_probe.html` with live JSON appearing in the Parsed JSON panel.
