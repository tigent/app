export default function Autorespond() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Autorespond</h1>
				<p className="text-xl text-white/60 max-w-2xl">Automatically request missing info from incomplete issues.</p>
			</div>

			<section className="mb-16">
				<h2 id="configuration" className="text-3xl font-semibold mb-6 text-white">Configuration</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					Enable autorespond in your config file:
				</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono max-w-xl leading-relaxed">
{`autorespond:
  enabled: true
  label: needs-info

  context: |
    tigent is a github bot that auto-labels issues.
    common issues involve webhook config and yaml syntax.

  requirements:
    bug:
      - steps to reproduce
      - expected vs actual behavior
      - environment info
    feature:
      - use case description
      - proposed solution
    default:
      - clear description

  message: |
    thanks for opening this issue!
    we need a bit more info to help you.`}
				</pre>
			</section>

			<section className="mb-16">
				<h2 id="options" className="text-3xl font-semibold mb-6 text-white">Options</h2>
				<div className="space-y-6">
					<div>
						<h3 id="enabled" className="text-xl font-semibold mb-3 text-white">enabled</h3>
						<p className="text-white/60 mb-3">Enable or disable autorespond.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono">enabled: true</pre>
					</div>
					<div>
						<h3 id="label" className="text-xl font-semibold mb-3 text-white">label</h3>
						<p className="text-white/60 mb-3">Label to apply when requesting info. Auto-created if missing.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono">label: needs-info</pre>
					</div>
					<div>
						<h3 id="context" className="text-xl font-semibold mb-3 text-white">context</h3>
						<p className="text-white/60 mb-3">Project context to help the AI understand what info is needed.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono leading-relaxed">
{`context: |
  this is a cli tool for managing k8s clusters.
  users often forget to include their k8s version.`}
						</pre>
					</div>
					<div>
						<h3 id="requirements" className="text-xl font-semibold mb-3 text-white">requirements</h3>
						<p className="text-white/60 mb-3">Required info by issue type. Use default for all other types.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono leading-relaxed">
{`requirements:
  bug:
    - steps to reproduce
    - expected vs actual behavior
  feature:
    - use case description
  default:
    - clear description`}
						</pre>
					</div>
					<div>
						<h3 id="message" className="text-xl font-semibold mb-3 text-white">message</h3>
						<p className="text-white/60 mb-3">Template for the response comment. The AI will customize it based on what's missing.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono leading-relaxed">
{`message: |
  thanks for opening this issue!
  we need a bit more info to help you.`}
						</pre>
					</div>
				</div>
			</section>

			<section className="mb-16">
				<h2 id="how-it-works" className="text-3xl font-semibold mb-6 text-white">How it works</h2>
				<p className="text-white/60 max-w-2xl">
					When a new issue is created, Tigent analyzes it against your requirements.
					If required info is missing, it posts a friendly comment asking for specifics
					and adds the configured label. Normal labeling is skipped until the issue is updated.
				</p>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/duplicates" className="text-sm text-white/50 hover:text-white transition-colors">← Duplicates</a>
				<a href="/docs/themes" className="text-sm text-white/50 hover:text-white transition-colors">Themes →</a>
			</div>
		</article>
	);
}
