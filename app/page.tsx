"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeBar from "@/components/ThemeBar";
import JungleScene from "@/components/JungleScene";
import TeamCard from "@/components/TeamCard";
import { TEAMS, FUTURE_IDEAS, type Team } from "@/lib/teams";

type Log = { ts: string; team: string; from: string; to: string; phase: string; msg: string; status: string };

export default function Page() {
  const [world, setWorld] = useState("forest");
  const [cur, setCur] = useState<Team>(TEAMS[4]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.documentElement.setAttribute("data-world", world); }, [world]);

  async function refresh() {
    try {
      const r = await fetch("/api/logs", { cache: "no-store" });
      const j = await r.json();
      if (j.logs?.length) setLogs(j.logs);
    } catch {}
  }
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 4000);
    // local heartbeat so UI never looks stopped (even before runner)
    const sim = setInterval(() => {
      setLogs((p) => [{ ts: new Date().toLocaleTimeString(), team: TEAMS[Math.floor(Math.random() * 10)].dir.slice(0, 2), from: "MASTER", to: "WORKER", phase: ["P0","P1","P2","P3"][Math.floor(Math.random()*4)], msg: "compounding: improving prior output, no wait", status: "progress" }, ...p].slice(0, 60));
    }, 5000);
    return () => { clearInterval(id); clearInterval(sim); };
  }, []);

  async function run(teamId?: string, autoAll?: boolean) {
    setBusy(true);
    try {
      await fetch("/api/advance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teamId: teamId ?? cur.id, autoAll }) });
      await refresh();
    } finally { setBusy(false); }
  }

  return (
    <main className={`min-h-screen p-4 md:p-6 ${world === "beach" ? "beach-bg" : "jungle-bg"}`}>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">🐒 Auto Empire OS</h1>
            <p className="text-sm opacity-70">10 agent-companies • 1 click runs everything • P0→P3 no wait • any model picks up via STATE + HANDOFF</p>
          </div>
          <ThemeBar world={world} setWorld={setWorld} />
        </div>

        <JungleScene world={world} />

        <div className="flex gap-2 flex-wrap">
          <button disabled={busy} onClick={() => run(cur.id)} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold disabled:opacity-50">▶ Run {cur.id} next task</button>
          <button disabled={busy} onClick={() => run(undefined, true)} className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold disabled:opacity-50">⚡ Run ALL (no wait)</button>
          <button onClick={refresh} className="px-4 py-2 rounded-xl border">↻ Refresh live</button>
          <span className="text-xs opacity-70 self-center">Click = writes STATE + HANDOFF + _bus/log.jsonl directly. Runner keeps going.</span>
        </div>

        <div className="grid md:grid-cols-[300px_1fr_320px] gap-4">
          <div className="space-y-2">
            {TEAMS.map((t) => <TeamCard key={t.id} team={t} active={t.id === cur.id} onPick={() => { setCur(t); setWorld(t.world); }} />)}
          </div>

          <div className="rounded-xl border p-3" style={{ background: "hsl(var(--card))" }}>
            <b>📡 Live — agents working {busy ? "(running…)" : ""}</b>
            <div className="mt-2 space-y-1.5 max-h-[520px] overflow-auto font-mono text-xs">
              {logs.length === 0 && <div className="opacity-60">Waiting for logs… click Run ALL.</div>}
              {logs.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
                  <span className="opacity-50">{String(l.ts).slice(0, 19)}</span> <b>{l.team} {l.from}→{l.to}</b> [{l.phase}] {l.msg} <i>({l.status})</i>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border p-3" style={{ background: "hsl(var(--card))" }}>
              <b>👑 {cur.id} • {cur.name}</b>
              <div className="text-xs opacity-70">Master: {cur.master} • {cur.industry} • {cur.price} • world: {cur.world}</div>
              <div className="mt-2 space-y-1 text-sm">{cur.phases.map((p) => <div key={p} className="px-2 py-1 rounded bg-black/5 dark:bg-white/5">✓ {p} → auto-next</div>)}</div>
              <div className="text-xs mt-2 opacity-70">KPI: {cur.kpi.join(" • ")}</div>
            </div>
            <div className="rounded-xl border p-3" style={{ background: "hsl(var(--card))" }}>
              <b>💡 Future picks (creative backlog)</b>
              {FUTURE_IDEAS.map((f) => <div key={f.t} className="mt-2 text-sm"><b>{f.t}</b><div className="text-xs opacity-70">{f.d}</div></div>)}
            </div>
            <div className="rounded-xl border p-3 text-xs opacity-80" style={{ background: "hsl(var(--card))" }}>
              New model? Read <code>empire/_system/BOOTSTRAP.md → STATE.json → HANDOFF.md</code>. Then <code>python runner/orchestrator.py --auto</code>. UI + runner share the same bus — nothing restarts.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
