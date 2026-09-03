import { notFound } from "next/navigation";
import TeamView from "@/components/TeamView";
import { TEAMS } from "@/lib/teams";

export function generateStaticParams() {
  return TEAMS.map((t) => ({ teamId: t.dir }));
}

export function generateMetadata({ params }: { params: { teamId: string } }) {
  const t = TEAMS.find((x) => x.dir === params.teamId);
  return { title: t ? `${t.id} · ${t.name} — Auto Empire OS` : "Team — Auto Empire OS" };
}

export default function TeamPage({ params }: { params: { teamId: string } }) {
  const team = TEAMS.find((x) => x.dir === params.teamId);
  if (!team) notFound();
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[1100px] px-3 sm:px-5 py-4 sm:py-6">
        <TeamView team={team} />
      </main>
    </div>
  );
}
