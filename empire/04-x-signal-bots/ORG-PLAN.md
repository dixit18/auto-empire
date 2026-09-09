# ORG PLAN — 04 X Signal Bots (org: fintech alerts publisher)
Mission: sell milliseconds to people whose money depends on them.

## Placement
Shelf: trading/discord alpha, between free TweetDeck lists (slow, noisy) and Bloomberg terminals ($2k/mo, overkill). We are the sniper tier: one vertical, <1s, max 12 alerts/day. Start boring (sports injuries, politics markets) where LTV beats crypto churn; add degen tiers only with prepaid quarterly.

## Pricing architecture
- Retail $49: one feed (NFL injuries OR Polymarket politics), Telegram.
- Pro $199 (hero): all feeds + research briefs + sniper-bridge webhook.
- Desk $999: enterprise/whale — custom handles, SLA, invoice billing.
Math: 100×$49 + 20×$199 = $8.9k MRR. Anti-churn law: silence is the product — more than 12 alerts/day and bettors mute you. Weekly "alerts that printed" digest = retention email.

## Packaging
Telegram/Discord private channels (Whop-gated), alert format fixed (`[MARKET] what | slug | why | link | age`), speed badge on every alert ("3s after post" — proof of edge).

## Channels (ordered)
1. Free tier in 3 betting Discords (speed screenshots do the selling). 2. X posts of P&L proofs. 3. Whop paid groups. 4. MCP server for trading AI agents (2026 frontier, first-mover).

## 30-60-90 + kill
D30: 1 vertical live (NFL), 10 free users, 1 "saved my bet" testimonial. D60: 30 paid retail. D90: Pro tier live or kill second vertical. Kill rule: false-positive >5% = filter failure, halt billing until fixed (trust is inventory).
Needs: $49 firehose + bot token, Stripe/crypto rails, read-only market APIs (NEEDS.md).
