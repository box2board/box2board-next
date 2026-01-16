import type { League } from '@/types';
import { fetchMlbEvents } from '@/lib/providers/mlb';
import { fetchBalldontlieEvents } from '@/lib/providers/balldontlie';
import { fetchGolfEvents } from '@/lib/providers/golf';

export async function fetchEventsForLeague(league: League, date: string) {
  if (league === 'mlb') {
    return fetchMlbEvents(date);
  }
  if (league === 'golf') {
    return fetchGolfEvents();
  }
  return fetchBalldontlieEvents(league, date);
}
