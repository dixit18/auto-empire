import fs from "fs";
import path from "path";
export function empireRoot(): string | null {
  const c = ["C:\\Users\\Dell\\Documents\\Testing project\\empire", path.join(process.cwd(), "..", "empire"), path.join(process.cwd(), "empire-data")];
  for (const p of c) try { if (fs.existsSync(path.join(p, "STATE.json"))) return p; } catch {}
  return null;
}
export function readLiveState() {
  const root = empireRoot(); if (!root) return null;
  try {
    const g = JSON.parse(fs.readFileSync(path.join(root, "STATE.json"), "utf8"));
    return { global: g, root };
  } catch { return null; }
}
export function readLiveLogs(limit = 50) {
  const root = empireRoot(); if (!root) return [];
  try {
    const f = path.join(root, "_bus", "log.jsonl");
    if (!fs.existsSync(f)) return [];
    return fs.readFileSync(f, "utf8").trim().split("\n").slice(-limit).reverse().map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}
