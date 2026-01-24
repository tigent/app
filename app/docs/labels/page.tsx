import type { Metadata } from "next";
import { Header, Section, Code, Card, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Labels",
	description: "Configure which labels Tigent can apply to your GitHub issues and PRs.",
};

export default function Labels() {
	return (
		<article className="py-12">
			<Header
				section="Configuration"
				title="Labels"
				description="Configure which labels Tigent can apply."
			/>

			<Section id="defining-labels" title="Defining labels">
				<p className="text-white/60 mb-6 max-w-2xl">
					Map label names to priority levels in your config file:
				</p>
				<Code className="max-w-xl">{`labels:
  bug: critical
  feature: medium
  docs: low
  question: muted`}</Code>
			</Section>

			<Section id="priority-levels" title="Priority levels">
				<p className="text-white/60 mb-6 max-w-2xl">
					Priority levels determine the label color based on your theme:
				</p>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
					<Card code="critical" description="Highest priority" />
					<Card code="high" description="High priority" />
					<Card code="medium" description="Medium priority" />
					<Card code="low" description="Low priority" />
					<Card code="muted" description="Minimal emphasis" />
					<Card code="light" description="Subtle color" />
				</div>
			</Section>

			<Section id="auto-creation" title="Auto creation">
				<p className="text-white/60 max-w-2xl">
					Tigent will automatically create labels if they do not exist in your repository.
					Colors are assigned based on your theme configuration.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
