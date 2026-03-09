import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { token } from '@/app/lib/oauth';
import { readconfig } from '@/app/lib/repos';
import { getsession } from '@/app/lib/session';
import { Autherror } from '@/app/lib/github';

export async function GET(req: NextRequest) {
  const session = await getsession();
  const value = await token(session);
  if (!value) return NextResponse.json(null, { status: 401 });

  const repo = req.nextUrl.searchParams.get('repo');
  const owner = req.nextUrl.searchParams.get('owner');
  if (!repo || !owner) return NextResponse.json(null);

  try {
    const content = await readconfig(value, owner, repo);
    return NextResponse.json({ content });
  } catch (error) {
    if (error instanceof Autherror) {
      session.destroy();
      return NextResponse.json(null, { status: 401 });
    }
    return NextResponse.json({ content: null });
  }
}
