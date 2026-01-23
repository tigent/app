# agent-triage

github agent for automated pr and issue triage

## what it does

- adds eyes reaction when it starts reviewing
- classifies prs/issues using ai and applies labels
- verifies test coverage by reverting code and checking tests fail
- sends webhook notifications with verdicts
- adds rocket reaction when done

## install

```bash
bun add agent-triage
```

## usage

```typescript
import { triagepr, triageissue, gettoken } from 'agent-triage'

const token = await gettoken({
  appid: process.env.GITHUB_APP_ID,
  privatekey: process.env.GITHUB_APP_PRIVATE_KEY,
  owner: 'your-org',
  repo: 'your-repo'
})

await triagepr({
  github: {
    token,
    owner: 'your-org',
    repo: 'your-repo'
  },
  webhook: {
    url: 'https://your-webhook.com/endpoint'
  },
  testcmd: 'bun test'
}, 123)

await triageissue({
  github: {
    token,
    owner: 'your-org',
    repo: 'your-repo'
  }
}, 456)
```

## auth

### github app (recommended)

1. create github app at https://github.com/settings/apps/new
2. permissions: issues (r/w), pull requests (r/w), contents (read)
3. generate private key
4. install app on repo

```
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY_PATH=./private-key.pem
```

### personal token

```
GITHUB_TOKEN=ghp_xxx
```

## env

```
AI_GATEWAY_API_KEY=your-vercel-ai-gateway-key
```

## verdicts

### pull requests

- score 1-10
- verdict: skip / review / priority
- test verification result

### issues

- urgency: low / medium / high / critical
- category
- suggested assignee
