import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "How Box2Board turns sports schedules, results, and verified statistical context into a faster daily sports scan.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <div className="container textPage">
    <p className="kicker">About Box2Board</p>
    <h1>From scoreboard to sports intelligence.</h1>
    <p className="lead">Box2Board is built to help you understand what matters in the day’s sports—not just see another list of scores.</p>
    <div className="proseGrid">
      <section>
        <h2>What we publish</h2>
        <p>Box2Board currently covers MLB, NBA, NFL, and NHL schedules, live status, and results. MLB also includes verified recent-form and matchup context with transparent calculation windows and sample sizes.</p>
        <p>Score data is retrieved server-side from ESPN’s public scoreboard feed. MLB trend and matchup context uses a separate provider-backed results feed when that feature is enabled. Provider data can be delayed or corrected.</p>
      </section>
      <section>
        <h2>How intelligence is handled</h2>
        <p>Derived statistics are labeled as context rather than predictions unless a future feature explicitly publishes a documented model. Box2Board does not substitute mock values when a live source is unavailable.</p>
        <p><Link className="actionLink" href="/">Open today’s sports desk →</Link></p>
      </section>
    </div>
  </div>;
}
