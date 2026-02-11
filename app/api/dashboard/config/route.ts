import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getsession } from '@/app/lib/session';
import { useroctokit } from '@/app/lib/github';

export async function GET(req: NextRequest) {
  const session = await getsession();
  if (!session.token) return NextResponse.json(null, { status: 401 });

  const repo = req.nextUrl.searchParams.get('repo');
  const owner = req.nextUrl.searchParams.get('owner');
  if (!repo || !owner) return NextResponse.json(null);

  const octokit = useroctokit(session.token);
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: '.github/tigent.yml',
      mediaType: { format: 'raw' },
    });
    return NextResponse.json({ content: data as unknown as string });
  } catch {
    return NextResponse.json({ content: null });
  }
}
