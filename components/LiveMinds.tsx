"use client";
import { useEffect, useMemo, useState } from "react";
import { ACTIVE_TEAMS } from "@/lib/teams";
import { teamThoughts, ago } from "@/lib/thoughts";
import type { Log } from "./KpiStrip";

function useNow(stepMs = 15000) {
  const [n, setN] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setN(Date.now()), stepMs);
    return () => clearInterval(id);
  }, [stepMs]);
  return n;
}

/* Types out the freshest thought in the empire, letter by letter. */
function TypeText({ text }: { text: string }) {
  const [n, setN] = useState(0);
  const reduced = useMemo(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  useEffect(() => {
    setN(0);
    if (reduced) { setN(text.length); return; }
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) { clearInterval(id); return v; }
        return v + 3;
      });
    }, 24);
    return () => clearInterval(id);
  }, [text, reduced]);
  return <span>{text.slice(0, n)}{n < text.length && <span aria-hidden className="t-caret">▍</span>}</span>;
}

/* LIVE MINDS — what every master is thinking right now, verbatim from the bus. */
export default function LiveMinds({ logs }: { logs: Log[] }) {
  useNow();
  const freshest = logs[0];
  return (
    <div>
      <div className="t-kicker mb-1">§ Live minds — every agent, thinking aloud</div>
      {freshest && (
        <div className="surface p-3 sm:p-4 mb-2" style={{ borderTop: "3px solid hsl(var(--primary))" }}>
          <div className="t-small font-extrabold" style={{ letterSpacing: "0.08em", textTransform: "uppercase", color: "hsl(var(--primary))" }}>
            Freshest thought · {String(freshest.team).slice(0, 2)} · {ago(freshest.ts)}
          </div>
          <p className="t-body mt-1 t-mono" style={{ minHeight: "2.6em" }}>
            <TypeText key={`${freshest.ts}|${freshest.msg}`} text={`${freshest.from} → ${freshest.to}: ${freshest.msg}`} />
          </p>
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {ACTIVE_TEAMS.map((t) => {
          const th = teamThoughts(t, logs);
          return (
            <div key={t.id} className="surface-2 px-2.5 py-2 flex gap-2 min-w-0">
              <span aria-hidden className={th.live ? "pulse-ring" : ""}
                style={{ width: 9, height: 9, borderRadius: 99, marginTop: 5, flexShrink: 0,
                  background: th.live ? "hsl(var(--success))" : "hsl(var(--border-strong))" }} />
              <div className="min-w-0">
                <div className="t-small">
                  <b className="t-mono">{t.id}</b> <b>{th.master.who}</b>{" "}
                  <span style={{ color: "hsl(var(--muted-fg))" }}>{th.master.ts ? ago(th.master.ts) : "idle"}</span>
                </div>
                <p className="t-small truncate" style={{ color: "hsl(var(--muted-fg))" }}>{th.master.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
