import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { callback } from '@/app/lib/oauth';
import { getsession } from '@/app/lib/session';

export async function GET(req: NextRequest) {
  const token = await callback(req);
  if (!token) redirect('/login');

  const userres = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!userres.ok) {
    const session = await getsession();
    session.destroy();
    redirect('/login');
  }

  const user = await userres.json();

  const session = await getsession();
  session.username = user.login;
  session.avatar = user.avatar_url;
  session.id = user.id;
  await session.save();

  redirect('/dashboard');
}
