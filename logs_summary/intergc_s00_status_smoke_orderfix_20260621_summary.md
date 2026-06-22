# Live Debug Log Summary

- Source: `logs_summary\intergc_s00_status_smoke_orderfix_20260621.jsonl`
- Parsed records: 632
- Approx duration: 50.1s

## Commands
- Sent commands: 2
- ACKs: 2 (0 rejected)
- Derived ACK latency: min 18 ms, max 282 ms, avg 150 ms
- Inter-GC queued command events: 1
- t+12.027s ACK telegc/telemetry_ground_control get_status accepted: -
- t+12.291s ACK magc/magic_ground_control get_status accepted: -

## Inter-GC Transport
- Inter-GC status rows: 4
- Max reliable queue depth: 0
- Max event outbox depth: 0
- Reliable queue full drops: 0
- Command timeout failures: 0
- Event drops high/medium/low: 0/0/0
- Event coalesced: 0
- Malformed RX JSON payload lines: 4
- Malformed samples: t+17.225s telegc: {"type":"channel_scan_event","event":"background_oocr_slice","radioProfileId":0,"profileName":"fast","activityDetected":; t+18.219s telegc: {"type":"orphan_recovery_event","event":"candidate_failed","channelIndex":16,"frequencyMhz":910.5,"candidateScore":300,"; t+28.275s telegc: {"type":"channel_scan_event","event":"background_oocr_slice","radioProfileId":46,"profileName":"balanced","activityDetec

## Bind And Search
- Search events: 2
- Bind progress events: 9
- Assignment events: 9
- Assignment event counts: telemetry_period_observed=4, telemetry_period_locked=4, telemetry_period_rejected=1
- Auto shared RX: starts=1, active_ticks=0, joins=0, completes=1
- Auto shared RX complete reasons: auto_shared_rx_timeout
- t+3.925s node 6: timing - telemetry_period_observed
- t+4.034s node 3: timing - telemetry_period_observed
- t+4.158s node 6: complete - telemetry_period_locked
- t+4.262s node 3: complete - telemetry_period_locked
- t+12.834s node 3: timing - telemetry_period_observed
- t+12.942s node 6: timing - telemetry_period_observed
- t+13.066s node 3: complete - telemetry_period_locked
- t+13.131s node 6: timing - telemetry_period_rejected
- t+13.355s node 6: complete - telemetry_period_locked

## CAD And OOCR
- Channel scan events: 0
- CAD samples: rows=0, validated=0, rejected=0, one_hit_rejected=0
- OOCR events: 0

## Post-Bind Telemetry
- Post-bind acquire events: starts=0, first_telemetry=0, timeouts=0
- node 3
- node 6

## Drone Debug
- Drone JOIN events: 0
- Drone debug events/status rows: 0
- Drone telemetry rows: 429

## Short-Loss Guard
- Telemetry rebind events: 13
- Short-loss event counts: short_loss_guard_active=7, short_loss_guard_started=1, short_loss_guard_expired=1
- Recent short-loss events: t+28.583s node 3 short_loss_guard_active miss=2 gap=-; t+28.786s node 3 short_loss_guard_active miss=3 gap=-; t+28.980s node 3 short_loss_guard_active miss=4 gap=-; t+29.191s node 3 short_loss_guard_active miss=5 gap=-; t+29.387s node 3 short_loss_guard_active miss=6 gap=-; t+29.593s node 3 short_loss_guard_active miss=7 gap=-; t+29.792s node 3 short_loss_guard_active miss=8 gap=-; t+30.000s node 3 short_loss_guard_expired miss=9 gap=-

## Telemetry Coverage
- Latest status at t+12.064s: mode `telemetry_first`
- Assigned packets received: 81
- Assigned RX coverage: 98%
- Sequence gap events: 0
- Missing sequence IDs: 0
- Max sequence gap: 0
- Assigned slot misses: 1
- Non-assigned preemptions: 0
- Coverage modes seen: telemetry_first=1

## Telemetry Sequence Gaps
- Observed sequence gaps: 12
- node 6: t+12.027s seq 252 -> t+12.365s seq 254; missing [253]
- node 6: t+12.365s seq 254 -> t+13.026s seq 1; missing [255, 0]
- node 6: t+18.219s seq 26 -> t+18.522s seq 28; missing [27]
- node 6: t+28.063s seq 76 -> t+28.507s seq 78; missing [77]
- node 6: t+28.507s seq 78 -> t+30.520s seq 88; missing [79, 80, 81, 82, 83, 84, 85, 86, 87]
- node 6: t+40.501s seq 137 -> t+40.625s seq 139; missing [138]
- node 3: t+12.291s seq 233 -> t+12.927s seq 237; missing [234, 235, 236]
- node 3: t+18.025s seq 6 -> t+18.319s seq 8; missing [7]
- node 3: t+18.319s seq 8 -> t+18.824s seq 10; missing [9]
- node 3: t+28.275s seq 57 -> t+30.313s seq 68; missing [58, 59, 60, 61, 62, 63, 64, 65, 66, 67]
- node 3: t+30.313s seq 68 -> t+30.827s seq 70; missing [69]
- node 3: t+40.124s seq 117 -> t+40.501s seq 119; missing [118]

## Transport Findings
- Malformed serial JSON payloads: 4.

## State Flicker
- Node 3: 1 rapid state transitions: t+4.125s offline->online

## Event Counts
- drone_telemetry: 429
- scanner_event: 32
- telemetry_rebind_event: 13
- assignment_event: 9
- bind_progress_event: 9
- assignments: 6
- drone_link_status: 5
- assignment_timing_hint: 4
- inter_gc_status: 4
- command: 2
- command_ack: 2
- gc_status: 2
- search_event: 2
- inter_gc_command_queued: 1
