"use client";
import { useEffect, useState } from "react";
import { NEEDS } from "@/lib/needs";

const KEY = "empire-needs-v1";

/* Shopping list for the proprietor: everything only you can provide.
   Ticks persist in your browser; the mirror file is empire/NEEDS.md. */
export default function NeedsFromYou() {
  const [done, setDone] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDone(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  function toggle(id: string) {
    setDone((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      try { localStorage.setItem(KEY, JSON.stringify(Array.from(n))); } catch {}
      return n;
    });
  }
  const groups = Array.from(new Set(NEEDS.map((n) => n.group)));
  const left = NEEDS.length - done.size;
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="t-kicker">§ 05 — Wanted from the proprietor</span>
        <span className="t-small t-num ml-auto" style={{ color: "hsl(var(--muted-fg))" }}>{left} open · {done.size} provided</span>
      </div>
      <div className="surface p-4">
        <p className="t-body max-w-prose" style={{ color: "hsl(var(--muted-fg))" }}>
          Agents can't open accounts, mint keys, or spend budgets. Tick anything off whenever you have time —
          each line names exactly what it unblocks. Full mirror: <code className="t-mono">empire/NEEDS.md</code>.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g}>
              <div className="t-small font-extrabold mb-1.5" style={{ letterSpacing: "0.08em", textTransform: "uppercase", color: "hsl(var(--primary))" }}>{g}</div>
              <ul className="space-y-1.5">
                {NEEDS.filter((n) => n.group === g).map((n) => {
                  const on = done.has(n.id);
                  return (
                    <li key={n.id}>
                      <label className="surface-2 px-2.5 py-2 t-small flex items-start gap-2 cursor-pointer"
                        style={{ opacity: on ? 0.55 : 1 }}>
                        <input type="checkbox" checked={on} onChange={() => toggle(n.id)} className="mt-1 accent-current" aria-label={n.text} />
                        <span className="min-w-0">
                          <b className="t-mono" style={{ fontSize: "0.72rem" }}>{n.team}</b> · <span style={{ textDecoration: on ? "line-through" : "none" }}>{n.text}</span>
                          <span className="block" style={{ color: "hsl(var(--muted-fg))" }}>unblocks: {n.unblocks}</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
