import { Octokit } from 'octokit';
import { parse, stringify } from 'yaml';
import type { Gh, Config } from './triage';

const dancer = process.env.DANCER_PAT
  ? new Octokit({ auth: process.env.DANCER_PAT })
  : null;

export async function createpr(
  gh: Gh,
  issue: number,
  title: string,
  labels: string[],
) {
  if (!dancer) return;

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

  let config: Partial<Config> = {};
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
      config = (parse(content) as Partial<Config>) || {};
      filesha = data.sha;
    }
  } catch {}

  if (!config.examples) config.examples = [];
  config.examples.push({ title, labels });

  const yaml = stringify(config);

  await dancer.rest.repos.createOrUpdateFileContents({
    owner: gh.owner,
    repo: gh.repo,
    path: '.github/tigent.yml',
    message: `fix: add learning example from #${issue}`,
    content: Buffer.from(yaml).toString('base64'),
    branch,
    ...(filesha ? { sha: filesha } : {}),
  });

  await dancer.rest.pulls.create({
    owner: gh.owner,
    repo: gh.repo,
    title: `fix: learn from #${issue} correction`,
    body: `adds example to \`.github/tigent.yml\` from issue #${issue} correction.\n\n\`\`\`yaml\n- title: "${title}"\n  labels: [${labels.join(', ')}]\n\`\`\``,
    head: branch,
    base: defaultbranch,
  });
}
