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
		<header className="fixed top-0 left-0 right-0 z-50 px-4">
			<nav
				className={`mx-auto flex items-center justify-between transition-[margin,max-width,background-color,padding,box-shadow,border-radius] duration-500 ${
					scrolled
						? "mt-4 max-w-md bg-fg text-bg px-6 py-3 rounded-full shadow-2xl"
						: "mt-0 max-w-3xl bg-transparent px-4 py-6 rounded-none"
				}`}
			>
				<a href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
					<svg className={`w-4 h-4 transition-colors ${scrolled ? "text-accent" : "text-fg"}`} viewBox="0 0 238.758 238.758" fill="currentColor" aria-hidden="true">
						<path d="M238.389,91.942c-1.28-3.939-5.513-6.096-9.451-4.815l-89.925,29.219l21.004-28.91c2.435-3.351,1.691-8.041-1.66-10.476c-3.352-2.435-8.041-1.691-10.476,1.66l-21.002,28.908V12.976c0-4.142-3.358-7.5-7.5-7.5c-4.142,0-7.5,3.358-7.5,7.5v94.553L90.874,78.619c-2.435-3.351-7.124-4.094-10.476-1.659c-3.351,2.434-4.094,7.124-1.66,10.475l21.004,28.91L9.82,87.127c-3.944-1.281-8.171,0.876-9.451,4.815c-1.28,3.939,0.875,8.171,4.815,9.451l89.924,29.219l-33.987,11.043c-3.939,1.28-6.095,5.511-4.815,9.451c1.03,3.169,3.97,5.184,7.131,5.184c0.768,0,1.549-0.119,2.319-0.369l33.986-11.043l-55.577,76.496c-2.435,3.351-1.691,8.041,1.66,10.476c1.331,0.967,2.874,1.433,4.402,1.433c2.319,0,4.606-1.072,6.074-3.092l55.577-76.496v35.736c0,4.142,3.358,7.5,7.5,7.5c4.142,0,7.5-3.358,7.5-7.5v-35.735l55.577,76.495c1.467,2.02,3.754,3.092,6.074,3.092c1.528,0,3.071-0.466,4.402-1.433c3.351-2.435,4.094-7.125,1.66-10.476l-55.578-76.496l33.985,11.042c0.771,0.251,1.551,0.369,2.319,0.369c3.162,0,6.101-2.015,7.131-5.184c1.28-3.939-0.876-8.171-4.815-9.451l-33.986-11.043l89.925-29.219C237.513,100.113,239.669,95.881,238.389,91.942z" />
					</svg>
					Tigent
				</a>
				<div className="flex items-center gap-5">
					<a
						href="/docs"
						className={`text-sm rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
							scrolled ? "text-bg/70 hover:text-bg" : "text-muted hover:text-fg"
						}`}
					>
						Docs
					</a>
					<a
						href="https://github.com/tigent/app"
						className={`text-sm rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
