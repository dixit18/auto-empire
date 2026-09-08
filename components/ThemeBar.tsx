"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/* Edition switch: Paper (day) / Ink (night). One accent, print discipline. */
export default function ThemeBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const night = (resolvedTheme ?? "light") === "dark";
  return (
    <div className="surface-2 flex p-1 gap-1" role="group" aria-label="Edition">
      {(["light", "dark"] as const).map((t) => {
        const on = mounted ? (night ? t === "dark" : t === "light") : t === "light";
        return (
          <button key={t} onClick={() => { setTheme(t); try { localStorage.setItem("empire-theme", t); } catch {} }}
            aria-pressed={on}
            className="px-3 py-1.5 rounded text-sm font-bold transition-all"
            style={on ? { background: "hsl(var(--foreground))", color: "hsl(var(--background))" } : { color: "hsl(var(--muted-fg))" }}>
            {t === "light" ? "❏ Paper" : "❏ Ink"}
          </button>
        );
      })}
    </div>
  );
}
