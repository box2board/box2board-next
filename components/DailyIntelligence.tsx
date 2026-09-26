import Link from "next/link";
import type { DailyIntelligenceItem } from "@/lib/intelligence";

const KIND_LABELS: Record<DailyIntelligenceItem["kind"], string> = {
  trend: "Trend",
  matchup: "Matchup",
  injury: "Injury impact",
  model: "Model watch",
  performance: "Performance",
  movement: "Movement",
};

export default function DailyIntelligence({ items }: { items: DailyIntelligenceItem[] }) {
  if (!items.length) return null;

  return (
    <section className="dailyIntelligence" aria-labelledby="daily-intelligence-heading">
      <div className="sectionHeading">
        <div>
          <p className="kicker">Today’s sports intelligence</p>
          <h2 id="daily-intelligence-heading">What matters today</h2>
        </div>
        <p className="freshness">Verified data only · no mock signals</p>
      </div>

      <div className="dailyIntelligenceGrid">
        {items.map((item, index) => (
          <article className="dailyIntelligenceCard" key={item.id}>
            <div className="dailyIntelligenceMeta">
              <span className={`leagueTag ${item.league === "pga" ? "" : item.league}`}>{item.leagueLabel}</span>
              <span>{KIND_LABELS[item.kind]}</span>
              {index === 0 && <strong>Top signal</strong>}
            </div>
            <p className="dailyIntelligenceLabel">{item.label}</p>
            <h3>{item.headline}</h3>
            <p>{item.detail}</p>
            <Link href={item.href}>Explore context →</Link>
          </article>
        ))}
      </div>

      <p className="intelligenceNote">
        Box2Board surfaces descriptive context from verified feeds. Intelligence items are not predictions unless explicitly labeled as model output.
      </p>
    </section>
  );
}
