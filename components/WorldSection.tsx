"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import FlatAtlas from "@/components/FlatAtlas";
import type { Team } from "@/lib/teams";
import type { Log } from "@/components/KpiStrip";

const World3D = dynamic(() => import("@/components/World3D"), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ height: 380, borderRadius: 6 }} />,
});

function webglAlive(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/* § 01 — the world, both editions. 3D when the GPU allows, flat press-atlas
   otherwise (or whenever you flip the switch). Same rails, same live traffic. */
export default function WorldSection({ logs, cur, onPick }: { logs: Log[]; cur: Team; onPick: (t: Team) => void }) {
  const [mode, setMode] = useState<"3d" | "flat" | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("empire-world");
      if (saved === "3d" || saved === "flat") { setMode(saved); return; }
    } catch {}
    setMode(webglAlive() ? "3d" : "flat");
  }, []);
  function pick(m: "3d" | "flat") {
    setMode(m);
    try { localStorage.setItem("empire-world", m); } catch {}
  }
  return (
    <div className="surface relative overflow-hidden">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 sm:px-4 pt-3">
        <span className="t-kicker">§ 01 — The World{mode === "flat" ? ", flat atlas" : ", in 3D"}</span>
        <span className="t-small hidden md:inline" style={{ color: "hsl(var(--muted-fg))" }}>
          {mode === "3d" ? "drag to orbit · scroll to zoom · right-drag to pan · click an island"
            : "drag to roam · scroll to zoom · hover an island to trace its full line"}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="surface-2 flex p-1 gap-1" role="group" aria-label="World edition">
            {(["3d", "flat"] as const).map((m) => (
              <button key={m} onClick={() => pick(m)} aria-pressed={mode === m}
                className="px-2.5 py-1 rounded text-sm font-bold"
                style={mode === m ? { background: "hsl(var(--foreground))", color: "hsl(var(--background))" } : { color: "hsl(var(--muted-fg))" }}>
                {m === "3d" ? "◆ 3D" : "▦ Flat"}
              </button>
            ))}
          </div>
          <Link href={`/${cur.dir}`} className="btn btn-primary" style={{ padding: "0.35rem 0.8rem", fontSize: "0.78rem" }}>
            Open {cur.id} →
          </Link>
        </div>
      </div>
      <div className="px-3 sm:px-4 py-2">
        {mode === null && <div className="skeleton" style={{ height: 380, borderRadius: 6 }} />}
        {mode === "3d" && <World3D logs={logs} cur={cur} onPick={onPick} />}
        {mode === "flat" && <FlatAtlas logs={logs} cur={cur} onPick={onPick} />}
      </div>
    </div>
  );
}
