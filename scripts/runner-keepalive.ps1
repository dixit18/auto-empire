# Empire keep-alive + wedge guard. Ensures BOTH the orchestrator and the watchdog run:
# - missing process -> start it
# - bus quiet >3 min -> kill stuck orchestrator, start fresh (watchdog does this continuously too)
$repo = Split-Path $PSScriptRoot -Parent
function ProcsLike($pat) {
  # PID-file first (deterministic), WMI only as fallback — WMI snapshots proved flaky here.
  $pids = @()
  $pidfile = Join-Path $repo "empire/runner/orchestrator.pid"
  if ((Test-Path $pidfile) -and ($pat -like "*orchestrator*")) {
    try {
      $pid = [int](Get-Content -LiteralPath $pidfile -TotalCount 1)
      if (Get-Process -Id $pid -ErrorAction SilentlyContinue) { $pids += $pid }
    } catch {}
  }
  if ($pids.Count -eq 0) {
    $pids += @(Get-CimInstance Win32_Process -Filter "Name='python.exe' OR Name='pythonw.exe'" -ErrorAction SilentlyContinue |
      Where-Object { $_.CommandLine -like $pat } | ForEach-Object { $_.ProcessId })
  }
  return @($pids | Where-Object { $_ })
}
function Start-Detached($argv, $log) {
  Start-Process -FilePath "pythonw" -ArgumentList $argv -WorkingDirectory $repo -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $repo $log) | Out-Null
}
$orch = ProcsLike "*orchestrator.py*"
$dog = ProcsLike "*watchdog.py*"
if ($orch.Count -eq 0) { Start-Detached @("empire/runner/orchestrator.py", "--auto") "empire/runner/run.log"; Write-Output "orchestrator started" }
if ($dog.Count -eq 0) { Start-Detached @("scripts/watchdog.py") "empire/runner/watchdog.log"; Write-Output "watchdog started" }
# live display: Next production server on :4100 (the app you watch; :3000 stays empty by owner order)
$webUp = $false
try {
  $c = New-Object Net.Sockets.TcpClient
  if ($c.BeginConnect("127.0.0.1", 4100, $null, $null).AsyncWaitHandle.WaitOne(1500)) { $webUp = $true }
  $c.Close()
} catch {}
if (-not $webUp) {
  Start-Process -FilePath "node" -ArgumentList "node_modules/next/dist/bin/next", "start", "-p", "4100" `
    -WorkingDirectory $repo -WindowStyle Hidden | Out-Null
  Write-Output "web display started on :4100"
} else {
  Write-Output "web display already up"
}
$bus = Join-Path $repo "empire/_bus/log.jsonl"
$ageSec = [double]::PositiveInfinity
if (Test-Path $bus) {
  try {
    $last = Get-Content -LiteralPath $bus -Tail 1 | ConvertFrom-Json
    if ($last -and $last.ts) {
      $ts = [datetime]::Parse($last.ts)
      if ($ts.Kind -eq [datetimekind]::Unspecified) { $ts = [datetime]::SpecifyKind($ts, [datetimekind]::Local) }
      $ageSec = ((Get-Date) - $ts).TotalSeconds
    }
  } catch { $ageSec = [double]::PositiveInfinity }
}
Write-Output ("bus age: {0:N0}s, orch procs: {1}" -f $ageSec, $orch.Count)
if ($ageSec -gt 180) {
  foreach ($p in $orch) { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Seconds 2
  Start-Detached @("empire/runner/orchestrator.py", "--auto") "empire/runner/run.log"
  Write-Output "stale bus -> orchestrator restarted"
} else {
  Write-Output "orchestrator alive and writing"
}
