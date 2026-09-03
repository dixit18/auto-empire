export type Team = { id: string; dir: string; name: string; industry: string; master: string; world: string; price: string; kpi: string[]; phases: string[]; };
export const TEAMS: Team[] = [
  { id: "01", dir: "01-voice-clone-ghostwriter", name: "Voice-Clone Ghostwriter", industry: "Creator Economy", master: "Chief Content Officer", world: "forest", price: "$49-149/mo", kpi: ["60 subs = $1740", "Voice >85%"], phases: ["P0 pains", "P1 SMS bot", "P2 PH launch", "P3 LinkedIn"] },
  { id: "02", dir: "02-faceless-youtube-engine", name: "Faceless YouTube Engine", industry: "Media", master: "Showrunner", world: "sunset", price: "Ads + affiliate", kpi: ["$2400-4500/mo", "2/day"], phases: ["P0 niche", "P1 30 Shorts", "P2 longs", "P3 sponsors"] },
  { id: "03", dir: "03-reddit-intent-miner", name: "Reddit Intent Miner", industry: "B2B SaaS", master: "Pipeline Commander", world: "lagoon", price: "$99-299/seat", kpi: ["20 = $5k", "10 leads/wk"], phases: ["P0 20 subs", "P1 auto", "P2 betas", "P3 email"] },
  { id: "04", dir: "04-x-signal-bots", name: "X Signal Bots", industry: "Fintech", master: "Signal Chief", world: "beach", price: "$49-499/mo", kpi: ["<1s latency", "boring > crypto"], phases: ["P0 NFL bot", "P1 proof", "P2 $49", "P3 MCP"] },
  { id: "05", dir: "05-etsy-pinterest-digital", name: "Etsy Pinterest Digital", industry: "E-commerce", master: "Trend Director", world: "forest", price: "$7-49", kpi: ["95% margin", "600/pack"], phases: ["P0 5 listings", "P1 pins", "P2 bundles", "P3 email"] },
  { id: "06", dir: "06-custom-gpt-suite", name: "Custom GPT Suite", industry: "AI Tools", master: "GPT Product Lead", world: "sunset", price: "$29 + $149", kpi: ["$3528/6mo", "12-18% conv"], phases: ["P0 3 GPTs", "P1 demos", "P2 outreach", "P3 10 GPTs"] },
  { id: "07", dir: "07-staging-interior-ai", name: "Staging Interior AI", industry: "PropTech", master: "Property Visual Lead", world: "beach", price: "$29/mo", kpi: ["share >15%", "<$0.30 GPU"], phases: ["P0 10 free", "P1 Replicate", "P2 FB", "P3 $49"] },
  { id: "08", dir: "08-localbiz-autopilot", name: "LocalBiz Autopilot", industry: "Local Services", master: "Ops Manager", world: "lagoon", price: "$199-499/mo", kpi: ["<60s reply", "10 = $4k"], phases: ["P0 salons", "P1 GHL", "P2 outreach", "P3 productize"] },
  { id: "09", dir: "09-wellness-audio", name: "Wellness Audio", industry: "Wellness", master: "Wellness Curator", world: "forest", price: "$12 + $19/mo", kpi: ["repeat 7d", "<10% refund"], phases: ["P0 20 emails", "P1 10-track", "P2 member", "P3 white-label"] },
  { id: "10", dir: "10-micro-course-factory", name: "Micro-Course Factory", industry: "EdTech", master: "Dean", world: "sunset", price: "$29 + $19/mo", kpi: [">40% finish", "NPS"], phases: ["P0 presell 10", "P1 film 10d", "P2 launch", "P3 stack"] },
];
export const FUTURE_IDEAS = [
  { t: "Voice Cloning for Podcasts", d: "1 voice note -> week of shorts + newsletter. Forest, parrot mascot.", world: "forest" },
  { t: "Beach Airbnb Price Oracle", d: "Daily price + photo score for hosts. Beach, crab assistant.", world: "beach" },
  { t: "Meme-to-Merch Flash Factory", d: "Viral X meme -> Etsy tee in 2h. Sunset.", world: "sunset" },
  { t: "Sleep Stories for Founders", d: "25-min loops + tracker. Lagoon night.", world: "lagoon" },
  { t: "Polymarket News Pinger", d: "Journalists -> Telegram edge. Lighthouse.", world: "beach" },
  { t: "Notion CRM for Creators", d: "Pipeline + GPT drafts. Treehouse.", world: "forest" },
];
