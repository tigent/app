import { NextResponse } from 'next/server';
import { token } from '@/app/lib/oauth';
import { getsession } from '@/app/lib/session';
import { Autherror, fetchrepos } from '@/app/lib/github';

export async function GET() {
  const session = await getsession();
  const headers = { 'Cache-Control': 'no-store' };
  const value = await token(session);
  if (!value) return NextResponse.json([], { status: 401, headers });

  try {
    const repos = await fetchrepos(value);
    return NextResponse.json(repos, { headers });
  } catch (error) {
    if (!(error instanceof Autherror)) throw error;
    session.destroy();
    return NextResponse.json([], { status: 401, headers });
  }
}
