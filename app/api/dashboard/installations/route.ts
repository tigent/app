import { NextResponse } from 'next/server';
import { getsession } from '@/app/lib/session';
import { useroctokit } from '@/app/lib/github';

export interface Repo {
  id: number;
  name: string;
  owner: string;
  installationid: number;
}

export async function GET() {
  const session = await getsession();
  if (!session.token) return NextResponse.json([], { status: 401 });

  const octokit = useroctokit(session.token);

  try {
    const { data } =
      await octokit.rest.apps.listInstallationsForAuthenticatedUser();
    const repos: Repo[] = [];
    for (const installation of data.installations) {
      const { data: repodata } =
        await octokit.rest.apps.listInstallationReposForAuthenticatedUser({
          installation_id: installation.id,
        });
      for (const r of repodata.repositories) {
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
