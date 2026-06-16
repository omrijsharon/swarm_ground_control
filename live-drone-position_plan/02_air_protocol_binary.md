# Part 2: Air Protocol Binary Plan

Goal: replace the mesh-oriented LoRa frame for this branch with a compact single-GC star protocol.

The air protocol has two planes:

- Shared discovery/control channel.
- Assigned per-drone telemetry channels.

## Protocol Decisions

- [x] Use one GC in this branch.
- [x] Use GC node ID `0`.
- [x] Use drone node IDs directly as displayed drone numbers.
- [x] Use LoRa PHY packet boundaries instead of a custom `START` byte.
- [x] Use LoRa PHY CRC instead of adding a payload CRC for v1.
- [x] Remove mesh-only fields from v1 packets.
- [x] Do not use `FWD_COUNT`.
- [x] Do not use flood forwarding.
- [x] Do not require `RECIPIENT` in assigned-channel telemetry packets.
- [x] Use compact type-specific packets on the shared channel.
- [x] Use a 20-byte telemetry packet on assigned drone channels.

## Radio Defaults

- [x] Milestone 1: Freeze default radio parameters
  - [x] Set spreading factor default to `SF8`.
  - [x] Set bandwidth default to `500000 Hz`.
  - [x] Set coding rate default to `4/5`.
  - [x] Set preamble length default to `8`.
  - [x] Keep SX1262 TX power fixed at `22 dBm`.
  - [x] Make `SF`, `BW`, `CR`, and `airtime_buffer_ms` user-configurable.
  - [x] Compute airtime from the active radio parameters and packet size.
  - [x] Do not make airtime a manually entered value.

Default assigned-channel telemetry radio profile:

```text
profile_id          0
spreading_factor    8
bandwidth_hz        500000
coding_rate         5        # RadioLib denominator style: 5 means 4/5
preamble_symbols    8
explicit_header     true
phy_crc             true
tx_power_dbm        22
airtime_buffer_ms   74
```

Shared-channel discovery radio profile:

```text
profile_id          255      # firmware-known discovery profile, not assigned to drones
spreading_factor    12
bandwidth_hz        125000
coding_rate         8        # RadioLib denominator style: 8 means 4/8
preamble_symbols    8
explicit_header     true
phy_crc             true
tx_power_dbm        22
```

Implementation note: live-position firmware now switches the radio profile at runtime. The GC and drone use the discovery profile on the shared channel, then switch to the assigned telemetry profile from `JOIN_ASSIGN.radio_profile_id` for 20-byte telemetry. The old assigned-channel `TX_PERIOD_PROPOSAL` / `TX_PERIOD_ACK` packet IDs remain reserved and tolerated for diagnostics, but the current timing path infers the telemetry period from decoded telemetry packets.

Extra-long assigned telemetry profile:

```text
profile_id          64       # SF12 / BW125 / CR4/8
telemetry_airtime   ~1712 ms # 20-byte live telemetry packet
tx_period_ms        ~1787 ms # ceil(airtime) + 74 ms buffer
update_rate         ~0.56 Hz # one drone, before scheduler contention
```

The shared `TX_PERIOD_MAX_ACCEPT_MS` limit is now `2000 ms`, so the GC can assign this profile and the drone can accept it. Future profiles whose computed transmit period exceeds the shared max must be rejected by `set_radio_profile` before assignment.

## Telemetry Packet

- [x] Milestone 2: Define the assigned-channel telemetry packet
  - [x] Use exactly `20 bytes`.
  - [x] Use little-endian numeric fields unless firmware constraints require otherwise.
  - [x] Include `node_id` even though the GC can infer the drone from channel.
  - [x] Include `flags` for validity/debugging.
  - [x] Include latitude as signed integer degrees times `1e7`.
  - [x] Include longitude as signed integer degrees times `1e7`.
  - [x] Include altitude in centimeters.
  - [x] Include GPS course over ground in decidegrees.
  - [x] Include FC yaw in degrees.
  - [x] Include ground speed in centimeters per second.
  - [x] Include satellite count.
  - [x] Include sequence ID.
  - [x] Exclude derived `heading`.
  - [x] Exclude derived `headingSource`.

Final assigned-channel telemetry layout:

```text
node_id            uint8    1
flags              uint8    1
lat_e7             int32    4
lng_e7             int32    4
alt_cm             uint16   2
course_ddeg        uint16   2
yaw_deg            int16    2
ground_speed_cms   uint16   2
satellite_count    uint8    1
sequence_id        uint8    1
-----------------------------
total                      20 bytes
```

Encoding rules:

- `node_id`: nonzero drone node ID.
- `lat_e7`, `lng_e7`: decimal degrees multiplied by `10000000`.
- `alt_cm`: altitude in centimeters, saturated to `0..65535`.
- `course_ddeg`: course over ground in decidegrees, `0..3599`.
- `yaw_deg`: FC yaw in whole degrees, normalized to `0..359`.
- `ground_speed_cms`: ground speed in centimeters per second.
- `satellite_count`: `0` means unknown.
- `sequence_id`: wraps naturally from `255` to `0`.

- [x] Milestone 3: Define telemetry flags
  - [x] Reserve bits `0-1` for GPS fix type or fix quality.
  - [x] Reserve bit `2` for yaw validity.
  - [x] Reserve bit `3` for course-over-ground validity.
  - [x] Reserve bit `4` for speed validity.
  - [x] Reserve bit `5` for simulated GPS fields.
  - [x] Reserve bits `6-7` for future use.
  - [x] Define how invalid fields should be encoded.

Telemetry flags:

```text
bits 0-1   gps_fix_quality
           0 = no fix / position invalid
           1 = 2D or weak fix
           2 = 3D fix
           3 = high-confidence GPS quality
bit 2      yaw_valid
bit 3      course_over_ground_valid
bit 4      ground_speed_valid
bit 5      gps_simulated
           0 = GPS fields come from FC GPS when gps_fix_quality is nonzero
           1 = lat/lng/CoG/speed are simulated for bench map visibility
bits 6-7   reserved, must be 0 in v1
```

Invalid-field encoding:

- If `gps_simulated == 1`, GC may display `lat_e7`, `lng_e7`, CoG, and speed for bench visibility, but must mark the serial JSON GPS source as simulated.
- If `gps_fix_quality == 0` and `gps_simulated == 0`, GC must ignore `lat_e7`, `lng_e7`, CoG, and speed; drone should encode invalid GPS fields as `0` or the field-specific invalid sentinel.
- `alt_cm` is independent of GPS fix quality because this branch uses `MSP_ALTITUDE` for altitude.
- If CoG is invalid, clear bit 3 and encode `course_ddeg = 0xFFFF`.
- If yaw is invalid, clear bit 2 and encode `yaw_deg = -32768`.
- If speed is invalid, clear bit 4 and encode `ground_speed_cms = 0xFFFF`.
- Invalid fields must not stop `sequence_id` from incrementing.

## Shared Channel Control Packets

- [x] Milestone 4: Define packet type IDs
  - [x] Define `JOIN_REQUEST`.
  - [x] Define `SILENCE`.
  - [x] Define `JOIN_ASSIGN`.
  - [x] Define `JOIN_ACK`.
  - [x] Define future-reserved packet type range.

Packet type IDs:

```text
0xA1  JOIN_REQUEST
0xA2  SILENCE
0xA3  JOIN_ASSIGN
0xA4  JOIN_ACK
0xA5  TX_PERIOD_PROPOSAL (legacy/deprecated; ignored by current GC)
0xA6  TX_PERIOD_ACK      (legacy/deprecated; current drone does not require it)
0x01-0x9F  reserved away from control packets because assigned telemetry starts with `node_id`
0xA7-0xFF  reserved for future branch protocol packets
```

Implementation note: field testing with node `6` exposed why low control IDs are unsafe. A telemetry packet from node `6` starts with `0x06`, which collided with the old legacy timing-proposal ID. Current firmware uses the high `0xA*` control namespace and requires all live-position ESP32s to be reflashed together.

- [x] Milestone 5: Define `JOIN_REQUEST`
  - [x] Include packet type.
  - [x] Include drone node ID.
  - [x] Include a random join nonce.
  - [x] Include capability flags.
    - `JOIN_CAP_RADIO_PROFILE_SWITCH` indicates the drone can apply non-Fast assigned telemetry profiles. If this bit is missing, the GC falls back to Fast profile `0` for compatibility.
    - `JOIN_CAP_EXTENDED_TX_PERIOD` indicates the drone accepts assigned periods above the old `250 ms` ceiling. If the selected future profile needs a longer period and this bit is missing, the GC falls back to Fast profile `0` instead of sending an assignment the drone will reject.
  - [x] Keep the packet near `5 bytes`.

Final layout:

```text
type               uint8    1    # 0xA1
node_id            uint8    1
nonce              uint16   2
cap_flags          uint8    1
-----------------------------
total                       5 bytes
```

`cap_flags`:

```text
bit 0      supports live-position v1
bit 1      supports MSP attitude/yaw
bit 2      supports GPS course/speed
bit 3      supports assigned radio profile switching
bit 4      supports assigned TX periods above 250 ms
bits 5-7   reserved
```

- [x] Milestone 6: Define `SILENCE`
  - [x] Include packet type.
  - [x] Include silence sequence number.
  - [x] Include quiet duration in milliseconds.
  - [x] Ensure drones exit silence automatically when the duration expires.
  - [x] Keep the packet near `4 bytes`.

Final layout:

```text
type               uint8    1    # 0xA2
silence_seq        uint8    1
quiet_ms           uint16   2
-----------------------------
total                       4 bytes
```

Rules:

- `quiet_ms` is measured from packet receive time on the drone.
- Drones must automatically leave silence when `quiet_ms` expires.
- Drones should ignore duplicate `silence_seq` values already processed during the current join attempt.

- [x] Milestone 7: Define `JOIN_ASSIGN`
  - [x] Include packet type.
  - [x] Include target node ID.
  - [x] Include the join nonce from the request.
  - [x] Include channel index.
  - [x] Include radio profile ID.
  - [x] Include telemetry transmit period in milliseconds.
  - [x] Include lease duration.
  - [x] Keep the packet near `8 bytes`.

Final layout:

```text
type               uint8    1    # 0xA3
target_node_id     uint8    1
nonce              uint16   2
channel_index      uint8    1
radio_profile_id   uint8    1
tx_period_ms       uint16   2
lease_seconds      uint8    1
-----------------------------
total                       9 bytes
```

Notes:

- `tx_period_ms` is `uint16` because slower future radio profiles can exceed `255 ms`.
- `lease_seconds = 0` means no automatic lease expiry for v1.
- The extra byte versus the earlier 8-byte draft does not change airtime at the default radio profile.

- [x] Milestone 8: Define `JOIN_ACK`
  - [x] Include packet type.
  - [x] Include node ID.
  - [x] Include nonce.
  - [x] Include assigned channel index.
  - [x] Keep the packet near `5 bytes`.

Final layout:

```text
type               uint8    1    # 0xA4
node_id            uint8    1
nonce              uint16   2
channel_index      uint8    1
-----------------------------
total                       5 bytes
```

- [x] Milestone 8b: Replace assigned-channel timing proposal handshake with telemetry-period inference
  - [x] Keep `TX_PERIOD_PROPOSAL` and `TX_PERIOD_ACK` type IDs reserved for compatibility/debugging.
  - [x] Drone starts assigned-channel telemetry after sending `JOIN_ACK`; it does not wait for a GC timing ACK.
  - [x] Drone measures MSP read duration locally and uses `observed_msp_ms + 15 ms` as a fixed MSP slot before transmit.
  - [x] GC accepts the first valid 20-byte telemetry packets during assignment acquisition instead of ignoring a probe packet.
  - [x] GC infers `txPeriodMs` from RX-done timestamp delta divided by nonzero `sequenceDelta`.
  - [x] Reject `sequenceDelta == 0`, periods below the assigned profile minimum, and periods above `TX_PERIOD_MAX_ACCEPT_MS = 2000`.
  - [x] GC persists inferred `txPeriodMs` and `timingAccepted` after the first valid packet-to-packet delta; TST/RSSI/SNR/miss counters remain RAM-only.

Deprecated `TX_PERIOD_PROPOSAL` layout:

```text
type                 uint8    1    # 0xA5
node_id              uint8    1
sequence_id          uint8    1
measured_cycle_ms    uint16   2
proposed_period_ms   uint16   2
msp_batch_ms         uint16   2
tx_duration_ms       uint16   2
msp_flags            uint8    1
-------------------------------
total                        12 bytes
```

Deprecated `TX_PERIOD_ACK` layout:

```text
type                 uint8    1    # 0xA6
node_id              uint8    1
sequence_id          uint8    1
accepted_period_ms   uint16   2
status               uint8    1    # 0 = accepted
-------------------------------
total                         6 bytes
```

## Expected Airtime

- [x] Milestone 9: Verify airtime calculations in code
  - [x] Verify `5-byte JOIN_REQUEST` airtime is about `925.7 ms` on the discovery profile.
  - [x] Verify `4-byte SILENCE` airtime is about `925.7 ms` on the discovery profile.
  - [x] Verify `9-byte JOIN_ASSIGN` airtime is about `1187.8 ms` on the discovery profile.
  - [x] Verify `5-byte JOIN_ACK` airtime is about `925.7 ms` on the discovery profile.
  - [x] Verify `20-byte telemetry` airtime is about `25.7 ms`.
  - [x] Recalculate if preamble, SF, BW, CR, header mode, or CRC mode changes.

Discovery airtime table at SF12 / BW125 / CR4/8 / preamble 8 / explicit header / PHY CRC:

```text
payload_bytes   packet              airtime_ms
4               SILENCE             925.696
5               JOIN_REQUEST        925.696
5               JOIN_ACK            925.696
9               JOIN_ASSIGN         1187.840
```

Telemetry airtime table at SF8 / BW500 / CR4/5 / preamble 8 / explicit header / PHY CRC:

```text
payload_bytes   packet              airtime_ms
6               TX_PERIOD_ACK       15.488
12              TX_PERIOD_PROPOSAL  20.608
20              telemetry           25.728
```

`TX_PERIOD_ACK` and `TX_PERIOD_PROPOSAL` airtimes are retained here only because their packet IDs remain reserved. They are not part of the current bind timing path.

Formula:

```text
symbol_ms = (2^SF / BW_HZ) * 1000
preamble_ms = (preamble_symbols + 4.25) * symbol_ms
payload_symbols = 8 + max(
  ceil((8*payload_bytes - 4*SF + 28 + 16*crc_enabled - 20*implicit_header) /
       (4 * (SF - 2*low_data_rate_opt))) * coding_rate_denominator_offset,
  0
)
airtime_ms = preamble_ms + payload_symbols * symbol_ms
```

For RadioLib-style coding-rate denominator `5`, `coding_rate_denominator_offset = 5` in the formula above.

## Channel Plan

- [x] Milestone 10: Define the BW500 channel table
  - [x] Use `500 kHz` center spacing.
  - [x] Use `915.0 MHz` as the shared discovery/control channel.
  - [x] Reserve `914.5 MHz` and `915.5 MHz` as guard/reserved channels.
  - [x] Treat all other clear channels as telemetry candidates.
  - [x] Validate the channel table against local radio regulations before field use.

BW500 center-frequency table:

```text
902.5, 903.0, 903.5, 904.0, 904.5,
905.0, 905.5, 906.0, 906.5, 907.0,
907.5, 908.0, 908.5, 909.0, 909.5,
910.0, 910.5, 911.0, 911.5, 912.0,
912.5, 913.0, 913.5, 914.0, 914.5,
915.0, 915.5, 916.0, 916.5, 917.0,
917.5, 918.0, 918.5, 919.0, 919.5,
920.0, 920.5, 921.0, 921.5, 922.0,
922.5, 923.0, 923.5, 924.0, 924.5,
925.0, 925.5, 926.0, 926.5, 927.0,
927.5
```

Channel categories:

```text
shared discovery/control: 915.0 MHz
reserved guard channels:  914.5 MHz, 915.5 MHz
telemetry candidates:     all other table entries
candidate count:          48
```

Regulatory note: the repository assumes FCC-style 902-928 MHz hardware for planning, but actual transmission must be validated for the deployment region before field use.

- [x] Milestone 11: Implement boot spectrum scan policy
  - [x] GC scans candidate telemetry channels at boot.
  - [x] GC scans each candidate with the Fast, Balanced, and Robust simple profiles.
  - [x] GC uses LoRa CAD/LBT activity as the occupied/free decision source.
  - [x] GC stores the free channel list in runtime memory.
  - [x] GC allocates channels uniformly from the free, unassigned candidate set.

Boot spectrum scan policy:

- Scan only telemetry candidates, not the shared or guard channels.
- For each simple profile and candidate, apply the profile, tune radio, wait `4 ms`, then run CAD/LBT.
- A telemetry candidate is `occupied` if any simple-profile CAD/LBT pass detects LoRa activity.
- A telemetry candidate is `free` only if all three simple-profile passes report no activity and the channel is not assigned.
- Known assigned channels remain unavailable even if CAD does not detect activity during the scan.
- RSSI is measured only for occupied/assigned display; it does not decide whether a channel is free.
- If fewer than five channels are free, emit a warning but do not force fallback channels clear.
- Channel assignment samples uniformly from the free candidate set, excluding channels already assigned to active drones.

## Join And Assignment Flow

- [x] Milestone 12: Define shared channel behavior
  - [x] Unassigned drones wait on the shared channel.
  - [x] Unassigned drones use random backoff between `1000-5000 ms`.
  - [x] Unassigned drones perform LBT before sending `JOIN_REQUEST`.
  - [x] GC sends `SILENCE` before `JOIN_ASSIGN`.
  - [x] GC repeats `SILENCE -> JOIN_ASSIGN -> wait for JOIN_ACK` until acknowledged or timeout.
  - [x] Drone accepts `JOIN_ASSIGN` only when node ID and nonce match.
  - [x] Drone switches to assigned telemetry channel only after sending `JOIN_ACK`.
  - [x] GC considers assignment active only after receiving telemetry on the assigned channel.

Shared-channel behavior:

- Unassigned drones stay tuned to `915.0 MHz`.
- Drone join attempt:
  - wait random `1000-5000 ms`;
  - perform LBT for `5 ms`;
  - transmit `JOIN_REQUEST` only when RSSI remains below `-95 dBm`;
  - if LBT fails, restart random backoff;
  - listen for `SILENCE` / `JOIN_ASSIGN` with the longer SF12 assignment timeout.
- GC join response:
  - receive `JOIN_REQUEST`;
  - send broadcast `SILENCE` with `quiet_ms = 2500`;
  - send targeted `JOIN_ASSIGN`;
  - wait up to `1800 ms` for `JOIN_ACK`;
  - retry the silence/assign/ACK wait sequence up to `3` attempts.
- Target drone sends `JOIN_ACK`, then switches to the assigned channel.
- After `JOIN_ACK`, the drone switches to assigned-channel telemetry immediately.
- GC receives the first valid telemetry packets, infers the period from packet-to-packet timing, then marks timing accepted.
- Non-target drones obey `SILENCE`, then return to random backoff on the shared channel.
- GC marks assignment active only after a valid telemetry packet is received on the assigned channel.

## Telemetry Timing

- [x] Milestone 13: Define drone transmit timing
  - [x] Drone computes telemetry airtime from packet size and active LoRa parameters.
  - [x] Drone uses `JOIN_ASSIGN.tx_period_ms` as a safe provisional/profile period.
  - [x] Drone measures MSP response duration locally and waits until the fixed MSP slot is over before transmit.
  - [x] Drone uses a `15 ms` MSP slot guard and relearns the slot only after repeated overruns.
  - [x] Drone starts telemetry after `JOIN_ACK` without a TX-period proposal/ACK exchange.
  - [x] Initial fallback buffer is configurable and currently starts at `74 ms`.

Drone transmit timing:

- Default telemetry airtime is `25.728 ms`.
- Default `airtime_buffer_ms` is `74`.
- Minimum raw `tx_period_ms = ceil(25.728) + 74 = 100 ms`.
- Before each telemetry packet, the drone reads one MSP live-position batch, records the elapsed MSP time, then waits until the locally learned fixed MSP slot has elapsed.
- The learned MSP slot is `observed_msp_ms + 15 ms`, clamped by firmware bounds, so a Betaflight response that arrives up to about `10 ms` later on another cycle should still fit before the planned LoRa TX.
- In steady telemetry, the drone transmits at the profile-safe period derived from airtime and the learned MSP slot; it no longer sends a separate TX-period proposal packet.
- If telemetry work is late, skip late slots instead of transmitting bursts or shifting the phase.
- The GC updates the TST estimate after every received packet, so runtime TST drift is RAM-only and is never written to flash.
- Historical bench note: after MSP polling was moved behind LoRa TX, the drone measured the blocking `sendRawPacket()` path at about `38 ms`, longer than the earlier `35 ms` period. That led to the now-deprecated timing proposal handshake. In the first bench run after that change, drone node `2` proposed `104 ms` from `measuredCycleMs = 89` plus the `15 ms` buffer, the GC ACKed it, and a post-lock 15 second GC sample received `145` telemetry packets with zero `telemetry_missed` events.
- Bench note: after MSP batch started responding quickly, drone node `2` measured and proposed `63 ms`, but the current GC scanner missed packets at that rate. Raising GC USB serial to `921600` and accepting `65 ms` still produced many sequence gaps, so the bottleneck is not only USB baud rate. The GC keeps the protocol range at `45-2000 ms` but clamps the accepted operating period to at least `100 ms`; the resulting `txPeriodMs = 103` bench run produced `145` received telemetry messages in 15 seconds with zero sequence gaps.
- Scheduler design note: with multiple drones, independent packet windows may overlap. The GC does not prevent overlap; it ranks catchable profile-aware receive windows by normalized telemetry age and near-future listen start, then intentionally skips lower-priority windows without counting those skips as `telemetry_missed`.

- [x] Milestone 14: Define GC scan timing
  - [x] GC records packet receive-done time for each drone.
  - [x] GC estimates packet start time as `rx_done_time - airtime_ms`.
  - [x] GC predicts the next packet start from the known transmit period.
  - [x] GC tunes to the drone channel before predicted start by a guard time.
  - [x] GC corrects each drone phase estimate after each received packet.
  - [x] GC falls back to longer listening windows after missed packets.
  - [x] GC periodically returns to the shared channel to catch new drones.

GC scan timing:

- On first active assignment, listen on that drone channel for the profile-safe unknown-phase acquisition window.
- If assignment timing is not accepted yet, accept valid telemetry immediately and infer the period from consecutive packets.
- The inferred period is `rxDoneDeltaMs / sequenceDelta`; `sequenceDelta == 0` is rejected.
- The inferred period must be at least the assigned profile's safe `telemetryTxPeriodMs(profile)` and no more than `TX_PERIOD_MAX_ACCEPT_MS = 2000`.
- On packet receive, estimate `last_tx_start_ms = rx_done_ms - airtime_ms`.
- Predict the next preferred visit using the assignment's TX period and a service stride derived from the active profile-aware scanner cycle budget.
- Tune to the assigned channel before predicted start by `max(22 ms, ceil(3 LoRa symbols))`.
- Listen until `ceil(airtime_ms) + max(12 ms, ceil(2 LoRa symbols))` after predicted start on a healthy phase estimate.
- For known-phase drones, consider only catchable windows where the profile-specific tune guard is still available.
- Group candidates by overlapping receive windows and select by normalized update age, miss priority, and near-future listen start.
- If the GC intentionally skips a lower-priority overlapping packet window, advance that drone's predicted TST without incrementing `missCount`.
- The first eleven listened misses preserve phase and only advance to the next catchable predicted slot.
- After twelve consecutive listened misses, queue an event-driven recovery slot on the assigned channel/profile. Each slot runs exactly one CAD/LBT probe before returning to normal scheduler selection.
- Full automatic RX relock is scheduled only when a recovery-slot CAD/LBT probe detects activity, plus one immediate first-slot weak-link attempt when last RSSI was `<= -114 dBm` or unknown.
- Classify `WEAK` when activity is detected but telemetry does not decode.
- Classify `OFF` only after `2` separate no-activity CAD/LBT probes when last RSSI was stronger than `-114 dBm`; weak or unknown last RSSI stays `OFFLINE`.
- With no active assignments, the GC uses `1200 ms` normal shared listen windows for discovery.
- Operator Bind/Search uses `discoverySearchSharedDwellMs()`, derived as `3 * max discovery control packet airtime + 20 ms`; at `SF12 / BW125 / CR4/8` this reports about `3584 ms`.
- Active tracking uses operator-controlled Bind/Search instead of short periodic forced shared listens.
- Assigned profile `64` (`SF12 / BW125 / CR4/8`) is intentionally slow: the GC must not clip post-ACK, manual re-bind, automatic recovery, Search telemetry-round, or OOCR listen windows with old sub-second assumptions.
- High-rate per-packet scanner debug should stay off by default because serial JSON output can otherwise block the receive loop.

## Field Follow-Up Protocol Changes

These tasks mirror `08_field_test_followups.md`.

- [x] Replace automatic periodic shared-channel visits during active tracking with operator-controlled Search mode.
- [x] Keep shared-channel discovery automatic only when no drones are assigned.
- [x] In Search mode, stop after one shared dwell with no valid `JOIN_REQUEST` and no LoRa CAD activity.
- [x] After a successful Search assignment, run one assigned-telemetry scanner round before returning to shared discovery.
- [x] Add assigned-channel link diagnosis using LoRa CAD/activity detection plus packet receive.
- [x] Gate stale/offline assigned-drone RX relock with CAD/LBT.
- [x] Cap automatic recovery at `5` CAD recovery slots; failed RX listens schedule the next CAD slot with `1s` to `4s` backoff.
- [x] Classify recovery results as valid telemetry, `weak` activity without decode, `offline` weak-link loss, or `off` confirmed no-activity.
- [x] Keep radio profile ID `0` as Fast: `SF8 / BW500 / CR4/5`.
- [x] Add deterministic radio profile IDs for SF `7-12`, BW `125/250/500 kHz`, and CR `4/5-4/8`.
- [x] Add preset profile IDs for Balanced and Robust.
- [x] Keep `JOIN_ASSIGN.radio_profile_id` as the assigned telemetry profile selector.
- [x] Keep shared discovery profile fixed at `SF12 / BW125 / CR4/8`.
- [x] Raise the shared accepted assigned-telemetry period ceiling to `2000 ms` so profile `64` can bind and negotiate timing.
- [x] Make GC post-ACK lock, manual re-bind, automatic recovery, Search telemetry-round, and OOCR windows large enough for profile `64`.
- [ ] Field-verify Fast, Balanced, and Robust behavior with real drones.
