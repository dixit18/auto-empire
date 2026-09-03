import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { TEAMS } from "@/lib/teams";

const ORDER = ["P0", "P1", "P2", "P3"] as const;
const TASKS: Record<string, string[]> = {
  P0: ["list 10 customer pains", "score demand x competition", "write GO/KILL decision"],
  P1: ["build MVP sample", "write how-to-run README", "self-QA checklist"],
  P2: ["write listing copy + pricing", "write 5 launch posts/pins", "launch checklist"],
  P3: ["pricing + retention loop", "cross-sell map to other teams", "30-day scale plan"],
};

function empireRoot(): string | null {
  const c = [path.join(process.cwd(), "empire"), "C:\\Users\\Dell\\Documents\\Testing project\\empire", path.join(process.cwd(), "..", "empire")];
  for (const p of c) try { if (fs.existsSync(path.join(p, "STATE.json"))) return p; } catch {}
  return null;
}
function appendLog(root: string, rec: object) {
  const f = path.join(root, "_bus", "log.jsonl");
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.appendFileSync(f, JSON.stringify(rec) + "\n");
}
export async function POST(req: Request) {
  const { teamId, autoAll } = await req.json().catch(() => ({}) as any);
  const root = empireRoot();
  if (!root) return NextResponse.json({ ok: false, error: "empire/ not found locally. Deploy includes snapshot; connect GitHub for live writes." });
  const targets = autoAll ? TEAMS.map((t) => t.id) : [teamId ?? "05"];
  const out: any[] = [];
  for (const id of targets) {
    const team = TEAMS.find((t) => t.id === id);
    if (!team) continue;
    const td = path.join(root, team.dir);
    const sp = path.join(td, "STATE.json");
    let st: any = { phase: "P0", taskIndex: 0, status: "DOING" };
    try { st = JSON.parse(fs.readFileSync(sp, "utf8")); } catch {}
    const tasks = TASKS[st.phase] ?? TASKS.P0;
    const ts = new Date().toISOString();
    if ((st.taskIndex ?? 0) >= tasks.length) {
      const ni = ORDER.indexOf(st.phase) + 1;
      if (ni >= ORDER.length) { st.status = "DONE_ALL"; }
      else { st.phase = ORDER[ni]; st.taskIndex = 0; st.nextTask = TASKS[st.phase][0]; appendLog(root, { ts, team: team.dir, from: "MASTER", to: "WORKERS", phase: st.phase, msg: `auto-start ${st.phase}. No wait.`, status: "done" }); }
    } else {
      const task = tasks[st.taskIndex];
      appendLog(root, { ts, team: team.dir, from: "MASTER", to: "WORKER", phase: st.phase, msg: `starting: ${task} (via UI click)`, status: "started" });
      const dir = st.phase === "P0" ? path.join(td, "outputs") : path.join(td, "outputs", st.phase === "P1" ? "P1-mvp" : st.phase === "P2" ? "P2-launch" : "P3-scale");
      fs.mkdirSync(dir, { recursive: true });
      const file = st.phase === "P0" ? path.join(dir, "P0-validation.md") : path.join(dir, `${task.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.md`);
      fs.writeFileSync(file, `# ${team.dir} - ${st.phase}: ${task}\nBuilt: ${ts} via Empire OS UI (no wait).\n\nNext: auto-advance. See HANDOFF.md.\n`);
      fs.writeFileSync(path.join(td, "HANDOFF.md"), `# HANDOFF - ${team.dir}\n\n## Last done\n- ${st.phase}: ${task} at ${ts}\n\n## Now doing\n- auto-next, no wait\n`);
      st.taskIndex = (st.taskIndex ?? 0) + 1; st.lastFile = path.relative(root, file); st.updated = ts;
      st.nextTask = st.taskIndex < tasks.length ? tasks[st.taskIndex] : `ADVANCE from ${st.phase}`;
      appendLog(root, { ts, team: team.dir, from: "WORKER", to: "MASTER", phase: st.phase, msg: `done: ${task}`, status: "done" });
    }
    st.updated = new Date().toISOString();
    fs.writeFileSync(sp, JSON.stringify(st, null, 2));
    out.push({ id, phase: st.phase, taskIndex: st.taskIndex, status: st.status });
  }
  return NextResponse.json({ ok: true, advanced: out });
}
