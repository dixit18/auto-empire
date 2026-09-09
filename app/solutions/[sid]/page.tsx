import { notFound } from "next/navigation";
import SolutionView from "@/components/SolutionView";
import { THESES } from "@/lib/theses";

export function generateStaticParams() {
  return THESES.map((t) => ({ sid: t.id }));
}

export function generateMetadata({ params }: { params: { sid: string } }) {
  const t = THESES.find((x) => x.id === params.sid);
  return { title: t ? `${t.n} · ${t.title} — Auto Empire OS` : "Solution — Auto Empire OS" };
}

export default function SolutionPage({ params }: { params: { sid: string } }) {
  const thesis = THESES.find((x) => x.id === params.sid);
  if (!thesis) notFound();
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[1100px] px-3 sm:px-5 py-4 sm:py-6">
        <SolutionView thesis={thesis} />
      </main>
    </div>
  );
}
