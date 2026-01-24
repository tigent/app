"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface TocItem {
	id: string;
	text: string;
	level: number;
}

interface PathData {
	path: string;
	width: number;
	height: number;
}

export function Toc() {
	const [items, setItems] = useState<TocItem[]>([]);
	const [activeIds, setActiveIds] = useState<string[]>([]);
	const [pathData, setPathData] = useState<PathData>({ path: "", width: 20, height: 0 });
	const [thumbStyle, setThumbStyle] = useState({ top: 0, height: 0 });
	const containerRef = useRef<HTMLDivElement>(null);
	const mainRef = useRef<HTMLElement | null>(null);

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
		mainRef.current = document.querySelector("main");

		if (tocItems.length > 0) {
			setActiveIds([tocItems[0].id]);
		}
	}, []);

	useEffect(() => {
		if (items.length === 0 || !containerRef.current) return;

		const generatePath = () => {
			const container = containerRef.current;
			if (!container) return;

			const segments: string[] = [];
			let maxWidth = 0;
			let maxHeight = 0;
			const radius = 6;

			for (let i = 0; i < items.length; i++) {
				const element = container.querySelector(`button[data-id="${items[i].id}"]`) as HTMLElement;
				if (!element) continue;

				const depth = items[i].level;
				const nextDepth = items[i + 1]?.level || depth;
				const prevDepth = items[i - 1]?.level || depth;

				const xOffset = depth >= 3 ? 14 : 2;
				const top = element.offsetTop + 10;
				const bottom = element.offsetTop + element.offsetHeight - 10;

				maxWidth = Math.max(maxWidth, xOffset + 4);
				maxHeight = Math.max(maxHeight, bottom);

				if (i === 0) {
					segments.push(`M ${xOffset} ${top}`);
				} else {
					const prevX = prevDepth >= 3 ? 14 : 2;
					if (prevX !== xOffset) {
						const cornerY = top;
						if (xOffset > prevX) {
							segments.push(`L ${prevX} ${cornerY - radius}`);
							segments.push(`Q ${prevX} ${cornerY}, ${prevX + radius} ${cornerY}`);
							segments.push(`L ${xOffset} ${cornerY}`);
						} else {
							segments.push(`L ${prevX} ${cornerY}`);
							segments.push(`Q ${prevX} ${cornerY}, ${prevX - radius} ${cornerY}`);
							segments.push(`L ${xOffset} ${cornerY}`);
						}
					}
					segments.push(`L ${xOffset} ${top}`);
				}

				segments.push(`L ${xOffset} ${bottom}`);

				if (i < items.length - 1) {
					const nextX = nextDepth >= 3 ? 14 : 2;
					if (nextX !== xOffset) {
						const nextElement = container.querySelector(`button[data-id="${items[i + 1].id}"]`) as HTMLElement;
						if (nextElement) {
							const nextTop = nextElement.offsetTop + 10;
							const cornerY = nextTop;

							if (nextX > xOffset) {
								segments.push(`L ${xOffset} ${cornerY}`);
								segments.push(`Q ${xOffset} ${cornerY}, ${xOffset + radius} ${cornerY}`);
								segments.push(`L ${nextX - radius} ${cornerY}`);
								segments.push(`Q ${nextX} ${cornerY}, ${nextX} ${cornerY + radius}`);
							} else {
								segments.push(`L ${xOffset} ${cornerY}`);
								segments.push(`Q ${xOffset} ${cornerY}, ${xOffset - radius} ${cornerY}`);
								segments.push(`L ${nextX + radius} ${cornerY}`);
								segments.push(`Q ${nextX} ${cornerY}, ${nextX} ${cornerY + radius}`);
							}
						}
					}
				}
			}

			setPathData({ path: segments.join(" "), width: maxWidth + 4, height: maxHeight + 10 });
		};

		const timer = setTimeout(generatePath, 50);
		return () => clearTimeout(timer);
	}, [items]);

	useEffect(() => {
		if (items.length === 0 || !mainRef.current) return;

		const container = mainRef.current;

		const handleScroll = () => {
			const visible: string[] = [];

			for (const item of items) {
				const heading = document.getElementById(item.id);
				if (heading) {
					const rect = heading.getBoundingClientRect();
					if (rect.top >= -50 && rect.top <= 300) {
						visible.push(item.id);
					}
				}
			}

			if (visible.length > 0) {
				setActiveIds(visible);
				updateThumb(visible);
			}
		};

		const updateThumb = (ids: string[]) => {
			if (!containerRef.current || ids.length === 0) return;

			const firstEl = containerRef.current.querySelector(`button[data-id="${ids[0]}"]`) as HTMLElement;
			const lastEl = containerRef.current.querySelector(`button[data-id="${ids[ids.length - 1]}"]`) as HTMLElement;

			if (firstEl && lastEl) {
				const top = firstEl.offsetTop + 8;
				const bottom = lastEl.offsetTop + lastEl.offsetHeight - 8;
				setThumbStyle({ top, height: bottom - top });
			}
		};

		container.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => container.removeEventListener("scroll", handleScroll);
	}, [items]);

	const scrollTo = useCallback((id: string) => {
		const element = document.getElementById(id);
		const container = mainRef.current;
		if (element && container) {
			const top = element.offsetTop - 100;
			container.scrollTo({ top, behavior: "smooth" });
		}
	}, []);

	if (items.length === 0) return null;

	const svgMask = `url("data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pathData.width} ${pathData.height}"><path d="${pathData.path}" stroke="black" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
	)}")`;

	return (
		<aside className="hidden xl:block w-56 shrink-0 overflow-y-auto">
			<div ref={containerRef} className="py-6 pr-6">
				<div className="flex items-center gap-3 mb-5">
					<svg className="w-4 h-4 text-white/30" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
					<span className="text-xs uppercase tracking-wider text-white/30 font-medium">On this page</span>
				</div>

				<div className="relative">
					<svg
						className="absolute left-0 top-0 pointer-events-none"
						width={pathData.width}
						height={pathData.height}
						viewBox={`0 0 ${pathData.width} ${pathData.height}`}
						fill="none"
						aria-hidden="true"
					>
						<path
							d={pathData.path}
							stroke="rgba(255,255,255,0.12)"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="none"
						/>
					</svg>

					<div
						className="absolute left-0 top-0 pointer-events-none transition-all duration-300 ease-out"
						style={{
							width: pathData.width,
							height: pathData.height,
							maskImage: svgMask,
							WebkitMaskImage: svgMask,
							maskSize: "100% 100%",
							WebkitMaskSize: "100% 100%",
						}}
					>
						<div
							className="bg-accent transition-all duration-300 ease-out"
							style={{
								width: 2,
								marginLeft: 1,
								marginTop: thumbStyle.top,
								height: thumbStyle.height,
							}}
						/>
					</div>

					<nav className="relative">
						{items.map((item) => {
							const isActive = activeIds.includes(item.id);
							const indent = item.level >= 3 ? 20 : 8;
							return (
								<button
									key={item.id}
									data-id={item.id}
									onClick={() => scrollTo(item.id)}
									className={`block w-full text-left py-2.5 text-sm transition-all duration-200 ${
										isActive
											? "text-accent font-medium"
											: "text-white/40 hover:text-white/70"
									}`}
									style={{ paddingLeft: indent }}
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
