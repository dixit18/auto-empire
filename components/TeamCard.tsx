"use client";
import { motion } from "framer-motion";
import type { Team } from "@/lib/teams";
const EMOJI: Record<string, string> = { forest: "🌳", beach: "🏖️", sunset: "🌅", lagoon: "🌊" };
export default function TeamCard({ team, active, onPick, status }: { team: Team; active: boolean; onPick: () => void; status?: string }) {
  return (
    <motion.button whileHover={{ y: -4, rotate: -0.4 }} whileTap={{ scale: 0.98 }} onClick={onPick}
      className={`text-left p-3 rounded-xl border card-hover w-full ${active ? "ring-2 ring-offset-2 ring-green-500" : ""}`}
      style={{ background: "hsl(var(--card))" }}>
      <div className="flex justify-between items-center">
        <b>{EMOJI[team.world]} {team.id} • {team.name}</b>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-700 dark:text-green-300">● {status ?? "WORKING"}</span>
      </div>
      <div className="text-xs opacity-70 mt-1">👑 {team.master} • {team.industry} • {team.price}</div>
      <div className="text-xs mt-1 opacity-80">{team.kpi.join(" • ")}</div>
    </motion.button>
  );
}
