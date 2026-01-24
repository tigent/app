export default function Slack() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-muted mb-2">Integrations</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6">Slack</h1>
				<p className="text-xl text-muted max-w-2xl">Send triage notifications to Slack channels.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6">Configuration</h2>
				<pre className="bg-fg text-white/90 p-8 rounded-2xl text-sm font-mono max-w-xl">
{`webhooks:
  - url: https://hooks.slack.com/services/T00/B00/xxx
    events: [labeled, duplicate]`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-border">
				<a href="/docs/webhooks" className="text-sm text-muted hover:text-fg transition-colors">← Webhooks</a>
				<a href="/docs/discord" className="text-sm text-muted hover:text-fg transition-colors">Discord →</a>
			</div>
		</article>
	);
}
