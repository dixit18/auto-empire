"use client";
import { useState } from "react";
import { Button } from "./ui";

/* Real working tools. Deterministic, no API keys — the same logic our agents
   run, live in your hands. LLM warmth comes later; the machinery is real today. */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="t-small font-bold" style={{ color: "hsl(var(--muted-fg))" }}>{label}</span>
      <span className="block mt-1">{children}</span>
    </label>
  );
}
const inputCls = "w-full surface-2 px-2.5 py-2 t-small";
const inputStyle = { background: "hsl(var(--card))" } as const;

function Out({ title, lines }: { title: string; lines: string[] }) {
  if (!lines.length) return null;
  return (
    <div className="mt-2">
      <div className="t-kicker mb-1">{title}</div>
      <ol className="space-y-1.5">
        {lines.map((l, i) => (
          <li key={i} className="surface-2 px-2.5 py-2 t-small flex gap-2">
            <b className="t-mono shrink-0" style={{ color: "hsl(var(--primary))" }}>{i + 1}</b>
            <span>{l}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* 01 — hook formatter: idea in, 3 engineered hooks out. */
export function HookCrafter() {
  const [idea, setIdea] = useState("");
  const [out, setOut] = useState<string[]>([]);
  function run() {
    const t = idea.trim().replace(/\.$/, "");
    if (!t) return;
    setOut([
      `I replaced my $5k/mo ghostwriter with this: ${t}. Here's the system.`,
      `Nobody talks about ${t} — but everyone with revenue does it daily.`,
      `Stop doing ${t} wrong. Do THIS instead (takes 15 min).`,
    ]);
  }
  return (
    <div>
      <Field label="Your raw idea">
        <input value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="e.g. posting daily on X"
          className={inputCls} style={inputStyle} onKeyDown={(e) => e.key === "Enter" && run()} />
      </Field>
      <div className="mt-2"><Button onClick={run}>Forge hooks</Button></div>
      <Out title="3 engineered hooks" lines={out} />
    </div>
  );
}

/* 06 — Etsy title rewriter: keyword front-load + 140-char guard (the real rule). */
export function TitleRewriter() {
  const [kw, setKw] = useState("");
  const [prod, setProd] = useState("");
  const [out, setOut] = useState<string[]>([]);
  function run() {
    const k = kw.trim(), p = prod.trim();
    if (!k || !p) return;
    const cap = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
    const t1 = `${cap(k)} — ${cap(p)}, Handmade Gift, Instant Download`;
    const t2 = `${cap(p)}, ${cap(k)} for Her, Birthday Gift, Printable Wall Art`;
    const trim = (s: string) => (s.length <= 140 ? s : s.slice(0, 137) + "…");
    setOut([trim(t1) + `  [${t1.length}→${trim(t1).length} chars]`, trim(t2) + `  [${t2.length}→${trim(t2).length} chars]`]);
  }
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Field label="Primary keyword (what buyers type)">
        <input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="adhd planner printable"
          className={inputCls} style={inputStyle} />
      </Field>
      <Field label="Product (what it is)">
        <input value={prod} onChange={(e) => setProd(e.target.value)} placeholder="daily focus pages"
          className={inputCls} style={inputStyle} onKeyDown={(e) => e.key === "Enter" && run()} />
      </Field>
      <div className="sm:col-span-2"><Button onClick={run}>Rewrite titles</Button></div>
      <div className="sm:col-span-2"><Out title="2 titles, keyword front-loaded, ≤140 chars" lines={out} /></div>
    </div>
  );
}

/* 08 — review responder: on-brand replies with de-escalation guardrails. */
export function ReviewResponder() {
  const [biz, setBiz] = useState("");
  const [rev, setRev] = useState("");
  const [stars, setStars] = useState("5");
  const [out, setOut] = useState<string[]>([]);
  function run() {
    const b = biz.trim() || "our salon";
    const r = rev.trim();
    if (!r) return;
    if (Number(stars) <= 2) {
      setOut([`DRAFT ONLY — never auto-post 1–2★ replies. Suggested owner message: "We're sorry to hear this. ${b} would like to make it right — what's the best number to reach you?" (sends to owner for approval)`]);
      return;
    }
    const detail = r.split(/[, once.]/)[0].slice(0, 60);
    setOut([`Thank you! So glad you loved ${detail || "your visit"} — see you next time at ${b}. ✨ (reads specific, not canned)`]);
  }
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
      <Field label="Business name">
        <input value={biz} onChange={(e) => setBiz(e.target.value)} placeholder="Luxe Nails" className={inputCls} style={inputStyle} />
      </Field>
      <Field label="Stars">
        <select value={stars} onChange={(e) => setStars(e.target.value)} className={inputCls} style={inputStyle}>
          <option value="5">★★★★★</option><option value="4">★★★★</option>
          <option value="3">★★★</option><option value="2">★★</option><option value="1">★</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Review text">
          <textarea value={rev} onChange={(e) => setRev(e.target.value)} rows={2} placeholder="Paste the review…"
            className={inputCls} style={inputStyle} />
        </Field>
      </div>
      <div className="sm:col-span-2"><Button onClick={run}>Draft reply</Button></div>
      <div className="sm:col-span-2"><Out title="On-brand reply" lines={out} /></div>
    </div>
  );
}

/* 03 — intent scorer: paste a Reddit-style post, get High/Med/Low + why. Same rules as the miner. */
export function IntentScorer() {
  const [post, setPost] = useState("");
  const [out, setOut] = useState<string[]>([]);
  const HIGH = ["looking for", "recommend", "alternative to", "switch from", "paying for", "need something that", "anyone know a tool"];
  const MED = ["how do you", "workflow", "stack", "currently using", "thoughts on"];
  function run() {
    const p = post.toLowerCase();
    if (!p.trim()) return;
    const h = HIGH.filter((k) => p.includes(k));
    const m = MED.filter((k) => p.includes(k));
    if (h.length) setOut([`HIGH intent — buying signals: ${h.join("; ")}. Action: helpful reply + soft PS within 24h.`]);
    else if (m.length) setOut([`MEDIUM intent — researching (${m.join("; ")}). Action: genuinely useful answer, no pitch; tag for nurture.`]);
    else setOut(["LOW intent — no buying language found. Action: skip or answer briefly for karma."]);
  }
  return (
    <div>
      <Field label="Paste the post">
        <textarea value={post} onChange={(e) => setPost(e.target.value)} rows={3} placeholder="We're looking for a tool that handles review replies for our salon…"
          className={inputCls} style={inputStyle} />
      </Field>
      <div className="mt-2"><Button onClick={run}>Score intent</Button></div>
      <Out title="Verdict" lines={out} />
    </div>
  );
}

/* Pre-order / intent form: the YC instrument. Real money-signal capture. */
export function IntentForm({ team, item, cta = "Pre-order" }: { team: string; item: string; cta?: string }) {
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  async function send() {
    if (!contact.trim()) return;
    setBusy(true);
    try {
      const r = await fetch("/api/intent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team, contact, item, note }),
      });
      if ((await r.json()).ok) setDone(true);
    } finally { setBusy(false); }
  }
  if (done) return <p className="t-body">✓ Noted — you're on the list. We build in order of this queue.</p>;
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Field label="Where do we reach you? (email / handle)">
        <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@email.com"
          className={inputCls} style={inputStyle} />
      </Field>
      <Field label="Anything we should know? (optional)">
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="dog: 9yo beagle…"
          className={inputCls} style={inputStyle} onKeyDown={(e) => e.key === "Enter" && send()} />
      </Field>
      <div className="sm:col-span-2"><Button loading={busy} onClick={send}>{cta} — {item}</Button></div>
    </div>
  );
}
