export default function Rules() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-muted mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6">Rules</h1>
				<p className="text-xl text-muted max-w-2xl">Define pattern-based rules for automatic labeling.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6">Pattern matching</h2>
				<pre className="bg-fg text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-xl">
{`rules:
  - match: "crash|broken|error"
    add: [bug, p1]
  - match: "security|vulnerability"
    add: [security, p0]`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-border">
				<a href="/docs/labels" className="text-sm text-muted hover:text-fg transition-colors">← Labels</a>
				<a href="/docs/duplicates" className="text-sm text-muted hover:text-fg transition-colors">Duplicates →</a>
			</div>
		</article>
	);
}
