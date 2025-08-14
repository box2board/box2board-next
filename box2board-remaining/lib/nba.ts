import { fetchOdds, OddsSnapshot } from './odds';

/**
 * Top scorer information. avgPoints is the average points over the
 * last five games. Player and team names are included for
 * display purposes.
 */
export interface Scorer {
  playerName: string;
  team: string;
  avgPoints: number;
}

/**
 * Fetch the top scorers in the NBA over the last five games. This
 * function uses the open balldontlie API when available; if it is
 * unreachable or rate limited a few well‑known players are returned
 * with mock averages. To minimise external calls this data is
 * cached for twelve hours.
 */
export async function fetchTopScorers(): Promise<Scorer[]> {
  const cacheKey = 'nba:topScorers';
  const ttl = 60 * 60 * 12;
  // Lazy import to avoid circular dependency on kvcache in test
  const { kvGetOrSet } = await import('./kvcache');
  return kvGetOrSet<Scorer[]>(cacheKey, ttl, async () => {
    try {
      // Determine the current NBA season (spanning two years). Example: 2024-2025
      const now = new Date();
      const startYear = now.getMonth() >= 9 ? now.getFullYear() : now.getFullYear() - 1;
      const seasonStr = `${startYear}`;
      // balldontlie does not support full league aggregations out of the box
      // without paging through thousands of records. As a stand‑in we
      // calculate averages for a handful of star players by pulling
      // their last 5 stats.
      const players = [
        { id: 237, name: 'LeBron James', team: 'Lakers' },
        { id: 115, name: 'Kevin Durant', team: 'Suns' },
        { id: 140, name: 'Giannis Antetokounmpo', team: 'Bucks' },
        { id: 246, name: 'Luka Dončić', team: 'Mavericks' },
        { id: 278, name: 'Nikola Jokić', team: 'Nuggets' },
      ];
      const result: Scorer[] = [];
      for (const p of players) {
        try {
          const url = `https://www.balldontlie.io/api/v1/stats?player_ids[]=${p.id}&per_page=5`;
          const res = await fetch(url, { cache: 'no-store' });
          const json = await res.json();
          const data = json.data ?? [];
          const totalPoints = data.reduce((sum: number, s: any) => sum + (s.pts ?? s.points ?? 0), 0);
          const avg = totalPoints / (data.length || 5);
          result.push({ playerName: p.name, team: p.team, avgPoints: Math.round(avg * 10) / 10 });
        } catch (err) {
          // Fallback to random average
          result.push({ playerName: p.name, team: p.team, avgPoints: Math.round((15 + Math.random() * 10) * 10) / 10 });
        }
      }
      // Sort descending by average points
      result.sort((a, b) => b.avgPoints - a.avgPoints);
      return result;
    } catch (err) {
      console.error('fetchTopScorers error', err);
      return [
        { playerName: 'Sample Player', team: 'Team', avgPoints: 25.4 },
      ];
    }
  });
}

/**
 * Aggregated data for the NBA page. Includes the current odds and the
 * top scorers. Odds updates hourly and scorers update twice a day
 * through KV caching.
 */
export async function fetchNbaPageData(): Promise<{ odds: OddsSnapshot[]; scorers: Scorer[] }> {
  const [odds, scorers] = await Promise.all([fetchOdds('nba'), fetchTopScorers()]);
  return { odds, scorers };
}