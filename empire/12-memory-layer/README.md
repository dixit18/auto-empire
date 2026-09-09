# 12 — Recall Foundry: the memory layer that runs where your agent runs
Industry: AI infrastructure | Model: OSS core + hosted sync | Target: 1k GitHub stars → $2k MRR sync tier

## Thesis (post-landscape)
Mem0 ($24M, YC S24), Supermemory ($3M, ex-Mem0 founder), Letta ($10M, MemGPT lab) all sell the SAME shape: your memories on THEIR cloud, per-token/API pricing, 50–200ms retrieval hops that torch your KV-cache prefixes. Three bets we make against them:
1. **Local-first wins the indie/long tail.** Solo builders and privacy-bound shops (clinics, EU) won't ship user memory to a third cloud. Zero keys, one file, works offline.
2. **Memory must be cache-aligned.** Retrieval that rewrites your prompt prefix re-bills every cached token. Our recall returns byte-stable blocks designed to sit UNDER the cache line.
3. **Interoperable beats passport.** "Memory passport" is lock-in with a nice name. Ours exports plain JSON/SQLite you can read with any tool.

## Product (v0 live in this repo)
`POST /api/memory` ingest {user, text, kind} → Effect-validated → SQLite FTS5 + recency/entity scoring. `GET /api/memory?q=&user=` recall ranked with latency + tokens-saved estimate. Lab UI on this team's app page. No keys, no network, <50ms local.

## TEAM
**MASTER: MemoryKeeper** — owns recall quality (precision@3 on golden set) + latency budget.
**A1 Ingestor:** normalize/dedupe/entity-tag incoming text. Output: clean entries.
**A2 GraphWeaver:** link entries (same entity, cause→effect, supersedes). Output: edges, not just rows.
**A3 Recaller:** rank (FTS + recency decay + kind boost), byte-stable prompt blocks.
**A4 Gatekeeper:** PII redaction, retention TTLs, export/delete (the compliance story that unlocks enterprise).

## PHASES
P0: landscape + teardown (RESEARCH/, done). P1: local MVP live (this repo). P2: golden eval set + precision@3 dashboard (thesis T4 machinery). P3: hosted sync tier ($19/mo: backup + share across machines) + MCP tool shape.
KPIs: recall p95 <50ms local · precision@3 ≥0.8 on goldens · 0 keys required.
First $100: 5 × $20 lifetime sync pre-sales to indie agent builders.
