import { SCHEDULE_TIME_ZONE, type SportsGame } from "@/lib/sports";

export default function ScoreCard({ game }: { game: SportsGame; key?: string }) {
  const isStarted = game.state !== "pre";
  return <article className={`scoreCard ${game.state === "in" ? "scoreCardLive" : ""}`}>
    <div className="scoreMeta"><span className={`leagueTag ${game.league}`}>{game.league.toUpperCase()}</span><span className={`gameStatus ${game.state}`}>{game.state === "in" && <i aria-hidden="true" />}{game.status}</span></div>
    <div className="teams">
      <div><span className="teamAbbr">{game.away.abbreviation}</span><span className="teamName">{game.away.name}</span>{isStarted && <strong>{game.away.score ?? "—"}</strong>}</div>
      <div><span className="teamAbbr">{game.home.abbreviation}</span><span className="teamName">{game.home.name}</span>{isStarted && <strong>{game.home.score ?? "—"}</strong>}</div>
    </div>
    <div className="gameFooter"><time dateTime={game.startTime}>{new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: SCHEDULE_TIME_ZONE, timeZoneName: "short" }).format(new Date(game.startTime))}</time>{game.venue && <span>{game.venue}</span>}</div>
  </article>;
}
