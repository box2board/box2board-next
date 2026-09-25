import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPublicLeague, publicLeagues } from "@/lib/leagues";

export function generateStaticParams() { return publicLeagues.map(({ key }) => ({ league: key })); }
export async function generateMetadata(props: { params: Promise<{ league: string }> }): Promise<Metadata> {
  const params = await props.params;
  if (!isPublicLeague(params.league)) return {};
  const label = params.league.toUpperCase();
  return { title: `${label} Scores & Schedule`, description: `Today’s ${label} games, live scores, final results, and schedule.`, alternates: { canonical: `/${params.league}` }, openGraph: { title: `${label} Scores & Schedule`, description: `A clear view of today’s ${label} board.`, url: `/${params.league}` } };
}
export default async function LeagueLayout(props: { children: React.ReactNode; params: Promise<{ league: string }> }) {
  const params = await props.params;

  if (!isPublicLeague(params.league)) notFound();
  return props.children;
}
