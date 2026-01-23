import { generateText, Output } from 'ai'
import { z } from 'zod'
import * as gh from './github'

const classifyschema = z.object({
  labels: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  reasoning: z.string()
})

interface Config {
  token: string
  owner: string
  repo: string
}

interface Result {
  labels: string[]
  confidence: number
  reasoning: string
}

export async function triagepr(config: Config, number: number): Promise<Result> {
  await gh.react(config, number, 'eyes')

  const [pr, files, repolabels] = await Promise.all([
    gh.getpr(config, number),
    gh.getfiles(config, number),
    gh.fetchlabels(config)
  ])

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    output: Output.object({ schema: classifyschema }),
    system: buildprsystem(repolabels),
    prompt: buildprprompt(pr.title, pr.body, files)
  })

  const validlabels = output.labels.filter(l => repolabels.includes(l))

  if (output.confidence > 0.6 && validlabels.length > 0) {
    await gh.label(config, number, validlabels)
  }

  await gh.react(config, number, 'rocket')

  return { labels: validlabels, confidence: output.confidence, reasoning: output.reasoning }
}

export async function triageissue(config: Config, number: number): Promise<Result> {
  await gh.react(config, number, 'eyes')

  const [issue, repolabels] = await Promise.all([
    gh.getissue(config, number),
    gh.fetchlabels(config)
  ])

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    output: Output.object({ schema: classifyschema }),
    system: buildissuesystem(repolabels),
    prompt: buildissueprompt(issue.title, issue.body, issue.labels)
  })

  const validlabels = output.labels.filter(l => repolabels.includes(l))

  if (output.confidence > 0.6 && validlabels.length > 0) {
    await gh.label(config, number, validlabels)
  }

  await gh.react(config, number, 'rocket')

  return { labels: validlabels, confidence: output.confidence, reasoning: output.reasoning }
}

function buildprsystem(labels: string[]): string {
  return `You classify pull requests. Assign appropriate labels.

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
  return `You classify issues. Assign appropriate labels.

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
