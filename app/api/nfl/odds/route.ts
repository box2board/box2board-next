import { NextResponse } from 'next/server';
import { fetchOdds } from '@/lib/odds';

export async function GET() {
  const odds = await fetchOdds('nfl');
  return NextResponse.json(odds);
}
