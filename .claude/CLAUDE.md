# agent-triage

github agent for automated pr and issue labeling

## purpose

- classify prs and issues using ai
- apply labels automatically
- react with emojis to show status

## flow

1. eyes reaction when starting
2. fetch repo labels
3. ai classifies and picks labels
4. apply labels if confidence > 0.6
5. rocket reaction when done

## stack

- ai sdk with ai gateway
- github app auth
- bun runtime

## mcp

- ai-sdk-docs: https://kernelize.dev/ai/mcp

## git

- commits: "feat: description" or "fix: description"
- one line max
- lowercase
