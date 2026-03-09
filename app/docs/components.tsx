'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { getprevnext } from './config';

const linkicon = (
  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6.5 9.5l3-3M7 11.5l-1.5 1.5a2.121 2.121 0 01-3-3L4 8.5M9 4.5l1.5-1.5a2.121 2.121 0 013 3L12 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const copyicon = (
  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

const checkicon = (
  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
  const [copied, setcopied] = useState(false);
  const pathname = usePathname();

  if (!id) return null;

  const copy = async () => {
    const url = `${window.location.origin}${pathname}#${id}`;
    await navigator.clipboard.writeText(url);
    setcopied(true);
    setTimeout(() => setcopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`rounded-full border p-2 transition-all ${
        copied
          ? 'border-accent/40 bg-accent/10 text-accent opacity-100'
          : 'border-white/10 bg-white/5 text-white/30 opacity-0 group-hover/heading:opacity-100 hover:border-white/20 hover:text-white/60'
      }`}
      title="copy link"
    >
      {copied ? checkicon : linkicon}
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
    <header className="mb-14 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(212,228,92,0.2),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0))] px-6 py-8 md:px-8 md:py-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
        <span className="h-2 w-2 rounded-full bg-accent" />
        {section}
      </div>
      <div className="group/heading mt-5 flex items-start gap-3">
        <h1
          id={id}
          className="text-4xl font-semibold tracking-tight text-white md:text-5xl"
        >
          {title}
        </h1>
        <Anchor id={id} />
      </div>
      <p className="mt-4 max-w-5xl text-lg leading-8 text-white/62 md:text-xl">
        {description}
      </p>
    </header>
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
  );
}

export function Note({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-accent/20 bg-accent/10 px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
        {title}
      </p>
      <div className="mt-2 text-sm leading-6 text-white/72">{children}</div>
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
  const [copied, setcopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setcopied(true);
    setTimeout(() => setcopied(false), 2000);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
          tigent.yml
        </p>
        <button
          type="button"
          onClick={copy}
          className={`inline-flex min-h-10 items-center justify-center rounded-xl border px-3 py-0 text-xs font-medium leading-none transition-all ${
            copied
              ? 'border-accent/40 bg-accent/10 text-accent'
              : 'border-white/10 bg-white/5 text-white/45 hover:border-white/20 hover:text-white'
          }`}
          title="copy code"
        >
          <span className="inline-flex items-center justify-center gap-2 leading-none">
            {copied ? checkicon : copyicon}
            {copied ? 'copied' : 'copy'}
          </span>
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-sm leading-7 text-white/88 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
      className={`inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white/88 ${className}`}
    >
      {children}
    </pre>
  );
}

export function Prevnext() {
  const pathname = usePathname();
  const { prev, next } = getprevnext(pathname);

  return (
    <div className="grid gap-4 border-t border-white/10 pt-8 md:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
            previous
          </p>
          <p className="mt-2 text-base font-medium text-white">{prev.title}</p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05] md:justify-self-end md:w-full"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
            next
          </p>
          <p className="mt-2 text-base font-medium text-white">{next.title}</p>
        </Link>
      ) : (
        <div />
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
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5">
      {code ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          {code}
        </p>
      ) : null}
      {title ? (
        <h4 className="mt-3 text-lg font-semibold text-white">{title}</h4>
      ) : null}
      <p
        className={`leading-6 text-white/62 ${title || code ? 'mt-2 text-sm' : 'text-base'}`}
      >
        {description}
      </p>
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
    <section className="mb-16 border-t border-white/10 pt-8 first:border-t-0 first:pt-0">
      <div className="group/heading mb-6 flex items-center gap-3">
        <h2 id={id} className="text-3xl font-semibold text-white">
          {title}
        </h2>
        <Anchor id={id} />
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
