import { NextResponse } from 'next/server';
import { token } from '@/app/lib/oauth';
import { getsession } from '@/app/lib/session';

export async function GET() {
  const session = await getsession();
  if (!(await token(session))) {
    return NextResponse.json({ username: '', avatar: '' });
  }
  return NextResponse.json({
    username: session.username || '',
    avatar: session.avatar || '',
  });
}
