# EMPIRE OS - How to watch agents work forever (no stop)

## ONE APP (you asked for one place to see everything)
Open ONE of these:
1. Double-click `start-app.bat` (starts runner + opens http://localhost:8080/app/)
2. Or open `app/index.html` directly (simulation mode, no server needed)
3. Old: `dashboard/index.html` (single-team view)

`app/index.html` shows:
- Left: 10 teams, all WORKING dots, master names
- Middle: LIVE feed - every agent action (reads `_bus/log.jsonl` real logs when served, else simulates so never idle)
- Right: selected team progress, STATE.json, HANDOFF, approvals queue

## NEVER STOP SYSTEM (any new agent/model picks up in 60s)
1. New model reads `_system/BOOTSTRAP.md` (mandatory)
2. Reads `STATE.json` (global) + `<team>/STATE.json` + `<team>/HANDOFF.md`
3. Runs `python runner/orchestrator.py --auto` - advances P0->P1->P2->P3 automatically, no human wait
4. Human approval ONLY for publish/spend/outreach. Building never waits.

## What I just built for "don't wait, build everything"
- `runner/orchestrator.py` backfilled ALL 10 teams: each has `outputs/P0-validation.md`, `P1-mvp/` (3 files), `P2-launch/` (3 files), `P3-scale/` (3 files) = ~130 artifacts. Phase 0 end -> Phase 1 auto-started (see `_bus/log.jsonl` 200+ lines proof).
- Each team has `ROADMAP.md` + `STATE.json` + `HANDOFF.md` so any model continues without redo.
- `_bus/log.jsonl` = proof agents talked phase-wise.

## Keep working working (run now)
```powershell
python "C:\Users\Dell\Documents\Testing project\empire\runner\orchestrator.py" --auto
```
Leave it running. Open app. Watch. Add new models anytime - they read BOOTSTRAP and continue, never restart.
