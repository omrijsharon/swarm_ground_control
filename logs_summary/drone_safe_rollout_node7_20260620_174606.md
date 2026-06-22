# Drone Safe Rollout Report

- Created: `2026-06-20T17:46:06+00:00`
- Port: `COM13`
- Expected node ID: `7`
- Flash requested: `False`
- Flash performed: `False`

## Preflight USB

- Log: `C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\logs_summary\drone_safe_rollout_pre_20260620_174547.jsonl`
- Observed: `{"boot_count": 3, "log_warning": null, "node_id": 7, "node_role_text": "drone", "ota_ready_host": "simple-mesh-7", "ota_ready_ip": "192.168.68.100", "ota_transport_hint": "sta", "source_role": "drone", "state": "assigned_telemetry", "telemetry_tx_count": 55}`

## Wi-Fi

- Host checked: `192.168.68.100`
- Result: `{"debug_status": [{"accepted": true, "command": "get_status", "commandId": "safe-rollout-1781977566604", "gcMillis": 18575, "message": "drone status", "sourceRole": "drone", "target": "drone", "type": "command_ack"}, {"altitudePollMs": 9, "attitudePollMs": 9, "channelIndex": 18, "fcAltitudeValid": true, "fcAttitudeValid": true, "frequencyMhz": 911.5, "gcMillis": 18576, "gpsPollMs": 9, "gpsSimulated": false, "lastTxAltitudeFresh": true, "lastTxAttitudeFresh": true, "lastTxDurationMs": 39, "lastTxGpsFresh": true, "lastTxLatenessMs": 0, "lastTxMspFresh": true, "lastTxStartMs": 18536, "maxTxDurationMs": 39, "maxTxLatenessMs": 5, "mspBatchFlags": 7, "mspBatchMs": 9, "mspBatchOk": true, "mspFixedSlotMs": 22, "mspLastSlotMs": 9, "mspMaxSlotMs": 10, "mspSlotOverrunCount": 0, "nextTxMs": 18714, "nodeId": 7, "radioProfileId": 0, "sequenceId": 59, "simulatedFc": false, "state": "assigned_telemetry", "telemetryAirtimeMs": 25.728, "telemetryTxCount": 59, "txAltitudeFreshCount": 56, "txAttitudeFreshCount": 56, "txGpsFreshCount": 56, "txMspFreshCount": 56, "txMspStaleCount": 3, "txPeriodMs": 200, "type": "drone_live_status"}, {"bootCount": 3, "channelIndex": 18, "commandCount": 2, "forcedJoinTxCount": 0, "frequencyMhz": 911.5, "gcMillis": 18578, "holdUntilMs": 0, "joinAttemptCount": 1, "joinBackoffKind": "first_fast", "joinBackoffMs": 372, "joinFastLbtFailCount": 0, "joinHeld": false, "joinMode": "auto", "joinRequestSentMs": 3732, "nextActionMs": 2728, "nodeId": 7, "radioProfileId": 0, "rebootPending": false, "resetReason": 0, "runtimeResetCount": 0, "sourceRole": "drone", "state": "assigned_telemetry", "telemetryDropRemaining": 0, "telemetryDropTotalCount": 0, "telemetryPaused": false, "telemetryRfLossRemaining": 0, "telemetryRfLossTotalCount": 0, "telemetryTxCount": 59, "type": "drone_debug_status"}], "error": null, "host": "192.168.68.100", "ok": true, "ota_status": {"configPresent": true, "droneDebug": true, "fallbackApFromConfiguredSta": false, "hostname": "simple-mesh-7", "ip": "192.168.68.100", "mac": "E0:72:A1:F9:EE:1C", "mdnsName": "simple-mesh-7.local", "port": 8080, "running": true, "transport": "sta", "type": "ota_status", "uploading": false, "uptimeMs": 18502, "wifiChannel": 2, "wifiRssi": -42}}`
