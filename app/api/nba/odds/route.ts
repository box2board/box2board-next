import { NextResponse } from 'next/server';
import { fetchOdds } from '@/lib/odds';

export async function GET() {
  const odds = await fetchOdds('nba');
  return NextResponse.json(odds);
}
