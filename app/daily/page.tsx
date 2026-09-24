import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Sports Desk",
  description: "The Box2Board daily briefing: major stories, standout performances, trends, roster news, and the storylines worth watching.",
  alternates: { canonical: "/daily" },
};

const sections = [
  { eyebrow: "The lead", title: "Top stories", copy: "The biggest developments across sports, summarized with enough context to understand why each one matters." },
  { eyebrow: "Last night", title: "Standout performances", copy: "The individual performances, records, milestones, and statistical lines that deserve more attention than a final score." },
  { eyebrow: "Data watch", title: "Trending", copy: "Meaningful streaks, recent-form changes, standings movement, and unusual statistical trends—with the window and sample size made clear." },
  { eyebrow: "Availability", title: "Injury & roster watch", copy: "Important injuries, returns, transactions, call-ups, suspensions, and lineup changes from dependable sources." },
  { eyebrow: "Ahead", title: "What we’re watching", copy: "The storylines behind today’s games—not another schedule. Think milestones, streaks, matchup context, and developments that could matter next." },
  { eyebrow: "Around sports", title: "Quick hits", copy: "Smaller developments worth knowing without turning the Daily Desk into an endless news feed." },
];

export default function DailyDeskPage() {
  const date = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }).format(new Date());

  return <div className="container dailyPage">
    <section className="dailyHero">
      <p className="kicker">Box2Board Daily Sports Desk</p>
      <h1>What matters in sports today.</h1>
      <p className="dailyLead">Scores tell you what happened. The Daily Sports Desk is being built to tell you what was important, what changed, and what is worth following next.</p>
      <div className="dailyMeta"><strong>{date}</strong><span>Daily briefing · Eastern Time</span></div>
    </section>

    <div className="dailyStatus"><strong>Briefing format in development</strong><p>We’re connecting dependable sources for news, box scores, injuries, and historical trends. Until those feeds are ready, Box2Board will not fill this page with invented or weakly sourced analysis.</p></div>

    <section className="briefingGrid" aria-label="Daily Sports Desk sections">
      {sections.map((section, index) => <article className={index === 0 ? "briefingCard briefingLead" : "briefingCard"} key={section.title}>
        <p className="kicker">{section.eyebrow}</p>
        <h2>{section.title}</h2>
        <p>{section.copy}</p>
        <span className="comingTag">Coming with verified data</span>
      </article>)}
    </section>

    <section className="dailySection dailyComingSoon">
      <p className="kicker">Where this is going</p>
      <h2>Box2Board Data Watch</h2>
      <p className="dailyLead">As Box2Board builds its historical data layer, the Daily Desk will surface original, reproducible observations from that data and link directly into the relevant league and matchup pages.</p>
    </section>
  </div>;
}
