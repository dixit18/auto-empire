# 04 - X Signal Bots (Fintech / Betting / Crypto)
Industry: Fintech | Model: $49-499/mo | Target: $10k MRR from boring verticals

## Business
Problem: Money moves in seconds on X. Humans 1-30s slower. Polymarket bettors, sports bettors, crypto snipers lose edge.
Solution: Real-time X firehose (400ms median) + AI filter per niche. Telegram/Discord alerts. No infra build - wholesale $49/mo + $20 AI coder.
Products: (a) Polymarket politics alpha $99-299, (b) NFL injury feed $29-99, (c) KOL contract drops $19-49, (d) Hack/exploit detector $199 for protocols.
Math: 20 x $199 (B2B) = $4k, 100 x $49 retail = $4900. Enterprise $999-2499 x5 = real money.
Moat: Speed + specificity. Crypto churns, boring verticals (pharma $499, PR) retain.

## TEAM
**MASTER: Signal Chief**
Prompt: "You run speed business. Coordinate Watcher, Filter, Dispatcher. Latency <1s p95. No false positives >5%. Charge on saved trade."

**A1 - Watcher:** Manages WebSocket handles list (80 politics journalists OR 40 beat writers OR 50 KOLs). Maintains allowlist.
**A2 - Filter (AI):** Scores tweet: contract? injury? FDA? Predicts virality (>100k in 6h?). Drops noise.
**A3 - Dispatcher:** Formats Telegram/Discord/SMS alert + auto-research brief (sentiment, past mentions). Handles Stripe + crypto (Helio/NOWPayments) access.
**A4 - RiskGuard:** Budget caps, kill-switch, compliance (no financial advice disclaimer), churn watch.

Handoff: Watcher -> Filter (<1s) -> Dispatcher -> user trade -> RiskGuard logs P&L proof for marketing.

## PHASES
P0 (Weekend): Pick ONE vertical (e.g., NFL). Paste docs URL into Claude Code, ship Telegram bot. Track 20 handles.
P1 (Wk2-4): 10 free users, measure speed vs TweetCatcher. Get 1 testimonial "saved $1k bet".
P2 (Mo2): Stripe + Whop paid group $49/mo. Post P&L screenshots on X.
P3 (Mo3+): Add MCP server for AI agents, sniper bridge $299/mo, enterprise outreach.

KPIs: Median latency, false positive %, paying subs, LTV (boring > crypto).
First $100: 2 x $49 pre-sale to betting Discord.
Warning: Always have crypto rail (Stripe drops crypto merchants). Bear market = churn, build for both seasons.
