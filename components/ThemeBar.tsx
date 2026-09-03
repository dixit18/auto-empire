"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const WORLDS = [
  { id: "forest", label: "Forest", dot: "#2f9e44", hint: "creators, calm growth" },
  { id: "beach", label: "Beach", dot: "#0e9fd8", hint: "signals, clear water" },
  { id: "sunset", label: "Sunset", dot: "#8b5cf6", hint: "media, prime time" },
  { id: "lagoon", label: "Lagoon", dot: "#0d9488", hint: "ops, deep focus" },
] as const;

export default function ThemeBar({ world, setWorld }: { world: string; setWorld: (w: string) => void }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const night = (resolvedTheme ?? "dark") === "dark";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* light / night segmented */}
      <div className="surface-2 flex p-1 gap-1" role="group" aria-label="Color theme">
        {(["light", "dark"] as const).map((t) => {
          const on = mounted ? (night ? t === "dark" : t === "light") : t === "dark";
          return (
            <button key={t} onClick={() => { setTheme(t); try { localStorage.setItem("empire-theme", t); } catch {} }}
              aria-pressed={on}
              className="px-3 py-1.5 rounded-md text-sm font-semibold transition-all"
              style={on ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-fg))" } : { color: "hsl(var(--muted-fg))" }}>
              {t === "light" ? "☀︎ Light" : "☾ Night"}
            </button>
          );
        })}
      </div>
      {/* world accent swatches */}
      <div className="surface-2 flex p-1 gap-1" role="group" aria-label="World accent">
        {WORLDS.map((w) => {
          const on = world === w.id;
          return (
            <button key={w.id} onClick={() => setWorld(w.id)} title={`${w.label} — ${w.hint}`} aria-pressed={on}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-semibold transition-all"
              style={on ? { background: "hsl(var(--muted))", boxShadow: "inset 0 0 0 1.5px hsl(var(--primary))" } : { color: "hsl(var(--muted-fg))" }}>
              <span aria-hidden style={{ width: 10, height: 10, borderRadius: 99, background: w.dot, boxShadow: on ? `0 0 0 2px hsl(var(--card)), 0 0 0 3.5px ${w.dot}` : "none" }} />
              <span className="hidden sm:inline">{w.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
