# Live Drone Position Project Plan

Branch: `feature/live-drone-position`

This branch narrows Swarm Ground Control from a broad C2 prototype into a live drone position viewer. The target system is one ground-control ESP32 LoRa module connected to SGC over USB serial, with about five drones reporting position over LoRa at roughly 2-5 Hz total map refresh per drone.

## Working Assumptions

- [ ] One GC is active in this branch.
- [ ] GC node ID is `0`.
- [ ] Drone node IDs are real external IDs and are displayed directly in SGC.
- [ ] Expected operating range is `0.5-2 km`.
- [ ] Expected drone count is about `5`.
- [ ] SGC receives telemetry over USB serial from the GC ESP32, not WebSocket.
- [ ] GC firmware owns channel allocation and persists assignments in ESP32 flash.
- [ ] SGC displays assigned telemetry frequency per drone.
- [ ] Drone telemetry over LoRa is compact binary.
- [ ] GC-to-SGC serial output is newline-delimited JSON.
- [ ] Mission commands, teams, waypoints, and command sequences are out of scope for this branch.

## Project Parts

- [ ] Milestone 1: Small serial test
  - [ ] Prove the browser-based SGC can open the GC ESP32 USB serial port.
  - [ ] Prove SGC can read serial lines from the ESP32.
  - [ ] Prove SGC can detect and parse newline-delimited JSON.

- [ ] Milestone 2: Air protocol
  - [ ] Define reduced binary LoRa packets for a single-GC star topology.
  - [ ] Define shared discovery/control channel behavior.
  - [ ] Define assigned telemetry channels and timing.
  - [ ] Define the 20-byte telemetry packet.

- [ ] Milestone 3: Serial protocol
  - [ ] Define GC-to-SGC JSON telemetry events.
  - [ ] Define GC-to-SGC assignment/status events.
  - [ ] Define any SGC-to-GC configuration commands needed for this branch.

- [ ] Milestone 4: SGC side
  - [ ] Add a live-position mode.
  - [ ] Hide command/C2 UI in live-position mode.
  - [ ] Read telemetry over USB serial.
  - [ ] Dynamically create and update drones on the map.
  - [ ] Show freshness, heading, RSSI/SNR, satellite count, speed, altitude, and frequency.

- [ ] Milestone 5: simple-mesh firmware side
  - [ ] Implement GC role for discovery, assignment, scanning, heading fusion, and serial JSON.
  - [ ] Implement drone role for join, assignment ACK, MSP telemetry readout, and telemetry TX.
  - [ ] Store GC channel assignments in flash.
  - [ ] Keep TX power fixed at `22 dBm` for SX1262.

## Key Defaults

- [ ] Radio default spreading factor: `SF8`.
- [ ] Radio default bandwidth: `500 kHz`.
- [ ] Radio default coding rate: `4/5`.
- [ ] Radio default preamble length: `8`.
- [ ] SX1262 TX power: `22 dBm`.
- [ ] Shared discovery frequency: `915.0 MHz`.
- [ ] Telemetry packet size: `20 bytes`.
- [ ] Telemetry airtime at `SF8 / BW500 / CR4/5 / preamble 8`: about `25.7 ms`.
- [ ] Initial transmit period rule: `ceil(airtime_ms) + airtime_buffer_ms`.
- [ ] Initial airtime buffer candidate: `1-5 ms`, configurable.

## Freshness Thresholds

- [ ] Fresh: packet age `< 500 ms`.
- [ ] Late: packet age `500-1500 ms`.
- [ ] Stale: packet age `1500-5000 ms`.
- [ ] Offline: packet age `> 5000 ms`.

## Regulatory Note

- [ ] Validate that the selected 902-928 MHz channel plan is legal for the deployment region before transmitting.
- [ ] Keep protocol work separated from any high-risk drone command behavior.
- [ ] This branch only displays live telemetry and does not add vehicle actuation commands.
