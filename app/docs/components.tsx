'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getprevnext } from './config';

const linkIcon = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6.5 9.5l3-3M7 11.5l-1.5 1.5a2.121 2.121 0 01-3-3L4 8.5M9 4.5l1.5-1.5a2.121 2.121 0 013 3L12 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const copyIcon = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect
      x="5"
      y="5"
      width="9"
      height="9"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const checkIcon = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8l4 4 6-8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Anchor({ id }: { id?: string }) {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  if (!id) return null;

  const copy = async () => {
    const url = `${window.location.origin}${pathname}#${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className={`opacity-0 group-hover/heading:opacity-100 p-1 rounded transition-all ${
        copied ? 'text-accent opacity-100' : 'text-white/30 hover:text-white/60'
      }`}
      title="Copy link"
    >
      {copied ? checkIcon : linkIcon}
    </button>
  );
}

export function Header({
  section,
  title,
  description,
  id,
}: {
  section: string;
  title: string;
  description: string;
  id?: string;
}) {
  return (
    <div className="mb-12">
      <p className="text-sm text-white/40 mb-2">{section}</p>
      <div className="flex items-center gap-2 group/heading">
        <h1
          id={id}
          className="text-5xl font-semibold tracking-tight text-white"
        >
          {title}
        </h1>
        <Anchor id={id} />
      </div>
      <p className="text-xl text-white/60 max-w-2xl mt-6">{description}</p>
    </div>
  );
}

export function Code({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group/code ${className}`}>
      <button
        type="button"
        onClick={copy}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
          copied
            ? 'text-accent bg-accent/10'
            : 'text-white/30 hover:text-white/60 hover:bg-white/5 opacity-0 group-hover/code:opacity-100'
        }`}
        title="Copy code"
      >
        {copied ? checkIcon : copyIcon}
      </button>
      <pre className="bg-white/5 border border-white/10 text-white/90 p-8 rounded-2xl text-sm font-mono leading-relaxed overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </pre>
    </div>
  );
}

export function Codeinline({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return (
    <pre
      className={`bg-white/5 border border-white/10 text-white/90 p-4 rounded-xl text-sm font-mono w-fit ${className}`}
    >
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
        <Link
          href={prev.href}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          ← {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          {next.title} →
        </Link>
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
      {title && (
        <h4 className="text-sm font-medium text-white mb-1">{title}</h4>
      )}
      <p className={`text-white/50 ${code ? 'text-xs mt-1' : 'text-sm'}`}>
        {description}
      </p>
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
      <div className="flex items-center gap-2 mb-3 group/heading">
        <h3 id={id} className="text-xl font-semibold text-white">
          {title}
        </h3>
        <Anchor id={id} />
      </div>
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
    <section className="mb-16 overflow-hidden">
      <div className="flex items-center gap-2 mb-6 group/heading">
        <h2 id={id} className="text-3xl font-semibold text-white">
          {title}
        </h2>
        <Anchor id={id} />
      </div>
      {children}
    </section>
  );
}
