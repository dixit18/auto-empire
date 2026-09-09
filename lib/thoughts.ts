import type { Team } from "./teams";
import type { Log } from "@/components/KpiStrip";

export type Thought = { who: string; role: "master" | "worker" | "human"; text: string; ts: string; live: boolean };

const LIVE_MS = 120000;

function age(ts: string): string {
  const d = Date.now() - Date.parse(ts);
  if (Number.isNaN(d) || d < 0) return "just now";
  const s = Math.floor(d / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export function crewForName(team: Team, msg: string): string {
  let h = 0;
  for (let i = 0; i < msg.length; i++) h = (h * 31 + msg.charCodeAt(i)) >>> 0;
  return team.crew[h % team.crew.length];
}

/* What is this team thinking RIGHT NOW? Verbatim latest bus facts,
   attributed to master / named worker / human — never invented. */
export function teamThoughts(team: Team, logs: Log[]): { master: Thought; crew: Thought[]; live: boolean } {
  const mine = logs.filter((l) => String(l.team).startsWith(team.id));
  const latest = mine[0];
  const isLive = !!latest && Date.now() - Date.parse(latest.ts) < LIVE_MS;
  const master: Thought = latest
    ? {
        who: team.master, role: "master",
        text: latest.from === "HUMAN" ? `Human said: ${latest.msg}` : `${latest.from} → ${latest.to}: ${latest.msg}`,
        ts: latest.ts, live: isLive,
      }
    : { who: team.master, role: "master", text: "Quiet — press Run to wake this crew.", ts: "", live: false };
  const seen = new Set<string>();
  const crew: Thought[] = [];
  for (const l of mine) {
    const w = l.from === "MASTER" || l.to === "MASTER"
      ? (l.from === "WORKER" || l.to === "WORKER" ? crewForName(team, l.msg) : l.from === "HUMAN" || l.to === "HUMAN" ? "HUMAN" : crewForName(team, l.msg))
      : crewForName(team, l.msg);
    if (w === "HUMAN" || seen.has(w)) continue;
    seen.add(w);
    crew.push({ who: w, role: "worker", text: `${l.from} → ${l.to}: ${l.msg}`, ts: l.ts, live: isLive && l === latest });
    if (crew.length >= 4) break;
  }
  for (const c of team.crew) {
    if (crew.length >= 4) break;
    if (!seen.has(c)) crew.push({ who: c, role: "worker", text: "Standing by for the master's next assignment.", ts: "", live: false });
  }
  return { master, crew, live: isLive };
}

export function ago(ts: string): string {
  return ts ? age(ts) : "";
}
