import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Hourly cron placeholder. Data warmup will be added later.',
    timestamp: new Date().toISOString(),
  });
}
