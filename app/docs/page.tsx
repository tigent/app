import type { Metadata } from "next";
import { Header, Section } from "./components";

export const metadata: Metadata = {
	title: "Introduction",
	description: "Tigent is an AI-powered GitHub bot that automatically labels, prioritizes, and detects duplicate issues and pull requests.",
};

export default function Docs() {
	return (
		<article className="py-12">
			<Header
				section="Get Started"
				title="Introduction"
				description="Tigent is an AI-powered GitHub bot that automatically labels, prioritizes, and detects duplicate issues and pull requests."
			/>

			<Section id="overview" title="Overview">
				<p className="text-white/60 mb-4 max-w-2xl">
					Managing GitHub issues at scale is tedious. Tigent uses AI to
					understand the content of issues and PRs, then automatically applies
					the right labels, flags duplicates, and routes urgent issues to your team.
				</p>
				<p className="text-white/60 max-w-2xl">
					It works with any repository and requires minimal configuration. Just
					install the GitHub App and add a simple YAML config file.
				</p>
			</Section>

			<Section id="features" title="Features">
				<div className="space-y-8">
					<div>
						<h3 id="auto-labeling" className="text-xl font-semibold mb-3 text-white">Auto-labeling</h3>
						<p className="text-white/60 max-w-2xl">
							AI analyzes issue content and applies relevant labels based on your configuration.
							No more manual triage.
						</p>
					</div>
					<div>
						<h3 id="duplicate-detection" className="text-xl font-semibold mb-3 text-white">Duplicate detection</h3>
						<p className="text-white/60 max-w-2xl">
							Identifies similar issues using semantic search and links them together.
							Optionally auto-close duplicates.
						</p>
					</div>
					<div>
						<h3 id="priority-assignment" className="text-xl font-semibold mb-3 text-white">Priority assignment</h3>
						<p className="text-white/60 max-w-2xl">
							Set urgency levels based on keywords and AI analysis. Critical issues get flagged immediately.
						</p>
					</div>
					<div>
						<h3 id="custom-rules" className="text-xl font-semibold mb-3 text-white">Custom rules</h3>
						<p className="text-white/60 max-w-2xl">
							Define regex patterns to trigger specific labels. Full control over your labeling logic.
						</p>
					</div>
					<div>
						<h3 id="webhooks-feature" className="text-xl font-semibold mb-3 text-white">Webhooks</h3>
						<p className="text-white/60 max-w-2xl">
							Send notifications to Slack, Discord, or any HTTP endpoint when issues are triaged.
						</p>
					</div>
					<div>
						<h3 id="themes-feature" className="text-xl font-semibold mb-3 text-white">Themes</h3>
						<p className="text-white/60 max-w-2xl">
							Choose from built-in color themes for labels or create your own custom palette.
						</p>
					</div>
				</div>
			</Section>

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
