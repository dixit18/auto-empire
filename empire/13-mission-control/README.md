# 13 — Mission Control for tiny teams (org: devtools SaaS)
Mission: one shared room where a 1–5 person team sees every agent session, hands tasks between agents, watches spend live, shares memory.

## Why this, why now (YC-grounded)
- YC S26 funded the shape repeatedly: Dock (multiplayer workspace), Mosaic (shared session memory), Glen (shared learning), Decawork (control plane). Fall RFS #4 asks for it outright.
- Everybody aims enterprise. RFS also asks for "a cloud for small software" — the tiny-team wedge is open.
- PG-organic: our own empire deck IS v0. We sell our scars, not a slideware vision.

## Wedge (3 narrow blades)
1. **Shared sessions**: any agent's live state visible + redirectable by any teammate (our bus, productized).
2. **Spend live**: per-agent, per-task token cost with Tenor-style attribution at indie pricing (needs Supabase for shared view — NEEDS.md).
3. **Shared memory hooks**: plugs into Team 12's layer (memory as infrastructure, not feature).

## TEAM
**MASTER: FlightDirector** — owns room reliability + handoff success rate.
**A1 RoomKeeper:** session registry, presence, live cursors of work.
**A2 CostClerk:** per-task spend metering + budget alarms.
**A3 RelayPilot:** agent→agent and human→agent handoffs that never drop context.
**A4 Scribe:** auto session notes + decisions log (feeds memory layer).

## PHASES
P0: YC IDEAS doc (done) + 5-team interview script. P1: dogfood — run OUR empire through the room UI daily. P2: 10 tiny-team pilots free. P3: $29/room/mo + $99 team tier.
KPIs: handoff success ≥95% · room p95 interaction <200ms · 10 pilots.
First $100: 5 × $20 lifetime rooms to indie agent teams.
Kill rule: pilots don't open the room daily within 2 weeks = vitamin, kill.
