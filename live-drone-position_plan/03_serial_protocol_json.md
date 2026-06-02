# Part 3: USB Serial JSON Protocol Plan

Goal: define the serial protocol between SGC and the GC ESP32.

This protocol is separate from the LoRa air protocol. LoRa stays compact binary. USB serial uses newline-delimited JSON so SGC can parse and display data easily.

## Transport Decisions

- [ ] Use USB serial between browser SGC and GC ESP32.
- [ ] Start with baud rate `115200` unless testing shows it is too slow.
- [ ] Use newline-delimited JSON, one JSON object per line.
- [ ] Allow non-JSON firmware logs during development, but SGC should ignore or display them separately.
- [ ] Prefer stable field names over compact JSON names.
- [ ] Use human-readable units in serial JSON.

## Units

- [ ] Latitude: decimal degrees.
- [ ] Longitude: decimal degrees.
- [ ] Altitude: meters.
- [ ] Ground speed: meters per second.
- [ ] Heading/course/yaw: degrees.
- [ ] Frequency: MHz.
- [ ] RSSI: dBm.
- [ ] SNR: dB.
- [ ] Time: milliseconds where relative, Unix milliseconds where host-provided.

## GC To SGC Messages

- [ ] Milestone 1: Define drone telemetry JSON
  - [ ] Include `type`.
  - [ ] Include `nodeId`.
  - [ ] Include `lat`.
  - [ ] Include `lng`.
  - [ ] Include `alt`.
  - [ ] Include `heading`.
  - [ ] Include `headingSource`.
  - [ ] Include `courseOverGround`.
  - [ ] Include `yaw`.
  - [ ] Include `groundSpeed`.
  - [ ] Include `satelliteCount`.
  - [ ] Include `rssi`.
  - [ ] Include `snr`.
  - [ ] Include `frequencyMhz`.
  - [ ] Include `sequenceId`.
  - [ ] Include GC receive timestamp or age metadata.

Candidate:

```json
{"type":"drone_telemetry","nodeId":2,"lat":32.0596637,"lng":34.8503487,"alt":18.4,"heading":127.5,"headingSource":"course_over_ground","courseOverGround":127.5,"yaw":132.0,"groundSpeed":4.2,"satelliteCount":12,"rssi":-82,"snr":9.5,"frequencyMhz":916.0,"sequenceId":44,"receivedAt":1710000000000}
```

- [ ] Milestone 2: Define GC status JSON
  - [ ] Include `type`.
  - [ ] Include GC node ID.
  - [ ] Include shared frequency.
  - [ ] Include active radio profile.
  - [ ] Include telemetry airtime estimate.
  - [ ] Include telemetry transmit period.
  - [ ] Include assigned drone count.
  - [ ] Include clear channel count.
  - [ ] Include current scan mode.

Candidate:

```json
{"type":"gc_status","nodeId":0,"sharedFrequencyMhz":915.0,"spreadingFactor":8,"bandwidthHz":500000,"codingRate":5,"txPowerDbm":22,"telemetryAirtimeMs":25.7,"txPeriodMs":27,"assignedDrones":3,"clearChannels":48,"scanMode":"telemetry"}
```

- [ ] Milestone 3: Define assignment event JSON
  - [ ] Emit an event when a join request is received.
  - [ ] Emit an event when a silence message is sent.
  - [ ] Emit an event when a join assignment is sent.
  - [ ] Emit an event when a join ACK is received.
  - [ ] Emit an event when a channel assignment becomes active.
  - [ ] Emit an event when a channel assignment expires or is removed.

Candidate:

```json
{"type":"assignment_event","event":"assigned","nodeId":2,"frequencyMhz":916.0,"channelIndex":27,"leaseSeconds":60}
```

- [ ] Milestone 4: Define channel table JSON
  - [ ] Report shared channel.
  - [ ] Report reserved channels.
  - [ ] Report candidate telemetry channels.
  - [ ] Report noisy/discarded channels.
  - [ ] Report active assignments.

Candidate:

```json
{"type":"channel_table","sharedFrequencyMhz":915.0,"reservedFrequencyMhz":[914.5,915.5],"clearFrequencyMhz":[902.5,903.0,903.5],"noisyFrequencyMhz":[920.5],"assignments":[{"nodeId":2,"frequencyMhz":916.0}]}
```

- [ ] Milestone 5: Define error/warning JSON
  - [ ] Report serial protocol errors.
  - [ ] Report LoRa radio errors.
  - [ ] Report assignment failures.
  - [ ] Report MSP read failures.
  - [ ] Report flash persistence failures.

Candidate:

```json
{"type":"warning","code":"join_ack_timeout","nodeId":2,"message":"JOIN_ACK not received after assignment retry window"}
```

## SGC To GC Messages

- [ ] Milestone 6: Define read-only v1 commands
  - [ ] Define `get_status`.
  - [ ] Define `get_channel_table`.
  - [ ] Define `get_assignments`.
  - [ ] Define `ping`.

- [ ] Milestone 7: Define configurable radio settings
  - [ ] Define a command to set spreading factor.
  - [ ] Define a command to set bandwidth.
  - [ ] Define a command to set coding rate.
  - [ ] Define a command to set airtime buffer.
  - [ ] Keep TX power fixed at `22 dBm` for SX1262.
  - [ ] Decide whether settings apply immediately or after reboot.
  - [ ] Decide whether settings are persisted automatically or only after explicit save.

Candidate:

```json
{"type":"set_radio_profile","spreadingFactor":8,"bandwidthHz":500000,"codingRate":5,"airtimeBufferMs":1}
```

- [ ] Milestone 8: Define assignment maintenance commands
  - [ ] Define a command to clear one assignment.
  - [ ] Define a command to clear all assignments.
  - [ ] Define a command to force a channel rescan.
  - [ ] Define a command to reassign a drone to a new clear channel.

## Parser Rules

- [ ] Milestone 9: Define SGC parser behavior
  - [ ] Parse only complete newline-delimited JSON objects.
  - [ ] Ignore empty lines.
  - [ ] Show non-JSON lines in a debug log.
  - [ ] Validate required fields per message type.
  - [ ] Drop invalid telemetry without crashing.
  - [ ] Store unknown fields for debugging where practical.

- [ ] Milestone 10: Define firmware serializer behavior
  - [ ] Keep telemetry JSON line length reasonable.
  - [ ] Avoid pretty-printing JSON over serial.
  - [ ] Always terminate JSON messages with newline.
  - [ ] Avoid mixing partial log text into JSON lines.
  - [ ] Consider disabling human logs when SGC is connected.
