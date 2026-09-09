export type Thesis = { n: string; title: string; pain: string; wedge: string; money: string };
export const THESES: Thesis[] = [
  { n: "T1", title: "Agent side-effect safety", pain: "Retries re-fire real actions — one crashed agent emailed a customer twice; benchmark agents invoiced $12k of fiction.", wedge: "OSS idempotency ledger + tool-call receipts (our bus pattern, extracted).", money: "Free core → hosted ledger per seat." },
  { n: "T2", title: "Live context metering", pain: "32:1 token re-read ratio; $4.5k cached vs $31k uncached; 41% of orgs paused AI over bills.", wedge: "Local live meter + auto-compact policies. No keys, parses transcripts.", money: "Free meter → team guardrails." },
  { n: "T3", title: "Cache-aligned context compiler", pain: "Memory tools torch KV-cache prefixes (12% hits); managed hops add 200ms.", wedge: "Deterministic byte-stable builder + cache-hit dashboard.", money: "Gateway cut of saved spend." },
  { n: "T4", title: "Eval-as-code for indies", pain: "$249/mo eval platforms don't exist pre-PMF; regressions ship silently.", wedge: "GitHub Action + golden templates + cheap-judge gates for £0.20/run.", money: "Free action → hosted trends." },
  { n: "T5", title: "Safe-autonomy sandbox", pain: "Operators are liable for agent actions; compliance blocks every pilot.", wedge: "Default-deny runtime: allowlists, spend caps, human gates (our approvals, hardened).", money: "OSS runtime → enterprise packs." },
  { n: "T6", title: "Sub-second local voice loop", pain: "Cloud voice = 1–3s dead air; local models lack streaming glue; clinics can't cloud audio.", wedge: "VAD + streaming STT + small LLM + Piper TTS kit with per-stage latency budget.", money: "Hosted voices, on-prem boxes." },
];
