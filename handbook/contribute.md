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
2. add to navigation in `app/docs/config.ts`
3. use shared components from `app/docs/components.tsx`:

```tsx
import type { Metadata } from "next";
import { Header, Section, Code, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Page Title",
	description: "page description for seo",
};

export default function PageName() {
	return (
		<article className="py-12">
			<Header section="Section" title="Title" description="Description." />

			<Section id="section-id" title="Section Title">
				<p className="text-muted mb-6 max-w-2xl">content here.</p>
				<Code>{`code example`}</Code>
			</Section>

			<Prevnext />
		</article>
	);
}
```

4. available components: `Header`, `Section`, `Code`, `Codeinline`, `Option`, `Card`, `Prevnext`
5. update `app/docs/config/page.tsx` if adding a new config option
6. follow existing ui patterns and styles
