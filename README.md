# Auto Empire OS 🐒 → 👑 One repo runs everything

**Repo:** `dixit18/auto-empire` · **Deploy:** Vercel → import → Deploy (no env vars)

## Layout (monorepo, single source of truth)
```
auto-empire/
├── app/ components/ lib/      # Next.js 14 command deck (the UI you click)
├── empire/                    # THE agent system - everything lives here
│   ├── _system/BOOTSTRAP.md   # any new model reads this first (60s pickup)
│   ├── _system/PROTOCOL.md    # no-wait rules, bus format, file conventions
│   ├── STATE.json             # global pointer: phase per team
│   ├── _bus/log.jsonl         # append-only live log every agent writes
│   ├── runner/orchestrator.py # auto-worker: P0→P3 + monitoring loop
│   ├── 01-voice-clone-ghostwriter/ … 10-micro-course-factory/
│   │   ├── README.md          # business plan + master/worker prompts
│   │   ├── ROADMAP.md · STATE.json · HANDOFF.md
│   │   └── outputs/P0..P3/    # proof of work per phase
│   ├── dashboard/             # legacy single-team view (kept for history)
│   └── app/                   # legacy simulation view (kept for history)
├── REPORT.md                  # full work report (how everything was done)
└── scripts/sync-empire.ps1    # copy live disk state into ./empire before commit
```

## Run locally
```bash
npm install; npm run dev        # UI at http://localhost:3000
python empire/runner/orchestrator.py --auto   # agents keep working
```

## Push (token via one-shot remote only — never stored)
```powershell
$t = '<PASTE ONCE, NEVER COMMIT>'
git remote add tmp-push ('https://x-access-token:' + $t + '@github.com/dixit18/auto-empire.git')
git push tmp-push main; git remote remove tmp-push
```

## Rules
- New model? Read `empire/_system/BOOTSTRAP.md` first. Never redo DONE phases.
- Phase ends → next starts immediately. Human gates only: publish, spend, outreach.
- Every write updates STATE + HANDOFF + bus, or it didn't happen.
