# SGC/GC Serial Log Summary - 2026-06-12T14-58-59.357Z

## Capture Overview

- Input log: `C:\Users\tamipinhasi\Downloads\sgc_gc_serial_2026-06-12T14-58-59-357Z.jsonl`
- Capture span: `2026-06-12T14:58:22.918Z` to `2026-06-12T14:58:59.355Z` (`36.437 s`)
- Lines/messages parsed: `681`
- First line is an SGC `export_snapshot` taken at the end of the capture; the live serial stream begins on line 2.

## Message Counts

- `channel_scan_event`: `447`
  - `channel_scanned`: `432` (`3 scans * 3 profiles * 48 telemetry candidates`)
  - `profile_scan_started`: `9`
  - `scan_started`: `3`
  - `scan_complete`: `3`
- `drone_telemetry`: `151`
- `drone_link_status`: `18`
- `scanner_event`: `15`
- `assignment_event`: `7`
- `session_event`: `6`
- `command`: `3`
- `channel_table`: `3`
- `gc_status`: `3`
- `command_ack`: `3`
- `search_event`: `3`
- raw firmware text lines with no JSON `type`: `21`
- `orphan_recovery_event`: `0`

## Node And Assignment Sequence

- The log starts with node `6` still assigned to `908.5 MHz`, channel `12`, profile `0`, but the GC is missing telemetry and trying manual/automatic relock.
- At `14:58:24.602Z`, SGC sends `clear_all_assignments`.
- GC clears persisted assignments and runs a fresh-session CAD scan.
- After the scan completes with `0` assigned drones, node `6` sends a shared-channel join request.
- GC assigns node `6` to `905.5 MHz`, channel `6`, profile `0`, `txPeriodMs=100`.
- Node `6` then produces `151` telemetry packets on `905.5 MHz`.
- Telemetry RSSI range: `-93` to `-65 dBm`; SNR range: `5.5` to `14.5 dB`.
- GPS source was real FC GPS: `gpsSource=fc_gps`, satellite count `12-16`.

## Scan And OOCR Observations

- The new three-profile scan is present in this log:
  - Fast profile `0`: `SF8 / BW500 / CR4/5`
  - Balanced profile `46`: `SF10 / BW500 / CR4/6`
  - Robust profile `55`: `SF11 / BW250 / CR4/7`
- Scan 1, fresh session, before reassignment:
  - Result: `45 free`, `3 occupied`, `0 assigned`
  - Occupied: `908.0 MHz`, `916.0 MHz`, `927.5 MHz`
- Scan 2, manual rescan with node `6` assigned:
  - Result: `41 free`, `6 occupied`, `1 assigned`
  - Assigned: `905.5 MHz`
- Scan 3, manual rescan with node `6` assigned:
  - Result: `41 free`, `6 occupied`, `1 assigned`
  - Assigned: `905.5 MHz`
- OOCR did not run in this capture:
  - No `orphan_recovery_event`
  - No `orphan_assignment_recovered`
  - `gc_status.orphanRecoveryActive=false`
  - `gc_status.orphanRecoveryCandidates=0`
  - `gc_status.orphanRecoveredCount=0`
- This log tests the new profile-aware scan, but not OOCR recovery.

## Occupied Channels Away From The Drone

Node `6` was assigned to `905.5 MHz`, channel `6`, profile `0` after the fresh session. The following occupied detections are not close to that assigned telemetry channel.

| Channel | Frequency | Distance From 905.5 MHz | Scan(s) | Detected Profiles | RSSI/display RSSI | Assessment |
|---:|---:|---:|---|---|---|---|
| 20 | `912.5 MHz` | `+7.0 MHz` | 2, 3 | `46`, then `46` and `55` | `-94`, then `-76 dBm` | Repeated and became strong, but not the node 6 channel/profile. Could be external LoRa/ISM activity or repeated CAD false positive. Not enough evidence to call it drone telemetry. |
| 49 | `927.0 MHz` | `+21.5 MHz` | 2, 3 | `46`, then `55` | `-89`, `-92 dBm` | Repeated upper-band activity. Far from node 6; likely external RF or systematic CAD false positive, not node 6. |
| 50 | `927.5 MHz` | `+22.0 MHz` | 1, 2, 3 | `46`, `46`, then `55` | `-89`, `-89`, `-91 dBm` | Most persistent far-channel detection. Far from node 6 and profile changes between scans, so this is not convincing drone telemetry. |
| 27 | `916.0 MHz` | `+10.5 MHz` | 1 only | `0` | `-94 dBm` | One-off weak detection before node 6 was reassigned. Likely ambient activity or false positive. |
| 42 | `923.5 MHz` | `+18.0 MHz` | 3 only | `0` | `-97 dBm` | One-off weak detection. Low confidence. |
| 47 | `926.0 MHz` | `+20.5 MHz` | 3 only | `46` | `-93 dBm` | One-off weak upper-band detection. Low confidence. |

Near-channel detections around node `6` also appeared:

- `905.0 MHz`, channel `5`, profile `0`, seen in scans 2 and 3.
- `905.5 MHz`, channel `6`, profile `0`, assigned channel, seen in scans 2 and 3.
- `906.0 MHz`, channel `7`, profile `0`, seen in scan 2.
- These are close enough to the assigned channel that receiver bandwidth, scan timing, and strong local signal effects are plausible.

There is also a first-scan detection at `908.0 MHz`, channel `11`, profile `46`, `-97 dBm`. That was before reassignment, while the stale assignment in the log was `908.5 MHz`, channel `12`; it may be related to the previous drone channel rather than the later `905.5 MHz` assignment.

## Why Far Channels Look Occupied

The current scan proves only CAD/LBT activity, not valid drone packets.

Current firmware behavior:

- For each candidate channel/profile, GC tunes, waits `BOOT_SCAN_SETTLE_MS=4 ms`, and calls `mesh.scanChannelActivity()` once.
- On SX1262, this uses RadioLib `scanChannel()`.
- The backend returns occupied when RadioLib reports `RADIOLIB_LORA_DETECTED`, `RADIOLIB_PREAMBLE_DETECTED`, or any non-free/non-OK state.
- The result is stored as one boolean: `activityDetected`.
- No packet is decoded during spectrum scan, and no `TelemetryPacket` validation happens.

So a yellow occupied channel currently means:

> The radio saw CAD/LBT activity for that profile/channel at that instant.

It does not mean:

> A known drone transmitted a valid live-position telemetry packet there.

The persistent detections near `927-927.5 MHz` are especially suspicious because they are far from node `6`, repeat across scans, and change detected profile. They may be real external 902-928 MHz ISM activity, CAD false positives, or receiver/environment effects. They are not plausible node `6` telemetry based on this log alone.

## Recommendation

Yes, multiple CAD/LBT samples and confidence scoring would improve the scan.

Recommended next step:

- Keep the current single-pass CAD scan as a fast first pass.
- For channels with `activityDetected=true`, run a second-stage confirmation pass:
  - Take `3-5` CAD/LBT samples per detected profile.
  - Track `cadSamples`, `cadHits`, `hitRatio`, and the exact activity reason if RadioLib exposes it (`lora_detected`, `preamble_detected`, generic busy/error).
  - Only classify as confidently occupied when multiple samples hit, or when activity repeats across scans.
  - Keep weak one-off hits as `suspect` or low-confidence occupied.
- For OOCR, confidence should be stricter:
  - CAD is only a hint.
  - Binding should require decoded valid 20-byte telemetry packets from the same node/channel/profile, as planned.

Best practical model:

- `free`: no CAD/LBT hits.
- `suspect`: one weak CAD/LBT hit, no repeated evidence.
- `occupied`: repeated CAD/LBT hits, repeated across scans, or strong profile-consistent activity.
- `confirmed_drone`: valid decoded telemetry packet.

This would let SGC display "how confident are we that this is real drone traffic" instead of treating one CAD/LBT hit as final truth.
