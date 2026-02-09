import type { Gh, Config } from './triage';
import { classify, fetchlabels, addlabels } from './triage';
import { createpr } from './learn';

export async function handlecomment(gh: Gh, config: Config, payload: any) {
  const comment = payload.comment;
  const body: string = comment.body?.trim() || '';
  const username: string = comment.user?.login || '';

  if (!config.users.some(u => u.toLowerCase() === username.toLowerCase()))
    return;
  if (!body.toLowerCase().startsWith('@tigent')) return;

  const command = body.slice(7).trim().toLowerCase();
  const issue = payload.issue;

  if (command === 'why') {
    await handlewhy(gh, config, issue, comment.id);
  } else if (command.startsWith('wrong')) {
    const rest = body.slice(7).trim().slice(5).trim();
    const labels = parselabels(rest);
    if (labels.length > 0) {
      await handlewrong(gh, config, issue, comment.id, labels);
    }
  }
}

async function handlewhy(
  gh: Gh,
  config: Config,
  issue: any,
  commentid: number,
) {
  await reactcomment(gh, commentid);

  const labels = await fetchlabels(gh);
  const result = await classify(config, labels, issue.title, issue.body || '');

  const labelstr = result.labels.join(', ');
  const body = `**labels:** ${labelstr}\n**confidence:** ${result.confidence}\n\n${result.reasoning}`;

  await gh.octokit.rest.issues.createComment({
    owner: gh.owner,
    repo: gh.repo,
    issue_number: issue.number,
    body,
  });
}

async function handlewrong(
  gh: Gh,
  config: Config,
  issue: any,
  commentid: number,
  correctlabels: string[],
) {
  await reactcomment(gh, commentid);

  const [repolabels, current] = await Promise.all([
    fetchlabels(gh),
    gh.octokit.rest.issues.listLabelsOnIssue({
      owner: gh.owner,
      repo: gh.repo,
      issue_number: issue.number,
    }),
  ]);

  const result = await classify(
    config,
    repolabels,
    issue.title,
    issue.body || '',
  );

  const ailabels = result.labels;
  const existing = current.data.map(l => l.name);

  const lowercorrect = correctlabels.map(l => l.toLowerCase());
  for (const label of ailabels) {
    if (
      existing.includes(label) &&
      !lowercorrect.includes(label.toLowerCase())
    ) {
      await gh.octokit.rest.issues.removeLabel({
        owner: gh.owner,
        repo: gh.repo,
        issue_number: issue.number,
        name: label,
      });
    }
  }

  const validcorrect = correctlabels.filter(l =>
    repolabels.some(x => x.name.toLowerCase() === l.toLowerCase()),
  );
  const matchedlabels = validcorrect.map(l => {
    const match = repolabels.find(
      x => x.name.toLowerCase() === l.toLowerCase(),
    );
    return match!.name;
  });

  if (matchedlabels.length > 0) {
    await addlabels(gh, issue.number, matchedlabels);
  }

  await createpr(
    gh,
    issue.number,
    issue.title,
    matchedlabels,
    ailabels,
    config,
  );
}

function parselabels(input: string): string[] {
  const cleaned = input
    .replace(/^,/, '')
    .replace(/^should be/i, '')
    .trim();
  if (!cleaned) return [];
  return cleaned
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function reactcomment(gh: Gh, commentid: number) {
  await gh.octokit.rest.reactions.createForIssueComment({
    owner: gh.owner,
    repo: gh.repo,
    comment_id: commentid,
    content: 'eyes',
  });
}
