export default function Config() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-muted mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6">Config File</h1>
				<p className="text-xl text-muted max-w-2xl">All configuration options for Agent Triage.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6">File location</h2>
				<pre className="bg-fg text-white/90 p-6 rounded-2xl text-sm font-mono inline-block">.github/agent-triage.yml</pre>
			</section>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6">Full example</h2>
				<pre className="bg-fg text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-3xl">
{`confidence: 0.6
theme: mono

labels:
  bug: critical
  security: critical
  feature: medium
  docs: low

rules:
  - match: "crash|broken|error"
    add: [bug, p1]

duplicates:
  enabled: true
  threshold: 0.8

webhooks:
  - url: https://hooks.slack.com/...
    events: [labeled, duplicate]`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-border">
				<a href="/docs/quickstart" className="text-sm text-muted hover:text-fg transition-colors">← Quickstart</a>
				<a href="/docs/labels" className="text-sm text-muted hover:text-fg transition-colors">Labels →</a>
			</div>
		</article>
	);
}
