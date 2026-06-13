# ESP32 Build, Flash, And OTA Guide

This guide explains the current live-position firmware workflow for:

- GC ESP32: ground-control XIAO ESP32S3 connected to SGC by USB serial.
- Drone ESP32: drone XIAO ESP32S3, normally updated by Web OTA.

The firmware lives in the companion repo:

```powershell
C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh
```

The helper scripts live in this SGC repo:

```powershell
C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\tools
```

Run the script commands from the SGC repo root unless stated otherwise:

```powershell
cd C:\Users\tamipinhasi\Documents\repos\swarm_ground_control
```

## Core Rule

`firmware.bin` contains code only.

`/config.json` in LittleFS contains board identity and role:

- `node_id`
- `node_role`
- LoRa defaults
- live-position options such as simulated FC mode

For normal updates, flash firmware only or use Web OTA. Do not upload LittleFS unless you intentionally want to change the board identity or role.

## Scripts

The repo includes three PowerShell helpers:

```powershell
.\tools\build_ota_firmware.ps1
.\tools\flash_firmware_only.ps1
.\tools\provision_node.ps1
```

Default firmware repo:

```powershell
C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh
```

Default PlatformIO environment:

```powershell
seeed-xiao-s3
```

If PowerShell blocks script execution for the current shell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## Step 1: List Connected Ports

```powershell
pio device list
```

Typical ports in this setup:

- GC: `COM18`
- Drone node 7: `COM13`

Use the actual port shown on your machine.

## Step 2: Build Generic Firmware

Use this for both GC and drones:

```powershell
.\tools\build_ota_firmware.ps1
```

Expected result:

```text
Firmware ready:
C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh\.pio\build\seeed-xiao-s3\firmware.bin
```

This same firmware can run as GC or drone. The board decides its role from `/config.json` already stored in LittleFS.

## Step 3A: Flash GC ESP32 Over USB

Use this for normal GC firmware updates.

1. Disconnect SGC Web Serial first.

If SGC/Chrome is still connected to the GC serial port, flashing fails with:

```text
Access to the port 'COM18' is denied
```

2. Flash firmware only:

```powershell
.\tools\flash_firmware_only.ps1 -Port COM18
```

This does not upload LittleFS. The GC keeps its existing `node_id = 0` and `node_role = ground_station`.

3. Reconnect SGC to the GC serial port after flashing.

## Step 3B: Update Drone ESP32 By OTA

Use OTA for normal drone firmware updates. OTA preserves existing LittleFS config, so the drone keeps its `node_id` and `node_role`.

1. Build generic firmware:

```powershell
.\tools\build_ota_firmware.ps1
```

2. Power the drone ESP32.

3. Connect your computer or phone to the drone OTA Wi-Fi AP:

```text
simple-mesh-<node_id>
```

Example:

```text
simple-mesh-7
```

4. Open:

```text
http://192.168.4.1:8080
```

5. Upload:

```powershell
C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh\.pio\build\seeed-xiao-s3\firmware.bin
```

6. Wait for the OTA upload to finish and for the board to reboot.

Expected boot lines for node 7:

```text
Node ID: 7
Node Role: drone
[OTA] Web OTA ready: http://192.168.4.1:8080 (SSID: simple-mesh-7)
```

## Step 3C: Flash Drone Firmware Over USB Without Changing Node ID

Use this if OTA is inconvenient but you still want to preserve the drone identity already stored in LittleFS.

```powershell
.\tools\flash_firmware_only.ps1 -Port COM13
```

This updates code only. It does not touch `/config.json`.

## Provision Or Repair A Node

Provisioning overwrites LittleFS `/config.json`. Use it only for a new board or when changing a board's identity/role.

The provisioning script temporarily writes `simple-mesh\data\config.json`, uploads LittleFS, optionally uploads firmware, then restores the original local `data\config.json` so the firmware repo does not stay dirty.

### Provision GC

```powershell
.\tools\provision_node.ps1 -Role gc -Port COM18
```

This writes:

```json
{
  "node_id": 0,
  "node_role": "ground_station"
}
```

### Provision Drone

Example for real-FC drone node 7:

```powershell
.\tools\provision_node.ps1 -Role drone -NodeId 7 -Port COM13
```

Example for simulated-FC drone node 3:

```powershell
.\tools\provision_node.ps1 -Role drone -NodeId 3 -Port COM7 -SimulatedFc -SimulatedMspBatchMs 8
```

### Upload Config Only

Use this if firmware is already correct and only LittleFS identity/config needs repair:

```powershell
.\tools\provision_node.ps1 -Role drone -NodeId 7 -Port COM13 -ConfigOnly
```

## Verify A Board Over Serial

Open a short serial read in PowerShell:

```powershell
$port = New-Object System.IO.Ports.SerialPort 'COM13', 921600, 'None', 8, 'One'
$port.ReadTimeout = 800
$port.Open()
$deadline = (Get-Date).AddSeconds(5)
while ((Get-Date) -lt $deadline) {
  try { $port.ReadLine() } catch [System.TimeoutException] {}
}
$port.Close()
```

For GC, look for:

```text
Node ID: 0
Node Role: ground_station
```

For drone, look for:

```text
Node ID: <node_id>
Node Role: drone
```

## Raw PlatformIO Commands

The scripts wrap these commands.

Build firmware:

```powershell
cd C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh
pio run -e seeed-xiao-s3
```

Flash firmware only:

```powershell
pio run -e seeed-xiao-s3 -t upload --upload-port COM18
```

Upload LittleFS config:

```powershell
pio run -e seeed-xiao-s3 -t uploadfs --upload-port COM18
```

Only run `uploadfs` when you intentionally want to overwrite `/config.json`.

## Common Problems

### Port Is Denied

Error:

```text
Access to the port 'COM18' is denied
```

Cause: SGC/Chrome or another serial monitor still has the port open.

Fix: disconnect Web Serial in SGC or close the tab, then retry.

### PlatformIO Picks Bluetooth COM Port

If upload tries `COM28` or `COM29`, specify the real USB port or use the scripts with `-Port`:

```powershell
.\tools\flash_firmware_only.ps1 -Port COM18
```

### Port Disappears During Upload

Reconnect the board or put XIAO ESP32S3 into bootloader mode:

1. Hold `BOOT`.
2. Tap `RESET`.
3. Release `BOOT`.
4. Retry upload.

### Wrong Role After Flash

If a board boots as the wrong role, its LittleFS `/config.json` is wrong. Re-provision it:

```powershell
.\tools\provision_node.ps1 -Role gc -Port COM18
.\tools\provision_node.ps1 -Role drone -NodeId 7 -Port COM13
```

For normal OTA or firmware-only updates, do not upload LittleFS; the existing node identity will be preserved.
