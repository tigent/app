import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getsession } from '@/app/lib/session';
import { readlogs } from '@/app/lib/logging';

export async function GET(req: NextRequest) {
  const session = await getsession();
  if (!session.token) return NextResponse.json([], { status: 401 });

  const repo = req.nextUrl.searchParams.get('repo');
  if (!repo) return NextResponse.json([]);

  const logs = await readlogs(repo);
  return NextResponse.json(logs);
}
