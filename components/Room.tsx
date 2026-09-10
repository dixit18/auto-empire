"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui";
import type { Team } from "@/lib/teams";
import type { Log } from "./KpiStrip";

const LIVE_MS = 120000;

/* The Room — multiplayer mission control v0. Presence, live session,
   and a composer that puts YOUR words into the agents' bus. */
export default function Room({ team }: { team: Team }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [name, setName] = useState("");
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const r = await fetch("/api/logs", { cache: "no-store" });
      const j = await r.json();
      if (Array.isArray(j.logs)) setLogs(j.logs.filter((l: Log) => String(l.team).startsWith(team.id)));
    } catch {}
  }
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  async function relay() {
    if (!msg.trim()) return;
    setBusy(true);
    try {
      const r = await fetch("/api/relay", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: team.dir, from: name.trim() || "HUMAN", to: to || "MASTER", msg }),
      });
      if ((await r.json()).ok) { setSent(true); setMsg(""); refresh(); setTimeout(() => setSent(false), 4000); }
    } finally { setBusy(false); }
  }

  const members = [team.master, ...team.crew];
  const lastBy = (who: string) => logs.find((l) => l.from === who || l.to === who || l.from === "WORKER" || l.to === "WORKER");
  const recent = logs[0] && Date.now() - Date.parse(logs[0].ts) < LIVE_MS;

  return (
    <div className="space-y-3">
      <div className="surface p-3 sm:p-4">
        <div className="flex items-baseline gap-2">
          <span className="t-kicker">Room 01 — dogfood room</span>
          <span className="chip ml-auto" style={recent
            ? { background: "hsl(var(--success) / .14)", color: "hsl(var(--success))", borderColor: "hsl(var(--success) / .35)" } : {}}>
            {recent ? "● session live" : "○ quiet"}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {members.map((m) => {
            const last = m === team.master ? logs[0] : lastBy(m);
            const live = !!last && Date.now() - Date.parse(last.ts) < LIVE_MS;
            return (
              <span key={m} className="chip" title={last ? `${m}: ${last.msg.slice(0, 80)}` : `${m}: standing by`}
                style={live ? { background: "hsl(var(--success) / .12)", color: "hsl(var(--success))" } : {}}>
                <span aria-hidden style={{ width: 7, height: 7, borderRadius: 99, background: live ? "hsl(var(--success))" : "hsl(var(--border-strong))" }} />
                {m}
              </span>
            );
          })}
          <span className="chip" style={{ borderStyle: "dashed" }}>+ you</span>
        </div>
      </div>

      <div className="surface p-3 sm:p-4">
        <div className="t-kicker mb-2">Speak into the room</div>
        <div className="grid gap-2 sm:grid-cols-[140px_160px_1fr]">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
            className="surface-2 px-2.5 py-2 t-small" style={{ background: "hsl(var(--card))" }} aria-label="Your name" />
          <select value={to} onChange={(e) => setTo(e.target.value)} aria-label="Talk to"
            className="surface-2 px-2 py-2 t-small" style={{ background: "hsl(var(--card))" }}>
            <option value="">MASTER ({team.master})</option>
            {team.crew.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Redirect, question, decision…"
              className="flex-1 surface-2 px-2.5 py-2 t-small" style={{ background: "hsl(var(--card))" }} aria-label="Message"
              onKeyDown={(e) => e.key === "Enter" && relay()} />
            <Button loading={busy} onClick={relay}>Send ▸</Button>
          </div>
        </div>
        {sent && <p className="t-small mt-2" style={{ color: "hsl(var(--success))" }}>✓ On the wire — every agent (and the world map) sees it.</p>}
        <p className="t-small t-mono mt-1" style={{ color: "hsl(var(--muted-fg))" }}>writes straight to _bus/log.jsonl · validated · visible in ≤5s</p>
      </div>

      <div className="surface p-3 sm:p-4">
        <div className="t-kicker mb-2">Session — newest first</div>
        {logs.length === 0 && <p className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>Empty room. Say the first word above.</p>}
        <ol className="space-y-1.5 max-h-[320px] overflow-auto pr-1">
          {logs.slice(0, 12).map((l, i) => (
            <li key={`${l.ts}-${i}`} className="surface-2 px-2.5 py-2 t-small min-w-0">
              <b>{l.from}</b> <span style={{ color: "hsl(var(--muted-fg))" }}>→ {l.to} · {String(l.ts).slice(11, 19)}</span>
              <span className="block truncate" title={l.msg}>{l.msg}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
