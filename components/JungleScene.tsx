"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function JungleScene({ world }: { world: string }) {
  const mon = useRef<HTMLDivElement>(null);
  const leaf = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mon.current) return;
    // monkey jumping branch to branch
    const tl = gsap.timeline({ repeat: -1, yoyo: false });
    tl.to(mon.current, { x: 120, y: -60, rotation: 12, duration: 1.1, ease: "sine.inOut" })
      .to(mon.current, { x: 240, y: 10, rotation: -8, duration: 1.1, ease: "sine.inOut" })
      .to(mon.current, { x: 60, y: 20, rotation: 0, duration: 1.2, ease: "sine.inOut" });
    if (leaf.current) gsap.to(leaf.current, { y: 12, repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut" });
    return () => { tl.kill(); };
  }, [world]);
  return (
    <div className="relative h-28 overflow-hidden rounded-xl jungle-bg border">
      <svg viewBox="0 0 400 110" className="absolute inset-0 w-full h-full">
        <path d="M0,85 Q100,60 200,80 T400,70" className="vine" />
        <path d="M0,30 Q150,50 300,25 T400,40" className="vine" opacity=".7" />
        {Array.from({ length: 14 }).map((_, i) => (
          <ellipse key={i} cx={20 + i * 28} cy={i % 2 ? 62 : 28} rx="14" ry="7" className="leaf" transform={`rotate(${i * 23} ${20 + i * 28} 40)`} />
        ))}
      </svg>
      <div ref={mon} className="absolute left-4 bottom-4 text-4xl select-none" title="agent monkey at work">🐒</div>
      <div ref={leaf} className="absolute right-4 top-2 text-sm opacity-80">{world === "beach" ? "🦀 click a team → agents swing into action" : world === "sunset" ? "🦜 dusk shift: packaging + posting" : "🍃 live: master assigning → workers building"}</div>
      <div className="absolute left-3 top-2 text-xs px-2 py-1 rounded-full bg-black/40 text-white">{world} world • gsap + framer</div>
    </div>
  );
}
