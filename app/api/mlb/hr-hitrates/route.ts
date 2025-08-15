import { NextResponse } from 'next/server';
import { fetchHrRates } from '@/lib/mlb';

export async function GET() {
  const data = await fetchHrRates();
  return NextResponse.json(data);
}
