import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Daily cron placeholder. Trend refresh will be added later.',
    timestamp: new Date().toISOString(),
  });
}
