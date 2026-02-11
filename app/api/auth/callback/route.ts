import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { getsession } from '@/app/lib/session';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) redirect('/');

  const tokenres = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    }),
  });

  const { access_token } = await tokenres.json();
  if (!access_token) redirect('/');

  const userres = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const user = await userres.json();

  const session = await getsession();
  session.token = access_token;
  session.username = user.login;
  session.avatar = user.avatar_url;
  session.id = user.id;
  await session.save();

  redirect('/dashboard');
}
