import { NextResponse } from "next/server";
import { readLiveLogs } from "@/lib/server";
export async function GET() {
  const logs = readLiveLogs(50);
  return NextResponse.json({ logs, source: logs.length ? "empire/_bus/log.jsonl" : "empty - run orchestrator or click Run" });
}
