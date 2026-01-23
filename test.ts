import { triagepr, triageissue, gettoken, github } from './index'

const owner = 'dancer'
const repo = 'agent-triage'

async function getghtoken(): Promise<string> {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN
  }

  if (process.env.GITHUB_APP_ID && process.env.GITHUB_APP_PRIVATE_KEY) {
    return await gettoken({
      appid: process.env.GITHUB_APP_ID,
      privatekey: process.env.GITHUB_APP_PRIVATE_KEY,
      owner,
      repo
    })
  }

  throw new Error('set GITHUB_TOKEN or GITHUB_APP_ID + GITHUB_APP_PRIVATE_KEY')
}

const mode = process.argv[2]

if (!mode) {
  console.log('usage:')
  console.log('  bun test.ts setup         - create test labels')
  console.log('  bun test.ts create        - create test issue and triage it')
  console.log('  bun test.ts issue <num>   - triage existing issue')
  console.log('  bun test.ts pr <num>      - triage existing pr')
  process.exit(1)
}

if (!process.env.AI_GATEWAY_API_KEY) {
  console.log('set AI_GATEWAY_API_KEY env var')
  process.exit(1)
}

const token = await getghtoken()
const config = { token, owner, repo }

const labels = [
  { name: 'ai/core', color: '0052cc' },
  { name: 'ai/ui', color: '1d76db' },
  { name: 'ai/gateway', color: '5319e7' },
  { name: 'ai/mcp', color: 'fbca04' },
  { name: 'ai/rsc', color: 'b60205' },
  { name: 'ai/telemetry', color: 'd93f0b' },
  { name: 'ai/provider', color: '0e8a16' },
  { name: 'bug', color: 'd73a4a' },
  { name: 'documentation', color: '0075ca' },
  { name: 'maintenance', color: 'ededed' },
  { name: 'provider/openai', color: '74aa9c' },
  { name: 'provider/anthropic', color: 'd4a27f' },
  { name: 'provider/google', color: '4285f4' },
  { name: 'provider/community', color: 'c5def5' }
]

if (mode === 'setup') {
  console.log('creating labels...')
  for (const l of labels) {
    await github.createlabel(config, l.name, l.color)
    console.log(`  ${l.name}`)
  }
  console.log('done')
} else if (mode === 'create') {
  console.log('creating test issue...')
  const number = await github.createissue(
    config,
    'Bug: streamText not working with @ai-sdk/anthropic',
    'When using streamText with the anthropic provider, I get an error.\n\n```\nimport { streamText } from "ai"\nimport { anthropic } from "@ai-sdk/anthropic"\n```\n\nPlease help!'
  )
  console.log(`created issue #${number}`)
  console.log('triaging...')
  const result = await triageissue(config, number)
  console.log(result)
} else if (mode === 'issue') {
  const number = parseInt(process.argv[3] || '0')
  if (!number) {
    console.log('usage: bun test.ts issue <number>')
    process.exit(1)
  }
  const result = await triageissue(config, number)
  console.log(result)
} else if (mode === 'pr') {
  const number = parseInt(process.argv[3] || '0')
  if (!number) {
    console.log('usage: bun test.ts pr <number>')
    process.exit(1)
  }
  const result = await triagepr(config, number)
  console.log(result)
} else {
  console.log('unknown mode:', mode)
}
