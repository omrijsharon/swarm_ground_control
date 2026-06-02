# Part 2: Air Protocol Binary Plan

Goal: replace the mesh-oriented LoRa frame for this branch with a compact single-GC star protocol.

The air protocol has two planes:

- Shared discovery/control channel.
- Assigned per-drone telemetry channels.

## Protocol Decisions

- [ ] Use one GC in this branch.
- [ ] Use GC node ID `0`.
- [ ] Use drone node IDs directly as displayed drone numbers.
- [ ] Use LoRa PHY packet boundaries instead of a custom `START` byte.
- [ ] Use LoRa PHY CRC instead of adding a payload CRC for v1.
- [ ] Remove mesh-only fields from v1 packets.
- [ ] Do not use `FWD_COUNT`.
- [ ] Do not use flood forwarding.
- [ ] Do not require `RECIPIENT` in assigned-channel telemetry packets.
- [ ] Use compact type-specific packets on the shared channel.
- [ ] Use a 20-byte telemetry packet on assigned drone channels.

## Radio Defaults

- [ ] Milestone 1: Freeze default radio parameters
  - [ ] Set spreading factor default to `SF8`.
  - [ ] Set bandwidth default to `500000 Hz`.
  - [ ] Set coding rate default to `4/5`.
  - [ ] Set preamble length default to `8`.
  - [ ] Keep SX1262 TX power fixed at `22 dBm`.
  - [ ] Make `SF`, `BW`, `CR`, and `airtime_buffer_ms` user-configurable.
  - [ ] Compute airtime from the active radio parameters and packet size.
  - [ ] Do not make airtime a manually entered value.

## Telemetry Packet

- [ ] Milestone 2: Define the assigned-channel telemetry packet
  - [ ] Use exactly `20 bytes`.
  - [ ] Use little-endian numeric fields unless firmware constraints require otherwise.
  - [ ] Include `node_id` even though the GC can infer the drone from channel.
  - [ ] Include `flags` for validity/debugging.
  - [ ] Include latitude as signed integer degrees times `1e7`.
  - [ ] Include longitude as signed integer degrees times `1e7`.
  - [ ] Include altitude in centimeters.
  - [ ] Include GPS course over ground in decidegrees.
  - [ ] Include FC yaw in degrees.
  - [ ] Include ground speed in centimeters per second.
  - [ ] Include satellite count.
  - [ ] Include sequence ID.
  - [ ] Exclude derived `heading`.
  - [ ] Exclude derived `headingSource`.

Proposed layout:

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

- [ ] Milestone 3: Define telemetry flags
  - [ ] Reserve bits `0-1` for GPS fix type or fix quality.
  - [ ] Reserve bit `2` for yaw validity.
  - [ ] Reserve bit `3` for course-over-ground validity.
  - [ ] Reserve bit `4` for speed validity.
  - [ ] Reserve bits `5-7` for future use.
  - [ ] Define how invalid fields should be encoded.

## Shared Channel Control Packets

- [ ] Milestone 4: Define packet type IDs
  - [ ] Define `JOIN_REQUEST`.
  - [ ] Define `SILENCE`.
  - [ ] Define `JOIN_ASSIGN`.
  - [ ] Define `JOIN_ACK`.
  - [ ] Define future-reserved packet type range.

- [ ] Milestone 5: Define `JOIN_REQUEST`
  - [ ] Include packet type.
  - [ ] Include drone node ID.
  - [ ] Include a random join nonce.
  - [ ] Include capability flags.
  - [ ] Keep the packet near `5 bytes`.

Proposed layout:

```text
type               uint8    1
node_id            uint8    1
nonce              uint16   2
cap_flags          uint8    1
-----------------------------
total                       5 bytes
```

- [ ] Milestone 6: Define `SILENCE`
  - [ ] Include packet type.
  - [ ] Include silence sequence number.
  - [ ] Include quiet duration in milliseconds.
  - [ ] Ensure drones exit silence automatically when the duration expires.
  - [ ] Keep the packet near `4 bytes`.

Proposed layout:

```text
type               uint8    1
silence_seq        uint8    1
quiet_ms           uint16   2
-----------------------------
total                       4 bytes
```

- [ ] Milestone 7: Define `JOIN_ASSIGN`
  - [ ] Include packet type.
  - [ ] Include target node ID.
  - [ ] Include the join nonce from the request.
  - [ ] Include channel index.
  - [ ] Include radio profile ID.
  - [ ] Include telemetry transmit period in milliseconds.
  - [ ] Include lease duration.
  - [ ] Keep the packet near `8 bytes`.

Proposed layout:

```text
type               uint8    1
target_node_id     uint8    1
nonce              uint16   2
channel_index      uint8    1
radio_profile_id   uint8    1
tx_period_ms       uint8    1
lease_seconds      uint8    1
-----------------------------
total                       8 bytes
```

- [ ] Milestone 8: Define `JOIN_ACK`
  - [ ] Include packet type.
  - [ ] Include node ID.
  - [ ] Include nonce.
  - [ ] Include assigned channel index.
  - [ ] Keep the packet near `5 bytes`.

Proposed layout:

```text
type               uint8    1
node_id            uint8    1
nonce              uint16   2
channel_index      uint8    1
-----------------------------
total                       5 bytes
```

## Expected Airtime

- [ ] Milestone 9: Verify airtime calculations in code
  - [ ] Verify `5-byte JOIN_REQUEST` airtime is about `15.5 ms`.
  - [ ] Verify `4-byte SILENCE` airtime is about `15.5 ms`.
  - [ ] Verify `8-byte JOIN_ASSIGN` airtime is about `18.0 ms`.
  - [ ] Verify `5-byte JOIN_ACK` airtime is about `15.5 ms`.
  - [ ] Verify `20-byte telemetry` airtime is about `25.7 ms`.
  - [ ] Recalculate if preamble, SF, BW, CR, header mode, or CRC mode changes.

## Channel Plan

- [ ] Milestone 10: Define the BW500 channel table
  - [ ] Use `500 kHz` center spacing.
  - [ ] Use `915.0 MHz` as the shared discovery/control channel.
  - [ ] Reserve `914.5 MHz` and `915.5 MHz` as guard/reserved channels.
  - [ ] Treat all other clear channels as telemetry candidates.
  - [ ] Validate the channel table against local radio regulations before field use.

Proposed BW500 center-frequency table:

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

- [ ] Milestone 11: Implement boot noise scan policy
  - [ ] GC scans candidate telemetry channels at boot.
  - [ ] GC samples RSSI/noise floor multiple times per candidate channel.
  - [ ] GC discards noisy channels.
  - [ ] GC stores the clear channel list in runtime memory.
  - [ ] GC allocates channels uniformly from the clear candidate set.

## Join And Assignment Flow

- [ ] Milestone 12: Define shared channel behavior
  - [ ] Unassigned drones wait on the shared channel.
  - [ ] Unassigned drones use random backoff between `25-250 ms`.
  - [ ] Unassigned drones perform LBT before sending `JOIN_REQUEST`.
  - [ ] GC sends `SILENCE` before `JOIN_ASSIGN`.
  - [ ] GC repeats `SILENCE -> JOIN_ASSIGN -> wait for JOIN_ACK` until acknowledged or timeout.
  - [ ] Drone accepts `JOIN_ASSIGN` only when node ID and nonce match.
  - [ ] Drone switches to assigned telemetry channel only after sending `JOIN_ACK`.
  - [ ] GC considers assignment active only after receiving telemetry on the assigned channel.

## Telemetry Timing

- [ ] Milestone 13: Define drone transmit timing
  - [ ] Drone computes telemetry airtime from packet size and active LoRa parameters.
  - [ ] Drone computes `tx_period_ms = ceil(airtime_ms) + airtime_buffer_ms`.
  - [ ] Drone starts the next telemetry transmission on that period.
  - [ ] Initial buffer is configurable and should start at `1-5 ms`.

- [ ] Milestone 14: Define GC scan timing
  - [ ] GC records packet receive-done time for each drone.
  - [ ] GC estimates packet start time as `rx_done_time - airtime_ms`.
  - [ ] GC predicts the next packet start from the known transmit period.
  - [ ] GC tunes to the drone channel before predicted start by a guard time.
  - [ ] GC corrects each drone phase estimate after each received packet.
  - [ ] GC falls back to longer listening windows after missed packets.
  - [ ] GC periodically returns to the shared channel to catch new drones.
