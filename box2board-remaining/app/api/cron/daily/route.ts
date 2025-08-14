import { NextResponse } from 'next/server';
import { fetchOdds } from '@/lib/odds';
import { fetchHrRates, fetchWeatherBoosts } from '@/lib/mlb';
import { fetchNflPageData } from '@/lib/nfl';
import { fetchNbaPageData } from '@/lib/nba';

/**
 * Daily cron endpoint. This route is invoked by Vercel Cron on a
 * schedule defined in vercel.json. It warms caches for all sports
 * including MLB specific metrics. Running this endpoint manually
 * after deploying ensures that pages load quickly without waiting
 * for background fetches.
 */
export async function GET() {
  // Trigger refreshes concurrently
  await Promise.all([
    fetchOdds('mlb'),
    fetchOdds('nfl'),
    fetchOdds('nba'),
    fetchHrRates(),
    fetchWeatherBoosts(),
    fetchNflPageData(),
    fetchNbaPageData(),
  ]);
  return NextResponse.json({ status: 'ok', message: 'Daily caches refreshed' });
}