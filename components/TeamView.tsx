"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import AgentGraph from "@/components/AgentGraph";
import Vault from "@/components/Vault";
import LogFeed from "@/components/LogFeed";
import Approvals from "@/components/Approvals";
import { Button, Card, Chip } from "@/components/ui";
import { Motif } from "@/components/motifs";
import { TEAMS, type Team } from "@/lib/teams";
import { teamThoughts, ago } from "@/lib/thoughts";
import type { Log } from "@/components/KpiStrip";

const TeamEmblem3D = dynamic(() => import("@/components/TeamEmblem3D"), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ width: 96, height: 96, borderRadius: 16 }} />,
});

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "vault", label: "Vault" },
  { id: "activity", label: "Activity" },
  { id: "crew", label: "Crew" },
] as const;
type Tab = (typeof TABS)[number]["id"];

/* One organisation, one app: tabbed workspace with live state throughout. */
export default function TeamView({ team }: { team: Team }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<any>(null);
  const [tab, setTab] = useState<Tab>("overview");

  const refresh = useCallback(async () => {
    try {
      const [lr, tr] = await Promise.all([
        fetch("/api/logs", { cache: "no-store" }),
        fetch("/api/teams", { cache: "no-store" }),
      ]);
      const lj = await lr.json();
      const tj = await tr.json();
      if (Array.isArray(lj.logs)) setLogs(lj.logs.filter((l: Log) => String(l.team).startsWith(team.id)));
      setState(tj.live?.per?.[team.dir] ?? null);
    } catch { /* keep last known */ }
    finally { setLoading(false); }
  }, [team]);

  useEffect(() => {
    setTab("overview");
    setLoading(true);
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  async function run() {
    setBusy(true);
    try {
      await fetch("/api/advance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id }),
      });
      await refresh();
    } finally { setBusy(false); }
  }

  const idx = TEAMS.findIndex((t) => t.id === team.id);
  const prev = TEAMS[(idx + TEAMS.length - 1) % TEAMS.length];
  const next = TEAMS[(idx + 1) % TEAMS.length];
  const th = teamThoughts(team, logs);

  return (
    <div className="space-y-4">
      {/* app header */}
      <div className={`relative overflow-hidden rounded-xl border p-4 sm:p-5 world-${team.world}-glow`}>
        <div className="flex items-center gap-1.5 t-small">
          <Link href="/" style={{ color: "hsl(var(--muted-fg))" }}>All apps</Link>
          <span style={{ color: "hsl(var(--muted-fg))" }}>/</span>
          <b>{team.id}</b>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="surface grid place-items-center shrink-0" style={{ width: 56, height: 56, borderRadius: 14, color: "hsl(var(--foreground))" }}>
            <Motif id={team.id} className="h-9 w-9" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="t-display truncate" style={{ fontSize: "clamp(1.4rem,1rem+2vw,2rem)" }}>{team.id} · {team.name}</h1>
            <p className="t-body truncate" style={{ color: "hsl(var(--muted-fg))" }}>{team.tagline}</p>
          </div>
          <span className="shrink-0 hidden sm:block" style={{ width: 96, height: 96 }} aria-hidden>
            <TeamEmblem3D team={team} />
          </span>
        </div>
        <p className="t-small mt-2 flex flex-wrap items-center gap-2" style={{ color: "hsl(var(--muted-fg))" }}>
          <span>👑 {team.master} · {team.industry} · <span className="t-num">{team.price}</span></span>
          <Chip>{team.world} world</Chip>
          {state && <Chip tone={state.status === "DONE_ALL" ? "live" : "muted"}>{state.status === "DONE_ALL" ? "● live" : `${state.phase} ${state.taskIndex}/3`}</Chip>}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button loading={busy} onClick={run}>▶ Run next task</Button>
          <Button variant="ghost" onClick={refresh}>↻ Refresh</Button>
        </div>
      </div>

      {/* app tabs */}
      <div className="surface-2 flex p-1 gap-1 overflow-x-auto" role="tablist" aria-label={`${team.name} sections`}>
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all"
            style={tab === t.id
              ? { background: "hsl(var(--foreground))", color: "hsl(var(--background))" }
              : { color: "hsl(var(--muted-fg))" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
          <Card>
            <div className="t-kicker mb-1">Now</div>
            <p className="t-body t-mono">{th.master.text}</p>
            <p className="t-small mt-1" style={{ color: "hsl(var(--muted-fg))" }}>{th.master.ts ? ago(th.master.ts) : "idle"}</p>
            <div className="t-kicker mt-4 mb-1">Roadmap</div>
            <ol className="space-y-1.5">
              {team.phases.map((p, i) => (
                <li key={p} className="surface-2 px-2.5 py-2 t-small flex gap-2">
                  <span className="t-mono" style={{ color: "hsl(var(--primary))" }}>P{i}</span>
                  <span>{p} <span style={{ color: "hsl(var(--muted-fg))" }}>→ auto-next</span></span>
                </li>
              ))}
            </ol>
            <p className="t-small t-num mt-2" style={{ color: "hsl(var(--muted-fg))" }}>KPI · {team.kpi.join(" · ")}</p>
            {state && (
              <p className="t-small t-mono mt-1" style={{ color: "hsl(var(--muted-fg))" }}>
                phase <b style={{ color: "hsl(var(--primary))" }}>{state.phase}</b> · task {state.taskIndex}/3 · {state.status} · next: {state.nextTask}
              </p>
            )}
          </Card>
          <div className="min-w-0"><Approvals logs={logs} onApproved={refresh} /></div>
        </div>
      )}

      {tab === "vault" && <Vault team={team} />}

      {tab === "activity" && (
        <div className="space-y-3">
          <Card>
            <h2 className="t-h2 mb-3">Who talks to whom — live thought path</h2>
            <AgentGraph team={team} logs={logs} />
          </Card>
          <Card className="min-w-0">
            <h2 className="t-h2 mb-3">Bus events for {team.id}</h2>
            <div className="max-h-[50vh] overflow-auto pr-1">
              <LogFeed logs={logs} loading={loading} onRunAll={run} />
            </div>
          </Card>
        </div>
      )}

      {tab === "crew" && (
        <Card>
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="t-h2">Crew minds, right now</h2>
            {th.live && <span className="chip" style={{ background: "hsl(var(--success) / .14)", color: "hsl(var(--success))", borderColor: "hsl(var(--success) / .35)" }}>● live</span>}
          </div>
          <ul className="space-y-1.5">
            {[th.master, ...th.crew].map((m, i) => (
              <li key={`${m.who}-${i}`} className="surface-2 px-2.5 py-2 flex gap-2 min-w-0">
                <span aria-hidden className={m.live ? "pulse-ring" : ""}
                  style={{ width: 8, height: 8, borderRadius: 99, marginTop: 6, flexShrink: 0,
                    background: m.live ? "hsl(var(--success))" : "hsl(var(--border-strong))" }} />
                <div className="min-w-0">
                  <div className="t-small"><b>{m.who}</b> <span style={{ color: "hsl(var(--muted-fg))" }}>· {m.role}{m.ts ? ` · ${ago(m.ts)}` : ""}</span></div>
                  <p className="t-small break-words" style={{ color: "hsl(var(--muted-fg))" }}>{m.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="t-small mt-2" style={{ color: "hsl(var(--muted-fg))" }}>
            Full agent specs: <code className="t-mono">empire/{team.dir}/README.md</code> · handoff: <code className="t-mono">HANDOFF.md</code>
          </p>
        </Card>
      )}

      <nav className="surface p-3 flex items-center gap-2" aria-label="More worlds">
        <Link href={`/${prev.dir}`} className="btn btn-ghost" style={{ fontSize: "0.8rem" }}>← {prev.id} · {prev.name}</Link>
        <Link href="/" className="t-small mx-auto" style={{ color: "hsl(var(--muted-fg))" }}>All apps</Link>
        <Link href={`/${next.dir}`} className="btn btn-ghost" style={{ fontSize: "0.8rem" }}>{next.id} · {next.name} →</Link>
      </nav>
    </div>
  );
}
