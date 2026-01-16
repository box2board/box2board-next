import type { Event, League } from '@/types';
import { fetchJson } from '@/lib/http';
import { normalizeBdlGame } from '@/lib/normalize';

const BDL_BASE_URL = 'https://api.balldontlie.io/v1';

const supportedLeagues: League[] = ['nba'];

export async function fetchBalldontlieEvents(
  league: League,
  date: string
): Promise<{ events: Event[]; warnings: string[]; source: string }> {
  const warnings: string[] = [];
  const source = 'Ball Don\'t Lie';

  if (!supportedLeagues.includes(league)) {
    return {
      events: [],
      warnings: [`${league.toUpperCase()} data is not supported by Ball Don't Lie yet.`],
      source,
    };
  }

  const apiKey = process.env.BALL_DONT_LIE_KEY;
  if (!apiKey) {
    return {
      events: [],
      warnings: ['BALL_DONT_LIE_KEY is not configured.'],
      source,
    };
  }

  const url = `${BDL_BASE_URL}/games?dates[]=${date}`;
  const { data, ok, error } = await fetchJson<any>(url, {
    headers: { Authorization: apiKey },
    timeoutMs: 8000,
    retries: 2,
  });

  if (!ok || !data) {
    return {
      events: [],
      warnings: [error ?? 'Failed to load Ball Don\'t Lie games'],
      source,
    };
  }

  const events = (data.data ?? []).map((game: any) =>
    normalizeBdlGame(game, league)
  );
  return { events, warnings, source };
}
