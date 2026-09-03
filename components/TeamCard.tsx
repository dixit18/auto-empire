"use client";
import { motion } from "framer-motion";
import type { Team } from "@/lib/teams";
import { Motif } from "./motifs";
import { EASE } from "./ui";

/* Dense 64px row: motif · id mono · name + tagline · status. Full keyboard support. */
export default function TeamCard({ team, active, onPick, status }: { team: Team; active: boolean; onPick: () => void; status?: string }) {
  const live = (status ?? "WORKING").toUpperCase();
  return (
    <motion.button
      initial={false} whileHover={{ x: 2 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.15, ease: EASE }}
      onClick={onPick} aria-pressed={active}
      className="w-full text-left rounded-[10px] border px-3 transition-colors"
      style={{
        minHeight: 68, display: "flex", alignItems: "center", gap: 10,
        background: active ? "hsl(var(--card))" : "transparent",
        borderColor: active ? "hsl(var(--primary))" : "hsl(var(--border))",
        boxShadow: active ? "var(--shadow-1)" : "none",
      }}>
      <span className="surface-2 shrink-0 grid place-items-center" style={{ width: 40, height: 40, borderRadius: 10, color: "hsl(var(--foreground))" }}>
        <Motif id={team.id} className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="t-mono t-small" style={{ color: "hsl(var(--muted-fg))" }}>{team.id}</span>
          <span className="font-bold truncate" style={{ fontSize: "0.9rem", letterSpacing: "-0.01em" }}>{team.name}</span>
        </span>
        <span className="t-small truncate block" style={{ color: "hsl(var(--muted-fg))" }}>{team.tagline}</span>
      </span>
      <span className="t-mono hidden xl:block" style={{ fontSize: "0.72rem", color: live === "WORKING" ? "hsl(var(--success))" : "hsl(var(--muted-fg))" }}>
        ● {live}
      </span>
    </motion.button>
  );
}
