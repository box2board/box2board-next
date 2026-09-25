import Link from "next/link";
import { matchupsEnabled } from "@/lib/matchup-provider";
import ScoreCard from "@/components/ScoreCard";
import { getScoreboards, scheduleDateKey, SCHEDULE_TIME_ZONE } from "@/lib/sports";

export const revalidate = 60;

export default async function HomePage() {
  const date = scheduleDateKey();
  const boards = await getScoreboards(date);
  const games = boards.flatMap((board) => board.games).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const live = games.filter((game) => game.state === "in");
  const final = games.filter((game) => game.state === "post");
  const upcoming = games.filter((game) => game.state === "pre");
  const featured = [...live, ...upcoming, ...final].slice(0, 8);
  const checkedAt = boards.find((board) => board.checkedAt)?.checkedAt;
  const unavailable = boards.filter((board) => board.error).length;

  return (
    <div className="container home">
      <section className="intro" aria-labelledby="today-heading">
        <div>
          <p className="kicker">The daily sports desk</p>
          <h1 id="today-heading">Know what’s on. Know what matters.</h1>
          <p className="introCopy">Live scores and today’s schedule across MLB, NBA, NFL, and NHL—organized for a quick, reliable scan.</p>
        </div>
        <div className="dateBlock">
          <span>Today</span>
          <strong>{new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6)}T12:00:00Z`))}</strong>
          <small>Schedule day and times use Eastern Time</small>
        </div>
      </section>

      <section className="scoreSection" aria-labelledby="scores-heading">
        <div className="sectionHeading">
          <div><p className="kicker">Today’s board</p><h2 id="scores-heading">Games & scores</h2></div>
          <p className="freshness">{checkedAt ? <>Provider checked <time dateTime={checkedAt}>{new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: SCHEDULE_TIME_ZONE, timeZoneName: "short" }).format(new Date(checkedAt))}</time></> : "Live data currently unavailable"}</p>
        </div>
        {featured.length ? (
          <div className="scoreGrid">{featured.map((game) => <ScoreCard key={`${game.league}-${game.id}`} game={game} />)}</div>
        ) : (
          <div className="emptyState"><span className="emptyIcon" aria-hidden="true">—</span><h3>No games are listed today</h3><p>{unavailable === boards.length ? "The live scoreboard could not be reached. Try again shortly." : "It may be an off day or the leagues may be out of season. Check a league desk for nearby dates."}</p></div>
        )}
      </section>

      {matchupsEnabled() && <p className="insightsLink"><Link className="actionLink" href="/mlb/insights">Go beyond the score: explore MLB matchup insights →</Link></p>}
      <section className="dashboardGrid" aria-label="Daily overview">
        <article className="panel pulsePanel">
          <p className="kicker">At a glance</p><h2>Today in numbers</h2>
          <div className="metrics">
            <div><strong>{games.length}</strong><span>games listed</span></div>
            <div><strong>{live.length}</strong><span>live now</span></div>
            <div><strong>{final.length}</strong><span>final</span></div>
            <div><strong>{upcoming.length}</strong><span>upcoming</span></div>
          </div>
          <p className="sourceNote">Counts reflect the provider feed. An unavailable league is never counted as zero without a notice.</p>
        </article>
        <article className="panel leaguesPanel">
          <p className="kicker">Go deeper</p><h2>League desks</h2>
          <div className="leagueRows">
            {boards.map((board) => <Link href={`/${board.league}`} key={board.league}><span className={`leagueMark ${board.league}`}>{board.label.slice(0,1)}</span><span><strong>{board.label}</strong><small>{board.error ? "Feed unavailable" : `${board.games.length} game${board.games.length === 1 ? "" : "s"} listed`}</small></span><b aria-hidden="true">→</b></Link>)}
          </div>
        </article>
      </section>
    </div>
  );
}
