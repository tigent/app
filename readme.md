```bash
/ agent-triage

  github agent for automated pr and issue labeling

> what is this?

  classifies prs and issues using ai
  applies labels automatically
  reacts with emojis to show status

> how it works?

  1. eyes reaction when starting
  2. ai classifies content
  3. applies labels if confidence > 0.6

> setup?

  1. create github app at github.com/settings/apps/new
  2. permissions: issues (r/w), pull requests (r/w)
  3. generate private key
  4. install app on repo

> env?

  GITHUB_APP_ID=123456
  GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  AI_GATEWAY_API_KEY=your-vercel-ai-gateway-key

> test?

  bun test.ts setup    → create labels
  bun test.ts create   → create test issue and triage it

> stack?

  ai sdk · ai gateway · github app · bun

> license?

  mit
```
