export const navigation = [
	{
		title: "Get Started",
		section: "start",
		items: [
			{ title: "Introduction", href: "/docs" },
			{ title: "Installation", href: "/docs/installation" },
			{ title: "Quickstart", href: "/docs/quickstart" },
		],
	},
	{
		title: "Configuration",
		section: "config",
		items: [
			{ title: "Config File", href: "/docs/config" },
			{ title: "Labels", href: "/docs/labels" },
			{ title: "Rules", href: "/docs/rules" },
			{ title: "Duplicates", href: "/docs/duplicates" },
			{ title: "Autorespond", href: "/docs/autorespond" },
			{ title: "Themes", href: "/docs/themes" },
		],
	},
	{
		title: "Integrations",
		section: "integrations",
		items: [
			{ title: "Webhooks", href: "/docs/webhooks" },
			{ title: "Slack", href: "/docs/slack" },
			{ title: "Discord", href: "/docs/discord" },
		],
	},
];

export const pages = navigation.flatMap((group) =>
	group.items.map((item) => ({
		...item,
		section: group.section,
		sectionTitle: group.title,
	}))
);

export function getpage(pathname: string) {
	return pages.find((p) => p.href === pathname) ?? { title: "Docs", href: "/docs", section: "start", sectionTitle: "Get Started" };
}

export function getprevnext(pathname: string) {
	const index = pages.findIndex((p) => p.href === pathname);
	return {
		prev: index > 0 ? pages[index - 1] : null,
		next: index < pages.length - 1 ? pages[index + 1] : null,
	};
}
