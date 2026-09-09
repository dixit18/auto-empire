import fs from "fs";
import path from "path";
import { empireRoot } from "@/lib/server";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".mp4": "video/mp4", ".mp3": "audio/mpeg", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".html": "text/html; charset=utf-8", ".pdf": "application/pdf", ".md": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".json": "application/json",
};

/* Stream one allowlisted repo file. Path traversal blocked: resolved path must stay inside empire/. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rel = searchParams.get("path") ?? "";
  const root = empireRoot();
  if (!root || rel.includes("..") || path.isAbsolute(rel)) return new Response("blocked", { status: 403 });
  const full = path.resolve(root, rel);
  if (!full.startsWith(path.resolve(root) + path.sep)) return new Response("blocked", { status: 403 });
  const ext = path.extname(full).toLowerCase();
  if (!TYPES[ext] || !fs.existsSync(full) || !fs.statSync(full).isFile()) return new Response("missing", { status: 404 });
  if (fs.statSync(full).size > 25 * 1024 * 1024) return new Response("too large", { status: 413 });
  const buf = fs.readFileSync(full);
  return new Response(buf, { headers: { "Content-Type": TYPES[ext], "Cache-Control": "public, max-age=60" } });
}
