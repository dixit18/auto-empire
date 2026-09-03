"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/* Ambient world banner. Motion is subtle + meaningful:
   - pauses when off-screen (IntersectionObserver)
   - disabled under prefers-reduced-motion
   - monkey position reflects live activity (more events → further along branch) */
export default function JungleScene({ world, activity, status }: { world: string; activity: number; status: string }) {
  const root = useRef<HTMLDivElement>(null);
  const mon = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mon.current, host = root.current;
    if (!el || !host) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tl: gsap.core.Timeline | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !tl) {
        tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } })
          .to(el, { y: -8, rotation: 4, duration: 1.6 }, 0)
          .to(el, { x: 10, duration: 2.2 }, 0);
      } else if (!e.isIntersecting && tl) { tl.kill(); tl = null; gsap.set(el, { x: 0, y: 0, rotation: 0 }); }
    }, { threshold: 0.1 });
    io.observe(host);
    return () => { io.disconnect(); tl?.kill(); };
  }, []);

  // activity 0..1 moves the monkey along the branch — progress you can read
  const px = Math.round(8 + Math.min(1, activity) * 220);

  return (
    <div ref={root} className="surface relative overflow-hidden" aria-hidden={false}>
      <div className={`absolute inset-0 world-${world}-glow`} />
      <svg viewBox="0 0 400 96" className="relative block w-full h-20 sm:h-24" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <path d="M-10,72 Q100,52 200,66 T410,58" className="vine" />
        <path d="M-10,26 Q140,44 280,24 T410,34" className="vine" opacity=".55" />
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx={18 + i * 32} cy={i % 2 ? 56 : 22} rx="13" ry="6.5" className="leaf"
            transform={`rotate(${(i * 37) % 50 - 25} ${18 + i * 32} 40)`} />
        ))}
      </svg>
      <div ref={mon} className="absolute text-2xl sm:text-3xl select-none" style={{ left: px, bottom: 26 }} title="Agent at work">🐒</div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 pb-2">
        <span className="chip">{world} world</span>
        <span className="t-small t-mono truncate" style={{ color: "hsl(var(--muted-fg))" }}>{status}</span>
      </div>
    </div>
  );
}
