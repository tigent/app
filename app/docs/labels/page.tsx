export default function Labels() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-muted mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6">Labels</h1>
				<p className="text-xl text-muted max-w-2xl">Configure which labels Agent Triage can apply.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6">Defining labels</h2>
				<pre className="bg-fg text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-xl">
{`labels:
  bug: critical
  feature: medium
  docs: low
  question: muted`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-border">
				<a href="/docs/config" className="text-sm text-muted hover:text-fg transition-colors">← Config File</a>
				<a href="/docs/rules" className="text-sm text-muted hover:text-fg transition-colors">Rules →</a>
			</div>
		</article>
	);
}
