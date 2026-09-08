import { NextResponse } from "next/server";
import { readLiveLogs } from "@/lib/server";
export const dynamic = "force-dynamic";
export async function GET() {
  const { logs, rejected } = readLiveLogs(50);
  return NextResponse.json({ logs, rejected, source: logs.length ? "empire/_bus/log.jsonl" : "empty - run orchestrator or click Run" });
}
