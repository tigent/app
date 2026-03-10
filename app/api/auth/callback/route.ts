import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { callback } from '@/app/lib/oauth';
import { getsession } from '@/app/lib/session';

export async function GET(req: NextRequest) {
  const token = await callback(req);
  const headers = { 'Cache-Control': 'no-store' };
  if (!token) {
    return NextResponse.redirect(new URL('/login?reason=auth', req.url), {
      headers,
    });
  }

  const userres = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!userres.ok) {
    const session = await getsession();
    session.destroy();
    return NextResponse.redirect(new URL('/login?reason=auth', req.url), {
      headers,
    });
  }

  const user = await userres.json();

  const session = await getsession();
  session.username = user.login;
  session.avatar = user.avatar_url;
  session.id = user.id;
  await session.save();

  return NextResponse.redirect(new URL('/dashboard', req.url), { headers });
}
