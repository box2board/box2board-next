import Link from "next/link";
import type { MlbIntelligenceSignal } from "@/lib/matchups";

export default function IntelligencePulse({ signals }: { signals: MlbIntelligenceSignal[] }) {
  if (!signals.length) return null;

  return (
    <section className="intelligenceSection" aria-labelledby="mlb-intelligence-heading">
      <div className="sectionHeading">
        <div>
          <p className="kicker">Today’s sports intelligence</p>
          <h2 id="mlb-intelligence-heading">MLB intelligence pulse</h2>
        </div>
        <p className="freshness">Previous 7 days · minimum 3 completed games</p>
      </div>
      <div className="intelligenceGrid">
        {signals.map((signal) => (
          <article className="intelligenceCard" key={signal.id}>
            <span>{signal.eyebrow}</span>
            <h3>{signal.headline}</h3>
            <p>{signal.detail}</p>
          </article>
        ))}
      </div>
      <p className="intelligenceNote">
        Descriptive recent-form context, not predictions. <Link className="actionLink" href="/mlb/trends">Open the MLB trend board →</Link>
      </p>
    </section>
  );
}
