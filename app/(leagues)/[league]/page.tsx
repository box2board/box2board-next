import Link from "next/link";
import { matchupsEnabled } from "@/lib/matchup-provider";
import { notFound } from "next/navigation";
import ScoreCard from "@/components/ScoreCard";
import { getScoreboard, scheduleDateKey, shiftDateKey, SCHEDULE_TIME_ZONE, validDateKey } from "@/lib/sports";
import { getLeagueConfig, isPublicLeague } from "@/lib/leagues";

export const revalidate = 60;
export default async function LeaguePage({ params, searchParams }: { params: { league: string }; searchParams: { date?: string } }) {
  if (!isPublicLeague(params.league)) notFound();
  const config = getLeagueConfig(params.league)!; const date = validDateKey(searchParams.date); const board = await getScoreboard(params.league, date); const today = scheduleDateKey();
  const dateLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6)}T12:00:00Z`));
  return <div className="container leaguePage">
    <section className="leagueHero"><div><p className="kicker">{config.label} desk</p><h1>{config.label} scores & schedule</h1><p>Game times, live status, and final scores. Schedule days use Eastern Time.</p></div><span className={`leagueMonogram ${params.league}`} aria-hidden="true">{config.label}</span></section>
    {params.league === "mlb" && matchupsEnabled() && <p className="insightsLink"><Link className="actionLink" href="/mlb/insights">Today’s matchup insights: recent form & scoring →</Link></p>}
    <nav className="dateNav" aria-label="Choose schedule date"><Link href={`/${params.league}?date=${shiftDateKey(date,-1)}`} aria-label="Previous day">← <span>Previous</span></Link><div><strong>{date === today ? "Today" : dateLabel}</strong>{date === today && <small>{dateLabel}</small>}</div><Link href={`/${params.league}?date=${shiftDateKey(date,1)}`} aria-label="Next day"><span>Next</span> →</Link></nav>
      <section className="scoreSection" aria-labelledby="league-games"><div className="sectionHeading"><div><p className="kicker">Full slate</p><h2 id="league-games">{board.games.length} game{board.games.length === 1 ? "" : "s"}</h2></div><p className="freshness">{board.checkedAt ? <>Provider checked <time dateTime={board.checkedAt}>{new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: SCHEDULE_TIME_ZONE, timeZoneName: "short" }).format(new Date(board.checkedAt))}</time></> : "Provider unavailable"}</p></div>
      {board.games.length ? <div className="scoreGrid">{board.games.map((game) => <ScoreCard key={game.id} game={game} />)}</div> : <div className="emptyState"><span className="emptyIcon" aria-hidden="true">—</span><h3>{board.error ? "Scoreboard temporarily unavailable" : "No games listed"}</h3><p>{board.error ? "The data provider did not respond. No scores have been inferred or replaced with demo data." : `There are no ${config.label} games in the provider schedule for this date.`}</p>{date !== today && <Link className="actionLink" href={`/${params.league}`}>Return to today</Link>}</div>}
    </section>
    <aside className="dataNote"><strong>About this board</strong><p>Scores and schedules are fetched server-side and cached for up to one minute. “Provider checked” is when Box2Board received the response, not when the provider last changed a score. Dates and times use America/New_York with daylight-saving time. Provider delays and corrections are possible.</p></aside>
  </div>;
}
