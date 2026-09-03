import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import Providers from "@/components/Providers";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400", "500", "600"] });

export const metadata = {
  title: "Auto Empire OS — 10 agent companies, one command deck",
  description: "Click-to-run command deck for 10 agent-owned companies. Live bus, phase auto-advance, light + night themes.",
};

function ThemeInit() {
  const js = `(function(){try{var t=localStorage.getItem('empire-theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.dataset.theme=t;}catch(e){}})();`;
  // eslint-disable-next-line @next/next/no-sync-scripts
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head><ThemeInit /></head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
