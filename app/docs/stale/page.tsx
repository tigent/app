import type { Metadata } from "next";
import { Header, Section, Option, Code, Codeinline, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Stale",
	description: "Automatically mark and close inactive GitHub issues with Tigent.",
};

export default function Stale() {
	return (
		<article className="py-12">
			<Header
				section="Configuration"
				title="Stale"
				description="Automatically mark and close inactive issues."
			/>

			<Section id="configuration" title="Configuration">
				<p className="text-white/60 mb-6 max-w-2xl">
					Enable stale issue detection in your config file:
				</p>
				<Code className="max-w-xl">{`stale:
  enabled: true
  days: 60
  close: 7
  label: stale

  exempt:
    labels:
      - pinned
      - security
    assignees: true

  message: |
    this issue has been inactive for {days} days
    and will be closed in {close} days if there
    is no further activity.

  closemessage: |
    this issue has been closed due to inactivity.`}</Code>
			</Section>

			<Section id="options" title="Options">
				<div className="space-y-6">
					<Option id="enabled" title="enabled" description="Enable or disable stale issue detection.">
						<Codeinline>enabled: true</Codeinline>
					</Option>
					<Option id="days" title="days" description="Days of inactivity before an issue is marked stale.">
						<Codeinline>days: 60</Codeinline>
					</Option>
					<Option id="close" title="close" description="Days after being marked stale before the issue is closed.">
						<Codeinline>close: 7</Codeinline>
					</Option>
					<Option id="label" title="label" description="Label to apply to stale issues. Auto-created if missing.">
						<Codeinline>label: stale</Codeinline>
					</Option>
					<Option id="exempt-labels" title="exempt.labels" description="Labels that exempt an issue from being marked stale.">
						<Codeinline>{`exempt:
  labels:
    - pinned
    - security`}</Codeinline>
					</Option>
					<Option id="exempt-assignees" title="exempt.assignees" description="Exempt assigned issues from being marked stale.">
						<Codeinline>{`exempt:
  assignees: true`}</Codeinline>
					</Option>
					<Option id="message" title="message" description="Comment posted when marking an issue stale. Use {days} and {close} placeholders.">
						<Codeinline>{`message: |
  this issue has been inactive for {days} days.`}</Codeinline>
					</Option>
					<Option id="closemessage" title="closemessage" description="Comment posted when closing a stale issue.">
						<Codeinline>{`closemessage: |
  this issue has been closed due to inactivity.`}</Codeinline>
					</Option>
				</div>
			</Section>

			<Section id="how-it-works" title="How it works">
				<p className="text-white/60 max-w-2xl">
					Tigent checks your open issues daily. Issues with no activity for the
					configured number of days are labeled as stale and receive a warning
					comment. If there&apos;s still no activity after the close period, the
					issue is automatically closed.
				</p>
			</Section>

			<Prevnext />
		</article>
	);
}
