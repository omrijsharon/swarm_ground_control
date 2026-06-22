param(
    [Parameter(Mandatory = $true)]
    [string]$Port,
    [string]$FirmwareRepo = "C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh",
    [string]$CredentialsPath,
    [int]$BaudRate = 921600,
    [int]$TimeoutMs = 8000
)

$ErrorActionPreference = "Stop"

if (-not $CredentialsPath) {
    $CredentialsPath = Join-Path $FirmwareRepo "data\wifi_ota.json"
}

if (-not (Test-Path -LiteralPath $CredentialsPath)) {
    throw "Wi-Fi OTA credentials file not found: $CredentialsPath"
}

$raw = Get-Content -LiteralPath $CredentialsPath -Raw
$parsed = $raw | ConvertFrom-Json
$wifiOta = $parsed.wifi_ota
if (-not $wifiOta) {
    $wifiOta = $parsed
}
if (-not $wifiOta.ssid) {
    throw "Missing wifi_ota.ssid in $CredentialsPath"
}

$commandId = "wifi-ota-" + ([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())
$command = [ordered]@{
    type = "command"
    command = "set_wifi_ota"
    commandId = $commandId
    wifi_ota = $wifiOta
}
$line = ($command | ConvertTo-Json -Depth 8 -Compress)

$portObj = New-Object System.IO.Ports.SerialPort $Port, $BaudRate, ([System.IO.Ports.Parity]::None), 8, ([System.IO.Ports.StopBits]::One)
$portObj.NewLine = "`n"
$portObj.ReadTimeout = 500
$portObj.WriteTimeout = 2000

Write-Host "Writing Wi-Fi OTA credentials to $Port at $BaudRate baud."
Write-Host "Credentials file: $CredentialsPath"
Write-Host "SSID: $($wifiOta.ssid)"
Write-Host "This sends only /wifi_ota.json credentials. It does not upload LittleFS or change /config.json."

try {
    $portObj.Open()
    Start-Sleep -Milliseconds 300
    $portObj.DiscardInBuffer()
    $portObj.WriteLine($line)

    $deadline = [DateTime]::UtcNow.AddMilliseconds($TimeoutMs)
    $sawAck = $false
    while ([DateTime]::UtcNow -lt $deadline) {
        try {
            $responseLine = $portObj.ReadLine()
        } catch [TimeoutException] {
            continue
        }
        if (-not $responseLine) {
            continue
        }
        Write-Host $responseLine
        try {
            $response = $responseLine | ConvertFrom-Json
        } catch {
            continue
        }
        if ($response.type -eq "command_ack" -and $response.commandId -eq $commandId) {
            $sawAck = $true
            if ($response.accepted -eq $true) {
                Write-Host "Wi-Fi OTA credentials saved. Reboot the board to use home Wi-Fi OTA."
                exit 0
            }
            throw "Device rejected credentials: $($response.reason) $($response.message)"
        }
    }
    if (-not $sawAck) {
        throw "Timed out waiting for set_wifi_ota ACK from $Port"
    }
} finally {
    if ($portObj.IsOpen) {
        $portObj.Close()
    }
    $portObj.Dispose()
}
