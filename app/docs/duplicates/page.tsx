import type { Metadata } from "next";
import { Header, Section, Option, Code, Codeinline, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Duplicates",
	description: "Automatically detect and link duplicate GitHub issues with Tigent.",
};

export default function Duplicates() {
	return (
		<article className="py-12">
			<Header
				section="Configuration"
				title="Duplicates"
				description="Automatically detect and link duplicate issues."
			/>

			<Section id="configuration" title="Configuration">
				<p className="text-white/60 mb-6 max-w-2xl">
					Enable duplicate detection in your config file:
				</p>
				<Code className="max-w-md">{`duplicates:
  enabled: true
  threshold: 0.8
  autoclose: false`}</Code>
			</Section>

			<Section id="options" title="Options">
				<div className="space-y-6">
					<Option id="enabled" title="enabled" description="Enable or disable duplicate detection.">
						<Codeinline>enabled: true</Codeinline>
					</Option>
					<Option id="threshold" title="threshold" description="Similarity threshold (0.0 to 1.0). Higher values require more similarity.">
						<Codeinline>threshold: 0.8</Codeinline>
					</Option>
					<Option id="autoclose" title="autoclose" description="Automatically close duplicate issues. Default: false">
						<Codeinline>autoclose: true</Codeinline>
					</Option>
				</div>
			</Section>

			<Section id="how-it-works" title="How it works">
				<p className="text-white/60 max-w-2xl">
					When a new issue is created, Tigent uses semantic similarity to compare it
					against existing open issues. If a match is found above the threshold, it adds
					a comment linking to the potential duplicate.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
