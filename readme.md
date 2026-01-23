# agent-triage

github agent for automated pr and issue labeling

## what it does

- adds eyes reaction when it starts
- classifies prs/issues using ai
- applies labels if confidence > 0.6
- adds rocket reaction when done

## setup

1. create github app at https://github.com/settings/apps/new
2. permissions: issues (r/w), pull requests (r/w)
3. generate private key
4. install app on repo

```
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
AI_GATEWAY_API_KEY=your-vercel-ai-gateway-key
```

## test

```bash
# create labels
bun test.ts setup

# create test issue and triage it
bun test.ts create

# triage existing issue/pr
bun test.ts issue 1
bun test.ts pr 1
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

await triagepr({ token, owner: 'your-org', repo: 'your-repo' }, 123)
await triageissue({ token, owner: 'your-org', repo: 'your-repo' }, 456)
```
