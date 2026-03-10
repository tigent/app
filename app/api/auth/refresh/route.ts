import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
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
  if (!value) {
    session.destroy();
    redirect('/login');
  }
  redirect(next);
}
