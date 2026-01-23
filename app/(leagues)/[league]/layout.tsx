import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import SubNav from "@/components/SubNav";
import { getLeagueConfig, isLeagueKey, leagueKeys } from "@/lib/leagues";

export function generateStaticParams() {
  return leagueKeys.map((league) => ({ league }));
}

export default function LeagueLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { league: string };
}) {
  if (!isLeagueKey(params.league)) {
    notFound();
  }

  const league = getLeagueConfig(params.league);
  if (!league) {
    notFound();
  }

  return (
    <PageShell>
      <section className="hero">
        <div className="grid" style={{ gap: "12px" }}>
          <h1 className="heroTitle">{league.label} Insights</h1>
          <p className="heroSubtitle">
            Market context, slate pacing, and trend dashboards built for
            analysis. No picks, just the signal.
          </p>
          <SubNav league={league.key} />
        </div>
      </section>
      {children}
    </PageShell>
  );
}
