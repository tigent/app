export default function Discord() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-muted mb-2">Integrations</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6">Discord</h1>
				<p className="text-xl text-muted max-w-2xl">Send triage notifications to Discord channels.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6">Configuration</h2>
				<pre className="bg-fg text-white/90 p-8 rounded-2xl text-sm font-mono max-w-xl">
{`webhooks:
  - url: https://discord.com/api/webhooks/123/abc
    events: [all]`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-border">
				<a href="/docs/slack" className="text-sm text-muted hover:text-fg transition-colors">← Slack</a>
				<a href="/docs" className="text-sm text-muted hover:text-fg transition-colors">Back to Docs →</a>
			</div>
		</article>
	);
}
