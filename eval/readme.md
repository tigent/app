# evals

## structure

- `cases/issues/<number>.json`: issue triage regressions
- `cases/prs/<number>.json`: pr triage regressions
- `cases/feedback/<number>.json`: natural maintainer comment flows
- `cases/learn/<number>.json`: learning and verification flows
- `cases/scope/<number>.json`: allow-list enforcement
- `labels.json`: current `vercel/ai` label snapshot used during triage evals
- `load.ts`: schema validation and case loading
- `mock.ts`: github write stubs for feedback and learning evals
- `run.ts`: live runner

## suites

- `triage`: label selection on new issues and prs
- `feedback`: natural maintainer message planning and executed maintainer comment flows
- `learn`: config rewrite and verification before pr creation
- `scope`: org and repo allow-list enforcement

## commands

```bash
pnpm eval
pnpm eval -- --name=13069
```

## expectations

- `gold`: current labels on the source issue or pr
- `expect.added`: labels that must appear
- `expect.excluded`: labels that must not appear
- `expect.blocked`: blocked labels that must be surfaced
- `expect.one`: grouped alternatives where at least one label in each group must appear
- `runtime`: optional executed feedback assertions for reaction, reply text, and label writes

## pr context

- pr evals should include both a concise summary and a `changed files` section in `subject.extra`
- changed file paths are high-signal input for `ai/*` and `provider/*` labels and should be treated as first-class context
