import { NextResponse } from 'next/server';
import { fetchOdds } from '@/lib/odds';

export async function GET() {
  const data = await fetchOdds('mlb');
  return NextResponse.json(data);
}