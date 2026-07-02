# ESP32 Build, Flash, And OTA Guide

This guide explains the current live-position firmware workflow for:

- Single GC ESP32: ground-control XIAO ESP32S3 connected to SGC by USB serial.
- MaGC ESP32: magic ground-control module for Bind/search/scan/allocation.
- TeleGC ESP32: telemetry ground-control module connected to SGC by USB serial.
- Bridge receiver ESP32: fixed LoRa backhaul receiver connected to SGC by USB serial.
- Drone ESP32: drone XIAO ESP32S3. For live-radio bench work, update by
  firmware-only USB flash so Web OTA startup cannot block JOIN or telemetry.

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

For normal updates, flash firmware only or use Web OTA on GC/bridge roles. Do
not upload LittleFS unless you intentionally want to change the board identity
or role.

Supported live-position roles:

- `ground_station`: single-module GC, connected directly to SGC.
- `magic_ground_control`: MaGC, shared-channel Bind/search/scan/allocation module.
- `telemetry_ground_control`: TeleGC, telemetry RX module connected to SGC.
- `bridge_receiver`: LoRa bridge receiver connected to SGC. V2 forwards compact
  GC snapshots downlink and queues SGC commands for scheduled RF uplink.
- `drone`: drone ESP32 connected to the FC MSP UART.

## Scripts

The repo includes these PowerShell helpers:

```powershell
.\tools\build_ota_firmware.ps1
.\tools\flash_firmware_only.ps1
.\tools\provision_node.ps1
.\tools\provision_wifi_ota.ps1
.\tools\find_ota_device.ps1
.\tools\ota_upload_firmware.ps1
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

Use this for normal single-GC, MaGC, or TeleGC firmware updates.

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

For MaGC or TeleGC, firmware-only flashing also preserves the existing role in LittleFS.

3. Reconnect SGC to the GC serial port after flashing.

## Step 3B: Update GC/Bridge ESP32 By OTA

Use OTA for MaGC, TeleGC, single-GC, and bridge firmware updates. OTA preserves
existing LittleFS config, so the board keeps its `node_id` and `node_role`.

In the current live-position firmware, drone-role Web OTA does not auto-start
during live radio operation. Wi-Fi OTA startup was measured blocking the first
assigned telemetry after bind, so Drone 7 live bench updates should use
firmware-only USB flashing unless you intentionally place the drone in a future
maintenance OTA mode.

1. Build generic firmware:

```powershell
.\tools\build_ota_firmware.ps1
```

2. Power the target ESP32.

3. Connect your computer or phone to the target OTA Wi-Fi AP:

```text
simple-mesh-<node_id>
```

For the LoRa bridge receiver, use:

```text
simple-mesh-bridge
```

Ground-control roles also use role-specific OTA SSIDs:

```text
simple-mesh-GC
simple-mesh-MaGC
simple-mesh-TeleGC
```

Drone OTA APs are maintenance-only in the current live-radio workflow. Example:

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

Expected live-radio boot lines for node 7:

```text
Node ID: 7
Node Role: drone
[OTA] Drone Web OTA auto-start disabled during live radio; use USB/maintenance flashing
```

### Home Wi-Fi Maintenance OTA

The firmware can also run OTA on your home Wi-Fi. Credentials are stored in a
separate LittleFS file, `/wifi_ota.json`, so normal firmware updates preserve
the board identity in `/config.json`.

For the drone role, home Wi-Fi OTA is not started automatically during live radio
operation. This avoids blocking LoRa JOIN and first telemetry acquisition.
Continue to use USB firmware-only flashing for Drone 7 during live bench tests
unless a deliberate maintenance OTA mode is enabled.

1. Edit the ignored local credentials file:

```powershell
C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh\data\wifi_ota.json
```

Example shape:

```json
{
  "wifi_ota": {
    "enabled": true,
    "ssid": "YOUR_HOME_WIFI",
    "password": "YOUR_HOME_WIFI_PASSWORD",
    "connect_timeout_ms": 15000,
    "fallback_ap_enabled": true,
    "ota_port": 8080
  }
}
```

2. Connect the target board by USB and send only the OTA credential file:

```powershell
.\tools\provision_wifi_ota.ps1 -Port COM18
```

Use the actual port for each board. This command does not upload LittleFS and
does not modify `/config.json`.

3. Reboot the board. If the home SSID is found, open the role hostname:

```text
http://simple-mesh-gc.local:8080
http://simple-mesh-magc.local:8080
http://simple-mesh-telegc.local:8080
http://simple-mesh-bridge.local:8080
http://simple-mesh-7.local:8080
```

If Windows or the router does not resolve `.local` reliably, discover the board
by HTTP probing instead:

```powershell
.\tools\find_ota_device.ps1 -Hostname simple-mesh-bridge -ScanSubnet
```

If PowerShell script execution is blocked, use the one-command bypass form:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\find_ota_device.ps1 -Hostname simple-mesh-bridge -ScanSubnet
```

The script prints the working IP URL, for example:

```text
http://192.168.68.100:8080
```

To make `http://simple-mesh-bridge.local:8080` work even when multicast mDNS is
broken, run PowerShell as Administrator and update the Windows hosts file:

```powershell
.\tools\find_ota_device.ps1 -Hostname simple-mesh-bridge -ScanSubnet -UpdateHosts
```

If script execution is blocked in the Administrator shell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\find_ota_device.ps1 -Hostname simple-mesh-bridge -ScanSubnet -UpdateHosts
```

For a board that still has older firmware without `/ota_status`, pass the MAC
address shown by `pio device list` or your router:

```powershell
.\tools\find_ota_device.ps1 -Hostname simple-mesh-bridge -MacAddress E0-72-A1-F9-F2-B0 -UpdateHosts
```

If home Wi-Fi is unavailable, the board falls back to its role AP and the
existing URL:

```text
http://192.168.4.1:8080
```

The OTA page does not require a username or password by default. Getting onto
the correct network and opening the device URL is the intended guard for this
bench workflow. If you explicitly add both `ota_username` and `ota_password` to
`wifi_ota.json`, the firmware enables basic auth again for that board.

During an OTA upload, ESP-NOW bridge traffic pauses and OTA has priority. After
the upload succeeds the board reboots and returns to its normal role.

To upload from the command line instead of using the browser form, first build
the firmware, then post it to the device OTA endpoint:

```powershell
.\tools\build_ota_firmware.ps1
.\tools\ota_upload_firmware.ps1 -Url http://192.168.68.100:8080 -WaitForReboot
.\tools\ota_upload_firmware.ps1 -Hostname simple-mesh-telegc -WaitForReboot
```

`ota_upload_firmware.ps1` sends only `firmware.bin` to `/update`. It does not
upload LittleFS and does not change `/config.json`.

## Step 3C: Flash Drone Firmware Over USB Without Changing Node ID

Use this if OTA is inconvenient but you still want to preserve the drone identity already stored in LittleFS.

```powershell
.\tools\flash_firmware_only.ps1 -Port COM13
```

This updates code only. It does not touch `/config.json`.

## Provision Or Repair A Node

Provisioning overwrites LittleFS `/config.json`. Use it only for a new board or when changing a board's identity/role.

The provisioning script temporarily writes `simple-mesh\data\config.json`, uploads LittleFS, optionally uploads firmware, then restores the original local `data\config.json` so the firmware repo does not stay dirty.

### Provision Single GC

GC bridge support is enabled by default. ESP-NOW is the primary bridge transport
on the runtime Wi-Fi channel; the LoRa bridge remains the fallback. Discovery is
bridge-initiated: the bridge sends ESP-NOW hello probes first, and if no MaGC
downlink is heard for `6 s`, it sends a 3-byte shared-channel LoRa bridge join
request that selects the `902.0 MHz` backhaul profile.
For bench isolation, add `-BackhaulDisabled`.

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

### Provision MaGC

Use this for the Bind/search/scan/allocation module. It is not connected to SGC
by USB during normal operation; it talks to TeleGC over UART.

MaGC bridge support is also enabled by default. For bench isolation, add
`-BackhaulDisabled`.

```powershell
.\tools\provision_node.ps1 -Role magc -Port COM18
```

This writes:

```json
{
  "node_id": 0,
  "node_role": "magic_ground_control",
  "live_position": {
    "inter_gc": {
      "enabled": true,
      "baud": 921600,
      "rx_pin": 44,
      "tx_pin": 43
    }
  }
}
```

### Provision TeleGC

Use this for the telemetry module connected to SGC by USB. It receives MaGC
assignment snapshots over UART and owns telemetry TST/period lock.

```powershell
.\tools\provision_node.ps1 -Role telegc -Port COM19
```

This writes:

```json
{
  "node_id": 0,
  "node_role": "telemetry_ground_control",
  "live_position": {
    "inter_gc": {
      "enabled": true,
      "baud": 921600,
      "rx_pin": 44,
      "tx_pin": 43
    }
  }
}
```

### Wire MaGC To TeleGC

Default XIAO ESP32S3 Inter-GC UART pins:

```text
RX = 44
TX = 43
baud = 921600
```

Wire:

```text
MaGC TX  -> TeleGC RX
MaGC RX  -> TeleGC TX
MaGC GND -> TeleGC GND
```

If you use different pins, pass them during provisioning:

```powershell
.\tools\provision_node.ps1 -Role magc -Port COM18 -InterGcRxPin 44 -InterGcTxPin 43 -InterGcBaud 921600
.\tools\provision_node.ps1 -Role telegc -Port COM19 -InterGcRxPin 44 -InterGcTxPin 43 -InterGcBaud 921600
```

### Provision Bridge Receiver

Use this for the ESP32+SX1262 module connected to the computer when the real GC
or MaGC is on a rooftop and sends UF LoRa bridge snapshots.

```powershell
.\tools\provision_node.ps1 -Role bridge -Port COM18
```

This writes:

```json
{
  "node_id": 0,
  "node_role": "bridge_receiver",
  "live_position": {
    "backhaul": {
      "frequency_mhz": 902.0,
      "period_ms": 1000,
      "max_drones": 5
    }
  }
}
```

The bridge receiver sends ESP-NOW hello probes first. When ESP-NOW downlink is
not fresh for `6 s`, it sends a compact shared-channel LoRa bridge join request
and then listens on `902.0 MHz` for MaGC's join ACK and later snapshots with the
accepted profile. It decodes
`BRIDGE_SNAPSHOT` / `BRIDGE_LIVE_DELTA` over either transport and emits `drones_state`,
`assignments`, compact `channel_table`, and `gc_status.bridgeMode = true` over
USB.

With bridge V2, SGC mutating controls are enabled only while the bridge reports
`gc_status.bridgeControl = true` and a fresh backhaul packet age under `3 s`.
Commands such as Bind, Re-bind, Re-scan, profile apply, and clear assignment are
queued by the bridge and transmitted in the scheduled uplink slot after a GC
downlink. HOME markers, drone aliases, distance measurements, and Cloudflare
publishing remain local browser features.

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

For MaGC, look for:

```text
Node ID: 0
Node Role: magic_ground_control
Inter-GC UART initialized baud=921600
```

For TeleGC, look for:

```text
Node ID: 0
Node Role: telemetry_ground_control
Inter-GC UART initialized baud=921600
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
.\tools\provision_node.ps1 -Role magc -Port COM18
.\tools\provision_node.ps1 -Role telegc -Port COM19
.\tools\provision_node.ps1 -Role drone -NodeId 7 -Port COM13
```

For normal OTA or firmware-only updates, do not upload LittleFS; the existing node identity will be preserved.
