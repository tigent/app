import { useroctokit } from './github';

export async function readconfig(token: string, owner: string, repo: string) {
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
