export default function Webhooks() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Integrations</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Webhooks</h1>
				<p className="text-xl text-white/60 max-w-2xl">
					Send notifications when issues are triaged.
				</p>
			</div>

			<section className="mb-16">
				<h2 id="configuration" className="text-3xl font-semibold mb-6 text-white">Configuration</h2>
				<p className="text-white/60 mb-6 max-w-2xl">Add webhook URLs to receive notifications:</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-xl">
					{`webhooks:
  - url: https://hooks.slack.com/services/...
    events: [labeled, duplicate]
  - url: https://discord.com/api/webhooks/...
    events: [all]`}
				</pre>
			</section>

			<section className="mb-16">
				<h2 id="events" className="text-3xl font-semibold mb-8 text-white">Events</h2>
				<p className="text-white/60 mb-6 max-w-2xl">Choose which events trigger notifications:</p>
				<div className="grid md:grid-cols-3 gap-4 max-w-3xl">
					<div className="p-5 border border-white/10 rounded-xl">
						<code className="text-lg font-semibold text-white">labeled</code>
						<p className="text-sm text-white/50 mt-2">When labels are applied</p>
					</div>
					<div className="p-5 border border-white/10 rounded-xl">
						<code className="text-lg font-semibold text-white">duplicate</code>
						<p className="text-sm text-white/50 mt-2">When duplicate is detected</p>
					</div>
					<div className="p-5 border border-white/10 rounded-xl bg-accent/20">
						<code className="text-lg font-semibold text-accent">all</code>
						<p className="text-sm text-white/50 mt-2">Receive all events</p>
					</div>
				</div>
			</section>

			<section className="mb-16">
				<h2 id="payload" className="text-3xl font-semibold mb-6 text-white">Payload</h2>
				<p className="text-white/60 mb-6 max-w-2xl">Webhook payloads are sent as JSON:</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-xl">
					{`{
  "event": "labeled",
  "repository": "owner/repo",
  "issue": {
    "number": 123,
    "title": "Bug report",
    "url": "https://github.com/..."
  },
  "labels": ["bug", "p1"],
  "confidence": 0.85
}`}
				</pre>
			</section>

			<section className="mb-16">
				<h2 id="security" className="text-3xl font-semibold mb-6 text-white">Security</h2>
				<p className="text-white/60 mb-4 max-w-2xl">
					All webhook requests include a signature header for verification:
				</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono mb-4">X-Agent-Triage-Signature: sha256=...</pre>
				<p className="text-white/60 max-w-2xl">
					Verify the signature using HMAC-SHA256 with your webhook secret.
				</p>
			</section>

			<section className="mb-16">
				<h2 id="retries" className="text-3xl font-semibold mb-6 text-white">Retries</h2>
				<p className="text-white/60 max-w-2xl">
					Failed webhook deliveries are retried up to 3 times with exponential backoff.
					Responses with status codes 2xx are considered successful.
				</p>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/themes" className="text-sm text-white/50 hover:text-white transition-colors">← Themes</a>
				<a href="/docs/slack" className="text-sm text-white/50 hover:text-white transition-colors">Slack →</a>
			</div>
		</article>
	);
}
