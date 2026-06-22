param(
    [string]$Url,
    [string]$Hostname,
    [int]$Port = 8080,
    [string]$FirmwarePath,
    [string]$FirmwareRepo = "C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh",
    [string]$Environment = "seeed-xiao-s3",
    [switch]$WaitForReboot,
    [int]$UploadTimeoutSec = 120,
    [int]$PollTimeoutSec = 60,
    [int]$PollIntervalMs = 1000,
    [pscredential]$Credential
)

$ErrorActionPreference = "Stop"

function Resolve-FirmwarePath {
    param([string]$Path, [string]$Repo, [string]$Env)

    if ($Path) {
        $resolved = Resolve-Path -LiteralPath $Path -ErrorAction Stop
        return $resolved.Path
    }

    $defaultPath = Join-Path $Repo ".pio\build\$Env\firmware.bin"
    if (-not (Test-Path -LiteralPath $defaultPath)) {
        throw "Firmware file not found: $defaultPath. Run .\tools\build_ota_firmware.ps1 first or pass -FirmwarePath."
    }
    return (Resolve-Path -LiteralPath $defaultPath).Path
}

function Normalize-Hostname {
    param([Parameter(Mandatory = $true)][string]$Name)
    $clean = $Name.Trim().ToLowerInvariant()
    if ($clean.StartsWith("http://") -or $clean.StartsWith("https://")) {
        return $clean
    }
    if ($clean -match '^\d{1,3}(\.\d{1,3}){3}$') {
        return $clean
    }
    if ($clean.EndsWith(".local")) {
        return $clean
    }
    return "$clean.local"
}

function Resolve-BaseUrl {
    param([string]$InputUrl, [string]$InputHostname, [int]$InputPort)

    if ($InputUrl) {
        $clean = $InputUrl.Trim().TrimEnd("/")
        if (-not ($clean.StartsWith("http://") -or $clean.StartsWith("https://"))) {
            $clean = "http://$clean"
        }
        $builder = [System.UriBuilder]::new($clean)
        $builder.Path = ""
        $builder.Query = ""
        $builder.Fragment = ""
        return $builder.Uri.AbsoluteUri.TrimEnd("/")
    }

    if (-not $InputHostname) {
        throw "Pass either -Url or -Hostname."
    }

    $hostValue = Normalize-Hostname $InputHostname
    if ($hostValue.StartsWith("http://") -or $hostValue.StartsWith("https://")) {
        return (Resolve-BaseUrl -InputUrl $hostValue -InputHostname "" -InputPort $InputPort)
    }

    $builder = [System.UriBuilder]::new("http", $hostValue, $InputPort)
    return $builder.Uri.AbsoluteUri.TrimEnd("/")
}

function Add-BasicAuthHeader {
    param(
        [Parameter(Mandatory = $true)]$Client,
        [pscredential]$Cred
    )
    if (-not $Cred) {
        return
    }
    $networkCredential = $Cred.GetNetworkCredential()
    $raw = "$($networkCredential.UserName):$($networkCredential.Password)"
    $encoded = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($raw))
    $Client.DefaultRequestHeaders.Authorization =
        [System.Net.Http.Headers.AuthenticationHeaderValue]::new("Basic", $encoded)
}

function Invoke-OtaUpload {
    param(
        [Parameter(Mandatory = $true)][string]$BaseUrl,
        [Parameter(Mandatory = $true)][string]$Firmware,
        [pscredential]$Cred,
        [int]$TimeoutSec
    )

    Add-Type -AssemblyName System.Net.Http
    $client = [System.Net.Http.HttpClient]::new()
    $client.Timeout = [TimeSpan]::FromSeconds($TimeoutSec)
    Add-BasicAuthHeader -Client $client -Cred $Cred

    $fileStream = [System.IO.File]::OpenRead($Firmware)
    $form = [System.Net.Http.MultipartFormDataContent]::new()
    try {
        $fileContent = [System.Net.Http.StreamContent]::new($fileStream)
        $fileContent.Headers.ContentType =
            [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("application/octet-stream")
        $form.Add($fileContent, "firmware", [System.IO.Path]::GetFileName($Firmware))

        $updateUrl = "$BaseUrl/update"
        Write-Host "Uploading firmware to $updateUrl"
        $response = $client.PostAsync($updateUrl, $form).GetAwaiter().GetResult()
        $body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
        Write-Host "HTTP $([int]$response.StatusCode): $body"
        if (-not $response.IsSuccessStatusCode) {
            throw "OTA upload failed with HTTP $([int]$response.StatusCode): $body"
        }
        if ($body -notmatch "OTA OK") {
            throw "OTA endpoint did not report success: $body"
        }
    } finally {
        $form.Dispose()
        $fileStream.Dispose()
        $client.Dispose()
    }
}

function Get-OtaStatusOnce {
    param(
        [Parameter(Mandatory = $true)][string]$BaseUrl,
        [pscredential]$Cred,
        [int]$TimeoutSec = 2
    )

    $params = @{
        Uri = "$BaseUrl/ota_status"
        Method = "Get"
        TimeoutSec = $TimeoutSec
    }
    if ($Cred) {
        $params.Credential = $Cred
    }
    return Invoke-RestMethod @params
}

function Get-OtaStatusBaseUrls {
    param(
        [Parameter(Mandatory = $true)][string]$OriginalBaseUrl,
        $Status
    )

    $urls = New-Object System.Collections.Generic.List[string]
    $urls.Add($OriginalBaseUrl.TrimEnd("/"))
    if ($Status) {
        $portValue = $Status.port
        if (-not $portValue) {
            $portValue = $Port
        }
        foreach ($hostValue in @($Status.mdnsName, $Status.hostname, $Status.ip)) {
            if (-not $hostValue) {
                continue
            }
            $hostText = [string]$hostValue
            if ($hostText -and $hostText -notmatch '^\d{1,3}(\.\d{1,3}){3}$' -and -not $hostText.EndsWith(".local")) {
                $hostText = "$hostText.local"
            }
            $candidate = ([System.UriBuilder]::new("http", $hostText, [int]$portValue)).Uri.AbsoluteUri.TrimEnd("/")
            if (-not $urls.Contains($candidate)) {
                $urls.Add($candidate)
            }
        }
    }
    return $urls.ToArray()
}

function Wait-OtaStatus {
    param(
        [Parameter(Mandatory = $true)][string[]]$BaseUrls,
        [pscredential]$Cred,
        [int]$TimeoutSec,
        [int]$IntervalMs
    )

    $deadline = [DateTime]::UtcNow.AddSeconds($TimeoutSec)
    Write-Host "Waiting for OTA status at:"
    foreach ($base in $BaseUrls) {
        Write-Host "  $base/ota_status"
    }
    Start-Sleep -Seconds 3

    while ([DateTime]::UtcNow -lt $deadline) {
        foreach ($base in $BaseUrls) {
            try {
                $status = Get-OtaStatusOnce -BaseUrl $base -Cred $Cred -TimeoutSec 2
                if ($status.type -eq "ota_status" -and -not $status.uploading) {
                    Write-Host ""
                    Write-Host "Device is back online:"
                    $status | Format-List | Out-String | Write-Host
                    return
                }
            } catch {
                continue
            }
        }
        Write-Host "." -NoNewline
        Start-Sleep -Milliseconds $IntervalMs
    }
    throw "Timed out waiting for OTA status at: $($BaseUrls -join ', ')"
}

$firmware = Resolve-FirmwarePath -Path $FirmwarePath -Repo $FirmwareRepo -Env $Environment
$baseUrl = Resolve-BaseUrl -InputUrl $Url -InputHostname $Hostname -InputPort $Port

Write-Host "Firmware: $firmware"
Write-Host "Target:   $baseUrl"

$preUploadStatus = $null
try {
    $preUploadStatus = Get-OtaStatusOnce -BaseUrl $baseUrl -Cred $Credential -TimeoutSec 3
    if ($preUploadStatus.type -eq "ota_status") {
        Write-Host "Pre-upload status: $($preUploadStatus.hostname) $($preUploadStatus.ip) $($preUploadStatus.mac)"
    }
} catch {
    Write-Host "Pre-upload /ota_status probe failed; upload will still be attempted."
}

Invoke-OtaUpload -BaseUrl $baseUrl -Firmware $firmware -Cred $Credential -TimeoutSec $UploadTimeoutSec

if ($WaitForReboot) {
    $waitUrls = Get-OtaStatusBaseUrls -OriginalBaseUrl $baseUrl -Status $preUploadStatus
    Wait-OtaStatus -BaseUrls $waitUrls -Cred $Credential -TimeoutSec $PollTimeoutSec -IntervalMs $PollIntervalMs
}
