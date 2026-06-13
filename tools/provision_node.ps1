param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("gc", "magc", "telegc", "drone")]
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

function New-LiveNodeConfig {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("gc", "magc", "telegc", "drone")]
        [string]$Role,
        [Parameter(Mandatory = $true)]
        [int]$NodeId,
        [bool]$SimulatedFc,
        [int]$SimulatedMspBatchMs,
        [int]$InterGcRxPin,
        [int]$InterGcTxPin,
        [int]$InterGcBaud
    )

    if ($Role -eq "gc" -or $Role -eq "magc" -or $Role -eq "telegc") {
        $nodeRole = "ground_station"
        if ($Role -eq "magc") {
            $nodeRole = "magic_ground_control"
        } elseif ($Role -eq "telegc") {
            $nodeRole = "telemetry_ground_control"
        }
        return [ordered]@{
            node_id = 0
            node_role = $nodeRole
            lora = [ordered]@{
                frequency = 915.0
                tx_power = 22
                spreading_factor = 9
                bandwidth = 125000
                coding_rate = 8
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
                    enabled = ($Role -ne "gc")
                    baud = $InterGcBaud
                    rx_pin = $InterGcRxPin
                    tx_pin = $InterGcTxPin
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
        }
    }
}

if (-not (Test-Path -LiteralPath $FirmwareRepo)) {
    throw "Firmware repo not found: $FirmwareRepo"
}

if ($Role -eq "gc" -or $Role -eq "magc" -or $Role -eq "telegc") {
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
    $nodeConfig = New-LiveNodeConfig -Role $Role -NodeId $NodeId -SimulatedFc ([bool]$SimulatedFc) -SimulatedMspBatchMs $SimulatedMspBatchMs -InterGcRxPin $InterGcRxPin -InterGcTxPin $InterGcTxPin -InterGcBaud $InterGcBaud
    $json = $nodeConfig | ConvertTo-Json -Depth 6
    Set-Content -LiteralPath $configPath -Value $json -Encoding UTF8

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
        Set-Content -LiteralPath $configPath -Value $originalConfig -Encoding UTF8
    } elseif (Test-Path -LiteralPath $configPath) {
        Remove-Item -LiteralPath $configPath
    }
    Pop-Location
    Write-Host ""
    Write-Host "Restored firmware repo data\config.json to its original local contents."
}
