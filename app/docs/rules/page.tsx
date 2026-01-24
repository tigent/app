export default function Rules() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Rules</h1>
				<p className="text-xl text-white/60 max-w-2xl">Define pattern-based rules for automatic labeling.</p>
			</div>

			<section className="mb-16">
				<h2 id="pattern-matching" className="text-3xl font-semibold mb-6 text-white">Pattern matching</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					Rules use regex patterns to match issue titles and bodies:
				</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-xl">
{`rules:
  - match: "crash|broken|error"
    add: [bug, p1]
  - match: "security|vulnerability"
    add: [security, p0]`}
				</pre>
			</section>

			<section className="mb-16">
				<h2 id="rule-options" className="text-3xl font-semibold mb-6 text-white">Rule options</h2>
				<div className="space-y-6">
					<div>
						<h3 id="match" className="text-xl font-semibold mb-3 text-white">match</h3>
						<p className="text-white/60 mb-3">Regex pattern to match against issue content.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono">match: "crash|error|bug"</pre>
					</div>
					<div>
						<h3 id="add" className="text-xl font-semibold mb-3 text-white">add</h3>
						<p className="text-white/60 mb-3">Labels to add when the pattern matches.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono">add: [bug, needs-triage]</pre>
					</div>
				</div>
			</section>

			<section className="mb-16">
				<h2 id="examples" className="text-3xl font-semibold mb-6 text-white">Examples</h2>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-xl">
{`rules:
  # Security issues
  - match: "CVE-\\d+|security"
    add: [security, p0]

  # Documentation
  - match: "typo|docs|readme"
    add: [documentation]

  # Feature requests
  - match: "\\[feature\\]|feature request"
    add: [enhancement]`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/labels" className="text-sm text-white/50 hover:text-white transition-colors">← Labels</a>
				<a href="/docs/duplicates" className="text-sm text-white/50 hover:text-white transition-colors">Duplicates →</a>
			</div>
		</article>
	);
}
