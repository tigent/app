import type { Metadata } from "next";
import { Header, Section, Option, Code, Codeinline, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Autorespond",
	description: "Automatically request missing info from incomplete GitHub issues with Tigent.",
};

export default function Autorespond() {
	return (
		<article className="py-12">
			<Header
				section="Configuration"
				title="Autorespond"
				description="Automatically request missing info from incomplete issues."
			/>

			<Section id="configuration" title="Configuration">
				<p className="text-white/60 mb-6 max-w-2xl">
					Enable autorespond in your config file:
				</p>
				<Code className="max-w-xl">{`autorespond:
  enabled: true
  label: needs-info

  context: |
    tigent is a github bot that auto-labels issues.
    common issues involve webhook config and yaml syntax.

  requirements:
    bug:
      - steps to reproduce
      - expected vs actual behavior
      - environment info
    feature:
      - use case description
      - proposed solution
    default:
      - clear description

  message: |
    thanks for opening this issue!
    we need a bit more info to help you.`}</Code>
			</Section>

			<Section id="options" title="Options">
				<div className="space-y-6">
					<Option id="enabled" title="enabled" description="Enable or disable autorespond.">
						<Codeinline>enabled: true</Codeinline>
					</Option>
					<Option id="label" title="label" description="Label to apply when requesting info. Auto-created if missing.">
						<Codeinline>label: needs-info</Codeinline>
					</Option>
					<Option id="context" title="context" description="Project context to help the AI understand what info is needed.">
						<Codeinline>{`context: |
  this is a cli tool for managing k8s clusters.
  users often forget to include their k8s version.`}</Codeinline>
					</Option>
					<Option id="requirements" title="requirements" description="Required info by issue type. Use default for all other types.">
						<Codeinline>{`requirements:
  bug:
    - steps to reproduce
    - expected vs actual behavior
  feature:
    - use case description
  default:
    - clear description`}</Codeinline>
					</Option>
					<Option id="message" title="message" description="Template for the response comment. The AI will customize it based on what's missing.">
						<Codeinline>{`message: |
  thanks for opening this issue!
  we need a bit more info to help you.`}</Codeinline>
					</Option>
				</div>
			</Section>

			<Section id="how-it-works" title="How it works">
				<p className="text-white/60 max-w-2xl">
					When a new issue is created, Tigent analyzes it against your requirements.
					If required info is missing, it posts a friendly comment asking for specifics
					and adds the configured label. Normal labeling is skipped until the issue is updated.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
