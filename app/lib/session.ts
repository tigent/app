import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface Session {
  token: string;
  username: string;
  avatar: string;
  id: number;
}

const options = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'tigent',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getsession() {
  return getIronSession<Session>(await cookies(), options);
}
