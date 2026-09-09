# RESEARCH 01 — Landscape: who got funded for memory (Sep 2026)
Sources: YC directory, TechCrunch (Oct 2025), company sites. All cloud, all API-priced.

## The funded three
| Co | Raised | Backers | Architecture | Positioning |
|----|--------|---------|--------------|-------------|
| Mem0 (YC S24) | $24M (Kindred seed, Basis Set A, Peak XV, GitHub Fund; angels: Dharmesh Shah, Datadog/Supabase/PostHog CEOs) | hybrid graph+vector+KV | "memory passport" — memory travels across apps |
| Supermemory | $3M seed (Susa, Browder, SF1; Jeff Dean, Cloudflare CTO, Sentry founder angels); founder briefly at Mem0 | learner-1 model + vector-graph DB + time | lowest latency; 100k+ orgs, 1T+ tokens/mo, <300ms recall, #1 LongMemEval/LoCoMo |
| Letta | $10M seed (Felicis; Berkeley Sky lab, MemGPT creators, Ion Stoica advises) | stateful agents, MemGPT lineage | research-lab-grade continuous learners |

Also: Memories.ai (Susa + Samsung, video memory). YC approached Supermemory's founder — the valley knows this category is hot.

## What NONE of them give you
1. Local-first operation (all require their cloud + keys).
2. Cache-aligned recall (dynamic strings break provider prefix caching → you pay full price twice).
3. Data you can read (export exists; "readable by any tool, no SDK" does not).
4. Fixed pricing sanity for indies (per-token meters on top of model meters).

## Our wedge (repeatable mantra)
"The memory layer that runs where your agent runs." One SQLite file, zero keys, byte-stable recall blocks, export anytime. Start free/local forever; pay only for sync.
