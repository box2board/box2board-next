import Badge from "@/components/Badge";
import Card from "@/components/Card";
import ResponsiveTable from "@/components/ResponsiveTable";
import { getLeagueConfig, isLeagueKey } from "@/lib/leagues";
import { getLeagueLines } from "@/lib/mock/lines";
import { notFound } from "next/navigation";

export default function LinesPage({ params }: { params: { league: string } }) {
  if (!isLeagueKey(params.league)) {
    notFound();
  }

  const league = getLeagueConfig(params.league);
  if (!league) {
    notFound();
  }

  const lines = getLeagueLines(league.key);

  return (
    <section className="section">
      <div className="grid" style={{ gap: "16px" }}>
        <div className="cardHeader">
          <h2>Game Lines</h2>
          <Badge variant="info">Market snapshot</Badge>
        </div>
        <ResponsiveTable
          headers={["Matchup", "Moneyline", "Spread", "Total", "Movement"]}
        >
          {lines.map((line) => (
            <tr key={line.gameId}>
              <td>{line.matchup}</td>
              <td>{line.moneyline}</td>
              <td>{line.spread}</td>
              <td>{line.total}</td>
              <td>{line.movement}</td>
            </tr>
          ))}
        </ResponsiveTable>
        <Card>
          <p className="heroSubtitle">
            Lines are mock examples for insight dashboards. Track movement
            signals and compare pricing over time.
          </p>
        </Card>
      </div>
    </section>
  );
}
