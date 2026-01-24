import type { Metadata } from "next";
import { Header, Section, Code, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Slack",
	description: "Send Tigent triage notifications to Slack channels.",
};

export default function Slack() {
	return (
		<article className="py-12">
			<Header
				section="Integrations"
				title="Slack"
				description="Send triage notifications to Slack channels."
			/>

			<Section id="setup" title="Setup">
				<p className="text-white/60 mb-6 max-w-2xl">
					Create an incoming webhook in your Slack workspace and add the URL to your config:
				</p>
				<Code className="max-w-xl">{`webhooks:
  - url: https://hooks.slack.com/services/T00/B00/xxx
    events: [labeled, duplicate]`}</Code>
			</Section>

			<Section id="message-format" title="Message format">
				<p className="text-white/60 max-w-2xl">
					Slack notifications include the issue title, labels applied, and a link to the issue.
					Messages are formatted using Slack Block Kit for a clean appearance.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
