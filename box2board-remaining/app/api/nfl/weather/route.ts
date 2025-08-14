import { NextResponse } from 'next/server';
import { fetchNflPageData } from '@/lib/nfl';

export async function GET() {
  const data = await fetchNflPageData();
  return NextResponse.json(data.weatherNotes);
}