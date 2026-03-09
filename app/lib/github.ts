import { App, Octokit } from 'octokit';
import { allowed } from './scope';

let cached: App | null = null;

export class Autherror extends Error {}

function status(error: unknown) {
  if (!error || typeof error !== 'object' || !('status' in error)) return null;
  const value = (error as { status?: unknown }).status;
  return typeof value === 'number' ? value : null;
}

function denied(error: unknown) {
  const value = status(error);
  return value === 401 || value === 403;
}

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
      data.installations.map(installation =>
        octokit.rest.apps
          .listInstallationReposForAuthenticatedUser({
            installation_id: installation.id,
          })
          .then(result => ({
            installation,
            repos: result.data.repositories,
          })),
      ),
    );
    const repos: Repo[] = [];
    for (const result of results) {
      for (const repo of result.repos) {
        if (!allowed(repo.owner.login, repo.name)) continue;
        repos.push({
          id: repo.id,
          name: repo.name,
          owner: repo.owner.login,
          installationid: result.installation.id,
        });
      }
    }
    return repos;
  } catch (error) {
    if (denied(error)) throw new Autherror();
    return [];
  }
}
