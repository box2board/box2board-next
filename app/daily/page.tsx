import Link from "next/link";
import type { Metadata } from "next";
import { dailyBriefings, getLatestDailyBriefing } from "../../lib/daily-briefings";

export const metadata: Metadata = {
  title: "Daily Sports Desk",
  description: "Box2Board's daily sports briefing: the stories, performances, trends, roster news, and storylines that matter.",
  alternates: { canonical: "/daily" },
};

export default function DailyDeskPage() {
  const latest = getLatestDailyBriefing();
  return <div className="container dailyPage">
    <section className="dailyHero">
      <p className="kicker">Box2Board Daily Sports Desk</p>
      <h1>What matters in sports today.</h1>
      <p className="dailyLead">A daily briefing built around the developments worth knowing—not another scoreboard or schedule.</p>
    </section>
    {latest ? (
      <section className="dailySection">
        <p className="kicker">Latest briefing</p>
        <h2>{latest.date}</h2>
        <p>{latest.dek}</p>
        <Link className="textLink" href={`/daily/${latest.date}`}>Read the Daily Sports Desk →</Link>
      </section>
    ) : (
      <section className="dailyStatus">
        <strong>The publishing foundation is ready.</strong>
        <p>The next step is connecting the verified research and publishing pipeline. Box2Board will not publish invented stories just to fill this page.</p>
      </section>
    )}
    {dailyBriefings.length > 1 && <section className="dailySection"><h2>Archive</h2>{dailyBriefings.slice(1).map(b => <p key={b.date}><Link href={`/daily/${b.date}`}>{b.date}</Link></p>)}</section>}
  </div>;
}
