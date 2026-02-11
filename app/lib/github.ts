import { App, Octokit } from 'octokit';

let cached: App | null = null;

export function getapp() {
  if (cached) return cached;
  cached = new App({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET! },
  });
  return cached;
}

export function useroctokit(token: string) {
  return new Octokit({ auth: token });
}

export interface Repo {
  id: number;
  name: string;
  owner: string;
  installationid: number;
}

export async function fetchrepos(token: string): Promise<Repo[]> {
  const octokit = useroctokit(token);
  try {
    const { data } =
      await octokit.rest.apps.listInstallationsForAuthenticatedUser();
    const results = await Promise.all(
      data.installations.map(i =>
        octokit.rest.apps
          .listInstallationReposForAuthenticatedUser({
            installation_id: i.id,
          })
          .then(res => ({ installation: i, repos: res.data.repositories })),
      ),
    );
    const repos: Repo[] = [];
    for (const { installation, repos: repolist } of results) {
      for (const r of repolist) {
        repos.push({
          id: r.id,
          name: r.name,
          owner: r.owner.login,
          installationid: installation.id,
        });
      }
    }
    return repos;
  } catch {
    return [];
  }
}
