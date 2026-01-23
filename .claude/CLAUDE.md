# agent-triage

github agent for automated pr and issue triage

## purpose

- review community provider docs contributions
- verify prs with tests by reverting code and checking tests fail
- review issues and assess urgency
- send webhook notifications with verdicts

## pr verification flow

1. detect if pr includes tests
2. checkout pr branch
3. revert production code changes (keep tests)
4. run tests to verify they fail without the fix
5. if tests pass without fix = tests dont prove anything
6. if tests fail without fix = valid test coverage

## webhook payloads

### pull requests
- quality score (1-10)
- verdict (skip/review/priority)
- summary of changes
- red flags if any
- test verification result

### issues
- urgency level (low/medium/high/critical)
- category
- suggested assignee type
- summary

## stack

- ai sdk with ai gateway
- github actions
- webhook integration

## mcp

- ai-sdk-docs: https://kernelize.dev/ai/mcp

## git

- commits: "feat: description" or "fix: description"
- one line max
- lowercase
