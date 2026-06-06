param(
  [string]$Port = "COM18",
  [int]$Baud = 921600,
  [int]$DurationSeconds = 60,
  [string]$OutputDir = ".\logs",
  [switch]$NoSummary
)

$ErrorActionPreference = "Stop"

function Get-FieldValue {
  param(
    [object]$Object,
    [string]$Name
  )

  if ($null -eq $Object) { return $null }
  $property = $Object.PSObject.Properties[$Name]
  if ($null -eq $property) { return $null }
  return $property.Value
}

function Add-Count {
  param(
    [hashtable]$Table,
    [string]$Key,
    [int]$Amount = 1
  )

  if ([string]::IsNullOrWhiteSpace($Key)) { $Key = "unknown" }
  if (-not $Table.ContainsKey($Key)) { $Table[$Key] = 0 }
  $Table[$Key] += $Amount
}

function Add-NodeCount {
  param(
    [hashtable]$Table,
    [object]$NodeId,
    [int]$Amount = 1
  )

  $key = if ($null -eq $NodeId) { "unknown" } else { [string]$NodeId }
  Add-Count -Table $Table -Key $key -Amount $Amount
}

function Update-SequenceStats {
  param(
    [object]$State,
    [object]$NodeId,
    [object]$SequenceId
  )

  if ($null -eq $NodeId -or $null -eq $SequenceId) { return }
  $nodeKey = [string]$NodeId
  $seq = [int]$SequenceId

  if (-not $State.LastSequenceByNode.ContainsKey($nodeKey)) {
    $State.LastSequenceByNode[$nodeKey] = $seq
    return
  }

  $lastSeq = [int]$State.LastSequenceByNode[$nodeKey]
  $diff = ($seq - $lastSeq + 256) % 256
  if ($diff -eq 0) {
    Add-NodeCount -Table $State.DuplicateSequenceByNode -NodeId $nodeKey
  } elseif ($diff -gt 1) {
    Add-NodeCount -Table $State.SequenceGapByNode -NodeId $nodeKey -Amount ($diff - 1)
  }
  $State.LastSequenceByNode[$nodeKey] = $seq
}

function Convert-ToJsonLine {
  param([object]$Object)
  return ($Object | ConvertTo-Json -Depth 30 -Compress)
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$safePort = ($Port -replace "[^A-Za-z0-9_-]", "_")
$startedAt = Get-Date
$stamp = $startedAt.ToString("yyyyMMdd_HHmmss")
$logPath = Join-Path $OutputDir "gc_serial_${stamp}_${safePort}.jsonl"
$summaryPath = Join-Path $OutputDir "gc_serial_${stamp}_${safePort}.summary.txt"

$stats = [ordered]@{
  TypeCounts = @{}
  EventCounts = @{}
  TelemetryByNode = @{}
  MissedByNode = @{}
  StaleSkippedByNode = @{}
  AssignmentEventsByNode = @{}
  SequenceGapByNode = @{}
  DuplicateSequenceByNode = @{}
  LastSequenceByNode = @{}
  LastTelemetryByNode = @{}
  ParseErrors = 0
  RawLines = 0
  JsonLines = 0
  TotalLines = 0
}

$serial = [System.IO.Ports.SerialPort]::new($Port, $Baud)
$serial.Encoding = [System.Text.Encoding]::UTF8
$serial.NewLine = "`n"
$serial.ReadTimeout = 500
$serial.DtrEnable = $false
$serial.RtsEnable = $false

$writer = [System.IO.StreamWriter]::new($logPath, $false, [System.Text.Encoding]::UTF8)
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

try {
  try {
    $serial.Open()
  } catch {
    throw "Failed to open $Port at $Baud baud. Close SGC, Arduino IDE, PlatformIO monitor, or any other serial monitor that may own the port. Original error: $($_.Exception.Message)"
  }

  Write-Host "Logging GC serial $Port at $Baud baud for $DurationSeconds seconds."
  Write-Host "JSONL log: $logPath"

  while ($stopwatch.Elapsed.TotalSeconds -lt $DurationSeconds) {
    try {
      $line = $serial.ReadLine()
    } catch [System.TimeoutException] {
      continue
    }

    $raw = ([string]$line).TrimEnd("`r", "`n")
    if ([string]::IsNullOrWhiteSpace($raw)) { continue }

    $stats.TotalLines += 1
    $entry = [ordered]@{
      pcTimeIso = (Get-Date).ToUniversalTime().ToString("o")
      pcElapsedMs = [int][Math]::Round($stopwatch.Elapsed.TotalMilliseconds)
      port = $Port
      baud = $Baud
      lineNumber = $stats.TotalLines
      raw = $raw
      isJson = $false
    }

    if ($raw.TrimStart().StartsWith("{")) {
      try {
        $json = $raw | ConvertFrom-Json -ErrorAction Stop
        $stats.JsonLines += 1
        $entry["isJson"] = $true
        $entry["type"] = Get-FieldValue -Object $json -Name "type"
        $entry["event"] = Get-FieldValue -Object $json -Name "event"
        $entry["nodeId"] = Get-FieldValue -Object $json -Name "nodeId"
        $entry["command"] = Get-FieldValue -Object $json -Name "command"
        $entry["commandId"] = Get-FieldValue -Object $json -Name "commandId"
        $entry["gcMillis"] = Get-FieldValue -Object $json -Name "gcMillis"
        $entry["sequenceId"] = Get-FieldValue -Object $json -Name "sequenceId"
        $entry["frequencyMhz"] = Get-FieldValue -Object $json -Name "frequencyMhz"
        $entry["txPeriodMs"] = Get-FieldValue -Object $json -Name "txPeriodMs"
        $entry["rssi"] = Get-FieldValue -Object $json -Name "rssi"
        $entry["snr"] = Get-FieldValue -Object $json -Name "snr"
        $entry["reason"] = Get-FieldValue -Object $json -Name "reason"
        $entry["missCount"] = Get-FieldValue -Object $json -Name "missCount"
        $entry["nextTstGcMillis"] = Get-FieldValue -Object $json -Name "nextTstGcMillis"
        $entry["estimatedTstGcMillis"] = Get-FieldValue -Object $json -Name "estimatedTstGcMillis"
        $entry["listenStartGcMillis"] = Get-FieldValue -Object $json -Name "listenStartGcMillis"
        $entry["listenDeadlineGcMillis"] = Get-FieldValue -Object $json -Name "listenDeadlineGcMillis"
        $entry["json"] = $json

        $type = [string]$entry.type
        $event = [string]$entry.event
        $nodeId = $entry.nodeId
        Add-Count -Table $stats.TypeCounts -Key $type
        if ($event) { Add-Count -Table $stats.EventCounts -Key "$type/$event" }

        if ($type -eq "drone_telemetry") {
          Add-NodeCount -Table $stats.TelemetryByNode -NodeId $nodeId
          Update-SequenceStats -State $stats -NodeId $nodeId -SequenceId $entry.sequenceId
          if ($null -ne $nodeId) {
            $stats.LastTelemetryByNode[[string]$nodeId] = @{
              sequenceId = $entry.sequenceId
              frequencyMhz = $entry.frequencyMhz
              txPeriodMs = $entry.txPeriodMs
              rssi = $entry.rssi
              snr = $entry.snr
              gcMillis = $entry.gcMillis
              pcElapsedMs = $entry.pcElapsedMs
            }
          }
        } elseif ($type -eq "scanner_event") {
          if ($event -eq "telemetry_missed") {
            Add-NodeCount -Table $stats.MissedByNode -NodeId $nodeId
          } elseif ($event -eq "stale_slot_skipped") {
            Add-NodeCount -Table $stats.StaleSkippedByNode -NodeId $nodeId
          }
        } elseif ($type -eq "assignment_event") {
          Add-NodeCount -Table $stats.AssignmentEventsByNode -NodeId $nodeId
        }
      } catch {
        $stats.ParseErrors += 1
        $entry["parseError"] = $_.Exception.Message
      }
    } else {
      $stats.RawLines += 1
    }

    $writer.WriteLine((Convert-ToJsonLine $entry))
    $writer.Flush()
  }
} finally {
  $stopwatch.Stop()
  if ($writer) {
    $writer.Flush()
    $writer.Dispose()
  }
  if ($serial) {
    if ($serial.IsOpen) { $serial.Close() }
    $serial.Dispose()
  }
}

if (-not $NoSummary) {
  $duration = [Math]::Max(0.001, $stopwatch.Elapsed.TotalSeconds)
  $summaryLines = [System.Collections.Generic.List[string]]::new()
  $summaryLines.Add("GC serial capture summary")
  $summaryLines.Add("Started: $($startedAt.ToString("o"))")
  $summaryLines.Add("Port: $Port")
  $summaryLines.Add("Baud: $Baud")
  $summaryLines.Add(("Duration: {0:N1} s" -f $duration))
  $summaryLines.Add("Log: $logPath")
  $summaryLines.Add("")
  $summaryLines.Add("Line counts")
  $summaryLines.Add("  Total: $($stats.TotalLines)")
  $summaryLines.Add("  JSON:  $($stats.JsonLines)")
  $summaryLines.Add("  Raw:   $($stats.RawLines)")
  $summaryLines.Add("  Parse errors: $($stats.ParseErrors)")
  $summaryLines.Add("")
  $summaryLines.Add("Types")
  foreach ($key in ($stats.TypeCounts.Keys | Sort-Object)) {
    $summaryLines.Add("  ${key}: $($stats.TypeCounts[$key])")
  }
  $summaryLines.Add("")
  $summaryLines.Add("Events")
  foreach ($key in ($stats.EventCounts.Keys | Sort-Object)) {
    $summaryLines.Add("  ${key}: $($stats.EventCounts[$key])")
  }
  $summaryLines.Add("")
  $summaryLines.Add("Telemetry per node")
  foreach ($key in ($stats.TelemetryByNode.Keys | Sort-Object {[int]($_ -replace "\D", "0")})) {
    $rate = $stats.TelemetryByNode[$key] / $duration
    $gapCount = if ($stats.SequenceGapByNode.ContainsKey($key)) { $stats.SequenceGapByNode[$key] } else { 0 }
    $dupCount = if ($stats.DuplicateSequenceByNode.ContainsKey($key)) { $stats.DuplicateSequenceByNode[$key] } else { 0 }
    $missCount = if ($stats.MissedByNode.ContainsKey($key)) { $stats.MissedByNode[$key] } else { 0 }
    $latest = $stats.LastTelemetryByNode[$key]
    $summaryLines.Add(("  Node {0}: {1} packets, {2:N2} Hz, seq {3}, gaps {4}, duplicates {5}, telemetry_missed {6}, freq {7}, txPeriod {8}, RSSI {9}, SNR {10}" -f `
      $key,
      $stats.TelemetryByNode[$key],
      $rate,
      $latest.sequenceId,
      $gapCount,
      $dupCount,
      $missCount,
      $latest.frequencyMhz,
      $latest.txPeriodMs,
      $latest.rssi,
      $latest.snr))
  }
  $summaryLines.Add("")
  $summaryLines.Add("telemetry_missed by node")
  foreach ($key in ($stats.MissedByNode.Keys | Sort-Object)) {
    $summaryLines.Add("  Node ${key}: $($stats.MissedByNode[$key])")
  }
  $summaryLines.Add("")
  $summaryLines.Add("stale_slot_skipped by node")
  foreach ($key in ($stats.StaleSkippedByNode.Keys | Sort-Object)) {
    $summaryLines.Add("  Node ${key}: $($stats.StaleSkippedByNode[$key])")
  }

  Set-Content -Path $summaryPath -Value $summaryLines -Encoding UTF8
  Write-Host "Summary: $summaryPath"
  Write-Host ""
  $summaryLines | ForEach-Object { Write-Host $_ }
}
