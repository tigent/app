import type { MetadataRoute } from "next";
import { pages } from "./docs/config";

export default function sitemap(): MetadataRoute.Sitemap {
	const base = "https://tigent.dev";

	const docpages = pages.map((page) => ({
		url: `${base}${page.href}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: 0.8,
	}));

	return [
		{
			url: base,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		...docpages,
	];
}
