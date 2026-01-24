export default function Quickstart() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-muted mb-2">Get Started</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6">Quickstart</h1>
				<p className="text-xl text-muted max-w-2xl">Get Agent Triage running in under 5 minutes.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6">Create config</h2>
				<p className="text-muted mb-6 max-w-2xl">
					Create <code className="bg-warm px-2 py-1 rounded text-sm">.github/agent-triage.yml</code>:
				</p>
				<pre className="bg-fg text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-2xl">
{`confidence: 0.6
theme: mono

labels:
  bug: critical
  feature: medium
  docs: low

duplicates:
  enabled: true
  threshold: 0.8`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-border">
				<a href="/docs/installation" className="text-sm text-muted hover:text-fg transition-colors">← Installation</a>
				<a href="/docs/config" className="text-sm text-muted hover:text-fg transition-colors">Config File →</a>
			</div>
		</article>
	);
}
