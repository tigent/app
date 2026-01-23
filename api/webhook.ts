import { Webhooks } from '@octokit/webhooks'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { SignJWT, importPKCS8 } from 'jose'

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET || ''
})

webhooks.on('issues.opened', async ({ payload }) => {
  const owner = payload.repository.owner.login
  const repo = payload.repository.name

  const token = await gettoken({
    appid: process.env.GITHUB_APP_ID!,
    privatekey: process.env.GITHUB_APP_PRIVATE_KEY!,
    owner,
    repo
  })

  await triageissue({ token, owner, repo }, payload.issue.number)
})

webhooks.on('pull_request.opened', async ({ payload }) => {
  const owner = payload.repository.owner.login
  const repo = payload.repository.name

  const token = await gettoken({
    appid: process.env.GITHUB_APP_ID!,
    privatekey: process.env.GITHUB_APP_PRIVATE_KEY!,
    owner,
    repo
  })

  await triagepr({ token, owner, repo }, payload.pull_request.number)
})

export async function POST(req: Request) {
  const body = await req.text()

  await webhooks.verifyAndReceive({
    id: req.headers.get('x-github-delivery') || '',
    name: req.headers.get('x-github-event') as any,
    payload: body,
    signature: req.headers.get('x-hub-signature-256') || ''
  })

  return new Response('ok')
}

interface Config {
  token: string
  owner: string
  repo: string
}

interface AppConfig {
  appid: string
  privatekey: string
  installationid?: string
  owner?: string
  repo?: string
}

const classifyschema = z.object({
  labels: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  reasoning: z.string()
})

async function gettoken(config: AppConfig): Promise<string> {
  const jwt = await createjwt(config.appid, config.privatekey)

  let installationid = config.installationid
  if (!installationid && config.owner && config.repo) {
    installationid = await getinstallationid(jwt, config.owner, config.repo)
  }

  if (!installationid) {
    throw new Error('need installationid or owner/repo')
  }

  const response = await fetch(
    `https://api.github.com/app/installations/${installationid}/access_tokens`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${jwt}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`failed to get token: ${response.status}`)
  }

  const data = await response.json() as { token: string }
  return data.token
}

async function getinstallationid(jwt: string, owner: string, repo: string): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/installation`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${jwt}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`failed to get installation: ${response.status}`)
  }

  const data = await response.json() as { id: number }
  return String(data.id)
}

async function createjwt(appid: string, privatekey: string): Promise<string> {
  const normalized = privatekey.replace(/\\n/g, '\n')
  const pkcs8 = convertpkcs1topkcs8(normalized)
  const key = await importPKCS8(pkcs8, 'RS256')

  const now = Math.floor(Date.now() / 1000)

  return await new SignJWT({})
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt(now - 60)
    .setExpirationTime(now + 600)
    .setIssuer(appid)
    .sign(key)
}

function convertpkcs1topkcs8(pem: string): string {
  if (pem.includes('BEGIN PRIVATE KEY')) {
    return pem
  }

  const lines = pem.split('\n')
  const b64 = lines.filter(l => !l.includes('-----')).join('')
  const der = Uint8Array.from(atob(b64), c => c.charCodeAt(0))

  const pkcs8header = new Uint8Array([
    0x30, 0x82, 0x00, 0x00,
    0x02, 0x01, 0x00,
    0x30, 0x0d,
    0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01,
    0x05, 0x00,
    0x04, 0x82, 0x00, 0x00
  ])

  const keylen = der.length
  const totallen = pkcs8header.length + keylen

  pkcs8header[2] = ((totallen - 4) >> 8) & 0xff
  pkcs8header[3] = (totallen - 4) & 0xff
  pkcs8header[pkcs8header.length - 2] = (keylen >> 8) & 0xff
  pkcs8header[pkcs8header.length - 1] = keylen & 0xff

  const pkcs8 = new Uint8Array(totallen)
  pkcs8.set(pkcs8header)
  pkcs8.set(der, pkcs8header.length)

  const b64out = btoa(String.fromCharCode(...pkcs8))
  const formatted = b64out.match(/.{1,64}/g)?.join('\n') || b64out

  return `-----BEGIN PRIVATE KEY-----\n${formatted}\n-----END PRIVATE KEY-----`
}

async function triagepr(config: Config, number: number) {
  await react(config, number, 'eyes')

  const [pr, files, repolabels] = await Promise.all([
    getpr(config, number),
    getfiles(config, number),
    fetchlabels(config)
  ])

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    output: Output.object({ schema: classifyschema }),
    system: buildprsystem(repolabels),
    prompt: buildprprompt(pr.title, pr.body, files)
  })

  const validlabels = output.labels.filter(l => repolabels.includes(l))

  if (output.confidence > 0.6 && validlabels.length > 0) {
    await label(config, number, validlabels)
  }
}

async function triageissue(config: Config, number: number) {
  await react(config, number, 'eyes')

  const [issue, repolabels] = await Promise.all([
    getissue(config, number),
    fetchlabels(config)
  ])

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    output: Output.object({ schema: classifyschema }),
    system: buildissuesystem(repolabels),
    prompt: buildissueprompt(issue.title, issue.body, issue.labels)
  })

  const validlabels = output.labels.filter(l => repolabels.includes(l))

  if (output.confidence > 0.6 && validlabels.length > 0) {
    await label(config, number, validlabels)
  }
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

type Reaction = '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes'

async function react(config: Config, issue: number, content: Reaction) {
  await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues/${issue}/reactions`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ content })
    }
  )
}

async function label(config: Config, issue: number, labels: string[]) {
  await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues/${issue}/labels`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ labels })
    }
  )
}

async function fetchlabels(config: Config): Promise<string[]> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/labels`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  const data = await response.json() as { name: string }[]
  return data.map(l => l.name)
}

interface PullRequest {
  title: string
  body: string
}

async function getpr(config: Config, number: number): Promise<PullRequest> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/pulls/${number}`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  return response.json() as Promise<PullRequest>
}

interface Issue {
  title: string
  body: string
  labels: { name: string }[]
}

async function getissue(config: Config, number: number): Promise<Issue> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues/${number}`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  return response.json() as Promise<Issue>
}

async function getfiles(config: Config, number: number): Promise<string[]> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/pulls/${number}/files`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  const data = await response.json() as { filename: string }[]
  return data.map(f => f.filename)
}
