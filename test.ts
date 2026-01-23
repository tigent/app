import { triagepr, triageissue, gettoken } from './index'
import { readFileSync } from 'fs'

const owner = 'dancer'
const repo = 'agent-triage'

async function getghtoken(): Promise<string> {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN
  }

  if (process.env.GITHUB_APP_ID && process.env.GITHUB_APP_PRIVATE_KEY_PATH) {
    const privatekey = readFileSync(process.env.GITHUB_APP_PRIVATE_KEY_PATH, 'utf8')
    return await gettoken({
      appid: process.env.GITHUB_APP_ID,
      privatekey,
      owner,
      repo
    })
  }

  throw new Error('set GITHUB_TOKEN or GITHUB_APP_ID + GITHUB_APP_PRIVATE_KEY_PATH')
}

const mode = process.argv[2]
const number = parseInt(process.argv[3] || '0')

if (!mode || !number) {
  console.log('usage: bun test.ts <pr|issue> <number>')
  process.exit(1)
}

if (!process.env.AI_GATEWAY_API_KEY) {
  console.log('set AI_GATEWAY_API_KEY env var')
  process.exit(1)
}

const token = await getghtoken()
const config = { token, owner, repo }

if (mode === 'pr') {
  const result = await triagepr(config, number)
  console.log(result)
} else if (mode === 'issue') {
  const result = await triageissue(config, number)
  console.log(result)
} else {
  console.log('mode must be pr or issue')
}
