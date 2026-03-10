import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { token } from '@/app/lib/oauth';
import { getsession } from '@/app/lib/session';

function path(value: string | null) {
  if (!value || !value.startsWith('/')) return '/dashboard';
  return value;
}

export async function GET(req: NextRequest) {
  const session = await getsession();
  const next = path(req.nextUrl.searchParams.get('next'));
  const value = await token(session);
  const headers = { 'Cache-Control': 'no-store' };
  if (!value) {
    session.destroy();
    return NextResponse.redirect(new URL('/login', req.url), { headers });
  }
  return NextResponse.redirect(new URL(next, req.url), { headers });
}
