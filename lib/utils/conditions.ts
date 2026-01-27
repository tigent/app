import type { Octokit } from 'octokit';
import { generateObject } from 'ai';
import { z } from 'zod';
import type { CloseReason, MessageContext } from './messages.ts';

interface Gh {
  octokit: Octokit;
  owner: string;
  repo: string;
}

interface Issue {
  number: number;
  title: string;
  body: string | null;
  updated_at: string;
}

interface CloseConfig {
  stale?: {
    enabled: boolean;
    days: number;
  };
  outdatedVersion?: {
    enabled: boolean;
    threshold: number;
  };
}

export interface ConditionResult<T extends CloseReason = CloseReason> {
  reason: T;
  context: MessageContext<T>;
}

type ConditionChecker = (
  gh: Gh,
  issue: Issue,
  config: CloseConfig,
  model: string,
) => Promise<ConditionResult | null>;

export async function checkStale(
  _gh: Gh,
  issue: Issue,
  config: CloseConfig,
): Promise<ConditionResult<'stale'> | null> {
  if (!config.stale?.enabled) return null;

  const updated = new Date(issue.updated_at);
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < config.stale.days) return null;

  const weeks = Math.floor(diffDays / 7);
  return { reason: 'stale', context: { weeks } };
}

async function fetchNpmVersion(
  pkg: string,
): Promise<{ version: string; major: number } | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
    if (!res.ok) return null;
    const data = (await res.json()) as { version: string };
    const major = parseInt(data.version.split('.')[0] ?? '0', 10);
    return { version: data.version, major };
  } catch {
    return null;
  }
}

export async function checkOutdatedVersion(
  _gh: Gh,
  issue: Issue,
  config: CloseConfig,
  model: string,
): Promise<ConditionResult<'outdatedVersion'> | null> {
  if (!config.outdatedVersion?.enabled) return null;
  if (!issue.body) return null;

  const { object } = await generateObject({
    model,
    schema: z.object({
      packages: z.array(
        z.object({
          name: z.string(),
          version: z.string(),
          major: z.number(),
        }),
      ),
    }),
    system: `Extract all npm package versions mentioned in this GitHub issue.
              Look for patterns like:
              - @ai-sdk/react: 1.2.12
              - "@ai-sdk/openai": "2.0.12"
              - ai: 4.0.23-beta.x
              - ai@4.0.0
              - version 4.x.x (infer package from context)

              For each package found, return:
              - name: the full package name (e.g., "@ai-sdk/react", "ai")
              - version: the version string (e.g., "1.2.12")
              - major: the major version number (e.g., 1)

              If no packages are mentioned, return an empty array.`,
    prompt: `title: ${issue.title}\n\nbody:\n${issue.body}`,
  });

  if (object.packages.length === 0) return null;

  const npmResults = await Promise.all(
    object.packages.map(async pkg => ({
      pkg,
      npm: await fetchNpmVersion(pkg.name),
    })),
  );

  for (const { pkg, npm } of npmResults) {
    if (!npm) continue;

    const diff = npm.major - pkg.major;
    if (diff >= config.outdatedVersion.threshold) {
      return {
        reason: 'outdatedVersion',
        context: {
          package: pkg.name,
          mentioned: pkg.version,
          current: npm.version,
        },
      };
    }
  }

  return null;
}

export const conditions: ConditionChecker[] = [
  checkStale,
  checkOutdatedVersion,
];
