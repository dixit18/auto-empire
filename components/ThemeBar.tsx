"use client";
import { useTheme } from "next-themes";
export default function ThemeBar({ world, setWorld }: { world: string; setWorld: (w: string) => void }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button className="px-3 py-1.5 rounded-full border text-sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? "☀️ light" : "🌙 night"} theme
      </button>
      {(["forest", "beach", "sunset", "lagoon"] as const).map((w) => (
        <button key={w} onClick={() => setWorld(w)} className={`px-3 py-1.5 rounded-full border text-sm ${world === w ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}>{w}</button>
      ))}
      <span className="text-xs opacity-70">tweakcn tokens + shadcn-style • gsap monkey • framer cards</span>
    </div>
  );
}
