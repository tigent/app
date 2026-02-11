import { NextResponse } from 'next/server';
import { getsession } from '@/app/lib/session';

export async function GET() {
  const session = await getsession();
  if (!session.token) {
    return NextResponse.json({ username: '', avatar: '' });
  }
  return NextResponse.json({
    username: session.username,
    avatar: session.avatar,
  });
}
