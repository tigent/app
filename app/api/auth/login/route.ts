import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { login } from '@/app/lib/oauth';

export async function GET(req: NextRequest) {
  return NextResponse.redirect(await login(req), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
