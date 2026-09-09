import { THESES } from "@/lib/theses";

/* About this empire: the open problems we're hunting, plainly stated.
   Full R&D with forum receipts: empire/_system/PROBLEMS.md */
export default function Theses() {
  return (
    <div>
      <div className="t-kicker mb-1">§ 06 — About · problems worth funding</div>
      <h2 className="t-h2 max-w-prose">2024 was the year of the model. 2026 is the year of the system.</h2>
      <p className="t-body mt-1 max-w-prose" style={{ color: "hsl(var(--muted-fg))" }}>
        Six problems with forum blood on them — each unsolved or badly solved, each with a payer,
        each startable as open source on this machine. Tap any thesis for the wedge and the money.
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {THESES.map((t) => (
          <details key={t.n} className="surface p-3 group">
            <summary className="cursor-pointer list-none flex items-baseline gap-2">
              <span className="t-mono font-extrabold" style={{ color: "hsl(var(--primary))" }}>{t.n}</span>
              <b style={{ fontFamily: "var(--font-serif)", fontSize: "1.02rem" }}>{t.title}</b>
              <span className="ml-auto t-small transition-transform group-open:rotate-90" aria-hidden>›</span>
            </summary>
            <div className="t-small mt-2 space-y-1.5">
              <p><b>The pain — </b><span style={{ color: "hsl(var(--muted-fg))" }}>{t.pain}</span></p>
              <p><b>The wedge — </b>{t.wedge}</p>
              <p><b>The money — </b>{t.money}</p>
            </div>
          </details>
        ))}
      </div>
      <p className="t-small t-mono mt-2" style={{ color: "hsl(var(--muted-fg))" }}>
        receipts: r/AI_Agents · r/LangChain · Hacker News · IndieHackers · DEV — full notes in repo
      </p>
    </div>
  );
}
