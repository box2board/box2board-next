import Badge from "@/components/Badge";
import Card from "@/components/Card";
import ResponsiveTable from "@/components/ResponsiveTable";
import { getLeagueConfig, isLeagueKey } from "@/lib/leagues";
import { getLeagueGameProps } from "@/lib/mock/gameProps";
import { notFound } from "next/navigation";

export default function GamePropsPage({
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

  const props = getLeagueGameProps(league.key);

  return (
    <section className="section">
      <div className="grid" style={{ gap: "16px" }}>
        <div className="cardHeader">
          <h2>Game Props</h2>
          <Badge variant="info">Context layer</Badge>
        </div>
        <ResponsiveTable headers={["Market", "Description", "Price", "Trend"]}>
          {props.map((prop) => (
            <tr key={prop.id}>
              <td>{prop.label}</td>
              <td>{prop.description}</td>
              <td>{prop.price}</td>
              <td>{prop.trend}</td>
            </tr>
          ))}
        </ResponsiveTable>
        <div className="grid gridCols2">
          <Card>
            <h3>Market Notes</h3>
            <p className="heroSubtitle">
              Props help contextualize game scripts and pacing assumptions. Use
              this section to flag unusual movement or imbalance.
            </p>
          </Card>
          <Card>
            <h3>Analysis Reminder</h3>
            <p className="heroSubtitle">
              Insights are purely informational. Box2Board never recommends
              wagers or picks.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
