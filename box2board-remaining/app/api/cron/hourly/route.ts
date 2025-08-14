import { NextResponse } from 'next/server';
import { fetchOdds } from '@/lib/odds';

/**
 * Hourly cron endpoint. Refreshes odds for all sports. Vercel Cron
 * invokes this route every hour. Odds are also refreshed on demand
 * via page loads through KV caching but this cron helps keep them
 * fresh without user activity.
 */
export async function GET() {
  await Promise.all([
    fetchOdds('mlb'),
    fetchOdds('nfl'),
    fetchOdds('nba'),
  ]);
  return NextResponse.json({ status: 'ok', message: 'Hourly odds refreshed' });
}