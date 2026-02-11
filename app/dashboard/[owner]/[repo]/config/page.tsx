import { getsession } from '@/app/lib/session';
import { useroctokit } from '@/app/lib/github';
import { Config } from '../../../components/config';

async function fetchconfig(token: string, owner: string, repo: string) {
  const octokit = useroctokit(token);
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: '.github/tigent.yml',
      mediaType: { format: 'raw' },
    });
    return data as unknown as string;
  } catch {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const session = await getsession();
  const content = session.token
    ? await fetchconfig(session.token, owner, repo)
    : null;

  return (
    <div className="p-5 md:p-10 space-y-6 md:space-y-8 min-w-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
        <p className="text-muted mt-1 capitalize">
          {owner}/{repo}
        </p>
      </div>
      <Config content={content} />
    </div>
  );
}
