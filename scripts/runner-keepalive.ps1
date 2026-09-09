# Empire runner keep-alive + wedge guard. Starts orchestrator --auto ONLY if missing;
# restarts it if the bus goes quiet >3 min (a live loop writes every ~30s).
$repo = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$procs = Get-CimInstance Win32_Process -Filter "Name='python.exe' OR Name='pythonw.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like "*orchestrator.py*" }
function Start-Runner {
  Start-Process -FilePath "pythonw" -ArgumentList "empire/runner/orchestrator.py", "--auto" `
    -WorkingDirectory $repo -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $repo "empire/runner/run.log") `
    -RedirectStandardError (Join-Path $repo "empire/runner/run.err.log")
  Write-Output "runner started"
}
if (-not $procs) { Start-Runner; exit 0 }
$bus = Join-Path $repo "empire/_bus/log.jsonl"
$stale = $true
if (Test-Path $bus) {
  try {
    $last = Get-Content -LiteralPath $bus -Tail 1 | ConvertFrom-Json
    $ts = [datetime]::Parse($last.ts).ToUniversalTime()
    $stale = ((Get-Date).ToUniversalTime() - $ts).TotalSeconds -gt 180
  } catch { $stale = $true }
}
if ($stale) {
  $procs | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Seconds 2
  Start-Runner
  Write-Output "wedged runner restarted"
} else {
  Write-Output "runner alive and writing"
}
