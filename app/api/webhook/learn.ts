import { generateText } from 'ai';
import { parse, stringify } from 'yaml';
import type { Gh, Config } from './triage';

async function updatedprompt(
  current: string,
  context: string,
  model: string,
): Promise<string> {
  const { text } = await generateText({
    model,
    system: `you maintain a ruleset for a github issue labeling bot. given the current rules and a correction, output the updated rules.

instructions:
- if an existing rule contradicts the correction, update that rule in place
- if no existing rule covers this case, append a new line at the end
- do not reference specific issue titles or numbers
- focus on general patterns, not one-off cases
- keep every existing rule that is not contradicted
- preserve the exact formatting, line breaks, and structure
- output only the full updated rules, nothing else`,
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
  const context = `issue: "${title}"\nai assigned: ${ailabels.join(', ') || '(none)'}\ncorrect labels: ${correctlabels.join(', ')}`;
  const newprompt = await updatedprompt(config.prompt, context, config.model);

  const { data: repo } = await gh.octokit.rest.repos.get({
    owner: gh.owner,
    repo: gh.repo,
  });
  const branch = `tigent/learn-${issue}`;
  const defaultbranch = repo.default_branch;

  const { data: ref } = await gh.octokit.rest.git.getRef({
    owner: gh.owner,
    repo: gh.repo,
    ref: `heads/${defaultbranch}`,
  });
  const sha = ref.object.sha;

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
    sha,
  });

  let fileconfig: Partial<Config> = {};
  let filesha: string | undefined;

  try {
    const { data } = await gh.octokit.rest.repos.getContent({
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
  const yaml = rest
    ? `${rest}\nprompt: |\n${promptlines}\n`
    : `prompt: |\n${promptlines}\n`;

  await gh.octokit.rest.repos.createOrUpdateFileContents({
    owner: gh.owner,
    repo: gh.repo,
    path: '.github/tigent.yml',
    message: `fix: update prompt from #${issue}`,
    content: Buffer.from(yaml).toString('base64'),
    branch,
    ...(filesha ? { sha: filesha } : {}),
  });

  await gh.octokit.rest.pulls.create({
    owner: gh.owner,
    repo: gh.repo,
    title: `fix: learn from #${issue} correction`,
    body: `updates prompt in \`.github/tigent.yml\` from issue #${issue} correction.\n\n**correction:** ai assigned ${ailabels.join(', ') || '(none)'}, correct labels are ${correctlabels.join(', ')}.`,
    head: branch,
    base: defaultbranch,
  });
}
