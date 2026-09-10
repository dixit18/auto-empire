export type Employee = { name: string; role: string; skills: string[]; focus: string; link: string; manages?: string[] };
export const MANAGER = { name: "Mara Voss", role: "Chief of Staff · Manager", focus: "Enforcing focus-three (05/11/12) — kill review Mondays, $1k tripwire watch." };
export const CREW: Employee[] = [
  { name: "Sen", role: "R&D Lead", skills: ["forums", "teardowns", "funding maps"], focus: "YC-batch watch: 10 tracked memory/agent startups.", link: "/12-memory-layer" },
  { name: "Junie", role: "Frontend Engineer", skills: ["Next.js", "three.js", "GSAP", "a11y"], focus: "Floor dashboard + tab polish + flat-atlas verification.", link: "/" },
  { name: "Bram", role: "Backend Engineer", skills: ["Effect", "SQLite", "Python", "ffmpeg"], focus: "Eval goldens for 12 (40 recall cases) + MCP wrapper.", link: "/12-memory-layer" },
  { name: "Quill", role: "Documentation Engineer", skills: ["IA", "framework-docs", "changelogs"], focus: "RESEARCH/ index + BUILD-LOG per round.", link: "/solutions/eval-as-code" },
  { name: "Gate", role: "QA & Release", skills: ["verification", "smoke tests", "releases"], focus: "Verify + push this round; Vercel check after connect.", link: "/" },
];
