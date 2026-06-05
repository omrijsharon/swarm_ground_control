# Part 7: Future Features Plan

Goal: keep agreed future work visible without mixing it into the active branch checklists. Do not mark these tasks complete until the feature is intentionally pulled into implementation and verified.

This file is for features that are useful for the live-position system but are not required for the current bench milestone.

## Milestones And Tasks

- [ ] Milestone 1: Dual-core drone FC telemetry task on ESP32-S3
  - [ ] Decide whether this feature belongs behind a build flag, runtime config, or both.
    - Recommended build flag:
      ```cpp
      #define LIVE_POSITION_DUAL_CORE_FC_TASK 1
      ```
    - Recommended default:
      - ESP32-S3 / dual-core ESP32 targets: enabled by default.
      - ESP8266 / ESP8285 / unsupported single-core targets: forced disabled.
      - Debug builds can explicitly disable it to compare against the current sequential behavior.
  - [ ] Keep all LoRa/SX1262/RadioLib/SPI work on one task.
    - Radio timing must remain single-owner.
    - Do not let the FC telemetry task call RadioLib, change LoRa frequency, transmit, receive, or touch SPI radio state.
  - [ ] Add a dedicated FC telemetry polling task.
    - The FC task reads Betaflight MSP from `Serial1`.
    - It should use `MSP_MULTIPLE_MSP` for `MSP_RAW_GPS`, `MSP_ATTITUDE`, and `MSP_ALTITUDE`.
    - It should poll attitude and altitude more frequently than GPS.
    - GPS can be low priority until real GPS field validation is active.
  - [ ] Define task priorities and core affinity.
    - LoRa timing task should have higher priority than FC polling.
    - FC polling should never be able to block scheduled LoRa transmit.
    - Prefer pinning the radio/timing path and FC polling path to separate cores on ESP32-S3 if testing proves that reduces jitter.
  - [ ] Replace direct MSP reads in the LoRa TX path with a cached FC snapshot.
    - The LoRa telemetry builder should copy the latest available FC snapshot and pack it into the 20-byte telemetry packet.
    - If the FC task is slow or MSP fails, LoRa should still transmit on time using the last valid snapshot and validity flags.
    - Do not make LoRa TX wait for a fresh MSP response.
  - [ ] Implement safe shared snapshot handoff.
    - Use a mutex, critical section, or double-buffer swap.
    - The snapshot should include yaw, altitude, GPS fix/fix quality, lat/lng, CoG, speed, satellite count, read success flags, and timestamps.
    - Avoid long critical sections; copying a compact struct should be fast.
  - [ ] Add freshness metadata for FC fields.
    - Track `attitudeAgeMs`, `altitudeAgeMs`, and `gpsAgeMs`.
    - Keep existing telemetry validity flags, but add diagnostics so stale FC data is obvious in drone serial logs.
  - [ ] Add serial diagnostics.
    - Emit a boot/runtime JSON line such as:
      ```json
      {"type":"drone_runtime","dualCoreFcTask":true,"fcTaskCore":0,"loraTaskCore":1,"gcMillis":123456}
      ```
    - Extend `drone_fc_status` or `drone_live_status` with FC task timing, last MSP batch duration, snapshot age, and task enabled state.
  - [ ] Keep single-core fallback behavior.
    - ESP8285 and other single-core/constrained targets must use the current sequential MSP polling path or a board-specific simpler path.
    - The build should fail clearly or force-disable dual-core mode if the target does not support the required FreeRTOS task APIs.
  - [ ] Avoid USB serial jitter from multiple tasks.
    - Do not let both tasks print high-rate logs freely.
    - Keep high-frequency debug logging disabled by default.
    - If both tasks need diagnostics, route them through a lightweight queue or throttle them.
  - [ ] Bench-test timing improvement.
    - Compare sequential mode and dual-core mode with the same drone hardware.
    - Measure LoRa TX lateness/jitter.
    - Measure MSP snapshot age at packet transmit time.
    - Confirm LoRa TX timing remains stable when MSP is slow, missing, or the FC is power-cycled.
  - [ ] Field-test before depending on it.
    - Confirm real FC UART behavior under vibration/electrical noise.
    - Confirm GPS data path when GPS reception is available.
    - Confirm no watchdog resets or heap/stack issues during long runs.

- [ ] Milestone 2: Mobile and tablet USB serial support
  - [ ] Decide whether mobile/tablet support is required for an operator release or remains a laptop-only v1.
    - Current proven path is desktop Chrome/Edge Web Serial on a laptop.
    - Android browser testing showed USB attachment behavior, but the browser did not expose the ESP32 CDC serial interface as a compatible Web Serial port.
    - WebUSB could open device information, but the CDC data interface could not be claimed in the browser test.
  - [ ] Evaluate practical mobile transport options.
    - Native Android wrapper or app with USB host serial support.
    - WebUSB-specific firmware/interface changes, only if they do not hurt the laptop Web Serial path.
    - BLE, Wi-Fi, or another bridge mode if USB serial is not reliable enough on phones.
  - [ ] Keep the laptop Web Serial path as the baseline until a mobile path is proven with the real GC ESP32.

- [ ] Milestone 3: Production serial logging controls
  - [ ] Add a GC firmware setting for serial output mode.
    - Candidate setting: `serialMode:"json_only"` for operator use.
    - Candidate setting: `logLevel:"debug"` for mixed human logs during bench work.
  - [ ] Add SGC UI or command support for switching logging mode if needed.
  - [ ] Keep newline-delimited JSON uninterrupted when SGC is connected.
  - [ ] Throttle or suppress high-rate human logs if they affect scanner timing or USB throughput.
  - [ ] Verify production mode still emits enough diagnostics for support: `gc_status`, `assignment_event`, `scanner_event`, `channel_table`, warnings, and errors.

- [ ] Milestone 4: Advanced radio profile and assignment maintenance
  - [ ] Implement operator-controlled `set_radio_profile` if field tests prove the default profile is not enough.
    - Supported knobs already defined in the serial plan: spreading factor, bandwidth, coding rate, and airtime buffer.
    - Apply changes only at a safe GC radio idle boundary.
    - Persist settings only when `persist:true`.
  - [ ] Add SGC controls for radio profile changes only after the safety and validation rules are clear.
  - [ ] Implement single-drone assignment maintenance commands as operator tools.
    - `clear_assignment`
    - `rescan_channels`
    - `reassign_drone`
  - [ ] Reassign a persisted drone automatically when its stored channel is now noisy or invalid.
  - [ ] Reassign a persisted drone automatically when its stored radio profile is no longer supported.
  - [ ] Make drone nodes return to shared-channel join if an assignment expires or an explicit radio config change invalidates the current assignment.
  - [ ] Make the GC mark an assignment active only after receiving valid assigned-channel telemetry from that drone.

- [ ] Milestone 5: Real GPS and heading-fusion field validation
  - [ ] Field-test real `MSP_RAW_GPS` latitude and longitude when GPS reception is available.
  - [ ] Verify real GPS fix quality, satellite count, CoG, and ground speed against Betaflight Configurator or another trusted reference.
  - [ ] Switch `gpsSource` from `simulated` to real FC GPS only when the fix is valid and the packet flags prove the data is real.
  - [ ] Verify heading fusion with real movement.
    - CoG should phase in by speed instead of using a hard threshold.
    - Yaw should dominate when speed is low or GPS is simulated.
    - Runtime yaw bias should be learned only from reliable real CoG and real yaw.
  - [ ] Avoid yaw-bias updates during obvious unstable movement if a reliable instability signal is available.
  - [ ] Keep yaw bias runtime-only unless a later field test proves persistence is needed.

- [ ] Milestone 6: Test harness and simulation tooling
  - [ ] Unit-check airtime calculations for every supported radio profile.
  - [ ] Unit-check profile-to-TX-period calculations.
  - [ ] Bench-test channel scan with simulated noisy channels where possible.
  - [ ] Bench-test GC scanner ordering with simulated per-drone next transmit times.
  - [ ] Bench-test MSP telemetry packing with known values.
  - [ ] Add a deterministic serial-log replay or fixture path for SGC parser and UI regression tests if manual testing becomes too slow.
  - [ ] Keep simulated-FC drone mode as a scheduler/radio bench tool for extra ESP32/SX1262 boards without flight controllers.

- [ ] Milestone 7: Field and range validation
  - [ ] Field-test one real drone at close range.
  - [ ] Field-test about five real drones at close range.
  - [ ] Field-test the expected `0.5-2 km` range.
  - [ ] Log RSSI/SNR during range tests and compare them against freshness, sequence gaps, and scanner events.
  - [ ] Validate antenna placement, power, and airframe electrical noise before depending on bench RSSI/SNR results.
  - [ ] Validate that the selected `902-928 MHz` channel plan and transmit power are legal for the deployment region before field transmission.

- [ ] Milestone 8: Session lifecycle and spectrum history
  - [ ] Infer likely new-session state by probing persisted assigned channels and comparing them with drones present on the shared channel.
  - [ ] Add a session ID or timestamp once SGC can provide trusted host time to the GC.
  - [ ] Add a historical spectrum log for field debugging.
  - [ ] Consider showing previous scan snapshots only as a debug/history view, not as the normal operator boot animation.
  - [ ] Keep explicit `Start Fresh Session` as the safe v1 behavior until automatic new-session detection is proven.

- [ ] Milestone 9: Protocol extension reserve and separate future branches
  - [ ] Keep packet types `0x07-0x7F` reserved for future branch protocol packets unless a concrete extension is designed.
  - [ ] Keep telemetry flag bits `6-7` reserved until a concrete field need exists.
  - [ ] Keep `tx_period_ms` as `uint16` so slower future radio profiles can exceed `255 ms`.
  - [ ] Treat multi-GC coordination as a separate future protocol branch, not part of the current single-GC live-position v1.
  - [ ] Treat flood forwarding or a true mesh protocol as a separate future branch, not part of the current star assignment design.
  - [ ] Keep mission commands, arming, takeoff, landing, and other vehicle-actuation controls out of this live-position branch.

## Notes

- Dual-core FC polling improves drone-side telemetry freshness and protects LoRa timing from blocking MSP reads.
- It does not make MSP wire time faster; `115200` baud and Betaflight response timing still set the lower-level limit.
- It does not remove the need for the GC scanner scheduler. The GC still has one LoRa receiver hopping across assigned drone frequencies, so it will intentionally sample packets instead of receiving every packet from every drone.
- This feature should be implemented only after the current multi-drone scanner behavior is stable enough to use as a baseline.
- The items above are backlog candidates. Pull one into an implementation plan only when it directly supports the current goal: showing about five live drones reliably in SGC.
