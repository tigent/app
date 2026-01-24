export default function Quickstart() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Get Started</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Quickstart</h1>
				<p className="text-xl text-white/60 max-w-2xl">Get Agent Triage running in under 5 minutes.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6 text-white">Create config</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					Create <code className="bg-white/10 px-2 py-1 rounded text-sm text-accent">.github/agent-triage.yml</code>:
				</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-2xl">
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

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/installation" className="text-sm text-white/50 hover:text-white transition-colors">← Installation</a>
				<a href="/docs/config" className="text-sm text-white/50 hover:text-white transition-colors">Config File →</a>
			</div>
		</article>
	);
}
