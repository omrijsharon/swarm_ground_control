# SGC GC Serial Log Summary: 2026-06-13T14-35-23-946Z

Question: after flashing GC and drone for the new `SF12 / BW125 / CR4/8` discovery profile, why does the GC fail to bind to the expected drone, node `7`?

Source log: `C:\Users\tamipinhasi\Downloads\sgc_gc_serial_2026-06-13T14-35-23-946Z.jsonl`

## Capture Scope

- The file contains `441` JSONL records and `0` JSON parse errors.
- Record `1` is an SGC UI export snapshot taken at `2026-06-13T14:35:23.942Z`.
- Records `2-441` cover live Web Serial activity from `2026-06-13T14:34:05.362Z` through `2026-06-13T14:35:23.942Z`, about `78.58 s`.
- Serial port: `VID 0x303a / PID 0x1001`.
- Baud: `921600`.
- Live directions:
  - `gc_to_sgc`: `431`
  - `sgc_to_gc`: `5`
  - local SGC diagnostic records: `5`
- Parsed serial JSON records: `384`.
- Raw non-JSON firmware log records: `52`.
- There are `0` `drone_telemetry` records. Node `7` never becomes an active telemetry source in this capture.

## Important Counts

GC-to-SGC typed event counts:

- `channel_scan_event`: `298`
  - `scan_started`: `2`
  - `profile_scan_started`: `6`
  - `channel_scanned`: `288`
  - `scan_complete`: `2`
- `assignment_event`: `26`
  - `join_request_received`: `2`
  - `assign_created`: `2`
  - `silence_sent`: `6`
  - `assign_sent`: `6`
  - `join_ack_timeout`: `6`
  - `join_ack_retries_exhausted`: `2`
  - `assign_rollback_removed`: `2`
- `search_event`: `6`
  - `search_started`: `2`
  - `join_detected`: `2`
  - `search_timeout`: `2`
- `scanner_event`: `9`
  - `timing_proposal_missed`: `6`
  - `shared_rejoin_probe`: `3`
- `orphan_recovery_event`: `10`
  - `started`: `1`
  - `confirmation_listen`: `4`
  - `candidate_failed`: `4`
  - `complete`: `1`
- `drone_link_status`: `13`
- `session_event`: `4`
- `gc_status`: `4`
- `channel_table`: `4`
- `command_ack`: `5`
- `warning`: `0`
- `error`: `0`

SGC-to-GC commands:

- `get_status`: `1`
- `get_channel_table`: `1`
- `start_search`: `2`
- `clear_all_assignments`: `1`

## Radio Profile And Airtime

Boot text initially prints a generic radio init at:

- Frequency: `915.00 MHz`
- Bandwidth: `500.0 kHz`
- SF: `8`
- CR: `4/5`

The later live-position profile logs and `gc_status` records show the relevant active profile for this run:

- Default assignment profile: `64`
- Active assignment profile: `radioProfileId 64`
- Shared discovery profile: `discoveryRadioProfileId 255`
- Assignment and discovery PHY in status: `SF12`, `BW125000`, `CR 4/8`
- TX power: `22 dBm`
- Telemetry airtime: `1712.128 ms`
- Accepted/default TX period: `1787 ms`
- Expected update interval in assignments: `3574 ms`
- Discovery packet airtimes:
  - `silence`: `925.696 ms`
  - `join_request`: `925.696 ms`
  - `join_assign`: `1187.840 ms`
  - `join_ack`: `925.696 ms`
- Search shared dwell: `3584 ms`

This is a very slow bind path. One `SILENCE -> JOIN_ASSIGN -> ACK wait` attempt takes roughly four seconds in the observed event spacing.

Note: scan log text says `CAD scanning 48 BW500 telemetry candidate channels`, but the emitted `channel_table` and `gc_status` report `bandwidthHz: 125000`. That may be a stale human log label, but it is worth checking in firmware because this log is specifically about a new profile change.

## Channel Scan And Spectrum

Initial boot scan:

- `2026-06-13T14:34:07.022Z`: scan started.
- `2026-06-13T14:34:13.111Z`: scan complete with `freeChannels 40`, `occupiedChannels 8`, `assignedChannels 0`.
- Immediately after scan, firmware logs `loaded persisted assignments: loaded=1 dropped=0 active=1`.
- Channel table then shows one persisted node `7` assignment:
  - Frequency `926.5 MHz`
  - Channel index `48`
  - Profile `64`
  - `txPeriodMs 1787`
  - `telemetryAirtimeMs 1712.128`
  - `timingAccepted false`
  - `lastSeenGcMillis 0`
  - `rssi -127`, `snr 0`

Initial scan CAD suspects:

- Fast profile CAD detected activity on `902.5`, `906.0`, `910.5`, `917.0`, `918.0`, `924.5`, `925.5`, and `926.0 MHz`.
- Balanced and robust profile scan passes detected no occupied channels.
- The persisted assignment channel `926.5 MHz` was not confirmed by decoded telemetry.

Fresh-session rescan:

- `2026-06-13T14:34:36.267Z`: SGC sends `clear_all_assignments`, reason `start_fresh_session`.
- `2026-06-13T14:34:42.114Z`: scan complete with `freeChannels 44`, `occupiedChannels 4`, `assignedChannels 0`.
- Post-fresh CAD suspects are `907.5`, `908.0`, `909.5`, and `916.5 MHz`, all detected only by fast-profile CAD.
- Orphan recovery listened to those four CAD-suspect channels and recovered `0` drones.

## Timeline

- `14:34:05.362Z`: SGC auto-opens the serial port.
- `14:34:05.520Z` and `14:34:05.521Z`: SGC requests `get_status` and `get_channel_table`.
- `14:34:07.016Z` to `14:34:07.018Z`: firmware prints the live-position profile details. The active profile is `64`, `SF12 / BW125 / CR4/8`; telemetry airtime is `1712.128 ms`, TX period `1787 ms`.
- `14:34:07.022Z` to `14:34:13.111Z`: boot channel scan runs.
- `14:34:13.133Z`: GC loads one persisted assignment: node `7` on `926.5 MHz`, active `1`.
- `14:34:13.592Z`: node `7` link state is `locking`, reason `phase_unknown`, on `926.5 MHz`.
- `14:34:16.979Z` to `14:34:34.109Z`: stale persisted assignment never locks. GC alternates `offline` and `locking`; scanner emits six `timing_proposal_missed` events and three `shared_rejoin_probe` events.
- `14:34:17.463Z`: SGC sends first `start_search`.
- `14:34:17.468Z`: search starts.
- `14:34:32.466Z`: first search times out with no join.
- `14:34:36.267Z`: SGC sends `clear_all_assignments` for Start Fresh Session.
- `14:34:36.299Z` to `14:34:42.335Z`: GC clears persisted assignments, rescans channels, emits fresh channel table/status, and reports `assignedDrones 0`.
- `14:34:45.307Z`: SGC sends second `start_search`.
- `14:34:45.311Z`: search starts.
- `14:34:45.313Z` to `14:34:48.285Z`: orphan recovery checks four fast CAD-suspect channels. All fail with `reason: no_valid_packet`; recovered count stays `0`.
- `14:34:55.094Z`: GC receives a `JOIN_REQUEST` from node `7` with `RSSI -50 dBm`, `SNR 5.25 dB`.
- `14:34:55.095Z`: search emits `join_detected`.
- `14:34:55.226Z`: GC creates assignment for node `7` on `916.0 MHz`, channel `27`, profile `64`.
- `14:34:56.163Z`: attempt `1` sends `silence_sent`, `quietMs 2500`.
- `14:34:57.367Z`: attempt `1` sends `assign_sent`.
- `14:34:59.170Z`: attempt `1` times out waiting for `JOIN_ACK`.
- `14:35:00.110Z`: attempt `2` sends silence.
- `14:35:01.313Z`: attempt `2` sends assignment.
- `14:35:03.117Z`: attempt `2` times out waiting for `JOIN_ACK`.
- `14:35:04.057Z`: attempt `3` sends silence.
- `14:35:05.261Z`: attempt `3` sends assignment.
- `14:35:07.064Z`: attempt `3` times out waiting for `JOIN_ACK`.
- `14:35:07.068Z`: retries exhausted for node `7`, `reason: ack_not_received_after_retries`.
- `14:35:07.069Z`: assignment rollback removes node `7`, `reason: join_ack_not_received`.
- `14:35:07.082Z`: search times out, but a later join is still detected outside active search mode.
- `14:35:09.242Z`: GC receives another `JOIN_REQUEST` from node `7` with `RSSI -49 dBm`, `SNR 5.0 dB`.
- `14:35:09.244Z`: `join_detected` is emitted with `searchMode false`.
- `14:35:09.261Z`: GC creates a new assignment for node `7` on `903.5 MHz`, channel `2`, profile `64`.
- `14:35:10.201Z` to `14:35:21.102Z`: the second bind attempt repeats the same three `silence_sent -> assign_sent -> join_ack_timeout` cycles.
- `14:35:21.105Z`: retries exhausted for the second assignment, again `ack_not_received_after_retries`.
- `14:35:21.106Z`: assignment rollback removes node `7`.
- `14:35:23.942Z`: snapshot is exported. No drones are shown, no assignments remain, recent assignment events end with the second rollback.

## JOIN, Search, Bind, And Orphan Recovery

There are no literal `Bind` event records in this capture. Binding is represented by the JOIN assignment events.

The GC does receive node `7` JOIN requests twice:

1. First JOIN:
   - `gcMillis 53016`, node `7`, `RSSI -50`, `SNR 5.25`.
   - Assignment created on `916.0 MHz`, channel `27`, profile `64`.
   - Three assignment attempts are sent.
   - All three attempts time out waiting for `JOIN_ACK`.
   - Assignment is rolled back.

2. Second JOIN:
   - `gcMillis 67165`, node `7`, `RSSI -49`, `SNR 5.0`.
   - Assignment created on `903.5 MHz`, channel `2`, profile `64`.
   - Three assignment attempts are sent.
   - All three attempts time out waiting for `JOIN_ACK`.
   - Assignment is rolled back.

Important: the received JOIN request RSSI/SNR are strong enough for a bench/near-field test. The problem is not that the GC cannot hear the drone's discovery request. The problem is that after the GC transmits `JOIN_ASSIGN`, the GC never receives the drone's `JOIN_ACK`.

Orphan recovery does not explain the bind failure:

- It runs only after fresh-session search because four fast CAD-suspect channels exist.
- It listens on `907.5`, `908.0`, `909.5`, and `916.5 MHz`.
- Every candidate fails with `no_valid_packet`.
- No `packet_seen`, `confirmed_drone`, or `assignment_recovered` event appears.

## Main Failure Signature

The core signature is:

```text
JOIN_REQUEST heard from node 7 -> assignment created -> silence sent -> assignment sent -> JOIN_ACK timeout
```

That happens twice, across two different assigned channels, with three retries each:

- First assignment: `916.0 MHz`, channel `27`
- Second assignment: `903.5 MHz`, channel `2`

The GC can hear node `7` on the shared channel, but node `7` either:

- does not receive `SILENCE` or `JOIN_ASSIGN`,
- receives `JOIN_ASSIGN` but rejects/fails to parse it,
- switches to the assigned channel/profile before sending ACK while the GC expects ACK elsewhere,
- sends ACK using a different PHY/profile/frequency/packet format than the GC is listening for,
- or is blocked/delayed long enough that the ACK misses the GC's SF12 ACK window.

## Hypothesis

Most likely cause: a protocol/profile mismatch or handoff bug in the downlink/ACK side of the new SF12/BW125/CR4/8 bind flow.

Why:

- The GC receives node `7` JOIN requests twice with strong link metrics (`RSSI -50/-49 dBm`, `SNR 5.25/5.0 dB`), so shared-channel uplink from drone to GC works.
- The GC transmits six assignment attempts total, but receives zero `JOIN_ACK`.
- The same failure repeats on two different clear assigned channels, so the assigned frequency choice is unlikely to be the primary cause.
- There are zero `drone_telemetry` records and zero `join_ack_received` records.
- The pre-fresh stale assignment on `926.5 MHz` also never locks and has `timingAccepted false`, `lastSeenGcMillis 0`, `rssi -127`, which suggests previous assignment state was not useful. Clearing it was correct, but the fresh bind still failed.

The next firmware-side checks should focus on what node `7` does immediately after receiving or attempting to receive `JOIN_ASSIGN`:

- Confirm the drone logs receipt or non-receipt of each `SILENCE` and `JOIN_ASSIGN`.
- Confirm GC and drone use the same shared discovery PHY for `JOIN_REQUEST`, `SILENCE`, `JOIN_ASSIGN`, and `JOIN_ACK`: `SF12 / BW125 / CR4/8`, preamble `8`, CRC enabled, same sync word and packet IDs.
- Confirm both firmwares agree on packet sizes and IDs for the new live-position control packets.
- Confirm the drone sends `JOIN_ACK` on the channel/profile the GC is actually listening to after `assign_sent`.
- Check whether the huge SF12 packet airtimes require a longer ACK listen deadline or different state timing on the drone.
- Check the stale `CAD scanning 48 BW500 telemetry candidate channels` boot log text against the actual configured profile, because if it reflects real radio tuning rather than stale text, the scanner/assignment code may still contain mixed-profile assumptions.

