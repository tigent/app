import type { Metadata } from "next";
import { Header, Section, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Quickstart",
	description: "Get Tigent running on your GitHub repository in 2 minutes.",
};

export default function Quickstart() {
	return (
		<article className="py-12">
			<Header
				section="Get Started"
				title="Quickstart"
				description="Get Tigent running in 2 minutes."
			/>

			<Section id="install" title="1. Install the app">
				<p className="text-white/60 mb-6 max-w-2xl">
					Install the Tigent GitHub App on your repository.
				</p>
				<a href="https://github.com/apps/tigent" className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-fg rounded-xl hover:opacity-90 transition-opacity font-medium">
					Install GitHub App
				</a>
			</Section>

			<Section id="add-descriptions" title="2. Add label descriptions">
				<p className="text-white/60 mb-4 max-w-2xl">
					Go to your repository settings and add descriptions to your labels.
					Tigent uses these descriptions to understand when to apply each label.
				</p>
				<p className="text-white/60 max-w-2xl">
					<span className="text-white/40">Example:</span> For a label named <code className="bg-white/10 px-2 py-1 rounded text-sm text-accent">bug</code>,
					add a description like &quot;Something is not working as expected&quot;.
				</p>
			</Section>

			<Section id="test" title="3. Test it out">
				<p className="text-white/60 max-w-2xl">
					Create a new issue in your repository. Tigent will analyze it and apply
					matching labels within a few seconds.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
