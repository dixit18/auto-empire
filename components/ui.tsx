"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* Button — all six microstates: default, hover, focus, active, disabled, loading */
export function Button({
  children, variant = "primary", loading, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost"; loading?: boolean }) {
  return (
    <button {...rest} disabled={rest.disabled || loading}
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${loading ? "loading" : ""} ${rest.className ?? ""}`}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`surface p-4 ${className}`}>{children}</div>;
}

export function Chip({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "live" | "warn" }) {
  const style: React.CSSProperties =
    tone === "live"
      ? { background: "hsl(var(--success) / .14)", color: "hsl(var(--success))", borderColor: "hsl(var(--success) / .35)" }
      : tone === "warn"
        ? { background: "hsl(var(--warn) / .14)", color: "hsl(var(--warn))", borderColor: "hsl(var(--warn) / .35)" }
        : {};
  return <span className="chip" style={style}>{children}</span>;
}

export function KpiCard({ label, value, sub, spark }: { label: string; value: string; sub: string; spark?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}
      className="surface p-3 sm:p-4">
      <div className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>{label}</div>
      <div className="t-num" style={{ fontSize: "1.65rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15 }}>{value}</div>
      <div className="t-small t-num" style={{ color: "hsl(var(--muted-fg))" }}>{sub}{spark ? ` · ${spark}` : ""}</div>
    </motion.div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="surface-2 p-6 text-center">
      <div className="t-h2">{title}</div>
      <p className="t-small mt-1" style={{ color: "hsl(var(--muted-fg))" }}>{body}</p>
      {action && <div className="mt-3 flex justify-center">{action}</div>}
    </div>
  );
}

export function SkeletonRows({ n = 5 }: { n?: number }) {
  return (
    <div className="space-y-2" aria-label="Loading">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 44, opacity: 1 - i * 0.12 }} />
      ))}
    </div>
  );
}
