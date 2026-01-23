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
import { triagepr, triageissue } from 'agent-triage'

await triagepr({
  github: {
    token: process.env.GITHUB_TOKEN,
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
    token: process.env.GITHUB_TOKEN,
    owner: 'your-org',
    repo: 'your-repo'
  }
}, 456)
```

## env

```
AI_GATEWAY_API_KEY=your-vercel-ai-gateway-key
GITHUB_TOKEN=your-github-token
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
