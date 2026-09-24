import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dailyBriefings, getDailyBriefing } from "../../../lib/daily-briefings";

export function generateStaticParams() {
  return dailyBriefings.map(({ date }) => ({ date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const briefing = getDailyBriefing(date);
  if (!briefing) return {};
  return {
    title: `Daily Sports Desk — ${date}`,
    description: briefing.dek,
    alternates: { canonical: `/daily/${date}` },
  };
}

export default async function DailyBriefingPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const briefing = getDailyBriefing(date);
  if (!briefing) notFound();

  const groups = [
    ["Top stories", briefing.topStories],
    ["Standout performances", briefing.performances],
    ["Trending", briefing.trends],
    ["Injury & roster watch", briefing.rosterWatch],
    ["What we're watching", briefing.watchToday],
    ["Quick hits", briefing.quickHits],
  ] as const;

  return <div className="container dailyPage">
    <header className="dailyHero">
      <p className="kicker">Box2Board Daily Sports Desk</p>
      <h1>{date}</h1>
      <p className="dailyLead">{briefing.dek}</p>
    </header>
    {groups.map(([title, stories]) => stories.length > 0 && (
      <section className="dailySection" key={title}>
        <h2>{title}</h2>
        <div className="briefingGrid">
          {stories.map((story) => <article className="briefingCard" key={story.title}>
            {story.league && <p className="kicker">{story.league}</p>}
            <h3>{story.title}</h3>
            <p>{story.summary}</p>
            {story.whyItMatters && <p><strong>Why it matters:</strong> {story.whyItMatters}</p>}
          </article>)}
        </div>
      </section>
    ))}
  </div>;
}
