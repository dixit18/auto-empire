"use client";
import { useState } from "react";
import { Card, Chip } from "./ui";
import type { Log } from "./KpiStrip";

/* Human gate: publish / spend / outreach only. Approvals write back to the bus. */
export default function Approvals({ logs, onApproved }: { logs: Log[]; onApproved: () => void }) {
  const [acked, setAcked] = useState<Set<string>>(new Set());
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const pending = logs.filter((l) => l.status === "needs-approval" && !acked.has(`${l.ts}-${l.msg}`)).slice(0, 5);

  async function approve(l: Log) {
    const k = `${l.ts}-${l.msg}`;
    setBusyKey(k);
    try {
      await fetch("/api/approve", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: l.team, msg: l.msg }),
      });
      setAcked((s) => new Set(s).add(k));
      onApproved();
    } finally { setBusyKey(null); }
  }

  if (!pending.length)
    return (
      <Card>
        <div className="flex items-center gap-2"><h2 className="t-h2">Approvals</h2><Chip tone="live">clear</Chip></div>
        <p className="t-small mt-1" style={{ color: "hsl(var(--muted-fg))" }}>
          Nothing waiting. Only public posts, spend, and outreach pause here — building continues regardless.
        </p>
      </Card>
    );
  return (
    <Card>
      <div className="flex items-center gap-2"><h2 className="t-h2">Approvals</h2><Chip tone="warn">{pending.length} waiting</Chip></div>
      <ul className="mt-2 space-y-2">
        {pending.map((l) => {
          const k = `${l.ts}-${l.msg}`;
          return (
            <li key={k} className="surface-2 px-2.5 py-2 t-small flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate"><b className="t-mono">{String(l.team).slice(0, 2)}</b> · {l.msg}</span>
              <button className={`btn btn-primary ${busyKey === k ? "loading" : ""}`} disabled={busyKey === k}
                style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }} onClick={() => approve(l)}>Approve</button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
