# RESEARCH 02 — Supermemory teardown (from their own site + blog, Sep 2026)
What they claim: default engine for memory + continual learning; learner-1 extracts/dreams on every user/task/tenant; vector-graph DB with time understanding; injects tokens in real time via hooks; API + plugins + MCP; 100k+ orgs, tens of millions of users, 1T+ tokens/mo.

## What's genuinely strong (steal these ideas)
- **Time-aware recall** — memory with timestamps/decay beats flat vectors. (Adopted: our recency decay.)
- **Dreaming/consolidation** — background passes that connect dots (their "Dynamic Dreaming"). (Adopted: our nightly GraphWeaver pass = same idea, local.)
- **Hooks injection** — memory enters context at fixed anchor points, not random middle. (Adopted: byte-stable blocks under the cache line.)
- **Benchmarks as marketing** — #1 LongMemEval/LoCoMo published openly. (Adopted: our golden set + precision@3 dashboard, same playbook at indie scale.)
- **Distribution via MCP/plugins** — meet builders inside Cursor/Claude/Desktop. (Adopted: our MCP tool shape in api-spec.)

## Where they're soft (our attack surface)
- Everything is their cloud: your users' memories train adjacency to their moat; latency floor = network.
- Pricing meters stack on model meters — the exact bill-shock loop from thesis T2.
- "Interoperable" still means their API shapes. A SQLite file you can SELECT is more interoperable than any SDK.
- 19-year-old solo velocity is their strength AND their gap: enterprise trust (retention proofs, redaction, audit) is thin — our Gatekeeper story.

## Verdict
Respect the engine, attack the deployment model. We don't out-model learner-1; we out-position it: local, readable, fixed-cost.
