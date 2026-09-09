"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
function setup() {
  if (registered || typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
  return true;
}

/* Fade-rise on scroll into view. Static when reduced motion. */
export function Reveal({ children, className = "", y = 22 }: { children: ReactNode; className?: string; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!setup() || !ref.current) return;
    const el = ref.current;
    const tween = gsap.fromTo(el, { opacity: 0, y }, {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [y]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* Kinetic headline: words stagger up on load. */
export function Kinetic({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");
  useEffect(() => {
    if (!setup() || !ref.current) return;
    const tween = gsap.fromTo(ref.current.querySelectorAll(".kw"),
      { opacity: 0, y: 26, rotate: 1.5 },
      { opacity: 1, y: 0, rotate: 0, duration: 0.65, ease: "power3.out", stagger: 0.07, delay: 0.1 });
    return () => { tween.kill(); };
  }, []);
  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="kw" style={{ display: "inline-block", whiteSpace: "pre" }}>{w}{i < words.length - 1 ? " " : ""}</span>
      ))}
    </h1>
  );
}
