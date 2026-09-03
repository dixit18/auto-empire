"use client";
import { motion } from "framer-motion";
import type { Team } from "@/lib/teams";
import { EASE } from "./ui";

const DOT: Record<string, string> = { forest: "#2f9e44", beach: "#0e9fd8", sunset: "#8b5cf6", lagoon: "#0d9488" };

/* Dense 56px row like Linear: id mono · name · master · KPI · status. Full keyboard support. */
export default function TeamCard({ team, active, onPick, status }: { team: Team; active: boolean; onPick: () => void; status?: string }) {
  const live = (status ?? "WORKING").toUpperCase();
  return (
    <motion.button
      initial={false} whileHover={{ x: 2 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.15, ease: EASE }}
      onClick={onPick} aria-pressed={active}
      className="w-full text-left rounded-[10px] border px-3 transition-colors"
      style={{
        minHeight: 60, display: "flex", alignItems: "center", gap: 10,
        background: active ? "hsl(var(--card))" : "transparent",
        borderColor: active ? "hsl(var(--primary))" : "hsl(var(--border))",
        boxShadow: active ? "var(--shadow-1)" : "none",
      }}>
      <span aria-hidden style={{ width: 8, height: 8, borderRadius: 99, background: DOT[team.world] ?? DOT.forest, flexShrink: 0 }} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="t-mono t-small" style={{ color: "hsl(var(--muted-fg))" }}>{team.id}</span>
          <span className="font-bold truncate" style={{ fontSize: "0.9rem", letterSpacing: "-0.01em" }}>{team.name}</span>
        </span>
        <span className="t-small truncate block" style={{ color: "hsl(var(--muted-fg))" }}>
          {team.master} · {team.industry} · <span className="t-num">{team.price}</span>
        </span>
      </span>
      <span className="t-mono hidden xl:block" style={{ fontSize: "0.72rem", color: live === "WORKING" ? "hsl(var(--success))" : "hsl(var(--muted-fg))" }}>
        ● {live}
      </span>
    </motion.button>
  );
}
