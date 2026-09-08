# Empire runner resilience WITHOUT admin: Startup-folder shortcut -> keepalive script.
# Runs at every logon; keepalive no-ops if the runner is already alive.
$repo = "C:\Users\Dell\Documents\Testing project\auto-empire"
$keep = Join-Path $repo "scripts\runner-keepalive.ps1"
$startup = [Environment]::GetFolderPath("Startup")
$lnk = Join-Path $startup "EmpireRunner.lnk"
$shell = New-Object -ComObject WScript.Shell
$sc = $shell.CreateShortcut($lnk)
$sc.TargetPath = "powershell.exe"
$sc.Arguments = "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$keep`""
$sc.WorkingDirectory = $repo
$sc.Save()
Write-Output "startup shortcut installed: $lnk"
