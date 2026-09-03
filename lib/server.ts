import fs from "fs";
import path from "path";
import { TEAMS } from "./teams";

export function empireRoot(): string | null {
  const c = ["C:\\Users\\Dell\\Documents\\Testing project\\empire", path.join(process.cwd(), "..", "empire"), path.join(process.cwd(), "empire-data")];
  for (const p of c) try { if (fs.existsSync(path.join(p, "STATE.json"))) return p; } catch {}
  return null;
}
export function readLiveState() {
  const root = empireRoot(); if (!root) return null;
  try {
    const g = JSON.parse(fs.readFileSync(path.join(root, "STATE.json"), "utf8"));
    const per: Record<string, unknown> = {};
    for (const t of TEAMS) {
      const p = path.join(root, t.dir, "STATE.json");
      if (fs.existsSync(p)) per[t.dir] = JSON.parse(fs.readFileSync(p, "utf8"));
    }
    // empire-data snapshot mirror (STATE.json only, no per-team runtime)
    const snap = path.join(process.cwd(), "empire-data");
    if (!Object.keys(per).length && fs.existsSync(snap)) {
      for (const t of TEAMS) {
        const p = path.join(snap, t.dir, "STATE.json");
        if (fs.existsSync(p)) per[t.dir] = JSON.parse(fs.readFileSync(p, "utf8"));
      }
    }
    return { global: g, per, root };
  } catch { return null; }
}
export function readLiveLogs(limit = 50) {
  const roots = [empireRoot(), path.join(process.cwd(), "empire-data")].filter(Boolean) as string[];
  for (const root of roots) {
    try {
      const f = path.join(root, "_bus", "log.jsonl");
      if (!fs.existsSync(f)) continue;
      return fs.readFileSync(f, "utf8").trim().split("\n").slice(-limit).reverse().map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    } catch { /* next root */ }
  }
  return [];
}
