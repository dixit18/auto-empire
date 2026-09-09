"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function motionOK(): boolean {
  if (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}
function finePointer(): boolean {
  return typeof matchMedia !== "undefined" && matchMedia("(pointer: fine)").matches;
}

/* Magnetic pull with momentum: element leans toward the cursor, settles back.
   Desktop pointers only; touch and reduced-motion get the static version. */
export function Magnetic({ children, strength = 0.32, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!motionOK() || !finePointer() || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength]);
  return <div ref={ref} className={className} style={{ display: "inline-block" }}>{children}</div>;
}

/* Scroll progress hairline: one GSAP scrub, direct DOM writes, zero React renders. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!motionOK() || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(ref.current, { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return (
    <div aria-hidden className="fixed top-0 left-0 right-0" style={{ height: 2, zIndex: 60 }}>
      <div ref={ref} style={{ height: "100%", background: "hsl(var(--primary))", transformOrigin: "0 50%" }} />
    </div>
  );
}

/* Cursor glow with momentum lag: follows behind the pointer and settles.
   Decorative only — never carries information, invisible on touch. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!motionOK() || !finePointer() || !ref.current) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
    const move = (e: MouseEvent) => { xTo(e.clientX - 260); yTo(e.clientY - 260); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  if (typeof matchMedia !== "undefined" && (!finePointer() || !motionOK())) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed top-0 left-0" style={{ zIndex: 1 }}>
      <div ref={ref} style={{
        width: 520, height: 520, borderRadius: "50%",
        background: "radial-gradient(circle, hsl(var(--primary) / 0.07), transparent 65%)",
      }} />
    </div>
  );
}
