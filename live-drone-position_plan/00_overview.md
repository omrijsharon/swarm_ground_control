# Live Drone Position Project Plan

Branch: `feature/live-drone-position`

This branch narrows Swarm Ground Control from a broad C2 prototype into a live drone position viewer. The target system is one ground-control ESP32 LoRa module connected to SGC over USB serial, with about five drones reporting position over LoRa at roughly 2-5 Hz total map refresh per drone.

## Working Assumptions

- [x] One GC is active in this branch.
- [x] GC node ID is `0`.
- [x] Drone node IDs are real external IDs and are displayed directly in SGC.
- [ ] Expected operating range is `0.5-2 km`.
- [ ] Expected drone count is about `5` with real drones.
- [x] SGC receives telemetry over USB serial from the GC ESP32, not WebSocket.
- [ ] GC firmware owns channel allocation and persists assignments in ESP32 flash.
- [x] SGC displays assigned telemetry frequency per drone.
- [ ] Drone telemetry over LoRa is compact binary.
- [x] GC-to-SGC serial output is newline-delimited JSON.
- [x] Mission commands, teams, waypoints, and command sequences are out of scope for this branch.

## Project Parts

- [x] Milestone 1: Small serial test
  - [x] Prove the browser-based SGC can open the GC ESP32 USB serial port.
  - [x] Prove SGC can read serial lines from the ESP32.
  - [x] Prove SGC can detect and parse newline-delimited JSON.

- [x] Milestone 2: Air protocol
  - [x] Define reduced binary LoRa packets for a single-GC star topology.
  - [x] Define shared discovery/control channel behavior.
  - [x] Define assigned telemetry channels and timing.
  - [x] Define the 20-byte telemetry packet.

- [x] Milestone 3: Serial protocol
  - [x] Define GC-to-SGC JSON telemetry events.
  - [x] Define GC-to-SGC assignment/status events.
  - [x] Define any SGC-to-GC configuration commands needed for this branch.

- [x] Milestone 4: SGC side
  - [x] Add a live-position mode.
  - [x] Hide command/C2 UI in live-position mode.
  - [x] Read telemetry over USB serial.
  - [x] Dynamically create and update drones on the map.
  - [x] Show freshness, heading, RSSI/SNR, satellite count, speed, altitude, and frequency.

- [ ] Milestone 5: simple-mesh firmware side
  - [ ] Implement GC role for discovery, assignment, scanning, heading fusion, and serial JSON.
  - [ ] Implement drone role for join, assignment ACK, MSP telemetry readout, and telemetry TX.
  - [ ] Store GC channel assignments in flash.
  - [ ] Keep TX power fixed at `22 dBm` for SX1262.

## Key Defaults

- [x] Radio default spreading factor: `SF8`.
- [x] Radio default bandwidth: `500 kHz`.
- [x] Radio default coding rate: `4/5`.
- [x] Radio default preamble length: `8`.
- [x] SX1262 TX power: `22 dBm`.
- [x] Shared discovery frequency: `915.0 MHz`.
- [x] Telemetry packet size: `20 bytes`.
- [x] Telemetry airtime at `SF8 / BW500 / CR4/5 / preamble 8`: about `25.7 ms`.
- [x] Initial transmit period rule: `ceil(airtime_ms) + airtime_buffer_ms`.
- [x] Initial airtime buffer default: `1 ms`, configurable.

## Freshness Thresholds

- [x] Fresh: packet age `< 1000 ms`.
- [x] Late: packet age `1000-2000 ms`.
- [x] Stale: packet age `2000-5000 ms`.
- [x] Offline: packet age `> 5000 ms`.

## Regulatory Note

- [ ] Validate that the selected 902-928 MHz channel plan is legal for the deployment region before transmitting.
- [x] Keep protocol work separated from any high-risk drone command behavior.
- [x] This branch only displays live telemetry and does not add vehicle actuation commands.
