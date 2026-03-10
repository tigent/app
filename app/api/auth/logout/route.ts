import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getsession } from '@/app/lib/session';

export async function GET(req: NextRequest) {
  const session = await getsession();
  session.destroy();
  return NextResponse.redirect(new URL('/', req.url), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
