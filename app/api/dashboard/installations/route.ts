import { NextResponse } from 'next/server';
import { getsession } from '@/app/lib/session';
import { getapp } from '@/app/lib/github';

export interface Repo {
  id: number;
  name: string;
  owner: string;
  installationid: number;
}

export async function GET() {
  const session = await getsession();
  if (!session.token) return NextResponse.json([], { status: 401 });

  const app = getapp();

  try {
    const repos: Repo[] = [];
    for await (const {
      installation,
      octokit,
    } of app.eachInstallation.iterator()) {
      const { data } =
        await octokit.rest.apps.listReposAccessibleToInstallation({
          per_page: 100,
        });
      for (const r of data.repositories) {
        repos.push({
          id: r.id,
          name: r.name,
          owner: r.owner.login,
          installationid: installation.id,
        });
      }
    }
    return NextResponse.json(repos);
  } catch {
    return NextResponse.json([]);
  }
}
