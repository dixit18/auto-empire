"use client";
import { motion } from "framer-motion";
import type { Team } from "@/lib/teams";
import type { Log } from "./KpiStrip";

function crewFor(team: Team, msg: string) {
  let h = 0;
  for (let i = 0; i < msg.length; i++) h = (h * 31 + msg.charCodeAt(i)) >>> 0;
  return team.crew[h % team.crew.length];
}

function nodeOf(team: Team, l: Log): string {
  if (l.from === "HUMAN" || l.to === "HUMAN") return "HUMAN";
  if (l.from === "MASTER" || l.to === "MASTER") {
    const other = l.from === "MASTER" ? l.to : l.from;
    if (other === "WORKER" || other === "WORKERS") return crewFor(team, l.msg);
    return other;
  }
  return crewFor(team, l.msg);
}

/* Who talks to whom: node map + thought-path timeline, all from real bus events. */
export default function AgentGraph({ team, logs }: { team: Team; logs: Log[] }) {
  const mine = logs.filter((l) => String(l.team).startsWith(team.id)).slice(0, 8);
  const latest = mine[0];
  const activeNode = latest ? nodeOf(team, latest) : null;

  const W = 340, H = 190;
  const pos: Record<string, { x: number; y: number; role: string }> = {
    HUMAN: { x: W / 2, y: 26, role: "approves" },
    MASTER: { x: W / 2, y: 96, role: team.master },
  };
  team.crew.forEach((c, i) => {
    pos[c] = { x: 40 + i * ((W - 80) / 3), y: 162, role: "worker" };
  });

  const edgeKey = latest ? `${latest.from}>${latest.to}` : "";
  const edgeLive = (a: string, b: string) =>
    (latest?.from === a && latest?.to === b) || (latest?.from === b && latest?.to === a);

  const link = (a: string, b: string) => {
    const A = pos[a] ?? pos.MASTER, B = pos[b] ?? pos.MASTER;
    const live = edgeLive(a, b) || (latest && ((a === "MASTER" && nodeOf(team, latest) === b) || (b === "MASTER" && nodeOf(team, latest) === a)));
    return (
      <motion.line key={`${a}-${b}`} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
        stroke={live ? "hsl(var(--primary))" : "hsl(var(--border-strong))"}
        strokeWidth={live ? 2.2 : 1.2} strokeDasharray={live ? "5 4" : "none"}
        initial={false} animate={live ? { strokeDashoffset: [0, -18] } : {}}
        transition={live ? { duration: 1.1, repeat: Infinity, ease: "linear" } : {}} opacity={live ? 1 : 0.75} />
    );
  };

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* node map */}
      <div className="surface-2 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Agent map for team ${team.id}`}>
          {link("HUMAN", "MASTER")}
          {team.crew.map((c) => link("MASTER", c))}
          {(["HUMAN", "MASTER", ...team.crew] as string[]).map((n) => {
            const p = pos[n];
            const hot = n === activeNode || (n === "MASTER" && !!latest);
            const label = n === "MASTER" ? "MASTER" : n.length > 10 ? n.slice(0, 9) + "…" : n;
            return (
              <g key={`${edgeKey}-${n}`}>
                <circle cx={p.x} cy={p.y} r={n === "MASTER" ? 15 : 11}
                  fill={hot ? "hsl(var(--primary) / .18)" : "hsl(var(--card))"}
                  stroke={hot ? "hsl(var(--primary))" : "hsl(var(--border-strong))"} strokeWidth={hot ? 2.4 : 1.4} />
                <text x={p.x} y={p.y + 26} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="hsl(var(--foreground))">{label}</text>
              </g>
            );
          })}
        </svg>
        <p className="t-small px-1 pb-1" style={{ color: "hsl(var(--muted-fg))" }}>
          {latest ? <>last move: <b className="t-mono">{latest.from} → {latest.to}</b> [{latest.phase}]</> : "no events yet for this team"}
        </p>
      </div>

      {/* thought path */}
      <ol className="relative space-y-0" aria-label="Agent thought path">
        {mine.length === 0 && <li className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>Quiet here — press Run to wake this crew.</li>}
        {mine.map((l, i) => {
          const who = nodeOf(team, l);
          const isMaster = who === "MASTER" || l.from === "MASTER";
          return (
            <li key={`${l.ts}-${i}`} className="relative flex gap-2.5 pb-3 last:pb-0">
              {i < mine.length - 1 && (
                <span aria-hidden className="absolute top-8 bottom-0" style={{ left: 13, width: 2, background: "hsl(var(--border))" }} />
              )}
              <span aria-hidden className="grid shrink-0 place-items-center rounded-full border t-mono"
                style={{
                  width: 28, height: 28, fontSize: 10, fontWeight: 700,
                  background: isMaster ? "hsl(var(--primary) / .15)" : "hsl(var(--card))",
                  borderColor: isMaster ? "hsl(var(--primary))" : "hsl(var(--border-strong))",
                  color: isMaster ? "hsl(var(--primary))" : "hsl(var(--muted-fg))",
                }}>
                {who.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1 surface-2 px-2.5 py-2">
                <div className="flex items-baseline gap-2">
                  <b style={{ fontSize: "0.8rem" }}>{who}</b>
                  <span className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>{l.from} → {l.to} · {l.phase}</span>
                  <span className="t-mono ml-auto shrink-0" style={{ fontSize: "0.68rem", color: "hsl(var(--muted-fg))" }}>{String(l.ts).slice(11, 19)}</span>
                </div>
                <p className="t-small mt-0.5 break-words">{l.msg}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
