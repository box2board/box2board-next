import { NextResponse } from 'next/server';
import { fetchSchedule } from '@/lib/schedule';

export async function GET() {
  const games = await fetchSchedule('nfl');
  return NextResponse.json(games);
}
