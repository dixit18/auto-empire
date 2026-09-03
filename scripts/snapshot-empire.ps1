# copy pickup files into repo snapshot so GitHub/Vercel has them (no secrets)
$src="C:\Users\Dell\Documents\Testing project\empire"
$dst="C:\Users\Dell\Documents\Testing project\auto-empire\empire-data"
New-Item -ItemType Directory -Path $dst -Force | Out-Null
Copy-Item "$src\_system" "$dst\_system" -Recurse -Force
Copy-Item "$src\STATE.json" "$dst\STATE.json" -Force
Copy-Item "$src\R&D-REPORT.md" "$dst\R&D-REPORT.md" -Force -ErrorAction SilentlyContinue
foreach($d in Get-ChildItem $src -Directory | Where-Object{$_.Name -match '^\d\d-'}){
  $t="$dst\$($d.Name)"; New-Item -ItemType Directory -Path $t -Force | Out-Null
  foreach($f in @("README.md","STATE.json","HANDOFF.md","ROADMAP.md")){ $s=Join-Path $d.FullName $f; if(Test-Path $s){ Copy-Item $s $t -Force } }
}
"snapshot done"; Get-ChildItem $dst -Recurse -File | Measure-Object | Select-Object Count
