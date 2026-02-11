import { generateText, Output } from 'ai';
import { z } from 'zod';
import { parse } from 'yaml';
import type { Octokit } from 'octokit';

export interface Gh {
  octokit: Octokit;
  owner: string;
  repo: string;
}

export interface Config {
  model: string;
  prompt: string;
}

export interface Label {
  name: string;
  description: string;
  color: string;
}

export const defaultconfig: Config = {
  model: 'google/gemini-2.5-flash',
  prompt: '',
};

export async function getconfig(gh: Gh): Promise<Config> {
  try {
    const { data } = await gh.octokit.rest.repos.getContent({
      owner: gh.owner,
      repo: gh.repo,
      path: '.github/tigent.yml',
      mediaType: { format: 'raw' },
    });
    const yaml = data as unknown as string;
    const parsed = parse(yaml) as Partial<Config>;
    return { ...defaultconfig, ...parsed };
  } catch {
    return defaultconfig;
  }
}

export async function fetchlabels(gh: Gh): Promise<Label[]> {
  const { data } = await gh.octokit.rest.issues.listLabelsForRepo({
    owner: gh.owner,
    repo: gh.repo,
    per_page: 100,
  });
  return data.map(l => ({
    name: l.name,
    description: l.description || '',
    color: l.color,
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

export type ClassifyResult = z.infer<typeof schema>;

export async function classify(
  config: Config,
  labels: Label[],
  title: string,
  body: string,
  extra?: string,
) {
  const labellist = labels
    .map(l => (l.description ? `- ${l.name}: ${l.description}` : `- ${l.name}`))
    .join('\n');

  const system = `${config.prompt || 'you are a github issue classifier. assign labels based on the content.'}

available labels:
${labellist}

rules:
- only use labels from the list above
- pick labels that match the content
- use label descriptions to understand what each label means
- be conservative, only add labels you are confident about

respond with:
- labels: array of { name, reason } for each label you apply. reason should be one sentence explaining why.
- rejected: array of { name, reason } for 2-4 labels you considered but rejected. reason should explain why it was close but not right.
- confidence: "high", "medium", or "low" based on how sure you are about the labels.
- summary: one sentence summarizing what this issue/pr is about.`;

  const prompt = `title: ${title}

body:
${body || 'no description'}${extra ? `\n\n${extra}` : ''}`;

  const { output } = await generateText({
    model: config.model,
    output: Output.object({ schema }),
    system,
    prompt,
  });
  const colormap = new Map(labels.map(l => [l.name, l.color]));
  const valid = output!.labels
    .filter(l => labels.some(x => x.name === l.name))
    .map(l => ({ ...l, color: colormap.get(l.name) || '' }));
  const rejected = output!.rejected.map(l => ({
    ...l,
    color: colormap.get(l.name) || '',
  }));
  return {
    labels: valid,
    rejected,
    confidence: output!.confidence,
    summary: output!.summary,
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
    config,
    labels,
    issue.data.title,
    issue.data.body || '',
  );

  const labelnames = result.labels.map(l => l.name);
  const skipped = labelnames.length === 0;
  if (!skipped) await addlabels(gh, number, labelnames);

  return {
    labels: result.labels,
    rejected: result.rejected,
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

  const [pr, files, labels] = await Promise.all([
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
    fetchlabels(gh),
  ]);

  const diff = files.data
    .map(f => {
      const patch = f.patch ? `\n${f.patch}` : '';
      return `${f.filename} (+${f.additions} -${f.deletions})${patch}`;
    })
    .join('\n\n');

  const { text: summary } = await generateText({
    model: config.model,
    system: `summarize a pull request diff into 3-8 bullet points. focus on what changed and why, not line-by-line details. mention which packages or areas were modified. be concise.`,
    prompt: `title: ${pr.data.title}\n\nbody:\n${pr.data.body || 'no description'}\n\ndiff:\n${diff}`,
  });

  const extra = `pr summary:\n${summary}`;

  const result = await classify(
    config,
    labels,
    pr.data.title,
    pr.data.body || '',
    extra,
  );

  const labelnames = result.labels.map(l => l.name);
  const skipped = labelnames.length === 0;
  if (!skipped) await addlabels(gh, number, labelnames);

  return {
    labels: result.labels,
    rejected: result.rejected,
    confidence: result.confidence,
    summary: result.summary,
    title: pr.data.title,
    author: pr.data.user?.login || '',
    url: pr.data.html_url,
    duration: Date.now() - start,
    skipped,
    available: labels.length,
  };
}
