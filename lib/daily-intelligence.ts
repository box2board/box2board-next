import { getMatchupSnapshot, matchupsEnabled } from "./matchup-provider";
import { buildMlbDailyIntelligence } from "./matchups";
import { getNflContextSnapshot, nflTrendsEnabled } from "./nfl-context-provider";
import { buildNflDailyIntelligence } from "./nfl-context";
import {
  mlbSignalsToDailyIntelligence,
  nflSignalsToDailyIntelligence,
  rankDailyIntelligence,
  type DailyIntelligenceItem,
  type DailyIntelligenceSnapshot,
} from "./intelligence";

function latestTimestamp(values: Array<string | undefined>) {
  return values
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
}

export async function getDailyIntelligence(day: string): Promise<DailyIntelligenceSnapshot> {
  const [mlbSnapshot, nflSnapshot] = await Promise.all([
    matchupsEnabled() ? getMatchupSnapshot() : Promise.resolve(null),
    nflTrendsEnabled() ? getNflContextSnapshot(day) : Promise.resolve(null),
  ]);

  const items: DailyIntelligenceItem[] = [];
  const sources: string[] = [];

  if (mlbSnapshot && !mlbSnapshot.error) {
    items.push(
      ...mlbSignalsToDailyIntelligence(
        buildMlbDailyIntelligence(mlbSnapshot.games, day),
      ),
    );
    sources.push("BALLDONTLIE MLB");
  }

  if (nflSnapshot && !nflSnapshot.error) {
    items.push(
      ...nflSignalsToDailyIntelligence(
        buildNflDailyIntelligence(nflSnapshot.games, day),
      ),
    );
    sources.push("BALLDONTLIE NFL");
  }

  return {
    items: rankDailyIntelligence(items),
    checkedAt: latestTimestamp([mlbSnapshot?.checkedAt, nflSnapshot?.checkedAt]),
    sources,
  };
}
