import Link from "next/link";
import { notFound } from "next/navigation";
import { matchupsEnabled, getMatchupSnapshot } from "@/lib/matchup-provider";
import { teamForm, displayDay, type ContextTeam, type TeamForm } from "@/lib/matchups";
import { scheduleDateKey, shiftDateKey, SCHEDULE_TIME_ZONE } from "@/lib/sports";

export const dynamic = "force-dynamic";
export const metadata = { robots:{index:false,follow:true}, title:"MLB matchup insights | Box2Board", description:"Compare recent results and scoring for today's MLB matchups. Sample sizes and calculation windows included.", alternates:{canonical:"https://box2board.com/mlb/insights"} };
function Form({ team, form }: {team:ContextTeam; form:TeamForm}) {
  return <section className="formTeam" aria-label={`${team.name} recent form`}>
    <h3>{team.name}</h3>
    {!form.results.length ? <p className="formNote">{form.missingScores ? "Recent results contain incomplete scores. Comparison withheld." : "No completed games in this window."}</p> : <>
      <div className="formRecord"><strong>{form.wins}–{form.losses}</strong><span>in {form.results.length} game{form.results.length===1 ? "" : "s"}</span></div>
      <div className="formStrip" aria-label="Recent results, newest first">{form.results.map(r=><span key={r.id} className={`result${r.result}`} title={`${displayDay(r.day)} ${r.location} ${r.opponent}: ${r.scored}–${r.allowed}`}>{r.result}</span>)}<small>Latest first</small></div>
      <dl className="formStats"><div><dt>Runs scored / game</dt><dd>{form.scored!.toFixed(1)}</dd></div><div><dt>Runs allowed / game</dt><dd>{form.allowed!.toFixed(1)}</dd></div></dl>
      {form.results.length<5 && <p className="formNote">Small sample: fewer than five games.</p>}
      <details className="formDetails"><summary>See included results</summary><ul>{form.results.map(r=><li key={r.id}><span>{displayDay(r.day)} {r.location} {r.opponent}</span><strong>{r.result} {r.scored}–{r.allowed}</strong></li>)}</ul></details>
    </>}
  </section>;
}
export default async function Insights(props: {params: Promise<{league:string}>}) {
  const params = await props.params;
  if (params.league!=="mlb" || !matchupsEnabled()) notFound();
  const day = scheduleDateKey();const snapshot = await getMatchupSnapshot();
  const games = snapshot.games.filter(g=>g.day===day && ["scheduled","in_progress","final","delayed"].includes(g.state)).sort((a,b)=>a.date.localeCompare(b.date) || a.id-b.id);
  const stale = Boolean(snapshot.checkedAt && Date.now()-Date.parse(snapshot.checkedAt)>20*60*1000);
  return <div className="container leaguePage">
    <section className="leagueHero"><div><p className="kicker">Beyond the scoreboard</p><h1>MLB matchup insights</h1><p>Recent form. Scoring context. The results behind the numbers.</p><Link className="actionLink" href="/mlb">← MLB scores & schedule</Link></div></section>
    <div className="contextIntro"><div><strong>Today · {displayDay(day)}/{day.slice(0,4)}</strong><p>Up to five completed games per team from {displayDay(shiftDateKey(day,-7))}–{displayDay(shiftDateKey(day,-1))}. Eastern Time.</p></div><p className="freshness">{snapshot.checkedAt && <>Results fetched <time dateTime={snapshot.checkedAt}>{new Intl.DateTimeFormat("en-US", {month:"short", day:"numeric", hour:"numeric", minute:"2-digit", timeZone:SCHEDULE_TIME_ZONE, timeZoneName:"short"}).format(new Date(snapshot.checkedAt))}</time></>}{stale && <strong className="staleNotice">Cached results · update delayed</strong>}</p></div>
    {snapshot.error || !games.length ? <div className="emptyState"><h2>{snapshot.error ? "Insights temporarily unavailable" : "No matchups listed today"}</h2><p>{snapshot.error || "There are no eligible MLB matchups in the provider's schedule. Check the MLB desk for scores and other dates."}</p><Link className="actionLink" href="/mlb">View MLB desk →</Link></div> : <div className="matchupGrid">{games.map(g=><article className="matchupCard" key={g.id}>
      <header><span className="leagueTag mlb">MLB · {g.seasonType.replaceAll("_"," ")}</span><time dateTime={g.date}>{new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZone:SCHEDULE_TIME_ZONE,timeZoneName:"short"}).format(new Date(g.date))}</time></header>
      <h2>{g.away.abbreviation} <span>at</span> {g.home.abbreviation}</h2>
      <div className="matchupTeams"><Form team={g.away} form={teamForm(snapshot.games,g,g.away.id)} /><Form team={g.home} form={teamForm(snapshot.games,g,g.home.id)} /></div>
    </article>)}</div>}
    <aside className="dataNote"><strong>How to read these comparisons</strong><p>Box2Board calculates wins, losses, and average runs from BALLDONTLIE game results. Only finals from the same season and season type are included; today's games are excluded throughout the day. Doubleheaders count separately. These are descriptive statistics, not predictions or season records. Different teams may have different sample sizes.</p><p>Results refresh on request approximately every 15 minutes and may be delayed or corrected. Game times come from this context feed; use the scoreboard for live status. <a className="actionLink" href="https://mlb.balldontlie.io/">Data source and documentation ↗</a></p></aside>
  </div>;
}
