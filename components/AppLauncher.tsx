"use client";
import Link from "next/link";
import { TEAMS } from "@/lib/teams";
import { THESES } from "@/lib/theses";
import { Motif } from "./motifs";

/* App launcher: every organisation and every solution thesis is its own app. */
export default function AppLauncher() {
  return (
    <div>
      <div className="t-kicker mb-1">§ All applications — pick one, it opens alone</div>
      <h2 className="t-h2">Eleven companies. Six theses. Seventeen doors.</h2>
      <div className="t-kicker mt-4 mb-2">Companies</div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {TEAMS.map((t) => (
          <Link key={t.id} href={`/${t.dir}`} className="surface p-3 flex gap-3 items-center card-hover min-w-0"
            style={{ textDecoration: "none", color: "inherit" }}>
            <span className="surface-2 grid place-items-center shrink-0" style={{ width: 44, height: 44, borderRadius: 10, color: "hsl(var(--foreground))" }}>
              <Motif id={t.id} className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <b className="block truncate" style={{ fontSize: "0.92rem" }}><span className="t-mono" style={{ color: "hsl(var(--muted-fg))" }}>{t.id}</span> · {t.name}</b>
              <span className="t-small block truncate" style={{ color: "hsl(var(--muted-fg))" }}>{t.tagline}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="t-kicker mt-4 mb-2">Solution theses — fundable AI problems</div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {THESES.map((t) => (
          <Link key={t.id} href={`/solutions/${t.id}`} className="surface p-3 flex gap-3 items-center card-hover min-w-0"
            style={{ textDecoration: "none", color: "inherit", borderTop: "3px solid hsl(var(--primary))" }}>
            <span className="t-mono font-extrabold shrink-0" style={{ color: "hsl(var(--primary))" }}>{t.n}</span>
            <span className="min-w-0">
              <b className="block truncate" style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem" }}>{t.title}</b>
              <span className="t-small block truncate" style={{ color: "hsl(var(--muted-fg))" }}>{t.status}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
