# setup

## github app

1. go to github.com/settings/apps/new
2. set permissions:
   - issues: read & write
   - pull requests: read & write
3. subscribe to events:
   - issues
   - pull request
4. generate private key
5. install app on your repo

## env vars

```
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your-webhook-secret
AI_GATEWAY_API_KEY=your-vercel-ai-gateway-key
```

## local testing

```bash
# create labels on repo
bun test.ts setup

# create test issue and triage it
bun test.ts create

# triage existing
bun test.ts issue 1
bun test.ts pr 1
```

## deploy to vercel

```bash
vercel
```

then add env vars in vercel dashboard.

## configure webhook

1. go to your github app settings
2. set webhook url to `https://your-app.vercel.app/api/webhook`
3. set webhook secret (same as GITHUB_WEBHOOK_SECRET)
4. content type: application/json
