# AGENT SYSTEM - How Your 10 Teams Work

You asked for: 1 master per team + sub-agents below, phase-wise tasks, agents talk to each other, UI to watch live.

## Architecture (works with opencode / Claude / any agent runner)
Each company folder has a MASTER prompt + 4 workers. MASTER is the only one you talk to.

```
YOU (approve) <-> MASTER (plans, QA) <-> A1, A2, A3, A4 (execute)
MASTERS <-> MASTERS (share learnings via dashboard bus)
```

Example handoff (Team 01):
VoiceMiner outputs voice.json -> TrendScout adds signals.json -> Writer drafts -> CTAOptimizer adds CTA -> MASTER checks voice match >85% -> asks YOU to approve -> publish.

## How to run a team today (no extra infra)
1. Open dashboard/index.html in browser (double-click).
2. Click a team -> press Start. Watch simulated live logs.
3. To run for real: copy MASTER prompt from that team's README into opencode Task tool:
   Example: "You are CCO for 01-voice-clone-ghostwriter. Execute Phase 0. Coordinate subagents via Task tool."
4. Human approval required before money moves (Stripe, posting, outreach). This is intentional - prevents spam/bans.

## Agent-to-agent protocol
- All agents write to `empire/_bus/<team>-log.jsonl` (dashboard reads this).
- Format: {time, from, to, phase, task, status: started|done|needs-approval, output}
- MASTER decides best path phase-wise, re-assigns if worker fails.
- Masters share weekly: e.g., #03 Reddit Miner feeds leads to #08 LocalBiz + #05 Etsy validation.

## Phases (same for all 10)
P0 Validation (3-5d): 10 customer replies or kill idea.
P1 MVP (2w): Ship ugly, 1 niche, <$50 cost.
P2 Launch (2-4w): Build in public, 100 signups / 10 paid.
P3 Scale (mo3-6): Retention + cross-sell between your 10 companies.

## Honest limits
Dashboard right now = live simulation + task tracker. Real passive income needs:
- API keys (OpenAI $3-12/mo, Twilio, Stripe, Replicate)
- You approving 15-45 min/day (that's the actual $4k-18k/mo workflow data)
- 2-8 weeks to first $100, not overnight.

Start with ONE team (#05 if no audience, #01 if you have X followers, #03 if you want B2B cash). Don't run 10 at once day 1.
