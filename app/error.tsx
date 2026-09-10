"use client";
import { useEffect } from "react";

/* Route-level safety net: a crashing section becomes a polite notice with
   a way back — never a dead full-page error. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    try {
      fetch("/api/logs", { cache: "no-store" }).catch(() => {});
    } catch {}
  }, []);
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="surface p-6 max-w-md text-center">
        <div className="t-kicker">Printing press jammed</div>
        <h1 className="t-h2 mt-1">This section misprinted.</h1>
        <p className="t-small mt-2" style={{ color: "hsl(var(--muted-fg))" }}>
          {error?.message ? `Shop note: ${error.message.slice(0, 140)}` : "The rest of the paper is fine — this page alone failed."}
        </p>
        <div className="mt-4 flex gap-2 justify-center">
          <button className="btn btn-primary" onClick={() => reset()}>Reprint page</button>
          <a className="btn btn-ghost" href="/">Front page</a>
        </div>
      </div>
    </div>
  );
}
