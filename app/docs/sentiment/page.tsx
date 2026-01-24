import type { Metadata } from "next";
import { Header, Section, Option, Code, Codeinline, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Sentiment",
	description: "Detect frustrated users and track unanswered issues with Tigent.",
};

export default function Sentiment() {
	return (
		<article className="py-12">
			<Header
				section="Configuration"
				title="Sentiment"
				description="Detect frustrated users and track unanswered issues."
			/>

			<Section id="configuration" title="Configuration">
				<p className="text-white/60 mb-6 max-w-2xl">
					Enable sentiment detection in your config file:
				</p>
				<Code className="max-w-xl">{`sentiment:
  enabled: true
  threshold: 0.7

  detect:
    negative: true
    frustrated: true
    confused: true

  triggers:
    issues: true
    comments: true

  noreply:
    enabled: true
    hours: 48
    mode: both

  labels:
    negative: needs-attention
    frustrated: needs-support
    confused: needs-help
    noreply: awaiting-response

  exempt:
    labels:
      - wontfix
      - duplicate`}</Code>
			</Section>

			<Section id="options" title="Options">
				<div className="space-y-6">
					<Option id="enabled" title="enabled" description="Enable or disable sentiment detection.">
						<Codeinline>enabled: true</Codeinline>
					</Option>
					<Option id="threshold" title="threshold" description="AI confidence threshold (0.0 - 1.0) for flagging sentiment.">
						<Codeinline>threshold: 0.7</Codeinline>
					</Option>
					<Option id="detect" title="detect" description="Which sentiment types to detect.">
						<Codeinline>{`detect:
  negative: true
  frustrated: true
  confused: true`}</Codeinline>
					</Option>
					<Option id="triggers" title="triggers" description="When to check for sentiment.">
						<Codeinline>{`triggers:
  issues: true
  comments: true`}</Codeinline>
					</Option>
					<Option id="noreply" title="noreply" description="Track issues without team responses.">
						<Codeinline>{`noreply:
  enabled: true
  hours: 48
  mode: both`}</Codeinline>
					</Option>
					<Option id="labels" title="labels" description="Labels to apply for each sentiment type. Set to null to skip.">
						<Codeinline>{`labels:
  negative: needs-attention
  frustrated: needs-support
  confused: needs-help
  noreply: awaiting-response`}</Codeinline>
					</Option>
					<Option id="exempt" title="exempt" description="Skip sentiment checks for specific labels or users.">
						<Codeinline>{`exempt:
  labels:
    - wontfix
  users:
    - botuser`}</Codeinline>
					</Option>
				</div>
			</Section>

			<Section id="actions" title="Actions">
				<p className="text-white/60 mb-6 max-w-2xl">
					Configure what happens when sentiment is detected:
				</p>
				<Code className="max-w-xl">{`sentiment:
  enabled: true

  actions:
    webhook:
      url: https://hooks.slack.com/...
      events:
        - negative
        - frustrated
        - noreply

    mention:
      enabled: true
      users: auto
      message: |
        heads up team - this issue may need attention.
      events:
        - negative
        - noreply

    comment:
      enabled: true
      negative: |
        we hear you and are looking into this.
      noreply: |
        sorry for the delay - the team has been notified.`}</Code>
			</Section>

			<Section id="webhook-payload" title="Webhook payload">
				<p className="text-white/60 mb-6 max-w-2xl">
					Webhooks receive JSON payloads (not Slack-formatted):
				</p>
				<Code className="max-w-xl">{`{
  "event": "sentiment",
  "repository": { "owner": "...", "repo": "..." },
  "issue": {
    "number": 123,
    "title": "...",
    "url": "https://github.com/..."
  },
  "sentiment": {
    "type": "frustrated",
    "confidence": 0.85,
    "indicators": ["phrases", "detected"]
  }
}`}</Code>
				<p className="text-white/60 mt-4 max-w-2xl">
					For Slack integration, use a middleware service to convert the payload
					to Slack Block Kit format.
				</p>
			</Section>

			<Section id="how-it-works" title="How it works">
				<p className="text-white/60 max-w-2xl mb-4">
					Tigent analyzes the emotional tone of issues and comments using AI.
					When negative, frustrated, or confused sentiment is detected above
					the threshold, configured actions are triggered.
				</p>
				<p className="text-white/60 max-w-2xl">
					For no-reply tracking, Tigent identifies team members via the GitHub
					collaborators API and checks if issues have received responses. The
					workflow mode runs hourly, reactive mode checks on new comments, and
					both mode does both.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
