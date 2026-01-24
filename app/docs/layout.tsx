import { Sidebar } from "./sidebar";
import { Toc } from "./toc";
import { Breadcrumb } from "./breadcrumb";

export default function DocsLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="h-screen bg-warm p-4 md:p-6 lg:p-8 overflow-hidden">
			<div className="bg-fg rounded-3xl h-full flex flex-col overflow-hidden">
				<header className="shrink-0 bg-fg border-b border-white/10">
					<div className="flex items-center justify-between px-6 md:px-8 py-4">
						<Breadcrumb />
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

				<div className="flex flex-1 min-h-0">
					<Sidebar />
					<main className="flex-1 min-w-0 px-6 md:px-8 lg:px-12 overflow-y-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
						{children}
					</main>
					<Toc />
				</div>
			</div>
		</div>
	);
}
