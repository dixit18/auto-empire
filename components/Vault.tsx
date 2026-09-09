"use client";
import { useEffect, useState } from "react";
import { Card } from "./ui";
import type { Team } from "@/lib/teams";

type F = { path: string; size: number; kind: string };
const kb = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const name = (p: string) => p.split("/").pop() ?? p;
const folder = (p: string) => p.split("/").slice(1, -1).join(" / ");

/* The Vault — every shippable artifact of this team, playable in place.
   Films play, images show, documents open (printables print straight to PDF). */
export default function Vault({ team }: { team: Team }) {
  const [files, setFiles] = useState<F[] | null>(null);
  useEffect(() => {
    fetch(`/api/files?team=${team.id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setFiles(Array.isArray(j.files) ? j.files : []))
      .catch(() => setFiles([]));
  }, [team.id]);

  if (files === null)
    return <Card><div className="t-kicker">§ The Vault</div><div className="skeleton mt-2" style={{ height: 120 }} /></Card>;

  const films = files.filter((f) => f.path.endsWith(".mp4"));
  const audio = files.filter((f) => f.path.endsWith(".mp3"));
  const pics = files.filter((f) => /\.(png|jpe?g)$/.test(f.path) && !/seg\d/.test(f.path));
  const docs = files.filter((f) => /\.(md|txt|html|pdf|json)$/.test(f.path));
  const url = (p: string) => `/api/file?path=${encodeURIComponent(p)}`;

  return (
    <Card>
      <div className="flex items-baseline gap-2">
        <h2 className="t-h2">The Vault</h2>
        <span className="t-small t-num ml-auto" style={{ color: "hsl(var(--muted-fg))" }}>{files.length} artifacts</span>
      </div>

      {films.length > 0 && (
        <div className="mt-3">
          <div className="t-kicker mb-2">Films</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {films.map((f) => (
              <figure key={f.path} className="surface-2 p-2">
                <video src={url(f.path)} controls preload="metadata" playsInline
                  style={{ width: "100%", borderRadius: 6, background: "#000", maxHeight: 380 }} />
                <figcaption className="t-small t-mono mt-1.5 flex justify-between gap-2" style={{ color: "hsl(var(--muted-fg))" }}>
                  <span className="truncate">{name(f.path)}</span><span className="shrink-0">{kb(f.size)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {audio.length > 0 && (
        <div className="mt-4">
          <div className="t-kicker mb-2">Audio</div>
          <div className="space-y-2">
            {audio.map((f) => (
              <div key={f.path} className="surface-2 p-2.5">
                <div className="t-small flex justify-between gap-2 mb-1.5">
                  <b className="truncate">{prettyDoc(name(f.path))}</b>
                  <span className="t-mono shrink-0" style={{ color: "hsl(var(--muted-fg))" }}>{kb(f.size)}</span>
                </div>
                <audio src={url(f.path)} controls preload="metadata" style={{ width: "100%" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {pics.length > 0 && (
        <div className="mt-4">
          <div className="t-kicker mb-2">Gallery</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {pics.map((f) => (
              <a key={f.path} href={url(f.path)} target="_blank" rel="noreferrer" className="surface-2 p-1.5 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url(f.path)} alt={name(f.path)} loading="lazy" style={{ width: "100%", borderRadius: 4, aspectRatio: "9/16", objectFit: "cover", maxHeight: 220 }} />
                <div className="t-small t-mono truncate mt-1" style={{ color: "hsl(var(--muted-fg))" }}>{name(f.path)}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="t-kicker mb-2">Documents — use cases</div>
        <ul className="space-y-1.5">
          {docs.map((f) => (
            <li key={f.path} className="surface-2 px-2.5 py-2 t-small flex items-center gap-2 min-w-0">
              <span className="min-w-0 flex-1">
                <b className="block truncate">{prettyDoc(name(f.path))}</b>
                <span className="t-mono block truncate" style={{ fontSize: "0.7rem", color: "hsl(var(--muted-fg))" }}>{folder(f.path)} · {kb(f.size)}</span>
              </span>
              <a className="btn btn-ghost shrink-0" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }}
                href={url(f.path)} target="_blank" rel="noreferrer">Open →</a>
            </li>
          ))}
          {docs.length === 0 && <li className="t-small" style={{ color: "hsl(var(--muted-fg))" }}>No documents yet.</li>}
        </ul>
      </div>
    </Card>
  );
}

function prettyDoc(n: string) {
  return n.replace(/\.(md|txt|html|pdf|json)$/, "").replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
