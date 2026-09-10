import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { empireRoot } from "@/lib/server";
import { parseBusLine } from "@/lib/bus";

export const dynamic = "force-dynamic";

/* Relay: a human (or agent) drops a message into a team's live session.
   This is the multiplayer primitive — shared rooms start here. */
export async function POST(req: Request) {
  let body: { team?: string; from?: string; to?: string; msg?: string } | null = null;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 }); }
  if (!body || !body.team || !body.msg) {
    return NextResponse.json({ ok: false, error: "need {team, msg}" }, { status: 400 });
  }
  const root = empireRoot();
  if (!root) return NextResponse.json({ ok: false, error: "empire/ not found" });
  const rec = {
    ts: new Date().toISOString(),
    team: String(body.team).slice(0, 80),
    from: String(body.from ?? "HUMAN").slice(0, 40),
    to: String(body.to ?? "MASTER").slice(0, 40),
    phase: "P3",
    msg: String(body.msg).slice(0, 500),
    status: "progress",
  };
  try {
    if (!parseBusLine(JSON.stringify(rec))) {
      return NextResponse.json({ ok: false, error: "message failed validation" }, { status: 400 });
    }
    fs.appendFileSync(path.join(root, "_bus", "log.jsonl"), JSON.stringify(rec) + "\n");
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error)?.message ?? e) }, { status: 500 });
  }
  return NextResponse.json({ ok: true, ts: rec.ts });
}
