import type { Octokit } from 'octokit';
import { messages, type CloseReason, type MessageContext } from './messages.ts';

interface Gh {
  octokit: Octokit;
  owner: string;
  repo: string;
}

export async function closeWithComment<T extends CloseReason>(
  gh: Gh,
  issue: number,
  reason: T,
  context: MessageContext<T>,
) {
  const body = messages[reason](context as any);

  await gh.octokit.rest.issues.createComment({
    owner: gh.owner,
    repo: gh.repo,
    issue_number: issue,
    body,
  });

  await gh.octokit.rest.issues.update({
    owner: gh.owner,
    repo: gh.repo,
    issue_number: issue,
    state: 'closed',
  });
}
