import { SignJWT, importPKCS8 } from 'jose'
import { parse } from 'yaml'

export async function GET(req: Request) {
  const authheader = req.headers.get('authorization')
  if (authheader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('unauthorized', { status: 401 })
  }

  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO

  if (!owner || !repo) {
    return new Response('missing GITHUB_OWNER or GITHUB_REPO env', { status: 500 })
  }

  const token = await gettoken({
    appid: process.env.GITHUB_APP_ID!,
    privatekey: process.env.GITHUB_APP_PRIVATE_KEY!,
    owner,
    repo
  })

  const ghconfig = { token, owner, repo }
  const config = await getconfig(ghconfig)

  if (!config.stale.enabled) {
    return new Response('stale check disabled')
  }

  const issues = await getopenissues(ghconfig)
  const now = Date.now()
  const warnms = parseduration(config.stale.warn)
  const closems = parseduration(config.stale.close)

  let warned = 0
  let closed = 0

  for (const issue of issues) {
    if (issue.pull_request) continue
    if (config.stale.exempt.some(l => issue.labels.some((il: any) => il.name === l))) continue

    const updated = new Date(issue.updated_at).getTime()
    const age = now - updated
    const haslabel = issue.labels.some((l: any) => l.name === config.stale.label)

    if (haslabel && age > closems) {
      await closeissue(ghconfig, issue.number)
      closed++
    } else if (!haslabel && age > warnms) {
      await addlabel(ghconfig, issue.number, config.stale.label)
      await comment(ghconfig, issue.number, config.stale.message)
      warned++
    }
  }

  return new Response(`stale check complete: warned ${warned}, closed ${closed}`)
}

function parseduration(str: string): number {
  const match = str.match(/^(\d+)(d|w|m|y)$/)
  if (!match) return 30 * 24 * 60 * 60 * 1000

  const num = parseInt(match[1])
  const unit = match[2]

  switch (unit) {
    case 'd': return num * 24 * 60 * 60 * 1000
    case 'w': return num * 7 * 24 * 60 * 60 * 1000
    case 'm': return num * 30 * 24 * 60 * 60 * 1000
    case 'y': return num * 365 * 24 * 60 * 60 * 1000
    default: return 30 * 24 * 60 * 60 * 1000
  }
}

interface GhConfig {
  token: string
  owner: string
  repo: string
}

interface StaleConfig {
  enabled: boolean
  warn: string
  close: string
  label: string
  message: string
  exempt: string[]
}

interface TriageConfig {
  stale: StaleConfig
}

async function getconfig(config: GhConfig): Promise<TriageConfig> {
  const defaultstale: StaleConfig = {
    enabled: false,
    warn: '30d',
    close: '7d',
    label: 'stale',
    message: 'this issue has been automatically marked as stale due to inactivity.',
    exempt: ['p0', 'p1', 'security']
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/.github/agent-triage.yml`,
      {
        headers: {
          'accept': 'application/vnd.github.raw+json',
          'authorization': `Bearer ${config.token}`,
          'x-github-api-version': '2022-11-28'
        }
      }
    )

    if (!response.ok) {
      return { stale: defaultstale }
    }

    const yaml = await response.text()
    const parsed = parse(yaml) as any

    return {
      stale: {
        enabled: parsed.stale?.enabled ?? false,
        warn: parsed.stale?.warn ?? '30d',
        close: parsed.stale?.close ?? '7d',
        label: parsed.stale?.label ?? 'stale',
        message: parsed.stale?.message ?? defaultstale.message,
        exempt: parsed.stale?.exempt ?? defaultstale.exempt
      }
    }
  } catch {
    return { stale: defaultstale }
  }
}

async function getopenissues(config: GhConfig): Promise<any[]> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues?state=open&per_page=100`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  return response.json()
}

async function addlabel(config: GhConfig, issue: number, label: string) {
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
      body: JSON.stringify({ labels: [label] })
    }
  )
}

async function comment(config: GhConfig, issue: number, body: string) {
  await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues/${issue}/comments`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ body })
    }
  )
}

async function closeissue(config: GhConfig, issue: number) {
  await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues/${issue}`,
    {
      method: 'PATCH',
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ state: 'closed', state_reason: 'not_planned' })
    }
  )
}

interface AppConfig {
  appid: string
  privatekey: string
  owner: string
  repo: string
}

async function gettoken(config: AppConfig): Promise<string> {
  const jwt = await createjwt(config.appid, config.privatekey)
  const installationid = await getinstallationid(jwt, config.owner, config.repo)

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
  if (pem.includes('BEGIN PRIVATE KEY')) return pem

  const lines = pem.split('\n')
  const b64 = lines.filter(l => !l.includes('-----')).join('')
  const der = Uint8Array.from(atob(b64), c => c.charCodeAt(0))

  const pkcs8header = new Uint8Array([
    0x30, 0x82, 0x00, 0x00, 0x02, 0x01, 0x00, 0x30, 0x0d,
    0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01,
    0x05, 0x00, 0x04, 0x82, 0x00, 0x00
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
