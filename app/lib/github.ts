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
