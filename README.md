# Auto Empire OS 🐒
Click-to-run command for 10 agent-owned companies. Next.js + tweakcn tokens + shadcn-style + GSAP monkey + framer-motion + light/night + forest/beach/sunset/lagoon worlds.

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
# click ▶ Run next task / ⚡ Run ALL - writes directly to ../empire STATE + HANDOFF + _bus/log.jsonl
# keep agents looping:
python ../empire/runner/orchestrator.py --auto
```

## Deploy (Vercel, easiest)
1. Push this folder as `auto-empire` repo to GitHub (see below, token via env only, never in code)
2. Vercel → New Project → import `auto-empire` → defaults work (no env needed for demo)
3. Live `/api/logs` reads `empire/` when present locally; on Vercel it shows UI heartbeat + snapshot until you connect GitHub storage.

## GitHub push (safe)
```bash
cd auto-empire
git init
git config user.name "dixit"
git add .
git commit -m "Empire OS v1 - click-to-run 10 teams"
# create empty repo `auto-empire` on github.com/dixit (web), then:
git remote add origin https://github.com/dixit/auto-empire.git
# use token from env, never paste in code/chat again - revoke the exposed one!
$env:GITHUB_TOKEN="PASTE_ONCE_IN_TERMINAL_ONLY"
git -c http.extraHeader="AUTHORIZATION: bearer $env:GITHUB_TOKEN" push -u origin main
```
Then copy `../empire/_system`, `STATE.json`, teams `STATE/HANDOFF/ROADMAP` into `empire-data/` (script below) so others pick up without your local disk.

## Any-model pickup
Read `../empire/_system/BOOTSTRAP.md` → `STATE.json` → team `HANDOFF.md` → continue. UI and runner share `_bus/log.jsonl`.
