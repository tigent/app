export default function Themes() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Configuration</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Themes</h1>
				<p className="text-xl text-white/60 max-w-2xl">
					Color themes for auto-created labels.
				</p>
			</div>

			<section className="mb-16">
				<h2 id="built-in" className="text-3xl font-semibold mb-8 text-white">Built-in themes</h2>
				<div className="grid md:grid-cols-3 gap-6">
					<div className="border border-white/10 rounded-2xl p-6">
						<h3 id="mono" className="font-semibold text-lg mb-4 text-white">mono</h3>
						<p className="text-sm text-white/50 mb-6">Grayscale for a clean look.</p>
						<div className="flex gap-2">
							<span className="w-6 h-6 rounded bg-black border border-white/20" />
							<span className="w-6 h-6 rounded bg-neutral-700" />
							<span className="w-6 h-6 rounded bg-neutral-500" />
							<span className="w-6 h-6 rounded bg-neutral-400" />
							<span className="w-6 h-6 rounded bg-neutral-300" />
						</div>
					</div>
					<div className="border border-white/10 rounded-2xl p-6">
						<h3 id="colorful" className="font-semibold text-lg mb-4 text-white">colorful</h3>
						<p className="text-sm text-white/50 mb-6">Vibrant for high visibility.</p>
						<div className="flex gap-2">
							<span className="w-6 h-6 rounded bg-red-600" />
							<span className="w-6 h-6 rounded bg-orange-500" />
							<span className="w-6 h-6 rounded bg-yellow-400" />
							<span className="w-6 h-6 rounded bg-green-500" />
							<span className="w-6 h-6 rounded bg-blue-500" />
						</div>
					</div>
					<div className="border border-white/10 rounded-2xl p-6">
						<h3 id="pastel" className="font-semibold text-lg mb-4 text-white">pastel</h3>
						<p className="text-sm text-white/50 mb-6">Soft for a gentle aesthetic.</p>
						<div className="flex gap-2">
							<span className="w-6 h-6 rounded bg-red-200" />
							<span className="w-6 h-6 rounded bg-orange-200" />
							<span className="w-6 h-6 rounded bg-yellow-200" />
							<span className="w-6 h-6 rounded bg-green-200" />
							<span className="w-6 h-6 rounded bg-blue-200" />
						</div>
					</div>
				</div>
				<pre className="bg-white/5 border border-white/10 text-accent p-6 rounded-2xl text-sm font-mono mt-8 inline-block">theme: mono</pre>
			</section>

			<section className="mb-16">
				<h2 id="custom" className="text-3xl font-semibold mb-6 text-white">Custom themes</h2>
				<p className="text-white/60 mb-6 max-w-2xl">Define your own theme with hex colors:</p>
				<pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed max-w-lg">
					{`theme: custom

themes:
  custom:
    critical: ff0000
    high: ff6600
    medium: ffcc00
    low: 00cc00
    muted: 0066ff
    light: cc00ff`}
				</pre>
			</section>

			<section className="mb-16">
				<h2 id="priority-levels" className="text-3xl font-semibold mb-6 text-white">Priority levels</h2>
				<p className="text-white/60 mb-6 max-w-2xl">Each theme maps these priority levels to colors:</p>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
					<div className="p-3 border border-white/10 rounded-lg text-center">
						<code className="text-sm text-white">critical</code>
					</div>
					<div className="p-3 border border-white/10 rounded-lg text-center">
						<code className="text-sm text-white">high</code>
					</div>
					<div className="p-3 border border-white/10 rounded-lg text-center">
						<code className="text-sm text-white">medium</code>
					</div>
					<div className="p-3 border border-white/10 rounded-lg text-center">
						<code className="text-sm text-white">low</code>
					</div>
					<div className="p-3 border border-white/10 rounded-lg text-center">
						<code className="text-sm text-white">muted</code>
					</div>
					<div className="p-3 border border-white/10 rounded-lg text-center">
						<code className="text-sm text-white">light</code>
					</div>
				</div>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs/duplicates" className="text-sm text-white/50 hover:text-white transition-colors">← Duplicates</a>
				<a href="/docs/webhooks" className="text-sm text-white/50 hover:text-white transition-colors">Webhooks →</a>
			</div>
		</article>
	);
}
