# 01 - Voice-Clone Ghostwriter (Creator Economy)
Industry: Creator Economy | Model: SaaS $49-149/mo | Target: $1740 MRR from 60 subs

## Business
Problem: Founders know they need X/LinkedIn but hate blank page. Human ghostwriter $5000/mo.
Solution: SMS Head of Content. Text idea -> get thread in your voice. Learns from podcasts, transcripts, past posts + last30days trend research.
ICP: Indie hackers, SaaS founders $5k-50k MRR, coaches.
Pricing: Starter $49, Pro $99, Agency $149. Anchor vs $5000 human.
Math: 60 x $29 = $1740, 12 x $1500 DFY = $18k agency upside.
Moat: Voice profile that compounds (month 6 >> month 1).

## TEAM - Master + Sub-Agents
**MASTER: Chief Content Officer (CCO)**
Role: Owns pipeline, assigns phases, QA final output, talks to other masters via dashboard.
System prompt: "You are CCO. Goal $5k MRR. Coordinate VoiceMiner, TrendScout, Writer, CTAOptimizer. Phase-wise only. Reject generic slop. Require voice match >85%. Ask human for approval before publish."

**A1 - VoiceMiner:** Scrapes client X, LinkedIn, transcripts -> builds voice.json (tone, hooks, phrases, banned words). Output: voice profile v1.
**A2 - TrendScout (last30days):** Pulls Reddit/X/web last 30d for niche, returns 5 signals with engagement numbers. No generic summaries.
**A3 - GhostWriter:** Takes voice.json + signal -> drafts 3 tweets + 1 thread + 1 LinkedIn post. Enforces hook patterns, 1-3 sentence video variant.
**A4 - CTAOptimizer:** Adds reply CTA linking to waitlist/newsletter, 2-3 angles, tracks CTR.

Handoff: VoiceMiner -> TrendScout -> Writer -> CTAOptimizer -> MASTER review -> human approval (15 min/week).

## PHASES
Phase 0 (Days 1-3) Validation: MASTER tasks TrendScout to find 10 founder pains. Tweet "Thinking of building X, who wants it?" Need 10 replies to proceed.
Phase 1 (Days 4-14) MVP: VoiceMiner builds YOUR voice first. Writer ships via SMS (Twilio) + OpenAI API. No dashboard yet. Cost ~$20 + $0.10-0.40/day API.
Phase 2 (Days 15-30) Launch: Build in public, free PDF case study for RT. Launch Product Hunt. Goal 100 signups, 10 paid.
Phase 3 (Mo 2-6) Scale: Add LinkedIn module, referral loop, SEO "AI Head of Content". Retention via daily SMS habit.

KPIs: Voice match, posts/week (>=7), follower growth, trial->paid (>15%), churn <8%.
First $100: DFY 1 founder $150 for 30 days content, use to train agent.
