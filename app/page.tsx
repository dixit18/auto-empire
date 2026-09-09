"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ThemeBar from "@/components/ThemeBar";
const World3D = dynamic(() => import("@/components/World3D"), {
  ssr: false,
  loading: () => <div className="surface p-6"><div className="t-kicker">§ 01 — The World, in 3D</div><div className="skeleton mt-2" style={{ height: 380 }} /></div>,
});
import TeamCard from "@/components/TeamCard";
import KpiStrip, { type Log } from "@/components/KpiStrip";
import LogFeed from "@/components/LogFeed";
import { Button, Card, Chip } from "@/components/ui";
import Approvals from "@/components/Approvals";
import NeedsFromYou from "@/components/NeedsFromYou";
import Theses from "@/components/Theses";
import LiveMinds from "@/components/LiveMinds";
import SideRail from "@/components/SideRail";
import { Kinetic, Reveal } from "@/components/Motion";
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
  const alerts = logs.filter((l) => l.status === "needs-approval").length;
  const statusOf = (t: Team) => {
    const s = states[t.id];
    if (!s) return "…";
    if (s.status === "DONE_ALL") return "DONE";
    return `${s.phase} · ${s.taskIndex}/3`;
  };

  return (
    <div className="min-h-screen">
      {/* nameplate */}
      <header className="sticky top-0 z-20 border-b" style={{ background: "hsl(var(--background) / .92)", backdropFilter: "blur(12px)" }}>
        <div className="mx-auto max-w-[1400px] px-3 sm:px-5 pt-2 flex items-end gap-3">
          <span className="t-small t-mono hidden sm:block pb-2" style={{ color: "hsl(var(--muted-fg))" }}>Vol. VII — Sep 2026</span>
          <span className="mx-auto text-center font-extrabold" style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", letterSpacing: "-0.02em", lineHeight: 1 }}>
            The Empire <span style={{ color: "hsl(var(--primary))" }}>·</span> <span className="italic font-medium">Agent World</span>
          </span>
          <span className="flex items-center gap-2 pb-1.5">
            <span className="barcode hidden md:block" style={{ width: 64, height: 22 }} aria-hidden />
            <ThemeBar />
          </span>
        </div>
        <div className="rule-double mx-3 sm:mx-5" />
        <nav className="mx-auto max-w-[1400px] px-3 sm:px-5 py-1.5 flex gap-4 t-small font-bold" aria-label="Sections"
          style={{ color: "hsl(var(--muted-fg))" }}>
          <a href="#world">The World</a><a href="#numbers">By the Numbers</a><a href="#newsroom">Newsroom</a><a href="#issues">Coming Issues</a>
          <span className="ml-auto hidden sm:inline"><Chip tone="live"><span aria-hidden>●</span> LIVE</Chip></span>
        </nav>
      </header>

      <div className="mx-auto max-w-[1500px] px-3 sm:px-5 py-4 sm:py-6 grid gap-5 lg:grid-cols-[244px_minmax(0,1fr)] items-start">
        <aside className="hidden lg:block sticky top-[104px] surface p-3" aria-label="Newsroom rail">
          <SideRail cur={cur} onPick={(t) => { setCur(t); setWorld(t.world); }} statusOf={statusOf} alerts={alerts} />
        </aside>
        <main className="min-w-0 space-y-6">
        <div className="marquee overflow-hidden rule-single rule-double border rounded" aria-hidden={false} aria-label="Latest wire">
          <div className="marquee-track t-small t-mono py-1.5" style={{ width: "max-content", color: "hsl(var(--muted-fg))" }}>
            {[0, 1].map((k) => (
              <span key={k}>
                {logs.slice(0, 8).map((l, i) => (
                  <span key={i}> — {String(l.team).slice(0, 2)} {l.from}→{l.to}: {l.msg.slice(0, 64)} </span>
                ))}
                {logs.length === 0 && <span> — wire warming up </span>}
              </span>
            ))}
          </div>
        </div>
        {/* cover story */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-end">
          <div>
            <div className="t-kicker">The Cover Story</div>
            <Kinetic text="Eleven crews. One newsroom." className="t-display mt-1" />
            <p className="t-body dropcap mt-3 max-w-prose" style={{ color: "hsl(var(--muted-fg))" }}>
              Each company in this empire keeps a master agent and four workers on a phase-wise plan — from validation
              through scale — with no waiting between phases. What follows is the living record: every island below files
              to one wire, and this page prints it as it happens. Open any island to enter its world.
            </p>
            <p className="t-small t-mono mt-2" style={{ color: "hsl(var(--muted-fg))" }}>
              Reported by the agents themselves · Dateline: the bus · {logs.length} dispatches on record
            </p>
          </div>
          <div className="surface p-4">
            <div className="t-kicker">Press actions</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button loading={busy} onClick={() => run(cur.id)}>▶ Run {cur.id}</Button>
              <Button variant="ghost" disabled={busy} onClick={() => run(undefined, true)}>⚡ Run ALL</Button>
              <Button variant="ghost" onClick={refresh}>↻ Refresh</Button>
            </div>
            <p className="t-small t-mono mt-2" style={{ color: "hsl(var(--muted-fg))" }}>writes STATE.json + HANDOFF.md + _bus/log.jsonl</p>
          </div>
        </section>

        <Reveal><section id="world" className="scroll-mt-24">
          <World3D logs={logs} cur={cur} onPick={(t) => { setCur(t); setWorld(t.world); }} />
        </section></Reveal>

        <Reveal><section id="numbers" className="scroll-mt-24">
          <div className="t-kicker mb-2">§ 02 — By the Numbers</div>
          <KpiStrip logs={logs} teamCount={TEAMS.length} />
        </section></Reveal>

        <Reveal><section className="scroll-mt-24">
          <LiveMinds logs={logs} />
        </section></Reveal>

        <section id="newsroom" className="grid gap-3 lg:grid-cols-[264px_minmax(0,1fr)_340px] items-start scroll-mt-24">
          <nav aria-label="Teams" className="lg:hidden min-w-0">
            <div className="t-kicker mb-2 hidden lg:block">§ 03 — Desks</div>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 -mx-3 px-3 lg:mx-0 lg:px-0"
              style={{ scrollSnapType: "x mandatory" }}>
              {TEAMS.map((t) => (
                <div key={t.id} className="min-w-[240px] sm:min-w-[280px] lg:min-w-0" style={{ scrollSnapAlign: "start" }}>
                  <TeamCard team={t} active={t.id === cur.id} status={statusOf(t)} onPick={() => { setCur(t); setWorld(t.world); }} />
                </div>
              ))}
            </div>
          </nav>

          <div className="min-w-0">
            <div className="t-kicker mb-2">§ 03 — The Wire, live</div>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="t-h2">What every agent is doing</h2>
                {busy && <Chip tone="warn">running…</Chip>}
              </div>
              <div className="max-h-[60vh] lg:max-h-[560px] overflow-auto pr-1">
                <LogFeed logs={logs} loading={loading} onRunAll={() => run(undefined, true)} />
              </div>
            </Card>
          </div>

          <aside className="space-y-3 lg:sticky lg:top-[104px] min-w-0" aria-label="Selected team">
            <Card>
              <div className="flex items-center gap-3">
                <span className="surface grid place-items-center shrink-0" style={{ width: 56, height: 56, borderRadius: 10, color: "hsl(var(--foreground))" }}>
                  <Motif id={cur.id} className="h-9 w-9" />
                </span>
                <div className="min-w-0">
                  <div className="t-kicker">Story № {cur.id}</div>
                  <h2 className="t-h2 truncate">{cur.name}</h2>
                </div>
              </div>
              <p className="t-small mt-2 italic" style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem" }}>“{cur.tagline}”</p>
              <p className="t-small mt-1" style={{ color: "hsl(var(--muted-fg))" }}>
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
              <Link href={`/${cur.dir}`} className="btn btn-ghost mt-3 w-full justify-center" style={{ fontSize: "0.82rem" }}>
                Enter {cur.id} world →
              </Link>
            </Card>
            <Approvals logs={logs} onApproved={refresh} />
            <Card>
              <div className="t-kicker" id="issues">§ 04 — Coming issues</div>
              <ul className="mt-2 space-y-2">
                {FUTURE_IDEAS.map((f) => (
                  <li key={f.t} className="t-small rule-single pt-2">
                    <b style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem" }}>{f.t}</b>
                    <span className="block" style={{ color: "hsl(var(--muted-fg))" }}>{f.d}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <div className="t-kicker">Colophon</div>
              <p className="t-small mt-1" style={{ color: "hsl(var(--muted-fg))" }}>
                Set in Newsreader & Inter. Printed on pixels. New model joining? Read <code className="t-mono">empire/_system/BOOTSTRAP.md → STATE.json → HANDOFF.md</code>,
                then <code className="t-mono">python runner/orchestrator.py --auto</code>.
              </p>
            </Card>
          </aside>
        </section>

        <section id="wanted" className="scroll-mt-24">
          <NeedsFromYou />
        </section>

        <section className="scroll-mt-24">
          <Theses />
        </section>
        </main>
      </div>
    </div>
  );
}
