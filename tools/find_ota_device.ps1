param(
    [string]$Hostname = "simple-mesh-bridge",
    [int]$Port = 8080,
    [string]$MacAddress,
    [switch]$ScanSubnet,
    [switch]$UpdateHosts,
    [string]$HostsPath = "$env:SystemRoot\System32\drivers\etc\hosts",
    [int]$TcpTimeoutMs = 180
)

$ErrorActionPreference = "Stop"

function Normalize-HostName {
    param([Parameter(Mandatory = $true)][string]$Name)
    $clean = $Name.Trim().ToLowerInvariant()
    if ($clean.EndsWith(".local")) {
        $clean = $clean.Substring(0, $clean.Length - 6)
    }
    return $clean
}

function Normalize-Mac {
    param([string]$Mac)
    if (-not $Mac) {
        return ""
    }
    return (($Mac -replace '[^0-9a-fA-F]', '').ToLowerInvariant())
}

function Get-ArpCandidates {
    $rows = arp -a 2>$null
    foreach ($row in $rows) {
        if ($row -match '^\s*(\d{1,3}(?:\.\d{1,3}){3})\s+([0-9a-fA-F:-]{11,17})\s+') {
            [pscustomobject]@{
                Ip = $Matches[1]
                Mac = Normalize-Mac $Matches[2]
                Source = "arp"
            }
        }
    }
}

function Get-SubnetCandidates {
    $addresses = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Where-Object {
            $_.IPAddress -notlike "127.*" -and
            $_.IPAddress -notlike "169.254.*" -and
            $_.PrefixLength -ge 16 -and
            $_.PrefixLength -le 30
        }

    foreach ($addr in $addresses) {
        $parts = $addr.IPAddress.Split('.')
        if ($parts.Count -ne 4) {
            continue
        }
        $prefix = "$($parts[0]).$($parts[1]).$($parts[2])"
        for ($i = 1; $i -le 254; $i++) {
            $ip = "$prefix.$i"
            if ($ip -ne $addr.IPAddress) {
                [pscustomobject]@{
                    Ip = $ip
                    Mac = ""
                    Source = "subnet"
                }
            }
        }
    }
}

function Test-TcpPortFast {
    param(
        [Parameter(Mandatory = $true)][string]$Ip,
        [Parameter(Mandatory = $true)][int]$Port,
        [Parameter(Mandatory = $true)][int]$TimeoutMs
    )
    $client = New-Object Net.Sockets.TcpClient
    try {
        $async = $client.BeginConnect($Ip, $Port, $null, $null)
        if (-not $async.AsyncWaitHandle.WaitOne($TimeoutMs, $false)) {
            return $false
        }
        $client.EndConnect($async)
        return $client.Connected
    } catch {
        return $false
    } finally {
        $client.Close()
    }
}

function Probe-OtaStatus {
    param(
        [Parameter(Mandatory = $true)][string]$Ip,
        [Parameter(Mandatory = $true)][int]$Port
    )
    $url = "http://$Ip`:$Port/ota_status"
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 1
        if ($response.type -eq "ota_status") {
            return $response
        }
    } catch {
        return $null
    }
    return $null
}

function Test-OtaRootExists {
    param(
        [Parameter(Mandatory = $true)][string]$Ip,
        [Parameter(Mandatory = $true)][int]$Port
    )
    try {
        Invoke-WebRequest -Uri "http://$Ip`:$Port/" -TimeoutSec 1 -UseBasicParsing | Out-Null
        return $true
    } catch {
        if ($_.Exception.Response -and [int]$_.Exception.Response.StatusCode -eq 401) {
            return $true
        }
        return $false
    }
}

function Test-IsAdmin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Update-HostsEntry {
    param(
        [Parameter(Mandatory = $true)][string]$Ip,
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Path
    )
    if (-not (Test-IsAdmin)) {
        throw "Updating $Path requires an Administrator PowerShell. Add this line manually or rerun as Administrator: $Ip`t$Name"
    }

    $begin = "# simple-mesh OTA hosts begin"
    $end = "# simple-mesh OTA hosts end"
    $entry = "$Ip`t$Name"
    $content = @()
    if (Test-Path -LiteralPath $Path) {
        $content = @(Get-Content -LiteralPath $Path)
    }

    $start = [Array]::IndexOf($content, $begin)
    $stop = [Array]::IndexOf($content, $end)
    $newBlock = @($begin, $entry, $end)

    if ($start -ge 0 -and $stop -gt $start) {
        $before = if ($start -gt 0) { $content[0..($start - 1)] } else { @() }
        $after = if ($stop -lt ($content.Count - 1)) { $content[($stop + 1)..($content.Count - 1)] } else { @() }
        $content = @($before + $newBlock + $after)
    } else {
        if ($content.Count -gt 0 -and $content[-1].Trim() -ne "") {
            $content += ""
        }
        $content += $newBlock
    }

    Set-Content -LiteralPath $Path -Value $content -Encoding ASCII
}

function ConvertTo-QuotedArgument {
    param([Parameter(Mandatory = $true)][string]$Value)
    return '"' + ($Value -replace '"', '\"') + '"'
}

function Restart-AsAdministrator {
    $scriptPath = $PSCommandPath
    if (-not $scriptPath) {
        throw "Cannot determine script path for Administrator relaunch"
    }

    $args = @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", (ConvertTo-QuotedArgument $scriptPath),
        "-Hostname", (ConvertTo-QuotedArgument $Hostname),
        "-Port", $Port.ToString(),
        "-TcpTimeoutMs", $TcpTimeoutMs.ToString(),
        "-UpdateHosts"
    )
    if ($MacAddress) {
        $args += @("-MacAddress", (ConvertTo-QuotedArgument $MacAddress))
    }
    if ($ScanSubnet) {
        $args += "-ScanSubnet"
    }
    if ($HostsPath) {
        $args += @("-HostsPath", (ConvertTo-QuotedArgument $HostsPath))
    }

    Write-Host ""
    Write-Host "Updating hosts requires Administrator rights. Opening an elevated PowerShell now..."
    Write-Host "Approve the Windows UAC prompt, then this script will update the hosts entry."
    Start-Process -FilePath "powershell.exe" -ArgumentList ($args -join " ") -Verb RunAs
}

$targetHostname = Normalize-HostName $Hostname
$targetMdns = "$targetHostname.local"
$targetMac = Normalize-Mac $MacAddress

Write-Host "Looking for OTA device '$targetMdns' on port $Port..."

$candidateMap = @{}
foreach ($candidate in Get-ArpCandidates) {
    $candidateMap[$candidate.Ip] = $candidate
}

$matches = @()
foreach ($candidate in $candidateMap.Values) {
    if ($targetMac -and $candidate.Mac -ne $targetMac) {
        continue
    }
    $status = Probe-OtaStatus -Ip $candidate.Ip -Port $Port
    if ($status -and ($status.hostname -eq $targetHostname -or $status.mdnsName -eq $targetMdns -or -not $targetHostname)) {
        $matches += [pscustomobject]@{
            Ip = $candidate.Ip
            Hostname = $status.hostname
            MdnsName = $status.mdnsName
            Transport = $status.transport
            Mac = $status.mac
            Source = "ota_status"
        }
    } elseif ($targetMac -and (Test-TcpPortFast -Ip $candidate.Ip -Port $Port -TimeoutMs $TcpTimeoutMs) -and (Test-OtaRootExists -Ip $candidate.Ip -Port $Port)) {
        $matches += [pscustomobject]@{
            Ip = $candidate.Ip
            Hostname = $targetHostname
            MdnsName = $targetMdns
            Transport = "unknown"
            Mac = $MacAddress
            Source = "arp_mac_ota_port"
        }
    }
}

if ($matches.Count -eq 0 -and $ScanSubnet) {
    Write-Host "No ARP match found; scanning local /24 subnet candidates..."
    foreach ($candidate in Get-SubnetCandidates) {
        if ($candidateMap.ContainsKey($candidate.Ip)) {
            continue
        }
        if (-not (Test-TcpPortFast -Ip $candidate.Ip -Port $Port -TimeoutMs $TcpTimeoutMs)) {
            continue
        }
        $status = Probe-OtaStatus -Ip $candidate.Ip -Port $Port
        if ($status -and ($status.hostname -eq $targetHostname -or $status.mdnsName -eq $targetMdns)) {
            $matches += [pscustomobject]@{
                Ip = $candidate.Ip
                Hostname = $status.hostname
                MdnsName = $status.mdnsName
                Transport = $status.transport
                Mac = $status.mac
                Source = "subnet_ota_status"
            }
        }
    }
}

if ($matches.Count -eq 0) {
    throw "No OTA device found for $targetMdns. Try -ScanSubnet, verify the board is on Wi-Fi, or pass -MacAddress for older firmware."
}

$selected = $matches | Select-Object -First 1
Write-Host ""
Write-Host "Found OTA device:"
$selected | Format-List | Out-String | Write-Host
Write-Host "Open by IP:    http://$($selected.Ip):$Port"
Write-Host "Desired name: http://$targetMdns`:$Port"

if ($UpdateHosts) {
    if (-not (Test-IsAdmin)) {
        Restart-AsAdministrator
        exit 0
    }
    Update-HostsEntry -Ip $selected.Ip -Name $targetMdns -Path $HostsPath
    Write-Host ""
    Write-Host "Updated hosts file: $HostsPath"
    Write-Host "The browser should now resolve: http://$targetMdns`:$Port"
}
