import { fetchSchedule, Game } from './schedule';
import { fetchOdds, OddsSnapshot } from './odds';

/**
 * Aggregated data for the NFL page. Contains today’s games, the
 * current odds snapshot and a simple weather note indicating whether
 * each game is expected to be played outdoors. Further
 * functionality (e.g. injuries, props) can be layered on top of
 * this structure.
 */
export interface NflPageData {
  games: Game[];
  odds: OddsSnapshot[];
  weatherNotes: Record<string, string>;
}

/**
 * Gather the various pieces of information required for the NFL
 * dashboard. Schedule and odds are fetched via their respective
 * helpers, and a weather note is generated based on the venue roof
 * type. Data is refreshed at most once per hour through the
 * underlying cache of each helper.
 */
export async function fetchNflPageData(): Promise<NflPageData> {
  const [games, odds] = await Promise.all([fetchSchedule('nfl'), fetchOdds('nfl')]);
  const weatherNotes: Record<string, string> = {};
  for (const game of games) {
    const roof = game.venue?.roof;
    weatherNotes[game.id] = roof === 'outdoor' ? 'Outdoor – check weather' : 'Indoor';
  }
  return { games, odds, weatherNotes };
}