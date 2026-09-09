"use client";
import Link from "next/link";
import { Card, Chip } from "@/components/ui";
import { TEAMS } from "@/lib/teams";
import type { Thesis } from "@/lib/theses";

/* A solution thesis, presented as its own app: problem → evidence → wedge → money. */
export default function SolutionView({ thesis }: { thesis: Thesis }) {
  const team = TEAMS.find((t) => t.id === thesis.related);
  const rows: [string, string][] = [
    ["The pain", thesis.pain],
    ["Forum receipts", thesis.evidence],
    ["The wedge", thesis.wedge],
    ["The money", thesis.money],
    ["Why we win", thesis.whyUs],
  ];
  return (
    <div className="space-y-4">
      <div className="surface p-4 sm:p-5" style={{ borderTop: "4px solid hsl(var(--primary))" }}>
        <Link href="/" className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>← All apps</Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="t-mono font-extrabold" style={{ color: "hsl(var(--primary))" }}>{thesis.n}</span>
          <h1 className="t-display" style={{ fontSize: "clamp(1.5rem,1.1rem+2.4vw,2.4rem)" }}>{thesis.title}</h1>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip tone="warn">{thesis.status}</Chip>
          {team && <Link href={`/${team.dir}`} className="chip" style={{ textDecoration: "none" }}>Built with Team {team.id} →</Link>}
        </div>
      </div>
      {rows.map(([k, v]) => (
        <Card key={k}>
          <div className="t-kicker mb-1">{k}</div>
          <p className="t-body">{v}</p>
        </Card>
      ))}
      <Card>
        <div className="t-kicker mb-1">Dossier</div>
        <p className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>
          Full R&D with sources: <code className="t-mono">empire/_system/PROBLEMS.md</code> in the repo.
          {team && <> Closest operating crew: <Link href={`/${team.dir}`}>{team.id} · {team.name}</Link>.</>}
        </p>
      </Card>
    </div>
  );
}
