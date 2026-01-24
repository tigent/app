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
		title: "Reference",
		section: "reference",
		items: [
			{ title: "Configuration", href: "/docs/config" },
			{ title: "Labels", href: "/docs/labels" },
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
