import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Tigent",
		short_name: "Tigent",
		description: "AI-powered GitHub issue triage",
		start_url: "/",
		display: "standalone",
		background_color: "#fafaf9",
		theme_color: "#0c0a09",
		icons: [
			{
				src: "/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
		],
	};
}
