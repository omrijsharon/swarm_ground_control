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

Default v1 radio profile:

```text
profile_id          0
spreading_factor    8
bandwidth_hz        500000
coding_rate         5        # RadioLib denominator style: 5 means 4/5
preamble_symbols    8
explicit_header     true
phy_crc             true
tx_power_dbm        22
airtime_buffer_ms   1
```

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
  - [x] Reserve bits `5-7` for future use.
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
bits 5-7   reserved, must be 0 in v1
```

Invalid-field encoding:

- If `gps_fix_quality == 0`, GC must ignore `lat_e7`, `lng_e7`, and `alt_cm`; drone should encode them as `0`.
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
0x01  JOIN_REQUEST
0x02  SILENCE
0x03  JOIN_ASSIGN
0x04  JOIN_ACK
0x05-0x7F  reserved for future branch protocol packets
0x80-0xFF  reserved for debug/vendor/experimental packets
```

- [x] Milestone 5: Define `JOIN_REQUEST`
  - [x] Include packet type.
  - [x] Include drone node ID.
  - [x] Include a random join nonce.
  - [x] Include capability flags.
  - [x] Keep the packet near `5 bytes`.

Final layout:

```text
type               uint8    1    # 0x01
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
bits 3-7   reserved, must be 0 in v1
```

- [x] Milestone 6: Define `SILENCE`
  - [x] Include packet type.
  - [x] Include silence sequence number.
  - [x] Include quiet duration in milliseconds.
  - [x] Ensure drones exit silence automatically when the duration expires.
  - [x] Keep the packet near `4 bytes`.

Final layout:

```text
type               uint8    1    # 0x02
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
type               uint8    1    # 0x03
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
type               uint8    1    # 0x04
node_id            uint8    1
nonce              uint16   2
channel_index      uint8    1
-----------------------------
total                       5 bytes
```

## Expected Airtime

- [x] Milestone 9: Verify airtime calculations in code
  - [x] Verify `5-byte JOIN_REQUEST` airtime is about `15.5 ms`.
  - [x] Verify `4-byte SILENCE` airtime is about `15.5 ms`.
  - [x] Verify `9-byte JOIN_ASSIGN` airtime is about `18.0 ms`.
  - [x] Verify `5-byte JOIN_ACK` airtime is about `15.5 ms`.
  - [x] Verify `20-byte telemetry` airtime is about `25.7 ms`.
  - [x] Recalculate if preamble, SF, BW, CR, header mode, or CRC mode changes.

Default airtime table at SF8 / BW500 / CR4/5 / preamble 8 / explicit header / PHY CRC:

```text
payload_bytes   packet              airtime_ms
4               SILENCE             15.488
5               JOIN_REQUEST        15.488
5               JOIN_ACK            15.488
9               JOIN_ASSIGN         18.048
20              telemetry           25.728
```

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

- [x] Milestone 11: Implement boot noise scan policy
  - [x] GC scans candidate telemetry channels at boot.
  - [x] GC samples RSSI/noise floor multiple times per candidate channel.
  - [x] GC discards noisy channels.
  - [x] GC stores the clear channel list in runtime memory.
  - [x] GC allocates channels uniformly from the clear candidate set.

Boot noise scan policy:

- Scan only telemetry candidates, not the shared or guard channels.
- For each candidate, tune radio, wait `2 ms`, then take `8` RSSI samples separated by `2 ms`.
- Store median RSSI and max RSSI per channel.
- A channel is noisy if `median_rssi > -95 dBm` or `max_rssi > -85 dBm`.
- If fewer than five channels are clear, keep the five quietest candidates anyway and emit a serial warning.
- Channel assignment samples uniformly from the clear candidate set, excluding channels already assigned to active drones.

## Join And Assignment Flow

- [x] Milestone 12: Define shared channel behavior
  - [x] Unassigned drones wait on the shared channel.
  - [x] Unassigned drones use random backoff between `25-250 ms`.
  - [x] Unassigned drones perform LBT before sending `JOIN_REQUEST`.
  - [x] GC sends `SILENCE` before `JOIN_ASSIGN`.
  - [x] GC repeats `SILENCE -> JOIN_ASSIGN -> wait for JOIN_ACK` until acknowledged or timeout.
  - [x] Drone accepts `JOIN_ASSIGN` only when node ID and nonce match.
  - [x] Drone switches to assigned telemetry channel only after sending `JOIN_ACK`.
  - [x] GC considers assignment active only after receiving telemetry on the assigned channel.

Shared-channel behavior:

- Unassigned drones stay tuned to `915.0 MHz`.
- Drone join attempt:
  - wait random `25-250 ms`;
  - perform LBT for `5 ms`;
  - transmit `JOIN_REQUEST` only when RSSI remains below `-95 dBm`;
  - if LBT fails, restart random backoff.
- GC join response:
  - receive `JOIN_REQUEST`;
  - send broadcast `SILENCE` with `quiet_ms = 250`;
  - send targeted `JOIN_ASSIGN`;
  - wait up to `80 ms` for `JOIN_ACK`;
  - retry the silence/assign/ACK wait sequence up to `3` attempts.
- Target drone sends `JOIN_ACK`, then switches to the assigned channel.
- Non-target drones obey `SILENCE`, then return to random backoff on the shared channel.
- GC marks assignment active only after a valid telemetry packet is received on the assigned channel.

## Telemetry Timing

- [x] Milestone 13: Define drone transmit timing
  - [x] Drone computes telemetry airtime from packet size and active LoRa parameters.
  - [x] Drone computes `tx_period_ms = ceil(airtime_ms) + airtime_buffer_ms`.
  - [x] Drone starts the next telemetry transmission on that period.
  - [x] Initial buffer is configurable and should start at `1-5 ms`.

Drone transmit timing:

- Default telemetry airtime is `25.728 ms`.
- Default `airtime_buffer_ms` is `1`.
- Default `tx_period_ms = ceil(25.728) + 1 = 27 ms`.
- Schedule the next telemetry transmission from the previous transmission start time, not from receive time or loop time.
- If telemetry packing is delayed, skip late slots instead of transmitting bursts.

- [x] Milestone 14: Define GC scan timing
  - [x] GC records packet receive-done time for each drone.
  - [x] GC estimates packet start time as `rx_done_time - airtime_ms`.
  - [x] GC predicts the next packet start from the known transmit period.
  - [x] GC tunes to the drone channel before predicted start by a guard time.
  - [x] GC corrects each drone phase estimate after each received packet.
  - [x] GC falls back to longer listening windows after missed packets.
  - [x] GC periodically returns to the shared channel to catch new drones.

GC scan timing:

- On first active assignment, listen on that drone channel for up to `2 * tx_period_ms`.
- On packet receive, estimate `last_tx_start_ms = rx_done_ms - airtime_ms`.
- Predict next start as `last_tx_start_ms + tx_period_ms`.
- Tune to the assigned channel `3 ms` before predicted start.
- Listen for `airtime_ms + 6 ms` on a healthy phase estimate.
- After one missed packet, listen for `2 * tx_period_ms`.
- After two or more misses, listen for `3 * tx_period_ms`, then keep cycling so other drones are not starved.
- Return to the shared channel once per scan cycle and dwell for at least `30 ms` to catch new `JOIN_REQUEST` packets.
