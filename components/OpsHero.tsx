"use client";
import { motion } from "framer-motion";
import type { Log } from "./KpiStrip";

const PHASES = [
  { id: "P0", label: "Validate", desc: "10 pains · GO/KILL" },
  { id: "P1", label: "Build", desc: "MVP + QA" },
  { id: "P2", label: "Launch", desc: "listing + 5 posts" },
  { id: "P3", label: "Scale", desc: "pricing + retention" },
] as const;

/* Real operations visual: phase pipeline fed by the live bus.
   Progress bars = share of done-events per phase. No mascots, no fake motion. */
export default function OpsHero({ logs, running }: { logs: Log[]; running: boolean }) {
  const done = logs.filter((l) => l.status === "done");
  const total = Math.max(1, logs.length);
  const per = (p: string) => {
    const d = done.filter((l) => l.phase === p).length;
    const all = logs.filter((l) => l.phase === p).length;
    return { d, pct: all ? Math.round((d / all) * 100) : 0 };
  };
  const activePhases = new Set(logs.slice(0, 12).map((l) => l.phase));
  return (
    <div className="surface relative overflow-hidden p-4 sm:p-5" aria-label="Pipeline status">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="t-h2">Pipeline</h2>
        <span className="chip" style={running
          ? { background: "hsl(var(--success) / .14)", color: "hsl(var(--success))", borderColor: "hsl(var(--success) / .35)" }
          : {}}>
          <span aria-hidden>{running ? "●" : "○"}</span> {running ? "agents active" : "idle"}
        </span>
        <span className="t-small t-mono ml-auto" style={{ color: "hsl(var(--muted-fg))" }}>
          {done.length}/{logs.length} tasks done
        </span>
      </div>
      <ol className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {PHASES.map((p, i) => {
          const s = per(p.id);
          const hot = activePhases.has(p.id);
          return (
            <li key={p.id} className="surface-2 p-3 relative overflow-hidden">
              <div className="flex items-baseline gap-2">
                <span className="t-mono font-semibold" style={{ fontSize: "0.75rem", color: hot ? "hsl(var(--primary))" : "hsl(var(--muted-fg))" }}>{p.id}</span>
                <span className="font-bold" style={{ fontSize: "0.9rem" }}>{p.label}</span>
                {hot && <span aria-hidden className="ml-auto inline-block" style={{ width: 7, height: 7, borderRadius: 99, background: "hsl(var(--success))" }} />}
              </div>
              <div className="t-small mt-0.5" style={{ color: "hsl(var(--muted-fg))" }}>{p.desc}</div>
              <div className="mt-2 h-1.5 rounded-full" style={{ background: "hsl(var(--muted))" }} role="progressbar"
                aria-valuenow={s.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.id} completion`}>
                <motion.div className="h-full rounded-full" style={{ background: "hsl(var(--primary))" }}
                  initial={false} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
              </div>
              <div className="t-small t-num mt-1" style={{ color: "hsl(var(--muted-fg))" }}>{s.d} done</div>
              {i < 3 && <span aria-hidden className="hidden lg:block absolute top-1/2 -right-2" style={{ color: "hsl(var(--border-strong))" }}>→</span>}
            </li>
          );
        })}
      </ol>
      <p className="t-small t-mono mt-3" style={{ color: "hsl(var(--muted-fg))" }}>
        master assigns → workers execute → bus logs · total {total} events
      </p>
    </div>
  );
}
