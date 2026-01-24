"use client";

import { usePathname } from "next/navigation";

const navigation = [
	{
		title: "Get Started",
		items: [
			{ title: "Introduction", href: "/docs" },
			{ title: "Installation", href: "/docs/installation" },
			{ title: "Quickstart", href: "/docs/quickstart" },
		],
	},
	{
		title: "Configuration",
		items: [
			{ title: "Config File", href: "/docs/config" },
			{ title: "Labels", href: "/docs/labels" },
			{ title: "Rules", href: "/docs/rules" },
			{ title: "Duplicates", href: "/docs/duplicates" },
			{ title: "Themes", href: "/docs/themes" },
		],
	},
	{
		title: "Integrations",
		items: [
			{ title: "Webhooks", href: "/docs/webhooks" },
			{ title: "Slack", href: "/docs/slack" },
			{ title: "Discord", href: "/docs/discord" },
		],
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="hidden md:block w-56 shrink-0 border-r border-white/10 overflow-y-auto">
			<nav className="p-6">
				<div className="space-y-8">
					{navigation.map((group) => (
						<div key={group.title}>
							<h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
								{group.title}
							</h4>
							<ul className="space-y-1">
								{group.items.map((item) => {
									const isactive = pathname === item.href;
									return (
										<li key={item.href}>
											<a
												href={item.href}
												className={`block px-3 py-2 text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
													isactive
														? "bg-accent text-fg font-medium"
														: "text-white/60 hover:text-white hover:bg-white/5"
												}`}
											>
												{item.title}
											</a>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</div>
			</nav>
		</aside>
	);
}
