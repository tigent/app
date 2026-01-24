import type { Metadata } from "next";
import { Header, Section } from "./components";

export const metadata: Metadata = {
	title: "Introduction",
	description: "Tigent is an AI-powered GitHub bot that automatically labels issues and pull requests using your existing labels.",
};

export default function Docs() {
	return (
		<article className="py-12">
			<Header
				section="Get Started"
				title="Introduction"
				description="AI-powered labeling for GitHub issues and pull requests."
			/>

			<Section id="overview" title="Overview">
				<p className="text-white/60 mb-4 max-w-2xl">
					Tigent reads your existing GitHub labels and their descriptions, then uses
					AI to automatically apply the right labels when issues or PRs are opened.
				</p>
				<p className="text-white/60 max-w-2xl">
					No complex configuration needed. Just install the app and add descriptions
					to your labels in GitHub settings.
				</p>
			</Section>

			<Section id="how-it-works" title="How it works">
				<div className="space-y-4 max-w-2xl">
					<div className="flex gap-4">
						<span className="text-white/40 font-mono">1</span>
						<p className="text-white/60">Issue or PR is opened</p>
					</div>
					<div className="flex gap-4">
						<span className="text-white/40 font-mono">2</span>
						<p className="text-white/60">Tigent fetches your repository labels and descriptions</p>
					</div>
					<div className="flex gap-4">
						<span className="text-white/40 font-mono">3</span>
						<p className="text-white/60">AI analyzes the content and picks matching labels</p>
					</div>
					<div className="flex gap-4">
						<span className="text-white/40 font-mono">4</span>
						<p className="text-white/60">Labels are applied if confidence is above threshold</p>
					</div>
				</div>
			</Section>

			<section className="mb-12">
				<h2 id="next-steps" className="text-3xl font-semibold mb-8 text-white">Next steps</h2>
				<div className="grid md:grid-cols-2 gap-4 max-w-2xl">
					<a href="/docs/installation" className="block border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors">
						<h3 className="font-semibold mb-2 text-white">Installation</h3>
						<p className="text-sm text-white/50">Install the GitHub App.</p>
					</a>
					<a href="/docs/quickstart" className="block border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors">
						<h3 className="font-semibold mb-2 text-white">Quickstart</h3>
						<p className="text-sm text-white/50">Get running in 2 minutes.</p>
					</a>
				</div>
			</section>
		</article>
	);
}
