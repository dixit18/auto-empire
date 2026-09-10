import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { empireRoot } from "@/lib/server";

export const dynamic = "force-dynamic";

/* Pre-order / intent capture: the YC-validated instrument.
   "Sell before you build" — every intent lands in leads.jsonl + the bus. */
export async function POST(req: Request) {
  let body: { team?: string; contact?: string; note?: string; item?: string } | null = null;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 }); }
  if (!body || !body.team || !body.contact) {
    return NextResponse.json({ ok: false, error: "need {team, contact}" }, { status: 400 });
  }
  const root = empireRoot();
  if (!root) return NextResponse.json({ ok: false, error: "empire/ not found" });
  const rec = {
    ts: new Date().toISOString(), team: body.team,
    contact: String(body.contact).slice(0, 120),
    item: String(body.item ?? "general").slice(0, 120),
    note: String(body.note ?? "").slice(0, 500),
  };
  try {
    fs.appendFileSync(path.join(root, "_bus", "leads.jsonl"), JSON.stringify(rec) + "\n");
    fs.appendFileSync(path.join(root, "_bus", "log.jsonl"), JSON.stringify({
      ts: rec.ts, team: rec.team, from: "CUSTOMER", to: "MASTER",
      phase: "P2", msg: `intent captured: ${rec.item} (${rec.contact})`, status: "needs-approval",
    }) + "\n");
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error)?.message ?? e) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
