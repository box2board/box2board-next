import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatchupSnapshot, matchupsEnabled } from "@/lib/matchup-provider";
import { buildMlbTrendBoard, displayDay } from "@/lib/matchups";
import { getNflContextSnapshot, nflTrendsEnabled } from "@/lib/nfl-context-provider";
import { buildNflTrendBoard, formatNflRecord } from "@/lib/nfl-context";
import { scheduleDateKey, SCHEDULE_TIME_ZONE } from "@/lib/sports";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: { params: Promise<{ league: string }> },
): Promise<Metadata> {
  const params = await props.params;
  if (params.league === "mlb") {
    return {
      robots: { index: false, follow: true },
      title: "MLB trends",
      description: "Recent MLB team form, run scoring, run prevention, and matchup trend context with transparent sample sizes.",
      alternates: { canonical: "https://box2board.com/mlb/trends" },
    };
  }
  if (params.league === "nfl") {
    return {
      robots: { index: false, follow: true },
      title: "NFL trends",
      description: "Recent NFL team form, scoring, points allowed, and matchup trend context with transparent sample sizes.",
      alternates: { canonical: "https://box2board.com/nfl/trends" },
    };
  }
  return {};
}

function checkedLabel(value?: string) {
  return value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: SCHEDULE_TIME_ZONE,
        timeZoneName: "short",
      }).format(new Date(value))
    : null;
}

async function MlbTrends() {
  if (!matchupsEnabled()) notFound();
  const day = scheduleDateKey();
  const snapshot = await getMatchupSnapshot();
  const board = snapshot.error
    ? { teams: [], matchups: [] }
    : buildMlbTrendBoard(snapshot.games, day);
  const checked = checkedLabel(snapshot.checkedAt);

  return <div className="container leaguePage">
    <section className="leagueHero">
      <div>
        <p className="kicker">MLB intelligence</p>
        <h1>Today’s MLB trend board</h1>
        <p>Recent form, scoring, and run-prevention context for teams playing today.</p>
        <div className="trendActions">
          <Link className="actionLink" href="/mlb">← MLB desk</Link>
          <Link className="actionLink" href="/mlb/insights">Matchup detail →</Link>
        </div>
      </div>
    </section>

    <div className="contextIntro">
      <div>
        <strong>Today · {displayDay(day)}/{day.slice(0,4)}</strong>
        <p>Previous seven Eastern calendar days. Minimum three completed games; maximum five per team.</p>
      </div>
      <p className="freshness">{checked ? <>Results fetched {checked}</> : "Results unavailable"}</p>
    </div>

    {snapshot.error || !board.teams.length ? (
      <div className="emptyState">
        <h2>Trend board temporarily unavailable</h2>
        <p>{snapshot.error || "There are not enough eligible recent games for today’s MLB teams."}</p>
        <Link className="actionLink" href="/mlb">View MLB scores →</Link>
      </div>
    ) : (
      <>
        <section className="trendSection" aria-labelledby="form-board">
          <div className="sectionHeading">
            <div><p className="kicker">Stock check</p><h2 id="form-board">Recent team form</h2></div>
            <p className="freshness">Sorted by win rate, then recent run differential</p>
          </div>
          <div className="trendTableWrap">
            <table className="trendTable">
              <thead><tr><th>Team</th><th>Record</th><th>RS/G</th><th>RA/G</th><th>Diff/G</th><th>Sample</th></tr></thead>
              <tbody>
                {board.teams.map(row => (
                  <tr key={row.team.id}>
                    <td><strong>{row.team.abbreviation}</strong><span>{row.team.name}</span></td>
                    <td>{row.wins}–{row.losses}</td>
                    <td>{row.scored.toFixed(1)}</td>
                    <td>{row.allowed.toFixed(1)}</td>
                    <td className={row.runDifferential >= 0 ? "trendPositive" : "trendNegative"}>{row.runDifferential >= 0 ? "+" : ""}{row.runDifferential.toFixed(1)}</td>
                    <td>{row.games}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {board.matchups.length > 0 && (
          <section className="trendSection" aria-labelledby="matchup-environments">
            <div className="sectionHeading">
              <div><p className="kicker">Matchup watch</p><h2 id="matchup-environments">Recent scoring environments</h2></div>
              <p className="freshness">Combined recent offense—not a projected total</p>
            </div>
            <div className="trendMatchupGrid">
              {board.matchups.map(row => (
                <article className="trendMatchupCard" key={row.game.id}>
                  <div><span>{row.game.away.abbreviation}</span><b>at</b><span>{row.game.home.abbreviation}</span></div>
                  <strong>{row.combinedScoring.toFixed(1)}</strong>
                  <p>combined recent runs/game</p>
                  <small>{row.away.team.abbreviation} {row.away.scored.toFixed(1)} · {row.home.team.abbreviation} {row.home.scored.toFixed(1)}</small>
                </article>
              ))}
            </div>
          </section>
        )}
      </>
    )}

    <aside className="dataNote">
      <strong>What this means</strong>
      <p>These are descriptive recent results, not predictions. Records and averages use only completed games from the same season and season type. Teams with incomplete results or fewer than three eligible games are withheld.</p>
    </aside>
  </div>;
}

async function NflTrends() {
  if (!nflTrendsEnabled()) notFound();
  const day = scheduleDateKey();
  const snapshot = await getNflContextSnapshot(day);
  const board = snapshot.error
    ? { teams: [], matchups: [] }
    : buildNflTrendBoard(snapshot.games, day);
  const checked = checkedLabel(snapshot.checkedAt);

  return <div className="container leaguePage">
    <section className="leagueHero">
      <div>
        <p className="kicker">NFL intelligence</p>
        <h1>Today’s NFL trend board</h1>
        <p>Recent team form, scoring, and defensive context for teams playing today.</p>
        <div className="trendActions">
          <Link className="actionLink" href="/nfl">← NFL desk</Link>
        </div>
      </div>
    </section>

    <div className="contextIntro">
      <div>
        <strong>Today · {displayDay(day)}/{day.slice(0,4)}</strong>
        <p>Up to four previous completed regular-season games per team. Minimum two games required.</p>
      </div>
      <p className="freshness">{checked ? <>Results fetched {checked}</> : "Results unavailable"}</p>
    </div>

    {snapshot.error || !board.teams.length ? (
      <div className="emptyState">
        <h2>Trend board temporarily unavailable</h2>
        <p>{snapshot.error || "There are not enough eligible recent games for today’s NFL teams."}</p>
        <Link className="actionLink" href="/nfl">View NFL scores →</Link>
      </div>
    ) : (
      <>
        <section className="trendSection" aria-labelledby="form-board">
          <div className="sectionHeading">
            <div><p className="kicker">Stock check</p><h2 id="form-board">Recent team form</h2></div>
            <p className="freshness">Sorted by win rate, then recent point differential</p>
          </div>
          <div className="trendTableWrap">
            <table className="trendTable">
              <thead><tr><th>Team</th><th>Record</th><th>PF/G</th><th>PA/G</th><th>Diff/G</th><th>Sample</th></tr></thead>
              <tbody>
                {board.teams.map(row => (
                  <tr key={row.team.id}>
                    <td><strong>{row.team.abbreviation}</strong><span>{row.team.name}</span></td>
                    <td>{formatNflRecord(row)}</td>
                    <td>{row.scored.toFixed(1)}</td>
                    <td>{row.allowed.toFixed(1)}</td>
                    <td className={row.pointDifferential >= 0 ? "trendPositive" : "trendNegative"}>{row.pointDifferential >= 0 ? "+" : ""}{row.pointDifferential.toFixed(1)}</td>
                    <td>{row.games}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {board.matchups.length > 0 && (
          <section className="trendSection" aria-labelledby="matchup-environments">
            <div className="sectionHeading">
              <div><p className="kicker">Matchup watch</p><h2 id="matchup-environments">Recent scoring environments</h2></div>
              <p className="freshness">Combined recent offense—not a projected total</p>
            </div>
            <div className="trendMatchupGrid">
              {board.matchups.map(row => (
                <article className="trendMatchupCard" key={row.game.id}>
                  <div><span>{row.game.away.abbreviation}</span><b>at</b><span>{row.game.home.abbreviation}</span></div>
                  <strong>{row.combinedScoring.toFixed(1)}</strong>
                  <p>combined recent points/game</p>
                  <small>{row.away.team.abbreviation} {row.away.scored.toFixed(1)} · {row.home.team.abbreviation} {row.home.scored.toFixed(1)}</small>
                </article>
              ))}
            </div>
          </section>
        )}
      </>
    )}

    <aside className="dataNote">
      <strong>What this means</strong>
      <p>These are descriptive recent results, not predictions or projected totals. Recent form uses up to four completed regular-season games. Teams with incomplete results or fewer than two eligible games are withheld.</p>
    </aside>
  </div>;
}

export default async function TrendsPage(
  props: { params: Promise<{ league: string }> },
) {
  const params = await props.params;
  if (params.league === "mlb") return MlbTrends();
  if (params.league === "nfl") return NflTrends();
  notFound();
}
