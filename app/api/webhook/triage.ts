import { generateText, Output } from 'ai';
import type { Octokit } from 'octokit';
import { z } from 'zod';
import type { Config } from '@/app/lib/config';
import { parseconfig } from '@/app/lib/config';
import { matchmemory } from '@/app/lib/memory';
import { call } from '@/app/lib/model';
import { filterlabels } from '@/app/lib/policy';

export interface Gh {
  octokit: Octokit;
  owner: string;
  repo: string;
}

export interface Label {
  name: string;
  description: string;
  color: string;
}

export const schema = z.object({
  labels: z.array(
    z.object({
      name: z.string(),
      reason: z.string(),
    }),
  ),
  rejected: z.array(
    z.object({
      name: z.string(),
      reason: z.string(),
    }),
  ),
  confidence: z.enum(['high', 'medium', 'low']),
  summary: z.string(),
});

function canon(labels: Label[]) {
  return new Map(labels.map(label => [label.name.toLowerCase(), label]));
}

function memoryblock(items: Awaited<ReturnType<typeof matchmemory>>) {
  if (items.length === 0) return '';
  return `\nrelevant repo memory:\n${items
    .map(
      item =>
        `- ${item.title}\n  labels: ${item.correct.join(', ') || '(none)'}\n  source: ${item.source}\n  note: ${item.summary}`,
    )
    .join('\n')}`;
}

function policyblock(config: Config) {
  if (config.blocklist.length === 0) return '';
  return `\nrepo blocklist:\n- ${config.blocklist.join('\n- ')}`;
}

export async function getconfig(gh: Gh): Promise<Config> {
  try {
    const { data } = await gh.octokit.rest.repos.getContent({
      owner: gh.owner,
      repo: gh.repo,
      path: '.github/tigent.yml',
      mediaType: { format: 'raw' },
    });
    return parseconfig(data as unknown as string);
  } catch {
    return parseconfig();
  }
}

export async function fetchlabels(gh: Gh): Promise<Label[]> {
  const { data } = await gh.octokit.rest.issues.listLabelsForRepo({
    owner: gh.owner,
    repo: gh.repo,
    per_page: 100,
  });
  return data.map(label => ({
    name: label.name,
    description: label.description || '',
    color: label.color,
  }));
}

export async function addlabels(gh: Gh, issue: number, labels: string[]) {
  if (labels.length === 0) return;
  await gh.octokit.rest.issues.addLabels({
    owner: gh.owner,
    repo: gh.repo,
    issue_number: issue,
    labels,
  });
}

export async function summarizepr(gh: Gh, config: Config, number: number) {
  const [pr, files] = await Promise.all([
    gh.octokit.rest.pulls.get({
      owner: gh.owner,
      repo: gh.repo,
      pull_number: number,
    }),
    gh.octokit.rest.pulls.listFiles({
      owner: gh.owner,
      repo: gh.repo,
      pull_number: number,
      per_page: 100,
    }),
  ]);

  const diff = files.data
    .map(file => {
      const patch = file.patch ? `\n${file.patch}` : '';
      return `${file.filename} (+${file.additions} -${file.deletions})${patch}`;
    })
    .join('\n\n');
  const changed = files.data
    .slice(0, 12)
    .map(file => `- ${file.filename} (+${file.additions} -${file.deletions})`)
    .join('\n');
  const more =
    files.data.length > 12
      ? `\n- ...and ${files.data.length - 12} more files`
      : '';

  const { text } = await generateText({
    ...call(config.model),
    system:
      'summarize a pull request diff into 3-8 bullet points. focus on what changed and why, not line-by-line details. mention which packages or areas were modified. be concise.',
    prompt: `title: ${pr.data.title}\n\nbody:\n${pr.data.body || 'no description'}\n\ndiff:\n${diff}`,
  });

  return {
    title: pr.data.title,
    body: pr.data.body || '',
    url: pr.data.html_url,
    author: pr.data.user?.login || '',
    context: `pr summary:\n${text}\n\nchanged files:\n${changed}${more}`,
  };
}

export async function react(gh: Gh, issue: number, content: string = 'eyes') {
  await gh.octokit.rest.reactions.createForIssue({
    owner: gh.owner,
    repo: gh.repo,
    issue_number: issue,
    content: content as
      | '+1'
      | '-1'
      | 'laugh'
      | 'confused'
      | 'heart'
      | 'hooray'
      | 'rocket'
      | 'eyes',
  });
}

export async function classify(
  gh: Gh,
  config: Config,
  labels: Label[],
  title: string,
  body: string,
  extra?: string,
  overrides?: { memories?: Awaited<ReturnType<typeof matchmemory>> },
) {
  const items =
    overrides?.memories ||
    (await matchmemory(
      `${gh.owner}/${gh.repo}`,
      [title, body, extra || ''].join('\n'),
    ));
  const list = labels
    .map(label =>
      label.description
        ? `- ${label.name}: ${label.description}`
        : `- ${label.name}`,
    )
    .join('\n');

  const system = `${config.prompt || 'you are a github issue classifier. assign labels based on the content.'}

available labels:
${list}${policyblock(config)}${memoryblock(items)}

rules:
- only use labels from the list above
- use label descriptions to understand what each label means
- be conservative, only add labels you are confident about
- never choose labels that appear in the repo blocklist
- relevant repo memory represents past maintainer corrections and should be treated as precedent

respond with:
- labels: array of { name, reason } for each label you apply. reason should be one sentence explaining why.
- rejected: array of { name, reason } for 2-4 labels you considered but rejected. reason should explain why it was close but not right.
- confidence: "high", "medium", or "low" based on how sure you are about the labels.
- summary: one sentence summarizing what this issue or pr is about.`;

  const prompt = `title: ${title}

body:
${body || 'no description'}${extra ? `\n\n${extra}` : ''}`;

  const { output } = await generateText({
    ...call(config.model),
    output: Output.object({ schema }),
    system,
    prompt,
  });

  const names = canon(labels);
  const picked = (output?.labels || []).flatMap(item => {
    const match = names.get(item.name.toLowerCase());
    if (!match) return [];
    return [
      {
        name: match.name,
        reason: item.reason,
        color: match.color,
      },
    ];
  });

  const rejected = (output?.rejected || [])
    .map(item => {
      const match = names.get(item.name.toLowerCase());
      return {
        name: match?.name || item.name,
        reason: item.reason,
        color: match?.color || '',
      };
    })
    .filter(item => item.name);

  const policy = filterlabels(
    config.blocklist,
    picked.map(item => item.name),
  );
  const allowed = new Set(policy.allowed.map(name => name.toLowerCase()));

  return {
    labels: picked.filter(item => allowed.has(item.name.toLowerCase())),
    rejected,
    blocked: policy.blocked,
    memories: items,
    confidence: output?.confidence,
    summary: output?.summary || '',
  };
}

export async function triageissue(gh: Gh, config: Config, number: number) {
  const start = Date.now();
  await react(gh, number);

  const [issue, labels] = await Promise.all([
    gh.octokit.rest.issues.get({
      owner: gh.owner,
      repo: gh.repo,
      issue_number: number,
    }),
    fetchlabels(gh),
  ]);

  const result = await classify(
    gh,
    config,
    labels,
    issue.data.title,
    issue.data.body || '',
  );

  const names = result.labels.map(label => label.name);
  const skipped = names.length === 0;
  if (!skipped) await addlabels(gh, number, names);

  return {
    labels: result.labels,
    rejected: result.rejected,
    blocked: result.blocked,
    memories: result.memories,
    confidence: result.confidence,
    summary: result.summary,
    title: issue.data.title,
    author: issue.data.user?.login || '',
    url: issue.data.html_url,
    duration: Date.now() - start,
    skipped,
    available: labels.length,
  };
}

export async function triagepr(gh: Gh, config: Config, number: number) {
  const start = Date.now();
  await react(gh, number);

  const [labels, summary] = await Promise.all([
    fetchlabels(gh),
    summarizepr(gh, config, number),
  ]);

  const result = await classify(
    gh,
    config,
    labels,
    summary.title,
    summary.body,
    summary.context,
  );

  const names = result.labels.map(label => label.name);
  const skipped = names.length === 0;
  if (!skipped) await addlabels(gh, number, names);

  return {
    labels: result.labels,
    rejected: result.rejected,
    blocked: result.blocked,
    memories: result.memories,
    confidence: result.confidence,
    summary: result.summary,
    title: summary.title,
    author: summary.author,
    url: summary.url,
    context: summary.context,
    duration: Date.now() - start,
    skipped,
    available: labels.length,
  };
}
