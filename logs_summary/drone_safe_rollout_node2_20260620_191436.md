# Drone Safe Rollout Report

- Created: `2026-06-20T19:14:36+00:00`
- Port: `COM15`
- Expected node ID: `2`
- Flash requested: `True`
- Flash performed: `True`

## Preflight USB

- Log: `C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\logs_summary\drone_safe_rollout_pre_20260620_191308.jsonl`
- Observed: `{"boot_count": null, "config_file_exists": null, "config_node_id": null, "config_node_role": null, "littlefs_files": null, "log_warning": null, "node_id": 2, "node_role_text": "drone", "ota_ready_host": "simple-mesh-2", "ota_ready_ip": "192.168.4.1", "ota_transport_hint": "ap", "source_role": null, "state": null, "telemetry_tx_count": null, "wifi_ota_file_exists": null, "wifi_ota_ssid": null}`

## Wi-Fi

- Host checked: `192.168.4.1`
- Result: `{"debug_status": null, "error": "<urlopen error timed out>", "host": "192.168.4.1", "ok": false, "ota_status": null}`

## Post-Flash USB

- Log: `C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\logs_summary\drone_safe_rollout_post_20260620_191404.jsonl`
- Observed: `{"boot_count": 2, "config_file_exists": true, "config_node_id": 2, "config_node_role": "drone", "littlefs_files": ["config.json"], "log_warning": null, "node_id": 2, "node_role_text": "drone", "ota_ready_host": "simple-mesh-2", "ota_ready_ip": "192.168.4.1", "ota_transport_hint": "ap", "source_role": "drone", "state": "backoff", "telemetry_tx_count": 0, "wifi_ota_file_exists": false, "wifi_ota_ssid": null}`

## Post-Flash Wi-Fi

- Result: `{"debug_status": null, "error": "<urlopen error timed out>", "host": "192.168.4.1", "ok": false, "ota_status": null}`
