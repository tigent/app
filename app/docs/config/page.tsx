import type { Metadata } from "next";
import { Header, Section, Option, Code, Codeinline, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Config File",
	description: "All configuration options for Tigent GitHub triage bot.",
};

export default function Config() {
	return (
		<article className="py-12">
			<Header
				section="Configuration"
				title="Config File"
				description="All configuration options for Tigent."
			/>

			<Section id="file-location" title="File location">
				<p className="text-white/60 mb-6 max-w-2xl">
					Create a YAML file in your repository at the following path:
				</p>
				<Codeinline>.github/tigent.yml</Codeinline>
			</Section>

			<Section id="full-example" title="Full example">
				<p className="text-white/60 mb-6 max-w-2xl">
					Here is a complete configuration file with all available options:
				</p>
				<Code className="max-w-3xl">{`confidence: 0.6
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
    events: [labeled, duplicate]`}</Code>
			</Section>

			<Section id="options" title="Options">
				<div className="space-y-8">
					<Option id="confidence" title="confidence" description="Minimum confidence threshold for applying labels. Range: 0.0 to 1.0">
						<Codeinline>confidence: 0.6</Codeinline>
					</Option>
					<Option id="theme" title="theme" description="Color theme for auto-created labels. Options: mono, colorful, pastel, or custom">
						<Codeinline>theme: mono</Codeinline>
					</Option>
					<Option id="labels" title="labels" description="Map of label names to priority levels. The agent will only apply labels defined here.">
						<Codeinline>{`labels:
  bug: critical
  feature: medium`}</Codeinline>
					</Option>
					<Option id="rules" title="rules" description="Pattern matching rules for automatic labeling based on content.">
						<Codeinline>{`rules:
  - match: "crash|error"
    add: [bug]`}</Codeinline>
					</Option>
					<Option id="duplicates" title="duplicates" description="Configure duplicate issue detection.">
						<Codeinline>{`duplicates:
  enabled: true
  threshold: 0.8`}</Codeinline>
					</Option>
					<Option id="autorespond-config" title="autorespond" description="Request missing info from incomplete issues.">
						<Codeinline>{`autorespond:
  enabled: true
  label: needs-info`}</Codeinline>
					</Option>
					<Option id="webhooks-config" title="webhooks" description="Send notifications when issues are triaged.">
						<Codeinline>{`webhooks:
  - url: https://...
    events: [labeled]`}</Codeinline>
					</Option>
				</div>
			</Section>

			<Prevnext />
		</article>
	);
}
