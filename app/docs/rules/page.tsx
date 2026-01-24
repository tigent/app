export default function Rules() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Rules</h1>
				<p className="text-xl text-white/60 max-w-2xl">Define pattern-based rules for automatic labeling.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6 text-white">Pattern matching</h2>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-xl">
{`rules:
  - match: "crash|broken|error"
    add: [bug, p1]
  - match: "security|vulnerability"
    add: [security, p0]`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/labels" className="text-sm text-white/50 hover:text-white transition-colors">← Labels</a>
				<a href="/docs/duplicates" className="text-sm text-white/50 hover:text-white transition-colors">Duplicates →</a>
			</div>
		</article>
	);
}
