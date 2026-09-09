import { Either, Schema } from "effect";
import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import { empireRoot } from "../server";

/* Recall Foundry v0 — local-first memory. Effect at every boundary,
   SQLite FTS5 underneath, zero keys, zero network. */

export const Kind = Schema.Literal("fact", "preference", "decision", "log");
export type Kind = Schema.Schema.Type<typeof Kind>;

export const IngestBody = Schema.Struct({
  user: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(64)),
  text: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(4000)),
  kind: Schema.optional(Kind),
});

let db: DatabaseSync | null = null;

function djb2(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function getDb(): DatabaseSync {
  if (db) return db;
  const root = empireRoot();
  if (!root) throw new Error("empire/ not found");
  const dir = path.join(root, "12-memory-layer", "data");
  fs.mkdirSync(dir, { recursive: true });
  db = new DatabaseSync(path.join(dir, "memory.db"));
  db.exec(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY, user TEXT NOT NULL, text TEXT NOT NULL, kind TEXT NOT NULL,
      entities TEXT NOT NULL DEFAULT '[]', hash TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_entries_user_time ON entries (user, created_at DESC);`);
  return db;
}

const PII = [
  /[\w.+-]+@[\w-]+\.[\w.]+/g,
  /(\+?\d[\d\s-]{7,}\d)/g,
  /\b(sk-[A-Za-z0-9-_]{8,}|ghp_[A-Za-z0-9_]{8,}|xox[bap]-[A-Za-z0-9-]{8,})\b/g,
];

export function redact(text: string): { clean: string; count: number } {
  let count = 0;
  let clean = text;
  for (const re of PII) clean = clean.replace(re, (m) => { count++; return "[redacted]"; });
  return { clean, count };
}

export function entitiesOf(text: string): string[] {
  const out = new Set<string>();
  const re = /\b[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,}){0,2}\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) && out.size < 8) out.add(m[0]);
  return Array.from(out);
}

export type IngestResult = { ok: true; id: string; deduped: boolean; redactions: number } | { ok: false; error: string };

export function ingest(raw: unknown): IngestResult {
  const parsed = Either.getOrElse(Schema.decodeUnknownEither(IngestBody)(raw), () => null);
  if (!parsed) return { ok: false, error: "need {user, text, kind?} — text 1..4000 chars" };
  const kind = parsed.kind ?? "fact";
  const { clean, count } = redact(parsed.text.trim());
  const hash = djb2(clean.toLowerCase());
  const d = getDb();
  const dupe = d.prepare("SELECT id FROM entries WHERE user = ? AND hash = ? LIMIT 1").get(parsed.user, hash) as { id: string } | undefined;
  if (dupe) return { ok: true, id: dupe.id, deduped: true, redactions: count };
  const id = "m_" + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
  const now = Date.now();
  d.prepare("INSERT INTO entries (id, user, text, kind, entities, hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(id, parsed.user, clean, kind, JSON.stringify(entitiesOf(clean)), hash, now);
  return { ok: true, id, deduped: false, redactions: count };
}

export type Hit = { id: string; text: string; kind: string; score: number; age: string };

const BOOST: Record<string, number> = { decision: 1.2, preference: 1.1, fact: 1.0, log: 0.85 };
const HALF_LIFE_MS = 14 * 86400000;

function ageOf(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export function recall(user: string, q: string, limit = 5): { hits: Hit[]; tookMs: number; estTokensSaved: number } {
  const t0 = Date.now();
  const d = getDb();
  const lim = Math.min(20, Math.max(1, limit || 5));
  if (!q.trim()) {
    const fresh = d.prepare("SELECT id, text, kind, created_at FROM entries WHERE user = ? ORDER BY created_at DESC LIMIT ?").all(user, lim) as { id: string; text: string; kind: string; created_at: number }[];
    const hits = fresh.map((r) => ({ id: r.id, text: r.text, kind: r.kind, score: 1, age: ageOf(r.created_at) }));
    return { hits, tookMs: Date.now() - t0, estTokensSaved: estSaved(hits) };
  }
  const terms = q.toLowerCase().split(/\s+/).filter((w) => w.length > 1).slice(0, 8);
  if (!terms.length) return { hits: [], tookMs: Date.now() - t0, estTokensSaved: 0 };
  const like = terms.map(() => "LOWER(text) LIKE ?").join(" OR ");
  const params = terms.map((t) => `%${t}%`);
  const rows = d.prepare(`SELECT id, text, kind, created_at FROM entries WHERE user = ? AND (${like}) ORDER BY created_at DESC LIMIT 40`)
    .all(user, ...params) as { id: string; text: string; kind: string; created_at: number }[];
  const now = Date.now();
  const hits = rows
    .map((r) => {
      const low = r.text.toLowerCase();
      const matched = terms.filter((t) => low.includes(t)).length / terms.length;
      const rec = Math.pow(0.5, (now - r.created_at) / HALF_LIFE_MS);
      const score = Math.round((0.55 * matched + 0.25 * rec + 0.2 * (BOOST[r.kind] ?? 1) / 1.2) * 1000) / 1000;
      return { id: r.id, text: r.text, kind: r.kind, score, age: ageOf(r.created_at) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, lim);
  return { hits, tookMs: Date.now() - t0, estTokensSaved: estSaved(hits) };
}

function estSaved(hits: Hit[]): number {
  return hits.reduce((n, h) => n + Math.ceil(h.text.length / 4), 0);
}

export function remove(id: string, user: string): boolean {
  const d = getDb();
  const row = d.prepare("SELECT id FROM entries WHERE id = ? AND user = ?").get(id, user) as { id: string } | undefined;
  if (!row) return false;
  d.prepare("DELETE FROM entries WHERE id = ?").run(id);
  return true;
}
