import { kvGetOrSet } from './kvcache';
import crypto from 'crypto';

/**
 * An odds snapshot for a single game. Only the fields that are
 * displayed in our widgets are defined here. Additional fields can be
 * added as needed. All numeric values represent American odds (for
 * moneylines) or totals/spreads as decimals.
 */
export interface OddsSnapshot {
  gameId: string;
  timestamp: string;
  homeTeam: string;
  awayTeam: string;
  moneylineHome?: number;
  moneylineAway?: number;
  total?: number;
  spread?: number;
}

/**
 * A mapping of our supported sports to the API‑Sports sub‑domains and
 * league identifiers. You can adjust the league ids to match the
 * competition you wish to target.
 */
const apiConfig: Record<string, { base: string; league: number; season: string }> = {
  mlb: { base: 'https://v1.baseball.api-sports.io', league: 1, season: new Date().getFullYear().toString() },
  nfl: { base: 'https://v1.american-football.api-sports.io', league: 1, season: new Date().getFullYear().toString() },
  nba: { base: 'https://v1.basketball.api-sports.io', league: 12, season: `${new Date().getFullYear() - 1}-${new Date().getFullYear()}` },
};

/**
 * Fetch odds for a given sport from API‑Sports. If the API key is not
 * configured this function returns a small set of mock odds so the
 * pages can still render. Results are cached in Vercel KV for one
 * hour to mitigate rate limits.
 */
export async function fetchOdds(sport: 'mlb' | 'nfl' | 'nba'): Promise<OddsSnapshot[]> {
  const apiKey = process.env.API_SPORTS_KEY;
  // Use a different TTL for different sports if desired
  const ttl = 60 * 60; // 1 hour
  return kvGetOrSet<OddsSnapshot[]>(`odds:${sport}`, ttl, async () => {
    if (!apiKey) {
      // Return mock odds when the API key is absent. These values are
      // illustrative only and will not reflect real betting markets.
      return [
        {
          gameId: `${sport}-mock-1`,
          timestamp: new Date().toISOString(),
          homeTeam: 'Home',
          awayTeam: 'Away',
          moneylineHome: -110,
          moneylineAway: +100,
          total: 8.5,
          spread: sport === 'mlb' ? undefined : -3.5,
        },
      ];
    }
    const cfg = apiConfig[sport];
    const date = new Date().toISOString().split('T')[0];
    const url = `${cfg.base}/odds?league=${cfg.league}&season=${cfg.season}&date=${date}`;
    try {
      const res = await fetch(url, {
        headers: {
          'x-apisports-key': apiKey,
          Accept: 'application/json',
        },
        // Ensure we don't cache at the fetch level; caching is handled via KV
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      const games = json.response ?? json.results ?? [];
      // Normalise the odds into our snapshot structure
      const snapshots: OddsSnapshot[] = games.map((g: any) => {
        // The structure of API-Sports responses varies per sport. We
        // defensively pick out known fields and fall back when
        // missing. You may need to adjust these paths based on your
        // subscription tier and API documentation.
        const bookmakers = g.bookmakers ?? g.bookmaker ?? [];
        let moneylineHome: number | undefined;
        let moneylineAway: number | undefined;
        let total: number | undefined;
        let spread: number | undefined;
        if (Array.isArray(bookmakers) && bookmakers.length > 0) {
          const markets = bookmakers[0].bets ?? bookmakers[0].markets ?? [];
          // Moneyline market may be labelled as "Match Winner" or similar
          const moneyline = markets.find((m: any) => /moneyline|match winner|winner/i.test(m.name ?? m.label ?? ''));
          if (moneyline) {
            const outcomes = moneyline.values ?? moneyline.outcomes ?? moneyline.odds ?? [];
            if (outcomes[0]) {
              moneylineHome = Number(outcomes[0].odd ?? outcomes[0].value);
            }
            if (outcomes[1]) {
              moneylineAway = Number(outcomes[1].odd ?? outcomes[1].value);
            }
          }
          // Totals market
          const totals = markets.find((m: any) => /total/i.test(m.name ?? m.label ?? ''));
          if (totals) {
            const outcome = totals.values?.[0] ?? totals.outcomes?.[0];
            total = outcome && outcome.point ? Number(outcome.point) : undefined;
          }
          // Spread/handicap market for NFL/NBA
          const spreadMarket = markets.find((m: any) => /handicap|spread/i.test(m.name ?? m.label ?? ''));
          if (spreadMarket) {
            const homeOutcome = spreadMarket.values?.find((o: any) => /home|1/i.test(o.type ?? o.label ?? ''));
            spread = homeOutcome && homeOutcome.point ? Number(homeOutcome.point) : undefined;
          }
        }
        return {
          gameId: g.id?.toString() ?? g.fixture?.id?.toString() ?? g.game?.id?.toString() ?? crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          homeTeam: g.teams?.home?.name ?? g.home_team?.name ?? 'Home',
          awayTeam: g.teams?.away?.name ?? g.away_team?.name ?? 'Away',
          moneylineHome,
          moneylineAway,
          total,
          spread,
        } as OddsSnapshot;
      });
      return snapshots;
    } catch (err) {
      console.error(`Failed to fetch odds for ${sport}`, err);
      return [];
    }
  });
}