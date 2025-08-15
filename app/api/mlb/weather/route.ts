import { NextResponse } from 'next/server';
import { fetchWeatherBoosts } from '@/lib/mlb';

export async function GET() {
  const data = await fetchWeatherBoosts();
  return NextResponse.json(data);
}
