"use client";

import { usePathname } from "next/navigation";

const pages: Record<string, { title: string; section: string }> = {
	"/docs": { title: "Introduction", section: "start" },
	"/docs/installation": { title: "Installation", section: "start" },
	"/docs/quickstart": { title: "Quickstart", section: "start" },
	"/docs/config": { title: "Config File", section: "config" },
	"/docs/labels": { title: "Labels", section: "config" },
	"/docs/rules": { title: "Rules", section: "config" },
	"/docs/duplicates": { title: "Duplicates", section: "config" },
	"/docs/themes": { title: "Themes", section: "config" },
	"/docs/webhooks": { title: "Webhooks", section: "integrations" },
	"/docs/slack": { title: "Slack", section: "integrations" },
	"/docs/discord": { title: "Discord", section: "integrations" },
};

const chevron = (
	<svg className="w-3.5 h-3.5 text-white/20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const homeIcon = (
	<svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M8 2L2 7v7h4v-4h4v4h4V7L8 2z" fill="currentColor" />
	</svg>
);

const sectionNames: Record<string, string> = {
	start: "Get Started",
	config: "Configuration",
	integrations: "Integrations",
};

export function Breadcrumb() {
	const pathname = usePathname();
	const page = pages[pathname] || { title: "Docs", section: "start" };

	return (
		<div className="flex items-center">
			<a href="/" className="group flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-lg hover:bg-white/5 transition-colors">
				<div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
					{homeIcon}
				</div>
				<span className="font-medium text-sm text-white">Agent Triage</span>
			</a>
			{chevron}
			<span className="px-2 py-1 text-sm text-white/40">{sectionNames[page.section]}</span>
			{chevron}
			<span className="px-2 py-1 text-sm font-medium text-accent">{page.title}</span>
		</div>
	);
}
