"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AgentGraph from "@/components/AgentGraph";
import LogFeed from "@/components/LogFeed";
import Approvals from "@/components/Approvals";
import { Button, Card, Chip } from "@/components/ui";
import { Motif } from "@/components/motifs";
import type { Team } from "@/lib/teams";
import type { Log } from "@/components/KpiStrip";

export default function TeamView({ team }: { team: Team }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<any>(null);

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

  return (
    <div className="space-y-4">
      <div className={`relative overflow-hidden rounded-xl border p-4 sm:p-5 world-${team.world}-glow`}>
        <Link href="/" className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>← All worlds</Link>
        <div className="mt-2 flex items-center gap-3">
          <span className="surface grid place-items-center shrink-0" style={{ width: 60, height: 60, borderRadius: 16 }}>
            <Motif id={team.id} className="h-10 w-10" />
          </span>
          <div className="min-w-0">
            <h1 className="t-display truncate" style={{ fontSize: "clamp(1.4rem,1rem+2vw,2rem)" }}>{team.id} · {team.name}</h1>
            <p className="t-body" style={{ color: "hsl(var(--muted-fg))" }}>{team.tagline}</p>
          </div>
          <span className="ml-auto shrink-0 hidden sm:block"><Chip>{team.world} world</Chip></span>
        </div>
        <p className="t-small mt-2" style={{ color: "hsl(var(--muted-fg))" }}>
          👑 {team.master} · {team.industry} · <span className="t-num">{team.price}</span> · crew: {team.crew.join(" · ")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button loading={busy} onClick={run}>▶ Run next task</Button>
          <Button variant="ghost" onClick={refresh}>↻ Refresh</Button>
        </div>
        {state && (
          <p className="t-small t-mono mt-2" style={{ color: "hsl(var(--muted-fg))" }}>
            phase <b style={{ color: "hsl(var(--primary))" }}>{state.phase}</b> · task {state.taskIndex}/3 · {state.status} · next: {state.nextTask}
          </p>
        )}
      </div>

      <Card>
        <h2 className="t-h2 mb-3">Who talks to whom — live thought path</h2>
        <AgentGraph team={team} logs={logs} />
      </Card>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
        <Card className="min-w-0">
          <h2 className="t-h2 mb-3">Bus events for {team.id}</h2>
          <div className="max-h-[50vh] overflow-auto pr-1">
            <LogFeed logs={logs} loading={loading} onRunAll={run} />
          </div>
        </Card>
        <div className="min-w-0"><Approvals logs={logs} onApproved={refresh} /></div>
      </div>
    </div>
  );
}
