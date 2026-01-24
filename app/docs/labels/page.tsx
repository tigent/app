export default function Labels() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Labels</h1>
				<p className="text-xl text-white/60 max-w-2xl">Configure which labels Agent Triage can apply.</p>
			</div>

			<section className="mb-16">
				<h2 id="defining-labels" className="text-3xl font-semibold mb-6 text-white">Defining labels</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					Map label names to priority levels in your config file:
				</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-xl">
{`labels:
  bug: critical
  feature: medium
  docs: low
  question: muted`}
				</pre>
			</section>

			<section className="mb-16">
				<h2 id="priority-levels" className="text-3xl font-semibold mb-6 text-white">Priority levels</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					Priority levels determine the label color based on your theme:
				</p>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">critical</code>
						<p className="text-xs text-white/40 mt-1">Highest priority</p>
					</div>
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">high</code>
						<p className="text-xs text-white/40 mt-1">High priority</p>
					</div>
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">medium</code>
						<p className="text-xs text-white/40 mt-1">Medium priority</p>
					</div>
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">low</code>
						<p className="text-xs text-white/40 mt-1">Low priority</p>
					</div>
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">muted</code>
						<p className="text-xs text-white/40 mt-1">Minimal emphasis</p>
					</div>
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">light</code>
						<p className="text-xs text-white/40 mt-1">Subtle color</p>
					</div>
				</div>
			</section>

			<section className="mb-16">
				<h2 id="auto-creation" className="text-3xl font-semibold mb-6 text-white">Auto creation</h2>
				<p className="text-white/60 max-w-2xl">
					Agent Triage will automatically create labels if they do not exist in your repository.
					Colors are assigned based on your theme configuration.
				</p>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/config" className="text-sm text-white/50 hover:text-white transition-colors">← Config File</a>
				<a href="/docs/rules" className="text-sm text-white/50 hover:text-white transition-colors">Rules →</a>
			</div>
		</article>
	);
}
