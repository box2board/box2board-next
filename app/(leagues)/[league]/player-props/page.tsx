import Badge from "@/components/Badge";
import Card from "@/components/Card";
import PlayerPropsTable from "@/components/PlayerPropsTable";
import { getLeagueConfig, isLeagueKey } from "@/lib/leagues";
import { getLeaguePlayerProps } from "@/lib/mock/playerProps";
import { notFound } from "next/navigation";

export default function PlayerPropsPage({
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

  const props = getLeaguePlayerProps(league.key);

  return (
    <section className="section">
      <div className="grid" style={{ gap: "16px" }}>
        <div className="cardHeader">
          <h2>Player Props</h2>
          <Badge variant="info">Sortable</Badge>
        </div>
        <PlayerPropsTable data={props} />
        <Card>
          <p className="heroSubtitle">
            Player props are shown for trend visualization and analysis only.
            Use filters to explore matchup context without making picks.
          </p>
        </Card>
      </div>
    </section>
  );
}
