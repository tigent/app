"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface TocItem {
	id: string;
	text: string;
	level: number;
}

export function Toc() {
	const [items, setItems] = useState<TocItem[]>([]);
	const [active, setActive] = useState<string>("");
	const containerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const headings = Array.from(
			document.querySelectorAll("article h2[id], article h3[id]")
		) as HTMLElement[];

		const tocItems = headings.map((heading) => ({
			id: heading.id,
			text: heading.textContent || "",
			level: parseInt(heading.tagName[1]),
		}));

		setItems(tocItems);

		if (tocItems.length > 0) {
			setActive(tocItems[0].id);
		}

		containerRef.current = document.querySelector("main");
	}, []);

	useEffect(() => {
		if (items.length === 0 || !containerRef.current) return;

		const container = containerRef.current;

		const handleScroll = () => {
			const headings = items
				.map((item) => document.getElementById(item.id))
				.filter(Boolean) as HTMLElement[];

			for (const heading of headings) {
				const rect = heading.getBoundingClientRect();
				if (rect.top >= 0 && rect.top <= 200) {
					setActive(heading.id);
					break;
				}
			}
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [items]);

	const scrollTo = useCallback((id: string) => {
		const element = document.getElementById(id);
		const container = containerRef.current;
		if (element && container) {
			const top = element.offsetTop - 100;
			container.scrollTo({ top, behavior: "smooth" });
		}
	}, []);

	if (items.length === 0) return null;

	const activeIndex = items.findIndex((item) => item.id === active);
	const itemHeight = 36;
	const pathHeight = items.length * itemHeight;

	return (
		<aside className="hidden xl:block w-52 shrink-0 overflow-y-auto pr-4">
			<div className="py-6">
				<div className="flex items-center gap-3 mb-5">
					<svg className="w-4 h-4 text-white/30" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
					<span className="text-xs uppercase tracking-wider text-white/30 font-medium">On this page</span>
				</div>

				<div className="relative pl-4">
					<svg
						className="absolute left-0 top-0"
						width="8"
						height={pathHeight}
						viewBox={`0 0 8 ${pathHeight}`}
						fill="none"
						aria-hidden="true"
					>
						<path
							d={generateCurvyPath(items.length, itemHeight)}
							stroke="rgba(255,255,255,0.15)"
							strokeWidth="1.5"
							strokeLinecap="round"
							fill="none"
						/>
					</svg>

					{activeIndex >= 0 && (
						<div
							className="absolute left-0 overflow-hidden transition-all duration-300 ease-out"
							style={{
								top: activeIndex * itemHeight,
								height: itemHeight,
								width: 8,
							}}
						>
							<svg
								width="8"
								height={pathHeight}
								viewBox={`0 0 8 ${pathHeight}`}
								fill="none"
								style={{ transform: `translateY(-${activeIndex * itemHeight}px)` }}
								aria-hidden="true"
							>
								<path
									d={generateCurvyPath(items.length, itemHeight)}
									stroke="var(--color-accent)"
									strokeWidth="2"
									strokeLinecap="round"
									fill="none"
								/>
							</svg>
						</div>
					)}

					<nav className="space-y-0">
						{items.map((item) => {
							const isActive = item.id === active;
							const indent = item.level > 2 ? 12 : 0;
							return (
								<button
									key={item.id}
									onClick={() => scrollTo(item.id)}
									className={`block w-full text-left py-2 pl-3 text-sm transition-all duration-200 ${
										isActive
											? "text-accent font-medium"
											: "text-white/40 hover:text-white/70"
									}`}
									style={{
										paddingLeft: 12 + indent,
										height: itemHeight,
									}}
								>
									{item.text}
								</button>
							);
						})}
					</nav>
				</div>
			</div>
		</aside>
	);
}

function generateCurvyPath(count: number, itemHeight: number): string {
	if (count === 0) return "";

	const segments: string[] = [];
	const x = 4;
	const curve = 4;

	for (let i = 0; i < count; i++) {
		const startY = i * itemHeight + itemHeight / 2;
		const endY = (i + 1) * itemHeight + itemHeight / 2;

		if (i === 0) {
			segments.push(`M ${x} ${startY}`);
		}

		if (i < count - 1) {
			const midY = (startY + endY) / 2;
			segments.push(`C ${x} ${midY - curve}, ${x} ${midY + curve}, ${x} ${endY}`);
		}
	}

	return segments.join(" ");
}
