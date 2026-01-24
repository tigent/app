# contributing

guidelines for contributing to tigent.

## branches

```
name/description
```

create a branch off main with your name and a short description.

## commits

```
feat: add new feature
fix: resolve bug
chore: update dependencies
```

## pull requests

### title

```
feat: add autorespond feature
fix: hide scrollbar on docs sidebar
```

same format as commits.

### description

```md
## summary
- bullet points
- lowercase
- simple

## config (if applicable)
\`\`\`yaml
example: config
\`\`\`
```

- no fluff or extra sections
- no "how it works" unless complex

## testing

1. run build to check for errors:

```bash
bun run build
```

2. test locally with smee.io webhook forwarding (see setup.md)
3. create test issue/pr to verify changes
4. check validation passes:

```bash
bun run .github/scripts/validate.ts
```

## adding docs

1. create new page at `app/docs/<name>/page.tsx`
2. add to `app/docs/sidebar.tsx` navigation array
3. add to `app/docs/breadcrumb.tsx` pages mapping
4. follow existing page structure:

```tsx
export default function PageName() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Section</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Title</h1>
				<p className="text-xl text-white/60 max-w-2xl">Description.</p>
			</div>

			<section className="mb-16">
				<h2 id="section-id" className="text-3xl font-semibold mb-6 text-white">Section</h2>
				<p className="text-white/60 mb-6 max-w-2xl">Content.</p>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/prev" className="text-sm text-white/50 hover:text-white transition-colors">← Previous</a>
				<a href="/docs/next" className="text-sm text-white/50 hover:text-white transition-colors">Next →</a>
			</div>
		</article>
	);
}
```

5. update `app/docs/config/page.tsx` if adding a new config option
6. follow existing ui patterns and styles
