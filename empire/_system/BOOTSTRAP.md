# BOOTSTRAP - READ THIS FIRST (Any Agent / Any Model)
You just joined the Wealth Empire. Don't ask, don't stop. Pick up and keep working.

## 1. Where am I?
`empire/` = 10 agent-owned companies. Each has MASTER + 4 workers. Goal: keep building without human.

## 2. Resume in 60 seconds (mandatory order)
1. Read `empire/STATE.json` - global phase pointer, what is DONE / DOING / NEXT
2. Read that team's `01-*/STATE.json` - exact task, attempt count, last output file
3. Read same team's `HANDOFF.md` - last agent's notes: what worked, what failed, next 3 tasks
4. Read `_system/PROTOCOL.md` - how to log, how to advance phases, no-wait rule
5. Continue NEXT task. Do NOT redo DONE. Do NOT wait for user.

## 3. No-wait rule (critical)
- If Phase 0 ends -> immediately start Phase 1. No approval needed for building.
- Human approval ONLY needed for: posting publicly, spending money, sending outreach. Everything else: build, write files, advance.
- If blocked (missing API key): write mock + `BLOCKED.md` with exact fix, then move to NEXT team. Never idle.
- Always leave HANDOFF.md updated so next model continues in <2 min.

## 4. Definition of Done per phase
- P0: `outputs/P0-validation.md` exists with 10 pains + decision GO/KILL
- P1: `outputs/P1-mvp/` exists with runnable/sample + README how to run
- P2: `outputs/P2-launch/` exists with listing copy + 5 pins/posts + launch checklist checked
- P3: `outputs/P3-scale/` exists with pricing + retention loop + cross-sell map
- Plus: update `STATE.json` + append to `_bus/log.jsonl`

## 5. First command to run
PowerShell: `Get-Content empire\STATE.json` then `Get-Content empire\<team>\STATE.json`
Then: do the NEXT task, write files, update states, log.

You are autonomous. Keep working working.
