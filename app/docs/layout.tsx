import { Sidebar } from "./sidebar";

export default function DocsLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-sm border-b border-border">
				<div className="flex items-center justify-between px-8 py-4">
					<div className="flex items-center gap-6">
						<a href="/" className="font-semibold text-sm tracking-tight">
							Agent Triage
						</a>
						<span className="text-muted text-sm">Docs</span>
					</div>
					<div className="flex items-center gap-4">
						<a
							href="https://github.com/agent-triage/app"
							className="text-sm text-muted hover:text-fg transition-colors"
						>
							GitHub
						</a>
						<a
							href="https://github.com/apps/agent-triage"
							className="px-4 py-2 text-sm bg-fg text-bg rounded-lg hover:opacity-90 transition-opacity"
						>
							Install
						</a>
					</div>
				</div>
			</header>

			<div className="flex pt-16">
				<Sidebar />
				<main className="flex-1 min-w-0 px-8 lg:px-16 pr-8 lg:pr-24">{children}</main>
			</div>
		</div>
	);
}
