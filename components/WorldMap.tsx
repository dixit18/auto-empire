"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TEAMS, ISLANDS, HUB, type Team } from "@/lib/teams";
import { Motif } from "./motifs";
import type { Log } from "./KpiStrip";

const WORLD_COLOR: Record<string, string> = { forest: "#2f9e44", beach: "#0e9fd8", sunset: "#8b5cf6", lagoon: "#0d9488" };

type Pulse = { key: string; teamId: string; x0: number; y0: number };

/* THE AGENT WORLD — every team is an island, the bus is the hub.
   Pulses are real bus events flowing island → hub. Click an island to open its world. */
export default function WorldMap({ logs, cur, onPick }: { logs: Log[]; cur: Team; onPick: (t: Team) => void }) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fresh = logs.slice(0, 10).filter((l) => {
      const k = `${l.ts}|${l.msg}`;
      if (seen.current.has(k)) return false;
      seen.current.add(k);
      return true;
    });
    if (!fresh.length) return;
    const add = fresh.map((l) => {
      const dir = String(l.team);
      const t = TEAMS.find((x) => dir.startsWith(x.id)) ?? TEAMS.find((x) => x.dir === dir);
      const isl = ISLANDS[t?.id ?? "05"];
      return { key: `${l.ts}|${l.msg}`, teamId: t?.id ?? "05", x0: isl.x, y0: isl.y };
    });
    setPulses((p) => [...add, ...p].slice(0, 14));
    const id = setTimeout(() => {
      setPulses((p) => p.filter((x) => !add.some((a) => a.key === x.key)));
    }, 2400);
    return () => clearTimeout(id);
  }, [logs]);

  const routes = useMemo(() => TEAMS.map((t) => {
    const p = ISLANDS[t.id];
    const mx = (p.x + HUB.x) / 2, my = (p.y + HUB.y) / 2 - 6;
    return { id: t.id, d: `M ${p.x} ${p.y} Q ${mx} ${my} ${HUB.x} ${HUB.y}` };
  }), []);

  return (
    <div className="surface relative overflow-hidden" aria-label="Agent world map">
      <div className="flex items-center gap-2 px-3 sm:px-4 pt-3">
        <h2 className="t-h2">Agent World</h2>
        <span className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>10 islands · one bus · pulses are live events</span>
        <Link href={`/${cur.dir}`} className="btn btn-ghost ml-auto" style={{ padding: "0.35rem 0.8rem", fontSize: "0.78rem" }}>
          Open {cur.id} world →
        </Link>
      </div>
      <div className="relative mx-3 sm:mx-4 mb-3 mt-2 rounded-[10px] border overflow-hidden"
        style={{ aspectRatio: "1000 / 460", background: "hsl(var(--card-2))" }}>
        <svg viewBox="0 0 100 46" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {Array.from({ length: 21 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 5} y1="0" x2={i * 5} y2="46" stroke="hsl(var(--border))" strokeWidth="0.07" opacity="0.7" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 5} x2="100" y2={i * 5} stroke="hsl(var(--border))" strokeWidth="0.07" opacity="0.7" />
          ))}
          {routes.map((r) => (
            <path key={r.id} d={r.d} fill="none" stroke="hsl(var(--border-strong))" strokeWidth="0.22" strokeDasharray="0.9 0.9" opacity="0.9" />
          ))}
          <circle cx={HUB.x} cy={HUB.y} r="3.2" fill="hsl(var(--primary) / .15)" />
          <circle cx={HUB.x} cy={HUB.y} r="1.5" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" />
        </svg>
        <div className="absolute t-mono" style={{ left: `${HUB.x}%`, top: `${HUB.y}%`, transform: "translate(-50%, 26px)", fontSize: 10, color: "hsl(var(--muted-fg))" }}>BUS</div>

        {/* travelling pulses */}
        <AnimatePresence>
          {pulses.map((p) => {
            const t = TEAMS.find((x) => x.id === p.teamId)!;
            return (
              <motion.span key={p.key} aria-hidden
                className="absolute rounded-full"
                style={{ width: 8, height: 8, background: WORLD_COLOR[t.world], boxShadow: `0 0 10px ${WORLD_COLOR[t.world]}` }}
                initial={{ left: `${p.x0}%`, top: `${p.y0}%`, opacity: 0, x: "-50%", y: "-50%" }}
                animate={{ left: [`${p.x0}%`, `${HUB.x}%`], top: [`${p.y0}%`, `${HUB.y}%`], opacity: [0, 1, 1] }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 2.1, ease: "easeInOut" }} />
            );
          })}
        </AnimatePresence>

        {/* islands */}
        {TEAMS.map((t) => {
          const p = ISLANDS[t.id];
          const on = t.id === cur.id;
          return (
            <button key={t.id} onClick={() => onPick(t)} aria-pressed={on} title={`${t.id} · ${t.name} — open with the button above`}
              className="absolute grid place-items-center rounded-full border transition-transform hover:scale-110"
              style={{
                left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)",
                width: 40, height: 40, background: "hsl(var(--card))",
                borderColor: on ? WORLD_COLOR[t.world] : "hsl(var(--border-strong))",
                borderWidth: on ? 2.5 : 1.5,
                boxShadow: on ? `0 0 0 4px ${WORLD_COLOR[t.world]}33, var(--shadow-2)` : "var(--shadow-1)",
                color: "hsl(var(--foreground))",
              }}>
              <Motif id={t.id} className="h-5 w-5" />
              <span className="t-mono absolute" style={{ top: 42, fontSize: 9, color: on ? WORLD_COLOR[t.world] : "hsl(var(--muted-fg))", fontWeight: 700 }}>{t.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
