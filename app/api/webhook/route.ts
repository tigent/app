import { App } from 'octokit';
import { getconfig, triageissue, triagepr, react } from './triage';
import { handlecomment } from './feedback';
import { writelog } from '@/app/lib/logging';

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET! },
});

app.webhooks.on('issues.opened', async ({ octokit, payload }) => {
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const gh = { octokit, owner, repo };
  try {
    const config = await getconfig(gh);
    const result = await triageissue(gh, config, payload.issue.number);
    await writelog(`${owner}/${repo}`, {
      type: 'issue',
      number: payload.issue.number,
      title: result.title,
      labels: result.labels,
      rejected: result.rejected,
      confidence: result.confidence,
      summary: result.summary,
      model: config.model,
      duration: result.duration,
      author: result.author,
      url: result.url,
      skipped: result.skipped,
      available: result.available,
    });
  } catch {
    await react(gh, payload.issue.number, 'confused');
  }
});

app.webhooks.on('pull_request.opened', async ({ octokit, payload }) => {
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const gh = { octokit, owner, repo };
  try {
    const config = await getconfig(gh);
    const result = await triagepr(gh, config, payload.pull_request.number);
    await writelog(`${owner}/${repo}`, {
      type: 'pr',
      number: payload.pull_request.number,
      title: result.title,
      labels: result.labels,
      rejected: result.rejected,
      confidence: result.confidence,
      summary: result.summary,
      model: config.model,
      duration: result.duration,
      author: result.author,
      url: result.url,
      skipped: result.skipped,
      available: result.available,
    });
  } catch {
    await react(gh, payload.pull_request.number, 'confused');
  }
});

app.webhooks.on('issue_comment.created', async ({ octokit, payload }) => {
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const gh = { octokit, owner, repo };
  try {
    const config = await getconfig(gh);
    await handlecomment(gh, config, payload);
  } catch {
    await octokit.rest.reactions.createForIssueComment({
      owner,
      repo,
      comment_id: payload.comment.id,
      content: 'confused',
    });
  }
});

export const maxDuration = 300;

export async function POST(req: Request) {
  const body = await req.text();
  try {
    await app.webhooks.verifyAndReceive({
      id: req.headers.get('x-github-delivery') || '',
      name: req.headers.get('x-github-event') as never,
      payload: body,
      signature: req.headers.get('x-hub-signature-256') || '',
    });
  } catch {}
  return new Response('ok');
}
