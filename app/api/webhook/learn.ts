import { generateText } from 'ai';
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
    .map(l => `  ${l}`)
    .join('\n');
  const yaml = `${rest}prompt: |\n${promptlines}\n`;

  await dancer.rest.repos.createOrUpdateFileContents({
    owner: gh.owner,
    repo: gh.repo,
    path: '.github/tigent.yml',
    message: `fix: update prompt from #${issue}`,
    content: Buffer.from(yaml).toString('base64'),
    branch,
    ...(filesha ? { sha: filesha } : {}),
  });

  await dancer.rest.pulls.create({
    owner: gh.owner,
    repo: gh.repo,
    title: `fix: learn from #${issue} correction`,
    body: `adds rule to prompt in \`.github/tigent.yml\` from issue #${issue} correction.\n\n**new rule:**\n> ${rule}`,
    head: branch,
    base: defaultbranch,
  });
}
