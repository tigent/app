import { generateText, Output } from 'ai';
import { z } from 'zod';
import type { Config } from '@/app/lib/config';
import { readcontext, writelog } from '@/app/lib/logging';
import { writememory } from '@/app/lib/memory';
import { call } from '@/app/lib/model';
import { filterlabels } from '@/app/lib/policy';
import { createpr } from './learn';
import type { Gh, Label } from './triage';
import { addlabels, classify, fetchlabels, summarizepr } from './triage';

interface Issue {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  pull_request?: { url?: string };
}

interface Payload {
  comment: {
    id: number;
    body?: string;
    author_association?: string;
    user?: { login?: string } | null;
  };
  issue: Issue;
}

interface Tools {
  react: (gh: Gh, comment: number, content: 'eyes' | '-1') => Promise<void>;
  reply: (gh: Gh, issue: number, body: string) => Promise<void>;
  learn: typeof createpr;
  memory: typeof writememory;
  log: typeof writelog;
}

const schema = z.object({
  explain: z.boolean(),
  learn: z.boolean(),
  add: z.array(z.string()),
  remove: z.array(z.string()),
  block: z.array(z.string()),
  clarify: z.string(),
  reply: z.string(),
});

function canon(labels: Label[]) {
  return new Map(labels.map(label => [label.name.toLowerCase(), label.name]));
}

function match(names: string[], labels: Label[]) {
  const items = canon(labels);
  return [...new Set(names)]
    .map(name => items.get(name.toLowerCase()))
    .filter(Boolean) as string[];
}

function detail(names: string[], labels: Label[], reason: string) {
  const items = new Map(labels.map(label => [label.name, label.color]));
  return names.map(name => ({
    name,
    reason,
    color: items.get(name) || '',
  }));
}

function nextlabels(current: string[], add: string[], remove: string[]) {
  const removed = new Set(remove.map(name => name.toLowerCase()));
  const kept = current.filter(name => !removed.has(name.toLowerCase()));
  return [...new Set([...kept, ...add])];
}

export async function planmessage(
  config: Config,
  issue: {
    kind: 'issue' | 'pr';
    title: string;
    body: string | null;
    context?: string;
  },
  message: string,
  available: Label[],
  current: string[],
) {
  const list = available
    .map(label =>
      label.description
        ? `- ${label.name}: ${label.description}`
        : `- ${label.name}`,
    )
    .join('\n');
  const { output } = await generateText({
    ...call(config.model),
    output: Output.object({ schema }),
    system: `you plan actions for tigent, a github labeling agent.

capabilities:
- explain why labels were chosen
- add labels
- remove labels
- update the repo blocklist in tigent.yml
- open a learning pr to improve future behavior
- ask for clarification
- reply naturally when a request is unsupported

available labels:
${list}
current labels: ${current.join(', ') || '(none)'}
repo blocklist: ${config.blocklist.join(', ') || '(none)'}

rules:
- only include labels that exist in the available labels list
- use the issue or pr context to understand what the maintainer is referring to
- only add labels that the maintainer directly requests or clearly identifies as the correct outcome
- when a maintainer directly asks to add a specific label, include it in add even if the repo blocklist will stop tigent from applying it later
- only remove labels that the maintainer directly asks to remove or clearly says are wrong
- if the maintainer only says something is wrong without naming the right labels, ask for clarification instead of inferring the fix from issue context alone
- put labels in block when the maintainer says tigent should never add them, should leave them to humans, or should add them manually
- when the maintainer says tigent should leave a currently applied label to humans, also remove that label
- set learn to true when the maintainer asks tigent to learn, remember, update its config, update its rules, or make a pr
- set learn to true when the maintainer is defining lasting blocklist or labeling guidance
- set explain to true when the maintainer asks why or asks for reasoning
- use clarify when the maintainer says labels are wrong but the desired action is not clear enough to execute safely
- use reply for unsupported requests or brief status text
- reply should only address the unsupported or extra request, never claim that labels were added, removed, blocked, or changed
- keep reply lowercase and short`,
    prompt: `kind: ${issue.kind}

title: ${issue.title}

body:
${issue.body || 'no description'}${issue.context ? `\n\nextra context:\n${issue.context}` : ''}

maintainer message:
${message}`,
  });
  return output!;
}

async function explain(
  gh: Gh,
  config: Config,
  issue: Issue,
  labels: Label[],
  context?: string,
) {
  const result = await classify(
    gh,
    config,
    labels,
    issue.title,
    issue.body || '',
    context,
  );
  const names = result.labels.map(label => label.name).join(', ') || '(none)';
  const rows = result.labels.map(
    label => `- **${label.name}**: ${label.reason}`,
  );
  if (result.blocked.length > 0) {
    rows.push(
      ...result.blocked.map(item => `- **${item.name}**: ${item.reason}`),
    );
  }
  if (result.memories.length > 0) {
    rows.push(
      ...result.memories.map(
        item => `- **memory** ${item.title}: ${item.summary}`,
      ),
    );
  }
  return `**labels:** ${names}\n\n${rows.join('\n')}`;
}

function blockedreply(items: string[]) {
  if (items.length === 1) {
    return `i didn't add ${items[0]} because it is in this repo's blocklist.`;
  }

  return `i didn't add ${items.join(', ')} because they are in this repo's blocklist.`;
}

async function reactcomment(gh: Gh, comment: number, content: 'eyes' | '-1') {
  await gh.octokit.rest.reactions.createForIssueComment({
    owner: gh.owner,
    repo: gh.repo,
    comment_id: comment,
    content,
  });
}

async function context(gh: Gh, config: Config, issue: Issue) {
  if (!issue.pull_request) return '';

  const repo = `${gh.owner}/${gh.repo}`;
  const stored = await readcontext(repo, issue.number, 'pr');
  if (stored) return stored;

  const summary = await summarizepr(gh, config, issue.number);
  return summary.context;
}

const defaults: Tools = {
  react: reactcomment,
  reply: async (gh, issue, body) => {
    await gh.octokit.rest.issues.createComment({
      owner: gh.owner,
      repo: gh.repo,
      issue_number: issue,
      body,
    });
  },
  learn: createpr,
  memory: writememory,
  log: writelog,
};

export async function handlecomment(
  gh: Gh,
  config: Config,
  payload: Payload,
  tools: Partial<Tools> = {},
) {
  const live = { ...defaults, ...tools };
  const comment = payload.comment;
  const body = comment.body?.trim() || '';
  const association = comment.author_association || '';
  if (!['OWNER', 'MEMBER', 'COLLABORATOR'].includes(association)) return;

  const matchtext = body.match(/^@tigent\s+(.+)/is);
  if (!matchtext) return;

  const labels = await fetchlabels(gh);
  const issue = payload.issue;
  const url = issue.html_url;
  const kind = issue.pull_request ? 'pr' : 'issue';
  const current = await gh.octokit.rest.issues.listLabelsOnIssue({
    owner: gh.owner,
    repo: gh.repo,
    issue_number: issue.number,
  });
  const existing = current.data.map(label => label.name);
  const message = matchtext[1]!.trim();
  const extra = await context(gh, config, issue);
  const actions = await planmessage(
    config,
    {
      kind,
      title: issue.title,
      body: issue.body || '',
      context: extra,
    },
    message,
    labels,
    existing,
  );

  const add = match(actions.add, labels);
  const remove = match(actions.remove, labels);
  const block = match(actions.block, labels);
  const repo = `${gh.owner}/${gh.repo}`;
  const parts: string[] = [];
  const policy = filterlabels(config.blocklist, add);
  const blocked = policy.blocked;
  const allowed = policy.allowed;

  if (actions.clarify) {
    await live.react(gh, comment.id, 'eyes');
    await live.reply(gh, issue.number, actions.clarify);
    await live.log(repo, {
      type: 'feedback',
      action: 'clarify',
      number: issue.number,
      title: issue.title,
      labels: [],
      rejected: [],
      blocked: [],
      memories: [],
      summary: actions.clarify,
      author: comment.user?.login || '',
      url,
      message,
      model: config.model,
    });
    return;
  }

  if (actions.explain) {
    parts.push(await explain(gh, config, issue, labels, extra));
  }

  if (remove.length > 0) {
    for (const name of remove) {
      if (!existing.some(item => item.toLowerCase() === name.toLowerCase()))
        continue;
      await gh.octokit.rest.issues.removeLabel({
        owner: gh.owner,
        repo: gh.repo,
        issue_number: issue.number,
        name,
      });
    }
    parts.push(`removed: ${remove.join(', ')}`);
  }

  if (allowed.length > 0) {
    await addlabels(gh, issue.number, allowed);
    parts.push(`added: ${allowed.join(', ')}`);
  }

  if (blocked.length > 0) {
    parts.push(blockedreply(blocked.map(item => item.name)));
  }

  const target = nextlabels(existing, allowed, remove);
  let learning = null as null | Awaited<ReturnType<typeof createpr>>;

  if (actions.learn || block.length > 0) {
    learning = await live.learn(
      gh,
      {
        kind,
        number: issue.number,
        title: issue.title,
        body: issue.body || '',
        message,
        correct: target,
        labels: existing,
        block,
      },
      config,
    );
    parts.push(
      learning.verified
        ? `opened learning pr: ${learning.url}`
        : `opened draft learning pr: ${learning.url}`,
    );
  }

  if (actions.reply) parts.push(actions.reply);
  if (parts.length === 0) {
    parts.push(
      'tell me which labels to add, remove, explain, or keep out of tigent.',
    );
  }

  await live.react(gh, comment.id, blocked.length > 0 ? '-1' : 'eyes');
  const needsreply =
    blocked.length > 0 ||
    actions.explain ||
    Boolean(actions.clarify) ||
    actions.learn ||
    block.length > 0 ||
    Boolean(actions.reply);
  const reply = parts.join('\n\n');
  if (needsreply) {
    await live.reply(gh, issue.number, reply);
  }

  if (
    allowed.length > 0 ||
    remove.length > 0 ||
    block.length > 0 ||
    actions.learn
  ) {
    await live.memory(repo, {
      kind,
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      message,
      summary: reply,
      labels: existing,
      correct: target,
      source:
        block.length > 0 ? 'blocklist' : actions.learn ? 'learn' : 'correction',
      author: comment.user?.login || '',
      verified: true,
    });
  }

  await live.log(repo, {
    type: 'feedback',
    action:
      block.length > 0
        ? 'blocklist'
        : actions.learn
          ? 'learn'
          : actions.explain && allowed.length === 0 && remove.length === 0
            ? 'explain'
            : 'relabel',
    number: issue.number,
    title: issue.title,
    labels: detail(allowed, labels, 'requested by maintainer'),
    rejected: [],
    blocked,
    memories: [],
    summary: reply,
    author: comment.user?.login || '',
    url,
    message,
    model: config.model,
  });
}
