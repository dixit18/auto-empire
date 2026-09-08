import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { TEAMS } from "@/lib/teams";
import { empireRoot } from "@/lib/server";

export const dynamic = "force-dynamic";

const ALLOW = new Set([".md", ".txt", ".html", ".png", ".jpg", ".jpeg", ".mp4", ".json"]);

/* List a team's shippable artifacts: outputs/ + product folders + README. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("team");
  const team = TEAMS.find((t) => t.id === id);
  const root = empireRoot();
  if (!team || !root) return NextResponse.json({ files: [] });
  const R: string = root;
  const base = path.join(R, team.dir);
  const out: { path: string; size: number; kind: string }[] = [];
  function walk(dir: string) {
    let ents: fs.Dirent[] = [];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const full = path.join(dir, e.name);
      const rel = path.relative(R, full).replace(/\\/g, "/");
      if (e.isDirectory()) {
        if (["node_modules", ".next", "_bus"].includes(e.name)) continue;
        walk(full);
      } else if (ALLOW.has(path.extname(e.name).toLowerCase())) {
        if (rel.includes("outputs/") || rel.includes("product-") || e.name === "README.md" || e.name === "ROADMAP.md") {
          try { out.push({ path: rel, size: fs.statSync(full).size, kind: e.name === "README.md" ? "plan" : "artifact" }); } catch {}
        }
      }
      if (out.length > 120) return;
    }
  }
  walk(base);
  out.sort((a, b) => a.path.localeCompare(b.path));
  return NextResponse.json({ files: out });
}
