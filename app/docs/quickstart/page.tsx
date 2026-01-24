import type { Metadata } from "next";
import { Header, Section, Code, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Quickstart",
	description: "Get Tigent running on your GitHub repository in under 5 minutes.",
};

export default function Quickstart() {
	return (
		<article className="py-12">
			<Header
				section="Get Started"
				title="Quickstart"
				description="Get Tigent running in under 5 minutes."
			/>

			<Section id="install" title="1. Install the app">
				<p className="text-white/60 mb-6 max-w-2xl">
					First, install the Tigent GitHub App on your repository.
				</p>
				<a href="https://github.com/apps/tigent" className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-fg rounded-xl hover:opacity-90 transition-opacity font-medium">
					Install GitHub App
				</a>
			</Section>

			<Section id="create-config" title="2. Create config">
				<p className="text-white/60 mb-6 max-w-2xl">
					Create <code className="bg-white/10 px-2 py-1 rounded text-sm text-accent">.github/tigent.yml</code> in your repository:
				</p>
				<Code className="max-w-2xl">{`confidence: 0.6
theme: mono

labels:
  bug: critical
  feature: medium
  docs: low

duplicates:
  enabled: true
  threshold: 0.8`}</Code>
			</Section>

			<Section id="test" title="3. Test it out">
				<p className="text-white/60 max-w-2xl">
					Create a new issue in your repository. Tigent will automatically analyze it
					and apply the appropriate labels within a few seconds.
				</p>
			</Section>

			<Section id="customize" title="4. Customize">
				<p className="text-white/60 max-w-2xl">
					Explore the configuration options to customize labels, add rules, enable webhooks,
					and more. Check out the Configuration section for all available options.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
