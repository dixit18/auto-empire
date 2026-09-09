import { NextResponse } from "next/server";
import { ingest, recall, remove } from "@/lib/memory/store";

export const dynamic = "force-dynamic";

/* Recall Foundry v0 API — local-first, zero keys. Spec: empire/12-memory-layer/RESEARCH/04-api-spec.md */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user") ?? "";
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? 5);
  if (!user) return NextResponse.json({ ok: false, error: "need ?user=" }, { status: 400 });
  try {
    const r = recall(user, q, Number.isFinite(limit) ? limit : 5);
    return NextResponse.json({ ok: true, ...r });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: unknown = null;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 }); }
  try {
    const r = ingest(body);
    return NextResponse.json(r, { status: r.ok ? 200 : 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";
  const user = searchParams.get("user") ?? "";
  if (!id || !user) return NextResponse.json({ ok: false, error: "need ?id=&user=" }, { status: 400 });
  try {
    return NextResponse.json({ ok: remove(id, user) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
