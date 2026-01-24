# docs versioning

current: v0.5

## structure

- `/docs` = latest version
- `/docs/v{version}` = archived versions

## releasing a new version

1. copy current docs to archive folder
```bash
cp -r app/docs app/docs/v0.5
```

2. update `app/docs/config.ts`
```ts
export const version = {
  current: "v1.0",
  all: [
    { label: "v1.0", href: "/docs", current: true },
    { label: "v0.5", href: "/docs/v0.5", current: false },
  ],
};
```

3. create `app/docs/v0.5/config.ts` for archived version
```ts
export const version = {
  current: "v0.5",
  all: [
    { label: "v1.0", href: "/docs", current: false },
    { label: "v0.5", href: "/docs/v0.5", current: true },
  ],
};
```

4. update `/docs` with new version content

## urls

- `tigent.xyz/docs` = latest
- `tigent.xyz/docs/v0.5` = archived v0.5
