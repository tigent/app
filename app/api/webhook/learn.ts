import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { Octokit } from 'octokit';
import { parse, stringify } from 'yaml';
import type { Gh, Config } from './triage';

const dancer = process.env.DANCER_PAT
  ? new Octokit({ auth: process.env.DANCER_PAT })
  : null;

async function lesson(context: string, model: string): Promise<string> {
  const { text } = await generateText({
    model,
    system: `you write a single short rule for a github issue labeling bot based on a correction. output one line only, no bullets or prefixes. example: "issues about improving existing structured output support are enhancement, not feature."`,
    prompt: context,
  });
  return text.trim();
}

const reviewschema = z.object({
  approved: z.boolean(),
  reason: z.string(),
});

async function review(diff: string, model: string) {
  const { object } = await generateObject({
    model,
    schema: reviewschema,
    system: `you review pull requests that update a labeling bot's prompt config. approve if the change is safe:
- only .github/tigent.yml was modified
- the existing prompt is preserved (not rewritten or truncated)
- only one short rule was appended at the end
- the rule is relevant to issue labeling
- no other config values (confidence, users, model) were changed

reject if anything looks off: prompt was rewritten, content was removed, unrelated changes, or the rule doesn't make sense. be brief in your reason.`,
    prompt: diff,
  });
  return object;
}

export async function createpr(
  gh: Gh,
  issue: number,
  title: string,
  correctlabels: string[],
  ailabels: string[],
  config: Config,
) {
  if (!dancer) return;

  const context = `issue: "${title}"\nai assigned: ${ailabels.join(', ') || '(none)'}\ncorrect labels: ${correctlabels.join(', ')}`;
  const rule = await lesson(context, config.model);
  const newprompt = config.prompt
    ? `${config.prompt.trimEnd()}\n${rule}`
    : rule;

  const { data: repo } = await dancer.rest.repos.get({
    owner: gh.owner,
    repo: gh.repo,
  });
  const branch = `tigent/learn-${issue}`;
  const defaultbranch = repo.default_branch;

  const { data: ref } = await dancer.rest.git.getRef({
    owner: gh.owner,
    repo: gh.repo,
    ref: `heads/${defaultbranch}`,
  });
  const sha = ref.object.sha;

  await dancer.rest.git.createRef({
    owner: gh.owner,
    repo: gh.repo,
    ref: `refs/heads/${branch}`,
    sha,
  });

  let fileconfig: Partial<Config> = {};
  let filesha: string | undefined;

  try {
    const { data } = await dancer.rest.repos.getContent({
      owner: gh.owner,
      repo: gh.repo,
      path: '.github/tigent.yml',
      ref: defaultbranch,
    });
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString();
      fileconfig = (parse(content) as Partial<Config>) || {};
      filesha = data.sha;
    }
  } catch {}

  fileconfig.prompt = newprompt;
  delete (fileconfig as any).prompt;

  const rest = Object.keys(fileconfig).length > 0 ? stringify(fileconfig) : '';
  const promptlines = newprompt
    .split('\n')
    .map(l => (l ? `  ${l}` : ''))
    .join('\n');
  const yaml = `${rest}\nprompt: |\n${promptlines}\n`;

  await dancer.rest.repos.createOrUpdateFileContents({
    owner: gh.owner,
    repo: gh.repo,
    path: '.github/tigent.yml',
    message: `fix: update prompt from #${issue}`,
    content: Buffer.from(yaml).toString('base64'),
    branch,
    ...(filesha ? { sha: filesha } : {}),
  });

  const { data: pr } = await dancer.rest.pulls.create({
    owner: gh.owner,
    repo: gh.repo,
    title: `fix: learn from #${issue} correction`,
    body: `adds rule to prompt in \`.github/tigent.yml\` from issue #${issue} correction.\n\n**new rule:**\n> ${rule}`,
    head: branch,
    base: defaultbranch,
  });

  const { data: diff } = await dancer.rest.pulls.get({
    owner: gh.owner,
    repo: gh.repo,
    pull_number: pr.number,
    mediaType: { format: 'diff' },
  });

  const result = await review(diff as unknown as string, config.model);

  if (result.approved) {
    await dancer.rest.pulls.merge({
      owner: gh.owner,
      repo: gh.repo,
      pull_number: pr.number,
      merge_method: 'squash',
    });
  }
}
