export default function Quickstart() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Get Started</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Quickstart</h1>
				<p className="text-xl text-white/60 max-w-2xl">Get Agent Triage running in under 5 minutes.</p>
			</div>

			<section className="mb-16">
				<h2 id="install" className="text-3xl font-semibold mb-6 text-white">1. Install the app</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					First, install the Agent Triage GitHub App on your repository.
				</p>
				<a href="https://github.com/apps/agent-triage" className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-fg rounded-xl hover:opacity-90 transition-opacity font-medium">
					Install GitHub App
				</a>
			</section>

			<section className="mb-16">
				<h2 id="create-config" className="text-3xl font-semibold mb-6 text-white">2. Create config</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					Create <code className="bg-white/10 px-2 py-1 rounded text-sm text-accent">.github/agent-triage.yml</code> in your repository:
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

			<section className="mb-16">
				<h2 id="test" className="text-3xl font-semibold mb-6 text-white">3. Test it out</h2>
				<p className="text-white/60 max-w-2xl">
					Create a new issue in your repository. Agent Triage will automatically analyze it
					and apply the appropriate labels within a few seconds.
				</p>
			</section>

			<section className="mb-16">
				<h2 id="customize" className="text-3xl font-semibold mb-6 text-white">4. Customize</h2>
				<p className="text-white/60 max-w-2xl">
					Explore the configuration options to customize labels, add rules, enable webhooks,
					and more. Check out the Configuration section for all available options.
				</p>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/installation" className="text-sm text-white/50 hover:text-white transition-colors">← Installation</a>
				<a href="/docs/config" className="text-sm text-white/50 hover:text-white transition-colors">Config File →</a>
			</div>
		</article>
	);
}
