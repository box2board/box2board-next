import type { Event, League } from '@/types';
import { fetchJson } from '@/lib/http';
import { normalizeMlbGame } from '@/lib/normalize';

const MLB_SCHEDULE_URL = 'https://statsapi.mlb.com/api/v1/schedule';

export async function fetchMlbEvents(date: string): Promise<{
  events: Event[];
  warnings: string[];
  source: string;
}> {
  const warnings: string[] = [];
  const url = `${MLB_SCHEDULE_URL}?sportId=1&date=${date}`;
  const { data, ok, error } = await fetchJson<any>(url, { timeoutMs: 8000 });

  if (!ok || !data) {
    return {
      events: [],
      warnings: [error ?? 'Failed to load MLB schedule'],
      source: 'MLB StatsAPI',
    };
  }

  const games = data.dates?.[0]?.games ?? [];
  const events = games.map((game: any) => normalizeMlbGame(game, 'mlb'));
  return { events, warnings, source: 'MLB StatsAPI' };
}
