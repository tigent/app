import { Autherror, useroctokit } from './github';

function status(error: unknown) {
  if (!error || typeof error !== 'object' || !('status' in error)) return null;
  const value = (error as { status?: unknown }).status;
  return typeof value === 'number' ? value : null;
}

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
  } catch (error) {
    const value = status(error);
    if (value === 401 || value === 403) throw new Autherror();
    return null;
  }
}
