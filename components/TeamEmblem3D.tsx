"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import type { Team } from "@/lib/teams";

const INK: Record<string, string> = { forest: "#2e7d4f", beach: "#0b6e99", sunset: "#bd5a2e", lagoon: "#0e7c7b" };
const PASTEL = ["#b8e6c1", "#ffb7c5", "#fff3a0", "#b3dafe", "#d8b4fe"];

function Medallion({ team, night }: { team: Team; night: boolean }) {
  const g = useRef<THREE.Group>(null);
  const reduced = useMemo(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  useFrame(({ clock }) => {
    if (!g.current || reduced) return;
    g.current.rotation.y = clock.elapsedTime * 0.5;
    g.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.08;
  });
  const n = parseInt(team.id, 10);
  return (
    <group ref={g}>
      <mesh castShadow>
        <cylinderGeometry args={[0.85, 1.05, 0.5, 36]} />
        <meshStandardMaterial color={night ? "#2b2318" : "#fffdf6"} roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.07, 14, 48]} />
        <meshStandardMaterial color={INK[team.world]} roughness={0.6} />
      </mesh>
      <mesh position={[0.32, 0.62, 0.1]}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshStandardMaterial color={PASTEL[n % PASTEL.length]} roughness={0.95} />
      </mesh>
      <mesh position={[-0.3, 0.5, -0.15]}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color={PASTEL[(n + 2) % PASTEL.length]} roughness={0.95} />
      </mesh>
    </group>
  );
}

/* Pocket 3D emblem: this world's clay medallion, slowly turning. */
export default function TeamEmblem3D({ team }: { team: Team }) {
  const { resolvedTheme } = useTheme();
  const night = resolvedTheme === "dark";
  const [ok, setOk] = useState(true);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      if (!c.getContext("webgl2") && !c.getContext("webgl")) setOk(false);
    } catch { setOk(false); }
  }, []);
  if (!ok) return null;
  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 1.6, 3.4], fov: 38 }}>
      <ambientLight intensity={night ? 0.9 : 1.1} />
      <hemisphereLight args={night ? ["#4a4132", "#14100b", 0.5] : ["#fff6e6", "#c9b995", 0.6]} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} castShadow />
      <Medallion team={team} night={night} />
    </Canvas>
  );
}
