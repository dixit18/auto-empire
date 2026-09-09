# RESEARCH 03 — Architecture: local-first memory in Effect + SQLite
No keys, no network, one file: `empire/12-memory-layer/data/memory.db` (gitignored, schema committed).

## Services (Effect modules, `lib/memory/`)
- **Schema** — `MemoryEntry {id, user, text, kind, entities[], createdAt}`, `RecallQuery {user, q, limit}`. Effect Schema decode-then-act at every boundary (same discipline as `lib/bus.ts`).
- **Store** — node:sqlite (Node 22 built-in). Tables: `entries(id, user, text, kind, created_at)` + FTS5 virtual table for full-text. WAL mode. One file per deployment, `SELECT`-readable by any tool (the anti-lock-in guarantee).
- **Index** — on ingest: normalize → dedupe (exact-hash + near-dup token overlap >0.9) → entity tags (capitalized phrases + known-entity list) → FTS insert. Synchronous, <10ms.
- **Recall** — score = 0.55·FTS rank + 0.25·recency decay (half-life 14d) + 0.20·kind boost (decision > preference > fact > log). Returns byte-stable blocks: fixed template, newest-last, hard token cap — designed to sit UNDER the provider cache line (thesis T3).
- **Gate** — PII redaction patterns (email/phone/key-like) at ingest; TTL per kind (log 30d, else keep); full export + hard delete endpoints (the enterprise story).

## Why not vector DB (honest)
Embeddings need a model (key or 500MB local weights). FTS5 + recency wins indie-scale recall (<100k entries) at 0 dependencies and <50ms. Vectors graduate in at 100k+ entries via sqlite-vec — same file, no migration. Ship boring first.
