'use client';

import { usePathname } from 'next/navigation';
import { getpage } from './config';

const sectionNames: Record<string, string> = {
  start: 'Get Started',
  reference: 'Reference',
};

const chevron = (
  <svg
    className="w-3.5 h-3.5 text-white/20"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const homeIcon = (
  <svg
    className="w-3.5 h-3.5 text-accent"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path d="M8 2L2 7v7h4v-4h4v4h4V7L8 2z" fill="currentColor" />
  </svg>
);

export function Breadcrumb() {
  const pathname = usePathname();
  const page = getpage(pathname);

  return (
    <div className="flex min-w-0 items-center">
      <a
        href="/"
        className="group flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:-ml-3 md:px-3"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10">
          {homeIcon}
        </div>
        <span className="hidden truncate font-medium text-sm text-white md:inline">
          Tigent
        </span>
      </a>
      <div className="hidden items-center md:flex">
        {chevron}
        <span className="px-2 py-1 text-sm text-white/40">
          {sectionNames[page.section]}
        </span>
      </div>
      <div className="hidden md:block">{chevron}</div>
      <span className="truncate px-2 py-1 text-sm font-medium text-accent">
        {page.title}
      </span>
    </div>
  );
}
