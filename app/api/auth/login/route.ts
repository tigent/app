import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: 'read:org repo',
    redirect_uri: `${protocol}://${host}/api/auth/callback`,
  });
  redirect(`https://github.com/login/oauth/authorize?${params}`);
}
