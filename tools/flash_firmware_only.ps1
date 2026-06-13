param(
    [Parameter(Mandatory = $true)]
    [string]$Port,
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

if (-not (Test-Path -LiteralPath $FirmwareRepo)) {
    throw "Firmware repo not found: $FirmwareRepo"
}

Push-Location $FirmwareRepo
try {
    Write-Host "Flashing firmware only."
    Write-Host "Repo: $FirmwareRepo"
    Write-Host "Environment: $Environment"
    Write-Host "Port: $Port"
    Write-Host "LittleFS will NOT be uploaded; existing node_id/node_role stay on the board."
    Write-Host ""

    Invoke-Checked -Command @("pio", "run", "-e", $Environment, "-t", "upload", "--upload-port", $Port)
} finally {
    Pop-Location
}
