import type { Metadata } from "next";
import { Header, Section, Option, Code, Codeinline, Prevnext } from "../components";

export const metadata: Metadata = {
	title: "Rules",
	description: "Define pattern-based rules for automatic GitHub issue labeling with Tigent.",
};

export default function Rules() {
	return (
		<article className="py-12">
			<Header
				section="Configuration"
				title="Rules"
				description="Define pattern-based rules for automatic labeling."
			/>

			<Section id="pattern-matching" title="Pattern matching">
				<p className="text-white/60 mb-6 max-w-2xl">
					Rules use regex patterns to match issue titles and bodies:
				</p>
				<Code className="max-w-xl">{`rules:
  - match: "crash|broken|error"
    add: [bug, p1]
  - match: "security|vulnerability"
    add: [security, p0]`}</Code>
			</Section>

			<Section id="rule-options" title="Rule options">
				<div className="space-y-6">
					<Option id="match" title="match" description="Regex pattern to match against issue content.">
						<Codeinline>match: "crash|error|bug"</Codeinline>
					</Option>
					<Option id="add" title="add" description="Labels to add when the pattern matches.">
						<Codeinline>add: [bug, needs-triage]</Codeinline>
					</Option>
				</div>
			</Section>

			<Section id="examples" title="Examples">
				<Code className="max-w-xl">{`rules:
  # Security issues
  - match: "CVE-\\d+|security"
    add: [security, p0]

  # Documentation
  - match: "typo|docs|readme"
    add: [documentation]

  # Feature requests
  - match: "\\[feature\\]|feature request"
    add: [enhancement]`}</Code>
			</Section>

			<Prevnext />
		</article>
	);
}
