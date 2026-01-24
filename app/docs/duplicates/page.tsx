export default function Duplicates() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-muted mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6">Duplicates</h1>
				<p className="text-xl text-muted max-w-2xl">Automatically detect and link duplicate issues.</p>
			</div>

			<section className="mb-16">
				<h2 className="text-3xl font-semibold mb-6">Configuration</h2>
				<pre className="bg-fg text-white/90 p-8 rounded-2xl text-sm font-mono max-w-md">
{`duplicates:
  enabled: true
  threshold: 0.8
  autoclose: false`}
				</pre>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-border">
				<a href="/docs/rules" className="text-sm text-muted hover:text-fg transition-colors">← Rules</a>
				<a href="/docs/themes" className="text-sm text-muted hover:text-fg transition-colors">Themes →</a>
			</div>
		</article>
	);
}
