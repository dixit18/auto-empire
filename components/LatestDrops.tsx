"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Drop = { team: string; dir: string; path: string; size: number; mtime: number; kind: string };
const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(0)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const url = (p: string) => `/api/file?path=${encodeURIComponent(p)}`;
const name = (p: string) => p.split("/").pop()!.replace(/\.(mp4|mp3|png|jpe?g|pdf)$/, "").replace(/[-_]/g, " ");

/* Fresh drops — the newest shippable artifacts, playable right here. */
export default function LatestDrops() {
  const [drops, setDrops] = useState<Drop[] | null>(null);
  useEffect(() => {
    fetch("/api/latest", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setDrops(Array.isArray(j.drops) ? j.drops : []))
      .catch(() => setDrops([]));
  }, []);
  if (!drops) return null;
  if (!drops.length) return null;
  return (
    <div>
      <div className="t-kicker mb-2">§ Fresh drops — newest from the crews</div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {drops.map((d) => (
          <div key={d.path} className="surface p-2 flex flex-col min-w-0">
            {d.kind === "film" && (
              <video src={url(d.path)} controls preload="metadata" playsInline style={{ width: "100%", borderRadius: 4, background: "#000", aspectRatio: "9/16", maxHeight: 240 }} />
            )}
            {d.kind === "audio" && <audio src={url(d.path)} controls preload="metadata" style={{ width: "100%" }} />}
            {d.kind === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url(d.path)} alt={d.path} loading="lazy" style={{ width: "100%", borderRadius: 4, aspectRatio: "16/10", objectFit: "cover" }} />
            )}
            {d.kind === "doc" && (
              <a href={url(d.path)} target="_blank" rel="noreferrer" className="surface-2 grid place-items-center t-h2"
                style={{ aspectRatio: "16/10", textDecoration: "none" }} aria-label={`Open ${d.path}`}>❏</a>
            )}
            <div className="t-small mt-1.5 truncate"><b className="capitalize">{name(d.path)}</b></div>
            <div className="t-small t-mono flex gap-2 items-center" style={{ color: "hsl(var(--muted-fg))" }}>
              <Link href={`/${d.dir}`} className="font-bold" style={{ color: "hsl(var(--primary))" }}>Team {d.team} →</Link>
              <span>{kb(d.size)}</span>
              <span>{new Date(d.mtime).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
