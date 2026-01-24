"use client";

import { useEffect, useState } from "react";

export function Nav() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 100);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-500">
			<nav
				className={`mx-auto flex items-center justify-between transition-all duration-500 ${
					scrolled
						? "mt-4 max-w-md bg-fg text-bg px-6 py-3 rounded-full shadow-2xl"
						: "mt-0 max-w-3xl bg-transparent px-4 py-6"
				}`}
			>
				<a href="/" className="font-semibold text-sm tracking-tight">
					Agent Triage
				</a>
				<div className="flex items-center gap-5">
					<a
						href="/docs"
						className={`text-sm transition-colors ${
							scrolled ? "text-bg/70 hover:text-bg" : "text-muted hover:text-fg"
						}`}
					>
						Docs
					</a>
					<a
						href="https://github.com/agent-triage/app"
						className={`text-sm transition-colors ${
							scrolled ? "text-bg/70 hover:text-bg" : "text-muted hover:text-fg"
						}`}
					>
						GitHub
					</a>
				</div>
			</nav>
		</header>
	);
}
