"use client";
import { useCallback, useEffect, useState } from "react";
import ThemeBar from "@/components/ThemeBar";
import OpsHero from "@/components/OpsHero";
import TeamCard from "@/components/TeamCard";
import KpiStrip, { type Log } from "@/components/KpiStrip";
import LogFeed from "@/components/LogFeed";
import { Button, Card, Chip } from "@/components/ui";
import Approvals from "@/components/Approvals";
import { Motif } from "@/components/motifs";
import { TEAMS, FUTURE_IDEAS, type Team } from "@/lib/teams";

type TeamState = { phase: string; taskIndex: number; status: string; nextTask?: string; lastFile?: string; updated?: string };

export default function Page() {
  const [world, setWorld] = useState("forest");
  const [cur, setCur] = useState<Team>(TEAMS[4]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [states, setStates] = useState<Record<string, TeamState>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.documentElement.setAttribute("data-world", world); }, [world]);

  const refresh = useCallback(async () => {
    try {
      const [lr, tr] = await Promise.all([
        fetch("/api/logs", { cache: "no-store" }),
        fetch("/api/teams", { cache: "no-store" }),
      ]);
      const lj = await lr.json();
      const tj = await tr.json();
      if (Array.isArray(lj.logs)) setLogs(lj.logs);
      if (tj.live?.per) {
        const m: Record<string, TeamState> = {};
        for (const [dir, s] of Object.entries<any>(tj.live.per)) {
          const id = TEAMS.find((t) => t.dir === dir)?.id;
          if (id) m[id] = s;
        }
        setStates(m);
      }
    } catch { /* offline → keep last known */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  async function run(teamId?: string, autoAll?: boolean) {
    setBusy(true);
    try {
      await fetch("/api/advance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: teamId ?? cur.id, autoAll }),
      });
      await refresh();
    } finally { setBusy(false); }
  }

  const st: TeamState | undefined = states[cur.id];
  const statusOf = (t: Team) => {
    const s = states[t.id];
    if (!s) return "…";
    if (s.status === "DONE_ALL") return "DONE";
    return `${s.phase} · ${s.taskIndex}/3`;
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b" style={{ background: "hsl(var(--background) / .85)", backdropFilter: "blur(12px)" }}>
        <div className="mx-auto max-w-[1400px] px-3 sm:px-5 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="min-w-0">
              <div className="font-extrabold truncate" style={{ letterSpacing: "-0.03em" }}>Auto Empire OS</div>
              <div className="t-small truncate hidden sm:block" style={{ color: "hsl(var(--muted-fg))" }}>10 agent companies · one command deck</div>
            </div>
            <Chip tone="live"><span aria-hidden>●</span> LIVE</Chip>
          </div>
          <div className="ml-auto"><ThemeBar world={world} setWorld={setWorld} /></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-3 sm:px-5 py-4 sm:py-6 space-y-4">
        <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-stretch">
          <div className="surface p-4 sm:p-6 flex flex-col justify-center gap-3">
            <h1 className="t-display">Sit back. The teams keep building.</h1>
            <p className="t-body max-w-prose" style={{ color: "hsl(var(--muted-fg))" }}>
              Each company has a master agent and four workers running phase-wise plans — P0 validation through P3 scale —
              with no waiting between phases. Press run and watch the bus.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button loading={busy} onClick={() => run(cur.id)}>▶ Run {cur.id} next task</Button>
              <Button variant="ghost" disabled={busy} onClick={() => run(undefined, true)}>⚡ Run ALL — no wait</Button>
              <Button variant="ghost" onClick={refresh}>↻ Refresh</Button>
            </div>
            <p className="t-small t-mono" style={{ color: "hsl(var(--muted-fg))" }}>writes STATE.json + HANDOFF.md + _bus/log.jsonl</p>
          </div>
          <OpsHero logs={logs} running={!loading} />
        </section>

        <KpiStrip logs={logs} teamCount={TEAMS.length} />

        <section className="grid gap-3 lg:grid-cols-[264px_minmax(0,1fr)_340px] items-start">
          <nav aria-label="Teams" className="lg:sticky lg:top-[68px]">
            <h2 className="t-small font-bold mb-2 hidden lg:block" style={{ color: "hsl(var(--muted-fg))" }}>TEAMS</h2>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 -mx-3 px-3 lg:mx-0 lg:px-0"
              style={{ scrollSnapType: "x mandatory" }}>
              {TEAMS.map((t) => (
                <div key={t.id} className="min-w-[240px] sm:min-w-[280px] lg:min-w-0" style={{ scrollSnapAlign: "start" }}>
                  <TeamCard team={t} active={t.id === cur.id} status={statusOf(t)} onPick={() => { setCur(t); setWorld(t.world); }} />
                </div>
              ))}
            </div>
          </nav>

          <section aria-label="Live agent activity" className="min-w-0">
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="t-h2">Live — what every agent is doing</h2>
                {busy && <Chip tone="warn">running…</Chip>}
              </div>
              <div className="max-h-[60vh] lg:max-h-[560px] overflow-auto pr-1">
                <LogFeed logs={logs} loading={loading} onRunAll={() => run(undefined, true)} />
              </div>
            </Card>
          </section>

          <aside className="space-y-3 lg:sticky lg:top-[68px] min-w-0" aria-label="Selected team">
            <Card>
              <div className={`relative overflow-hidden rounded-[10px] border mb-3 world-${cur.world}-glow`}>
                <div className="flex items-center gap-3 p-3">
                  <span className="surface grid place-items-center shrink-0" style={{ width: 56, height: 56, borderRadius: 14, color: "hsl(var(--foreground))" }}>
                    <Motif id={cur.id} className="h-9 w-9" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="t-h2 truncate">{cur.id} · {cur.name}</h2>
                    <p className="t-small truncate" style={{ color: "hsl(var(--muted-fg))" }}>{cur.tagline}</p>
                  </div>
                  <span className="ml-auto shrink-0"><Chip>{cur.world}</Chip></span>
                </div>
              </div>
              <p className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>
                👑 {cur.master} · {cur.industry} · <span className="t-num">{cur.price}</span>
              </p>
              <div className="surface-2 px-2.5 py-2 mt-2 t-small t-mono" style={{ color: "hsl(var(--muted-fg))" }}>
                {st ? (<>phase <b style={{ color: "hsl(var(--primary))" }}>{st.phase}</b> · task {st.taskIndex}/3 · {st.status}<br />next: {st.nextTask ?? "—"}{st.updated ? <><br />updated {String(st.updated).slice(0, 19).replace("T", " ")}</> : null}</>) : "reading live state…"}
              </div>
              <ol className="mt-2 space-y-1.5">
                {cur.phases.map((p, i) => (
                  <li key={p} className="surface-2 px-2.5 py-2 t-small flex gap-2">
                    <span className="t-mono" style={{ color: "hsl(var(--primary))" }}>P{i}</span>
                    <span>{p} <span style={{ color: "hsl(var(--muted-fg))" }}>→ auto-next</span></span>
                  </li>
                ))}
              </ol>
              <p className="t-small t-num mt-2" style={{ color: "hsl(var(--muted-fg))" }}>KPI · {cur.kpi.join(" · ")}</p>
            </Card>
            <Approvals logs={logs} onApproved={refresh} />
            <Card>
              <h2 className="t-h2">Future picks</h2>
              <ul className="mt-2 space-y-2">
                {FUTURE_IDEAS.map((f) => (
                  <li key={f.t} className="t-small">
                    <b>{f.t}</b>
                    <span className="block" style={{ color: "hsl(var(--muted-fg))" }}>{f.d}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="t-h2">New model pickup</h2>
              <p className="t-small mt-1" style={{ color: "hsl(var(--muted-fg))" }}>
                Read <code className="t-mono">empire/_system/BOOTSTRAP.md → STATE.json → HANDOFF.md</code>,
                then <code className="t-mono">python runner/orchestrator.py --auto</code>. UI and runner share the bus — nothing restarts.
              </p>
            </Card>
          </aside>
        </section>
      </main>
    </div>
  );
}
