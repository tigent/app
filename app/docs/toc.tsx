"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface TocItem {
	id: string;
	text: string;
	level: number;
}

function getLineOffset(depth: number): number {
	return depth >= 3 ? 10 : 0;
}

function getItemOffset(depth: number): number {
	return depth >= 3 ? 26 : 14;
}

const headerIcon = (
	<svg className="w-4 h-4 text-white/30" viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
);

export function Toc() {
	const [items, setItems] = useState<TocItem[]>([]);
	const [activeIds, setActiveIds] = useState<string[]>([]);
	const [svg, setSvg] = useState<{ path: string; width: number; height: number } | null>(null);
	const [thumb, setThumb] = useState<{ top: number; height: number }>({ top: 0, height: 0 });
	const containerRef = useRef<HTMLDivElement>(null);
	const mainRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const headings = Array.from(
			document.querySelectorAll("article h2[id], article h3[id]")
		) as HTMLElement[];

		const tocItems = headings.map((heading) => ({
			id: heading.id,
			text: heading.textContent || "",
			level: parseInt(heading.tagName[1] ?? "2"),
		}));

		setItems(tocItems);
		mainRef.current = document.querySelector("main");

		const first = tocItems[0];
		if (first) {
			setActiveIds([first.id]);
		}
	}, []);

	useEffect(() => {
		if (items.length === 0) return;

		const mainEl = mainRef.current;
		if (!mainEl) return;

		const handleScroll = () => {
			const mainRect = mainEl.getBoundingClientRect();
			const viewTop = mainRect.top;
			const viewBottom = mainRect.bottom;
			const active: string[] = [];

			for (const item of items) {
				const el = document.getElementById(item.id);
				if (!el) continue;

				const rect = el.getBoundingClientRect();
				const headingTop = rect.top;
				const headingBottom = rect.bottom;

				const isVisible = headingBottom > viewTop && headingTop < viewBottom - 100;

				if (isVisible) {
					active.push(item.id);
				}
			}

			if (active.length === 0) {
				let lastAbove: string | null = null;
				for (const item of items) {
					const el = document.getElementById(item.id);
					if (!el) continue;
					const rect = el.getBoundingClientRect();
					if (rect.top < viewTop + 100) {
						lastAbove = item.id;
					}
				}
				const firstItem = items[0];
				setActiveIds(lastAbove ? [lastAbove] : firstItem ? [firstItem.id] : []);
			} else {
				setActiveIds(active);
			}
		};

		mainEl.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => mainEl.removeEventListener("scroll", handleScroll);
	}, [items]);

	useEffect(() => {
		if (!containerRef.current || items.length === 0) return;

		const container = containerRef.current;

		function buildPath() {
			if (container.clientHeight === 0) return;

			let w = 0;
			let h = 0;
			const d: string[] = [];

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (!item) continue;

				const element = container.querySelector(`a[href="#${item.id}"]`) as HTMLElement | null;
				if (!element) continue;

				const styles = getComputedStyle(element);
				const offset = getLineOffset(item.level) + 1;
				const top = element.offsetTop + parseFloat(styles.paddingTop);
				const bottom = element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom);

				w = Math.max(offset, w);
				h = Math.max(h, bottom);

				d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
				d.push(`L${offset} ${bottom}`);
			}

			setSvg({ path: d.join(" "), width: w + 1, height: h });
		}

		const observer = new ResizeObserver(buildPath);
		buildPath();
		observer.observe(container);

		return () => observer.disconnect();
	}, [items]);

	useEffect(() => {
		if (!containerRef.current || activeIds.length === 0) return;

		const container = containerRef.current;
		let upperBound = Infinity;
		let lowerBound = 0;

		for (const id of activeIds) {
			const element = container.querySelector(`a[href="#${id}"]`) as HTMLElement | null;
			if (!element) continue;

			const styles = getComputedStyle(element);
			const top = element.offsetTop + parseFloat(styles.paddingTop);
			const bottom = element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom);

			upperBound = Math.min(upperBound, top);
			lowerBound = Math.max(lowerBound, bottom);
		}

		if (upperBound !== Infinity) {
			setThumb({ top: upperBound, height: lowerBound - upperBound });
		}
	}, [activeIds]);

	const scrollTo = useCallback((id: string) => {
		const element = document.getElementById(id);
		const container = mainRef.current;
		if (element && container) {
			const top = element.offsetTop - 100;
			container.scrollTo({ top, behavior: "smooth" });
		}
	}, []);

	if (items.length === 0) return null;

	return (
		<aside className="hidden xl:block w-56 shrink-0 overflow-y-auto">
			<div className="py-6 pr-6">
				<div className="flex items-center gap-3 mb-5">
					{headerIcon}
					<span className="text-xs uppercase tracking-wider text-white/30 font-medium">On this page</span>
				</div>

				<nav className="relative">
					{svg && (
						<div
							className="absolute left-0 top-0"
							style={{
								width: svg.width,
								height: svg.height,
								maskImage: `url("data:image/svg+xml,${encodeURIComponent(
									`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`
								)}")`,
							}}
						>
							<div
								className="absolute w-full bg-accent transition-all duration-150"
								style={{ top: thumb.top, height: thumb.height }}
							/>
						</div>
					)}

					<div ref={containerRef} className="flex flex-col relative">
						{items.map((item, i) => {
							const isActive = activeIds.includes(item.id);
							const offset = getLineOffset(item.level);
							const upperOffset = getLineOffset(items[i - 1]?.level ?? item.level);
							const lowerOffset = getLineOffset(items[i + 1]?.level ?? item.level);

							return (
								<a
									key={item.id}
									href={`#${item.id}`}
									onClick={(e) => {
										e.preventDefault();
										scrollTo(item.id);
									}}
									className={`relative py-1.5 text-sm transition-colors ${
										isActive ? "text-accent font-medium" : "text-white/40 hover:text-white/70"
									}`}
									style={{ paddingLeft: getItemOffset(item.level) }}
								>
									{offset !== upperOffset && (
										<svg
											viewBox="0 0 16 16"
											className="absolute -top-1.5 left-0 size-4"
											aria-hidden="true"
										>
											<line
												x1={upperOffset}
												y1="0"
												x2={offset}
												y2="12"
												className="stroke-white/10"
												strokeWidth="1"
											/>
										</svg>
									)}
									<div
										className={`absolute inset-y-0 w-px bg-white/10 ${
											offset !== upperOffset ? "top-1.5" : ""
										} ${offset !== lowerOffset ? "bottom-1.5" : ""}`}
										style={{ left: offset }}
									/>
									{item.text}
								</a>
							);
						})}
					</div>
				</nav>
			</div>
		</aside>
	);
}
