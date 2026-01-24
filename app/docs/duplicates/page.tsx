export default function Duplicates() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Duplicates</h1>
				<p className="text-xl text-white/60 max-w-2xl">Automatically detect and link duplicate issues.</p>
			</div>

			<section className="mb-16">
				<h2 id="configuration" className="text-3xl font-semibold mb-6 text-white">Configuration</h2>
				<p className="text-white/60 mb-6 max-w-2xl">
					Enable duplicate detection in your config file:
				</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono max-w-md">
{`duplicates:
  enabled: true
  threshold: 0.8
  autoclose: false`}
				</pre>
			</section>

			<section className="mb-16">
				<h2 id="options" className="text-3xl font-semibold mb-6 text-white">Options</h2>
				<div className="space-y-6">
					<div>
						<h3 id="enabled" className="text-xl font-semibold mb-3 text-white">enabled</h3>
						<p className="text-white/60 mb-3">Enable or disable duplicate detection.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono">enabled: true</pre>
					</div>
					<div>
						<h3 id="threshold" className="text-xl font-semibold mb-3 text-white">threshold</h3>
						<p className="text-white/60 mb-3">Similarity threshold (0.0 to 1.0). Higher values require more similarity.</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono">threshold: 0.8</pre>
					</div>
					<div>
						<h3 id="autoclose" className="text-xl font-semibold mb-3 text-white">autoclose</h3>
						<p className="text-white/60 mb-3">Automatically close duplicate issues. Default: false</p>
						<pre className="bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono">autoclose: true</pre>
					</div>
				</div>
			</section>

			<section className="mb-16">
				<h2 id="how-it-works" className="text-3xl font-semibold mb-6 text-white">How it works</h2>
				<p className="text-white/60 max-w-2xl">
					When a new issue is created, Tigent uses semantic similarity to compare it
					against existing open issues. If a match is found above the threshold, it adds
					a comment linking to the potential duplicate.
				</p>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/rules" className="text-sm text-white/50 hover:text-white transition-colors">← Rules</a>
				<a href="/docs/themes" className="text-sm text-white/50 hover:text-white transition-colors">Themes →</a>
			</div>
		</article>
	);
}
