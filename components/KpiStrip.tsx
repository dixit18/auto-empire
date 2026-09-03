"use client";
import { KpiCard } from "./ui";

export type Log = { ts: string; team: string; from: string; to: string; phase: string; msg: string; status: string };

/* Stripe discipline: max 4 KPIs above the fold, one number + one comparison each. */
export default function KpiStrip({ logs, teamCount }: { logs: Log[]; teamCount: number }) {
  const done = logs.filter((l) => l.status === "done").length;
  const phases = new Set(logs.map((l) => `${String(l.team).slice(0, 2)}:${l.phase}`)).size;
  const last = logs[0];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3" role="region" aria-label="Empire metrics">
      <KpiCard label="Teams live" value={String(teamCount)} sub="10 industries" spark="all phases" />
      <KpiCard label="Bus events" value={String(logs.length)} sub={last ? `latest ${String(last.ts).slice(0, 8)}` : "press Run ALL"} spark={last ? String(last.phase) : undefined} />
      <KpiCard label="Tasks done" value={String(done)} sub="worker → master" spark="compounding" />
      <KpiCard label="Team × phases" value={String(phases)} sub="coverage P0–P3" spark="no-wait" />
    </div>
  );
}
