"use client";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState, SkeletonRows, EASE } from "./ui";
import type { Log } from "./KpiStrip";

const TONE: Record<string, string> = {
  started: "hsl(var(--primary))", progress: "hsl(var(--muted-fg))",
  done: "hsl(var(--success))", "needs-approval": "hsl(var(--warn))", blocked: "hsl(var(--danger))",
};

/* Vercel progressive disclosure: summary row up top, detail inline. Skeleton → empty → rows. */
export default function LogFeed({ logs, loading, onRunAll }: { logs: Log[]; loading: boolean; onRunAll: () => void }) {
  if (loading && logs.length === 0) return <SkeletonRows n={6} />;
  if (logs.length === 0)
    return (
      <EmptyState title="No bus events yet" body="The agent bus is empty. Press Run ALL and every master will log its next task here."
        action={<button className="btn btn-primary" onClick={onRunAll}>⚡ Run ALL now</button>} />
    );
  return (
    <ol className="space-y-1.5" aria-live="polite">
      <AnimatePresence initial={false}>
        {logs.map((l, i) => (
          <motion.li key={`${l.ts}-${i}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="surface-2 px-2.5 py-2 flex items-baseline gap-2">
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: 99, background: TONE[l.status] ?? TONE.progress, flexShrink: 0, alignSelf: "center" }} />
            <span className="t-mono shrink-0" style={{ fontSize: "0.7rem", color: "hsl(var(--muted-fg))" }}>{String(l.ts).slice(0, 19)}</span>
            <span className="t-small min-w-0 flex-1">
              <b className="t-mono" style={{ fontSize: "0.75rem" }}>{String(l.team).slice(0, 2)}</b>{" "}
              <span style={{ color: "hsl(var(--muted-fg))" }}>{l.from}→{l.to} · {l.phase}</span>{" "}
              <span className="block truncate">{l.msg}</span>
            </span>
            <span className="chip ml-auto shrink-0 hidden sm:inline-flex">{l.status}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}
