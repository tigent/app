import type { PrVerdict, IssueVerdict } from './schema'

interface WebhookConfig {
  url: string
  secret?: string
}

interface PrPayload {
  type: 'pull_request'
  number: number
  url: string
  verdict: PrVerdict
}

interface IssuePayload {
  type: 'issue'
  number: number
  url: string
  verdict: IssueVerdict
}

type Payload = PrPayload | IssuePayload

export async function notify(config: WebhookConfig, payload: Payload) {
  const headers: Record<string, string> = {
    'content-type': 'application/json'
  }

  if (config.secret) {
    const signature = await sign(JSON.stringify(payload), config.secret)
    headers['x-signature'] = signature
  }

  const response = await fetch(config.url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`webhook failed: ${response.status}`)
  }

  return response.json()
}

async function sign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return Buffer.from(signature).toString('hex')
}
