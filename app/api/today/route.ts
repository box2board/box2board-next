import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchEventsForLeague } from '@/lib/providers';
import { getTorontoDateString } from '@/lib/date';
import { getCache, setCache } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { leagues } from '@/lib/leagues';
import type { League, TodayResponse } from '@/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const leagueParam = url.searchParams.get('league')?.toLowerCase() ?? '';
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  if (!leagues.includes(leagueParam as League)) {
    return NextResponse.json(
      { ok: false, message: 'Invalid league parameter.' },
      { status: 400 }
    );
  }

  const rate = checkRateLimit(`today:${ip}`);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, message: 'Rate limit exceeded. Please retry shortly.' },
      { status: 429 }
    );
  }

  const league = leagueParam as League;
  const date = getTorontoDateString();
  const cacheKey = `today:${league}:${date}`;

  const cached = getCache<TodayResponse>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const { events, warnings, source } = await fetchEventsForLeague(league, date);
    const updatedAt = new Date().toISOString();
    const response: TodayResponse = {
      ok: true,
      league,
      date,
      updatedAt,
      source,
      events,
      warnings: warnings.length ? warnings : undefined,
    };

    const ttlMs = events.some((event) => event.isLive) ? 60_000 : 180_000;
    setCache(cacheKey, response, ttlMs);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Unable to load today\'s events right now.',
      },
      { status: 500 }
    );
  }
}
