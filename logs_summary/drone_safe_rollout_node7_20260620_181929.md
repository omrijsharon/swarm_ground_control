# Drone Safe Rollout Report

- Created: `2026-06-20T18:19:29+00:00`
- Port: `COM13`
- Expected node ID: `7`
- Flash requested: `True`
- Flash performed: `True`

## Preflight USB

- Log: `C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\logs_summary\drone_safe_rollout_pre_20260620_181832.jsonl`
- Observed: `{"boot_count": 4, "config_file_exists": null, "config_node_id": null, "config_node_role": null, "littlefs_files": null, "log_warning": null, "node_id": 7, "node_role_text": "drone", "ota_ready_host": "simple-mesh-7", "ota_ready_ip": "192.168.68.100", "ota_transport_hint": "sta", "source_role": "drone", "state": "assigned_telemetry", "telemetry_tx_count": 45, "wifi_ota_file_exists": null, "wifi_ota_ssid": null}`

## Wi-Fi

- Host checked: `192.168.68.100`
- Result: `{"debug_status": [{"accepted": true, "command": "get_status", "commandId": "safe-rollout-1781979528608", "gcMillis": 16420, "message": "drone status", "sourceRole": "drone", "target": "drone", "type": "command_ack"}, {"altitudePollMs": 9, "attitudePollMs": 9, "channelIndex": 18, "fcAltitudeValid": true, "fcAttitudeValid": true, "frequencyMhz": 911.5, "gcMillis": 16421, "gpsPollMs": 9, "gpsSimulated": false, "lastTxAltitudeFresh": true, "lastTxAttitudeFresh": true, "lastTxDurationMs": 39, "lastTxGpsFresh": true, "lastTxLatenessMs": 0, "lastTxMspFresh": true, "lastTxStartMs": 16381, "maxTxDurationMs": 39, "maxTxLatenessMs": 5, "mspBatchFlags": 7, "mspBatchMs": 9, "mspBatchOk": true, "mspFixedSlotMs": 20, "mspLastSlotMs": 9, "mspMaxSlotMs": 10, "mspSlotOverrunCount": 0, "nextTxMs": 16561, "nodeId": 7, "radioProfileId": 0, "sequenceId": 48, "simulatedFc": false, "state": "assigned_telemetry", "telemetryAirtimeMs": 25.728, "telemetryTxCount": 48, "txAltitudeFreshCount": 45, "txAttitudeFreshCount": 45, "txGpsFreshCount": 45, "txMspFreshCount": 45, "txMspStaleCount": 3, "txPeriodMs": 200, "type": "drone_live_status"}, {"bootCount": 4, "channelIndex": 18, "commandCount": 4, "forcedJoinTxCount": 0, "frequencyMhz": 911.5, "gcMillis": 16423, "holdUntilMs": 0, "joinAttemptCount": 1, "joinBackoffKind": "first_fast", "joinBackoffMs": 372, "joinFastLbtFailCount": 0, "joinHeld": false, "joinMode": "auto", "joinRequestSentMs": 3729, "nextActionMs": 2725, "nodeId": 7, "radioProfileId": 0, "rebootPending": false, "resetReason": 0, "runtimeResetCount": 0, "sourceRole": "drone", "state": "assigned_telemetry", "telemetryDropRemaining": 0, "telemetryDropTotalCount": 0, "telemetryPaused": false, "telemetryRfLossRemaining": 0, "telemetryRfLossTotalCount": 0, "telemetryTxCount": 48, "type": "drone_debug_status"}, {"accepted": false, "command": "get_config", "commandId": "safe-rollout-1781979528642", "gcMillis": 16451, "message": "unknown command", "reason": "unknown_command", "sourceRole": "drone", "target": "drone", "type": "command_ack"}], "error": null, "host": "192.168.68.100", "ok": true, "ota_status": {"configPresent": true, "droneDebug": true, "fallbackApFromConfiguredSta": false, "hostname": "simple-mesh-7", "ip": "192.168.68.100", "mac": "E0:72:A1:F9:EE:1C", "mdnsName": "simple-mesh-7.local", "port": 8080, "running": true, "transport": "sta", "type": "ota_status", "uploading": false, "uptimeMs": 16385, "wifiChannel": 2, "wifiRssi": -31}}`

## Post-Flash USB

- Log: `C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\logs_summary\drone_safe_rollout_post_20260620_181912.jsonl`
- Observed: `{"boot_count": 6, "config_file_exists": true, "config_node_id": 7, "config_node_role": "drone", "littlefs_files": ["config.json", "wifi_ota.json"], "log_warning": null, "node_id": 7, "node_role_text": "drone", "ota_ready_host": "simple-mesh-7", "ota_ready_ip": "192.168.68.100", "ota_transport_hint": "sta", "source_role": "drone", "state": "assigned_telemetry", "telemetry_tx_count": 45, "wifi_ota_file_exists": true, "wifi_ota_ssid": "Don't Forget"}`
