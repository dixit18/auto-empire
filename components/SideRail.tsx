"use client";
import { useEffect, useState } from "react";
import { TEAMS, type Team } from "@/lib/teams";

const DOTS: Record<string, string> = { forest: "#2e7d4f", beach: "#0b6e99", sunset: "#bd5a2e", lagoon: "#0e7c7b" };

/* Persistent newsroom rail: search, sections, every desk, live counts.
   This is the answer to "hard to find anything" — always visible, always one click. */
export default function SideRail({ cur, onPick, statusOf, alerts }: {
  cur: Team; onPick: (t: Team) => void; statusOf: (t: Team) => string; alerts: number;
}) {
  const [q, setQ] = useState("");
  const [provided, setProvided] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("empire-needs-v1");
      if (raw) setProvided(JSON.parse(raw).length);
    } catch {}
    const id = setInterval(() => {
      try {
        const raw = localStorage.getItem("empire-needs-v1");
        if (raw) setProvided(JSON.parse(raw).length);
      } catch {}
    }, 4000);
    return () => clearInterval(id);
  }, []);
  const query = q.trim().toLowerCase();
  const list = query
    ? TEAMS.filter((t) => `${t.id} ${t.name} ${t.industry} ${t.tagline} ${t.master}`.toLowerCase().includes(query))
    : TEAMS;
  return (
    <div className="space-y-3">
      <div>
        <div className="font-extrabold" style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
          The Empire
        </div>
        <div className="t-small t-mono" style={{ color: "hsl(var(--muted-fg))" }}>newsroom rail</div>
      </div>
      <label className="block">
        <span className="t-small font-bold" style={{ color: "hsl(var(--muted-fg))" }}>Find a desk</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="name, industry, master…"
          className="mt-1 w-full surface-2 px-2.5 py-2 t-small" style={{ background: "hsl(var(--card))" }} aria-label="Search teams" />
      </label>
      <nav className="t-small font-bold flex flex-col gap-1" aria-label="Sections" style={{ color: "hsl(var(--muted-fg))" }}>
        <a className="hover:underline" href="#world">§ 01 The World</a>
        <a className="hover:underline" href="#numbers">§ 02 By the Numbers</a>
        <a className="hover:underline" href="#newsroom">§ 03 Newsroom</a>
        <a className="hover:underline" href="#wanted">§ 05 Wanted {alerts > 0 ? `(${alerts} approvals!)` : `(21−${provided} open)`}</a>
      </nav>
      <div className="rule-single" />
      <ol className="space-y-1 max-h-[46vh] overflow-auto pr-1" aria-label="All desks">
        {list.map((t) => {
          const on = t.id === cur.id;
          return (
            <li key={t.id}>
              <button onClick={() => onPick(t)} aria-pressed={on}
                className="w-full text-left rounded px-2 py-1.5 flex items-center gap-2 t-small transition-colors"
                style={on ? { background: "hsl(var(--foreground))", color: "hsl(var(--background))" } : { color: "hsl(var(--foreground))" }}>
                <span aria-hidden style={{ width: 8, height: 8, borderRadius: 99, background: DOTS[t.world], flexShrink: 0 }} />
                <span className="t-mono" style={{ fontSize: "0.7rem", opacity: 0.75 }}>{t.id}</span>
                <span className="font-bold truncate flex-1">{t.name}</span>
                <span className="t-mono shrink-0" style={{ fontSize: "0.66rem", opacity: 0.7 }}>{statusOf(t)}</span>
              </button>
            </li>
          );
        })}
        {list.length === 0 && <li className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>No desk matches “{q}”.</li>}
      </ol>
    </div>
  );
}
