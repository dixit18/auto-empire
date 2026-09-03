import "./globals.css";
import Providers from "@/components/Providers";
export const metadata = { title: "Auto Empire OS", description: "Click-to-run agent empire - 10 teams, live, no-stop" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
