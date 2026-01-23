interface AppConfig {
  appid: string
  privatekey: string
  installationid?: string
  owner?: string
  repo?: string
}

export async function gettoken(config: AppConfig): Promise<string> {
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
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iat: now - 60,
    exp: now + 600,
    iss: appid
  }

  const header = { alg: 'RS256', typ: 'JWT' }
  const enc = new TextEncoder()

  const headerb64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const payloadb64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  const data = enc.encode(`${headerb64}.${payloadb64}`)

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemtobuffer(privatekey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, data)
  const sigb64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  return `${headerb64}.${payloadb64}.${sigb64}`
}

function pemtobuffer(pem: string): ArrayBuffer {
  const lines = pem.split('\n').filter(l => !l.includes('-----'))
  const b64 = lines.join('')
  const binary = atob(b64)
  const buffer = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i)
  }
  return buffer.buffer
}
