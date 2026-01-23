import { Webhooks } from '@octokit/webhooks'
import { triagepr, triageissue, gettoken } from '../index'

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
