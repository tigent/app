import { NextResponse } from 'next/server';
import { token } from '@/app/lib/oauth';
import { getsession } from '@/app/lib/session';
import { Autherror, fetchrepos } from '@/app/lib/github';

export async function GET() {
  const session = await getsession();
  const value = await token(session);
  if (!value) return NextResponse.json([], { status: 401 });

  try {
    const repos = await fetchrepos(value);
    return NextResponse.json(repos);
  } catch (error) {
    if (!(error instanceof Autherror)) throw error;
    session.destroy();
    return NextResponse.json([], { status: 401 });
  }
}
