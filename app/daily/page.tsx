import type { Metadata } from "next";
import Link from "next/link";
import { getScoreboards, scheduleDateKey, shiftDateKey } from "@/lib/sports";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Daily Sports Desk",
  description: "A daily Box2Board briefing built from verified MLB, NBA, NFL, and NHL results and schedules.",
  alternates: { canonical: "/daily" },
};

function displayDate(key: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${key.slice(0,4)}-${key.slice(4,6)}-${key.slice(6)}T12:00:00Z`));
}

export default async function DailyDeskPage() {
  const today = scheduleDateKey();
  const yesterday = shiftDateKey(today, -1);
  const [previousBoards, todayBoards] = await Promise.all([getScoreboards(yesterday), getScoreboards(today)]);
  const finals = previousBoards.flatMap((board) => board.games).filter((game) => game.state === "post");
  const upcoming = todayBoards.flatMap((board) => board.games).filter((game) => game.state === "pre").sort((a,b) => a.startTime.localeCompare(b.startTime));
  const unavailable = [...previousBoards, ...todayBoards].filter((board) => board.error).map((board) => board.label);

  return <div className="container dailyPage">
    <section className="dailyHero">
      <p className="kicker">Box2Board Daily Sports Desk</p>
      <h1>What happened. What’s next.</h1>
      <p className="dailyLead">A quick morning scan of verified results from yesterday and the games ahead today. Deeper performance, injury, and trend context will appear here only when Box2Board has a reliable source for it.</p>
      <div className="dailyMeta"><strong>{displayDate(today)}</strong><span>Eastern schedule day</span></div>
    </section>

    {unavailable.length > 0 && <div className="dataNote"><strong>Data notice</strong><p>One or more league feeds could not be reached. Missing data is not replaced with generated or demo information.</p></div>}

    <section className="dailySection" aria-labelledby="results-heading">
      <div className="sectionHeading"><div><p className="kicker">Last night</p><h2 id="results-heading">Results that matter</h2></div><Link className="actionLink" href="/">Today’s scoreboard →</Link></div>
      {finals.length ? <div className="dailyRows">{finals.slice(0,12).map((game) => <article className="dailyGame" key={`${game.league}-${game.id}`}><span className={`leagueTag ${game.league}`}>{game.league.toUpperCase()}</span><div><strong>{game.away.name} {game.away.score ?? "—"} · {game.home.name} {game.home.score ?? "—"}</strong><small>{game.status}</small></div></article>)}</div> : <div className="emptyState"><h3>No verified finals available</h3><p>There may have been no games, or a provider feed may be unavailable.</p></div>}
    </section>

    <section className="dailySection" aria-labelledby="watch-heading">
      <div className="sectionHeading"><div><p className="kicker">Coming up</p><h2 id="watch-heading">What to watch today</h2></div></div>
      {upcoming.length ? <div className="dailyRows">{upcoming.slice(0,12).map((game) => <article className="dailyGame" key={`${game.league}-${game.id}`}><span className={`leagueTag ${game.league}`}>{game.league.toUpperCase()}</span><div><strong>{game.away.name} at {game.home.name}</strong><small>{new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York",timeZoneName:"short"}).format(new Date(game.startTime))}{game.venue ? ` · ${game.venue}` : ""}</small></div></article>)}</div> : <div className="emptyState"><h3>No upcoming games listed</h3><p>Check the league desks for nearby schedule dates.</p></div>}
    </section>

    <section className="dailySection dailyComingSoon" aria-labelledby="context-heading">
      <p className="kicker">Next layer</p><h2 id="context-heading">Box2Board context</h2>
      <div className="contextGrid"><article><strong>Top performances</strong><p>Verified box-score leaders and standout statistical lines.</p></article><article><strong>Trend watch</strong><p>Clearly defined recent-form and team trends with sample sizes.</p></article><article><strong>Availability watch</strong><p>Injury and lineup updates only when supported by a dependable source.</p></article></div>
      <p className="sourceNote">These modules are intentionally not populated until Box2Board has appropriate data sources. The Daily Sports Desk will not invent analysis to fill space.</p>
    </section>
  </div>;
}
