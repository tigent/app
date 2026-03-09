# evals

## structure

- `cases/<number>.json`: numbered issue or pr cases with source data, current repo labels, and curated expectations
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
