'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

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
  <svg
    className="w-4 h-4 text-white/30"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 4h12M2 8h12M2 12h12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
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

const arrowUpIcon = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 12V4M4 7l4-4 4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

const feedbackIcon = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 1a7 7 0 100 14A7 7 0 008 1zM8 4v5M8 11v1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export function Toc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  } | null>(null);
  const [thumb, setThumb] = useState<{ top: number; height: number }>({
    top: 0,
    height: 0,
  });
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setReady(false);

    const headings = Array.from(
      document.querySelectorAll('article h2[id], article h3[id]'),
    ) as HTMLElement[];

    const tocItems = headings.map(heading => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName[1] ?? '2'),
    }));

    setItems(tocItems);
    mainRef.current = document.querySelector('main');

    const first = tocItems[0];
    if (first) {
      setActiveIds([first.id]);
    }
    setShowTop(false);

    requestAnimationFrame(() => setReady(true));
  }, [pathname]);

  useEffect(() => {
    if (items.length === 0) return;

    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      const mainRect = mainEl.getBoundingClientRect();
      const viewTop = mainRect.top;
      const viewBottom = mainRect.bottom;
      const active: string[] = [];

      setShowTop(mainEl.scrollTop > 200);

      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const headingTop = rect.top;
        const headingBottom = rect.bottom;

        const isVisible =
          headingBottom > viewTop && headingTop < viewBottom - 100;

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

    mainEl.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => mainEl.removeEventListener('scroll', handleScroll);
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

        const element = container.querySelector(
          `a[href="#${item.id}"]`,
        ) as HTMLElement | null;
        if (!element) continue;

        const styles = getComputedStyle(element);
        const offset = getLineOffset(item.level) + 1;
        const top = element.offsetTop + parseFloat(styles.paddingTop);
        const bottom =
          element.offsetTop +
          element.clientHeight -
          parseFloat(styles.paddingBottom);

        w = Math.max(offset, w);
        h = Math.max(h, bottom);

        d.push(`${i === 0 ? 'M' : 'L'}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);
      }

      setSvg({ path: d.join(' '), width: w + 1, height: h });
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
      const element = container.querySelector(
        `a[href="#${id}"]`,
      ) as HTMLElement | null;
      if (!element) continue;

      const styles = getComputedStyle(element);
      const top = element.offsetTop + parseFloat(styles.paddingTop);
      const bottom =
        element.offsetTop +
        element.clientHeight -
        parseFloat(styles.paddingBottom);

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
      container.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    const container = mainRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const copyAsMarkdown = useCallback(async () => {
    const article = document.querySelector('article');
    if (!article) return;

    const title = article.querySelector('h1')?.textContent || '';
    const description =
      article.querySelector('.mb-12 > p.text-xl')?.textContent || '';
    const sections: string[] = [`# ${title}`, '', description, ''];

    const allSections = article.querySelectorAll('section');
    allSections.forEach(section => {
      const h2 = section.querySelector('h2[id]');
      if (h2) {
        sections.push(`## ${h2.textContent || ''}`);
        sections.push('');
      }

      section.querySelectorAll('p, pre, h3[id]').forEach(el => {
        if (el.tagName === 'H3') {
          sections.push(`### ${el.textContent || ''}`);
        } else if (el.tagName === 'P') {
          const text = el.textContent || '';
          if (text.trim()) sections.push(text);
        } else if (el.tagName === 'PRE') {
          const code = el.textContent || '';
          sections.push('```yaml', code.trim(), '```');
        }
      });
      sections.push('');
    });

    const markdown = sections.join('\n').trim();
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }, []);

  if (items.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="py-6 pr-6">
        <div className="flex items-center gap-3 mb-5">
          {headerIcon}
          <span className="text-xs uppercase tracking-wider text-white/30 font-medium">
            On this page
          </span>
        </div>

        <nav
          className={`relative transition-opacity duration-200 ${ready ? 'opacity-100' : 'opacity-0'}`}
        >
          {svg && (
            <div
              className="absolute left-0 top-0"
              style={{
                width: svg.width,
                height: svg.height,
                maskImage: `url("data:image/svg+xml,${encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`,
                )}")`,
              }}
            >
              <div
                className="absolute w-full bg-accent transition-[top,height] duration-150"
                style={{ top: thumb.top, height: thumb.height }}
              />
            </div>
          )}

          <div ref={containerRef} className="flex flex-col relative">
            {items.map((item, i) => {
              const isActive = activeIds.includes(item.id);
              const offset = getLineOffset(item.level);
              const upperOffset = getLineOffset(
                items[i - 1]?.level ?? item.level,
              );
              const lowerOffset = getLineOffset(
                items[i + 1]?.level ?? item.level,
              );

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={e => {
                    e.preventDefault();
                    scrollTo(item.id);
                  }}
                  className={`relative py-1.5 text-sm rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? 'text-accent font-medium'
                      : 'text-white/40 hover:text-white/70'
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
                      offset !== upperOffset ? 'top-1.5' : ''
                    } ${offset !== lowerOffset ? 'bottom-1.5' : ''}`}
                    style={{ left: offset }}
                  />
                  {item.text}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-1 mt-6 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={copyAsMarkdown}
            className={`p-2 rounded-md transition-all ${
              copied
                ? 'text-accent bg-accent/10'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
            title="Copy as markdown"
          >
            {copied ? checkIcon : copyIcon}
          </button>
          <button
            type="button"
            onClick={copyLink}
            className={`p-2 rounded-md transition-all ${
              linkCopied
                ? 'text-accent bg-accent/10'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
            title="Copy link"
          >
            {linkCopied ? checkIcon : linkIcon}
          </button>
          <a
            href={`https://github.com/tigent/app/issues/new?title=Docs feedback: ${pathname}&body=Page: ${pathname}%0A%0AFeedback:%0A`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md transition-all text-white/40 hover:text-white/70 hover:bg-white/5"
            title="Send feedback"
          >
            {feedbackIcon}
          </a>
          {showTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-md transition-all text-white/40 hover:text-white/70 hover:bg-white/5 animate-in fade-in duration-200"
              title="Scroll to top"
            >
              {arrowUpIcon}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
