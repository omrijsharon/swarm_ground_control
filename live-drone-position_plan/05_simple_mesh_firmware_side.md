# Part 5: simple-mesh Firmware Side Plan

Goal: implement the live drone position protocol in the ESP32/LoRa firmware.

The firmware has two runtime roles in this branch:

- GC ESP32: connected to SGC over USB serial, owns discovery, assignment, channel scanning, heading fusion, and JSON output.
- Drone ESP32: connected to the flight controller over MSP, sends compact telemetry over LoRa.

## Milestones And Tasks

- [ ] Milestone 1: Add branch-specific firmware mode
  - [ ] Decide whether to add a compile flag or runtime config for live-position protocol.
  - [ ] Keep existing simple-mesh behavior available until the new protocol is proven.
  - [ ] Define GC role behavior for `node_id = 0`.
  - [ ] Define drone role behavior for nonzero node IDs.
  - [ ] Ensure old flood-mesh fields are not used in the new air protocol.

- [ ] Milestone 2: Implement binary packet definitions
  - [ ] Define packet type IDs for shared-channel control packets.
  - [ ] Define `JOIN_REQUEST` struct.
  - [ ] Define `SILENCE` struct.
  - [ ] Define `JOIN_ASSIGN` struct.
  - [ ] Define `JOIN_ACK` struct.
  - [ ] Define 20-byte telemetry struct.
  - [ ] Add compile-time size checks for every packet struct.
  - [ ] Define endian/scaling rules in comments next to the structs.
  - [ ] Enable LoRa PHY CRC.
  - [ ] Do not add a second payload CRC in v1.

- [ ] Milestone 3: Add configurable radio profile
  - [ ] Store spreading factor.
  - [ ] Store bandwidth.
  - [ ] Store coding rate.
  - [ ] Store preamble length.
  - [ ] Store airtime buffer milliseconds.
  - [ ] Keep SX1262 TX power fixed at `22 dBm`.
  - [ ] Default to `SF8 / BW500 / CR4/5 / preamble 8`.
  - [ ] Compute airtime for control and telemetry packet sizes.
  - [ ] Expose active profile in GC serial JSON.

- [ ] Milestone 4: Implement channel table and boot scan on GC
  - [ ] Define BW500 channel center table from `902.5` to `927.5 MHz`.
  - [ ] Mark `915.0 MHz` as shared discovery/control.
  - [ ] Mark `914.5 MHz` and `915.5 MHz` as reserved/guard.
  - [ ] Treat remaining channels as telemetry candidates.
  - [ ] Sample RSSI/noise floor on each candidate at boot.
  - [ ] Discard noisy channels.
  - [ ] Keep the clear channel list in memory.
  - [ ] Report clear/noisy channels over serial JSON.

- [ ] Milestone 5: Implement GC assignment persistence
  - [ ] Store `node_id -> frequencyMhz/channelIndex` assignments in flash.
  - [ ] Reload assignments at boot.
  - [ ] Validate reloaded channels against the clear channel scan.
  - [ ] Reassign drones if a persisted channel is now noisy.
  - [ ] Allocate new channels by uniform random selection from the clear candidate set.
  - [ ] Avoid assigning the same channel to multiple active drones.
  - [ ] Add a way to clear assignments during development.

- [ ] Milestone 6: Implement drone join state machine
  - [ ] Drone starts on shared discovery channel.
  - [ ] Drone waits random `25-250 ms` before requesting assignment.
  - [ ] Drone performs LBT before sending `JOIN_REQUEST`.
  - [ ] Drone includes node ID and nonce in `JOIN_REQUEST`.
  - [ ] Drone obeys `SILENCE` messages for the specified duration.
  - [ ] Drone accepts `JOIN_ASSIGN` only when node ID and nonce match.
  - [ ] Drone sends `JOIN_ACK`.
  - [ ] Drone switches to assigned telemetry channel after ACK.
  - [ ] Drone returns to join mode if assignment expires or radio config changes.

- [ ] Milestone 7: Implement GC shared-channel join handling
  - [ ] GC periodically returns to shared channel.
  - [ ] GC receives `JOIN_REQUEST`.
  - [ ] GC sends `SILENCE`.
  - [ ] GC selects or reuses an assignment for the drone.
  - [ ] GC sends `JOIN_ASSIGN`.
  - [ ] GC waits for `JOIN_ACK`.
  - [ ] GC repeats `SILENCE -> JOIN_ASSIGN -> ACK wait` if ACK is missed.
  - [ ] GC marks assignment active only after receiving telemetry on the assigned channel.
  - [ ] GC emits assignment events over serial JSON.

- [ ] Milestone 8: Implement drone MSP telemetry readout
  - [ ] Read GPS data using existing `BetaflightMSP::getRawGPS`.
  - [ ] Read attitude using existing `BetaflightMSP::getAttitude`.
  - [ ] Extract latitude and longitude.
  - [ ] Extract altitude.
  - [ ] Extract GPS course over ground.
  - [ ] Extract ground speed.
  - [ ] Extract satellite count.
  - [ ] Extract yaw.
  - [ ] Set telemetry validity flags.
  - [ ] Increment sequence ID for every telemetry packet.
  - [ ] Pack the 20-byte telemetry packet.

- [ ] Milestone 9: Implement drone telemetry TX loop
  - [ ] Compute telemetry airtime from active LoRa settings.
  - [ ] Compute transmit period as `ceil(airtime_ms) + airtime_buffer_ms`.
  - [ ] Transmit telemetry on the assigned channel.
  - [ ] Schedule the next transmission from the previous transmission start time.
  - [ ] Keep timing stable enough for GC phase tracking.
  - [ ] Handle missed MSP reads without crashing.
  - [ ] Encode invalid telemetry fields consistently.

- [ ] Milestone 10: Implement GC assigned-channel scanner
  - [ ] Maintain one scan state per assigned drone.
  - [ ] Tune to each assigned channel.
  - [ ] Receive a valid telemetry packet.
  - [ ] Record RSSI and SNR for the received packet.
  - [ ] Estimate packet start time from receive-done time and airtime.
  - [ ] Predict the next transmission start time.
  - [ ] Tune before predicted packet start by a guard interval.
  - [ ] Correct timing phase on every received packet.
  - [ ] Use longer listen windows after missed packets.
  - [ ] Cycle back to the shared channel regularly for new drones.

- [ ] Milestone 11: Implement GC heading fusion
  - [ ] Use course over ground when speed is reliable.
  - [ ] Start with CoG trust threshold around `4 m/s`.
  - [ ] Use yaw plus learned yaw bias when CoG is not reliable.
  - [ ] Estimate yaw bias from `CoG - yaw` when speed is above threshold and GPS quality is good.
  - [ ] Update yaw bias slowly rather than replacing it from one sample.
  - [ ] Avoid bias updates during obvious unstable movement if detectable.
  - [ ] Emit raw CoG, raw yaw, derived heading, and heading source in serial JSON.

- [ ] Milestone 12: Implement GC serial JSON output
  - [ ] Emit `drone_telemetry` on every valid received telemetry packet.
  - [ ] Emit RSSI/SNR measured by the GC receiver.
  - [ ] Emit assigned frequency in MHz.
  - [ ] Emit sequence ID.
  - [ ] Emit assignment events.
  - [ ] Emit GC status.
  - [ ] Emit channel table on request and after boot scan.
  - [ ] Keep JSON minified and newline-delimited.

- [ ] Milestone 13: Add firmware tests and field checks
  - [ ] Unit-check packet struct sizes.
  - [ ] Bench-test join flow with one drone.
  - [ ] Bench-test assignment persistence after GC reboot.
  - [ ] Bench-test channel scan with simulated noisy channels where possible.
  - [ ] Bench-test MSP telemetry packing with known values.
  - [ ] Field-test one drone at close range.
  - [ ] Field-test five drones at close range.
  - [ ] Field-test expected `0.5-2 km` range.
  - [ ] Log RSSI/SNR during range tests.

## Out Of Scope

- [ ] Do not implement mission commands.
- [ ] Do not implement arm/disarm/takeoff/land from SGC.
- [ ] Do not implement flood forwarding in this branch protocol.
- [ ] Do not implement multi-GC coordination in this branch.
