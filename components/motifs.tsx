/* 10 hand-drawn team motifs. Monochrome linework + single accent fill.
   64×64 viewBox, stroke=currentColor, accent=hsl(var(--primary)). */

type P = { className?: string };

function Base({ children, className = "" }: P & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

/* 01 — Ghostwriter: quill over lines */
export function MGhostwriter(p: P) {
  return <Base {...p}>
    <path d="M14 50h36" opacity=".45" /><path d="M14 42h24" opacity=".45" /><path d="M14 34h30" opacity=".45" />
    <path d="M44 8c8 2 12 8 12 16-8 0-16-4-18-12l6 6" fill="hsl(var(--primary) / .18)" />
    <path d="M38 26L26 44l-4 8 8-4 18-12" /><circle cx="46" cy="14" r="1.6" fill="hsl(var(--primary))" stroke="none" />
  </Base>;
}

/* 02 — YouTube engine: play in stacked shorts */
export function MTube(p: P) {
  return <Base {...p}>
    <rect x="10" y="14" width="30" height="38" rx="7" /><rect x="24" y="8" width="30" height="38" rx="7" opacity=".45" />
    <path d="M26 27l10 6-10 6z" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
    <path d="M14 54h12" opacity=".5" />
  </Base>;
}

/* 03 — Reddit miner: radar dish + orbit signal */
export function MListener(p: P) {
  return <Base {...p}>
    <path d="M12 44a20 20 0 0 1 28-18" /><path d="M12 44h40" />
    <circle cx="32" cy="44" r="4" fill="hsl(var(--primary) / .2)" />
    <circle cx="44" cy="22" r="2.4" fill="hsl(var(--primary))" stroke="none" />
    <circle cx="50" cy="30" r="1.6" fill="hsl(var(--primary))" stroke="none" opacity=".6" />
    <path d="M22 44l-4 10M42 44l4 10" opacity=".5" />
  </Base>;
}

/* 04 — Signal bot: lighthouse pulse */
export function MSignal(p: P) {
  return <Base {...p}>
    <path d="M26 54V30l6-8 6 8v24" /><path d="M22 54h20" />
    <path d="M32 22v-6" /><circle cx="32" cy="13" r="2.4" fill="hsl(var(--primary))" stroke="none" />
    <path d="M40 18l10-6M24 18L14 12" opacity=".6" />
    <path d="M8 54h48" opacity=".4" />
  </Base>;
}

/* 05 — Etsy digital: parcel + map pin */
export function MPin(p: P) {
  return <Base {...p}>
    <path d="M32 54s-14-12-14-24a14 14 0 0 1 28 0c0 12-14 24-14 24z" />
    <circle cx="32" cy="30" r="5" fill="hsl(var(--primary) / .2)" />
    <path d="M29 30l2 2 4-4" />
  </Base>;
}

/* 06 — GPT suite: spark nodes */
export function MSpark(p: P) {
  return <Base {...p}>
    <circle cx="32" cy="32" r="5" fill="hsl(var(--primary))" stroke="none" opacity=".9" />
    <circle cx="14" cy="18" r="3" /><circle cx="50" cy="16" r="3" /><circle cx="16" cy="48" r="3" /><circle cx="50" cy="46" r="3" />
    <path d="M17 20l9 8M47 18l-9 9M18 45l8-8M48 43l-8-6" opacity=".55" />
  </Base>;
}

/* 07 — Staging: house with staged chair */
export function MHouse(p: P) {
  return <Base {...p}>
    <path d="M10 30L32 12l22 18" /><path d="M16 28v22h32V28" />
    <rect x="26" y="36" width="12" height="9" rx="2" fill="hsl(var(--primary) / .2)" />
    <path d="M26 45v-9M38 45v-9M24 54h16" opacity=".6" />
  </Base>;
}

/* 08 — LocalBiz: storefront + bell */
export function MShop(p: P) {
  return <Base {...p}>
    <path d="M10 22h44l-3 8H13z" fill="hsl(var(--primary) / .15)" />
    <path d="M14 30v20h36V30" /><path d="M26 50v-10h12v10" />
    <circle cx="46" cy="12" r="4" /><path d="M46 16v2" />
  </Base>;
}

/* 09 — Wellness: moon over waves */
export function MMoon(p: P) {
  return <Base {...p}>
    <path d="M40 8a16 16 0 1 0 8 30A18 18 0 0 1 40 8z" fill="hsl(var(--primary) / .18)" />
    <path d="M8 48q6-4 12 0t12 0 12 0 12 0" /><path d="M8 55q6-4 12 0t12 0 12 0 12 0" opacity=".5" />
  </Base>;
}

/* 10 — Course factory: steps to cap */
export function MSteps(p: P) {
  return <Base {...p}>
    <path d="M8 52h12V44h12v-8h12V28h12" />
    <path d="M32 12l16 6-16 6-16-6z" fill="hsl(var(--primary) / .18)" />
    <path d="M42 20v8c0 3-4 5-8 5" opacity=".6" />
  </Base>;
}

export const MOTIFS: Record<string, (p: P) => React.ReactElement> = {
  "01": MGhostwriter, "02": MTube, "03": MListener, "04": MSignal, "05": MPin,
  "06": MSpark, "07": MHouse, "08": MShop, "09": MMoon, "10": MSteps,
};

export function Motif({ id, className = "" }: { id: string; className?: string }) {
  const C = MOTIFS[id] ?? MSpark;
  return <C className={className} />;
}
