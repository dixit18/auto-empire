"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";
import { useTheme } from "next-themes";
import { TEAMS, ACTIVE_TEAMS, ISLANDS, type Team } from "@/lib/teams";
import type { Log } from "./KpiStrip";

/* Editorial island inks + clay pastels (matte studio look). */
const INK: Record<string, string> = { forest: "#2e7d4f", beach: "#0b6e99", sunset: "#bd5a2e", lagoon: "#0e7c7b" };
const PASTEL = ["#b8e6c1", "#ffb7c5", "#fff3a0", "#b3dafe", "#d8b4fe"];

/* map % → world units */
const PX = (x: number) => (x - 50) / 9;
const PZ = (y: number) => (y - 23) / 9;

type Curve = { teamId: string; curve: THREE.QuadraticBezierCurve3 };

function useCurves() {
  return useMemo(() => {
    const m: Record<string, THREE.QuadraticBezierCurve3> = {};
    for (const t of ACTIVE_TEAMS) {
      const p = ISLANDS[t.id];
      const a = new THREE.Vector3(PX(p.x), 0.32, PZ(p.y));
      const b = new THREE.Vector3(0, 0.62, 0);
      const dist = a.distanceTo(b);
      const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 0.9 + dist * 0.16, 0));
      m[t.id] = new THREE.QuadraticBezierCurve3(a, mid, b);
    }
    return m;
  }, []);
}

function makeLabel(text: string, fg: string, bg: string) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 96;
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  g.beginPath();
  g.roundRect(56, 14, 144, 68, 34);
  g.fill();
  g.fillStyle = fg;
  g.font = "800 44px Georgia, serif";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, 128, 50);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Island({ team, selected, dimmed, night, onPick, onHover }: {
  team: Team; selected: boolean; dimmed: boolean; night: boolean;
  onPick: () => void; onHover: (id: string | null) => void;
}) {
  const p = ISLANDS[team.id];
  const x = PX(p.x), z = PZ(p.y);
  const color = INK[team.world];
  const tex = useMemo(
    () => makeLabel(team.id, selected ? "#fff" : color, selected ? (night ? "#c24332" : "#b03325") : (night ? "#221c14" : "#fffdf6")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [team.id, selected, night]
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group position={[x, 0, z]}
      onClick={(e) => { e.stopPropagation(); onPick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(team.id); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(null); document.body.style.cursor = "auto"; }}>
      {/* medallion body — matte clay */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.66, 0.34, 28]} />
        <meshStandardMaterial color={night ? "#2b2318" : "#fffdf6"} roughness={0.92} metalness={0} transparent opacity={dimmed ? 0.45 : 1} />
      </mesh>
      {/* little clay blob — each island's mascot */}
      <mesh position={[(parseInt(team.id, 10) % 3 - 1) * 0.28, 0.42, ((parseInt(team.id, 10) * 7) % 3 - 1) * 0.24]} castShadow>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial color={PASTEL[parseInt(team.id, 10) % PASTEL.length]} roughness={0.95} metalness={0} transparent opacity={dimmed ? 0.5 : 1} />
      </mesh>
      {/* ink rim */}
      <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, selected ? 0.055 : 0.035, 12, 40]} />
        <meshStandardMaterial color={selected ? (night ? "#ff6a55" : "#c03325") : color} roughness={0.4} transparent opacity={dimmed ? 0.4 : 1} />
      </mesh>
      {/* floating id plate */}
      <sprite position={[0, 0.95, 0]} scale={[1.35, 0.5, 1]}>
        <spriteMaterial map={tex} transparent depthTest={false} opacity={dimmed ? 0.5 : 1} />
      </sprite>
    </group>
  );
}

function Rails({ curves, hover, night }: { curves: Record<string, THREE.QuadraticBezierCurve3>; hover: string | null; night: boolean }) {
  const geos = useMemo(() => {
    const m: Record<string, THREE.TubeGeometry> = {};
    for (const t of TEAMS) m[t.id] = new THREE.TubeGeometry(curves[t.id], 40, 0.022, 8, false);
    return m;
  }, [curves]);
  useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);
  return (
    <group>
      {ACTIVE_TEAMS.map((t) => {
        const hot = hover === t.id;
        const dim = hover !== null && !hot;
        return (
          <mesh key={t.id} geometry={geos[t.id]}>
            <meshStandardMaterial color={hot ? (night ? "#ff6a55" : "#c03325") : night ? "#6b6152" : "#9a8f78"}
              roughness={0.5} transparent opacity={dim ? 0.15 : hot ? 1 : 0.75} />
          </mesh>
        );
      })}
    </group>
  );
}

function Hub() {
  const ring = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ring.current) ring.current.rotation.z = t * 0.5;
    if (core.current) {
      const s = 1 + Math.sin(t * 2.4) * 0.08;
      core.current.scale.setScalar(s);
    }
  });
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.95, 1.1, 0.4, 36]} />
        <meshStandardMaterial color="#1c1712" roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh ref={ring} position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.05, 12, 48]} />
        <meshStandardMaterial color="#c03325" emissive="#c03325" emissiveIntensity={0.55} roughness={0.3} />
      </mesh>
      <mesh ref={core} position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color="#ff6a55" emissive="#d93a2b" emissiveIntensity={1.4} roughness={0.2} />
      </mesh>
    </group>
  );
}

type Pulse = { key: string; teamId: string; start: number };
const PULSE_MS = 2300;

function Traffic({ pulses, curves }: { pulses: Pulse[]; curves: Record<string, THREE.QuadraticBezierCurve3> }) {
  const refs = useRef<Record<string, THREE.Mesh | null>>({});
  useFrame(() => {
    const now = performance.now();
    for (const p of pulses) {
      const m = refs.current[p.key];
      if (!m) continue;
      const t = Math.min(1, (now - p.start) / PULSE_MS);
      const pos = curves[p.teamId].getPoint(t);
      m.position.copy(pos);
      m.visible = t < 1;
    }
  });
  return (
    <group>
      {pulses.map((p) => (
        <mesh key={p.key} ref={(m) => { refs.current[p.key] = m; }} visible={false}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={INK[TEAMS.find((x) => x.id === p.teamId)!.world]} emissive={INK[TEAMS.find((x) => x.id === p.teamId)!.world]} emissiveIntensity={1.6} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ logs, cur, onPick, onHoverTeam }: {
  logs: Log[]; cur: Team; onPick: (t: Team) => void; onHoverTeam: (id: string | null) => void;
}) {
  const { resolvedTheme } = useTheme();
  const night = resolvedTheme === "dark";
  const curves = useCurves();
  const [hover, setHover] = useState<string | null>(null);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const seen = useRef<Set<string>>(new Set());
  const reduced = useMemo(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    if (reduced) return;
    const fresh = logs.slice(0, 12).filter((l) => {
      const k = `${l.ts}|${l.msg}`;
      if (seen.current.has(k)) return false;
      seen.current.add(k);
      return true;
    });
    if (!fresh.length) return;
    const now = performance.now();
    const add = fresh.map((l) => {
      const dir = String(l.team);
      const t = TEAMS.find((x) => dir.startsWith(x.id)) ?? TEAMS.find((x) => x.dir === dir) ?? TEAMS[4];
      return { key: `${l.ts}|${l.msg}`, teamId: t.id, start: now };
    });
    setPulses((p) => [...add, ...p].slice(0, 16));
    const id = setTimeout(() => {
      setPulses((p) => p.filter((x) => !add.some((a) => a.key === x.key)));
    }, PULSE_MS + 400);
    return () => clearTimeout(id);
  }, [logs, reduced]);

  const hoverBoth = (id: string | null) => { setHover(id); onHoverTeam(id); };

  return (
    <>
      <ambientLight intensity={night ? 0.85 : 1.05} />
      <hemisphereLight args={night ? ["#4a4132", "#14100b", 0.5] : ["#fff6e6", "#c9b995", 0.55]} />
      <directionalLight position={[5, 8, 4]} intensity={night ? 0.9 : 1.4} castShadow
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />
      <directionalLight position={[-4, 3, -5]} intensity={0.25} />
      <Grid position={[0, -0.12, 0]} args={[24, 24]} cellSize={0.6} cellThickness={0.6} cellColor={night ? "#2c251b" : "#cfc3a6"}
        sectionSize={3} sectionThickness={1} sectionColor={night ? "#4a4132" : "#a89a78"}
        fadeDistance={26} fadeStrength={2.2} infiniteGrid />
      <ContactShadows position={[0, -0.11, 0]} opacity={night ? 0.55 : 0.32} scale={16} blur={2.6} far={4} color={night ? "#000000" : "#5a4a30"} />
      <Rails curves={curves} hover={hover} night={night} />
      <Hub />
      {ACTIVE_TEAMS.map((t) => (
        <Island key={t.id} team={t} selected={t.id === cur.id}
          dimmed={hover !== null && hover !== t.id} night={night}
          onPick={() => onPick(t)} onHover={hoverBoth} />
      ))}
      <Traffic pulses={pulses} curves={curves} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.08}
        autoRotate={!reduced && hover === null} autoRotateSpeed={0.55}
        minDistance={4.5} maxDistance={17} maxPolarAngle={1.42} target={[0, 0.35, 0]} />
    </>
  );
}

/* 3D agent world. Real geometry, real bus traffic, full roam. */
export default function World3D({ logs, cur, onPick }: { logs: Log[]; cur: Team; onPick: (t: Team) => void }) {
  const latest = logs[0];
  return (
    <div className="relative" aria-label="Agent world in 3D">
      <div className="relative rounded border overflow-hidden"
        style={{ height: "min(58vh, 480px)", minHeight: 320, background: "hsl(var(--card-2))", touchAction: "none" }}>
        <Canvas key="world" shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 7.5, 10.5], fov: 42 }}
          fallback={<div className="grid h-full place-items-center t-small">3D unavailable here — the island list below still works.</div>}>
          <Suspense fallback={null}>
            <Scene logs={logs} cur={cur} onPick={onPick} onHoverTeam={() => {}} />
          </Suspense>
        </Canvas>
      </div>
      <div className="px-3 sm:px-4 pb-3 t-small t-mono truncate rule-single pt-2" style={{ color: "hsl(var(--muted-fg))" }} aria-live="polite">
        {latest ? <>— {String(latest.team).slice(0, 2)} {latest.from}→{latest.to} [{latest.phase}] · {latest.msg}</> : "— wire quiet — press Run ALL"}
      </div>
    </div>
  );
}
