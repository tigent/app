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
model: anthropic/claude-sonnet-4.5
theme: mono

labels:
  bug: critical
  security: critical
  feature: medium
  docs: low

rules:
  - match: "crash|broken|error"
    add: [bug, p1]

reactions:
  start: eyes

duplicates:
  enabled: true
  threshold: 0.8
  label: duplicate
  comment: true

ignore:
  users: [dependabot, renovate]

autorespond:
  enabled: true
  label: needs-info
  context: |
    project context to help ai understand requirements.
  requirements:
    bug:
      - steps to reproduce
      - expected behavior
    default:
      - clear description
  message: |
    thanks for opening this issue!

stale:
  enabled: true
  days: 30
  close: 7
  exempt:
    labels: [security, p0]
    assignees: true
  label: stale
  message: |
    this issue has been inactive for 30 days.
  closemessage: |
    closed due to inactivity.

sentiment:
  enabled: true
  threshold: 0.7
  detect:
    negative: true
    frustrated: true
    confused: true
  labels:
    negative: needs-attention
    frustrated: needs-support
  actions:
    comment:
      enabled: true
      frustrated: |
        sorry for the frustration - we're on it!

webhooks:
  - url: https://hooks.slack.com/...
    events: [labeled, duplicate]`}</Code>
			</Section>

			<Section id="options" title="Options">
				<div className="space-y-8">
					<Option id="confidence" title="confidence" description="Minimum confidence threshold for applying labels. Range: 0.0 to 1.0">
						<Codeinline>confidence: 0.6</Codeinline>
					</Option>
					<Option id="model" title="model" description="AI model to use for classification. Default: anthropic/claude-sonnet-4.5">
						<Codeinline>model: anthropic/claude-sonnet-4.5</Codeinline>
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
					<Option id="reactions" title="reactions" description="Emoji reactions to add during processing.">
						<Codeinline>{`reactions:
  start: eyes`}</Codeinline>
					</Option>
					<Option id="duplicates" title="duplicates" description="Configure duplicate issue detection.">
						<Codeinline>{`duplicates:
  enabled: true
  threshold: 0.8`}</Codeinline>
					</Option>
					<Option id="ignore" title="ignore" description="Skip processing for specific users or labels.">
						<Codeinline>{`ignore:
  users: [dependabot, renovate]`}</Codeinline>
					</Option>
					<Option id="autorespond-config" title="autorespond" description="Request missing info from incomplete issues.">
						<Codeinline>{`autorespond:
  enabled: true
  label: needs-info`}</Codeinline>
					</Option>
					<Option id="stale-config" title="stale" description="Close inactive issues after a period of time.">
						<Codeinline>{`stale:
  enabled: true
  days: 30
  close: 7`}</Codeinline>
					</Option>
					<Option id="sentiment-config" title="sentiment" description="Detect frustrated users and track unanswered issues.">
						<Codeinline>{`sentiment:
  enabled: true
  threshold: 0.7`}</Codeinline>
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
