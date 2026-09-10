"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import MemoryLab from "./MemoryLab";
import Room from "./Room";
import { HookCrafter, TitleRewriter, ReviewResponder, IntentScorer, IntentForm } from "./demos";
import type { Team } from "@/lib/teams";

type F = { path: string; size: number };
const url = (p: string) => `/api/file?path=${encodeURIComponent(p)}`;
const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(0)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

function useFirst(team: string, ext: string) {
  const [f, setF] = useState<F | null>(null);
  useEffect(() => {
    fetch(`/api/files?team=${team}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        const list: F[] = (j.files ?? []).filter((x: F) => x.path.endsWith(ext));
        setF(list[0] ?? null);
      })
      .catch(() => setF(null));
  }, [team, ext]);
  return f;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="t-kicker mb-2">{children}</div>;
}

/* The product, not the project: each world opens into something you can USE. */
export default function ProductStage({ team }: { team: Team }) {
  const film = useFirst(team.id, ".mp4");
  const audio = useFirst(team.id, ".mp3");

  switch (team.id) {
    case "01":
      return <div><SectionTitle>Try it — hook forge</SectionTitle><HookCrafter /></div>;
    case "02":
      return (
        <div>
          <SectionTitle>Now playing — latest film</SectionTitle>
          {film ? (
            <video src={url(film.path)} controls preload="metadata" playsInline style={{ width: "100%", borderRadius: 6, background: "#000", maxHeight: 420 }} />
          ) : <p className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>Rendering… open the Vault tab for the full shelf.</p>}
          <p className="t-small mt-2"><Link href="#vault" onClick={(e) => e.preventDefault()}>All films live under the Vault tab ↓</Link></p>
        </div>
      );
    case "03":
      return <div><SectionTitle>Try it — intent scorer (the miner's brain)</SectionTitle><IntentScorer /></div>;
    case "05":
      return <Storefront />;
    case "06":
      return <div><SectionTitle>Try it — Etsy title rewriter</SectionTitle><TitleRewriter /></div>;
    case "08":
      return <div><SectionTitle>Try it — review responder</SectionTitle><ReviewResponder /></div>;
    case "09":
      return (
        <div>
          <SectionTitle>Listen — sleep track v1</SectionTitle>
          {audio ? (
            <><audio src={url(audio.path)} controls preload="metadata" style={{ width: "100%" }} />
            <p className="t-small t-mono mt-1" style={{ color: "hsl(var(--muted-fg))" }}>{audio.path.split("/").pop()} · {kb(audio.size)} · brown-noise bed</p></>
          ) : <p className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>Pressing… check the Vault tab shortly.</p>}
        </div>
      );
    case "11":
      return <DentalShop />;
    case "12":
      return <MemoryLab />;
    case "13":
      return <Room team={team} />;
    default:
      return (
        <p className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>
          This desk is archived — monitoring only. Its files remain in the Vault tab.
        </p>
      );
  }
}

function Storefront() {
  const [item, setItem] = useState("ADHD Daily Focus — $6.95");
  const items = [
    { name: "ADHD Daily Focus — $6.95", blurb: "Undated brain-dump → top-3 → time-block. Print forever." },
    { name: "Poetcore Pen-Pal Kit — $8.95", blurb: "6 papers, 2 envelopes, 24 prompts, 12 labels." },
    { name: "Self-Care Bundle — $14.95", blurb: "Habit + mood + gratitude + sleep. The 4-in-1." },
  ];
  return (
    <div>
      <SectionTitle>Shelf — reserve yours (Etsy shop opens on your tick)</SectionTitle>
      <div className="grid gap-2 sm:grid-cols-3">
        {items.map((it) => (
          <button key={it.name} onClick={() => setItem(it.name)}
            className="surface-2 p-3 text-left" style={item === it.name ? { outline: "2px solid hsl(var(--primary))" } : undefined}>
            <b className="t-small block">{it.name}</b>
            <span className="t-small block mt-1" style={{ color: "hsl(var(--muted-fg))" }}>{it.blurb}</span>
          </button>
        ))}
      </div>
      <div className="mt-3"><IntentForm team="05-etsy-pinterest-digital" item={item} cta="Reserve" /></div>
    </div>
  );
}

function DentalShop() {
  return (
    <div>
      <SectionTitle>The ritual — $34.95 + $14.95/mo refill</SectionTitle>
      <ol className="space-y-1.5">
        {["Smear gel on the lick-mat — the dog thinks it's treats.", "Thirty seconds a side with the soft finger brush.", "Mark the 14-day card. That's the whole ritual."]
          .map((s, i) => (
            <li key={i} className="surface-2 px-2.5 py-2 t-small flex gap-2">
              <b className="t-mono shrink-0" style={{ color: "hsl(var(--primary))" }}>{i + 1}</b><span>{s}</span>
            </li>
          ))}
      </ol>
      <p className="t-small mt-2" style={{ color: "hsl(var(--muted-fg))" }}>
        Finish the card, no visible change: full refund, keep the brushes. Under-25lb seniors.
      </p>
      <div className="mt-3"><IntentForm team="11-dropshipping-lab" item="Dental ritual kit $34.95" cta="Pre-order" /></div>
    </div>
  );
}
