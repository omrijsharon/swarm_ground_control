# Part 1: Small Serial Test Plan

Goal: prove that SGC can communicate with the GC ESP32 over USB serial before changing the LoRa protocol or the main map UI.

## Milestones And Tasks

- [ ] Milestone 1: Define the test target
  - [x] Choose the first target computer/browser pair for the test. Initial target: Windows laptop with desktop Chrome or Edge.
  - [ ] Record the exact browser version used for testing.
  - [ ] Record the ESP32 board/USB mode used for testing.
  - [x] Confirm the first test is over direct USB, not Wi-Fi or WebSocket.
  - [x] Record whether smartphone/tablet serial support is required for v1 or deferred. Deferred until the laptop test passes.

- [x] Milestone 2: Add a minimal SGC serial probe
  - [x] Add a small test surface in SGC for opening a serial port.
  - [x] Use browser Web Serial where available.
  - [x] Add an "open port" control.
  - [x] Add a "close port" control.
  - [x] Show connection state.
  - [x] Show selected baud rate.
  - [x] Default baud rate to the firmware monitor rate, currently `115200`.
  - [x] Read newline-delimited serial lines.
  - [x] Display raw serial lines in a simple log.
  - [x] Attempt to parse each line as JSON.
  - [x] Show parsed JSON separately from raw firmware logs.
  - [x] Show parse errors without stopping the serial reader.

- [x] Milestone 3: Create a simple ESP32 serial source
  - [x] Decide whether the first test uses current firmware logs or a tiny JSON-printing test firmware. First test uses current simple-mesh firmware logs plus local parser samples.
  - [x] Print at least one valid JSON line from the ESP32. Verified with `ENABLE_SGC_SERIAL_JSON_SMOKE_TEST` on COM18; `drone_telemetry` and `gc_status` JSON lines are emitted over USB serial.
  - [x] Print at least one non-JSON diagnostic line from the ESP32. Verified with simple-mesh boot/test-message logs from COM18.
  - [x] Verify SGC can handle mixed logs and JSON. Verified local JSON samples, real non-JSON firmware logs, live ESP32 JSON smoke output, and browser Web Serial parsed JSON updates.
  - [x] Verify the serial reader survives ESP32 reset/reconnect. Auto-reconnect verified after ESP32 reset.

- [ ] Milestone 4: Validate browser/device behavior
  - [x] Test connection on the first target laptop. Verified Windows laptop + browser Web Serial to USB Serial Device COM18.
  - [x] Test reconnect after unplug/replug. Reset/re-enumeration auto-reconnect verified on COM18.
  - [x] Test behavior when the serial port is busy in another program. Verified Arduino IDE serial monitor owns COM18 and browser open fails clearly.
  - [ ] Test behavior when the user denies serial permission.
  - [ ] Test behavior when Web Serial is not supported.
  - [x] Document any smartphone/tablet limitation found during the test. Android browser path can see USB attachment behavior, but Web Serial did not expose a compatible ESP32 serial device; WebUSB could open device info but could not claim the CDC data interface. Laptop remains the v1 target.

- [ ] Milestone 5: Define pass/fail criteria
  - [x] Pass if SGC can open the ESP32 USB serial port.
  - [x] Pass if SGC can receive raw serial lines.
  - [x] Pass if SGC can parse valid JSON lines. Verified with local parser sample buttons and live ESP32 smoke JSON through browser Web Serial.
  - [x] Pass if SGC can keep running when non-JSON logs arrive.
  - [ ] Fail if the target browser/device cannot expose the ESP32 USB serial port.

## Expected Test JSON

- [x] Use a minimal telemetry-like line for the first parser test:

```json
{"type":"drone_telemetry","nodeId":1,"lat":32.0596637,"lng":34.8503487,"alt":12.3,"heading":91.0}
```

- [x] Use a minimal status-like line for the second parser test:

```json
{"type":"gc_status","nodeId":0,"sharedFrequencyMhz":915.0,"connectedDrones":0}
```

- [x] Update the current smoke-test sample JSON to the fuller GC-to-SGC schema with heading, CoG, yaw, speed, satellite count, RSSI, SNR, channel, sequence ID, and `gcMillis`.

## Out Of Scope

- [ ] Do not integrate the serial probe into the map until the raw serial test passes.
- [ ] Do not implement LoRa channel allocation in this test.
- [ ] Do not implement firmware role changes in this test.
