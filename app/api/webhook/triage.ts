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
  confidence: number;
  model: string;
  prompt: string;
  users: string[];
}

export interface Label {
  name: string;
  description: string;
}

export const defaultconfig: Config = {
  confidence: 0.6,
  model: 'openai/gpt-5-nano',
  prompt: '',
  users: [],
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
  return data.map(l => ({ name: l.name, description: l.description || '' }));
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

export async function react(gh: Gh, issue: number) {
  await gh.octokit.rest.reactions.createForIssue({
    owner: gh.owner,
    repo: gh.repo,
    issue_number: issue,
    content: 'eyes',
  });
}

export const schema = z.object({
  labels: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

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

  const promptblock = config.prompt
    ? `\nadditional context:\n${config.prompt}\n`
    : '';

  const system = `you are a github issue classifier. assign labels based on the content.

available labels:
${labellist}
${promptblock}
rules:
- only use labels from the list above
- pick labels that match the content
- use label descriptions to understand what each label means
- be conservative, only add labels you are confident about`;

  const prompt = `title: ${title}

body:
${body || 'no description'}${extra ? `\n\n${extra}` : ''}`;

  const { output } = await generateText({
    model: config.model,
    output: Output.object({ schema }),
    system,
    prompt,
  });
  const valid = output!.labels.filter(l => labels.some(x => x.name === l));
  return {
    labels: valid,
    confidence: output!.confidence,
    reasoning: output!.reasoning,
  };
}

export async function triageissue(gh: Gh, config: Config, number: number) {
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

  if (result.confidence >= config.confidence && result.labels.length > 0) {
    await addlabels(gh, number, result.labels);
  }
}

export async function triagepr(gh: Gh, config: Config, number: number) {
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

  const filelist = files.data.map(f => f.filename).join('\n');
  const extra = `changed files:\n${filelist}`;

  const result = await classify(
    config,
    labels,
    pr.data.title,
    pr.data.body || '',
    extra,
  );

  if (result.confidence >= config.confidence && result.labels.length > 0) {
    await addlabels(gh, number, result.labels);
  }
}
