import type { Metadata } from "next";
import { Header, Section, Code, Codeinline, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Webhooks",
	description: "Send notifications when GitHub issues are triaged by Tigent.",
};

export default function Webhooks() {
	return (
		<article className="py-12">
			<Header
				section="Integrations"
				title="Webhooks"
				description="Send notifications when issues are triaged."
			/>

			<Section id="configuration" title="Configuration">
				<p className="text-white/60 mb-6 max-w-2xl">Add webhook URLs to receive notifications:</p>
				<Code className="max-w-xl">{`webhooks:
  - url: https://hooks.slack.com/services/...
    events: [labeled, duplicate]
  - url: https://discord.com/api/webhooks/...
    events: [all]`}</Code>
			</Section>

			<Section id="events" title="Events">
				<p className="text-white/60 mb-6 max-w-2xl">Choose which events trigger notifications:</p>
				<div className="grid md:grid-cols-3 gap-4 max-w-3xl">
					<div className="p-5 border border-white/10 rounded-xl">
						<code className="text-lg font-semibold text-white">labeled</code>
						<p className="text-sm text-white/50 mt-2">When labels are applied</p>
					</div>
					<div className="p-5 border border-white/10 rounded-xl">
						<code className="text-lg font-semibold text-white">duplicate</code>
						<p className="text-sm text-white/50 mt-2">When duplicate is detected</p>
					</div>
					<div className="p-5 border border-white/10 rounded-xl bg-accent/20">
						<code className="text-lg font-semibold text-accent">all</code>
						<p className="text-sm text-white/50 mt-2">Receive all events</p>
					</div>
				</div>
			</Section>

			<Section id="payload" title="Payload">
				<p className="text-white/60 mb-6 max-w-2xl">Webhook payloads are sent as JSON:</p>
				<Code className="max-w-xl">{`{
  "event": "labeled",
  "repository": "owner/repo",
  "issue": {
    "number": 123,
    "title": "Bug report",
    "url": "https://github.com/..."
  },
  "labels": ["bug", "p1"],
  "confidence": 0.85
}`}</Code>
			</Section>

			<Section id="security" title="Security">
				<p className="text-white/60 mb-4 max-w-2xl">
					All webhook requests include a signature header for verification:
				</p>
				<Codeinline>X-Agent-Triage-Signature: sha256=...</Codeinline>
				<p className="text-white/60 mt-4 max-w-2xl">
					Verify the signature using HMAC-SHA256 with your webhook secret.
				</p>
			</Section>

			<Section id="retries" title="Retries">
				<p className="text-white/60 max-w-2xl">
					Failed webhook deliveries are retried up to 3 times with exponential backoff.
					Responses with status codes 2xx are considered successful.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
