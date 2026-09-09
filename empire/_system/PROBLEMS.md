# OPEN PROBLEMS — 6 fundable AI theses (R&D: Reddit, HN, X, IndieHackers, Sep 2026)
Rule: no blog-listicle problems. Each below has forum blood on it, a payer, and an open-source wedge we can build without API keys.

## T1 — Agent side-effect safety (the double-email problem)
**Forum blood:** r/LangChain builder's agent crashed mid-run, restarted, "sent the same email twice to a customer". Reply consensus: "Retries are inevitable. Duplicate side effects don't have to be." HN, Sep 2026: autonomous-business benchmark agents sent $12,431 in fake invoices — fake, but the failure MODE is real: agents with money+email and no guardrails. Gartner: 40%+ agentic projects face cancellation over cost + weak risk controls. Math: 0.85^10 ≈ 0.20 — ten-step agents fail 4 times in 5.
**Who bleeds:** every team shipping agents past demo; enterprises frozen by legal.
**Why unsolved:** frameworks sell capability, not receipts. "Conversation history is an unreliable receipt" — the model SAID it sent the email; did it commit?
**OSS wedge:** idempotency ledger + tool-call receipts (exactly our Effect-typed bus pattern, extracted as a library). Every side effect gets a key, a receipt, a replay rule.
**Business:** free OSS core → hosted ledger + policy packs per seat. Fundable: compliance + reliability in one story.
**Why we win:** we already run this pattern (bus/HANDOFF/approvals). Dogfood on our own 11 crews first.

## T2 — Live context metering (the bill you feel too late)
**Forum blood:** IndieHackers founder: dashboards never changed behavior; a live token bar did ("visibility changes behavior more than postmortems"). Engineer audit of 3 Claude Code sessions: 32:1 re-read ratio, $4.5k cached vs $31k uncached, compactions as the "tax getting paid off". 41% of orgs paused AI projects over cost overruns.
**Who bleeds:** every heavy agent/IDE user; finance teams seeing 3× cloud bills.
**Why unsolved:** vendors sell the meter, not the discipline. Cost shows up after the session, when habits can't change.
**OSS wedge:** live context meter (menu bar / editor gutter / CLI) + auto-compact policies + per-turn budget alarms. 100% local parsing of transcript JSONL — no keys needed.
**Business:** free meter → team rollups, budget guardrails, company-wide policies.
**Why we win:** our orchestrator already emits per-task costs; we feel this pain daily.

## T3 — Cache-aligned context compiler (memory that doesn't torch the cache)
**Forum blood:** engineering benchmarks: naive KV cache-hit 12% vs 86% stateful; managed memory (Mem0/Letta/Zep) adds a 50–200ms hop AND returns dynamic strings that break provider prefix caching. Teams pay twice: latency + full-price tokens.
**Who bleeds:** high-volume agent operators (20k+ runs/mo), anyone past $10k/mo inference.
**Why unsolved:** memory vendors optimize recall demos, not byte-stable prefixes. Frameworks abstract away the exact thing that saves money.
**OSS wedge:** deterministic context builder with byte-level prefix control + live cache-hit dashboard. Boring, fast, honest.
**Business:** gateway pricing (fraction of saved spend) or hosted compiler.
**Why we win:** Effect Schema gives us exact-shape context for free; our bus already versions every state.

## T4 — Eval-as-code for indie LLM shippers (the $249/mo wall)
**Forum blood:** DEV indie guide: Braintrust $249/LangSmith $99 don't exist pre-PMF; rubric + 20–50 goldens + cheap-judge CI runs cost ~£0.20 and caught a context-dropping regression in 4 minutes that manual testing missed.
**Who bleeds:** every indie shipping prompts; our own Team 06 GPT suite most of all.
**Why unsolved:** incumbents sell platforms to enterprises. Indies need a GitHub Action + templates, not a sales call.
**OSS wedge:** eval action + golden-dataset templates for 6 use cases + judge prompts + threshold gates. Copy-paste, no tweaking.
**Business:** free action → hosted trend dashboards, private benchmark sharing, model-compare reports.
**Why we win:** build it for our GPT suite first; sell the scars.

## T5 — Safe-autonomy sandbox (agents with wallets need cages)
**Forum blood:** HN invoice-fraud thread: "pull the trigger, you did the murder" — operators are liable for agent actions. Gartner cancellations cite weak risk controls. Nobody ships the cage, everybody ships the agent.
**Who bleeds:** finance/HR/support automation buyers; compliance officers blocking every pilot.
**Why unsolved:** safety is sold as enterprise consulting, not as a default-deny runtime normal people can install.
**OSS wedge:** policy sandbox: allowlisted tools, spend caps, human-gate queues, full audit trail — our approvals pattern hardened into a runtime any agent framework plugs into.
**Business:** OSS runtime → enterprise policy packs, audit exports, SSO.
**Why we win:** our approvals queue + bus IS v0. Extract, harden, publish.

## T6 — Sub-second local voice loop (no-cloud conversation)
**Forum blood:** voice agents split into $0.02/min cloud pipelines (1–3s latency, dead air, no interruption) vs local models with no streaming orchestration. Real-time feel is the product; latency is the product failing.
**Who bleeds:** clinics, reception desks, drive-throughs, elder-care — places that can't send audio to the cloud anyway.
**Why unsolved:** each piece exists (VAD, STT, LLM, TTS) but nobody ships the boring glue that hits <800ms locally: barge-in, partial playback kill, turn-taking state machine.
**OSS wedge:** local loop kit (VAD + streaming STT + small LLM + Piper-class TTS) with a latency budget dashboard per stage. Runs on one machine, no keys.
**Business:** hosted voices, enterprise on-prem boxes, per-minute support.
**Why we win:** our sleep-audio + video pipeline becomes the demo; Piper test below is step one.

## Meta-thesis
2024 was the year of the model. 2026 is the year of the system — receipts, meters, compilers, evals, cages, loops. All six are plumbing, all six are fundable, all six start as open source we can build with what's on this machine today.
