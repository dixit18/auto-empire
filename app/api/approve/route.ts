import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function empireRoot(): string | null {
  const c = [path.join(process.cwd(), "empire"), "C:\\Users\\Dell\\Documents\\Testing project\\empire", path.join(process.cwd(), "..", "empire")];
  for (const p of c) try { if (fs.existsSync(path.join(p, "STATE.json"))) return p; } catch {}
  return null;
}

/* Human gate acknowledgement — written to the same bus every agent reads. */
export async function POST(req: Request) {
  const { team, msg } = await req.json().catch(() => ({}) as any);
  const root = empireRoot();
  if (!root) return NextResponse.json({ ok: false, error: "empire/ not found" });
  const rec = {
    ts: new Date().toISOString(), team: team ?? "empire",
    from: "HUMAN", to: "MASTER", phase: "-",
    msg: `approved: ${String(msg ?? "pending task").slice(0, 140)}`, status: "done",
  };
  fs.mkdirSync(path.join(root, "_bus"), { recursive: true });
  fs.appendFileSync(path.join(root, "_bus", "log.jsonl"), JSON.stringify(rec) + "\n");
  return NextResponse.json({ ok: true });
}
