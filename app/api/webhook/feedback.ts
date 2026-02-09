import { generateText, Output } from 'ai';
import { z } from 'zod';
import type { Gh, Config } from './triage';
import { classify, fetchlabels, addlabels } from './triage';
import { createpr } from './learn';

const intentschema = z.object({
  intent: z.enum(['why', 'wrong', 'unsupported']),
  labels: z.array(z.string()),
  reply: z.string(),
});

async function parseintent(
  config: Config,
  comment: string,
  available: string[],
) {
  const { output } = await generateText({
    model: config.model,
    output: Output.object({ schema: intentschema }),
    system: `you parse commands directed at a github issue labeling bot called tigent.

classify the intent:
- "why": user wants to know why labels were assigned or wants the bot to explain its reasoning.
- "wrong": user is correcting the labels. extract the correct label names into the labels array. match against available labels (case-insensitive).
- "unsupported": user is asking the bot to do something it cannot do (close, delete, assign, merge, etc). write a short one-sentence reply explaining what tigent can do instead.

available labels: ${available.join(', ')}

rules:
- for "why" intent, labels array should be empty, reply should be empty.
- for "wrong" intent, extract every label the user mentions. reply should be empty.
- for "unsupported" intent, labels array should be empty. reply should be brief and lowercase.
- only include labels that exist in the available labels list.`,
    prompt: comment,
  });
  return output!;
}

export async function handlecomment(gh: Gh, config: Config, payload: any) {
  const comment = payload.comment;
  const body: string = comment.body?.trim() || '';
  const association: string = comment.author_association || '';

  if (!['OWNER', 'MEMBER', 'COLLABORATOR'].includes(association)) return;
  if (!body.toLowerCase().startsWith('@tigent')) return;

  await reactcomment(gh, comment.id);

  const repolabels = await fetchlabels(gh);
  const available = repolabels.map(l => l.name);
  const message = body.slice(7).trim();
  const issue = payload.issue;

  const intent = await parseintent(config, message, available);

  if (intent.intent === 'why') {
    await handlewhy(gh, config, issue, repolabels);
  } else if (intent.intent === 'wrong' && intent.labels.length > 0) {
    await handlewrong(gh, config, issue, intent.labels, repolabels);
  } else if (intent.intent === 'unsupported' && intent.reply) {
    await gh.octokit.rest.issues.createComment({
      owner: gh.owner,
      repo: gh.repo,
      issue_number: issue.number,
      body: intent.reply,
    });
  }
}

async function handlewhy(gh: Gh, config: Config, issue: any, labels: any[]) {
  const result = await classify(config, labels, issue.title, issue.body || '');
  const labelstr = result.labels.join(', ');
  const body = `**labels:** ${labelstr}\n**confidence:** ${result.confidence}\n\n${result.reasoning}`;

  await gh.octokit.rest.issues.createComment({
    owner: gh.owner,
    repo: gh.repo,
    issue_number: issue.number,
    body,
  });
}

async function handlewrong(
  gh: Gh,
  config: Config,
  issue: any,
  correctlabels: string[],
  repolabels: any[],
) {
  const [result, current] = await Promise.all([
    classify(config, repolabels, issue.title, issue.body || ''),
    gh.octokit.rest.issues.listLabelsOnIssue({
      owner: gh.owner,
      repo: gh.repo,
      issue_number: issue.number,
    }),
  ]);

  const ailabels = result.labels;
  const existing = current.data.map(l => l.name);

  const lowercorrect = correctlabels.map(l => l.toLowerCase());
  for (const label of ailabels) {
    if (
      existing.includes(label) &&
      !lowercorrect.includes(label.toLowerCase())
    ) {
      await gh.octokit.rest.issues.removeLabel({
        owner: gh.owner,
        repo: gh.repo,
        issue_number: issue.number,
        name: label,
      });
    }
  }

  const validcorrect = correctlabels.filter(l =>
    repolabels.some(x => x.name.toLowerCase() === l.toLowerCase()),
  );
  const matchedlabels = validcorrect.map(l => {
    const match = repolabels.find(
      x => x.name.toLowerCase() === l.toLowerCase(),
    );
    return match!.name;
  });

  if (matchedlabels.length > 0) {
    await addlabels(gh, issue.number, matchedlabels);
  }

  await createpr(
    gh,
    issue.number,
    issue.title,
    matchedlabels,
    ailabels,
    config,
  );
}

async function reactcomment(gh: Gh, commentid: number) {
  await gh.octokit.rest.reactions.createForIssueComment({
    owner: gh.owner,
    repo: gh.repo,
    comment_id: commentid,
    content: 'eyes',
  });
}
