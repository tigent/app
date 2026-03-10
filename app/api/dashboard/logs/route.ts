import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { token } from '@/app/lib/oauth';
import { getsession } from '@/app/lib/session';
import { readlogs } from '@/app/lib/logging';

export async function GET(req: NextRequest) {
  const session = await getsession();
  const headers = { 'Cache-Control': 'no-store' };
  if (!(await token(session))) {
    return NextResponse.json([], { status: 401, headers });
  }

  const repo = req.nextUrl.searchParams.get('repo');
  if (!repo) return NextResponse.json([], { headers });

  const limit = Number.parseInt(
    req.nextUrl.searchParams.get('limit') || '100',
    10,
  );
  const logs = await readlogs(repo, 0, Number.isNaN(limit) ? 100 : limit);
  return NextResponse.json(logs, { headers });
}
