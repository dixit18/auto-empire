# sync empire -> repo (one repo runs everything)
# Copies the live agent system on this machine into auto-empire/empire/ so GitHub always has the latest states.
$src = "C:\Users\Dell\Documents\Testing project\empire"
$dst = Join-Path $PSScriptRoot "..\empire"
if (-not (Test-Path $src)) { Write-Output "no live empire at $src - repo copy is source of truth"; exit 0 }
Copy-Item "$src\*" $dst -Recurse -Force -Exclude @("node_modules", ".next")
"synced:"; (Get-ChildItem $dst -Recurse -File | Measure-Object).Count
