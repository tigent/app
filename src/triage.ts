import { generateText, Output } from 'ai'
import { z } from 'zod'
import * as gh from './github'
import { notify } from './webhook'
import { verifytests } from './verify'
import type { PrVerdict, IssueVerdict } from './schema'

const classifyschema = z.object({
  labels: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  reasoning: z.string()
})

interface Config {
  github: {
    token: string
    owner: string
    repo: string
  }
  webhook?: {
    url: string
    secret?: string
  }
  testcmd?: string
}

export async function triagepr(config: Config, number: number): Promise<PrVerdict> {
  const github = config.github

  await gh.react(github, number, 'eyes')

  const [pr, diff, files, repolabels] = await Promise.all([
    gh.getpr(github, number),
    gh.getdiff(github, number),
    gh.getfiles(github, number),
    gh.fetchlabels(github)
  ])

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    output: Output.object({ schema: classifyschema }),
    system: buildprsystem(repolabels),
    prompt: buildprprompt(pr.title, pr.body, files)
  })

  const validlabels = output.labels.filter(l => repolabels.includes(l))

  if (output.confidence > 0.6 && validlabels.length > 0) {
    await gh.label(github, number, validlabels)
  }

  let tests = undefined
  if (config.testcmd && files.some(f => f.includes('.test.') || f.includes('.spec.'))) {
    tests = await verifytests({
      repo: `https://github.com/${github.owner}/${github.repo}`,
      pr: number,
      base: pr.base.ref,
      testcmd: config.testcmd
    })
  }

  const verdict: PrVerdict = {
    score: Math.round(output.confidence * 10),
    verdict: output.confidence > 0.8 ? 'priority' : output.confidence > 0.5 ? 'review' : 'skip',
    summary: output.reasoning,
    flags: [],
    tests
  }

  await gh.react(github, number, 'rocket')

  if (config.webhook) {
    await notify(config.webhook, {
      type: 'pull_request',
      number,
      url: pr.html_url,
      verdict
    })
  }

  return verdict
}

export async function triageissue(config: Config, number: number): Promise<IssueVerdict> {
  const github = config.github

  await gh.react(github, number, 'eyes')

  const [issue, repolabels] = await Promise.all([
    gh.getissue(github, number),
    gh.fetchlabels(github)
  ])

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    output: Output.object({ schema: classifyschema }),
    system: buildissuesystem(repolabels),
    prompt: buildissueprompt(issue.title, issue.body, issue.labels)
  })

  const validlabels = output.labels.filter(l => repolabels.includes(l))

  if (output.confidence > 0.6 && validlabels.length > 0) {
    await gh.label(github, number, validlabels)
  }

  const verdict: IssueVerdict = {
    urgency: output.confidence > 0.8 ? 'high' : output.confidence > 0.5 ? 'medium' : 'low',
    category: validlabels[0] || 'uncategorized',
    assignee: 'community',
    summary: output.reasoning
  }

  await gh.react(github, number, 'rocket')

  if (config.webhook) {
    await notify(config.webhook, {
      type: 'issue',
      number,
      url: issue.html_url,
      verdict
    })
  }

  return verdict
}

function buildprsystem(labels: string[]): string {
  return `You classify pull requests for a repository. Assign appropriate labels.

Available labels: ${labels.join(', ')}

Rules:
- If title includes "Version Packages" or starts with "Backport:", use "maintenance" only
- UI changes (Vue, Angular, React): ai/ui
- AI gateway changes: ai/gateway
- MCP changes: ai/mcp
- RSC changes: ai/rsc
- Telemetry changes: ai/telemetry
- Core SDK changes (text/image/audio generation): ai/core
- Provider-related: add ai/provider plus specific provider labels
- React Native/Expo: ai/ui and expo
- .github or build file updates only: maintenance
- New provider: ai/provider and provider/community
- Docs/examples only: documentation
- If files match providers/<name>, add ai/provider and provider/<name>
- Max 4 provider labels, otherwise use ai/core`
}

function buildprprompt(title: string, body: string, files: string[]): string {
  return `Title: ${title}

Body:
${body || 'No description'}

Changed files:
${files.join('\n')}`
}

function buildissuesystem(labels: string[]): string {
  return `You classify issues for a repository. Assign appropriate labels.

Available labels: ${labels.join(', ')}

Rules:
- UI issues (Vue, Angular, React, AI Elements): ai/ui
- AI gateway issues: ai/gateway
- MCP issues: ai/mcp
- RSC issues: ai/rsc
- Telemetry issues: ai/telemetry
- Core SDK issues (text/image/audio generation): ai/core
- Provider-related: add ai/provider plus specific provider labels
- Look for @ai-sdk/<provider> package mentions
- Community/third-party providers: provider/community
- OpenAI-compatible APIs: provider/openai-compatible not provider/openai
- provider/vercel only for v0 issues
- React Native/Expo: ai/ui and expo
- New provider requests: ai/provider and provider/community
- "Provider API update - <name>@version": ai/provider and provider/<name>`
}

function buildissueprompt(title: string, body: string, labels: { name: string }[]): string {
  return `Title: ${title}

Body:
${body || 'No description'}

Existing labels: ${labels.map(l => l.name).join(', ') || 'none'}`
}
