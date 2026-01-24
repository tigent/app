import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "Tigent",
		template: "%s | Tigent",
	},
	description: "Automated PR and issue triage for GitHub powered by AI. Auto-label issues, detect duplicates, and streamline your workflow.",
	keywords: ["github", "automation", "issue triage", "pr labeling", "ai", "bot", "github app"],
	authors: [{ name: "Tigent" }],
	creator: "Tigent",
	metadataBase: new URL("https://tigent.dev"),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://tigent.dev",
		siteName: "Tigent",
		title: "Tigent",
		description: "Automated PR and issue triage for GitHub powered by AI",
		images: [
			{
				url: "/og.png",
				width: 1200,
				height: 630,
				alt: "Tigent - GitHub Issue Triage Bot",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Tigent",
		description: "Automated PR and issue triage for GitHub powered by AI",
		images: ["/og.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body>{children}</body>
		</html>
	);
}
