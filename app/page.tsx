import { Nav } from "./components/nav";
import { Pattern } from "./components/pattern";

export default function Page() {
	return (
		<main className="min-h-screen">
			<Nav />

			<section className="pt-40 pb-24 px-8 max-w-3xl mx-auto">
				<p className="font-serif italic text-5xl mb-6">Hey,</p>
				<Pattern />
				<h1 className="text-3xl md:text-4xl font-medium leading-snug mb-4">
					We help <em className="font-serif not-italic">teams</em> triage issues
					with <span className="text-red-500">labels</span>,{" "}
					<span className="text-blue-500">priority</span>,{" "}
					<span className="text-amber-500">duplicates</span>,{" "}
					<span className="text-emerald-500">rules</span> - all done by AI.
				</h1>
				<p className="text-muted italic mb-8">
					speed and accuracy is our superpower
				</p>
				<div className="flex gap-3">
					<a
						href="/docs"
						className="px-5 py-3 text-sm border border-border rounded-lg hover:bg-warm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
					>
						View Config
					</a>
					<a
						href="https://github.com/apps/tigent"
						className="px-5 py-3 text-sm bg-fg text-bg rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
					>
						Install Free →
					</a>
				</div>
			</section>

			<section id="config" className="py-24 px-8">
				<div className="max-w-5xl mx-auto bg-warm rounded-3xl p-12 md:p-16 grid md:grid-cols-2 gap-12 items-center">
					<div>
						<span className="inline-block text-xs font-semibold uppercase tracking-wider text-muted bg-bg px-3 py-1.5 rounded-md mb-4">
							Configuration
						</span>
						<h2 className="text-3xl font-semibold tracking-tight mb-3">
							Simple YAML Config
						</h2>
						<p className="text-muted mb-6">
							Add to{" "}
							<code className="bg-bg px-2 py-1 rounded text-sm">
								.github/tigent.yml
							</code>
						</p>
						<a
							href="/docs/config"
							className="text-sm font-medium underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
						>
							View full documentation →
						</a>
					</div>
					<pre className="bg-fg text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed overflow-x-auto">
						{`confidence: 0.6
theme: mono

labels:
  bug: critical
  security: critical
  feature: medium

rules:
  - match: "crash|broken"
    add: [bug, p1]

duplicates:
  enabled: true
  threshold: 0.8`}
					</pre>
				</div>
			</section>

			<section className="py-24 px-8">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-2xl font-semibold mb-2">Features</h2>
					<p className="text-muted mb-10">What Tigent can do for your team.</p>
					<div className="grid md:grid-cols-3 gap-4">
						<div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
							<div className="flex gap-2 mb-4">
								<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
								</svg>
							</div>
							<p className="font-medium mb-auto">Auto-label issues based on content analysis</p>
							<span className="text-sm text-bg/60 mt-4">Labels</span>
						</div>
						<div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
							<div className="flex gap-2 mb-4">
								<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
								</svg>
							</div>
							<p className="font-medium mb-auto">Detect and link duplicate issues automatically</p>
							<span className="text-sm text-bg/60 mt-4">Duplicates</span>
						</div>
						<div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
							<div className="flex gap-2 mb-4">
								<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
								</svg>
							</div>
							<p className="font-medium mb-auto">Assess PR quality and flag potential issues</p>
							<span className="text-sm text-bg/60 mt-4">PR Review</span>
						</div>
						<div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
							<div className="flex gap-2 mb-4">
								<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
								</svg>
							</div>
							<p className="font-medium mb-auto">Set urgency levels based on keywords and patterns</p>
							<span className="text-sm text-bg/60 mt-4">Priority</span>
						</div>
						<div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
							<div className="flex gap-3 mb-4">
								<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
								</svg>
								<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
								</svg>
								<svg className="w-6 h-6" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
									<path d="M9.186 4.797a2.42 2.42 0 1 0-2.86-2.448h1.178c.929 0 1.682.753 1.682 1.682zm-4.295 7.738h2.613c.929 0 1.682-.753 1.682-1.682V5.58h2.783a.7.7 0 0 1 .682.716v4.294a4.197 4.197 0 0 1-4.093 4.293c-1.618-.04-3-.99-3.667-2.35Zm10.737-9.372a1.674 1.674 0 1 1-3.349 0 1.674 1.674 0 0 1 3.349 0m-2.238 9.488-.12-.002a5.2 5.2 0 0 0 .381-2.07V6.306a1.7 1.7 0 0 0-.15-.725h1.792c.39 0 .707.317.707.707v3.765a2.6 2.6 0 0 1-2.598 2.598z"/>
									<path d="M.682 3.349h6.822c.377 0 .682.305.682.682v6.822a.68.68 0 0 1-.682.682H.682A.68.68 0 0 1 0 10.853V4.03c0-.377.305-.682.682-.682Zm5.206 2.596v-.72h-3.59v.72h1.357V9.66h.87V5.945z"/>
								</svg>
								<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
								</svg>
							</div>
							<p className="font-medium mb-auto">Send notifications to Slack, Discord, and more</p>
							<span className="text-sm text-bg/60 mt-4">Webhooks</span>
						</div>
						<div className="bg-fg text-bg rounded-2xl p-6 flex flex-col min-h-[200px]">
							<div className="flex gap-2 mb-4">
								<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
								</svg>
							</div>
							<p className="font-medium mb-auto">Define custom rules with regex pattern matching</p>
							<span className="text-sm text-bg/60 mt-4">Rules</span>
						</div>
					</div>
				</div>
			</section>

			<footer className="px-8 pb-0">
				<div className="max-w-5xl mx-auto bg-fg text-bg rounded-t-3xl px-8 py-12">
					<div className="flex justify-between items-start mb-8">
						<a href="/" className="font-semibold text-lg tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
							Tigent
						</a>
						<div className="flex gap-6">
							<a href="/docs" className="text-sm text-bg/70 hover:text-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
								Docs
							</a>
							<a href="https://github.com/tigent/app" className="text-sm text-bg/70 hover:text-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
								GitHub
							</a>
							<a href="https://github.com/apps/tigent" className="text-sm text-bg/70 hover:text-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
								Install
							</a>
						</div>
					</div>
					<div className="flex justify-between items-end">
						<p className="text-bg/60 text-sm max-w-xs">
							Automated PR and issue triage for GitHub powered by AI
						</p>
						<a
							href="https://github.com/apps/tigent"
							className="px-5 py-2.5 bg-bg text-fg rounded-full text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
						>
							Get Started
						</a>
					</div>
				</div>
			</footer>
		</main>
	);
}
