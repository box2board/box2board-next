import Badge from "@/components/Badge";
import Card from "@/components/Card";
import ResponsiveTable from "@/components/ResponsiveTable";
import StatTiles from "@/components/StatTiles";
import { formatTime } from "@/lib/format";
import { getLeagueConfig, isLeagueKey } from "@/lib/leagues";
import { getLeagueSchedule } from "@/lib/mock/schedule";
import { notFound } from "next/navigation";

export default function LeaguePage({
  params,
}: {
  params: { league: string };
}) {
  if (!isLeagueKey(params.league)) {
    notFound();
  }

  const league = getLeagueConfig(params.league);
  if (!league) {
    notFound();
  }

  const schedule = getLeagueSchedule(league.key);

  return (
    <>
      <section className="section">
        <StatTiles
          tiles={[
            { label: "Games today", value: `${schedule.length}` },
            { label: "Live now", value: "2" },
            { label: "Notable trend", value: "Totals leaning over" },
          ]}
        />
      </section>

      <section className="section">
        <div className="grid" style={{ gap: "16px" }}>
          <div className="cardHeader">
            <h2>Today&apos;s Slate</h2>
            <Badge variant="success">Live tracking</Badge>
          </div>
          <ResponsiveTable headers={["Matchup", "Start", "Status"]}>
            {schedule.map((game) => (
              <tr key={game.id}>
                <td>
                  {game.away} @ {game.home}
                </td>
                <td>{formatTime(game.startTime)}</td>
                <td>{game.status}</td>
              </tr>
            ))}
          </ResponsiveTable>
        </div>
      </section>

      <section className="section">
        <div className="grid gridCols3">
          <Card>
            <div className="cardHeader">
              <h3>Trend Pulse</h3>
              <Badge>Demo</Badge>
            </div>
            <p className="heroSubtitle">
              {league.label} overs are hitting 58% over the last 10 slates with
              a pace-up scoring environment.
            </p>
          </Card>
          <Card>
            <div className="cardHeader">
              <h3>Sharp Movement</h3>
              <Badge variant="success">+1.2</Badge>
            </div>
            <p className="heroSubtitle">
              Early market action shows a 1.2 point swing toward favorites in
              4 marquee matchups.
            </p>
          </Card>
          <Card>
            <div className="cardHeader">
              <h3>Injury Watch</h3>
              <Badge variant="warn">Monitor</Badge>
            </div>
            <p className="heroSubtitle">
              Two starters listed questionable. Monitor late line shifts and
              usage adjustments.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
