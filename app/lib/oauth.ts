import type { NextRequest } from 'next/server';
import { getsession } from './session';

type Store = Awaited<ReturnType<typeof getsession>>;

const window = 5 * 60 * 1000;

type Payload = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
};

function origin(req: NextRequest) {
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

function until(seconds?: number) {
  return seconds ? Date.now() + seconds * 1000 : undefined;
}

function body(values: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) params.set(key, value);
  return params;
}

function apply(session: Store, payload: Payload) {
  if (payload.access_token) session.token = payload.access_token;
  if (payload.refresh_token) session.refresh = payload.refresh_token;
  session.expires = until(payload.expires_in);
  session.refreshexpires = until(payload.refresh_token_expires_in);
}

async function exchange(values: Record<string, string>) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body(values),
  });

  if (!response.ok) return null;
  return (await response.json()) as Payload;
}

function due(session: Store) {
  return (
    typeof session.expires === 'number' &&
    Date.now() >= session.expires - window
  );
}

export async function login(req: NextRequest) {
  const session = await getsession();
  const state = crypto.randomUUID();
  session.state = state;
  await session.save();

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${origin(req)}/api/auth/callback`,
    state,
    allow_signup: 'false',
  });

  return `https://github.com/login/oauth/authorize?${params}`;
}

export async function callback(req: NextRequest) {
  const session = await getsession();
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  if (!code || !state || !session.state || state !== session.state) {
    session.destroy();
    return null;
  }

  const payload = await exchange({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  });

  if (!payload?.access_token) {
    session.destroy();
    return null;
  }

  apply(session, payload);
  delete session.state;
  await session.save();
  return session.token || null;
}

export async function token(session?: Store) {
  const value = session || (await getsession());
  if (!value.token) return null;
  if (!due(value)) return value.token;
  if (!value.refresh) {
    value.destroy();
    return null;
  }

  if (
    typeof value.refreshexpires === 'number' &&
    Date.now() >= value.refreshexpires - window
  ) {
    value.destroy();
    return null;
  }

  const payload = await exchange({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    grant_type: 'refresh_token',
    refresh_token: value.refresh,
  });

  if (!payload?.access_token) {
    value.destroy();
    return null;
  }

  apply(value, payload);
  await value.save();
  return value.token || null;
}
