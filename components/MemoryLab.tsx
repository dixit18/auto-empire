"use client";
import { useState } from "react";
import { Button } from "./ui";

type Hit = { id: string; text: string; kind: string; score: number; age: string };

/* Memory Lab — the product, running. Write memories, search them, watch latency. Zero keys. */
export default function MemoryLab() {
  const [user, setUser] = useState("dixit");
  const [text, setText] = useState("");
  const [kind, setKind] = useState("fact");
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [meta, setMeta] = useState("");
  const [busy, setBusy] = useState(false);

  async function write() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const r = await fetch("/api/memory", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, text, kind }),
      });
      const j = await r.json();
      setMeta(j.ok ? (j.deduped ? `stored before (${j.id})` : `remembered as ${j.id}${j.redactions ? ` · ${j.redactions} PII redacted` : ""}`) : `rejected: ${j.error}`);
      setText("");
      if (q) search(q);
    } finally { setBusy(false); }
  }

  async function search(query = q) {
    const r = await fetch(`/api/memory?user=${encodeURIComponent(user)}&q=${encodeURIComponent(query)}&limit=5`);
    const j = await r.json();
    if (j.ok) {
      setHits(j.hits);
      setMeta(`${j.hits.length} hits in ${j.tookMs}ms · ~${j.estTokensSaved} tokens you don't re-paste`);
    } else setMeta(`error: ${j.error}`);
  }

  return (
    <div className="surface p-4">
      <div className="t-kicker mb-1">§ Memory Lab — v0, live</div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="t-small font-bold">Remember this</label>
          <div className="mt-1 flex gap-2">
            <input value={user} onChange={(e) => setUser(e.target.value)} aria-label="User"
              className="surface-2 px-2 py-2 t-small t-mono" style={{ width: 110 }} />
            <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Kind"
              className="surface-2 px-2 py-2 t-small" style={{ background: "hsl(var(--card))" }}>
              <option value="fact">fact</option>
              <option value="preference">preference</option>
              <option value="decision">decision</option>
              <option value="log">log</option>
            </select>
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Owner prefers vertical video under 20s…"
            className="mt-2 w-full surface-2 px-2.5 py-2 t-small" style={{ background: "hsl(var(--card))" }} aria-label="Memory text" />
          <div className="mt-2"><Button loading={busy} onClick={write}>Remember it</Button></div>
        </div>
        <div>
          <label className="t-small font-bold">Recall</label>
          <div className="mt-1 flex gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="video length…" className="flex-1 surface-2 px-2.5 py-2 t-small" style={{ background: "hsl(var(--card))" }} aria-label="Search memories" />
            <Button variant="ghost" onClick={() => search()}>Search</Button>
          </div>
          {meta && <p className="t-small t-mono mt-2" style={{ color: "hsl(var(--muted-fg))" }}>{meta}</p>}
          {hits && (
            <ul className="mt-2 space-y-1.5">
              {hits.length === 0 && <li className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>Nothing remembered yet — write above first.</li>}
              {hits.map((h) => (
                <li key={h.id} className="surface-2 px-2.5 py-2 t-small">
                  <div className="flex gap-2 items-baseline">
                    <b className="t-mono" style={{ fontSize: "0.72rem", color: "hsl(var(--primary))" }}>{h.kind}</b>
                    <span className="t-mono ml-auto shrink-0" style={{ fontSize: "0.7rem", color: "hsl(var(--muted-fg))" }}>{h.score} · {h.age}</span>
                  </div>
                  <p className="mt-0.5 break-words">{h.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
