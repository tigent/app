export default function Discord() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Integrations</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Discord</h1>
				<p className="text-xl text-white/60 max-w-2xl">Send triage notifications to Discord channels.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6 text-white">Configuration</h2>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono max-w-xl">
{`webhooks:
  - url: https://discord.com/api/webhooks/123/abc
    events: [all]`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/slack" className="text-sm text-white/50 hover:text-white transition-colors">← Slack</a>
				<a href="/docs" className="text-sm text-white/50 hover:text-white transition-colors">Back to Docs →</a>
			</div>
		</article>
	);
}
