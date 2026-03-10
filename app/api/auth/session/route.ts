import { NextResponse } from 'next/server';
import { token } from '@/app/lib/oauth';
import { getsession } from '@/app/lib/session';

export async function GET() {
  const session = await getsession();
  const headers = { 'Cache-Control': 'no-store' };
  if (!(await token(session))) {
    return NextResponse.json({ username: '', avatar: '' }, { headers });
  }
  return NextResponse.json(
    {
      username: session.username || '',
      avatar: session.avatar || '',
    },
    { headers },
  );
}
