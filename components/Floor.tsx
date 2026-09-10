"use client";
import Link from "next/link";
import { MANAGER, CREW } from "@/lib/crew";

/* The Floor — who works on what, under whom. Mirror of empire/_system/TASKS.md.
   Manager on top, crew below, every card links to the living work. */
export default function Floor() {
  return (
    <div>
      <div className="t-kicker mb-1">§ The Floor — people, not pipelines</div>
      <h2 className="t-h2">One manager. Five named employees. Zero mystery.</h2>
      <div className="surface p-3 sm:p-4 mt-2" style={{ borderTop: "4px solid hsl(var(--primary))" }}>
        <div className="flex flex-wrap items-baseline gap-2">
          <b style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem" }}>{MANAGER.name}</b>
          <span className="chip">manager</span>
        </div>
        <div className="t-small font-bold mt-0.5">{MANAGER.role}</div>
        <p className="t-body mt-1" style={{ color: "hsl(var(--muted-fg))" }}>{MANAGER.focus}</p>
        <p className="t-small t-mono mt-1" style={{ color: "hsl(var(--muted-fg))" }}>rule: tasks older than 7 days get killed or re-scoped — no zombies</p>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {CREW.map((e) => (
          <Link key={e.name} href={e.link} className="surface p-3 card-hover min-w-0" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="flex items-center gap-2">
              <span aria-hidden className="grid place-items-center rounded-full font-extrabold"
                style={{ width: 34, height: 34, background: "hsl(var(--foreground))", color: "hsl(var(--background))", fontFamily: "var(--font-serif)" }}>
                {e.name[0]}
              </span>
              <div className="min-w-0">
                <b>{e.name}</b>
                <div className="t-small truncate" style={{ color: "hsl(var(--muted-fg))" }}>{e.role}</div>
              </div>
            </div>
            <p className="t-small mt-2"><b>Now: </b>{e.focus}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {e.skills.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </Link>
        ))}
        <div className="surface-2 p-3">
          <b style={{ fontFamily: "var(--font-serif)" }}>Your seat</b>
          <p className="t-small mt-1" style={{ color: "hsl(var(--muted-fg))" }}>
            Owner: user researcher (10 dog-owner chats unlock 11) + keys/budgets in § 05 Wanted.
            The empty chair with the most leverage.
          </p>
        </div>
      </div>
    </div>
  );
}
