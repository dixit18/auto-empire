"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TEAMS, ISLANDS, HUB, type Team } from "@/lib/teams";
import { Motif } from "./motifs";
import type { Log } from "./KpiStrip";

/* Editorial island inks — one restrained set for the whole atlas. */
const ISLE_INK: Record<string, string> = { forest: "#2e7d4f", beach: "#0b6e99", sunset: "#bd5a2e", lagoon: "#0e7c7b" };

type Pulse = { key: string; teamId: string; d: string };

/* THE WORLD ATLAS — a print infographic come alive. Every island wired to
   the central desk by one unbroken rail. Drag to roam, scroll to zoom,
   hover an island to trace its full line. Live pulses ride the rails. */
export default function WorldMap({ logs, cur, onPick }: { logs: Log[]; cur: Team; onPick: (t: Team) => void }) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [hover, setHover] = useState<string | null>(null);
  const seen = useRef<Set<string>>(new Set());
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ sx: number; sy: number; x: number; y: number } | null>(null);
  const moved = useRef(false);

  const routes = useMemo(() => {
    const m: Record<string, string> = {};
    for (const t of TEAMS) {
      const p = ISLANDS[t.id];
      const mx = (p.x + HUB.x) / 2, my = (p.y + HUB.y) / 2 - 7;
      m[t.id] = `M ${p.x} ${p.y} Q ${mx} ${my} ${HUB.x} ${HUB.y}`;
    }
    return m;
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fresh = logs.slice(0, 12).filter((l) => {
      const k = `${l.ts}|${l.msg}`;
      if (seen.current.has(k)) return false;
      seen.current.add(k);
      return true;
    });
    if (!fresh.length) return;
    const add: Pulse[] = fresh.map((l) => {
      const dir = String(l.team);
      const t = TEAMS.find((x) => dir.startsWith(x.id)) ?? TEAMS.find((x) => x.dir === dir) ?? TEAMS[4];
      return { key: `${l.ts}|${l.msg}`, teamId: t.id, d: routes[t.id] };
    });
    setPulses((p) => [...add, ...p].slice(0, 16));
    const id = setTimeout(() => {
      setPulses((p) => p.filter((x) => !add.some((a) => a.key === x.key)));
    }, 2600);
    return () => clearTimeout(id);
  }, [logs, routes]);

  function onDown(e: React.PointerEvent) {
    drag.current = { sx: e.clientX, sy: e.clientY, x: view.x, y: view.y };
    moved.current = false;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 6) moved.current = true;
    setView((v) => ({ ...v, x: d.x + dx, y: d.y + dy }));
  }
  function onUp() { drag.current = null; setTimeout(() => { moved.current = false; }, 0); }

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      setView((v) => {
        const k2 = Math.min(3.5, Math.max(1, v.k * (e.deltaY < 0 ? 1.18 : 1 / 1.18)));
        const s = k2 / v.k;
        return { k: k2, x: cx - (cx - v.x) * s, y: cy - (cy - v.y) * s };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function zoom(f: number) {
    setView((v) => ({ ...v, k: Math.min(3.5, Math.max(1, v.k * f)) }));
  }

  const lastSeen = useMemo(() => {
    const m: Record<string, number> = {};
    for (const l of logs) {
      const dir = String(l.team);
      const t = TEAMS.find((x) => dir.startsWith(x.id)) ?? TEAMS.find((x) => x.dir === dir);
      if (!t || m[t.id]) continue;
      const ts = Date.parse(l.ts);
      if (!Number.isNaN(ts)) m[t.id] = ts;
    }
    return m;
  }, [logs]);
  const now = Date.now();
  const latest = logs[0];

  return (
    <div className="surface relative overflow-hidden" aria-label="Agent world atlas">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 sm:px-4 pt-3">
        <span className="t-kicker">§ 01 — The World</span>
        <span className="t-small hidden md:inline" style={{ color: "hsl(var(--muted-fg))" }}>
          drag to roam · scroll to zoom · hover an island to trace its line
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem" }} onClick={() => zoom(1 / 1.3)} aria-label="Zoom out">−</button>
          <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem" }} onClick={() => zoom(1.3)} aria-label="Zoom in">+</button>
          <button className="btn btn-ghost" style={{ padding: "0.3rem 0.7rem" }} onClick={() => setView({ x: 0, y: 0, k: 1 })}>Reset</button>
          <Link href={`/${cur.dir}`} className="btn btn-primary" style={{ padding: "0.35rem 0.8rem", fontSize: "0.78rem" }}>
            Open {cur.id} →
          </Link>
        </div>
      </div>

      <div ref={box} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        className="relative mx-3 sm:mx-4 mb-2 mt-2 rounded border overflow-hidden"
        style={{ aspectRatio: "1000 / 460", background: "hsl(var(--card))", cursor: drag.current ? "grabbing" : "grab", touchAction: "none" }}>
        <div className="absolute inset-0" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: "0 0" }}>
          <svg viewBox="0 0 100 46" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            {Array.from({ length: 21 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 5} y1="0" x2={i * 5} y2="46" stroke="hsl(var(--border))" strokeWidth="0.06" opacity="0.8" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 5} x2="100" y2={i * 5} stroke="hsl(var(--border))" strokeWidth="0.06" opacity="0.8" />
            ))}
            {/* unbroken rails, island → desk */}
            {TEAMS.map((t) => {
              const lit = hover === null || hover === t.id;
              const hot = hover === t.id;
              return (
                <g key={t.id} opacity={lit ? 1 : 0.16} style={{ transition: "opacity .2s" }}>
                  <path d={routes[t.id]} fill="none"
                    stroke={hot ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
                    strokeWidth={hot ? 0.5 : 0.24} opacity={hot ? 1 : 0.55} />
                  <circle cx={HUB.x} cy={HUB.y} r={hot ? 0.55 : 0.34} fill={hot ? "hsl(var(--primary))" : ISLE_INK[t.world]} />
                </g>
              );
            })}
            {/* the central desk */}
            <circle cx={HUB.x} cy={HUB.y} r="3.1" fill="hsl(var(--foreground))" />
            <circle cx={HUB.x} cy={HUB.y} r="3.1" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" strokeDasharray="0.8 0.5" />
            <circle cx={HUB.x} cy={HUB.y} r="1.7" fill="hsl(var(--background))" />
            {/* live traffic rides the rails */}
            {pulses.map((p) => (
              <circle key={p.key} r="0.8" fill={ISLE_INK[TEAMS.find((x) => x.id === p.teamId)!.world]} stroke="hsl(var(--card))" strokeWidth="0.18">
                <animateMotion dur="2.3s" repeatCount="1" path={p.d} />
              </circle>
            ))}
          </svg>
          <div className="absolute t-mono" style={{ left: `${HUB.x}%`, top: `${HUB.y}%`, transform: "translate(-50%, 34px)", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "hsl(var(--foreground))" }}>THE&nbsp;WIRE</div>

          {TEAMS.map((t) => {
            const p = ISLANDS[t.id];
            const on = t.id === cur.id;
            const fresh = lastSeen[t.id] && now - lastSeen[t.id] < 5 * 60 * 1000;
            const ink = ISLE_INK[t.world];
            return (
              <div key={t.id} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)" }}>
                <button
                  onClick={() => { if (!moved.current) onPick(t); }}
                  onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(t.id)} onBlur={() => setHover(null)}
                  aria-pressed={on} title={`${t.id} · ${t.name}`}
                  className={`grid place-items-center rounded-full border transition-transform hover:scale-110 ${fresh && !on ? "pulse-ring" : ""}`}
                  style={{
                    width: 44, height: 44, background: "hsl(var(--card))",
                    borderColor: on || hover === t.id ? "hsl(var(--primary))" : ink,
                    borderWidth: on ? 3 : 2,
                    boxShadow: "var(--shadow-2)",
                    color: ink,
                  }}>
                  <Motif id={t.id} className="h-5 w-5" />
                  <span className="absolute" style={{ top: 46, fontFamily: "var(--font-serif)", fontWeight: 800, fontSize: 12, color: on || hover === t.id ? "hsl(var(--primary))" : ink }}>{t.id}</span>
                </button>
                {(hover === t.id || on) && (
                  <div className="absolute surface px-2.5 py-1.5 whitespace-nowrap" style={{ top: 64, left: "50%", transform: "translateX(-50%)", zIndex: 5, borderTop: "3px solid hsl(var(--primary))" }}>
                    <b style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem" }}>{t.id} · {t.name}</b>
                    <div className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>{t.tagline}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-3 sm:px-4 pb-3 t-small t-mono truncate rule-single pt-2" style={{ color: "hsl(var(--muted-fg))" }} aria-live="polite">
        {latest ? <>— {String(latest.team).slice(0, 2)} {latest.from}→{latest.to} [{latest.phase}] · {latest.msg}</> : "— wire quiet — press Run ALL"}
      </div>
    </div>
  );
}
