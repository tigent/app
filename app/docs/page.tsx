export default function Docs() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Get Started</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Introduction</h1>
				<p className="text-xl text-white/60 max-w-2xl">
					Agent Triage is an AI-powered GitHub bot that automatically labels,
					prioritizes, and detects duplicate issues and pull requests.
				</p>
			</div>

			<section className="mb-16">
				<p className="text-white/60 mb-4 max-w-2xl">
					Managing GitHub issues at scale is tedious. Agent Triage uses AI to
					understand the content of issues and PRs, then automatically applies
					the right labels, flags duplicates, and routes urgent issues to your team.
				</p>
				<p className="text-white/60 max-w-2xl">
					It works with any repository and requires minimal configuration. Just
					install the GitHub App and add a simple YAML config file.
				</p>
			</section>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-8 text-white">Features</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="border border-white/10 rounded-xl p-6">
						<h3 className="font-semibold mb-2 text-white">Auto-labeling</h3>
						<p className="text-sm text-white/50">AI analyzes issue content and applies relevant labels.</p>
					</div>
					<div className="border border-white/10 rounded-xl p-6">
						<h3 className="font-semibold mb-2 text-white">Duplicate detection</h3>
						<p className="text-sm text-white/50">Identifies similar issues using semantic search.</p>
					</div>
					<div className="border border-white/10 rounded-xl p-6">
						<h3 className="font-semibold mb-2 text-white">Priority assignment</h3>
						<p className="text-sm text-white/50">Set urgency levels based on keywords and AI analysis.</p>
					</div>
					<div className="border border-white/10 rounded-xl p-6">
						<h3 className="font-semibold mb-2 text-white">Custom rules</h3>
						<p className="text-sm text-white/50">Define regex patterns to trigger specific labels.</p>
					</div>
					<div className="border border-white/10 rounded-xl p-6">
						<h3 className="font-semibold mb-2 text-white">Webhooks</h3>
						<p className="text-sm text-white/50">Send notifications to Slack, Discord, or any endpoint.</p>
					</div>
					<div className="border border-white/10 rounded-xl p-6">
						<h3 className="font-semibold mb-2 text-white">Themes</h3>
						<p className="text-sm text-white/50">Choose from built-in color themes for labels.</p>
					</div>
				</div>
			</section>

			<section className="mb-12">
				<h2 className="text-3xl font-semibold mb-8 text-white">Next steps</h2>
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
