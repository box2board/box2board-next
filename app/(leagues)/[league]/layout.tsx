import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPublicLeague, publicLeagues } from "@/lib/leagues";

export function generateStaticParams() { return publicLeagues.map(({ key }) => ({ league: key })); }
export function generateMetadata({ params }: { params: { league: string } }): Metadata {
  if (!isPublicLeague(params.league)) return {};
  const label = params.league.toUpperCase();
  return { title: `${label} Scores & Schedule`, description: `Today’s ${label} games, live scores, final results, and schedule.`, alternates: { canonical: `/${params.league}` }, openGraph: { title: `${label} Scores & Schedule`, description: `A clear view of today’s ${label} board.`, url: `/${params.league}` } };
}
export default function LeagueLayout({ children, params }: { children: React.ReactNode; params: { league: string } }) { if (!isPublicLeague(params.league)) notFound(); return children; }
