import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { TEAMS } from "@/lib/teams";
import { empireRoot } from "@/lib/server";

export const dynamic = "force-dynamic";

const MEDIA = new Set([".mp4", ".mp3", ".png", ".jpg", ".jpeg", ".pdf"]);

/* Newest shippable artifacts across the empire, by file time. The answer to "where are the videos". */
export async function GET() {
  const root = empireRoot();
  if (!root) return NextResponse.json({ drops: [] });
  const R: string = root;
  const out: { team: string; dir: string; path: string; size: number; mtime: number; kind: string }[] = [];
  function walk(dir: string) {
    let ents: fs.Dirent[] = [];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (["node_modules", ".next", "_bus", "frames"].includes(e.name)) continue;
        walk(full);
      } else {
        const ext = path.extname(e.name).toLowerCase();
        if (!MEDIA.has(ext)) continue;
        if (/^seg\d+\./.test(e.name) || /^scene-\d+\./.test(e.name) || e.name === "list.txt") continue;
        const rel = path.relative(R, full).replace(/\\/g, "/");
        if (!rel.includes("outputs/") && !rel.includes("product-")) continue;
        try {
          const st = fs.statSync(full);
          const kind = ext === ".mp4" ? "film" : ext === ".mp3" ? "audio" : [".png", ".jpg", ".jpeg"].includes(ext) ? "image" : "doc";
          out.push({ team: rel.slice(0, 2), dir: rel.split("/")[0], path: rel, size: st.size, mtime: st.mtimeMs, kind });
        } catch {}
      }
    }
  }
  for (const t of TEAMS) walk(path.join(root, t.dir));
  out.sort((a, b) => b.mtime - a.mtime);
  return NextResponse.json({ drops: out.slice(0, 8) });
}
