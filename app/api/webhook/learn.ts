import { generateText } from 'ai';
import { renderconfig } from '@/app/lib/config';
import type { Config } from '@/app/lib/config';
import { call } from '@/app/lib/model';
import type { Gh } from './triage';
import { classify, fetchlabels } from './triage';

export interface Learn {
  kind: 'issue' | 'pr';
  number: number;
  title: string;
  body: string;
  message: string;
  correct: string[];
  labels: string[];
  block: string[];
}

function unique(items: string[]) {
  return [...new Set(items.map(item => item.trim()).filter(Boolean))];
}

function merge(config: Config, learn: Learn): Config {
  return {
    ...config,
    blocklist: unique([...config.blocklist, ...learn.block]),
  };
}

function context(learn: Learn) {
  return [
    `kind: ${learn.kind}`,
    `title: ${learn.title}`,
    `maintainer message: ${learn.message || '(none)'}`,
    `ai labels: ${learn.labels.join(', ') || '(none)'}`,
    `correct labels: ${learn.correct.join(', ') || '(none)'}`,
    `blocked labels: ${learn.block.join(', ') || '(none)'}`,
  ].join('\n');
}

async function updateprompt(current: string, info: string, model: string) {
  const { text } = await generateText({
    ...call(model),
    system: `you maintain a ruleset for a github labeling bot. given the current rules and maintainer guidance, output the updated rules.

instructions:
- keep formatting simple and compact
- preserve any valid rule that is still useful
- update contradictory rules in place
- add new generalized rules when needed
- do not mention specific issue or pr numbers
- do not mention one-off examples
- do not restate blocklist rules
- output only the full updated rules`,
    prompt: `current rules:\n${current || '(none)'}\n\nmaintainer guidance:\n${info}`,
  });
  return text.trim();
}

function same(left: string[], right: string[]) {
  const one = [...new Set(left.map(item => item.toLowerCase()))].sort();
  const two = [...new Set(right.map(item => item.toLowerCase()))].sort();
  return (
    one.length === two.length && one.every((item, index) => item === two[index])
  );
}

async function verify(gh: Gh, config: Config, learn: Learn) {
  if (learn.correct.length === 0) {
    return { ok: true, labels: [] as string[] };
  }
  const labels = await fetchlabels(gh);
  const result = await classify(
    gh,
    config,
    labels,
    learn.title,
    learn.body,
    `maintainer guidance:\n${learn.message}`,
  );
  const picked = result.labels.map(label => label.name);
  return {
    ok: same(picked, learn.correct),
    labels: picked,
  };
}

export async function createpr(gh: Gh, learn: Learn, config: Config) {
  let next = merge(config, learn);
  let attempts = 0;
  let verified = learn.correct.length === 0;
  let picked: string[] = [];

  if (learn.correct.length > 0 || (learn.message && learn.block.length === 0)) {
    let prompt = next.prompt;
    let info = context(learn);

    while (attempts < 3) {
      attempts += 1;
      prompt = await updateprompt(prompt, info, next.model);
      next = { ...next, prompt };
      const result = await verify(gh, next, learn);
      verified = result.ok;
      picked = result.labels;
      if (verified) break;
      info = `${context(learn)}\n\nverification failed. expected labels: ${learn.correct.join(', ') || '(none)'}\nactual labels: ${picked.join(', ') || '(none)'}`;
    }
  }

  const { data: repo } = await gh.octokit.rest.repos.get({
    owner: gh.owner,
    repo: gh.repo,
  });
  const branch = `tigent/learn-${learn.number}`;
  const base = repo.default_branch;
  const { data: ref } = await gh.octokit.rest.git.getRef({
    owner: gh.owner,
    repo: gh.repo,
    ref: `heads/${base}`,
  });

  try {
    await gh.octokit.rest.git.deleteRef({
      owner: gh.owner,
      repo: gh.repo,
      ref: `heads/${branch}`,
    });
  } catch {}

  await gh.octokit.rest.git.createRef({
    owner: gh.owner,
    repo: gh.repo,
    ref: `refs/heads/${branch}`,
    sha: ref.object.sha,
  });

  let sha: string | undefined;
  try {
    const { data } = await gh.octokit.rest.repos.getContent({
      owner: gh.owner,
      repo: gh.repo,
      path: '.github/tigent.yml',
      ref: base,
    });
    if ('sha' in data) sha = data.sha;
  } catch {}

  const yaml = renderconfig(next);
  await gh.octokit.rest.repos.createOrUpdateFileContents({
    owner: gh.owner,
    repo: gh.repo,
    path: '.github/tigent.yml',
    message: `fix: update tigent config from #${learn.number}`,
    content: Buffer.from(yaml).toString('base64'),
    branch,
    ...(sha ? { sha } : {}),
  });

  const body = [
    `updates \\.github/tigent.yml\\ from #${learn.number}.`,
    '',
    `verification: ${verified ? 'passed' : 'failed'}`,
    `attempts: ${attempts}`,
    learn.correct.length > 0
      ? `expected labels: ${learn.correct.join(', ')}`
      : 'expected labels: (none)',
    picked.length > 0
      ? `verified labels: ${picked.join(', ')}`
      : 'verified labels: (none)',
    learn.block.length > 0
      ? `blocklist additions: ${learn.block.join(', ')}`
      : '',
    learn.message ? `maintainer message: ${learn.message}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const pr = await gh.octokit.rest.pulls.create({
    owner: gh.owner,
    repo: gh.repo,
    title: `fix: learn from #${learn.number}`,
    body,
    head: branch,
    base,
    draft: !verified,
  });

  return {
    verified,
    attempts,
    picked,
    url: pr.data.html_url,
  };
}
