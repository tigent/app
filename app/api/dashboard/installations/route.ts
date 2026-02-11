import { NextResponse } from 'next/server';
import { getsession } from '@/app/lib/session';
import { fetchrepos } from '@/app/lib/github';

export async function GET() {
  const session = await getsession();
  if (!session.token) return NextResponse.json([], { status: 401 });

  const repos = await fetchrepos(session.token);
  return NextResponse.json(repos);
}
