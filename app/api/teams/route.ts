import { NextResponse } from "next/server";
import { TEAMS } from "@/lib/teams";
import { readLiveState } from "@/lib/server";
export async function GET() {
  const live = readLiveState();
  return NextResponse.json({ teams: TEAMS, live });
}
