import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { leagues } from '@/lib/leagues';
import type { League, TrendItem } from '@/types';

export const runtime = 'nodejs';

const placeholderItem = (message: string): TrendItem => ({
  label: 'Coming soon',
  value: '',
  context: message,
  updatedAt: new Date().toISOString(),
});

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

  const rate = checkRateLimit(`trends:${ip}`, 20, 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, message: 'Rate limit exceeded. Please retry shortly.' },
      { status: 429 }
    );
  }

  const league = leagueParam as League;
  const updatedAt = new Date().toISOString();

  return NextResponse.json({
    ok: true,
    league,
    updatedAt,
    items: [
      placeholderItem('Trend engine is being wired for real streak math.'),
    ],
  });
}
