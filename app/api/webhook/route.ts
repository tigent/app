import { App } from 'octokit'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { parse } from 'yaml'
import type { Octokit } from 'octokit'

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET! }
})

app.webhooks.on('issues.opened', async ({ octokit, payload }) => {
  const owner = payload.repository.owner.login
  const repo = payload.repository.name
  const ghconfig = { octokit, owner, repo }
  const config = await getconfig(ghconfig)
  await synclabels(ghconfig, config)
  await triageissue(ghconfig, config, payload.issue.number)
})

app.webhooks.on('pull_request.opened', async ({ octokit, payload }) => {
  const owner = payload.repository.owner.login
  const repo = payload.repository.name
  const ghconfig = { octokit, owner, repo }
  const config = await getconfig(ghconfig)
  await synclabels(ghconfig, config)
  await triagepr(ghconfig, config, payload.pull_request.number)
})

app.webhooks.on('issue_comment.created', async ({ octokit, payload }) => {
  if (payload.issue.pull_request) return

  const owner = payload.repository.owner.login
  const repo = payload.repository.name
  const ghconfig = { octokit, owner, repo }
  const config = await getconfig(ghconfig)

  if (!config.sentiment.enabled) return
  if (!config.sentiment.triggers.comments) return

  await synclabels(ghconfig, config)

  const issuedata = await getissue(ghconfig, payload.issue.number)
  const issue = {
    ...issuedata,
    number: payload.issue.number,
    created_at: payload.issue.created_at
  }

  await handlesentiment(ghconfig, config, issue, payload.comment.body)

  if (config.sentiment.noreply.mode === 'reactive' || config.sentiment.noreply.mode === 'both') {
    if (payload.comment.user?.login === payload.issue.user?.login) {
      await checknoreply(ghconfig, config, issue)
    }
  }
})

export async function POST(req: Request) {
  const body = await req.text()

  await app.webhooks.verifyAndReceive({
    id: req.headers.get('x-github-delivery') || '',
    name: req.headers.get('x-github-event') as any,
    payload: body,
    signature: req.headers.get('x-hub-signature-256') || ''
  })

  return new Response('ok')
}

interface GhConfig {
  octokit: Octokit
  owner: string
  repo: string
}

interface TriageConfig {
  confidence: number
  model: string
  theme: string
  themes: Record<string, Record<string, string>>
  labels: Record<string, string>
  rules: { match: string; add: string[] }[]
  reactions: { start?: string; complete?: string }
  ignore: { users: string[]; labels: string[] }
  duplicates: {
    enabled: boolean
    threshold: number
    label?: string
    comment: boolean
    close: boolean
  }
  autorespond: {
    enabled: boolean
    label: string
    context: string
    requirements: Record<string, string[]>
    message: string
  }
  stale: {
    enabled: boolean
    days: number
    close: number
    exempt: { labels: string[]; assignees: boolean }
    label: string
    message: string
    closemessage: string
  }
  sentiment: {
    enabled: boolean
    detect: { negative: boolean; frustrated: boolean; confused: boolean }
    triggers: { issues: boolean; comments: boolean }
    noreply: { enabled: boolean; hours: number; mode: 'workflow' | 'reactive' | 'both' }
    labels: { negative?: string; frustrated?: string; confused?: string; noreply?: string }
    actions: {
      webhook?: { url: string; events: string[] }
      mention?: { enabled: boolean; users: string[] | 'auto'; message: string; events: string[] }
      comment?: { enabled: boolean; negative?: string; frustrated?: string; confused?: string; noreply?: string }
    }
    threshold: number
    exempt: { labels: string[]; users: string[] }
  }
}

const defaultconfig: TriageConfig = {
  confidence: 0.6,
  model: 'anthropic/claude-sonnet-4.5',
  theme: 'mono',
  themes: {
    mono: {
      critical: '000000',
      high: '1a1a1a',
      medium: '4a4a4a',
      low: '8a8a8a',
      muted: 'c0c0c0',
      light: 'e5e5e5'
    },
    colorful: {
      critical: 'd73a4a',
      high: 'd93f0b',
      medium: 'fbca04',
      low: '0e8a16',
      muted: '0052cc',
      light: '5319e7'
    },
    pastel: {
      critical: 'ffb3b3',
      high: 'ffd9b3',
      medium: 'fff2b3',
      low: 'b3ffb3',
      muted: 'b3d9ff',
      light: 'd9b3ff'
    }
  },
  labels: {},
  rules: [],
  reactions: { start: 'eyes' },
  ignore: { users: [], labels: [] },
  duplicates: {
    enabled: false,
    threshold: 0.8,
    comment: true,
    close: false
  },
  autorespond: {
    enabled: false,
    label: 'needs-info',
    context: '',
    requirements: {
      default: ['clear description']
    },
    message: 'thanks for opening this issue! we need a bit more info to help you.'
  },
  stale: {
    enabled: false,
    days: 60,
    close: 7,
    exempt: { labels: [], assignees: false },
    label: 'stale',
    message: 'this issue has been inactive for {days} days and will be closed in {close} days if there is no further activity.',
    closemessage: 'this issue has been closed due to inactivity.'
  },
  sentiment: {
    enabled: false,
    detect: { negative: true, frustrated: true, confused: true },
    triggers: { issues: true, comments: true },
    noreply: { enabled: true, hours: 48, mode: 'both' },
    labels: { negative: 'needs-attention', frustrated: 'needs-support', confused: 'needs-help', noreply: 'awaiting-response' },
    actions: {},
    threshold: 0.7,
    exempt: { labels: [], users: [] }
  }
}

async function getconfig(config: GhConfig): Promise<TriageConfig> {
  try {
    const { data } = await config.octokit.rest.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: '.github/tigent.yml',
      mediaType: { format: 'raw' }
    })

    const yaml = data as unknown as string
    const parsed = parse(yaml) as Partial<TriageConfig>

    return {
      ...defaultconfig,
      ...parsed,
      themes: { ...defaultconfig.themes, ...parsed.themes },
      reactions: { ...defaultconfig.reactions, ...parsed.reactions },
      ignore: {
        users: parsed.ignore?.users || [],
        labels: parsed.ignore?.labels || []
      },
      duplicates: {
        enabled: parsed.duplicates?.enabled ?? false,
        threshold: parsed.duplicates?.threshold ?? 0.8,
        label: parsed.duplicates?.label,
        comment: parsed.duplicates?.comment ?? true,
        close: parsed.duplicates?.close ?? false
      },
      autorespond: {
        enabled: parsed.autorespond?.enabled ?? false,
        label: parsed.autorespond?.label ?? 'needs-info',
        context: parsed.autorespond?.context ?? '',
        requirements: parsed.autorespond?.requirements ?? { default: ['clear description'] },
        message: parsed.autorespond?.message ?? defaultconfig.autorespond.message
      },
      stale: {
        enabled: parsed.stale?.enabled ?? false,
        days: parsed.stale?.days ?? 60,
        close: parsed.stale?.close ?? 7,
        exempt: {
          labels: parsed.stale?.exempt?.labels || [],
          assignees: parsed.stale?.exempt?.assignees ?? false
        },
        label: parsed.stale?.label ?? 'stale',
        message: parsed.stale?.message ?? defaultconfig.stale.message,
        closemessage: parsed.stale?.closemessage ?? defaultconfig.stale.closemessage
      },
      sentiment: {
        enabled: parsed.sentiment?.enabled ?? false,
        detect: {
          negative: parsed.sentiment?.detect?.negative ?? true,
          frustrated: parsed.sentiment?.detect?.frustrated ?? true,
          confused: parsed.sentiment?.detect?.confused ?? true
        },
        triggers: {
          issues: parsed.sentiment?.triggers?.issues ?? true,
          comments: parsed.sentiment?.triggers?.comments ?? true
        },
        noreply: {
          enabled: parsed.sentiment?.noreply?.enabled ?? true,
          hours: parsed.sentiment?.noreply?.hours ?? 48,
          mode: parsed.sentiment?.noreply?.mode ?? 'both'
        },
        labels: {
          negative: 'negative' in (parsed.sentiment?.labels || {}) ? parsed.sentiment?.labels?.negative : 'needs-attention',
          frustrated: 'frustrated' in (parsed.sentiment?.labels || {}) ? parsed.sentiment?.labels?.frustrated : 'needs-support',
          confused: 'confused' in (parsed.sentiment?.labels || {}) ? parsed.sentiment?.labels?.confused : 'needs-help',
          noreply: 'noreply' in (parsed.sentiment?.labels || {}) ? parsed.sentiment?.labels?.noreply : 'awaiting-response'
        },
        actions: {
          webhook: parsed.sentiment?.actions?.webhook,
          mention: parsed.sentiment?.actions?.mention,
          comment: parsed.sentiment?.actions?.comment
        },
        threshold: parsed.sentiment?.threshold ?? 0.7,
        exempt: {
          labels: parsed.sentiment?.exempt?.labels || [],
          users: parsed.sentiment?.exempt?.users || []
        }
      }
    }
  } catch {
    return defaultconfig
  }
}

async function synclabels(ghconfig: GhConfig, config: TriageConfig) {
  const existing = await fetchlabels(ghconfig)
  const theme = config.themes[config.theme] || config.themes.mono || {}

  for (const [name, colorkey] of Object.entries(config.labels)) {
    if (existing.includes(name)) continue
    const color = theme[colorkey] || colorkey
    await createlabel(ghconfig, name, color)
  }

  if (config.autorespond.enabled && !existing.includes(config.autorespond.label)) {
    await createlabel(ghconfig, config.autorespond.label, theme.muted || 'c0c0c0')
  }

  if (config.stale.enabled && !existing.includes(config.stale.label)) {
    await createlabel(ghconfig, config.stale.label, theme.muted || 'c0c0c0')
  }

  if (config.sentiment.enabled) {
    const sentimentlabels = Object.values(config.sentiment.labels).filter(Boolean) as string[]
    for (const name of sentimentlabels) {
      if (!existing.includes(name)) {
        await createlabel(ghconfig, name, theme.medium || '4a4a4a')
      }
    }
  }
}

async function createlabel(config: GhConfig, name: string, color: string) {
  try {
    await config.octokit.rest.issues.createLabel({
      owner: config.owner,
      repo: config.repo,
      name,
      color
    })
  } catch {}
}

const classifyschema = z.object({
  labels: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  reasoning: z.string()
})

const duplicateschema = z.object({
  isduplicate: z.boolean(),
  confidence: z.number().min(0).max(1),
  duplicateof: z.number().nullable(),
  reasoning: z.string()
})

const completenessschema = z.object({
  complete: z.boolean(),
  issuetype: z.enum(['bug', 'feature', 'question', 'other']),
  missing: z.array(z.string()),
  response: z.string(),
  confidence: z.number().min(0).max(1)
})

const sentimentschema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'negative', 'frustrated', 'confused']),
  confidence: z.number().min(0).max(1),
  indicators: z.array(z.string()),
  reasoning: z.string()
})

async function triagepr(ghconfig: GhConfig, config: TriageConfig, number: number) {
  if (config.reactions.start) {
    await react(ghconfig, number, config.reactions.start as any)
  }

  const [pr, files, repolabels] = await Promise.all([
    getpr(ghconfig, number),
    getfiles(ghconfig, number),
    fetchlabels(ghconfig)
  ])

  const rulelabels = applyrules(config.rules, pr.title, pr.body || '')

  const { output } = await generateText({
    model: config.model,
    output: Output.object({ schema: classifyschema }),
    system: buildprsystem(repolabels, config.rules),
    prompt: buildprprompt(pr.title, pr.body, files)
  })

  const ailabels = output.labels.filter(l => repolabels.includes(l))
  const alllabels = [...new Set([...rulelabels, ...ailabels])]
  const validlabels = alllabels.filter(l => repolabels.includes(l))

  if (output.confidence > config.confidence && validlabels.length > 0) {
    await label(ghconfig, number, validlabels)
  }
}

async function triageissue(ghconfig: GhConfig, config: TriageConfig, number: number) {
  if (config.reactions.start) {
    await react(ghconfig, number, config.reactions.start as any)
  }

  const [issue, repolabels] = await Promise.all([
    getissue(ghconfig, number),
    fetchlabels(ghconfig)
  ])

  if (config.ignore.users.includes(issue.user?.login || '')) return
  if (issue.labels.some(l => config.ignore.labels.includes(l.name))) return

  if (config.duplicates.enabled) {
    const duplicate = await checkduplicates(ghconfig, config, issue, number)
    if (duplicate) return
  }

  if (config.autorespond.enabled) {
    const incomplete = await checkcompleteness(ghconfig, config, issue, number)
    if (incomplete) return
  }

  if (config.sentiment.enabled && config.sentiment.triggers.issues) {
    await handlesentiment(ghconfig, config, { ...issue, number })
  }

  const rulelabels = applyrules(config.rules, issue.title, issue.body || '')

  const { output } = await generateText({
    model: config.model,
    output: Output.object({ schema: classifyschema }),
    system: buildissuesystem(repolabels, config.rules),
    prompt: buildissueprompt(issue.title, issue.body, issue.labels)
  })

  const ailabels = output.labels.filter(l => repolabels.includes(l))
  const alllabels = [...new Set([...rulelabels, ...ailabels])]
  const validlabels = alllabels.filter(l => repolabels.includes(l))

  if (output.confidence > config.confidence && validlabels.length > 0) {
    await label(ghconfig, number, validlabels)
  }
}

function applyrules(rules: { match: string; add: string[] }[], title: string, body: string): string[] {
  const text = `${title} ${body}`.toLowerCase()
  const labels: string[] = []

  for (const rule of rules) {
    const regex = new RegExp(rule.match, 'i')
    if (regex.test(text)) {
      labels.push(...rule.add)
    }
  }

  return labels
}

async function checkduplicates(
  ghconfig: GhConfig,
  config: TriageConfig,
  issue: Issue,
  number: number
): Promise<boolean> {
  const openissues = await searchissues(ghconfig, number)
  if (openissues.length === 0) return false

  const issuelist = openissues
    .map(i => `#${i.number}: ${i.title}`)
    .join('\n')

  const { output } = await generateText({
    model: config.model,
    output: Output.object({ schema: duplicateschema }),
    system: `you detect duplicate issues. compare the new issue against existing open issues.
if the new issue is asking about the same problem or feature as an existing issue, mark it as duplicate.
be strict - only mark as duplicate if they are clearly about the same thing.`,
    prompt: `new issue:
title: ${issue.title}
body: ${issue.body || 'no description'}

existing open issues:
${issuelist}`
  })

  if (output.isduplicate && output.confidence >= config.duplicates.threshold && output.duplicateof) {
    if (config.duplicates.comment) {
      await comment(
        ghconfig,
        number,
        `this issue may be a duplicate of #${output.duplicateof}\n\n${output.reasoning}`
      )
    }

    if (config.duplicates.label) {
      await label(ghconfig, number, [config.duplicates.label])
    }

    if (config.duplicates.close) {
      await closeissue(ghconfig, number)
    }

    return true
  }

  return false
}

async function checkcompleteness(
  ghconfig: GhConfig,
  config: TriageConfig,
  issue: Issue,
  number: number
): Promise<boolean> {
  const { output } = await generateText({
    model: config.model,
    output: Output.object({ schema: completenessschema }),
    system: buildcompletenessprompt(config),
    prompt: buildcompletenessissue(issue)
  })

  if (!output.complete && output.confidence >= config.confidence) {
    await comment(ghconfig, number, output.response || config.autorespond.message)
    await label(ghconfig, number, [config.autorespond.label])
    return true
  }

  return false
}

function buildcompletenessprompt(config: TriageConfig): string {
  const reqs = Object.entries(config.autorespond.requirements)
    .map(([type, items]) => `${type}: ${items.join(', ')}`)
    .join('\n')

  return `you analyze issues for completeness. determine if the issue has enough info.

${config.autorespond.context ? `context: ${config.autorespond.context}\n` : ''}
requirements by issue type:
${reqs}

if the issue is missing required info, set complete to false and list what's missing.
write a helpful response asking for the missing info. be friendly and specific.
use the message template as a starting point: ${config.autorespond.message}`
}

function buildcompletenessissue(issue: Issue): string {
  return `title: ${issue.title}

body:
${issue.body || 'no description'}`
}

async function searchissues(config: GhConfig, excludenumber: number): Promise<{ number: number; title: string }[]> {
  const { data } = await config.octokit.rest.issues.listForRepo({
    owner: config.owner,
    repo: config.repo,
    state: 'open',
    per_page: 50
  })
  return data
    .filter(i => i.number !== excludenumber && !i.pull_request)
    .slice(0, 20)
    .map(i => ({ number: i.number, title: i.title }))
}

async function comment(config: GhConfig, issue: number, body: string) {
  await config.octokit.rest.issues.createComment({
    owner: config.owner,
    repo: config.repo,
    issue_number: issue,
    body
  })
}

async function closeissue(config: GhConfig, issue: number) {
  await config.octokit.rest.issues.update({
    owner: config.owner,
    repo: config.repo,
    issue_number: issue,
    state: 'closed',
    state_reason: 'not_planned'
  })
}

function buildprsystem(labels: string[], rules: { match: string; add: string[] }[]): string {
  let system = `you classify pull requests. assign appropriate labels.

available labels: ${labels.join(', ')}

rules:
- if title includes "version packages" or starts with "backport:", use "maintenance" only
- ui changes (vue, angular, react): ai/ui
- ai gateway changes: ai/gateway
- mcp changes: ai/mcp
- rsc changes: ai/rsc
- telemetry changes: ai/telemetry
- core sdk changes (text/image/audio generation): ai/core
- provider-related: add ai/provider plus specific provider labels
- react native/expo: ai/ui and expo
- .github or build file updates only: maintenance
- new provider: ai/provider and provider/community
- docs/examples only: documentation
- if files match providers/<name>, add ai/provider and provider/<name>
- max 4 provider labels, otherwise use ai/core`

  if (rules.length > 0) {
    system += '\n\ncustom rules:'
    for (const rule of rules) {
      system += `\n- if matches "${rule.match}": add ${rule.add.join(', ')}`
    }
  }

  return system
}

function buildprprompt(title: string, body: string | null, files: string[]): string {
  return `title: ${title}

body:
${body || 'no description'}

changed files:
${files.join('\n')}`
}

function buildissuesystem(labels: string[], rules: { match: string; add: string[] }[]): string {
  let system = `you classify issues. assign appropriate labels.

available labels: ${labels.join(', ')}

rules:
- ui issues (vue, angular, react, ai elements): ai/ui
- ai gateway issues: ai/gateway
- mcp issues: ai/mcp
- rsc issues: ai/rsc
- telemetry issues: ai/telemetry
- core sdk issues (text/image/audio generation): ai/core
- provider-related: add ai/provider plus specific provider labels
- look for @ai-sdk/<provider> package mentions
- community/third-party providers: provider/community
- openai-compatible apis: provider/openai-compatible not provider/openai
- provider/vercel only for v0 issues
- react native/expo: ai/ui and expo
- new provider requests: ai/provider and provider/community
- "provider api update - <name>@version": ai/provider and provider/<name>`

  if (rules.length > 0) {
    system += '\n\ncustom rules:'
    for (const rule of rules) {
      system += `\n- if matches "${rule.match}": add ${rule.add.join(', ')}`
    }
  }

  return system
}

function buildissueprompt(title: string, body: string | null, labels: { name: string }[]): string {
  return `title: ${title}

body:
${body || 'no description'}

existing labels: ${labels.map(l => l.name).join(', ') || 'none'}`
}

type Reaction = '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes'

async function react(config: GhConfig, issue: number, content: Reaction) {
  await config.octokit.rest.reactions.createForIssue({
    owner: config.owner,
    repo: config.repo,
    issue_number: issue,
    content
  })
}

async function label(config: GhConfig, issue: number, labels: string[]) {
  await config.octokit.rest.issues.addLabels({
    owner: config.owner,
    repo: config.repo,
    issue_number: issue,
    labels
  })
}

async function fetchlabels(config: GhConfig): Promise<string[]> {
  const { data } = await config.octokit.rest.issues.listLabelsForRepo({
    owner: config.owner,
    repo: config.repo,
    per_page: 100
  })
  return data.map(l => l.name)
}

interface PullRequest {
  title: string
  body: string | null
}

async function getpr(config: GhConfig, number: number): Promise<PullRequest> {
  const { data } = await config.octokit.rest.pulls.get({
    owner: config.owner,
    repo: config.repo,
    pull_number: number
  })
  return { title: data.title, body: data.body }
}

interface Issue {
  title: string
  body: string | null
  labels: { name: string }[]
  user?: { login: string }
}

async function getissue(config: GhConfig, number: number): Promise<Issue> {
  const { data } = await config.octokit.rest.issues.get({
    owner: config.owner,
    repo: config.repo,
    issue_number: number
  })
  return {
    title: data.title,
    body: data.body ?? null,
    labels: data.labels.map(l => typeof l === 'string' ? { name: l } : { name: l.name || '' }),
    user: data.user ? { login: data.user.login } : undefined
  }
}

async function getfiles(config: GhConfig, number: number): Promise<string[]> {
  const { data } = await config.octokit.rest.pulls.listFiles({
    owner: config.owner,
    repo: config.repo,
    pull_number: number,
    per_page: 100
  })
  return data.map(f => f.filename)
}

const teammemberscache = new Map<string, { members: string[]; expires: number }>()

async function getteammembers(config: GhConfig): Promise<string[]> {
  const key = `${config.owner}/${config.repo}`
  const cached = teammemberscache.get(key)
  if (cached && cached.expires > Date.now()) return cached.members

  const { data } = await config.octokit.rest.repos.listCollaborators({
    owner: config.owner,
    repo: config.repo,
    per_page: 100
  })
  const members = data
    .filter(c => ['admin', 'maintain', 'push'].includes(c.role_name || ''))
    .map(c => c.login)
  teammemberscache.set(key, { members, expires: Date.now() + 60 * 60 * 1000 })
  return members
}

interface Comment {
  id: number
  body: string
  created_at: string
  user: { login: string }
}

async function getcomments(config: GhConfig, issue: number): Promise<Comment[]> {
  const { data } = await config.octokit.rest.issues.listComments({
    owner: config.owner,
    repo: config.repo,
    issue_number: issue,
    per_page: 100
  })
  return data.map(c => ({
    id: c.id,
    body: c.body || '',
    created_at: c.created_at,
    user: { login: c.user?.login || '' }
  }))
}

interface SentimentResult {
  type: 'negative' | 'frustrated' | 'confused'
  confidence: number
  indicators: string[]
}

async function checksentiment(
  ghconfig: GhConfig,
  config: TriageConfig,
  issue: Issue & { number: number },
  latestcomment?: string
): Promise<SentimentResult | null> {
  if (!config.sentiment.enabled) return null
  if (config.sentiment.exempt.labels.some(l => issue.labels.map(x => x.name).includes(l))) return null
  if (config.sentiment.exempt.users.includes(issue.user?.login || '')) return null

  const rawcontent = latestcomment || `${issue.title}\n\n${issue.body || ''}`
  const content = rawcontent.slice(0, 4000)
  const detections = Object.entries(config.sentiment.detect)
    .filter(([, v]) => v)
    .map(([k]) => k)

  const { output } = await generateText({
    model: config.model,
    output: Output.object({ schema: sentimentschema }),
    system: `you analyze the emotional tone of github issues and comments.
detect if the user is ${detections.join(', ')}.
be conservative - only flag genuinely problematic sentiment, not minor frustration.
negative = angry, hostile, aggressive tone
frustrated = exasperated, repeated issues, giving up
confused = unclear, lost, asking for help`,
    prompt: content
  })

  if (output.confidence < config.sentiment.threshold) return null
  if (output.sentiment === 'positive' || output.sentiment === 'neutral') return null
  if (!detections.includes(output.sentiment)) return null

  return {
    type: output.sentiment as 'negative' | 'frustrated' | 'confused',
    confidence: output.confidence,
    indicators: output.indicators
  }
}

interface WebhookPayload {
  event: 'sentiment' | 'noreply'
  repository: { owner: string; repo: string }
  issue: { number: number; title: string; url: string }
  sentiment?: { type: string; confidence: number; indicators: string[] }
  noreply?: { hours: number; lastcomment: string }
}

async function sendwebhook(url: string, payload: WebhookPayload): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok && response.status === 429) {
    const retryafter = response.headers.get('retry-after')
    if (retryafter) {
      await new Promise(r => setTimeout(r, parseInt(retryafter) * 1000))
      await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }
  }
}

async function mentionteam(
  ghconfig: GhConfig,
  config: TriageConfig,
  issue: number,
  eventtype: string
): Promise<boolean> {
  const mention = config.sentiment.actions.mention
  if (!mention?.enabled) return false
  if (!mention.events.includes(eventtype)) return false

  let users: string[]
  if (mention.users === 'auto') {
    users = await getteammembers(ghconfig)
  } else {
    users = mention.users
  }

  if (users.length === 0) return false

  const mentions = users.map(u => `@${u}`).join(' ')
  const body = `${mentions}\n\n${mention.message}`
  await comment(ghconfig, issue, body)
  return true
}

async function handlesentiment(
  ghconfig: GhConfig,
  config: TriageConfig,
  issue: Issue & { number: number },
  latestcomment?: string
): Promise<void> {
  const result = await checksentiment(ghconfig, config, issue, latestcomment)
  if (!result) return

  const labelname = config.sentiment.labels[result.type]
  const existinglabels = issue.labels.map(l => l.name)

  if (labelname && existinglabels.includes(labelname)) return

  if (labelname) {
    await label(ghconfig, issue.number, [labelname])
  }

  if (config.sentiment.actions.webhook?.events.includes(result.type)) {
    await sendwebhook(config.sentiment.actions.webhook.url, {
      event: 'sentiment',
      repository: { owner: ghconfig.owner, repo: ghconfig.repo },
      issue: {
        number: issue.number,
        title: issue.title,
        url: `https://github.com/${ghconfig.owner}/${ghconfig.repo}/issues/${issue.number}`
      },
      sentiment: { type: result.type, confidence: result.confidence, indicators: result.indicators }
    })
  }

  const mentionposted = await mentionteam(ghconfig, config, issue.number, result.type)

  if (!mentionposted) {
    const autocomment = config.sentiment.actions.comment
    if (autocomment?.enabled) {
      const commentmessage = autocomment[result.type]
      if (commentmessage) {
        await comment(ghconfig, issue.number, commentmessage)
      }
    }
  }
}

async function checknoreply(
  ghconfig: GhConfig,
  config: TriageConfig,
  issue: Issue & { number: number; created_at: string }
): Promise<void> {
  if (!config.sentiment.enabled) return
  if (!config.sentiment.noreply.enabled) return

  const comments = await getcomments(ghconfig, issue.number)
  const teammembers = await getteammembers(ghconfig)
  const author = issue.user?.login

  let lastauthorcomment: Comment | undefined
  for (const c of comments.slice().reverse()) {
    if (c.user.login === author) {
      lastauthorcomment = c
      break
    }
  }

  const checktime = lastauthorcomment?.created_at || issue.created_at
  const hours = (Date.now() - new Date(checktime).getTime()) / (1000 * 60 * 60)

  if (hours < config.sentiment.noreply.hours) return

  const hasreply = comments.some(c =>
    teammembers.includes(c.user.login) &&
    new Date(c.created_at) > new Date(checktime)
  )

  if (hasreply) return

  const labelname = config.sentiment.labels.noreply
  const existinglabels = issue.labels.map(l => l.name)

  if (labelname && existinglabels.includes(labelname)) return

  if (labelname) {
    await label(ghconfig, issue.number, [labelname])
  }

  if (config.sentiment.actions.webhook?.events.includes('noreply')) {
    await sendwebhook(config.sentiment.actions.webhook.url, {
      event: 'noreply',
      repository: { owner: ghconfig.owner, repo: ghconfig.repo },
      issue: {
        number: issue.number,
        title: issue.title,
        url: `https://github.com/${ghconfig.owner}/${ghconfig.repo}/issues/${issue.number}`
      },
      noreply: { hours: Math.floor(hours), lastcomment: lastauthorcomment?.body || issue.body || '' }
    })
  }

  const mentionposted = await mentionteam(ghconfig, config, issue.number, 'noreply')

  if (!mentionposted) {
    const autocomment = config.sentiment.actions.comment
    if (autocomment?.enabled && autocomment.noreply) {
      await comment(ghconfig, issue.number, autocomment.noreply)
    }
  }
}
