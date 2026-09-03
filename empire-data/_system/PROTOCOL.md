# PROTOCOL - How Agents Never Stop

## State files (single source of truth)
- `empire/STATE.json`: { activeTeam, teams: { "01": {phase, status, updated} }, lastRunner }
- `<team>/STATE.json`: { team, phase: "P0"|"P1"|"P2"|"P3", taskIndex, status: "DOING"|"DONE"|"BLOCKED", lastFile, nextTask, attempts, updated }
- `<team>/HANDOFF.md`: human-readable: Last done, Now doing, Next 3, Blockers, Files changed

## Bus (live UI reads this)
- `_bus/log.jsonl`: one JSON per line: {"ts","team","from","to","phase","msg","status"}
  - status: started|progress|done|needs-approval|blocked
  - Append only, never overwrite. UI polls this file.
- `_bus/approvals.jsonl`: tasks needing human (publish, spend, outreach). Runner continues other work while waiting.

## Auto-advance logic (runner/orchestrator.py does this)
1. Pick team with oldest `updated` where status != DONE_ALL
2. Run nextTask from ROADMAP.md
3. On success: write output file -> update STATE.json phase/taskIndex -> append HANDOFF -> log done -> immediately pick NEXT task (no wait)
4. On fail 3x: mark BLOCKED, write BLOCKED.md, switch team. Never idle.
5. Loop forever with 3s heartbeat. That's "keep working working".

## File conventions (so any model finds things)
- `<team>/README.md` = business + prompts (never delete)
- `<team>/ROADMAP.md` = full task list P0-P3 with checkboxes
- `<team>/STATE.json` = machine pointer
- `<team>/HANDOFF.md` = human/model notes
- `<team>/outputs/P0-validation.md`, `P1-mvp/`, `P2-launch/`, `P3-scale/` = proof of work

## Model-agnostic rules
- No fancy tools required: only Read/Write/Bash + file logs.
- Max file 500 lines. Prefer many small files.
- Every write must update STATE + HANDOFF + log, or it didn't happen.
- If you are a new model and see no runner running: start it: `python runner/orchestrator.py --auto`
