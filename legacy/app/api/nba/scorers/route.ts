import { NextResponse } from 'next/server';
import { fetchTopScorers } from '@/lib/nba';

export async function GET() {
  const scorers = await fetchTopScorers();
  return NextResponse.json(scorers);
}
