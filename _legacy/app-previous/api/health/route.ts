import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    build: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  });
}
