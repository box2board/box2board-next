import Link from "next/link";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import DemoNote from "@/components/DemoNote";
import PageShell from "@/components/PageShell";
import ResponsiveTable from "@/components/ResponsiveTable";
import { leagues } from "@/lib/leagues";
import { formatDate, formatTime } from "@/lib/format";
import { getCombinedSchedule } from "@/lib/mock/schedule";

export default function HomePage() {
  const combinedSchedule = getCombinedSchedule();

  return (
    <PageShell>
      <section className="hero">
        <div className="grid" style={{ gap: "20px" }}>
          <h1 className="heroTitle">
            Daily sports dashboard for trends, streaks, and market context.
          </h1>
          <p className="heroSubtitle">
            Box2Board is built for analysis, not picks. Track today&apos;s slate,
            market movement, and data-driven context across every league.
          </p>
          <DemoNote />
        </div>
      </section>

      <section className="section">
        <div className="grid gridCols3">
          {leagues.map((league) => (
            <Card key={league.key}>
              <div className="cardHeader">
                <h3>{league.label} Hub</h3>
                <Badge variant="info">Live</Badge>
              </div>
              <p className="heroSubtitle">
                Today&apos;s slate, trends, and prop dashboards for {league.label}.
              </p>
              <div style={{ marginTop: "16px" }}>
                <Link className="navLink navLinkActive" href={league.path}>
                  View {league.label}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="grid" style={{ gap: "16px" }}>
          <div className="cardHeader">
            <h2>Today&apos;s Events</h2>
            <Badge variant="success">Combined slate</Badge>
          </div>
          <ResponsiveTable headers={["League", "Matchup", "Start", "Status"]}>
            {combinedSchedule.map((game) => (
              <tr key={game.id}>
                <td>{game.league.toUpperCase()}</td>
                <td>
                  {game.away} @ {game.home}
                </td>
                <td>
                  {formatDate(game.startTime)} · {formatTime(game.startTime)}
                </td>
                <td>{game.status}</td>
              </tr>
            ))}
          </ResponsiveTable>
        </div>
      </section>
    </PageShell>
  );
}
