import { Sidebar } from "./sidebar";

export default function DocsLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-warm p-4 md:p-6 lg:p-8">
			<div className="bg-fg rounded-3xl min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)] overflow-hidden">
				<header className="sticky top-0 z-50 bg-fg/80 backdrop-blur-sm border-b border-white/10">
					<div className="flex items-center justify-between px-6 md:px-8 py-4">
						<div className="flex items-center gap-6">
							<a href="/" className="font-semibold text-sm tracking-tight text-white">
								Agent Triage
							</a>
							<span className="text-white/50 text-sm">Docs</span>
						</div>
						<div className="flex items-center gap-4">
							<a
								href="https://github.com/agent-triage/app"
								className="text-sm text-white/50 hover:text-white transition-colors"
							>
								GitHub
							</a>
							<a
								href="https://github.com/apps/agent-triage"
								className="px-4 py-2 text-sm bg-white text-fg rounded-lg hover:opacity-90 transition-opacity"
							>
								Install
							</a>
						</div>
					</div>
				</header>

				<div className="flex">
					<Sidebar />
					<main className="flex-1 min-w-0 px-6 md:px-8 lg:px-12 pb-12">{children}</main>
				</div>
			</div>
		</div>
	);
}
