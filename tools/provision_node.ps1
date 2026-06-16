param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("gc", "magc", "telegc", "bridge", "drone")]
    [string]$Role,
    [Parameter(Mandatory = $true)]
    [string]$Port,
    [int]$NodeId = -1,
    [switch]$SimulatedFc,
    [int]$SimulatedMspBatchMs = 8,
    [switch]$ConfigOnly,
    [int]$InterGcRxPin = 44,
    [int]$InterGcTxPin = 43,
    [int]$InterGcBaud = 921600,
    [switch]$BackhaulEnabled,
    [switch]$BackhaulDisabled,
    [double]$BackhaulFrequencyMhz = 902.0,
    [int]$BackhaulPeriodMs = 1000,
    [int]$BackhaulMaxDrones = 5,
    [switch]$BridgeTransportDisabled,
    [int]$EspNowChannel = 1,
    [int]$EspNowSnapshotPeriodMs = 250,
    [int]$EspNowCommandRetryMs = 100,
    [int]$EspNowStaleMs = 1000,
    [int]$LoraFallbackAfterMs = 3000,
    [string]$FirmwareRepo = "C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh",
    [string]$Environment = "seeed-xiao-s3"
)

$ErrorActionPreference = "Stop"

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Command
    )

    & $Command[0] $Command[1..($Command.Count - 1)]
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $($Command -join ' ')"
    }
}

function Set-Utf8NoBomContent {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($Path, $Value, $utf8NoBom)
}

function New-LiveNodeConfig {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("gc", "magc", "telegc", "bridge", "drone")]
        [string]$Role,
        [Parameter(Mandatory = $true)]
        [int]$NodeId,
        [bool]$SimulatedFc,
        [int]$SimulatedMspBatchMs,
        [int]$InterGcRxPin,
        [int]$InterGcTxPin,
        [int]$InterGcBaud,
        [bool]$BackhaulEnabled,
        [double]$BackhaulFrequencyMhz,
        [int]$BackhaulPeriodMs,
        [int]$BackhaulMaxDrones,
        [bool]$BridgeTransportEnabled,
        [int]$EspNowChannel,
        [int]$EspNowSnapshotPeriodMs,
        [int]$EspNowCommandRetryMs,
        [int]$EspNowStaleMs,
        [int]$LoraFallbackAfterMs
    )

    if ($Role -eq "gc" -or $Role -eq "magc" -or $Role -eq "telegc" -or $Role -eq "bridge") {
        $nodeRole = "ground_station"
        if ($Role -eq "magc") {
            $nodeRole = "magic_ground_control"
        } elseif ($Role -eq "telegc") {
            $nodeRole = "telemetry_ground_control"
        } elseif ($Role -eq "bridge") {
            $nodeRole = "bridge_receiver"
        }
        $loraFrequency = if ($Role -eq "bridge") { $BackhaulFrequencyMhz } else { 915.0 }
        $spreadingFactor = if ($Role -eq "bridge") { 7 } else { 9 }
        $bandwidth = if ($Role -eq "bridge") { 500000 } else { 125000 }
        $codingRate = if ($Role -eq "bridge") { 5 } else { 8 }
        return [ordered]@{
            node_id = 0
            node_role = $nodeRole
            lora = [ordered]@{
                frequency = $loraFrequency
                tx_power = 22
                spreading_factor = $spreadingFactor
                bandwidth = $bandwidth
                coding_rate = $codingRate
                preamble_length = 8
                sync_word = 18
            }
            mesh = [ordered]@{
                max_forwards = 0
                buffer_size = 50
                lbt_threshold_dbm = -120
                backoff_min_ms = 100
                backoff_max_ms = 1000
                test_message_timeout_sec = 10
            }
            live_position = [ordered]@{
                simulated_fc = $false
                simulated_msp_batch_ms = 8
                inter_gc = [ordered]@{
                    enabled = ($Role -eq "magc" -or $Role -eq "telegc")
                    baud = $InterGcBaud
                    rx_pin = $InterGcRxPin
                    tx_pin = $InterGcTxPin
                }
                backhaul = [ordered]@{
                    enabled = ($Role -eq "gc" -or $Role -eq "magc") -and $BackhaulEnabled
                    frequency_mhz = $BackhaulFrequencyMhz
                    period_ms = $BackhaulPeriodMs
                    max_drones = $BackhaulMaxDrones
                }
                bridge_transport = [ordered]@{
                    enabled = ($Role -eq "gc" -or $Role -eq "magc" -or $Role -eq "bridge") -and $BridgeTransportEnabled
                    primary = "espnow"
                    fallback = "lora"
                    espnow_channel = $EspNowChannel
                    espnow_snapshot_period_ms = $EspNowSnapshotPeriodMs
                    espnow_command_retry_ms = $EspNowCommandRetryMs
                    espnow_stale_ms = $EspNowStaleMs
                    lora_fallback_after_ms = $LoraFallbackAfterMs
                }
            }
        }
    }

    return [ordered]@{
        node_id = $NodeId
        node_role = "drone"
        lora = [ordered]@{
            frequency = 915.0
            tx_power = 22
            spreading_factor = 8
            bandwidth = 500000
            coding_rate = 5
            preamble_length = 8
            sync_word = 18
        }
        mesh = [ordered]@{
            max_forwards = 0
            buffer_size = 50
            lbt_threshold_dbm = -120
            backoff_min_ms = 100
            backoff_max_ms = 1000
            test_message_timeout_sec = 10
        }
        live_position = [ordered]@{
            simulated_fc = $SimulatedFc
            simulated_msp_batch_ms = $SimulatedMspBatchMs
            backhaul = [ordered]@{
                enabled = $false
                frequency_mhz = $BackhaulFrequencyMhz
                period_ms = $BackhaulPeriodMs
                max_drones = $BackhaulMaxDrones
            }
            bridge_transport = [ordered]@{
                enabled = $false
                primary = "espnow"
                fallback = "lora"
                espnow_channel = $EspNowChannel
                espnow_snapshot_period_ms = $EspNowSnapshotPeriodMs
                espnow_command_retry_ms = $EspNowCommandRetryMs
                espnow_stale_ms = $EspNowStaleMs
                lora_fallback_after_ms = $LoraFallbackAfterMs
            }
        }
    }
}

if (-not (Test-Path -LiteralPath $FirmwareRepo)) {
    throw "Firmware repo not found: $FirmwareRepo"
}

if ($Role -eq "gc" -or $Role -eq "magc" -or $Role -eq "telegc" -or $Role -eq "bridge") {
    $NodeId = 0
} elseif ($NodeId -le 0 -or $NodeId -gt 255) {
    throw "Drone provisioning requires -NodeId in the range 1..255."
}

if ($SimulatedMspBatchMs -lt 0 -or $SimulatedMspBatchMs -gt 50) {
    throw "-SimulatedMspBatchMs must be in the range 0..50."
}

$configPath = Join-Path $FirmwareRepo "data\config.json"
$hadOriginalConfig = Test-Path -LiteralPath $configPath
$originalConfig = $null
if ($hadOriginalConfig) {
    $originalConfig = Get-Content -LiteralPath $configPath -Raw
}

Push-Location $FirmwareRepo
try {
    $effectiveBackhaulEnabled = [bool]$BackhaulEnabled
    if (($Role -eq "gc" -or $Role -eq "magc") -and -not [bool]$BackhaulDisabled) {
        $effectiveBackhaulEnabled = $true
    }
    if ($Role -ne "gc" -and $Role -ne "magc") {
        $effectiveBackhaulEnabled = $false
    }
    $effectiveBridgeTransportEnabled = -not [bool]$BridgeTransportDisabled
    if ($Role -eq "drone") {
        $effectiveBridgeTransportEnabled = $false
    }
    $nodeConfig = New-LiveNodeConfig -Role $Role -NodeId $NodeId -SimulatedFc ([bool]$SimulatedFc) -SimulatedMspBatchMs $SimulatedMspBatchMs -InterGcRxPin $InterGcRxPin -InterGcTxPin $InterGcTxPin -InterGcBaud $InterGcBaud -BackhaulEnabled $effectiveBackhaulEnabled -BackhaulFrequencyMhz $BackhaulFrequencyMhz -BackhaulPeriodMs $BackhaulPeriodMs -BackhaulMaxDrones $BackhaulMaxDrones -BridgeTransportEnabled $effectiveBridgeTransportEnabled -EspNowChannel $EspNowChannel -EspNowSnapshotPeriodMs $EspNowSnapshotPeriodMs -EspNowCommandRetryMs $EspNowCommandRetryMs -EspNowStaleMs $EspNowStaleMs -LoraFallbackAfterMs $LoraFallbackAfterMs
    $json = $nodeConfig | ConvertTo-Json -Depth 6
    Set-Utf8NoBomContent -Path $configPath -Value $json

    Write-Host "Provisioning node."
    Write-Host "Repo: $FirmwareRepo"
    Write-Host "Environment: $Environment"
    Write-Host "Port: $Port"
    Write-Host "Role: $Role"
    Write-Host "Node ID: $NodeId"
    if ($Role -eq "drone") {
        Write-Host "Simulated FC: $([bool]$SimulatedFc)"
        Write-Host "Simulated MSP batch ms: $SimulatedMspBatchMs"
    } elseif ($Role -eq "magc" -or $Role -eq "telegc") {
        Write-Host "Inter-GC UART baud: $InterGcBaud"
        Write-Host "Inter-GC UART RX pin: $InterGcRxPin"
        Write-Host "Inter-GC UART TX pin: $InterGcTxPin"
    }
    if ($Role -eq "gc" -or $Role -eq "magc" -or $Role -eq "bridge") {
        Write-Host "Backhaul frequency MHz: $BackhaulFrequencyMhz"
        Write-Host "Backhaul period ms: $BackhaulPeriodMs"
        Write-Host "Backhaul max drones: $BackhaulMaxDrones"
        Write-Host "Backhaul TX enabled: $effectiveBackhaulEnabled"
        Write-Host "Bridge transport enabled: $effectiveBridgeTransportEnabled"
        Write-Host "Bridge transport primary: espnow"
        Write-Host "Bridge transport fallback: lora"
        Write-Host "ESP-NOW channel: $EspNowChannel"
        Write-Host "ESP-NOW snapshot period ms: $EspNowSnapshotPeriodMs"
    }
    Write-Host "LittleFS /config.json WILL be overwritten on the board."
    if (-not $ConfigOnly) {
        Write-Host "Firmware will also be flashed."
    }
    Write-Host ""

    Invoke-Checked -Command @("pio", "run", "-e", $Environment, "-t", "uploadfs", "--upload-port", $Port)

    if (-not $ConfigOnly) {
        Invoke-Checked -Command @("pio", "run", "-e", $Environment, "-t", "upload", "--upload-port", $Port)
    }
} finally {
    if ($hadOriginalConfig) {
        Set-Utf8NoBomContent -Path $configPath -Value $originalConfig
    } elseif (Test-Path -LiteralPath $configPath) {
        Remove-Item -LiteralPath $configPath
    }
    Pop-Location
    Write-Host ""
    Write-Host "Restored firmware repo data\config.json to its original local contents."
}
