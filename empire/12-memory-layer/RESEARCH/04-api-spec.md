# RESEARCH 04 — API spec (frozen for v0, versioned hereafter)
Base: `/api/memory`. All bodies Effect-Schema validated; invalid → 400 with readable cause (never 500 on bad input).

## POST /api/memory — ingest
Request: `{ "user": "dixit", "text": "Owner prefers vertical video under 20s", "kind": "preference" }`
`kind ∈ fact | preference | decision | log` (default: fact).
Response: `{ "ok": true, "id": "m_01J…", "deduped": false, "redactions": 0 }`
Rules: empty text → 400; near-dup → 200 with `deduped: true` (no double-store); PII redacted + counted.

## GET /api/memory?q=&user=&limit= — recall
Response: `{ "ok": true, "tookMs": 12, "estTokensSaved": 1840, "results": [{ "id", "text", "kind", "score", "age" }] }`
`estTokensSaved` = sum of returned-block tokens the caller does NOT need to re-paste (the T2 story, measured).
Empty q → latest by recency. limit default 5, max 20.

## DELETE /api/memory?id= — hard delete (Gatekeeper proof for enterprise)

## MCP tool shape (v1.1, for Cursor/Claude/Desktop distribution)
`memory_write {text, kind?}`, `memory_search {query, limit?}` — same handlers, JSON-RPC wrapper. No new logic, new door.

## Versioning
Spec changes land here first with a date + migration note. Code follows docs, never leads.
