export default function Config() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Config File</h1>
				<p className="text-xl text-white/60 max-w-2xl">All configuration options for Tigent.</p>
			</div>

			<section className="mb-16">
				<h2 id="file-location" className="text-3xl font-semibold mb-6 text-white">File location</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					Create a YAML file in your repository at the following path:
				</p>
				<pre className="bg-white/5 border border-white/10 text-accent p-6 rounded-2xl text-sm font-mono inline-block">.github/tigent.yml</pre>
			</section>

			<section className="mb-16">
				<h2 id="full-example" className="text-3xl font-semibold mb-6 text-white">Full example</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					Here is a complete configuration file with all available options:
				</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-3xl">
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

autorespond:
  enabled: true
  label: needs-info
  requirements:
    bug:
      - steps to reproduce
      - expected behavior
    default:
      - clear description

webhooks:
  - url: https://hooks.slack.com/...
    events: [labeled, duplicate]`}
				</pre>
			</section>

			<section className="mb-16">
				<h2 id="options" className="text-3xl font-semibold mb-8 text-white">Options</h2>

				<div className="space-y-8">
					<div>
						<h3 id="confidence" className="text-xl font-semibold mb-3 text-white">confidence</h3>
						<p className="text-white/60 mb-4">Minimum confidence threshold for applying labels. Range: 0.0 to 1.0</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono">confidence: 0.6</pre>
					</div>

					<div>
						<h3 id="theme" className="text-xl font-semibold mb-3 text-white">theme</h3>
						<p className="text-white/60 mb-4">Color theme for auto-created labels. Options: mono, colorful, pastel, or custom</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono">theme: mono</pre>
					</div>

					<div>
						<h3 id="labels" className="text-xl font-semibold mb-3 text-white">labels</h3>
						<p className="text-white/60 mb-4">Map of label names to priority levels. The agent will only apply labels defined here.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono leading-relaxed">
{`labels:
  bug: critical
  feature: medium`}
						</pre>
					</div>

					<div>
						<h3 id="rules" className="text-xl font-semibold mb-3 text-white">rules</h3>
						<p className="text-white/60 mb-4">Pattern matching rules for automatic labeling based on content.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono leading-relaxed">
{`rules:
  - match: "crash|error"
    add: [bug]`}
						</pre>
					</div>

					<div>
						<h3 id="duplicates" className="text-xl font-semibold mb-3 text-white">duplicates</h3>
						<p className="text-white/60 mb-4">Configure duplicate issue detection.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono leading-relaxed">
{`duplicates:
  enabled: true
  threshold: 0.8`}
						</pre>
					</div>

					<div>
						<h3 id="autorespond-config" className="text-xl font-semibold mb-3 text-white">autorespond</h3>
						<p className="text-white/60 mb-4">Request missing info from incomplete issues.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono leading-relaxed">
{`autorespond:
  enabled: true
  label: needs-info`}
						</pre>
					</div>

					<div>
						<h3 id="webhooks-config" className="text-xl font-semibold mb-3 text-white">webhooks</h3>
						<p className="text-white/60 mb-4">Send notifications when issues are triaged.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono leading-relaxed">
{`webhooks:
  - url: https://...
    events: [labeled]`}
						</pre>
					</div>
				</div>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/quickstart" className="text-sm text-white/50 hover:text-white transition-colors">← Quickstart</a>
				<a href="/docs/labels" className="text-sm text-white/50 hover:text-white transition-colors">Labels →</a>
			</div>
		</article>
	);
}
