# setup

run your own tigent instance for development or self-hosting.

## package manager

use pnpm for all commands.

```bash
pnpm install
```

## github app

1. go to github.com/settings/apps/new
2. set permissions:
   - issues: read & write
   - pull requests: read & write
   - contents: read
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

## local dev

1. create your own github app, name it `tigent-local-<github username>`
2. go to smee.io and create a new channel
3. set your github app webhook url to your smee channel url
4. configure credentials in `.env.local`:

```
GITHUB_APP_ID=your-app-id
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your-webhook-secret
AI_GATEWAY_API_KEY=your-vercel-ai-gateway-key
```

5. start dev server and smee in separate terminals:

```bash
pnpm dev
```

```bash
npx smee-client -u https://smee.io/<your-channel-id> -t http://localhost:3000/api/webhook
```

use smee's "resend" feature to re-send webhooks when debugging instead of creating new issues/prs.

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
