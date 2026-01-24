import type { Metadata } from "next";
import { Header, Section, Code, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Discord",
	description: "Send Tigent triage notifications to Discord channels.",
};

export default function Discord() {
	return (
		<article className="py-12">
			<Header
				section="Integrations"
				title="Discord"
				description="Send triage notifications to Discord channels."
			/>

			<Section id="setup" title="Setup">
				<p className="text-white/60 mb-6 max-w-2xl">
					Create a webhook in your Discord server settings and add the URL to your config:
				</p>
				<Code className="max-w-xl">{`webhooks:
  - url: https://discord.com/api/webhooks/123/abc
    events: [all]`}</Code>
			</Section>

			<Section id="message-format" title="Message format">
				<p className="text-white/60 max-w-2xl">
					Discord notifications are sent as rich embeds with the issue title, labels,
					and a direct link to the issue on GitHub.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
