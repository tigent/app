export default function Docs() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Get Started</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Introduction</h1>
				<p className="text-xl text-white/60 max-w-2xl">
					Tigent is an AI-powered GitHub bot that automatically labels,
					prioritizes, and detects duplicate issues and pull requests.
				</p>
			</div>

			<section className="mb-16">
				<h2 id="overview" className="text-3xl font-semibold mb-6 text-white">Overview</h2>
				<p className="text-white/60 mb-4 max-w-2xl">
					Managing GitHub issues at scale is tedious. Tigent uses AI to
					understand the content of issues and PRs, then automatically applies
					the right labels, flags duplicates, and routes urgent issues to your team.
				</p>
				<p className="text-white/60 max-w-2xl">
					It works with any repository and requires minimal configuration. Just
					install the GitHub App and add a simple YAML config file.
				</p>
			</section>

			<section className="mb-16">
				<h2 id="features" className="text-3xl font-semibold mb-8 text-white">Features</h2>

				<div className="mb-8">
					<h3 id="auto-labeling" className="text-xl font-semibold mb-3 text-white">Auto-labeling</h3>
					<p className="text-white/60 max-w-2xl mb-4">
						AI analyzes issue content and applies relevant labels based on your configuration.
						No more manual triage.
					</p>
				</div>

				<div className="mb-8">
					<h3 id="duplicate-detection" className="text-xl font-semibold mb-3 text-white">Duplicate detection</h3>
					<p className="text-white/60 max-w-2xl mb-4">
						Identifies similar issues using semantic search and links them together.
						Optionally auto-close duplicates.
					</p>
				</div>

				<div className="mb-8">
					<h3 id="priority-assignment" className="text-xl font-semibold mb-3 text-white">Priority assignment</h3>
					<p className="text-white/60 max-w-2xl mb-4">
						Set urgency levels based on keywords and AI analysis. Critical issues get flagged immediately.
					</p>
				</div>

				<div className="mb-8">
					<h3 id="custom-rules" className="text-xl font-semibold mb-3 text-white">Custom rules</h3>
					<p className="text-white/60 max-w-2xl mb-4">
						Define regex patterns to trigger specific labels. Full control over your labeling logic.
					</p>
				</div>

				<div className="mb-8">
					<h3 id="webhooks-feature" className="text-xl font-semibold mb-3 text-white">Webhooks</h3>
					<p className="text-white/60 max-w-2xl mb-4">
						Send notifications to Slack, Discord, or any HTTP endpoint when issues are triaged.
					</p>
				</div>

				<div className="mb-8">
					<h3 id="themes-feature" className="text-xl font-semibold mb-3 text-white">Themes</h3>
					<p className="text-white/60 max-w-2xl">
						Choose from built-in color themes for labels or create your own custom palette.
					</p>
				</div>
			</section>

			<section className="mb-12">
				<h2 id="next-steps" className="text-3xl font-semibold mb-8 text-white">Next steps</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
					<a href="/docs/installation" className="block border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors">
						<h3 className="font-semibold mb-2 text-white">Installation</h3>
						<p className="text-sm text-white/50">Install the GitHub App.</p>
					</a>
					<a href="/docs/quickstart" className="block border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors">
						<h3 className="font-semibold mb-2 text-white">Quickstart</h3>
						<p className="text-sm text-white/50">Get running in 5 minutes.</p>
					</a>
					<a href="/docs/config" className="block border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors">
						<h3 className="font-semibold mb-2 text-white">Configuration</h3>
						<p className="text-sm text-white/50">All config options.</p>
					</a>
					<a href="/docs/webhooks" className="block border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors">
						<h3 className="font-semibold mb-2 text-white">Webhooks</h3>
						<p className="text-sm text-white/50">Set up notifications.</p>
					</a>
				</div>
			</section>
		</article>
	);
}
