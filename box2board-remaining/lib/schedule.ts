import { kvGetOrSet } from './kvcache';
import crypto from 'crypto';

/**
 * Representation of a scheduled game. Coordinates and roof
 * information are optional; when provided they may be used to
 * calculate weather effects.
 */
export interface Game {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  venue?: {
    name?: string;
    city?: string;
    state?: string;
    lat?: number;
    lon?: number;
    roof?: 'outdoor' | 'indoor';
  };
}

// Static coordinate and roof data for a handful of MLB ballparks. You can
// extend this list as needed. If a venue is missing from the map the
// weather widget will simply indicate that weather data is unavailable.
const MLB_STADIUMS: Record<string, { lat: number; lon: number; roof: 'outdoor' | 'indoor' }> = {
  'Comerica Park': { lat: 42.339, lon: -83.048, roof: 'outdoor' },
  'Dodger Stadium': { lat: 34.0739, lon: -118.2399, roof: 'outdoor' },
  'Fenway Park': { lat: 42.3467, lon: -71.0972, roof: 'outdoor' },
  'Yankee Stadium': { lat: 40.8296, lon: -73.9262, roof: 'outdoor' },
  'Wrigley Field': { lat: 41.9484, lon: -87.6553, roof: 'outdoor' },
};

// List of NFL teams that play in outdoor stadiums. Used to flag games
// where weather may be relevant. This list is not exhaustive and
// should be updated as necessary.
const NFL_OUTDOOR_TEAMS = [
  'Bills',
  'Bears',
  'Bengals',
  'Browns',
  'Broncos',
  'Bucs',
  'Chiefs',
  'Chargers',
  'Dolphins',
  'Eagles',
  'Falcons',
  'Giants',
  'Jets',
  'Lions',
  'Packers',
  'Patriots',
  'Raiders',
  'Ravens',
  'Panthers',
  'Steelers',
  'Seahawks',
  'Titans',
  'Washington',
];

/**
 * Fetch today’s schedule for the given sport. When data is unavailable or
 * the API key is missing this function returns an empty array. Results
 * are cached in KV for one day.
 */
export async function fetchSchedule(sport: 'mlb' | 'nfl' | 'nba'): Promise<Game[]> {
  const ttl = 60 * 60 * 12; // 12 hours to capture schedule updates
  return kvGetOrSet<Game[]>(`schedule:${sport}`, ttl, async () => {
    const date = new Date().toISOString().split('T')[0];
    if (sport === 'mlb') {
      const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`;
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`MLB schedule fetch failed with status ${res.status}`);
        const json = await res.json();
        const games: Game[] = [];
        const dates = json.dates ?? [];
        for (const d of dates) {
          for (const game of d.games ?? []) {
            const venueName = game.venue?.name ?? game.venue ?? '';
            const stadium = MLB_STADIUMS[venueName];
            games.push({
              id: String(game.gamePk),
              date: game.gameDate,
              homeTeam: game.teams?.home?.team?.name ?? game.teams?.home?.team?.abbreviation ?? '',
              awayTeam: game.teams?.away?.team?.name ?? game.teams?.away?.team?.abbreviation ?? '',
              venue: {
                name: venueName,
                city: game.venue?.city,
                state: undefined,
                lat: stadium?.lat,
                lon: stadium?.lon,
                roof: stadium?.roof ?? 'outdoor',
              },
            });
          }
        }
        return games;
      } catch (err) {
        console.error('MLB schedule fetch error', err);
        return [];
      }
    } else {
      // NFL and NBA via API-Sports
      const apiKey = process.env.API_SPORTS_KEY;
      if (!apiKey) return [];
      const base = sport === 'nfl' ? 'https://v1.american-football.api-sports.io' : 'https://v1.basketball.api-sports.io';
      const league = sport === 'nfl' ? 1 : 12;
      const season = new Date().getFullYear().toString();
      const url = `${base}/games?league=${league}&season=${season}&date=${date}`;
      try {
        const res = await fetch(url, {
          headers: {
            'x-apisports-key': apiKey,
            Accept: 'application/json',
          },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`API-Sports schedule fetch failed with status ${res.status}`);
        const json = await res.json();
        const list = json.response ?? json.results ?? [];
        return list.map((g: any) => {
          const homeName = g.teams?.home?.name ?? g.home_team?.name;
          const awayName = g.teams?.away?.name ?? g.away_team?.name;
          let roof: 'outdoor' | 'indoor' | undefined;
          if (sport === 'nfl') {
            roof = NFL_OUTDOOR_TEAMS.some(t => homeName?.includes(t)) ? 'outdoor' : 'indoor';
          }
          return {
            id: g.id?.toString() ?? g.game?.id?.toString() ?? crypto.randomUUID(),
            date: g.date ?? g.datetime ?? g.time ?? '',
            homeTeam: homeName ?? '',
            awayTeam: awayName ?? '',
            venue: {
              name: g.venue?.name ?? g.stadium?.name,
              city: g.venue?.city,
              state: g.venue?.state,
              lat: g.venue?.location?.lat ?? undefined,
              lon: g.venue?.location?.long ?? undefined,
              roof,
            },
          } as Game;
        });
      } catch (err) {
        console.error(`${sport.toUpperCase()} schedule fetch error`, err);
        return [];
      }
    }
  });
}