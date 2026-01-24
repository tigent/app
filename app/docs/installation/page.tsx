export default function Installation() {
	return (
		<article className="py-12">
			<div className="mb-12">
				<p className="text-sm text-white/40 mb-2">Get Started</p>
				<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">Installation</h1>
				<p className="text-xl text-white/60 max-w-2xl">Install Tigent on your GitHub repositories.</p>
			</div>

			<section className="mb-16">
				<h2 id="github-app" className="text-3xl font-semibold mb-6 text-white">GitHub App</h2>
				<p className="text-white/60 mb-8 max-w-2xl">Click the button below to install Tigent on your repositories.</p>
				<a href="https://github.com/apps/tigent" className="inline-flex items-center gap-2 px-6 py-4 bg-accent text-fg rounded-xl hover:opacity-90 transition-opacity text-lg font-medium">
					<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
					</svg>
					Install GitHub App
				</a>
			</section>

			<section className="mb-16">
				<h2 id="permissions" className="text-3xl font-semibold mb-6 text-white">Permissions</h2>
				<p className="text-white/60 mb-6 max-w-2xl">Tigent requires the following permissions:</p>
				<div className="grid md:grid-cols-2 gap-4 max-w-2xl">
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">issues: write</code>
						<p className="text-sm text-white/50 mt-2">To add labels and comments</p>
					</div>
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">pull_requests: write</code>
						<p className="text-sm text-white/50 mt-2">To add labels to PRs</p>
					</div>
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">contents: read</code>
						<p className="text-sm text-white/50 mt-2">To read config file</p>
					</div>
					<div className="p-4 border border-white/10 rounded-xl">
						<code className="text-sm text-accent">metadata: read</code>
						<p className="text-sm text-white/50 mt-2">To access repository info</p>
					</div>
				</div>
			</section>

			<section className="mb-16">
				<h2 id="select-repos" className="text-3xl font-semibold mb-6 text-white">Select repositories</h2>
				<p className="text-white/60 max-w-2xl">
					You can install Tigent on all repositories or select specific ones.
					We recommend starting with a single repository to test the configuration.
				</p>
			</section>

			<div className="flex items-center justify-between pt-8 border-t border-white/10">
				<a href="/docs" className="text-sm text-white/50 hover:text-white transition-colors">← Introduction</a>
				<a href="/docs/quickstart" className="text-sm text-white/50 hover:text-white transition-colors">Quickstart →</a>
			</div>
		</article>
	);
}
