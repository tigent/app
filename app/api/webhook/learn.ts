import { generateText } from 'ai';
import { Octokit } from 'octokit';
import { parse, stringify } from 'yaml';
import type { Gh, Config } from './triage';

const dancer = process.env.DANCER_PAT
  ? new Octokit({ auth: process.env.DANCER_PAT })
  : null;

async function rewrite(
  current: string,
  context: string,
  model: string,
): Promise<string> {
  const { text } = await generateText({
    model,
    system: `you maintain a concise ruleset for a github issue labeling bot. given the current rules and a correction, output an updated ruleset that incorporates the lesson. keep it short and direct. output only the rules, nothing else. if the current rules are empty, start fresh.`,
    prompt: `current rules:\n${current || '(none)'}\n\ncorrection:\n${context}`,
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
  const newprompt = await rewrite(config.prompt, context, config.model);

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

  const yaml = stringify(fileconfig);

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
    body: `updates prompt in \`.github/tigent.yml\` from issue #${issue} correction.\n\n\`\`\`yaml\nprompt: |\n  ${newprompt.split('\n').join('\n  ')}\n\`\`\``,
    head: branch,
    base: defaultbranch,
  });
}
