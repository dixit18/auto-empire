# Empire runner keep-alive. Starts orchestrator --auto ONLY if not already running.
$repo = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$running = Get-CimInstance Win32_Process -Filter "Name='python.exe' OR Name='pythonw.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like "*orchestrator.py*" }
if ($running) { Write-Output "runner already alive"; exit 0 }
Start-Process -FilePath "pythonw" -ArgumentList "empire/runner/orchestrator.py", "--auto" `
  -WorkingDirectory $repo -WindowStyle Hidden `
  -RedirectStandardOutput (Join-Path $repo "empire/runner/run.log") `
  -RedirectStandardError (Join-Path $repo "empire/runner/run.err.log")
Write-Output "runner started"
