"use client";

import { usePathname } from "next/navigation";
import { getprevnext } from "./config";

export function Header({
	section,
	title,
	description,
}: {
	section: string;
	title: string;
	description: string;
}) {
	return (
		<div className="mb-12">
			<p className="text-sm text-white/40 mb-2">{section}</p>
			<h1 className="text-5xl font-semibold tracking-tight mb-6 text-white">
				{title}
			</h1>
			<p className="text-xl text-white/60 max-w-2xl">{description}</p>
		</div>
	);
}

export function Code({ children, className = "" }: { children: string; className?: string }) {
	return (
		<pre className={`bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed ${className}`}>
			{children}
		</pre>
	);
}

export function Codeinline({ children, className = "" }: { children: string; className?: string }) {
	return (
		<pre className={`bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono ${className}`}>
			{children}
		</pre>
	);
}

export function Prevnext() {
	const pathname = usePathname();
	const { prev, next } = getprevnext(pathname);

	return (
		<div className="flex items-center justify-between pt-8 border-t border-white/10">
			{prev ? (
				<a
					href={prev.href}
					className="text-sm text-white/50 hover:text-white transition-colors"
				>
					← {prev.title}
				</a>
			) : (
				<span />
			)}
			{next ? (
				<a
					href={next.href}
					className="text-sm text-white/50 hover:text-white transition-colors"
				>
					{next.title} →
				</a>
			) : (
				<span />
			)}
		</div>
	);
}

export function Card({
	title,
	description,
	code,
}: {
	title?: string;
	description: string;
	code?: string;
}) {
	return (
		<div className="p-4 border border-white/10 rounded-xl">
			{code && <code className="text-sm text-accent">{code}</code>}
			{title && <h4 className="text-sm font-medium text-white mb-1">{title}</h4>}
			<p className={`text-white/50 ${code ? "text-xs mt-1" : "text-sm"}`}>{description}</p>
		</div>
	);
}

export function Option({
	id,
	title,
	description,
	children,
}: {
	id: string;
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<h3 id={id} className="text-xl font-semibold mb-3 text-white">
				{title}
			</h3>
			<p className="text-white/60 mb-4">{description}</p>
			{children}
		</div>
	);
}

export function Section({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="mb-16">
			<h2 id={id} className="text-3xl font-semibold mb-6 text-white">
				{title}
			</h2>
			{children}
		</section>
	);
}
