# Compound rev — GPT #2 spec: Etsy Keyword Researcher (Researcher → Builder)
Date: 2026-09-08. Audience: same Etsy sellers as GPT #1 (description writer) — cross-sell, not new audience.

INPUT: shop niche (1 line) + 3 competitor listing URLs.
OUTPUT: (1) 13 Etsy tags ranked by intent, (2) title rewrite under 140 chars with primary keyword front-loaded, (3) 5 long-tail pin descriptions, (4) "don't target" list (saturated terms with reasoning).
KNOWLEDGE FILES: eRank top-1000 2026 search dump (curated), our own tag CTR notes from team 05, banned-keyword list (trademark traps: Disney, Taylor, etc.).
TESTS (must pass 5/5 before ship): "poetcore stationery" (niche, low comp), "adhd planner" (mid comp, must warn + niche down), trademark input (must refuse + suggest alternative), empty niche (must ask 3 clarifying questions, never hallucinate tags), duplicate competitor URLs (must flag, not copy).
PRICING: bundle with GPT #1 at $39/mo (was $29 single) — suite discount drives the cross-sell. Free 3-message preview, then paywall.
DEMO VIDEO (90s): paste competitor URL → watch tags + title rewrite appear → "this used to take me 40 minutes."
