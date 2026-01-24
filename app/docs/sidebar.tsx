"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "./config";

export function Sidebar() {
	const pathname = usePathname();
	const activeRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, [pathname]);

	return (
		<aside className="hidden md:block w-56 shrink-0 border-r border-white/10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<nav className="p-6">
				<div className="space-y-8">
					{navigation.map((group) => (
						<div key={group.title}>
							<h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
								{group.title}
							</h4>
							<ul className="space-y-1">
								{group.items.map((item) => {
									const isactive = pathname === item.href;
									return (
										<li key={item.href}>
											<Link
												ref={isactive ? activeRef : null}
												href={item.href}
												className={`block px-3 py-2 text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
													isactive
														? "bg-accent text-fg font-medium"
														: "text-white/60 hover:text-white hover:bg-white/5"
												}`}
											>
												{item.title}
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</div>
			</nav>
		</aside>
	);
}
