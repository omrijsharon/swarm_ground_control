param(
    [string]$FirmwareRepo = "C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh",
    [string]$Environment = "seeed-xiao-s3"
)

$ErrorActionPreference = "Stop"

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Command,
        [Parameter(Mandatory = $true)]
        [string]$WorkingDirectory
    )

    & $Command[0] $Command[1..($Command.Count - 1)]
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $($Command -join ' ')"
    }
}

if (-not (Test-Path -LiteralPath $FirmwareRepo)) {
    throw "Firmware repo not found: $FirmwareRepo"
}

Push-Location $FirmwareRepo
try {
    Write-Host "Building generic firmware for environment '$Environment'..."
    Invoke-Checked -WorkingDirectory $FirmwareRepo -Command @("pio", "run", "-e", $Environment)

    $firmwarePath = Join-Path $FirmwareRepo ".pio\build\$Environment\firmware.bin"
    if (-not (Test-Path -LiteralPath $firmwarePath)) {
        throw "Build succeeded but firmware.bin was not found at: $firmwarePath"
    }

    Write-Host ""
    Write-Host "Firmware ready:"
    Write-Host $firmwarePath
    Write-Host ""
    Write-Host "Use this file for Web OTA. It does not contain node identity; LittleFS /config.json stays on the board."
} finally {
    Pop-Location
}
